// utils/id.js — Sequential ID and code generators (backed by storage counters)
(function () {
  'use strict';

  // Counters are stored under 'stockify.counters' by storage.js
  // We use a lazy accessor to avoid circular dependency at load time.
  function getCounters() {
    return window.Stockify.store.storage.get('counters') || {};
  }
  function saveCounters(c) {
    window.Stockify.store.storage.set('counters', c);
  }

  /**
   * Increment a named counter and return its new value.
   * @param {string} key - Counter name
   * @returns {number}
   */
  function next(key) {
    const counters = getCounters();
    counters[key] = (counters[key] || 0) + 1;
    saveCounters(counters);
    return counters[key];
  }

  /**
   * Peek at a counter without incrementing.
   * @param {string} key
   * @returns {number}
   */
  function peek(key) {
    return getCounters()[key] || 0;
  }

  /**
   * Reset all counters (used during reseed).
   * @param {Object} [initial={}]
   */
  function resetCounters(initial) {
    saveCounters(initial || {});
  }

  // ── Specific ID generators ──

  /** @returns {string} e.g. "usr_001" */
  function userId()       { return 'usr_' + String(next('user')).padStart(3, '0'); }

  /** @returns {string} e.g. "off_001" */
  function officeId()     { return 'off_' + String(next('office')).padStart(3, '0'); }

  /** @returns {string} e.g. "prd_001" */
  function productId()    { return 'prd_' + String(next('product')).padStart(3, '0'); }

  /** @returns {string} e.g. "alc_0001" and code "ALC-0001" */
  function allocationId() {
    const n = next('allocation');
    const pad = String(n).padStart(4, '0');
    return { id: 'alc_' + pad, code: 'ALC-' + pad };
  }

  /** @returns {string} e.g. "mov_00001" */
  function movementId()   { return 'mov_' + String(next('movement')).padStart(5, '0'); }

  /** @returns {string} e.g. "sal_0001" */
  function saleId()       { return 'sal_' + String(next('sale')).padStart(4, '0'); }

  /**
   * Suggest a SKU from product data.
   * @param {string} category - 'smartphone' | 'smartwatch' | 'tablet'
   * @param {string} brand
   * @param {string} name
   * @param {string} [storage]
   * @param {string} [color]
   * @returns {string}
   */
  function suggestSku(category, brand, name, storage, color) {
    const catMap = { smartphone: 'SP', smartwatch: 'SW', tablet: 'TB' };
    const prefix = catMap[category] || 'XX';
    const br = (brand || '').toUpperCase().replace(/\s+/g, '').slice(0, 3);
    const nm = (name  || '').toUpperCase().replace(/\s+/g, '').slice(0, 6);
    const st = storage ? '-' + storage.replace(/\s+/g, '') : '';
    const cl = color   ? '-' + color.toUpperCase().slice(0, 3) : '';
    return prefix + '-' + br + '-' + nm + st + cl;
  }

  window.Stockify.utils.id = {
    next, peek, resetCounters,
    userId, officeId, productId, allocationId, movementId, saleId,
    suggestSku,
  };
})();

