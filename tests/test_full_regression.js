// tests/test_full_regression.js — Full system regression & reconciliation audit across all 6 phases
const fs = require('fs');

// Minimal Virtual DOM Mock
global.Node = function Node() {};
global.window = {};
global.document = {
  createElement: function (tag) {
    const el = Object.create(global.Node.prototype);
    el.tagName = tag.toUpperCase();
    el.className = '';
    el.style = {};
    el.dataset = {};
    el.attributes = {};
    el.children = [];
    el.childNodes = [];
    el.appendChild = function (c) {
      if (c) {
        el.children.push(c);
        el.childNodes.push(c);
        c.parentNode = el;
      }
      return c;
    };
    el.setAttribute = function (k, v) { el.attributes[k] = String(v); };
    el.getAttribute = function (k) { return el.attributes[k] || el.dataset[k] || null; };
    el.removeAttribute = function (k) { delete el.attributes[k]; };
    el.addEventListener = function (evt, fn) {
      el._handlers = el._handlers || {};
      el._handlers[evt] = el._handlers[evt] || [];
      el._handlers[evt].push(fn);
    };
    el.dispatchEvent = function (event) {
      if (el._handlers && el._handlers[event.type]) {
        el._handlers[event.type].forEach(function (h) { h(event); });
      }
    };
    el.querySelector = function (selector) {
      function find(node) {
        if (selector.startsWith('#') && (node.id === selector.slice(1) || (node.getAttribute && node.getAttribute('id') === selector.slice(1)))) return node;
        if (selector.startsWith('.') && node.className && node.className.includes(selector.slice(1))) return node;
        if (node.tagName && node.tagName.toLowerCase() === selector.toLowerCase()) return node;
        for (let c of node.children) {
          const res = find(c);
          if (res) return res;
        }
        return null;
      }
      return find(el);
    };
    el.querySelectorAll = function (selector) {
      const matches = [];
      function walk(node) {
        if (selector.startsWith('.') && node.className && node.className.includes(selector.slice(1))) {
          matches.push(node);
        } else if (selector.startsWith('#') && (node.id === selector.slice(1) || (node.getAttribute && node.getAttribute('id') === selector.slice(1)))) {
          matches.push(node);
        } else if (node.tagName && node.tagName.toLowerCase() === selector.toLowerCase()) {
          matches.push(node);
        }
        node.children.forEach(walk);
      }
      walk(el);
      return matches;
    };
    el.classList = {
      add: function (cls) { el.className = (el.className + ' ' + cls).trim(); },
      remove: function (cls) {
        el.className = el.className.split(' ').filter(c => c !== cls).join(' ');
      },
      contains: function (cls) {
        return el.className.split(' ').includes(cls);
      }
    };
    Object.defineProperty(el, 'innerHTML', {
      get: function () { return el._html || ''; },
      set: function (val) {
        el._html = val;
        el.children = [];
        el.childNodes = [];
      }
    });
    Object.defineProperty(el, 'textContent', {
      get: function () { return el._text || ''; },
      set: function (val) { el._text = val; }
    });
    return el;
  },
  createElementNS: function (ns, tag) {
    const el = document.createElement(tag);
    el.namespaceURI = ns;
    return el;
  },
  createTextNode: function (text) {
    const node = Object.create(global.Node.prototype);
    node.textContent = String(text);
    node.children = [];
    return node;
  },
  addEventListener: function (evt, fn) {
    document._handlers = document._handlers || {};
    document._handlers[evt] = document._handlers[evt] || [];
    document._handlers[evt].push(fn);
  }
};

const storeData = {};
global.localStorage = {
  getItem: function (key) { return storeData[key] !== undefined ? storeData[key] : null; },
  setItem: function (key, val) { storeData[key] = String(val); },
  removeItem: function (key) { delete storeData[key]; },
  clear: function () { for (let k in storeData) delete storeData[k]; },
  key: function (i) { return Object.keys(storeData)[i] || null; },
  get length() { return Object.keys(storeData).length; }
};

