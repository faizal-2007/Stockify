// services/reports.js — Business intelligence, stock ageing, turnaround, and audit reports
(function () {
  'use strict';

  const storage   = window.Stockify.store.storage;
  const selectors = window.Stockify.store.selectors;
  const auth      = window.Stockify.services.auth;

  /**
   * Helper to get accessible office IDs for current user.
   * @param {string} [rootOfficeId]
   * @returns {string[]}
   */
  function getScopedOfficeIds(rootOfficeId) {
    const user = auth.getCurrentUser();
    const startId = rootOfficeId || (user ? user.officeId : 'off_001');
    return selectors.subtreeIds(startId);
  }

  /**
   * 1. Stock by Office and Category Report
   * @param {Object} [filters]
   * @returns {{ rows: Array, totals: Object }}
   */
  function stockByOfficeAndCategory(filters) {
    const scopedIds = new Set(getScopedOfficeIds(filters && filters.officeId));
    const allOffices = storage.get('offices') || [];
    const stock = storage.get('stock') || [];
    const products = storage.get('products') || [];

    const prdMap = new Map();
    products.forEach(function (p) { prdMap.set(p.id, p); });

    const offices = allOffices.filter(function (o) { return scopedIds.has(o.id) && o.active !== false; });

    const stockByOffice = new Map();
    stock.forEach(function (s) {
      if (!stockByOffice.has(s.officeId)) stockByOffice.set(s.officeId, []);
      stockByOffice.get(s.officeId).push(s);
    });

    const rows = offices.map(function (office) {
      const officeStock = stockByOffice.get(office.id) || [];
      let spUnits = 0, spValue = 0;
      let swUnits = 0, swValue = 0;
      let tbUnits = 0, tbValue = 0;
      let lpUnits = 0, lpValue = 0;

      officeStock.forEach(function (row) {
        const p = prdMap.get(row.productId);
        if (!p) return;
        const val = row.qty * (p.costPrice || 0);
        if (p.category === 'smartphone') {
          spUnits += row.qty;
          spValue += val;
        } else if (p.category === 'smartwatch') {
          swUnits += row.qty;
          swValue += val;
        } else if (p.category === 'tablet') {
          tbUnits += row.qty;
          tbValue += val;
        } else if (p.category === 'laptop') {
          lpUnits += row.qty;
          lpValue += val;
        }
      });

      const totalUnits = spUnits + swUnits + tbUnits + lpUnits;
      const totalValue = spValue + swValue + tbValue + lpValue;

      return {
        officeId: office.id,
        officeName: office.name,
        officeCode: office.code,
        officeType: office.type,
        city: office.city,
        smartphones: { units: spUnits, value: spValue },
        smartwatches: { units: swUnits, value: swValue },
        tablets: { units: tbUnits, value: tbValue },
        laptops: { units: lpUnits, value: lpValue },
        totalUnits: totalUnits,
        totalValue: totalValue,
      };
    });

    // Grand totals
    const totals = rows.reduce(function (acc, r) {
      acc.spUnits += r.smartphones.units;
      acc.spValue += r.smartphones.value;
      acc.swUnits += r.smartwatches.units;
      acc.swValue += r.smartwatches.value;
      acc.tbUnits += r.tablets.units;
      acc.tbValue += r.tablets.value;
      acc.lpUnits += (r.laptops ? r.laptops.units : 0);
      acc.lpValue += (r.laptops ? r.laptops.value : 0);
      acc.totalUnits += r.totalUnits;
      acc.totalValue += r.totalValue;
      return acc;
    }, { spUnits: 0, spValue: 0, swUnits: 0, swValue: 0, tbUnits: 0, tbValue: 0, lpUnits: 0, lpValue: 0, totalUnits: 0, totalValue: 0 });

    return { rows, totals };
  }

  /**
   * 2. Stock Ageing Report
   * Days elapsed since last movement per product per office.
   * @param {Object} [filters]
   * @returns {{ rows: Array, totals: Object }}
   */
  function stockAgeing(filters) {
    const scopedIds = new Set(getScopedOfficeIds(filters && filters.officeId));
    const allOffices = storage.get('offices') || [];
    const stock = storage.get('stock') || [];
    const products = storage.get('products') || [];
    const movements = storage.get('movements') || [];

    const prdMap = new Map();
    products.forEach(function (p) { prdMap.set(p.id, p); });
    const offMap = new Map();
    allOffices.forEach(function (o) { offMap.set(o.id, o); });

    // Build latest movement date map per (officeId + '_' + productId)
    const lastMovedMap = new Map();
    movements.forEach(function (m) {
      const pId = m.productId;
      const mDate = new Date(m.at).getTime();

      if (m.toId) {
        const kTo = m.toId + '_' + pId;
        if (!lastMovedMap.has(kTo) || mDate > lastMovedMap.get(kTo)) {
          lastMovedMap.set(kTo, mDate);
        }
      }
      if (m.fromId) {
        const kFrom = m.fromId + '_' + pId;
        if (!lastMovedMap.has(kFrom) || mDate > lastMovedMap.get(kFrom)) {
          lastMovedMap.set(kFrom, mDate);
        }
      }
    });

    const now = Date.now();
    const rows = [];

    stock.forEach(function (row) {
      if (!scopedIds.has(row.officeId) || row.qty <= 0) return;
      const p = prdMap.get(row.productId);
      const o = offMap.get(row.officeId);
      if (!p || !o) return;

      if (filters && filters.category && p.category !== filters.category) return;
      if (filters && filters.brand && p.brand !== filters.brand) return;

      const key = row.officeId + '_' + row.productId;
      const lastMoved = lastMovedMap.get(key) || (now - (365 * 86400000)); // Default to 1 yr ago
      const daysOld = Math.max(0, Math.floor((now - lastMoved) / 86400000));

      let bracket = '0-30 days';
      if (daysOld > 90) bracket = '90+ days';
      else if (daysOld > 60) bracket = '61-90 days';
      else if (daysOld > 30) bracket = '31-60 days';

      if (filters && filters.bracket && filters.bracket !== 'all' && bracket !== filters.bracket) return;

      rows.push({
        product: p,
        office: o,
        qty: row.qty,
        daysOld: daysOld,
        lastMovedDate: new Date(lastMoved).toISOString(),
        bracket: bracket,
        value: row.qty * (p.costPrice || 0),
      });
    });

    rows.sort(function (a, b) { return b.daysOld - a.daysOld; });

    const totals = {
      totalUnits: rows.reduce(function (s, r) { return s + r.qty; }, 0),
      totalValue: rows.reduce(function (s, r) { return s + r.value; }, 0),
      bracket0_30: rows.filter(function (r) { return r.bracket === '0-30 days'; }).length,
      bracket31_60: rows.filter(function (r) { return r.bracket === '31-60 days'; }).length,
      bracket61_90: rows.filter(function (r) { return r.bracket === '61-90 days'; }).length,
      bracket90Plus: rows.filter(function (r) { return r.bracket === '90+ days'; }).length,
    };

    return { rows, totals };
  }

  /**
   * 3. Sales by Product, Store, and Period Report
   * @param {Object} [filters]
   * @returns {{ rows: Array, totals: Object }}
   */
  function salesByProductStorePeriod(filters) {
    const scopedIds = new Set(getScopedOfficeIds(filters && filters.officeId));
    const allOffices = storage.get('offices') || [];
    const products = storage.get('products') || [];
    const sales = storage.get('sales') || [];

    const prdMap = new Map();
    products.forEach(function (p) { prdMap.set(p.id, p); });
    const offMap = new Map();
    allOffices.forEach(function (o) { offMap.set(o.id, o); });

    const fromTime = filters && filters.dateFrom ? new Date(filters.dateFrom).getTime() : 0;
    const toTime = filters && filters.dateTo ? new Date(filters.dateTo).getTime() + 86400000 : Infinity;

    // Aggregate by Store + Product key
    const aggMap = new Map();

    sales.forEach(function (s) {
      if (!scopedIds.has(s.storeId)) return;
      const sTime = new Date(s.at).getTime();
      if (sTime < fromTime || sTime > toTime) return;

      const p = prdMap.get(s.productId);
      const o = offMap.get(s.storeId);
      if (!p || !o) return;

      if (filters && filters.storeId && s.storeId !== filters.storeId) return;
      if (filters && filters.category && p.category !== filters.category) return;
      if (filters && filters.payment && s.payment !== filters.payment) return;

      const key = s.storeId + '_' + s.productId;
      if (!aggMap.has(key)) {
        aggMap.set(key, {
          store: o,
          product: p,
          unitsSold: 0,
          grossRevenue: 0,
          unitsReturned: 0,
          returnAmount: 0,
        });
      }

      const item = aggMap.get(key);
      if (s.type === 'sale') {
        item.unitsSold += s.qty;
        item.grossRevenue += s.qty * s.unitPrice;
      } else if (s.type === 'return') {
        item.unitsReturned += s.qty;
        item.returnAmount += s.qty * s.unitPrice;
      }
    });

    const rows = Array.from(aggMap.values()).map(function (item) {
      const netUnits = item.unitsSold - item.unitsReturned;
      const netRevenue = item.grossRevenue - item.returnAmount;
      const avgPrice = item.unitsSold > 0 ? Math.round(item.grossRevenue / item.unitsSold) : item.product.price;
      return {
        store: item.store,
        product: item.product,
        unitsSold: item.unitsSold,
        grossRevenue: item.grossRevenue,
        unitsReturned: item.unitsReturned,
        netUnits: netUnits,
        netRevenue: netRevenue,
        avgPrice: avgPrice,
      };
    });

    rows.sort(function (a, b) { return b.netRevenue - a.netRevenue; });

    const totals = rows.reduce(function (acc, r) {
      acc.unitsSold += r.unitsSold;
      acc.grossRevenue += r.grossRevenue;
      acc.unitsReturned += r.unitsReturned;
      acc.netUnits += r.netUnits;
      acc.netRevenue += r.netRevenue;
      return acc;
    }, { unitsSold: 0, grossRevenue: 0, unitsReturned: 0, netUnits: 0, netRevenue: 0 });

    return { rows, totals };
  }

  /**
   * 4. Allocation Turnaround Time Report
   * Turnaround metrics per route / allocation.
   * @param {Object} [filters]
   * @returns {{ rows: Array, totals: Object }}
   */
  function allocationTurnaround(filters) {
    const scopedIds = new Set(getScopedOfficeIds(filters && filters.officeId));
    const allOffices = storage.get('offices') || [];
    const allocations = storage.get('allocations') || [];

    const offMap = new Map();
    allOffices.forEach(function (o) { offMap.set(o.id, o); });

    const rows = [];
    let sumReqToDisp = 0, countReqToDisp = 0;
    let sumDispToRec = 0, countDispToRec = 0;
    let discrepanciesCount = 0;

    allocations.forEach(function (alc) {
      if (!scopedIds.has(alc.fromId) && !scopedIds.has(alc.toId)) return;
      const sender = offMap.get(alc.fromId);
      const receiver = offMap.get(alc.toId);
      if (!sender || !receiver) return;

      const timeline = alc.timeline || [];
      const reqEntry = timeline.find(function (t) { return t.status === 'requested'; });
      const dispEntry = timeline.find(function (t) { return t.status === 'dispatched'; });
      const recEntry = timeline.find(function (t) { return t.status === 'received'; });

      let reqToDispHours = null;
      let dispToRecHours = null;
      let totalHours = null;

      if (dispEntry) {
        const start = reqEntry ? new Date(reqEntry.at).getTime() : new Date(alc.createdAt).getTime();
        const disp = new Date(dispEntry.at).getTime();
        reqToDispHours = Math.max(0, Math.round(((disp - start) / 3600000) * 10) / 10);
        sumReqToDisp += reqToDispHours;
        countReqToDisp++;
      }

      if (dispEntry && recEntry) {
        const disp = new Date(dispEntry.at).getTime();
        const rec = new Date(recEntry.at).getTime();
        dispToRecHours = Math.max(0, Math.round(((rec - disp) / 3600000) * 10) / 10);
        sumDispToRec += dispToRecHours;
        countDispToRec++;
        totalHours = Math.round((reqToDispHours + dispToRecHours) * 10) / 10;
      }

      if (alc.hasDiscrepancy) discrepanciesCount++;

      const totalItems = (alc.items || []).reduce(function (s, it) {
        return s + (it.qtyReceived || it.qtyDispatched || it.qtyRequested);
      }, 0);

      rows.push({
        id: alc.id,
        code: alc.code,
        type: alc.type,
        sender: sender,
        receiver: receiver,
        status: alc.status,
        itemCount: (alc.items || []).length,
        totalUnits: totalItems,
        createdAt: alc.createdAt,
        reqToDispHours: reqToDispHours,
        dispToRecHours: dispToRecHours,
        totalHours: totalHours,
        hasDiscrepancy: alc.hasDiscrepancy,
      });
    });

    rows.sort(function (a, b) { return new Date(b.createdAt) - new Date(a.createdAt); });

    const totals = {
      totalAllocations: rows.length,
      avgReqToDispHours: countReqToDisp > 0 ? Math.round((sumReqToDisp / countReqToDisp) * 10) / 10 : 0,
      avgDispToRecHours: countDispToRec > 0 ? Math.round((sumDispToRec / countDispToRec) * 10) / 10 : 0,
      discrepancyCount: discrepanciesCount,
      discrepancyRate: rows.length > 0 ? Math.round((discrepanciesCount / rows.length) * 1000) / 10 : 0,
    };

    return { rows, totals };
  }

  /**
   * 5. Low and Out of Stock Report
   * @param {Object} [filters]
   * @returns {{ rows: Array, totals: Object }}
   */
  function lowAndOutOfStock(filters) {
    const scopedIds = new Set(getScopedOfficeIds(filters && filters.officeId));
    const allOffices = storage.get('offices') || [];
    const stock = storage.get('stock') || [];
    const products = storage.get('products') || [];
    const settings = storage.get('settings') || {};
    const defaultReorder = settings.reorderDefault || 10;

    const prdMap = new Map();
    products.forEach(function (p) { prdMap.set(p.id, p); });
    const offMap = new Map();
    allOffices.forEach(function (o) { offMap.set(o.id, o); });

    const rows = [];

    stock.forEach(function (row) {
      if (!scopedIds.has(row.officeId)) return;
      const p = prdMap.get(row.productId);
      const o = offMap.get(row.officeId);
      if (!p || !o || p.active === false || o.active === false) return;

      const reorder = p.reorderLevel !== undefined ? p.reorderLevel : defaultReorder;
      if (row.qty > reorder) return; // healthy, not low or out

      const isOut = row.qty === 0;
      const shortfall = Math.max(0, reorder - row.qty);
      const reorderCost = shortfall * (p.costPrice || 0);

      rows.push({
        product: p,
        office: o,
        qty: row.qty,
        reorderLevel: reorder,
        shortfall: shortfall,
        status: isOut ? 'Out of Stock' : 'Low Stock',
        reorderCost: reorderCost,
      });
    });

    rows.sort(function (a, b) {
      if (a.qty === 0 && b.qty > 0) return -1;
      if (b.qty === 0 && a.qty > 0) return 1;
      return b.shortfall - a.shortfall;
    });

    const totals = {
      outCount: rows.filter(function (r) { return r.qty === 0; }).length,
      lowCount: rows.filter(function (r) { return r.qty > 0; }).length,
      totalShortfallUnits: rows.reduce(function (s, r) { return s + r.shortfall; }, 0),
      totalReorderCost: rows.reduce(function (s, r) { return s + r.reorderCost; }, 0),
    };

    return { rows, totals };
  }

  /**
   * 6. Employee & Admin Roster Report
   * Personnel roster, assignment hierarchy, and status audit across offices.
   * @param {Object} [filters] - { officeId, role, status, search }
   * @returns {{ rows: Array, totals: Object }}
   */
  function employeeReport(filters) {
    const scopedIds = new Set(getScopedOfficeIds(filters && filters.officeId));
    const allUsers = storage.get('users') || [];
    const allOffices = storage.get('offices') || [];
    const offMap = new Map();
    allOffices.forEach(function (o) { offMap.set(o.id, o); });

    let users = allUsers.filter(function (u) {
      return scopedIds.has(u.officeId);
    });

    const f = filters || {};
    if (f.role && f.role !== 'all') {
      users = users.filter(function (u) { return u.role === f.role; });
    }
    if (f.status === 'active') {
      users = users.filter(function (u) { return u.active !== false; });
    } else if (f.status === 'inactive') {
      users = users.filter(function (u) { return u.active === false; });
    }
    if (f.search && f.search.trim()) {
      const q = f.search.trim().toLowerCase();
      users = users.filter(function (u) {
        const off = offMap.get(u.officeId);
        return (u.name && u.name.toLowerCase().includes(q)) ||
               (u.email && u.email.toLowerCase().includes(q)) ||
               (u.id && u.id.toLowerCase().includes(q)) ||
               (u.designation && u.designation.toLowerCase().includes(q)) ||
               (off && off.name.toLowerCase().includes(q)) ||
               (off && off.city.toLowerCase().includes(q));
      });
    }

    const rows = users.map(function (u) {
      const off = offMap.get(u.officeId);
      return {
        id: u.id,
        name: u.name,
        role: u.role,
        roleLabel: u.role === 'head' ? 'Head Office Admin' : (u.role === 'zone' ? 'Zonal Director' : (u.role === 'district' ? 'District Manager' : (u.role === 'taluk' ? 'Taluk Officer' : 'Store Manager'))),
        officeId: u.officeId,
        officeName: off ? off.name : '',
        officeCode: off ? off.code : '',
        officeType: off ? off.type : '',
        city: off ? off.city : '',
        email: u.email || '',
        phone: u.phone || '',
        designation: u.designation || '',
        active: u.active !== false,
        statusLabel: u.active !== false ? 'Active' : 'Inactive',
      };
    });

    const totals = {
      totalStaff: rows.length,
      activeStaff: rows.filter(function (r) { return r.active; }).length,
      inactiveStaff: rows.filter(function (r) { return !r.active; }).length,
      headCount: rows.filter(function (r) { return r.role === 'head'; }).length,
      zoneCount: rows.filter(function (r) { return r.role === 'zone'; }).length,
      districtCount: rows.filter(function (r) { return r.role === 'district'; }).length,
      talukCount: rows.filter(function (r) { return r.role === 'taluk'; }).length,
      storeCount: rows.filter(function (r) { return r.role === 'store'; }).length,
    };

    return { rows, totals };
  }

  window.Stockify.services.reports = {
    stockByOfficeAndCategory,
    stockAgeing,
    salesByProductStorePeriod,
    allocationTurnaround,
    lowAndOutOfStock,
    employeeReport,
  };
})();

