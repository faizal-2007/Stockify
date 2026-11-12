// services/auth.js — Login, logout, session management, user directory, and password reset governance
(function () {
  'use strict';

  const storage  = window.Stockify.store.storage;
  const events   = window.Stockify.events;

  // Role labels for display
  const ROLE_LABELS = {
    head:     'Head Office Admin',
    zone:     'Zonal Division Director',
    district: 'District Inventory Manager',
    taluk:    'Taluk Logistics Officer',
    store:    'Retail Store Manager',
  };

  /**
   * Get current session user object, or null.
   * @returns {Object|null}
   */
  function getCurrentUser() {
    const userId = storage.get('session');
    if (!userId) return null;
    const users = storage.get('users') || [];
    return users.find(function (u) { return u.id === userId; }) || null;
  }

  /**
   * Check if a session is active.
   * @returns {boolean}
   */
  function isLoggedIn() {
    return getCurrentUser() !== null;
  }

  /**
   * Log in as a user with optional password verification.
   * @param {string} identifier - User ID (e.g. 'usr_001') or Email
   * @param {string} [password] - Optional password; if provided, verified against user's password
   * @throws {Error} If user not found, deactivated, or password mismatch
   */
  function login(identifier, password) {
    const users = storage.get('users') || [];
    const query = String(identifier || '').trim().toLowerCase();
    const user = users.find(function (u) {
      return (u.id && u.id.toLowerCase() === query) ||
             (u.email && u.email.toLowerCase() === query) ||
             (u.name && u.name.toLowerCase() === query);
    });

    if (!user) {
      throw new Error('User not found: ' + identifier);
    }

    if (user.active === false) {
      throw new Error('This employee account has been deactivated. Contact Head Office administrator.');
    }

    if (password !== undefined && password !== null && password !== '') {
      const storedPw = user.password || 'Stockify@123';
      if (password !== storedPw) {
        throw new Error('Incorrect password. Please verify credentials or click "Forgot Password?".');
      }
    }

    storage.set('session', user.id);
    events.emit('session:changed', { userId: user.id });
    return user;
  }

  /**
   * Log out the current user.
   */
  function logout() {
    storage.remove('session');
    events.emit('session:changed', { userId: null });
  }

  /**
   * Get all demo users (for quick selection).
   * @returns {Object[]}
   */
  function getDemoUsers() {
    const users   = storage.get('users') || [];
    const offices = storage.get('offices') || [];
    const officeMap = new Map();
    offices.forEach(function (o) { officeMap.set(o.id, o); });

    return users.map(function (u) {
      const office = officeMap.get(u.officeId);
      return Object.assign({}, u, {
        roleLabel:  ROLE_LABELS[u.role] || u.role,
        officeName: office ? office.name : '',
        officeCity: office ? office.city : '',
      });
    });
  }

  /**
   * Check if the current user has a given role.
   * @param {string} role
   * @returns {boolean}
   */
  function hasRole(role) {
    const user = getCurrentUser();
    return user ? user.role === role : false;
  }

  /**
   * Check if the current user can access a given route.
   * @param {string} route - e.g. '#/inventory/new'
   * @returns {boolean}
   */
  function canAccess(route) {
    const user = getCurrentUser();
    if (!user) return route === '#/login';

    // HO-only routes
    const hoOnly = ['#/inventory/new', '#/stock-in', '#/employees'];
    if (hoOnly.some(function (r) { return route === r; }) && user.role !== 'head') return false;

    // Network route restricted to head, zone, district
    if (route === '#/network' && user.role === 'store') return false;

    // Store-only routes (sales recording)
    if (route === '#/sales' && user.role !== 'store') return true;

    return true;
  }

  // ─────────────────────────────────────────
  // PASSWORD RESET REQUESTS (Employee -> Head Office)
  // ─────────────────────────────────────────

  /**
   * Employee requests a password reset to Head Office.
   * @param {string} identifier - User ID, Email, or Name
   * @param {string} [note]
   * @returns {Object} Created request
   */
  function requestPasswordReset(identifier, note) {
    const users = storage.get('users') || [];
    const offices = storage.get('offices') || [];
    const query = String(identifier || '').trim().toLowerCase();

    const user = users.find(function (u) {
      return (u.id && u.id.toLowerCase() === query) ||
             (u.email && u.email.toLowerCase() === query) ||
             (u.name && u.name.toLowerCase() === query);
    });

    if (!user) {
      throw new Error('Employee account matching "' + identifier + '" was not found.');
    }

    const office = offices.find(function (o) { return o.id === user.officeId; });
    const requests = storage.get('password_requests') || [];

    const reqId = 'pr_' + String(requests.length + 1).padStart(4, '0');
    const newReq = {
      id: reqId,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      role: user.role,
      officeId: user.officeId,
      officeName: office ? office.name : '',
      city: office ? office.city : '',
      note: note ? note.trim() : 'Password reset requested by employee',
      requestedAt: new Date().toISOString(),
      status: 'pending', // 'pending' | 'resolved' | 'rejected'
      resolvedAt: null,
      resolvedBy: null,
      newPassword: null,
    };

    requests.unshift(newReq);
    storage.set('password_requests', requests);
    events.emit('password_request:created', newReq);
    events.emit('alert:updated');

    return newReq;
  }

  /**
   * Get all password reset requests (scoped or full for HO).
   * @returns {Array<Object>}
   */
  function getPasswordResetRequests(filters) {
    const requests = storage.get('password_requests') || [];
    const user = getCurrentUser();
    if (!user) return [];

    let list = requests;
    if (user.role !== 'head') {
      const selectors = window.Stockify.store.selectors;
      const subtree = selectors.subtreeIds(user.officeId);
      list = requests.filter(function (r) { return subtree.includes(r.officeId); });
    }

    if (filters && filters.status && filters.status !== 'all') {
      list = list.filter(function (r) { return r.status === filters.status; });
    }

    return list;
  }

  /**
   * Head Office resolves a password reset request and assigns a new password.
   * @param {string} requestId
   * @param {string} newPassword
   * @returns {Object} Updated request
   */
  function resolvePasswordReset(requestId, newPassword) {
    const user = getCurrentUser();
    if (!user || user.role !== 'head') {
      throw new Error('Permission denied: Only Head Office administrators can reset employee passwords.');
    }

    const pw = String(newPassword || '').trim();
    if (!pw || pw.length < 6) {
      throw new Error('New password must be at least 6 characters.');
    }

    const requests = storage.get('password_requests') || [];
    const req = requests.find(function (r) { return r.id === requestId; });
    if (!req) throw new Error('Password reset request not found: ' + requestId);

    const users = storage.get('users') || [];
    const targetUser = users.find(function (u) { return u.id === req.userId; });
    if (!targetUser) throw new Error('Target user not found for request: ' + req.userId);

    // Update user password
    targetUser.password = pw;
    storage.set('users', users);

    // Update request
    req.status = 'resolved';
    req.resolvedAt = new Date().toISOString();
    req.resolvedBy = user.id;
    req.newPassword = pw;
    storage.set('password_requests', requests);

    events.emit('password_request:resolved', { requestId: requestId, userId: targetUser.id });
    events.emit('user:updated', targetUser);
    events.emit('alert:updated');

    return req;
  }

  /**
   * Head Office rejects a password reset request.
   * @param {string} requestId
   * @param {string} [reason]
   * @returns {Object}
   */
  function rejectPasswordReset(requestId, reason) {
    const user = getCurrentUser();
    if (!user || user.role !== 'head') {
      throw new Error('Permission denied: Only Head Office administrators can reject password reset requests.');
    }

    const requests = storage.get('password_requests') || [];
    const req = requests.find(function (r) { return r.id === requestId; });
    if (!req) throw new Error('Password reset request not found: ' + requestId);

    req.status = 'rejected';
    req.resolvedAt = new Date().toISOString();
    req.resolvedBy = user.id;
    if (reason) req.note = (req.note || '') + ' [Reason: ' + reason + ']';
    storage.set('password_requests', requests);

    events.emit('password_request:rejected', { requestId: requestId });
    events.emit('alert:updated');

    return req;
  }

  // ─────────────────────────────────────────
  // HEAD OFFICE USER & ADMIN MANAGEMENT CRUD
  // ─────────────────────────────────────────

  /**
   * Head Office creates a new employee or admin.
   * @param {Object} data - { name, role, officeId, email, phone, designation, password }
   * @returns {Object} Created user
   */
  function createUser(data) {
    const user = getCurrentUser();
    if (!user || user.role !== 'head') {
      throw new Error('Permission denied: Only Head Office administrators can create employees and admins.');
    }

    const name = (data.name || '').trim();
    if (!name) throw new Error('Employee full name is required.');

    const role = (data.role || '').trim().toLowerCase();
    if (!['head', 'zone', 'district', 'taluk', 'store'].includes(role)) {
      throw new Error('Invalid role. Must be head, zone, district, taluk, or store.');
    }

    const officeId = (data.officeId || '').trim();
    if (!officeId) throw new Error('Office assignment is required.');

    const offices = storage.get('offices') || [];
    const office = offices.find(function (o) { return o.id === officeId; });
    if (!office) throw new Error('Assigned office does not exist: ' + officeId);

    const users = storage.get('users') || [];
    const email = (data.email || '').trim().toLowerCase() ||
      (name.toLowerCase().replace(/[^a-z0-9]+/g, '.') + '.' + office.code.toLowerCase() + '@stockify.in');

    // Check email uniqueness
    if (users.some(function (u) { return u.email && u.email.toLowerCase() === email; })) {
      throw new Error('An employee with email "' + email + '" already exists.');
    }

    const idGen = window.Stockify.utils.id;
    const newId = idGen.userId ? idGen.userId() : ('usr_' + String(users.length + 1).padStart(3, '0'));

    const parts = name.split(/\s+/);
    const initials = parts.length === 1 ? parts[0].slice(0, 2).toUpperCase() : (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();

    const newUser = {
      id: newId,
      name: name,
      role: role,
      officeId: officeId,
      initials: initials,
      email: email,
      phone: (data.phone || '+91 98450 00000').trim(),
      designation: (data.designation || (ROLE_LABELS[role] + ' - ' + office.name)).trim(),
      password: (data.password || 'Stockify@123').trim(),
      active: true,
      createdAt: new Date().toISOString(),
      createdBy: user.id,
    };

    users.push(newUser);
    storage.set('users', users);
    events.emit('user:created', newUser);

    return newUser;
  }

  /**
   * Head Office alters an existing employee or admin (including password).
   * @param {string} userId
   * @param {Object} fields - { name, email, phone, designation, password, role, officeId, active }
   * @returns {Object} Updated user
   */
  function updateUser(userId, fields) {
    const currentUser = getCurrentUser();
    if (!currentUser) throw new Error('Not logged in.');
    if (currentUser.role !== 'head' && currentUser.id !== userId) {
      throw new Error('Permission denied: Only Head Office administrators can alter employee details.');
    }

    const users = storage.get('users') || [];
    const user = users.find(function (u) { return u.id === userId; });
    if (!user) throw new Error('User not found: ' + userId);

    if (fields.name !== undefined) user.name = fields.name.trim();
    if (fields.email !== undefined) user.email = fields.email.trim().toLowerCase();
    if (fields.phone !== undefined) user.phone = fields.phone.trim();
    if (fields.designation !== undefined) user.designation = fields.designation.trim();
    if (fields.password !== undefined && fields.password.trim() !== '') {
      user.password = fields.password.trim();
    }

    // Role, office and active changes restricted strictly to HO
    if (currentUser.role === 'head') {
      if (fields.role !== undefined) user.role = fields.role;
      if (fields.officeId !== undefined) user.officeId = fields.officeId;
      if (fields.active !== undefined) user.active = Boolean(fields.active);
    }

    storage.set('users', users);
    events.emit('user:updated', user);

    return user;
  }

  /**
   * Head Office deactivates or deletes an employee account.
   * @param {string} userId
   * @returns {boolean}
   */
  function deleteUser(userId) {
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.role !== 'head') {
      throw new Error('Permission denied: Only Head Office administrators can delete or deactivate employees.');
    }

    if (userId === 'usr_001') {
      throw new Error('The primary Head Office Managing Director (usr_001) cannot be removed.');
    }

    const users = storage.get('users') || [];
    const user = users.find(function (u) { return u.id === userId; });
    if (!user) throw new Error('User not found: ' + userId);

    user.active = false;
    storage.set('users', users);
    events.emit('user:deleted', { userId: userId });

    return true;
  }

  /**
   * Get all employees scoped by current user subtree.
   * @param {Object} [filters] - { search, role, officeId, active }
   * @returns {Array<Object>}
   */
  function getAllEmployees(filters) {
    const currentUser = getCurrentUser();
    if (!currentUser) return [];

    const selectors = window.Stockify.store.selectors;
    const subtree = selectors.subtreeIds(currentUser.officeId);
    const users = storage.get('users') || [];
    const offices = storage.get('offices') || [];
    const officeMap = new Map();
    offices.forEach(function (o) { officeMap.set(o.id, o); });

    let list = users.filter(function (u) { return subtree.includes(u.officeId); });

    const f = filters || {};
    if (f.role && f.role !== 'all') {
      list = list.filter(function (u) { return u.role === f.role; });
    }

    if (f.officeId && f.officeId !== 'all') {
      list = list.filter(function (u) { return u.officeId === f.officeId; });
    }

    if (f.status === 'active') {
      list = list.filter(function (u) { return u.active !== false; });
    } else if (f.status === 'inactive') {
      list = list.filter(function (u) { return u.active === false; });
    }

    if (f.search && f.search.trim()) {
      const q = f.search.trim().toLowerCase();
      list = list.filter(function (u) {
        const off = officeMap.get(u.officeId);
        const offName = off ? off.name.toLowerCase() : '';
        const offCity = off ? off.city.toLowerCase() : '';
        return (u.name && u.name.toLowerCase().includes(q)) ||
               (u.email && u.email.toLowerCase().includes(q)) ||
               (u.id && u.id.toLowerCase().includes(q)) ||
               (u.designation && u.designation.toLowerCase().includes(q)) ||
               (u.phone && u.phone.includes(q)) ||
               offName.includes(q) ||
               offCity.includes(q);
      });
    }

    return list.map(function (u) {
      const off = officeMap.get(u.officeId);
      return Object.assign({}, u, {
        roleLabel: ROLE_LABELS[u.role] || u.role,
        officeName: off ? off.name : '',
        officeCode: off ? off.code : '',
        officeCity: off ? off.city : '',
        officeType: off ? off.type : '',
      });
    });
  }

  window.Stockify.services.auth = {
    getCurrentUser, currentUser: getCurrentUser,
    isLoggedIn, login, logout, getDemoUsers, hasRole, canAccess,
    requestPasswordReset, getPasswordResetRequests, resolvePasswordReset, rejectPasswordReset,
    createUser, updateUser, deleteUser, getAllEmployees,
    ROLE_LABELS,
  };
})();
