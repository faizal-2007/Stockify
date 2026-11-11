// events.js — Minimal pub/sub event bus for cross-module communication
(function () {
  'use strict';

  const listeners = {};

  /**
   * Subscribe to an event.
   * @param {string} event - Event name
   * @param {Function} fn - Handler function
   * @returns {Function} Unsubscribe function
   */
  function on(event, fn) {
    if (!listeners[event]) listeners[event] = [];
    listeners[event].push(fn);
    return function off() {
      listeners[event] = listeners[event].filter(function (f) { return f !== fn; });
    };
  }

  /**
   * Publish an event with optional data payload.
   * @param {string} event - Event name
   * @param {*} [data] - Payload passed to all handlers
   */
  function emit(event, data) {
    (listeners[event] || []).forEach(function (fn) {
      try { fn(data); } catch (e) { console.error('[Events] Handler error on "' + event + '":', e); }
    });
  }

  /**
   * Subscribe once — auto-unsubscribes after first fire.
   * @param {string} event
   * @param {Function} fn
   */
  function once(event, fn) {
    const off = on(event, function (data) {
      off();
      fn(data);
    });
  }

  // Known event names (documentation only — not enforced)
  // 'stock:changed'       — { officeId, productId, qty }
  // 'allocation:changed'  — { allocationId }
  // 'sale:recorded'       — { saleId }
  // 'session:changed'     — { userId }
  // 'theme:changed'       — { theme }
  // 'data:reseeded'       — {}

  window.Stockify.events = { on, emit, once };
})();

