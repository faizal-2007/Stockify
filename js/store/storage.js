// store/storage.js — All LocalStorage access. Only this file touches localStorage.
(function () {
  'use strict';

  const PREFIX = 'stockify.';
  const SCHEMA_VERSION = 1;
  const QUOTA_WARN_RATIO = 0.80; // warn at 80% of estimated 5 MB

  // Typed errors
  function StorageError(msg) { this.name = 'StorageError'; this.message = msg; }
  StorageError.prototype = Object.create(Error.prototype);

  /**
   * Check estimated LocalStorage usage and warn if near the limit.
   * @returns {boolean} true if safe to write, false if at/over limit
   */
  function checkQuota() {
    try {
      let total = 0;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const val = localStorage.getItem(key);
        total += (key ? key.length : 0) + (val ? val.length : 0);
      }
      // Browser quota ≈ 5 MB = 5*1024*1024 characters (JS strings are UTF-16)
      const estimated = 5 * 1024 * 1024;
      const ratio = total / estimated;

      if (ratio >= 1.0) {
        window.Stockify.components.toast && window.Stockify.components.toast.show(
          'LocalStorage is full. Some data may not be saved. Export and reset data in Settings.',
          'error',
        );
        return false;
      }
      if (ratio >= QUOTA_WARN_RATIO) {
        window.Stockify.components.toast && window.Stockify.components.toast.show(
          'Storage is ' + Math.round(ratio * 100) + '% full. Consider exporting data.',
          'warning',
        );
      }
      return true;
    } catch (e) {
      console.warn('[Storage] Quota check failed:', e);
      return true; // allow write, fail gracefully
    }
  }

  /**
   * Get a value from LocalStorage, parsed as JSON.
   * @param {string} key - Without prefix
   * @param {*} [defaultValue=null]
   * @returns {*}
   */
  function get(key, defaultValue) {
    try {
      const raw = localStorage.getItem(PREFIX + key);
      if (raw === null) return defaultValue !== undefined ? defaultValue : null;
      return JSON.parse(raw);
    } catch (e) {
      console.error('[Storage] Failed to read "' + key + '":', e);
      return defaultValue !== undefined ? defaultValue : null;
    }
  }

  /**
   * Set a value in LocalStorage as JSON.
   * @param {string} key - Without prefix
   * @param {*} value
   * @throws {StorageError} If the write fails
   */
  function set(key, value) {
    try {
      checkQuota();
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
    } catch (e) {
      console.error('[Storage] Failed to write "' + key + '":', e);
      if (window.Stockify.components.toast) {
        window.Stockify.components.toast.show('Failed to save data: ' + e.message, 'error');
      }
      throw new StorageError('Write failed for key "' + key + '": ' + e.message);
    }
  }

  /**
   * Remove a key from LocalStorage.
   * @param {string} key - Without prefix
   */
  function remove(key) {
    try {
      localStorage.removeItem(PREFIX + key);
    } catch (e) {
      console.error('[Storage] Failed to remove "' + key + '":', e);
    }
  }

  /**
   * Clear all stockify.* keys from LocalStorage.
   */
  function clearAll() {
    const toRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(PREFIX)) toRemove.push(key);
    }
    toRemove.forEach(function (k) { localStorage.removeItem(k); });
  }

  /**
   * Check if the app has been seeded (schema version present).
   * @returns {boolean}
   */
  function isSeeded() {
    return get('schemaVersion') === SCHEMA_VERSION;
  }

  /**
   * Mark data as seeded with the current schema version.
   */
  function markSeeded() {
    set('schemaVersion', SCHEMA_VERSION);
  }

  /**
   * Export all stockify.* data as a JSON object.
   * @returns {Object}
   */
  function exportAll() {
    const result = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(PREFIX)) {
        try { result[key] = JSON.parse(localStorage.getItem(key)); }
        catch (e) { result[key] = localStorage.getItem(key); }
      }
    }
    return result;
  }

  /**
   * Import a previously exported data object.
   * @param {Object} data
   */
  function importAll(data) {
    clearAll();
    Object.keys(data).forEach(function (key) {
      try { localStorage.setItem(key, JSON.stringify(data[key])); }
      catch (e) { console.error('[Storage] Import failed for', key, e); }
    });
  }

  /**
   * Get storage statistics: bytes used, estimated max capacity (5MB), and percent.
   * @returns {{ bytesUsed: number, maxBytes: number, percent: number, isWarning: boolean }}
   */
  function getStorageStats() {
    let total = 0;
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const val = localStorage.getItem(key);
        if (key && val) {
          total += (key.length + val.length) * 2; // UTF-16 approximation
        }
      }
    } catch (e) {
      // Ignore
    }
    const maxBytes = 5 * 1024 * 1024; // 5 MB standard web storage
    const ratio = total / maxBytes;
    const percent = Math.min(100, Math.round(ratio * 1000) / 10);
    return {
      bytesUsed: total,
      maxBytes: maxBytes,
      percent: percent,
      isWarning: ratio >= QUOTA_WARN_RATIO,
    };
  }

  window.Stockify.store.storage = {
    get, set, remove, clearAll,
    isSeeded, markSeeded,
    exportAll, importAll,
    checkQuota,
    getStorageStats,
    SCHEMA_VERSION,
    StorageError,
  };
})();