// All application files in dependency order
const scripts = [
  'js/namespace.js',
  'js/events.js',
  'js/utils/format.js',
  'js/utils/dom.js',
  'js/utils/image.js',
  'js/utils/id.js',
  'js/utils/validate.js',
  'js/utils/csv.js',
  'js/store/storage.js',
  'js/store/seed.js',
  'js/store/selectors.js',
  'js/services/auth.js',
  'js/services/products.js',
  'js/services/stock.js',
  'js/services/allocations.js',
  'js/services/offices.js',
  'js/services/sales.js',
  'js/services/activity.js',
  'js/services/alerts.js',
  'js/services/dashboard.js',
  'js/services/reports.js',
  'js/components/toast.js',
  'js/components/modal.js',
  'js/components/drawer.js',
  'js/components/topbar.js',
  'js/components/sidebar.js',
  'js/components/productThumb.js',
  'js/components/imageUploader.js',
  'js/components/kpiCard.js',
  'js/components/barChart.js',
  'js/components/gauge.js',
  'js/components/activityList.js',
  'js/components/alertList.js',
  'js/router.js',
  'js/views/dashboard.js',
  'js/views/inventory.js',
  'js/views/productDetail.js',
  'js/views/productForm.js',
  'js/views/stockIn.js',
  'js/views/allocations.js',
  'js/views/allocationForm.js',
  'js/views/allocationDetail.js',
  'js/views/network.js',
  'js/views/officeDetail.js',
  'js/views/sales.js',
  'js/views/reports.js',
  'js/views/activity.js',
  'js/views/settings.js',
  'js/views/stubs.js',
];

scripts.forEach(file => {
  const code = fs.readFileSync(file, 'utf8');
  eval(code);
});

// Seed demo data fresh
window.Stockify.store.seed.seed();

const S = window.Stockify;
let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log('  PASS:', message);
    passed++;
  } else {
    console.error('  FAIL:', message);
    failed++;
  }
}

console.log('=====================================================');
console.log('STOCKIFY FULL REGRESSION TEST & RECONCILIATION AUDIT');
console.log('=====================================================\n');

console.log('--- SECTION 1: CORE DATA INTEGRITY & INITIAL SEED ---');
assert(S.store.storage.isSeeded() === true, 'Database seeded successfully');
const offices = S.store.storage.get('offices');
assert(offices.length === 22, '22 offices exist (1 HO, 3 Zones, 6 Districts, 12 Stores)');
const products = S.store.storage.get('products');
assert(products.length === 15, '15 products exist (5 phones, 5 watches, 5 tablets)');
assert(products.every(p => p.image && p.image.length > 0), 'Every product has a dedicated photo asset');
const initialStock = S.store.storage.get('stock');
assert(initialStock.length === 330, '330 stock rows (22 offices * 15 products)');
const totalUnitsInitial = initialStock.reduce((s, r) => s + r.qty, 0);
assert(totalUnitsInitial === 3010, 'Total physical units in initial seed is exactly 3,010');

console.log('\n--- SECTION 2: 4-TIER SCOPE & PERMISSIONS AUDIT ---');

// 1. Head Office (Faizal)
S.services.auth.login('usr_001');
assert(S.services.auth.hasRole('head'), 'HO user has head role');
assert(S.store.selectors.subtreeIds('off_001').length === 22, 'HO sees all 22 offices');
assert(S.services.auth.canAccess('#/inventory/new'), 'HO can access Add Product');
assert(S.services.auth.canAccess('#/stock-in'), 'HO can access Stock In');

// 2. Zone (Priya - South Zone)
S.services.auth.login('usr_002');
assert(S.services.auth.hasRole('zone'), 'Zone user has zone role');
assert(S.store.selectors.subtreeIds('off_002').length === 7, 'South Zone sees 7 offices (Zone + 2 Districts + 4 Stores)');
assert(!S.services.auth.canAccess('#/inventory/new'), 'Zone cannot access Add Product');
assert(!S.services.auth.canAccess('#/stock-in'), 'Zone cannot access Stock In');

