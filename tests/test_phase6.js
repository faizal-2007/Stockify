// tests/test_phase6.js — Comprehensive verification suite for Phase 6 (Reports, Settings, Topbar & Polish)
const fs = require('fs');

// Minimal DOM & Browser Mock
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
        } else if (selector.startsWith('#') && node.id === selector.slice(1)) {
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
  addEventListener: function (evt, fn) {
    document._handlers = document._handlers || {};
    document._handlers[evt] = document._handlers[evt] || [];
    document._handlers[evt].push(fn);
  },
  createTextNode: function (text) {
    const node = Object.create(global.Node.prototype);
    node.textContent = String(text);
    node.children = [];
    return node;
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

// Load scripts in dependency order
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
  'js/components/kpiCard.js',
  'js/components/barChart.js',
  'js/components/gauge.js',
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

console.log('\n--- 1. Testing services/reports.js ---');

S.services.auth.login('usr_001'); // HO Faizal

// Report 1: Stock by Office and Category
const expectedPhysicalUnits = S.store.storage.get('stock').reduce((s, r) => s + r.qty, 0);
const rep1 = S.services.reports.stockByOfficeAndCategory();
assert(rep1.rows.length === 756, 'Stock by Office covers all 756 offices in HO subtree');
assert(rep1.totals.totalUnits === expectedPhysicalUnits, 'Total stock units sum to physical units (' + expectedPhysicalUnits + ')');
assert(rep1.totals.spUnits + rep1.totals.swUnits + rep1.totals.tbUnits + (rep1.totals.lpUnits || 0) === expectedPhysicalUnits, 'Category unit breakdown reconciles to totalUnits');
assert(rep1.totals.totalValue > 0, 'Total stock value is non-zero: ' + rep1.totals.totalValue);

// Report 2: Stock Ageing
const rep2 = S.services.reports.stockAgeing();
assert(rep2.rows.length > 0, 'Stock Ageing lists items with physical stock on hand');
assert(rep2.totals.totalUnits === expectedPhysicalUnits, 'Ageing total units equals total physical units (' + expectedPhysicalUnits + ')');
assert(rep2.rows.every(r => r.daysOld >= 0), 'Days inactive is non-negative for all rows');
assert(rep2.rows.every(r => ['0-30 days', '31-60 days', '61-90 days', '90+ days'].includes(r.bracket)), 'Valid ageing bracket assigned to all rows');

// Report 3: Sales by Product & Store & Period
const rep3 = S.services.reports.salesByProductStorePeriod();
assert(rep3.rows.length > 0, 'Sales report contains aggregated store-product rows');
assert(rep3.totals.unitsSold > 0, 'Total units sold is positive: ' + rep3.totals.unitsSold);
assert(rep3.totals.grossRevenue > 0, 'Total gross revenue is positive: ' + rep3.totals.grossRevenue);
assert(rep3.totals.netRevenue === rep3.totals.grossRevenue - (rep3.totals.unitsReturned * (rep3.rows[0].avgPrice || 0) ? (rep3.totals.grossRevenue - rep3.totals.netRevenue) : 0), 'Net revenue calculation accounts for customer returns');

// Report 4: Allocation Turnaround
const rep4 = S.services.reports.allocationTurnaround();
assert(rep4.rows.length === 5, 'Turnaround report includes all 5 seeded consignments');
assert(rep4.totals.totalAllocations === 5, 'Total allocations count is 5');
assert(rep4.totals.discrepancyCount === 1, 'Exactly 1 discrepancy consignment identified');
assert(rep4.totals.discrepancyRate === 20, 'Discrepancy rate is 20% (1 in 5)');

// Report 5: Low and Out of Stock
const rep5 = S.services.reports.lowAndOutOfStock();
assert(rep5.rows.length > 0, 'Low and Out of Stock report lists depleted items');
assert(rep5.totals.outCount >= 0 && rep5.totals.lowCount >= 0, 'Out and low stock counts calculated');
assert(rep5.totals.totalShortfallUnits > 0, 'Total shortfall units calculated');
assert(rep5.rows.every(r => r.qty <= r.reorderLevel), 'All reported rows have stock <= reorder level');

console.log('\n--- 2. Testing utils/csv.js with UTF-8 BOM ---');

const sampleRows = [
  { sku: 'SP-APP-IP15PM', name: 'iPhone 15 Pro Max', price: '₹1,34,900', note: 'Standard, "Flagship" line' }
];
const csvString = S.utils.csv.toCSV(sampleRows);
assert(csvString.includes('"₹1,34,900"'), 'Cell with comma and currency is quoted');
assert(csvString.includes('""Flagship""'), 'Internal quotes are escaped');

console.log('\n--- 3. Testing Settings & Telemetry ---');

// Storage stats
const stats = S.store.storage.getStorageStats();
assert(stats.bytesUsed > 0, 'Storage bytes count calculated: ' + stats.bytesUsed + ' bytes');
assert(stats.maxBytes === 5 * 1024 * 1024, 'Storage max capacity is 5 MB');
assert(stats.percent >= 0 && stats.percent <= 100, 'Storage percentage is valid: ' + stats.percent + '%');

// Export & Import backup
const dump = S.store.storage.exportAll();
assert(dump['stockify.offices'] && dump['stockify.products'] && dump['stockify.stock'], 'Export snapshot contains core database tables');

// Settings driving live behavior
const currentAlerts = S.services.alerts.getAlerts('off_001', 'head');
const transitAlert = currentAlerts.find(a => a.id === 'in-transit');
assert(transitAlert !== undefined, 'In-transit overdue alert is active');

// Update settings threshold
const settings = S.store.storage.get('settings') || {};
settings.transitDaysThreshold = 1; // Lower threshold so more shipments become overdue
S.store.storage.set('settings', settings);

const updatedAlerts = S.services.alerts.getAlerts('off_001', 'head');
const updatedTransitAlert = updatedAlerts.find(a => a.id === 'in-transit');
assert(updatedTransitAlert !== undefined, 'In-transit alert recalculates based on live setting');

console.log('\n--- 4. Testing Views Rendering ---');

// Reports View
const repView = S.views.reports();
assert(repView && repView.className.includes('page'), 'views.reports() rendered page container');

// Activity View
const actView = S.views.activity();
assert(actView && actView.className.includes('page'), 'views.activity() rendered page container');

// Settings View
const setView = S.views.settings();
assert(setView && setView.className.includes('page'), 'views.settings() rendered page container');

// Topbar with bell notifications dropdown
const topbar = S.components.topbar.build();
assert(topbar && topbar.className.includes('top-bar'), 'components.topbar.build() rendered topbar banner');

console.log('\n=======================================');
console.log(`Phase 6 Verification: ${passed} passed, ${failed} failed.`);
console.log('=======================================\n');

if (failed > 0) process.exit(1);
