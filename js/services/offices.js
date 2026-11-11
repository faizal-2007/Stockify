// services/offices.js — Hierarchy tree, office CRUD, and subtree aggregation
(function () {
  'use strict';

  const storage   = window.Stockify.store.storage;
  const selectors = window.Stockify.store.selectors;
  const auth      = window.Stockify.services.auth;
  const idGen     = window.Stockify.utils.id;
  const events    = window.Stockify.events;

  const VALID_TYPES = ['head', 'zone', 'district', 'taluk', 'store'];
  const TYPE_HIERARCHY = {
    head: null,
    zone: 'head',
    district: 'zone',
    taluk: 'district',
    store: 'taluk',
  };

  /**
   * Check if an office code is unique.
   * @param {string} code
   * @param {string} [excludeId]
   * @returns {boolean}
   */
  function isCodeUnique(code, excludeId) {
    if (!code) return false;
    const offices = storage.get('offices') || [];
    const normalized = code.trim().toUpperCase();
    return !offices.some(function (o) {
      return o.id !== excludeId && (o.code || '').toUpperCase() === normalized;
    });
  }

  /**
   * Determine whether a user can manage (add/edit) offices at a given level.
   * - head: can manage zones, districts, taluks, stores
   * - zone: can manage districts, taluks, and stores in their zone
   * - district: can manage taluks and stores in their district
   * - taluk: can manage stores in their taluk
   * - store: read-only
   * @param {string} targetType - 'zone' | 'district' | 'taluk' | 'store'
   * @param {string} [parentOfficeId]
   * @returns {boolean}
   */
  function canManageOffice(targetType, parentOfficeId) {
    const user = auth.currentUser();
    if (!user) return false;

    if (user.role === 'head') return true;

    if (user.role === 'zone') {
      if (targetType !== 'district' && targetType !== 'taluk' && targetType !== 'store') return false;
      if (parentOfficeId) {
        return selectors.subtreeIds(user.officeId).includes(parentOfficeId);
      }
      return true;
    }

    if (user.role === 'district') {
      if (targetType !== 'taluk' && targetType !== 'store') return false;
      if (parentOfficeId) {
        return selectors.subtreeIds(user.officeId).includes(parentOfficeId);
      }
      return true;
    }

    if (user.role === 'taluk') {
      if (targetType !== 'store') return false;
      if (parentOfficeId) {
        return selectors.subtreeIds(user.officeId).includes(parentOfficeId);
      }
      return true;
    }

    return false;
  }

  /**
   * Compute aggregated metrics for an office node and its subtree.
   * @param {string} officeId
   * @returns {{ totalUnits: number, totalValue: number, healthy: number, low: number, out: number, storesCount: number }}
   */
  function computeSubtreeMetrics(officeId) {
    const subtreeIdList = selectors.subtreeIds(officeId);
    const officeIds = new Set(subtreeIdList);

    const allOffices = storage.get('offices') || [];
    const subtreeOffices = allOffices.filter(function (o) { return officeIds.has(o.id); });

    const stock = storage.get('stock') || [];
    const products = storage.get('products') || [];
    const productMap = new Map();
    products.forEach(function (p) { productMap.set(p.id, p); });

    let totalUnits = 0;
    let totalValue = 0;
    let healthy = 0;
    let low = 0;
    let out = 0;

    // Filter stock to this subtree
    stock.forEach(function (row) {
      if (officeIds.has(row.officeId)) {
        totalUnits += row.qty;
        const p = productMap.get(row.productId);
        if (p) {
          totalValue += row.qty * (p.costPrice || 0);
          const reorder = p.reorderLevel || 10;
          if (row.qty === 0) out++;
          else if (row.qty <= reorder) low++;
          else healthy++;
        }
      }
    });

    const storesCount = subtreeOffices.filter(function (o) { return o.type === 'store'; }).length;

    return {
      totalUnits: totalUnits,
      totalValue: totalValue,
      healthy: healthy,
      low: low,
      out: out,
      storesCount: storesCount,
    };
  }

  /**
   * Build a hierarchical tree of offices scoped to rootOfficeId (or current user's office).
   * @param {string} [rootOfficeId]
   * @returns {Object|null}
   */
  function getHierarchy(rootOfficeId) {
    const user = auth.currentUser();
    const startId = rootOfficeId || (user ? user.officeId : 'off_001');
    const allOffices = storage.get('offices') || [];
    const rootOffice = allOffices.find(function (o) { return o.id === startId; });
    if (!rootOffice) return null;

    // Group children by parentId
    const childrenMap = new Map();
    allOffices.forEach(function (o) {
      const pId = o.parentId;
      if (!childrenMap.has(pId)) childrenMap.set(pId, []);
      childrenMap.get(pId).push(o);
    });

    // Pre-aggregate stock by office for fast O(N) post-order tree evaluation
    const stock = storage.get('stock') || [];
    const products = storage.get('products') || [];
    const productMap = new Map();
    products.forEach(function (p) { productMap.set(p.id, p); });

    const officeMetricsMap = new Map();
    stock.forEach(function (row) {
      let m = officeMetricsMap.get(row.officeId);
      if (!m) {
        m = { totalUnits: 0, totalValue: 0, healthy: 0, low: 0, out: 0 };
        officeMetricsMap.set(row.officeId, m);
      }
      m.totalUnits += row.qty;
      const p = productMap.get(row.productId);
      if (p) {
        m.totalValue += row.qty * (p.costPrice || 0);
        const reorder = p.reorderLevel || 10;
        if (row.qty === 0) m.out++;
        else if (row.qty <= reorder) m.low++;
        else m.healthy++;
      }
    });

    function buildNode(office) {
      const children = (childrenMap.get(office.id) || []).map(buildNode);
      const ownM = officeMetricsMap.get(office.id) || { totalUnits: 0, totalValue: 0, healthy: 0, low: 0, out: 0 };

      let totalUnits = ownM.totalUnits;
      let totalValue = ownM.totalValue;
      let healthy = ownM.healthy;
      let low = ownM.low;
      let out = ownM.out;
      let storesCount = office.type === 'store' ? 1 : 0;

      for (let i = 0; i < children.length; i++) {
        const cm = children[i].metrics;
        totalUnits += cm.totalUnits;
        totalValue += cm.totalValue;
        healthy += cm.healthy;
        low += cm.low;
        out += cm.out;
        storesCount += cm.storesCount;
      }

      return {
        id: office.id,
        code: office.code,
        name: office.name,
        type: office.type,
        parentId: office.parentId,
        city: office.city,
        manager: office.manager,
        active: office.active !== false,
        metrics: {
          totalUnits: totalUnits,
          totalValue: totalValue,
          healthy: healthy,
          low: low,
          out: out,
          storesCount: storesCount,
        },
        children: children,
      };
    }

    return buildNode(rootOffice);
  }

  /**
   * Get an office by ID with permission check.
   * @param {string} officeId
   * @returns {Object|null}
   */
  function getOfficeById(officeId) {
    const user = auth.currentUser();
    if (user && !selectors.subtreeIds(user.officeId).includes(officeId)) {
      throw new Error('Permission denied: Office is outside your accessible scope.');
    }
    const offices = storage.get('offices') || [];
    return offices.find(function (o) { return o.id === officeId; }) || null;
  }

  /**
   * Get comprehensive details for an office.
   * @param {string} officeId
   * @returns {Object}
   */
  function getOfficeDetail(officeId) {
    const office = getOfficeById(officeId);
    if (!office) throw new Error('Office not found: ' + officeId);

    const subtreeMetrics = computeSubtreeMetrics(officeId);
    const products = storage.get('products') || [];
    const stock = storage.get('stock') || [];

    // Current inventory at this specific physical location
    const officeStock = stock.filter(function (s) { return s.officeId === officeId; });
    const inventory = products.map(function (p) {
      const row = officeStock.find(function (s) { return s.productId === p.id; });
      const qty = row ? row.qty : 0;
      const reorder = p.reorderLevel || 10;
      let status = 'healthy';
      if (qty === 0) status = 'out';
      else if (qty <= reorder) status = 'low';

      return {
        product: p,
        qty: qty,
        unitCost: p.costPrice || 0,
        unitPrice: p.price || 0,
        totalValue: qty * (p.costPrice || 0),
        status: status,
      };
    });

    // Recent allocations involving this office
    const allocations = storage.get('allocations') || [];
    const relatedAllocations = allocations.filter(function (a) {
      return a.fromId === officeId || a.toId === officeId;
    }).sort(function (a, b) {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }).slice(0, 10);

    // Recent sales if store
    let sales = [];
    if (office.type === 'store') {
      const allSales = storage.get('sales') || [];
      sales = allSales.filter(function (s) {
        return s.storeId === officeId;
      }).sort(function (a, b) {
        return new Date(b.at) - new Date(a.at);
      }).slice(0, 15);
    }

    // Direct child offices
    const allOffices = storage.get('offices') || [];
    const directChildren = allOffices.filter(function (o) {
      return o.parentId === officeId;
    }).map(function (child) {
      return {
        office: child,
        metrics: computeSubtreeMetrics(child.id),
      };
    });

    return {
      office: office,
      subtreeMetrics: subtreeMetrics,
      inventory: inventory,
      allocations: relatedAllocations,
      sales: sales,
      children: directChildren,
    };
  }

  /**
   * Create a new office in the hierarchy.
   * @param {Object} data
   * @param {string} data.code
   * @param {string} data.name
   * @param {string} data.type - 'zone' | 'district' | 'store'
   * @param {string} data.parentId
   * @param {string} data.city
   * @param {string} data.manager
   * @returns {Object} created office
   */
  function createOffice(data) {
    const user = auth.currentUser();
    if (!user) throw new Error('Authentication required.');

    const type = (data.type || '').trim().toLowerCase();
    if (!VALID_TYPES.includes(type) || type === 'head') {
      throw new Error('Invalid office type. Head Office cannot be duplicated.');
    }

    const expectedParentType = TYPE_HIERARCHY[type];
    const offices = storage.get('offices') || [];
    const parent = offices.find(function (o) { return o.id === data.parentId; });

    if (!parent) {
      throw new Error('Parent office not found.');
    }
    if (parent.type !== expectedParentType) {
      throw new Error(
        'Hierarchy violation: A ' + type + ' must report directly to a ' + expectedParentType +
        ' (chosen parent is ' + parent.type + ').'
      );
    }

    if (!canManageOffice(type, parent.id)) {
      throw new Error('Permission denied: You cannot create an office at this location.');
    }

    const name = (data.name || '').trim();
    if (!name) throw new Error('Office name is required.');

    const city = (data.city || '').trim();
    if (!city) throw new Error('City is required.');

    const manager = (data.manager || '').trim();
    if (!manager) throw new Error('Manager name is required.');

    let code = (data.code || '').trim().toUpperCase();
    if (!code) {
      // Auto-suggest code if not provided
      const prefix = type === 'zone' ? 'ZN' : (type === 'district' ? 'DIS' : (type === 'taluk' ? 'TLK' : 'STR'));
      const citySlug = city.slice(0, 3).toUpperCase();
      const count = offices.filter(function (o) { return o.type === type; }).length + 1;
      code = prefix + '-' + citySlug + '-' + String(count).padStart(2, '0');
    }

    if (!isCodeUnique(code)) {
      throw new Error('Office code "' + code + '" is already in use.');
    }

    const newId = idGen.officeId();
    const newOffice = {
      id: newId,
      code: code,
      name: name,
      type: type,
      parentId: parent.id,
      city: city,
      manager: manager,
      active: true,
      createdAt: new Date().toISOString(),
      createdBy: user.id,
    };

    offices.push(newOffice);
    storage.set('offices', offices);

    // Initialize stock ledger rows (0 stock for all active products)
    const products = storage.get('products') || [];
    const stock = storage.get('stock') || [];
    products.forEach(function (p) {
      stock.push({
        officeId: newId,
        productId: p.id,
        qty: 0,
      });
    });
    storage.set('stock', stock);

    events.emit('office:created', newOffice);
    events.emit('stock:changed');

    return newOffice;
  }

  /**
   * Update office details.
   * @param {string} officeId
   * @param {Object} data
   * @returns {Object} updated office
   */
  function updateOffice(officeId, data) {
    const office = getOfficeById(officeId);
    if (!office) throw new Error('Office not found.');

    if (!canManageOffice(office.type, office.parentId)) {
      throw new Error('Permission denied: You cannot edit this office.');
    }

    const offices = storage.get('offices') || [];
    const index = offices.findIndex(function (o) { return o.id === officeId; });
    if (index === -1) throw new Error('Office not found.');

    if (data.name !== undefined) {
      const name = String(data.name).trim();
      if (!name) throw new Error('Office name cannot be empty.');
      office.name = name;
    }

    if (data.city !== undefined) {
      const city = String(data.city).trim();
      if (!city) throw new Error('City cannot be empty.');
      office.city = city;
    }

    if (data.manager !== undefined) {
      const manager = String(data.manager).trim();
      if (!manager) throw new Error('Manager name cannot be empty.');
      office.manager = manager;
    }

    if (data.code !== undefined) {
      const code = String(data.code).trim().toUpperCase();
      if (!code) throw new Error('Office code cannot be empty.');
      if (!isCodeUnique(code, officeId)) {
        throw new Error('Office code "' + code + '" is already in use.');
      }
      office.code = code;
    }

    if (data.active !== undefined) {
      office.active = Boolean(data.active);
    }

    office.updatedAt = new Date().toISOString();
    offices[index] = office;
    storage.set('offices', offices);

    events.emit('office:updated', office);
    return office;
  }

  window.Stockify.services.offices = {
    getHierarchy,
    getOfficeById,
    getOfficeDetail,
    canManageOffice,
    isCodeUnique,
    createOffice,
    updateOffice,
    computeSubtreeMetrics,
  };
})();
