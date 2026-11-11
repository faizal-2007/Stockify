// services/activity.js — Enriched activity history scoped by subtree
(function () {
  'use strict';

  const selectors = window.Stockify.store.selectors;
  const storage   = window.Stockify.store.storage;

  /**
   * Get enriched recent activities for a given office's subtree.
   * @param {string} officeId
   * @param {number} [limit=4]
   * @returns {Array<Object>}
   */
  function getRecent(officeId, limit) {
    const rawMovements = selectors.getRecentMovements(officeId, limit || 4);
    const products = storage.get('products') || [];
    const offices  = selectors.getAllOffices();

    const prdMap = {};
    products.forEach(function (p) { prdMap[p.id] = p; });

    const offMap = {};
    offices.forEach(function (o) { offMap[o.id] = o; });

    return rawMovements.map(function (m) {
      const product = m.productId ? prdMap[m.productId] : null;
      const fromOff = m.fromId ? offMap[m.fromId] : null;
      const toOff   = m.toId ? offMap[m.toId] : null;

      let title = 'Inventory Action';
      let detail = '';
      let actionType = m.type || 'stock';

      switch (m.type) {
        case 'stock_in':
          title = 'Stock Added';
          detail = (product ? product.name : 'Products') + ' (' + m.qty + ' units) received at ' + (toOff ? toOff.name : 'HQ');
          break;
        case 'dispatch':
          title = 'Shipment Dispatched';
          detail = m.qty + ' units from ' + (fromOff ? fromOff.name : 'Office') + ' to ' + (toOff ? toOff.name : 'Branch');
          break;
        case 'receive':
          title = 'Shipment Received';
          detail = (toOff ? toOff.name : 'Office') + ' verified ' + m.qty + ' units from ' + (fromOff ? fromOff.name : 'Parent');
          break;
        case 'sale':
          title = 'Sale Recorded';
          detail = m.qty + 'x ' + (product ? product.name : 'Item') + ' at ' + (toOff ? toOff.name : 'Store');
          break;
        case 'return':
          title = 'Return Processed';
          detail = m.qty + 'x ' + (product ? product.name : 'Item') + ' returned at ' + (toOff ? toOff.name : 'Store');
          break;
        case 'discrepancy':
          title = 'Shortage / Discrepancy';
          detail = m.qty + ' units flagged during receipt';
          break;
        default:
          title = 'Stock Movement';
          detail = m.qty + ' units moved';
          break;
      }

      return {
        id: m.id,
        at: m.at,
        type: actionType,
        title: title,
        detail: detail,
        product: product,
        qty: m.qty,
      };
    });
  }

  window.Stockify.services.activity = { getRecent };
})();
