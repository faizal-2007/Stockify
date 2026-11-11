// services/auth.js — Login, logout, session management
(function () {
  'use strict';

  const storage  = window.Stockify.store.storage;
  const events   = window.Stockify.events;

  // Role labels for display
  const ROLE_LABELS = {
    head:     'Head Office',
    zone:     'Zonal Division',
    district: 'District Office',
    taluk:    'Taluk Office',
    store:    'Store',
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
   * Log in as a specific user (demo: no password needed).
   * @param {string} userId
   * @throws {Error} If user not found
   */
  function login(userId) {
    const users = storage.get('users') || [];
    const user  = users.find(function (u) { return u.id === userId; });
    if (!user) throw new Error('User not found: ' + userId);
    storage.set('session', userId);
    events.emit('session:changed', { userId: userId });
  }

  /**
   * Log out the current user.
   */
  function logout() {
    storage.remove('session');
    events.emit('session:changed', { userId: null });
  }

  /**
   * Get all demo users (for the user picker on login).
   * @returns {Object[]}
   */
  function getDemoUsers() {
    const users   = storage.get('users') || [];
    const offices = storage.get('offices') || [];
    return users.map(function (u) {
      const office = offices.find(function (o) { return o.id === u.officeId; });
      return Object.assign({}, u, {
        roleLabel:  ROLE_LABELS[u.role] || u.role,
        officeName: office ? office.name : '',
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
    const hoOnly = ['#/inventory/new', '#/stock-in'];
    if (hoOnly.some(function (r) { return route === r; }) && user.role !== 'head') return false;

    // Network route restricted to head, zone, district
    if (route === '#/network' && user.role === 'store') return false;

    // Store-only routes (sales recording)
    if (route === '#/sales' && user.role !== 'store') return true; // others can view

    return true;
  }

  window.Stockify.services.auth = {
    getCurrentUser, currentUser: getCurrentUser, isLoggedIn, login, logout, getDemoUsers, hasRole, canAccess,
    ROLE_LABELS,
  };
})();

