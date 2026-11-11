// services/sales.js — Retail sales, customer returns, and monthly sales targets
(function () {
  'use strict';

  const storage   = window.Stockify.store.storage;
  const selectors = window.Stockify.store.selectors;
  const stockSvc  = window.Stockify.services.stock;
  const auth      = window.Stockify.services.auth;
  const idGen     = window.Stockify.utils.id;
  const events    = window.Stockify.events;

  /**
   * Ensure sale ID counter doesn't collide with existing sales.
   * @returns {string}
   */
  function generateSaleId() {
    const existing = storage.get('sales') || [];
    let id = idGen.saleId();
    // Safety check against collisions
    while (existing.some(function (s) { return s.id === id; })) {
      id = idGen.saleId();
    }
    return id;
  }

  /**
   * Record a retail sale for a store.
   * Can only be executed by a user assigned to that store.
   *
   * @param {Object} data
   * @param {string} data.storeId
   * @param {string} data.productId
   * @param {number} data.qty
   * @param {number} data.unitPrice
   * @param {string} data.payment - 'cash' | 'upi' | 'card'
   * @param {Object} [data.customer] - { name, phone }
   * @returns {Object} recorded sale record
   */
  function recordSale(data) {
    const user = auth.currentUser();
    if (!user) throw new Error('Authentication required.');

    const storeId = data.storeId || user.officeId;
    if (user.role !== 'store' || user.officeId !== storeId) {
      throw new Error('Permission denied: Sales can only be recorded by personnel at their designated retail store.');
    }

    const offices = storage.get('offices') || [];
    const store = offices.find(function (o) { return o.id === storeId; });
    if (!store || store.type !== 'store' || store.active === false) {
      throw new Error('Store is not active or invalid.');
    }

    const products = storage.get('products') || [];
    const product = products.find(function (p) { return p.id === data.productId; });
    if (!product || product.active === false) {
      throw new Error('Product not found or inactive.');
    }

    const qty = parseInt(data.qty, 10);
    if (isNaN(qty) || qty <= 0) {
      throw new Error('Sale quantity must be a positive integer.');
    }

    // Check store physical stock (Stock never goes negative!)
    const currentStock = stockSvc.getStock(storeId, product.id);
    if (currentStock < qty) {
      throw new Error(
        'Insufficient stock at ' + store.name + '. Available: ' + currentStock + ' units, Requested: ' + qty
      );
    }

    const unitPrice = parseFloat(data.unitPrice);
    if (isNaN(unitPrice) || unitPrice < 0) {
      throw new Error('Invalid unit price.');
    }

    const validPayments = ['cash', 'upi', 'card'];
    const payment = validPayments.includes(data.payment) ? data.payment : 'cash';

    const customer = {
      name: (data.customer && data.customer.name) ? String(data.customer.name).trim() : 'Walk-in Customer',
      phone: (data.customer && data.customer.phone) ? String(data.customer.phone).trim() : '',
    };

    const saleId = generateSaleId();

    // 1. Deduct stock and log movement
    stockSvc.adjust(
      storeId,
      product.id,
      -qty,
      {
        type: 'sale',
        refType: 'sale',
        refId: saleId,
        fromId: storeId,
        toId: null,
        by: user.id,
      }
    );

    // 2. Record sale
    const saleRecord = {
      id: saleId,
      storeId: storeId,
      productId: product.id,
      qty: qty,
      unitPrice: unitPrice,
      payment: payment,
      customer: customer,
      type: 'sale',
      at: new Date().toISOString(),
      by: user.id,
    };

    const sales = storage.get('sales') || [];
    sales.push(saleRecord);
    storage.set('sales', sales);

    events.emit('sale:recorded', saleRecord);
    events.emit('stock:changed');

    return saleRecord;
  }

  /**
   * Process a customer return for an existing sale.
   * Restores inventory to the store and logs a return movement.
   *
   * @param {Object} data
   * @param {string} data.saleId
   * @param {number} data.qty
   * @param {string} [data.reason]
   * @returns {Object} return record
   */
  function recordReturn(data) {
    const user = auth.currentUser();
    if (!user) throw new Error('Authentication required.');

    const sales = storage.get('sales') || [];
    const originalSale = sales.find(function (s) { return s.id === data.saleId && s.type === 'sale'; });
    if (!originalSale) {
      throw new Error('Original sale transaction not found.');
    }

    if (user.role !== 'store' || user.officeId !== originalSale.storeId) {
      throw new Error('Permission denied: Returns can only be processed at the selling store.');
    }

    const qty = parseInt(data.qty, 10);
    if (isNaN(qty) || qty <= 0) {
      throw new Error('Return quantity must be a positive integer.');
    }

    // Check total already returned on this sale
    const previousReturns = sales.filter(function (s) {
      return s.originalSaleId === originalSale.id && s.type === 'return';
    });
    const totalReturned = previousReturns.reduce(function (sum, r) { return sum + r.qty; }, 0);
    const returnable = originalSale.qty - totalReturned;

    if (qty > returnable) {
      throw new Error(
        'Return quantity exceeds remaining returnable units. Available to return: ' + returnable
      );
    }

    const returnId = generateSaleId();
    const reason = (data.reason || '').trim() || 'Customer return';

    // 1. Restore stock and log return movement
    stockSvc.adjust(
      originalSale.storeId,
      originalSale.productId,
      qty,
      {
        type: 'return',
        refType: 'sale',
        refId: returnId,
        fromId: null,
        toId: originalSale.storeId,
        by: user.id,
      }
    );

    // 2. Record return transaction
    const returnRecord = {
      id: returnId,
      originalSaleId: originalSale.id,
      storeId: originalSale.storeId,
      productId: originalSale.productId,
      qty: qty,
      unitPrice: originalSale.unitPrice,
      payment: originalSale.payment,
      customer: originalSale.customer,
      type: 'return',
      reason: reason,
      at: new Date().toISOString(),
      by: user.id,
    };

    sales.push(returnRecord);
    storage.set('sales', sales);

    events.emit('sale:returned', returnRecord);
    events.emit('stock:changed');

    return returnRecord;
  }

  /**
   * Query sales transactions scoped to user's subtree with optional filters.
   * @param {Object} [filters]
   * @returns {Array<Object>}
   */
  function getSales(filters) {
    const user = auth.currentUser();
    if (!user) return [];

    const subtreeStores = selectors.getStoresInSubtree(user.officeId);
    const storeIds = new Set(subtreeStores.map(function (s) { return s.id; }));

    let sales = storage.get('sales') || [];
    sales = sales.filter(function (s) { return storeIds.has(s.storeId); });

    if (!filters) return sales;

    if (filters.storeId) {
      sales = sales.filter(function (s) { return s.storeId === filters.storeId; });
    }
    if (filters.productId) {
      sales = sales.filter(function (s) { return s.productId === filters.productId; });
    }
    if (filters.type) {
      sales = sales.filter(function (s) { return s.type === filters.type; });
    }
    if (filters.payment) {
      sales = sales.filter(function (s) { return s.payment === filters.payment; });
    }
    if (filters.dateFrom) {
      const from = new Date(filters.dateFrom).getTime();
      sales = sales.filter(function (s) { return new Date(s.at).getTime() >= from; });
    }
    if (filters.dateTo) {
      const to = new Date(filters.dateTo).getTime();
      sales = sales.filter(function (s) { return new Date(s.at).getTime() <= to; });
    }

    return sales.sort(function (a, b) {
      return new Date(b.at) - new Date(a.at);
    });
  }

  /**
   * Get monthly sales targets for stores in current user's subtree.
   * @param {string} [month] - 'YYYY-MM', defaults to current month
   * @returns {Array<{ storeId: string, store: Object, month: string, amount: number, achieved: number, percent: number }>}
   */
  function getTargets(month) {
    const user = auth.currentUser();
    if (!user) return [];

    const now = new Date();
    const targetMonth = month || (now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0'));

    const subtreeStores = selectors.getStoresInSubtree(user.officeId);
    const allTargets = storage.get('targets') || [];
    const allSales = storage.get('sales') || [];

    // Calculate achieved sales for each store in this month
    return subtreeStores.map(function (store) {
      const t = allTargets.find(function (row) {
        return row.storeId === store.id && row.month === targetMonth;
      });
      const targetAmount = t ? t.amount : 0;

      // Sum sales in this month for this store
      const achieved = allSales
        .filter(function (s) {
          if (s.storeId !== store.id || s.type !== 'sale') return false;
          const sMonth = s.at.slice(0, 7);
          return sMonth === targetMonth;
        })
        .reduce(function (sum, s) { return sum + (s.qty * s.unitPrice); }, 0);

      const percent = targetAmount > 0 ? Math.round((achieved / targetAmount) * 1000) / 10 : 0;

      return {
        storeId: store.id,
        store: store,
        month: targetMonth,
        amount: targetAmount,
        achieved: achieved,
        percent: percent,
      };
    });
  }

  /**
   * Set or update monthly sales target for a store.
   * Can be performed by HO, Zone, District for stores in their subtree.
   *
   * @param {string} storeId
   * @param {string} month - 'YYYY-MM'
   * @param {number} amount
   */
  function setTarget(storeId, month, amount) {
    const user = auth.currentUser();
    if (!user) throw new Error('Authentication required.');

    if (user.role === 'store') {
      throw new Error('Permission denied: Store personnel cannot modify sales targets.');
    }

    if (!selectors.subtreeIds(user.officeId).includes(storeId)) {
      throw new Error('Permission denied: Store is outside your management scope.');
    }

    const val = parseFloat(amount);
    if (isNaN(val) || val < 0) {
      throw new Error('Target amount must be a positive number.');
    }

    const targets = storage.get('targets') || [];
    const idx = targets.findIndex(function (t) {
      return t.storeId === storeId && t.month === month;
    });

    if (idx !== -1) {
      targets[idx].amount = val;
    } else {
      targets.push({
        storeId: storeId,
        month: month,
        amount: val,
      });
    }

    storage.set('targets', targets);
    events.emit('target:updated', { storeId, month, amount: val });
  }

  window.Stockify.services.sales = {
    recordSale,
    recordReturn,
    getSales,
    getTargets,
    setTarget,
  };
})();
