// router.js — Hash-based router with role guards
(function () {
  'use strict';

  const auth  = window.Stockify.services.auth;
  const views = window.Stockify.views;

  // The <main> element where views are rendered
  let container = null;

  // Route definitions: pattern, view factory, roles allowed (null = all authed)
  const ROUTES = [
    { pattern: /^#\/login$/,                     view: 'login',          public: true  },
    { pattern: /^#\/dashboard$/,                 view: 'dashboard',      roles: null   },
    { pattern: /^#\/inventory\/new$/,            view: 'productForm',    roles: ['head'] },
    { pattern: /^#\/inventory\/([^/]+)\/edit$/,  view: 'productForm',    roles: ['head'], param: 'productId' },
    { pattern: /^#\/inventory\/([^/]+)$/,        view: 'productDetail',  roles: null   },
    { pattern: /^#\/inventory$/,                 view: 'inventory',      roles: null   },
    { pattern: /^#\/stock-in$/,                  view: 'stockIn',        roles: ['head'] },
    { pattern: /^#\/allocations\/new$/,          view: 'allocationForm', roles: ['head','zone','district'] },
    { pattern: /^#\/allocations\/request$/,      view: 'allocationForm', roles: ['zone','district','store'] },
    { pattern: /^#\/allocations\/([^/]+)$/,      view: 'allocationDetail',roles: null, param: 'allocationId' },
    { pattern: /^#\/allocations$/,               view: 'allocations',    roles: null   },
    { pattern: /^#\/network\/([^/]+)$/,          view: 'officeDetail',   roles: null, param: 'officeId' },
    { pattern: /^#\/network$/,                   view: 'network',        roles: ['head','zone','district'] },
    { pattern: /^#\/sales$/,                     view: 'sales',          roles: null   },
    { pattern: /^#\/reports$/,                   view: 'reports',        roles: null   },
    { pattern: /^#\/employees$/,                 view: 'employees',      roles: ['head'] },
    { pattern: /^#\/activity$/,                  view: 'activity',       roles: null   },
    { pattern: /^#\/settings$/,                  view: 'settings',       roles: null   },
  ];

  /**
   * Match a hash against all route patterns.
   * @param {string} hash
   * @returns {{ route: Object, params: Object }|null}
   */
  function matchRoute(hash) {
    const cleanHash = (hash || '').split('?')[0];
    for (let i = 0; i < ROUTES.length; i++) {
      const route = ROUTES[i];
      const m     = cleanHash.match(route.pattern);
      if (m) {
        const params = {};
        if (route.param && m[1]) params[route.param] = m[1];
        return { route: route, params: params };
      }
    }
    return null;
  }

  /**
   * Navigate to a hash route programmatically.
   * @param {string} hash - e.g. '#/dashboard'
   */
  function navigate(hash) {
    window.location.hash = hash;
  }

  /**
   * Handle a route change.
   */
  function handleRoute() {
    const hash    = window.location.hash || '#/login';
    const matched = matchRoute(hash);

    if (!matched) {
      // Unknown route: go to dashboard or login
      navigate(auth.isLoggedIn() ? '#/dashboard' : '#/login');
      return;
    }

    const { route, params } = matched;

    // Auth guard
    if (!route.public && !auth.isLoggedIn()) {
      navigate('#/login');
      return;
    }

    // Already logged in → redirect away from login
    if (route.public && auth.isLoggedIn()) {
      navigate('#/dashboard');
      return;
    }

    // Role guard
    if (route.roles && auth.isLoggedIn()) {
      const user = auth.getCurrentUser();
      if (!route.roles.includes(user.role)) {
        navigate('#/dashboard');
        return;
      }
    }

    // Render the view
    renderView(route.view, params, hash);
  }

  /**
   * Render a view into the container.
   * @param {string} viewName
   * @param {Object} params
   * @param {string} hash
   */
  function renderView(viewName, params, hash) {
    window.Stockify.state.currentRoute = hash;

    // Update active state on nav items
    updateNavActive(hash);

    if (!container) return;

    // Clear container
    while (container.firstChild) container.removeChild(container.firstChild);

    // The login view renders in login.html, not here
    if (viewName === 'login') {
      window.location.href = 'login.html';
      return;
    }

    // Show a loading state
    const loading = document.createElement('div');
    loading.className = 'empty-state';
    loading.textContent = 'Loading…';
    container.appendChild(loading);

    // Delegate to the view module
    const viewFn = views[viewName];
    if (typeof viewFn === 'function') {
      try {
        const el = viewFn(params);
        while (container.firstChild) container.removeChild(container.firstChild);
        if (el) container.appendChild(el);
      } catch (e) {
        console.error('[Router] View error for "' + viewName + '":', e);
        while (container.firstChild) container.removeChild(container.firstChild);
        const errEl = document.createElement('div');
        errEl.className = 'empty-state';
        errEl.textContent = 'Error loading page: ' + e.message;
        container.appendChild(errEl);
      }
    } else {
      // View not yet implemented
      while (container.firstChild) container.removeChild(container.firstChild);
      const stub = document.createElement('div');
      stub.className = 'empty-state';
      stub.textContent = 'Page coming soon: ' + viewName;
      container.appendChild(stub);
    }
  }

  /**
   * Update active class on top-bar nav and side-rail nav items.
   * @param {string} hash
   */
  function updateNavActive(hash) {
    const navItems  = document.querySelectorAll('.top-bar__nav-item[data-route]');
    const railBtns  = document.querySelectorAll('.rail-btn[data-route]');

    function activate(el) {
      const route = el.getAttribute('data-route');
      // Exact match or starts-with for sub-routes
      const isActive = hash === route || (route !== '#/dashboard' && hash.startsWith(route));
      el.classList.toggle('active', isActive);
      if (el.getAttribute('aria-current') !== undefined) {
        el.setAttribute('aria-current', isActive ? 'page' : 'false');
      }
    }

    navItems.forEach(activate);
    railBtns.forEach(activate);
  }

  /**
   * Start the router: bind hashchange and handle the current hash.
   * @param {HTMLElement} appContainer - The <main> element
   */
  function start(appContainer) {
    container = appContainer;
    window.addEventListener('hashchange', handleRoute);
    handleRoute(); // handle initial hash
  }

  window.Stockify.router = { navigate, start, handleRoute };
})();

