// components/sidebar.js — Left icon rail with theme toggle
(function () {
  'use strict';

  const auth    = window.Stockify.services.auth;
  const router  = window.Stockify.router;
  const storage = window.Stockify.store.storage;
  const events  = window.Stockify.events;

  // Icon SVGs (inline, 20x20 on 24 grid)
  const ICONS = {
    dashboard:   '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>',
    inventory:   '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l9 4.5V12M12 2L3 6.5V12M12 2v10m9 2.5-9 4.5m9-4.5V12m-18 2.5 9 4.5m-9-4.5V12m9-4.5L12 12m9-4.5L12 12"/></svg>',
    allocations: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="13" y2="16"/></svg>',
    stockin:     '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12l7 7 7-7"/><rect x="2" y="19" width="20" height="2" rx="1"/></svg>',
    network:     '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
    reports:     '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>',
    sales:       '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',
    users:       '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    sun:         '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>',
    moon:        '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>',
    help:        '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
    logout:      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>',
  };

  // Nav items for rail
  const NAV_ITEMS = [
    { icon: 'dashboard',   route: '#/dashboard',   label: 'Dashboard', roles: null },
    { icon: 'inventory',   route: '#/inventory',   label: 'Inventory', roles: null },
    { icon: 'allocations', route: '#/allocations', label: 'Allocations', roles: null },
    { icon: 'stockin',     route: '#/stock-in',    label: 'Stock In', roles: ['head'] },
    { icon: 'network',     route: '#/network',     label: 'Network', roles: ['head', 'zone', 'district'] },
    { icon: 'reports',     route: '#/reports',     label: 'Reports', roles: null },
    { icon: 'sales',       route: '#/sales',       label: 'Sales', roles: null },
    { icon: 'users',       route: '#/employees',   label: 'Employees & Admins', roles: ['head'] },
  ];

  /**
   * Get the current theme.
   * @returns {'light'|'dark'}
   */
  function getTheme() {
    const settings = storage.get('settings') || {};
    return settings.theme || 'light';
  }

  /**
   * Toggle the theme and persist it.
   */
  function toggleTheme() {
    const settings = storage.get('settings') || {};
    const next = settings.theme === 'dark' ? 'light' : 'dark';
    settings.theme = next;
    storage.set('settings', settings);
    document.documentElement.setAttribute('data-theme', next);
    events.emit('theme:changed', { theme: next });
    updateThemeToggle();
  }

  /**
   * Apply the saved theme to the document.
   */
  function applyTheme() {
    document.documentElement.setAttribute('data-theme', getTheme());
  }

  let sunBtn = null, moonBtn = null;

  function updateThemeToggle() {
    const isDark = getTheme() === 'dark';
    if (sunBtn)  sunBtn.classList.toggle('active', !isDark);
    if (moonBtn) moonBtn.classList.toggle('active', isDark);
  }

  /**
   * Build the side rail element.
   * @returns {HTMLElement}
   */
  function build() {
    const user = auth.getCurrentUser();
    const rail = document.createElement('aside');
    rail.className = 'side-rail';
    rail.setAttribute('aria-label', 'Side navigation');

    // ── Theme toggle pill ──
    const themePill = document.createElement('div');
    themePill.className = 'rail-pill';

    sunBtn = railBtn('sun', 'Light mode', false, toggleTheme);
    moonBtn = railBtn('moon', 'Dark mode', false, toggleTheme);
    updateThemeToggle();

    themePill.appendChild(sunBtn);
    themePill.appendChild(moonBtn);

    // ── Nav pills ──
    const navPill = document.createElement('div');
    navPill.className = 'rail-nav';
    navPill.setAttribute('role', 'navigation');
    navPill.setAttribute('aria-label', 'Icon navigation');

    NAV_ITEMS.forEach(function (item) {
      if (user && item.roles && !item.roles.includes(user.role)) return;
      const btn = railBtn(item.icon, item.label, false, function () {
        router.navigate(item.route);
      });
      btn.setAttribute('data-route', item.route);
      btn.setAttribute('aria-current', 'false');
      navPill.appendChild(btn);
    });

    // ── Bottom pill (help + logout) ──
    const bottomPill = document.createElement('div');
    bottomPill.className = 'rail-bottom';

    const helpBtn = railBtn('help', 'Help', false, function () {
      window.Stockify.components.toast.info('Help documentation coming soon.');
    });
    const logoutBtn = railBtn('logout', 'Logout', false, function () {
      auth.logout();
      window.location.href = 'login.html';
    });

    bottomPill.appendChild(helpBtn);
    bottomPill.appendChild(logoutBtn);

    rail.appendChild(themePill);
    rail.appendChild(navPill);
    rail.appendChild(bottomPill);

    return rail;
  }

  /**
   * Create a rail button element.
   * @param {string} iconKey
   * @param {string} tooltip
   * @param {boolean} isActive
   * @param {Function} onClick
   * @returns {HTMLElement}
   */
  function railBtn(iconKey, tooltip, isActive, onClick) {
    const btn = document.createElement('button');
    btn.className = 'rail-btn' + (isActive ? ' active' : '');
    btn.setAttribute('data-tooltip', tooltip);
    btn.setAttribute('aria-label', tooltip);
    btn.innerHTML = ICONS[iconKey] || '';
    btn.addEventListener('click', onClick);
    return btn;
  }

  window.Stockify.components.sidebar = { build, applyTheme, toggleTheme, getTheme };
})();

