// views/employees.js — Head Office Admin & Personnel Governance
(function () {
  'use strict';

  const dom       = window.Stockify.utils.dom;
  const format    = window.Stockify.utils.format;
  const auth      = window.Stockify.services.auth;
  const modal     = window.Stockify.components.modal;
  const toast     = window.Stockify.components.toast;
  const storage   = window.Stockify.store.storage;
  const events    = window.Stockify.events;

  const ROLE_LABELS = {
    head: 'Head Office Admin',
    zone: 'Zonal Director',
    district: 'District Manager',
    taluk: 'Taluk Officer',
    store: 'Store Lead',
  };

  const ROLE_BADGES = {
    head: 'badge--primary',
    zone: 'badge--purple',
    district: 'badge--teal',
    taluk: 'badge--taluk',
    store: 'badge--warning',
  };

  /**
   * Render the Employees & Governance view.
   * @returns {HTMLElement}
   */
  function render() {
    const user = auth.getCurrentUser();
    const page = dom.h('div', { className: 'page' });

    if (!user || user.role !== 'head') {
      page.appendChild(dom.h('div', { className: 'card empty-state' },
        dom.h('h2', { style: 'color: var(--danger); font-size: var(--font-size-lg); font-weight: 600;' }, 'Access Restricted'),
        dom.h('p', { style: 'color: var(--text-muted); margin-top: 8px;' },
          'Employee governance and administrative password controls are reserved exclusively for Head Office authority.'
        )
      ));
      return page;
    }

    // Determine initial active tab from hash if any (#/employees?tab=requests)
    const hash = window.location.hash || '';
    let activeTab = hash.indexOf('tab=requests') !== -1 ? 'requests' : 'directory';

    const allOffices = storage.get('offices') || [];
    const offMap = new Map();
    allOffices.forEach(function (o) { offMap.set(o.id, o); });

    // ── Header Row ──
    const headerRow = dom.h('div', { className: 'flex-between flex-wrap gap-4' },
      dom.h('div', {},
        dom.h('h1', { style: 'font-size: var(--font-size-2xl); font-weight: 700; color: var(--text);' }, 'Employee & Admin Governance'),
        dom.h('p', { style: 'font-size: var(--font-size-sm); color: var(--text-muted); margin-top: 4px;' },
          'Head Office command chain administration, credential management, and password reset authorizations'
        )
      ),
      dom.h('button', { className: 'btn btn--primary', id: 'add-employee-btn' },
        dom.icon('plus', 16),
        dom.h('span', {}, 'Add New Employee')
      )
    );
    page.appendChild(headerRow);

    // ── Tab Bar ──
    const tabNav = dom.h('div', { className: 'flex gap-2 flex-wrap pb-2', style: 'border-bottom: 1px solid var(--border);' });
    const dirTabBtn = dom.h('button', {
      className: 'btn btn--sm ' + (activeTab === 'directory' ? 'btn--primary' : 'btn--secondary'),
    }, 'Employee Directory');

    const pendingCount = auth.getPasswordResetRequests({ status: 'pending' }).length;
    const reqTabBtn = dom.h('button', {
      className: 'btn btn--sm ' + (activeTab === 'requests' ? 'btn--primary' : 'btn--secondary'),
    },
      dom.h('span', {}, 'Password Reset Requests'),
      pendingCount > 0 ? dom.h('span', { className: 'badge badge--danger', style: 'margin-left: 6px; padding: 2px 6px;' }, String(pendingCount)) : null
    );

    tabNav.appendChild(dirTabBtn);
    tabNav.appendChild(reqTabBtn);
    page.appendChild(tabNav);

    // ── Content Containers ──
    const directorySection = dom.h('div', { className: 'flex flex-col gap-4' });
    const requestsSection = dom.h('div', { className: 'flex flex-col gap-4' });
    page.appendChild(directorySection);
    page.appendChild(requestsSection);

    function updateTabDisplay() {
      if (activeTab === 'directory') {
        dirTabBtn.className = 'btn btn--sm btn--primary';
        reqTabBtn.className = 'btn btn--sm btn--secondary';
        directorySection.style.display = 'flex';
        requestsSection.style.display = 'none';
        renderDirectory();
      } else {
        dirTabBtn.className = 'btn btn--sm btn--secondary';
        reqTabBtn.className = 'btn btn--sm btn--primary';
        directorySection.style.display = 'none';
        requestsSection.style.display = 'flex';
        renderRequests();
      }
    }

    dirTabBtn.addEventListener('click', function () {
      activeTab = 'directory';
      updateTabDisplay();
    });

    reqTabBtn.addEventListener('click', function () {
      activeTab = 'requests';
      updateTabDisplay();
    });

    // ──────────────────────────────────────────
    // DIRECTORY TAB
    // ──────────────────────────────────────────
    function renderDirectory() {
      directorySection.innerHTML = '';

      // Filter Card
      const filterCard = dom.h('div', { className: 'card flex flex-wrap gap-4 items-center', style: 'padding: var(--sp-4);' });

      // Search input
      const searchWrap = dom.h('div', { className: 'flex flex-col gap-1 flex-1', style: 'min-width: 220px;' });
      searchWrap.appendChild(dom.h('label', { className: 'text-xs text-muted' }, 'Search Personnel'));
      const searchInput = dom.h('input', {
        type: 'text',
        className: 'input',
        placeholder: 'Search by employee name, ID, email, or city...'
      });
      searchWrap.appendChild(searchInput);
      filterCard.appendChild(searchWrap);

      // Role filter
      const roleWrap = dom.h('div', { className: 'flex flex-col gap-1' });
      roleWrap.appendChild(dom.h('label', { className: 'text-xs text-muted' }, 'Authority Tier'));
      const roleSelect = dom.h('select', { className: 'select', style: 'min-width: 170px;' },
        dom.h('option', { value: 'all' }, 'All Authority Tiers'),
        dom.h('option', { value: 'head' }, 'Head Office Admins'),
        dom.h('option', { value: 'zone' }, 'Zonal Directors'),
        dom.h('option', { value: 'district' }, 'District Managers'),
        dom.h('option', { value: 'taluk' }, 'Taluk Officers'),
        dom.h('option', { value: 'store' }, 'Store Leads')
      );
      roleWrap.appendChild(roleSelect);
      filterCard.appendChild(roleWrap);

      // Location filter with Optgroups
      const locWrap = dom.h('div', { className: 'flex flex-col gap-1' });
      locWrap.appendChild(dom.h('label', { className: 'text-xs text-muted' }, 'Location Jurisdiction'));
      const locSelect = dom.h('select', { className: 'select', style: 'min-width: 200px;' });
      locSelect.appendChild(dom.h('option', { value: '' }, 'All Locations (' + allOffices.length + ')'));

      const groups = [
        { type: 'head', label: 'Head Office' },
        { type: 'zone', label: 'Zonal Divisions' },
        { type: 'district', label: 'District Offices' },
        { type: 'taluk', label: 'Taluk Offices' },
        { type: 'store', label: 'Retail Stores' }
      ];

      groups.forEach(function (g) {
        const groupOffices = allOffices.filter(function (o) { return o.type === g.type; });
        if (groupOffices.length > 0) {
          const optgroup = dom.h('optgroup', { label: g.label + ' (' + groupOffices.length + ')' });
          groupOffices.forEach(function (o) {
            optgroup.appendChild(dom.h('option', { value: o.id }, o.name + (o.city ? ' · ' + o.city : '')));
          });
          locSelect.appendChild(optgroup);
        }
      });
      locWrap.appendChild(locSelect);
      filterCard.appendChild(locWrap);

      // Status filter
      const statusWrap = dom.h('div', { className: 'flex flex-col gap-1' });
      statusWrap.appendChild(dom.h('label', { className: 'text-xs text-muted' }, 'Account Status'));
      const statusSelect = dom.h('select', { className: 'select' },
        dom.h('option', { value: 'all' }, 'All Statuses'),
        dom.h('option', { value: 'active' }, 'Active Accounts'),
        dom.h('option', { value: 'inactive' }, 'Deactivated Accounts')
      );
      statusWrap.appendChild(statusSelect);
      filterCard.appendChild(statusWrap);

      directorySection.appendChild(filterCard);

      // Stats KPI strip
      const statsRow = dom.h('div', { className: 'grid-4' });
      directorySection.appendChild(statsRow);

      // Table Container
      const tableCard = dom.h('div', { className: 'card' });
      const tableWrap = dom.h('div', { className: 'table-wrap' });
      tableCard.appendChild(tableWrap);
      directorySection.appendChild(tableCard);

      function refreshDirectoryList() {
        tableWrap.innerHTML = '';
        statsRow.innerHTML = '';

        const filters = {
          role: roleSelect.value,
          officeId: locSelect.value,
          status: statusSelect.value,
          search: searchInput.value
        };

        const employees = auth.getAllEmployees(filters);
        const allEmp = auth.getAllEmployees({});

        // KPIs
        statsRow.appendChild(createSummaryCard('Total Employees', format.number(allEmp.length), 'Full network personnel roster'));
        statsRow.appendChild(createSummaryCard('Filtered Results', format.number(employees.length), 'Matching current query'));
        statsRow.appendChild(createSummaryCard('Active Accounts', format.number(allEmp.filter(function (e) { return e.active !== false; }).length), 'Credentials active for login'));
        statsRow.appendChild(createSummaryCard('Pending Resets', format.number(pendingCount), 'Awaiting Head Office action'));

        if (employees.length === 0) {
          tableWrap.appendChild(dom.h('div', { className: 'card empty-state' }, 'No employees found matching the filters.'));
          return;
        }

        const table = dom.h('table', { className: 'table' });
        table.appendChild(dom.h('thead', {},
          dom.h('tr', {},
            dom.h('th', {}, 'Emp ID'),
            dom.h('th', {}, 'Employee Details'),
            dom.h('th', {}, 'Tier / Role'),
            dom.h('th', {}, 'Office & Location'),
            dom.h('th', {}, 'Contact Info'),
            dom.h('th', { style: 'text-align: center;' }, 'Status'),
            dom.h('th', { style: 'text-align: right;' }, 'Governance Actions')
          )
        ));

        const tbody = dom.h('tbody', {});

        // Show max 100 rows per page for snappy rendering if no specific filter
        const displayList = employees.slice(0, 100);

        displayList.forEach(function (emp) {
          const off = offMap.get(emp.officeId);
          const badgeClass = ROLE_BADGES[emp.role] || 'badge--neutral';
          const isActive = emp.active !== false;

          const tr = dom.h('tr', {},
            dom.h('td', { style: 'font-family: monospace; font-size: var(--font-size-xs); font-weight: 600;' }, emp.id),
            dom.h('td', {},
              dom.h('div', { style: 'font-weight: 600; color: var(--text);' }, emp.name),
              dom.h('div', { style: 'font-size: var(--font-size-xs); color: var(--text-muted);' }, emp.designation || ROLE_LABELS[emp.role] || emp.role)
            ),
            dom.h('td', {},
              dom.h('span', { className: 'badge ' + badgeClass }, ROLE_LABELS[emp.role] || emp.role)
            ),
            dom.h('td', {},
              dom.h('div', { style: 'font-weight: 500;' }, off ? off.name : emp.officeId),
              dom.h('div', { style: 'font-size: var(--font-size-xs); color: var(--text-muted);' }, off ? (off.city ? off.city + ' · ' : '') + off.code : '')
            ),
            dom.h('td', {},
              dom.h('div', { style: 'font-size: var(--font-size-sm); color: var(--text);' }, emp.email),
              dom.h('div', { style: 'font-size: var(--font-size-xs); color: var(--text-muted);' }, emp.phone || '-')
            ),
            dom.h('td', { style: 'text-align: center;' },
              dom.h('span', { className: 'badge ' + (isActive ? 'badge--success' : 'badge--danger') }, isActive ? 'Active' : 'Deactivated')
            ),
            dom.h('td', { style: 'text-align: right;' },
              dom.h('div', { className: 'flex gap-2 justify-end' },
                dom.h('button', {
                  className: 'btn btn--xs btn--secondary',
                  title: 'Alter Password',
                  onclick: function () { openChangePasswordModal(emp); }
                },
                  dom.icon('lock', 14),
                  dom.h('span', {}, 'Password')
                ),
                dom.h('button', {
                  className: 'btn btn--xs btn--secondary',
                  title: 'Edit Details',
                  onclick: function () { openEditEmployeeModal(emp, refreshDirectoryList); }
                },
                  dom.icon('edit', 14),
                  dom.h('span', {}, 'Edit')
                ),
                emp.id !== user.id ? dom.h('button', {
                  className: 'btn btn--xs ' + (isActive ? 'btn--ghost' : 'btn--secondary'),
                  style: isActive ? 'color: var(--danger);' : 'color: var(--success);',
                  title: isActive ? 'Deactivate Account' : 'Reactivate Account',
                  onclick: function () { toggleEmployeeStatus(emp, refreshDirectoryList); }
                },
                  isActive ? 'Deactivate' : 'Activate'
                ) : null
              )
            )
          );
          tbody.appendChild(tr);
        });

        table.appendChild(tbody);
        tableWrap.appendChild(table);

        if (employees.length > 100) {
          tableWrap.appendChild(dom.h('div', {
            style: 'padding: 12px; font-size: var(--font-size-xs); color: var(--text-muted); text-align: center; border-top: 1px solid var(--border);'
          }, 'Showing first 100 of ' + employees.length + ' employees. Use search or location filter to narrow down results.'));
        }
      }

      searchInput.addEventListener('input', refreshDirectoryList);
      roleSelect.addEventListener('change', refreshDirectoryList);
      locSelect.addEventListener('change', refreshDirectoryList);
      statusSelect.addEventListener('change', refreshDirectoryList);

      refreshDirectoryList();
    }

    // ──────────────────────────────────────────
    // PASSWORD RESET REQUESTS TAB
    // ──────────────────────────────────────────
    function renderRequests() {
      requestsSection.innerHTML = '';

      const requests = auth.getPasswordResetRequests();
      const usersList = storage.get('users') || [];
      const userMap = new Map();
      usersList.forEach(function (u) { userMap.set(u.id, u); });

      const headerCard = dom.h('div', { className: 'card flex-between flex-wrap gap-4' },
        dom.h('div', {},
          dom.h('h3', { style: 'font-size: var(--font-size-lg); font-weight: 600;' }, 'Incoming Password Reset Requests'),
          dom.h('p', { style: 'font-size: var(--font-size-sm); color: var(--text-muted); margin-top: 2px;' },
            'Employees across divisions, districts, taluks, and stores who have forgotten their credentials submit requests directly to Head Office.'
          )
        ),
        dom.h('div', { className: 'flex gap-2 items-center' },
          dom.h('span', { className: 'badge badge--danger' }, requests.filter(function (r) { return r.status === 'pending'; }).length + ' Pending'),
          dom.h('span', { className: 'badge badge--neutral' }, requests.length + ' Total Requests')
        )
      );
      requestsSection.appendChild(headerCard);

      const tableCard = dom.h('div', { className: 'card' });
      const tableWrap = dom.h('div', { className: 'table-wrap' });
      tableCard.appendChild(tableWrap);
      requestsSection.appendChild(tableCard);

      if (requests.length === 0) {
        tableWrap.appendChild(dom.h('div', { className: 'card empty-state' }, 'No password reset requests submitted.'));
        return;
      }

      const table = dom.h('table', { className: 'table' });
      table.appendChild(dom.h('thead', {},
        dom.h('tr', {},
          dom.h('th', {}, 'Req ID'),
          dom.h('th', {}, 'Employee / Requester'),
          dom.h('th', {}, 'Office Jurisdiction'),
          dom.h('th', {}, 'Submitted At'),
          dom.h('th', {}, 'Employee Note'),
          dom.h('th', { style: 'text-align: center;' }, 'Status'),
          dom.h('th', { style: 'text-align: right;' }, 'Head Office Action')
        )
      ));

      const tbody = dom.h('tbody', {});
      requests.forEach(function (req) {
        const emp = userMap.get(req.userId) || { name: req.userName, email: req.userEmail, role: req.userRole };
        const off = offMap.get(req.officeId);
        const isPending = req.status === 'pending';

        const tr = dom.h('tr', {},
          dom.h('td', { style: 'font-family: monospace; font-size: var(--font-size-xs); font-weight: 600;' }, req.id),
          dom.h('td', {},
            dom.h('div', { style: 'font-weight: 600; color: var(--text);' }, req.userName),
            dom.h('div', { style: 'font-size: var(--font-size-xs); color: var(--text-muted);' }, req.userEmail + ' (' + req.userId + ')')
          ),
          dom.h('td', {},
            dom.h('div', { style: 'font-weight: 500;' }, off ? off.name : req.officeId),
            dom.h('div', { style: 'font-size: var(--font-size-xs); color: var(--text-muted);' }, (off && off.city ? off.city + ' · ' : '') + (off ? off.code : ''))
          ),
          dom.h('td', { style: 'font-size: var(--font-size-sm); color: var(--text-muted);' }, format.dateTime(req.createdAt)),
          dom.h('td', { style: 'font-size: var(--font-size-sm); max-width: 250px;' }, req.note || 'Forgot password, requested reset from Head Office.'),
          dom.h('td', { style: 'text-align: center;' },
            dom.h('span', {
              className: 'badge ' + (req.status === 'resolved' ? 'badge--success' : (req.status === 'rejected' ? 'badge--danger' : 'badge--warning'))
            }, req.status.toUpperCase())
          ),
          dom.h('td', { style: 'text-align: right;' },
            isPending ? dom.h('div', { className: 'flex gap-2 justify-end' },
              dom.h('button', {
                className: 'btn btn--xs btn--primary',
                onclick: function () { openResolveModal(req, renderRequests); }
              }, 'Reset Password'),
              dom.h('button', {
                className: 'btn btn--xs btn--ghost',
                style: 'color: var(--danger);',
                onclick: function () { openRejectModal(req, renderRequests); }
              }, 'Dismiss')
            ) : dom.h('span', { style: 'font-size: var(--font-size-xs); color: var(--text-muted);' },
                req.resolvedAt ? 'Resolved ' + format.date(req.resolvedAt) : 'Closed'
              )
          )
        );
        tbody.appendChild(tr);
      });

      table.appendChild(tbody);
      tableWrap.appendChild(table);
    }

    // ──────────────────────────────────────────
    // MODAL DIALOGS
    // ──────────────────────────────────────────

    // 1. Add Employee Modal
    const addBtn = headerRow.querySelector('#add-employee-btn');
    if (addBtn) {
      addBtn.addEventListener('click', function () {
        openAddEmployeeModal(function () {
          renderDirectory();
        });
      });
    }

    function openAddEmployeeModal(onSaved) {
      const content = dom.h('form', { className: 'flex flex-col gap-4', id: 'add-emp-form' });

      // Name
      const nameGroup = dom.h('div', { className: 'flex flex-col gap-1' });
      nameGroup.appendChild(dom.h('label', { className: 'text-sm font-medium' }, 'Full Name *'));
      const nameInput = dom.h('input', { type: 'text', className: 'input', required: true, placeholder: 'e.g. Ramesh Hegde' });
      nameGroup.appendChild(nameInput);
      content.appendChild(nameGroup);

      // Email & Phone
      const contactRow = dom.h('div', { className: 'grid-2 gap-4' });
      const emailGroup = dom.h('div', { className: 'flex flex-col gap-1' });
      emailGroup.appendChild(dom.h('label', { className: 'text-sm font-medium' }, 'Email Address *'));
      const emailInput = dom.h('input', { type: 'email', className: 'input', required: true, placeholder: 'e.g. ramesh@stockify.in' });
      emailGroup.appendChild(emailInput);
      contactRow.appendChild(emailGroup);

      const phoneGroup = dom.h('div', { className: 'flex flex-col gap-1' });
      phoneGroup.appendChild(dom.h('label', { className: 'text-sm font-medium' }, 'Phone Number'));
      const phoneInput = dom.h('input', { type: 'tel', className: 'input', placeholder: 'e.g. +91 98450 12345' });
      phoneGroup.appendChild(phoneInput);
      contactRow.appendChild(phoneGroup);
      content.appendChild(contactRow);

      // Office Selection (Hierarchical)
      const offGroup = dom.h('div', { className: 'flex flex-col gap-1' });
      offGroup.appendChild(dom.h('label', { className: 'text-sm font-medium' }, 'Assigned Office / Branch *'));
      const offSelect = dom.h('select', { className: 'select', required: true });

      const groups = [
        { type: 'head', label: 'Head Office' },
        { type: 'zone', label: 'Zonal Divisions' },
        { type: 'district', label: 'District Offices' },
        { type: 'taluk', label: 'Taluk Offices' },
        { type: 'store', label: 'Retail Stores' }
      ];
      groups.forEach(function (g) {
        const groupOffices = allOffices.filter(function (o) { return o.type === g.type; });
        if (groupOffices.length > 0) {
          const optgroup = dom.h('optgroup', { label: g.label });
          groupOffices.forEach(function (o) {
            optgroup.appendChild(dom.h('option', { value: o.id, dataset: { type: o.type } }, o.name + (o.city ? ' · ' + o.city : '')));
          });
          offSelect.appendChild(optgroup);
        }
      });
      offGroup.appendChild(offSelect);
      content.appendChild(offGroup);

      // Role & Designation
      const roleRow = dom.h('div', { className: 'grid-2 gap-4' });
      const roleGroup = dom.h('div', { className: 'flex flex-col gap-1' });
      roleGroup.appendChild(dom.h('label', { className: 'text-sm font-medium' }, 'Authority Role *'));
      const roleSelect = dom.h('select', { className: 'select', required: true },
        dom.h('option', { value: 'store' }, 'Store Lead'),
        dom.h('option', { value: 'taluk' }, 'Taluk Officer'),
        dom.h('option', { value: 'district' }, 'District Manager'),
        dom.h('option', { value: 'zone' }, 'Zonal Director'),
        dom.h('option', { value: 'head' }, 'Head Office Admin')
      );
      roleGroup.appendChild(roleSelect);
      roleRow.appendChild(roleGroup);

      // Auto sync role with selected office type
      offSelect.addEventListener('change', function () {
        const selectedOpt = offSelect.options[offSelect.selectedIndex];
        const officeType = selectedOpt ? selectedOpt.dataset.type : null;
        if (officeType && roleSelect.querySelector('option[value="' + officeType + '"]')) {
          roleSelect.value = officeType;
        }
      });

      const desGroup = dom.h('div', { className: 'flex flex-col gap-1' });
      desGroup.appendChild(dom.h('label', { className: 'text-sm font-medium' }, 'Designation Title'));
      const desInput = dom.h('input', { type: 'text', className: 'input', placeholder: 'e.g. Senior Inventory Executive' });
      desGroup.appendChild(desInput);
      roleRow.appendChild(desGroup);
      content.appendChild(roleRow);

      // Password
      const pwdGroup = dom.h('div', { className: 'flex flex-col gap-1' });
      pwdGroup.appendChild(dom.h('label', { className: 'text-sm font-medium' }, 'Initial Account Password'));
      const pwdInput = dom.h('input', { type: 'text', className: 'input', value: 'Stockify@123' });
      pwdGroup.appendChild(pwdInput);
      pwdGroup.appendChild(dom.h('span', { className: 'text-xs text-muted' }, 'Default password: Stockify@123. Can be altered anytime.'));
      content.appendChild(pwdGroup);

      modal.show({
        title: 'Add New Employee / Administrator',
        content: content,
        confirmText: 'Create Account',
        confirmClass: 'btn--primary',
        onConfirm: function () {
          const name = nameInput.value.trim();
          const email = emailInput.value.trim();
          if (!name || !email) {
            toast.show('Full Name and Email are required.', 'error');
            return false;
          }
          try {
            auth.createUser({
              name: name,
              email: email,
              phone: phoneInput.value.trim(),
              officeId: offSelect.value,
              role: roleSelect.value,
              designation: desInput.value.trim() || ROLE_LABELS[roleSelect.value],
              password: pwdInput.value.trim() || 'Stockify@123',
              active: true
            });
            toast.show('Employee ' + name + ' created successfully.', 'success');
            if (onSaved) onSaved();
            return true;
          } catch (err) {
            toast.show('Failed to create employee: ' + err.message, 'error');
            return false;
          }
        }
      });
    }

    // 2. Edit Employee Modal
    function openEditEmployeeModal(emp, onSaved) {
      const content = dom.h('form', { className: 'flex flex-col gap-4' });

      // Name
      const nameGroup = dom.h('div', { className: 'flex flex-col gap-1' });
      nameGroup.appendChild(dom.h('label', { className: 'text-sm font-medium' }, 'Full Name *'));
      const nameInput = dom.h('input', { type: 'text', className: 'input', value: emp.name, required: true });
      nameGroup.appendChild(nameInput);
      content.appendChild(nameGroup);

      // Email & Phone
      const contactRow = dom.h('div', { className: 'grid-2 gap-4' });
      const emailGroup = dom.h('div', { className: 'flex flex-col gap-1' });
      emailGroup.appendChild(dom.h('label', { className: 'text-sm font-medium' }, 'Email Address *'));
      const emailInput = dom.h('input', { type: 'email', className: 'input', value: emp.email || '', required: true });
      emailGroup.appendChild(emailInput);
      contactRow.appendChild(emailGroup);

      const phoneGroup = dom.h('div', { className: 'flex flex-col gap-1' });
      phoneGroup.appendChild(dom.h('label', { className: 'text-sm font-medium' }, 'Phone Number'));
      const phoneInput = dom.h('input', { type: 'tel', className: 'input', value: emp.phone || '' });
      phoneGroup.appendChild(phoneInput);
      contactRow.appendChild(phoneGroup);
      content.appendChild(contactRow);

      // Office Selection
      const offGroup = dom.h('div', { className: 'flex flex-col gap-1' });
      offGroup.appendChild(dom.h('label', { className: 'text-sm font-medium' }, 'Assigned Office'));
      const offSelect = dom.h('select', { className: 'select' });
      const groups = [
        { type: 'head', label: 'Head Office' },
        { type: 'zone', label: 'Zonal Divisions' },
        { type: 'district', label: 'District Offices' },
        { type: 'taluk', label: 'Taluk Offices' },
        { type: 'store', label: 'Retail Stores' }
      ];
      groups.forEach(function (g) {
        const groupOffices = allOffices.filter(function (o) { return o.type === g.type; });
        if (groupOffices.length > 0) {
          const optgroup = dom.h('optgroup', { label: g.label });
          groupOffices.forEach(function (o) {
            const opt = dom.h('option', { value: o.id }, o.name + (o.city ? ' · ' + o.city : ''));
            if (o.id === emp.officeId) opt.selected = true;
            optgroup.appendChild(opt);
          });
          offSelect.appendChild(optgroup);
        }
      });
      offGroup.appendChild(offSelect);
      content.appendChild(offGroup);

      // Role & Designation
      const roleRow = dom.h('div', { className: 'grid-2 gap-4' });
      const roleGroup = dom.h('div', { className: 'flex flex-col gap-1' });
      roleGroup.appendChild(dom.h('label', { className: 'text-sm font-medium' }, 'Authority Role'));
      const roleSelect = dom.h('select', { className: 'select' });
      ['store', 'taluk', 'district', 'zone', 'head'].forEach(function (r) {
        const opt = dom.h('option', { value: r }, ROLE_LABELS[r] || r);
        if (r === emp.role) opt.selected = true;
        roleSelect.appendChild(opt);
      });
      roleGroup.appendChild(roleSelect);
      roleRow.appendChild(roleGroup);

      const desGroup = dom.h('div', { className: 'flex flex-col gap-1' });
      desGroup.appendChild(dom.h('label', { className: 'text-sm font-medium' }, 'Designation Title'));
      const desInput = dom.h('input', { type: 'text', className: 'input', value: emp.designation || '' });
      desGroup.appendChild(desInput);
      roleRow.appendChild(desGroup);
      content.appendChild(roleRow);

      modal.show({
        title: 'Edit Employee: ' + emp.name + ' (' + emp.id + ')',
        content: content,
        confirmText: 'Save Changes',
        confirmClass: 'btn--primary',
        onConfirm: function () {
          try {
            auth.updateUser(emp.id, {
              name: nameInput.value.trim(),
              email: emailInput.value.trim(),
              phone: phoneInput.value.trim(),
              officeId: offSelect.value,
              role: roleSelect.value,
              designation: desInput.value.trim() || ROLE_LABELS[roleSelect.value],
            });
            toast.show('Employee details updated.', 'success');
            if (onSaved) onSaved();
            return true;
          } catch (err) {
            toast.show('Failed to update employee: ' + err.message, 'error');
            return false;
          }
        }
      });
    }

    // 3. Alter Password Modal
    function openChangePasswordModal(emp) {
      const content = dom.h('div', { className: 'flex flex-col gap-4' });
      content.appendChild(dom.h('p', { className: 'text-sm text-muted' },
        'Set a new login password for ' + emp.name + ' (' + emp.id + '). This will take effect immediately across all devices.'
      ));

      const pwdGroup = dom.h('div', { className: 'flex flex-col gap-1' });
      pwdGroup.appendChild(dom.h('label', { className: 'text-sm font-medium' }, 'New Password *'));
      const pwdInput = dom.h('input', {
        type: 'text',
        className: 'input',
        value: 'Stockify@123',
        placeholder: 'Enter new password'
      });
      pwdGroup.appendChild(pwdInput);
      content.appendChild(pwdGroup);

      modal.show({
        title: 'Alter Admin / Employee Password',
        content: content,
        confirmText: 'Update Password',
        confirmClass: 'btn--primary',
        onConfirm: function () {
          const newPwd = pwdInput.value.trim();
          if (!newPwd) {
            toast.show('Password cannot be empty.', 'error');
            return false;
          }
          try {
            auth.updateUser(emp.id, { password: newPwd });
            toast.show('Password for ' + emp.name + ' successfully updated.', 'success');
            return true;
          } catch (err) {
            toast.show('Failed to change password: ' + err.message, 'error');
            return false;
          }
        }
      });
    }

    // 4. Resolve Password Reset Request Modal
    function openResolveModal(req, onResolved) {
      const content = dom.h('div', { className: 'flex flex-col gap-4' });
      content.appendChild(dom.h('div', { className: 'p-3 bg-canvas border rounded text-sm' },
        dom.h('div', { style: 'font-weight: 600;' }, 'Requester: ' + req.userName + ' (' + req.userId + ')'),
        dom.h('div', { style: 'color: var(--text-muted); margin-top: 2px;' }, 'Office: ' + (offMap.get(req.officeId) ? offMap.get(req.officeId).name : req.officeId)),
        dom.h('div', { style: 'color: var(--text-muted); margin-top: 2px;' }, 'Note: ' + (req.note || 'None provided'))
      ));

      const pwdGroup = dom.h('div', { className: 'flex flex-col gap-1' });
      pwdGroup.appendChild(dom.h('label', { className: 'text-sm font-medium' }, 'New Assigned Password *'));
      const pwdInput = dom.h('input', { type: 'text', className: 'input', value: 'Stockify@123' });
      pwdGroup.appendChild(pwdInput);
      content.appendChild(pwdGroup);

      modal.show({
        title: 'Resolve Password Reset: ' + req.id,
        content: content,
        confirmText: 'Reset Password & Close Request',
        confirmClass: 'btn--primary',
        onConfirm: function () {
          const newPwd = pwdInput.value.trim();
          if (!newPwd) {
            toast.show('Password cannot be empty.', 'error');
            return false;
          }
          try {
            auth.resolvePasswordReset(req.id, newPwd);
            toast.show('Password reset and request resolved for ' + req.userName + '.', 'success');
            if (onResolved) onResolved();
            return true;
          } catch (err) {
            toast.show('Failed to resolve request: ' + err.message, 'error');
            return false;
          }
        }
      });
    }

    // 5. Reject Request Modal
    function openRejectModal(req, onRejected) {
      modal.confirm({
        title: 'Dismiss Password Request',
        content: 'Are you sure you want to dismiss the password reset request for ' + req.userName + '?',
        confirmText: 'Dismiss Request',
        confirmClass: 'btn--danger',
        onConfirm: function () {
          try {
            auth.rejectPasswordReset(req.id, 'Dismissed by Head Office Administrator');
            toast.show('Password request dismissed.', 'info');
            if (onRejected) onRejected();
            return true;
          } catch (err) {
            toast.show('Error: ' + err.message, 'error');
            return false;
          }
        }
      });
    }

    // 6. Toggle Employee Status (Activate / Deactivate)
    function toggleEmployeeStatus(emp, onToggled) {
      const willDeactivate = emp.active !== false;
      modal.confirm({
        title: willDeactivate ? 'Deactivate Account' : 'Reactivate Account',
        content: willDeactivate
          ? 'Deactivating ' + emp.name + ' will immediately revoke login access. Their records and activity history will be preserved.'
          : 'Reactivating ' + emp.name + ' will restore their login access with existing credentials.',
        confirmText: willDeactivate ? 'Deactivate' : 'Reactivate',
        confirmClass: willDeactivate ? 'btn--danger' : 'btn--primary',
        onConfirm: function () {
          try {
            auth.updateUser(emp.id, { active: !willDeactivate });
            toast.show('Account for ' + emp.name + (willDeactivate ? ' deactivated.' : ' reactivated.'), 'success');
            if (onToggled) onToggled();
            return true;
          } catch (err) {
            toast.show('Error: ' + err.message, 'error');
            return false;
          }
        }
      });
    }

    function createSummaryCard(label, value, subtitle) {
      return dom.h('div', { className: 'kpi-card' },
        dom.h('div', { className: 'kpi-card__header' },
          dom.h('span', { className: 'kpi-card__label' }, label)
        ),
        dom.h('div', { className: 'kpi-card__value', style: 'font-size: var(--font-size-xl);' }, value),
        dom.h('div', { className: 'kpi-card__footer' }, subtitle)
      );
    }

    // Initial render
    updateTabDisplay();

    return page;
  }

  window.Stockify.views.employees = render;
})();
