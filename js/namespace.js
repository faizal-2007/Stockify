// namespace.js — Creates the single global Stockify namespace (must load first)
(function () {
  'use strict';

  // Guard: only create once (in case script is somehow re-evaluated)
  if (window.Stockify) return;

  window.Stockify = {
    // Sub-namespaces populated by later scripts
    store: {},        // storage, seed, selectors
    services: {},     // auth, products, stock, allocations, sales, alerts, activity
    views: {},        // dashboard, inventory, allocations, network, sales, reports, settings
    components: {},   // topbar, sidebar, kpiCard, barChart, gauge, toast, modal, etc.
    utils: {},        // format, dom, image, id, validate, csv

    // App state (non-persistent runtime)
    state: {
      currentRoute: null,
      dropdownOpen: null,  // id of open dropdown, if any
    },

    // Event bus (populated by events.js)
    events: null,

    // Router (populated by router.js)
    router: null,

    VERSION: '1.0.0',
  };
})();

