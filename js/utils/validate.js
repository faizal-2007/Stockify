// utils/validate.js — Form validation helpers
(function () {
  'use strict';

  /**
   * Check a value is not empty.
   * @param {*} v
   * @returns {boolean}
   */
  function required(v) {
    if (v === null || v === undefined) return false;
    return String(v).trim().length > 0;
  }

  /**
   * Check a number is positive (> 0).
   * @param {*} v
   * @returns {boolean}
   */
  function positive(v) {
    return Number(v) > 0 && isFinite(Number(v));
  }

  /**
   * Check a number is non-negative (>= 0).
   * @param {*} v
   * @returns {boolean}
   */
  function nonNegative(v) {
    return Number(v) >= 0 && isFinite(Number(v));
  }

  /**
   * Check a number is an integer >= 0.
   * @param {*} v
   * @returns {boolean}
   */
  function wholeNumber(v) {
    const n = Number(v);
    return Number.isInteger(n) && n >= 0;
  }

  /**
   * Check maximum string length.
   * @param {*} v
   * @param {number} max
   * @returns {boolean}
   */
  function maxLen(v, max) {
    return String(v).length <= max;
  }

  /**
   * Check a string matches a pattern.
   * @param {string} v
   * @param {RegExp} pattern
   * @returns {boolean}
   */
  function pattern(v, pat) {
    return pat.test(String(v));
  }

  /**
   * Run all validators for a form field.
   * @param {*} value
   * @param {Array<{ fn: Function, msg: string }>} rules
   * @returns {{ valid: boolean, error: string }}
   */
  function check(value, rules) {
    for (let i = 0; i < rules.length; i++) {
      if (!rules[i].fn(value)) {
        return { valid: false, error: rules[i].msg };
      }
    }
    return { valid: true, error: '' };
  }

  /**
   * Check if a SKU is unique across the products list.
   * @param {string} sku
   * @param {string} [excludeId] - Product id to exclude (for edits)
   * @returns {boolean}
   */
  function uniqueSku(sku, excludeId) {
    const products = window.Stockify.store.storage.get('products') || [];
    return !products.some(function (p) {
      return p.sku === sku && p.id !== excludeId;
    });
  }

  window.Stockify.utils.validate = { required, positive, nonNegative, wholeNumber, maxLen, pattern, check, uniqueSku };
})();