// 3. District (Kavitha - Tamil Nadu District)
S.services.auth.login('usr_005');
assert(S.services.auth.hasRole('district'), 'District user has district role');
assert(S.store.selectors.subtreeIds('off_005').length === 3, 'Tamil Nadu district sees 3 offices (District + 2 Stores)');
assert(!S.services.auth.canAccess('#/inventory/new'), 'District cannot access Add Product');

// 4. Store (Ramesh - Chennai Central Store)
S.services.auth.login('usr_011');
assert(S.services.auth.hasRole('store'), 'Store user has store role');
assert(S.store.selectors.subtreeIds('off_011').length === 1, 'Store only sees its own store office');
assert(!S.services.auth.canAccess('#/network'), 'Store cannot access Network route');

console.log('\n--- SECTION 3: INVENTORY, STOCK-IN & NON-NEGATIVE STOCK ---');
S.services.auth.login('usr_001'); // HO
const hoId = 'off_001';
const testPrd = 'prd_001';
const initialHoQty = S.services.stock.getStock(hoId, testPrd);

// Stock-in 100 units from supplier
S.services.stock.stockIn(testPrd, 100, 'Apple India Pvt Ltd', 'PO-2026-9901');
const afterStockInQty = S.services.stock.getStock(hoId, testPrd);
assert(afterStockInQty === initialHoQty + 100, 'HO stock increased by 100 via stock-in');

// Verify stock cannot go negative
let negativeStockBlocked = false;
try {
  S.services.stock.adjust(hoId, testPrd, -(afterStockInQty + 50), { type: 'manual' });
} catch (e) {
  negativeStockBlocked = true;
  assert(true, 'Negative stock adjustment correctly rejected: ' + e.message);
}
assert(negativeStockBlocked, 'Negative stock invariant maintained');

console.log('\n--- SECTION 4: ALLOCATION STATE MACHINE & TRANSIT HOLDING ---');

// Login as HO
S.services.auth.login('usr_001');

// 1. Push Allocation: HO pushes 20 units to South Zone
const pushAlloc = S.services.allocations.createPushAllocation({
  fromId: 'off_001',
  toId: 'off_002', // Direct child
  items: [{ productId: testPrd, qty: 20 }],
  note: 'Replenishment transfer',
});
assert(pushAlloc.status === 'dispatched', 'Push allocation status goes immediately to dispatched');
assert(pushAlloc.items[0].qtyDispatched === 20, '20 units dispatched');

// HO stock decremented immediately
const hoAfterDispatch = S.services.stock.getStock(hoId, testPrd);
assert(hoAfterDispatch === afterStockInQty - 20, 'HO stock decremented immediately upon dispatch');

// In-transit holding verification: South Zone stock has NOT increased yet!
const szBeforeReceive = S.services.stock.getStock('off_002', testPrd);

// South Zone receives 18 units with 2 units discrepancy (short receipt)
S.services.auth.login('usr_002'); // South Zone
const receivedAlloc = S.services.allocations.confirmReceipt(pushAlloc.id, [
  { productId: testPrd, qtyReceived: 18 }
], 'Carton opened in transit; 2 units damaged');

assert(receivedAlloc.status === 'received', 'Allocation status updated to received');
assert(receivedAlloc.hasDiscrepancy === true, 'Discrepancy flagged');

// South Zone stock increased by received units (18)
const szAfterReceive = S.services.stock.getStock('off_002', testPrd);
assert(szAfterReceive === szBeforeReceive + 18, 'South Zone received 18 units');

// Acknowledge discrepancy by HO -> restores 2 units to sender (HO)
S.services.auth.login('usr_001');
S.services.allocations.acknowledgeDiscrepancy(receivedAlloc.id);
const hoAfterAck = S.services.stock.getStock(hoId, testPrd);
assert(hoAfterAck === hoAfterDispatch + 2, 'HO stock restored by 2 shortfall units upon acknowledgment');

