// app.js — Bootstrap: seed check, theme, shell construction, router start
(function () {
  'use strict';

  const storage  = window.Stockify.store.storage;
  const seed     = window.Stockify.store.seed;
  const auth     = window.Stockify.services.auth;
  const topbar   = window.Stockify.components.topbar;
  const sidebar  = window.Stockify.components.sidebar;
  const router   = window.Stockify.router;

  /**
   * Initialise the application:
   * 1. Seed data if not already present.
   * 2. Apply saved theme.
   * 3. Build the app shell (top bar + side rail) if logged in.
   * 4. Start the router.
   */
  function init() {
    // 1. Seed data
    if (!storage.isSeeded()) {
      seed.seed();
    }

    // 2. Apply theme early to prevent flash
    sidebar.applyTheme();

    // 3. If not logged in, let the router handle the redirect
    if (!auth.isLoggedIn()) {
      window.location.hash = '#/login';
      window.location.href = 'login.html';
      return;
    }

    // 4. Build shell
    const appFrame   = document.getElementById('app-frame');
    const appContent = document.getElementById('app-content');

    if (!appFrame || !appContent) {
      console.error('[App] Missing #app-frame or #app-content in index.html');
      return;
    }

    // Insert top bar at the start of app-frame
    const topbarEl = topbar.build();
    appFrame.insertBefore(topbarEl, appFrame.firstChild);

    // The app-body already holds side-rail placeholder and app-content in HTML
    const appBody   = document.getElementById('app-body');
    const railEl    = sidebar.build();
    appBody.insertBefore(railEl, appBody.firstChild);

    // 5. Start router
    router.start(appContent);

    // 6. Keep bell dot in sync with alerts
    updateBellDot();
    window.Stockify.events.on('stock:changed', updateBellDot);
    window.Stockify.events.on('allocation:changed', updateBellDot);
  }

  function updateBellDot() {
    const user = auth.getCurrentUser();
    if (!user) return;
    const sel = window.Stockify.store.selectors;
    const counts = sel.getAlertCounts(user.officeId, user.role);
    const hasAlerts = counts.outOfStock > 0 || counts.pendingRequests > 0 || counts.inTransitLong > 0;
    window.Stockify.components.topbar.updateBellDot(hasAlerts);
  }

  // Run after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

