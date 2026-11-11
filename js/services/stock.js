// services/stock.js — Stock adjustments and movements ledger
(function () {
  'use strict';

  const storage   = window.Stockify.store.storage;
  const selectors = window.Stockify.store.selectors;
  const auth      = window.Stockify.services.auth;
  const idGen     = window.Stockify.utils.id;
  const events    = window.Stockify.events;

  function StockError(msg) { this.name = 'StockError'; this.message = msg; }
  StockError.prototype = Object.create(Error.prototype);

  /**
   * Adjust stock for an office and product. Invariant: Stock never goes negative.
   * @param {string} officeId
   * @param {string} productId
   * @param {number} delta - Positive (add) or negative (deduct)
   * @param {Object} movementInfo - { type, refType, refId, fromId, toId, by }
   * @returns {number} New quantity
   */
  function adjust(officeId, productId, delta, movementInfo) {
    const stock = storage.get('stock') || [];
    let row = stock.find(function (s) { return s.officeId === officeId && s.productId === productId; });

    if (!row) {
      row = { officeId: officeId, productId: productId, qty: 0 };
      stock.push(row);
    }

    const newQty = row.qty + delta;
    if (newQty < 0) {
      throw new StockError('Action rejected: Stock cannot go below 0 (current: ' + row.qty + ', delta: ' + delta + ').');
    }

    row.qty = newQty;
    storage.set('stock', stock);

    // Record movement in append-only ledger
    const movements = storage.get('movements') || [];
    const user = auth.getCurrentUser();
    const movRecord = {
      id: idGen.movementId(),
      at: new Date().toISOString(),
      type: movementInfo.type || 'adjustment',
      productId: productId,
      qty: Math.abs(delta),
      fromId: movementInfo.fromId !== undefined ? movementInfo.fromId : (delta < 0 ? officeId : null),
      toId: movementInfo.toId !== undefined ? movementInfo.toId : (delta > 0 ? officeId : null),
      refType: movementInfo.refType || 'manual',
      refId: movementInfo.refId || null,
      by: movementInfo.by || (user ? user.id : 'system'),
    };

    movements.push(movRecord);
    storage.set('movements', movements);

    events.emit('stock:changed', { officeId: officeId, productId: productId, qty: newQty, movement: movRecord });
    return newQty;
  }

  /**
   * Stock-in from supplier directly into Head Office.
   * Head Office only permission check.
   * @param {string} productId
   * @param {number} qty
   * @param {string} supplierName
   * @param {string} reference
   * @returns {number} New HO stock quantity
   */
  function stockIn(productId, qty, supplierName, reference) {
    const user = auth.getCurrentUser();
    if (!user || user.role !== 'head') {
      throw new StockError('Only Head Office can record stock-in from suppliers.');
    }

    const n = Number(qty);
    if (!Number.isInteger(n) || n <= 0) {
      throw new StockError('Stock-in quantity must be a positive integer.');
    }

    const product = selectors.getProduct(productId);
    if (!product) {
      throw new StockError('Product not found: ' + productId);
    }

    const headOffice = selectors.getAllOffices().find(function (o) { return o.type === 'head'; });
    const hoId = headOffice ? headOffice.id : 'off_001';

    const newQty = adjust(hoId, productId, n, {
      type: 'stock_in',
      refType: 'supplier',
      refId: reference ? reference.trim() : null,
      fromId: null,
      toId: hoId,
      by: user.id,
    });

    return newQty;
  }

  function getStock(officeId, productId) {
    return selectors.getQty(officeId, productId);
  }

  window.Stockify.services.stock = {
    adjust,
    getStock,
    stockIn,
    StockError,
  };
})();