// Illegal allocation attempt: HO cannot push directly to Store (level-skipping forbidden)
let illegalRouteBlocked = false;
try {
  S.services.allocations.createPushAllocation({
    fromId: 'off_001',
    toId: 'off_011', // Store
    items: [{ productId: testPrd, qty: 5 }],
  });
} catch (e) {
  illegalRouteBlocked = true;
  assert(true, 'Level-skipping allocation correctly blocked: ' + e.message);
}
assert(illegalRouteBlocked, 'Strict parent-child route invariant enforced');

console.log('\n--- SECTION 5: RETAIL POINT OF SALE & CUSTOMER RETURNS ---');

// Store sale at Chennai Central
S.services.auth.login('usr_011');
const storePrdQtyInitial = S.services.stock.getStock('off_011', testPrd);
assert(storePrdQtyInitial > 0, 'Store has stock on hand');

// Record Sale
const sale = S.services.sales.recordSale({
  storeId: 'off_011',
  productId: testPrd,
  qty: 2,
  unitPrice: 134900,
  payment: 'upi',
  customer: { name: 'Vignesh Sundaram', phone: '9840199999' },
});
assert(sale.id.startsWith('sal_'), 'Sale recorded: ' + sale.id);

const storePrdQtyAfterSale = S.services.stock.getStock('off_011', testPrd);
assert(storePrdQtyAfterSale === storePrdQtyInitial - 2, 'Store stock deducted by 2 units');

// Process Return of 1 unit
const ret = S.services.sales.recordReturn({
  saleId: sale.id,
  qty: 1,
  reason: 'Customer exchanged for higher memory',
});
assert(ret.id.startsWith('sal_'), 'Return recorded: ' + ret.id);
assert(ret.type === 'return', 'Return type recorded');

const storePrdQtyAfterReturn = S.services.stock.getStock('off_011', testPrd);
assert(storePrdQtyAfterReturn === storePrdQtyInitial - 1, 'Store stock restored by 1 unit after return');

console.log('\n--- SECTION 6: SYSTEM RECONCILIATION AUDIT (PRD Section 14) ---');

// Formula: Sum of stock across all offices + In Transit Stock = Total HO Stock-In minus Net Sales
const currentStockTable = S.store.storage.get('stock');
const physicalStockTotal = currentStockTable.reduce((sum, r) => sum + r.qty, 0);

// In-transit stock on active allocations
const allAllocations = S.store.storage.get('allocations');
let inTransitUnits = 0;
allAllocations.forEach(a => {
  if (a.status === 'dispatched') {
    (a.items || []).forEach(it => {
      inTransitUnits += (it.qtyDispatched - (it.qtyReceived || 0));
    });
  }
});

const totalActiveUnits = physicalStockTotal + inTransitUnits;

// Total Initial Units (3,010) + Stock-In (100) - Initial Alloc Transit (21)
// Let's print detailed reconciliation figures
console.log('  -> Physical Stock Units across all 22 offices: ' + physicalStockTotal);
console.log('  -> In-Transit Units on Dispatched Allocations: ' + inTransitUnits);
console.log('  -> Total Active Network Units: ' + totalActiveUnits);

// Initial was 3010 + 21 in-transit = 3031 network total.
// We added +100 stock-in, and sold net 1 unit (-2 sale + 1 return) = 3031 + 100 - 1 = 3,130 units!
assert(totalActiveUnits === 3130, 'Exact Network Reconciliation verified: Total physical (' + physicalStockTotal + ') + in-transit (' + inTransitUnits + ') = 3,130 units!');

console.log('\n=====================================================');
console.log(`FULL REGRESSION RESULT: ${passed} passed, ${failed} failed.`);
console.log('=====================================================\n');

if (failed > 0) process.exit(1);
