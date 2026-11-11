// store/selectors.js — Subtree queries and aggregate computations (read-only)
(function () {
  'use strict';

  const storage = window.Stockify.store.storage;

  /**
   * Get all offices.
   * @returns {Object[]}
   */
  function getAllOffices() {
    return storage.get('offices') || [];
  }

  /**
   * Get one office by id.
   * @param {string} officeId
   * @returns {Object|null}
   */
  function getOffice(officeId) {
    return getAllOffices().find(function (o) { return o.id === officeId; }) || null;
  }

  /**
   * Return the officeId plus all descendant office ids.
   * @param {string} officeId
   * @returns {string[]}
   */
  function subtreeIds(officeId) {
    const all    = getAllOffices();
    const result = [];
    const queue  = [officeId];

    while (queue.length > 0) {
      const current = queue.shift();
      result.push(current);
      all.forEach(function (o) {
        if (o.parentId === current && o.active) queue.push(o.id);
      });
    }
    return result;
  }

  /**
   * Return direct children of an office.
   * @param {string} officeId
   * @returns {Object[]}
   */
  function getChildren(officeId) {
    return getAllOffices().filter(function (o) { return o.parentId === officeId && o.active; });
  }

  /**
   * Return all stores within a subtree.
   * @param {string} officeId
   * @returns {Object[]}
   */
  function getStoresInSubtree(officeId) {
    const ids = subtreeIds(officeId);
    return getAllOffices().filter(function (o) { return o.type === 'store' && ids.includes(o.id); });
  }

  // ── Products ──

  /**
   * Get all active products.
   * @returns {Object[]}
   */
  function getActiveProducts() {
    return (storage.get('products') || []).filter(function (p) { return p.active; });
  }

  /**
   * Get one product by id.
   * @param {string} productId
   * @returns {Object|null}
   */
  function getProduct(productId) {
    return (storage.get('products') || []).find(function (p) { return p.id === productId; }) || null;
  }

  // ── Stock ──

  /**
   * Get all stock rows.
   * @returns {Object[]}
   */
  function getAllStock() {
    return storage.get('stock') || [];
  }

  /**
   * Get qty for a specific office+product pair.
   * @param {string} officeId
   * @param {string} productId
   * @returns {number}
   */
  function getQty(officeId, productId) {
    const row = getAllStock().find(function (s) {
      return s.officeId === officeId && s.productId === productId;
    });
    return row ? row.qty : 0;
  }

  /**
   * Get total qty of a product across a list of office ids.
   * @param {string} productId
   * @param {string[]} officeIds
   * @returns {number}
   */
  function totalQty(productId, officeIds) {
    return getAllStock().reduce(function (sum, s) {
      return (s.productId === productId && officeIds.includes(s.officeId))
        ? sum + s.qty : sum;
    }, 0);
  }

  /**
   * Get stock status for a product at an office.
   * @param {number} qty
   * @param {number} reorderLevel
   * @returns {'out'|'low'|'healthy'}
   */
  function stockStatus(qty, reorderLevel) {
    if (qty === 0)              return 'out';
    if (qty <= reorderLevel)    return 'low';
    return 'healthy';
  }

  // ── KPI aggregates ──

  /**
   * Count active products (all, not scoped — product catalogue is global).
   * @returns {number}
   */
  function countActiveProducts() {
    return getActiveProducts().length;
  }

  /**
   * Total stock value across a subtree (qty × costPrice).
   * @param {string} officeId
   * @returns {number}
   */
  function totalStockValue(officeId) {
    const ids      = subtreeIds(officeId);
    const products = storage.get('products') || [];
    const prdMap   = {};
    products.forEach(function (p) { prdMap[p.id] = p; });

    return getAllStock().reduce(function (sum, s) {
      if (!ids.includes(s.officeId)) return sum;
      const prd = prdMap[s.productId];
      return sum + (prd ? s.qty * prd.costPrice : 0);
    }, 0);
  }

  /**
   * Count products at or below reorder level within a subtree.
   * @param {string} officeId
   * @returns {number}
   */
  function countLowStock(officeId) {
    const ids      = subtreeIds(officeId);
    const products = getActiveProducts();
    return products.filter(function (p) {
      const qty = totalQty(p.id, ids);
      return qty <= p.reorderLevel;
    }).length;
  }

  // ── Sales aggregates ──

  /**
   * Get all sales.
   * @returns {Object[]}
   */
  function getAllSales() {
    return storage.get('sales') || [];
  }

  /**
   * Get sales within a subtree for a date range.
   * @param {string} officeId
   * @param {Date} [from]
   * @param {Date} [to]
   * @returns {Object[]}
   */
  function getSalesInSubtree(officeId, from, to) {
    const ids = subtreeIds(officeId);
    return getAllSales().filter(function (s) {
      if (s.type !== 'sale') return false;
      if (!ids.includes(s.storeId)) return false;
      if (from && new Date(s.at) < from) return false;
      if (to   && new Date(s.at) > to)   return false;
      return true;
    });
  }

  /**
   * Top N selling products by units in the last N days.
   * @param {string} officeId
   * @param {number} [days=30]
   * @param {number} [n=3]
   * @returns {Array<{ product: Object, units: number }>}
   */
  function topSellingProducts(officeId, days, n) {
    const cutoff = new Date(Date.now() - (days || 30) * 86400000);
    const sales  = getSalesInSubtree(officeId, cutoff);
    const counts = {};
    sales.forEach(function (s) {
      counts[s.productId] = (counts[s.productId] || 0) + s.qty;
    });

    const products = getActiveProducts();
    const ranked = products
      .filter(function (p) { return counts[p.id]; })
      .map(function (p) { return { product: p, units: counts[p.id] || 0 }; })
      .sort(function (a, b) { return b.units - a.units; });

    return ranked.slice(0, n || 3);
  }

  /**
   * Total sales amount for a subtree in the current month.
   * @param {string} officeId
   * @returns {number}
   */
  function currentMonthSalesAmount(officeId) {
    const now   = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    return getSalesInSubtree(officeId, start).reduce(function (sum, s) {
      return sum + (s.qty * s.unitPrice);
    }, 0);
  }

  /**
   * Count of sales transactions in the current month within a subtree.
   * @param {string} officeId
   * @returns {number}
   */
  function currentMonthSalesCount(officeId) {
    const now   = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    return getSalesInSubtree(officeId, start).length;
  }

  /**
   * Total sales target for a subtree in the current month.
   * @param {string} officeId
   * @returns {number}
   */
  function currentMonthTarget(officeId) {
    const stores  = getStoresInSubtree(officeId);
    const targets = storage.get('targets') || [];
    const now     = new Date();
    const month   = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0');
    return targets
      .filter(function (t) {
        return t.month === month && stores.some(function (s) { return s.id === t.storeId; });
      })
      .reduce(function (sum, t) { return sum + t.amount; }, 0);
  }

  // ── Movements / Activity ──

  /**
   * Get recent movements for a subtree.
   * @param {string} officeId
   * @param {number} [limit=20]
   * @returns {Object[]}
   */
  function getRecentMovements(officeId, limit) {
    const ids   = subtreeIds(officeId);
    const all   = storage.get('movements') || [];
    const lim   = limit || 20;
    return all
      .filter(function (m) {
        return ids.includes(m.toId) || ids.includes(m.fromId);
      })
      .sort(function (a, b) { return new Date(b.at) - new Date(a.at); })
      .slice(0, lim);
  }

  /**
   * Get recent allocations visible to an office.
   * @param {string} officeId
   * @param {number} [limit=20]
   * @returns {Object[]}
   */
  function getRecentAllocations(officeId, limit) {
    const ids  = subtreeIds(officeId);
    const all  = storage.get('allocations') || [];
    const lim  = limit || 20;
    return all
      .filter(function (a) { return ids.includes(a.fromId) || ids.includes(a.toId); })
      .sort(function (a, b) { return b.id > a.id ? -1 : 1; })
      .slice(0, lim);
  }

  // ── KPI trends ──
  /**
   * Compute last-month vs this-month trend for a numeric selector.
   * @param {Function} fn - Function that takes (officeId, start, end) → number
   * @param {string} officeId
   * @returns {{ current: number, prev: number, pct: number }}
   */
  function monthTrend(fn, officeId) {
    const now      = new Date();
    const thisStart= new Date(now.getFullYear(), now.getMonth(), 1);
    const prevStart= new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const prevEnd  = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

    const current = fn(officeId, thisStart, now);
    const prev    = fn(officeId, prevStart, prevEnd);
    const pct     = prev === 0 ? 0 : Math.round((current - prev) / prev * 100);
    return { current: current, prev: prev, pct: pct };
  }

  // ── Inventory statistics (bar chart data) ──
  /**
   * Build monthly bar chart data for the last 12 months.
   * @param {string} officeId
   * @returns {Array<{ label: string, stockIn: number, stockOut: number, stockValue: number }>}
   */
  function inventoryStatsByMonth(officeId) {
    const ids  = subtreeIds(officeId);
    const mvts = storage.get('movements') || [];
    const prdMap = {};
    (storage.get('products') || []).forEach(function (p) { prdMap[p.id] = p; });

    const months = [];
    const now    = new Date();
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        year:  d.getFullYear(),
        month: d.getMonth(),
        label: d.toLocaleString('en-IN', { month: 'short' }),
        stockIn:    0,
        stockOut:   0,
        stockValue: 0,
      });
    }

    mvts.forEach(function (m) {
      const d     = new Date(m.at);
      const year  = d.getFullYear();
      const month = d.getMonth();
      const bucket = months.find(function (b) { return b.year === year && b.month === month; });
      if (!bucket) return;

      const prd   = prdMap[m.productId];
      if (!prd) return;
      const value = m.qty * prd.costPrice;

      if (m.type === 'stock_in' && ids.includes(m.toId)) {
        bucket.stockIn += m.qty;
        bucket.stockValue += value;
      } else if ((m.type === 'dispatch' || m.type === 'sale') && ids.includes(m.fromId || m.toId)) {
        bucket.stockOut += m.qty;
      }
    });

    return months;
  }

  // ── Alerts (computed) ──
  /**
   * Compute alert counts for the user's subtree.
   * @param {string} officeId
   * @param {string} role
   * @returns {{ outOfStock: number, lowStock: number, inTransitLong: number, pendingRequests: number }}
   */
  function getAlertCounts(officeId, role) {
    const ids      = subtreeIds(officeId);
    const products = getActiveProducts();
    const settings = storage.get('settings') || {};
    const threshold = settings.transitDaysThreshold || 5;

    let outOfStock = 0, lowStock = 0;
    products.forEach(function (p) {
      ids.forEach(function (oid) {
        const qty = getQty(oid, p.id);
        const status = stockStatus(qty, p.reorderLevel);
        if (status === 'out') outOfStock++;
        else if (status === 'low') lowStock++;
      });
    });

    const allocs = storage.get('allocations') || [];
    const now    = Date.now();
    let inTransitLong = 0, pendingRequests = 0;

    allocs.forEach(function (a) {
      if (!ids.includes(a.fromId) && !ids.includes(a.toId)) return;
      if (a.status === 'dispatched') {
        const dispatchedAt = a.timeline && a.timeline.find(function (t) { return t.status === 'dispatched'; });
        if (dispatchedAt) {
          const daysInTransit = (now - new Date(dispatchedAt.at).getTime()) / 86400000;
          if (daysInTransit > threshold) inTransitLong++;
        }
      }
      if (a.status === 'requested' && ids.includes(a.toId)) {
        pendingRequests++;
      }
    });

    return { outOfStock: outOfStock, lowStock: lowStock, inTransitLong: inTransitLong, pendingRequests: pendingRequests };
  }

  window.Stockify.store.selectors = {
    getAllOffices, getOffice, subtreeIds, getChildren, getStoresInSubtree,
    getActiveProducts, getProduct,
    getAllStock, getQty, totalQty, stockStatus,
    countActiveProducts, totalStockValue, countLowStock,
    getAllSales, getSalesInSubtree, topSellingProducts,
    currentMonthSalesAmount, currentMonthSalesCount, currentMonthTarget,
    getRecentMovements, getRecentAllocations,
    monthTrend, inventoryStatsByMonth, getAlertCounts,
  };
})();

