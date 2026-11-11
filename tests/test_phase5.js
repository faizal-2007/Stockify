// tests/test_phase5.js — Comprehensive verification suite for Phase 5 (Network & Sales)
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
      if (selector.startsWith('#')) {
        const id = selector.slice(1);
        function find(node) {
          if (node.id === id) return node;
          for (let c of node.children) {
            const res = find(c);
            if (res) return res;
          }
          return null;
        }
        return find(el);
      }
      return null;
    };
    el.querySelectorAll = function (selector) {
      const matches = [];
      function walk(node) {
        if (selector === '.tree-node-wrap' && node.className && node.className.includes('tree-node-wrap')) {
          matches.push(node);
        }
        if (selector === '.payment-toggle__btn' && node.className && node.className.includes('payment-toggle__btn')) {
          matches.push(node);
        }
        if (selector === 'button' && node.tagName === 'BUTTON') {
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
  }
};

const storeData = {};
global.localStorage = {
  getItem: function (key) { return storeData[key] !== undefined ? storeData[key] : null; },
  setItem: function (key, val) { storeData[key] = String(val); },
  removeItem: function (key) { delete storeData[key]; },
  clear: function () { for (let k in storeData) delete storeData[k]; }
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
  'js/components/toast.js',
  'js/components/modal.js',
  'js/components/drawer.js',
  'js/components/productThumb.js',
  'js/components/kpiCard.js',
  'js/components/barChart.js',
  'js/components/gauge.js',
  'js/views/network.js',
  'js/views/officeDetail.js',
  'js/views/sales.js',
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

console.log('\n--- 1. Testing services/offices.js ---');

// Login as Head Office
S.services.auth.login('usr_001'); // Mohammed Faizal (head)

const hierarchy = S.services.offices.getHierarchy();
assert(hierarchy !== null, 'Hierarchy root exists');
assert(hierarchy.id === 'off_001' && hierarchy.type === 'head', 'Root is Head Office off_001');
assert(hierarchy.children.length === 3, 'Head Office has 3 Zones');
assert(hierarchy.metrics.totalUnits === 3010, 'Total physical units across all offices = 3,010');
assert(hierarchy.metrics.storesCount === 12, '12 stores under Head Office management');

// Zone hierarchy
const southZone = hierarchy.children.find(c => c.id === 'off_002');
assert(southZone !== null, 'South Zone exists');
assert(southZone.children.length === 2, 'South Zone has 2 Districts');
assert(southZone.metrics.storesCount === 4, 'South Zone manages 4 stores');

// Detail of an office
const hoDetail = S.services.offices.getOfficeDetail('off_001');
assert(hoDetail.office.name === 'Head Office', 'HO detail office object retrieved');
assert(hoDetail.inventory.length === 15, 'HO inventory lists all 15 products');
assert(hoDetail.children.length === 3, 'HO has 3 child zones');

// Office creation - permission checks
assert(S.services.offices.canManageOffice('zone') === true, 'Head Office user can manage zones');
assert(S.services.offices.canManageOffice('district') === true, 'Head Office user can manage districts');
assert(S.services.offices.canManageOffice('store') === true, 'Head Office user can manage stores');

// Switch to Zone user
S.services.auth.login('usr_002'); // Priya Rajan (South Zone off_002)
assert(S.services.offices.canManageOffice('zone') === false, 'Zone user cannot create/manage zones');
assert(S.services.offices.canManageOffice('district', 'off_002') === true, 'Zone user can create district in South Zone');
assert(S.services.offices.canManageOffice('district', 'off_003') === false, 'Zone user cannot create district in West Zone');

// Switch to District user
S.services.auth.login('usr_005'); // Tamil Nadu district off_005
assert(S.services.offices.canManageOffice('district') === false, 'District user cannot create district');
assert(S.services.offices.canManageOffice('store', 'off_005') === true, 'District user can create store in own district');
assert(S.services.offices.canManageOffice('store', 'off_006') === false, 'District user cannot create store in other district');

// Switch to Store user
S.services.auth.login('usr_011'); // Store off_011
assert(S.services.offices.canManageOffice('store') === false, 'Store user has read-only office permissions');

// Test office creation & hierarchy validation
S.services.auth.login('usr_001'); // HO
let createdOffice;
try {
  createdOffice = S.services.offices.createOffice({
    type: 'store',
    parentId: 'off_005', // Tamil Nadu district
    code: 'STR-TEST-01',
    name: 'Coimbatore Airport Store',
    city: 'Coimbatore',
    manager: 'Anand Kumar',
  });
  assert(createdOffice.id.startsWith('off_'), 'New office created with valid ID: ' + createdOffice.id);
  assert(createdOffice.code === 'STR-TEST-01', 'Office code assigned');
  assert(createdOffice.type === 'store', 'Office type is store');

  // Check initial stock ledger
  const stock = S.store.storage.get('stock');
  const initRows = stock.filter(s => s.officeId === createdOffice.id);
  assert(initRows.length === 15, 'Initialized 15 stock rows for the new store');
  assert(initRows.every(s => s.qty === 0), 'All initial stock quantities are 0');
} catch (e) {
  assert(false, 'Office creation failed: ' + e.message);
}

// Invalid parent hierarchy validation
let hierarchyErrorCaught = false;
try {
  S.services.offices.createOffice({
    type: 'store',
    parentId: 'off_001', // Direct store under HO is forbidden! (must be district)
    code: 'STR-FAIL',
    name: 'Invalid Store',
    city: 'Bengaluru',
    manager: 'Test',
  });
} catch (e) {
  hierarchyErrorCaught = true;
  assert(true, 'Correctly rejected invalid parent hierarchy: ' + e.message);
}
assert(hierarchyErrorCaught, 'Hierarchy violation error was triggered');

// Duplicate code rejection
let duplicateCodeError = false;
try {
  S.services.offices.createOffice({
    type: 'store',
    parentId: 'off_005',
    code: 'STR-TEST-01', // Duplicate code!
    name: 'Another Store',
    city: 'Coimbatore',
    manager: 'Test',
  });
} catch (e) {
  duplicateCodeError = true;
  assert(true, 'Correctly rejected duplicate office code: ' + e.message);
}
assert(duplicateCodeError, 'Duplicate code error was triggered');

console.log('\n--- 2. Testing services/sales.js ---');

// Login as Store user for Chennai Central (off_011)
S.services.auth.login('usr_011');
const storeId = 'off_011';
const productId = 'prd_001'; // iPhone 15 Pro Max
const initialStock = S.services.stock.getStock(storeId, productId);
assert(initialStock > 0, 'Store off_011 has initial stock of prd_001: ' + initialStock + ' units');

// Non-store user cannot record sales
S.services.auth.login('usr_001'); // Head Office
let hoSaleError = false;
try {
  S.services.sales.recordSale({
    storeId: storeId,
    productId: productId,
    qty: 1,
    unitPrice: 134900,
  });
} catch (e) {
  hoSaleError = true;
  assert(true, 'Correctly blocked non-store user from recording sale: ' + e.message);
}
assert(hoSaleError, 'Permission check for store-only sale passed');

// Switch back to Store user
S.services.auth.login('usr_011');

// Negative / zero quantity rejected
let invalidQtyError = false;
try {
  S.services.sales.recordSale({
    storeId: storeId,
    productId: productId,
    qty: 0,
    unitPrice: 134900,
  });
} catch (e) {
  invalidQtyError = true;
  assert(true, 'Correctly blocked sale with zero qty: ' + e.message);
}
assert(invalidQtyError, 'Zero quantity error handled');

// Excessive quantity rejected (Stock never goes negative!)
let excessiveQtyError = false;
try {
  S.services.sales.recordSale({
    storeId: storeId,
    productId: productId,
    qty: initialStock + 10,
    unitPrice: 134900,
  });
} catch (e) {
  excessiveQtyError = true;
  assert(true, 'Correctly blocked sale exceeding available stock: ' + e.message);
}
assert(excessiveQtyError, 'Negative stock prevention on sale passed');

// Successful Sale
let recordedSale;
try {
  recordedSale = S.services.sales.recordSale({
    storeId: storeId,
    productId: productId,
    qty: 2,
    unitPrice: 134900,
    payment: 'upi',
    customer: { name: 'Karthik Raja', phone: '9840012345' },
  });
  assert(recordedSale.id.startsWith('sal_'), 'Sale recorded with ID: ' + recordedSale.id);
  assert(recordedSale.qty === 2, 'Sale qty recorded as 2');
  assert(recordedSale.payment === 'upi', 'Payment mode recorded as upi');
  assert(recordedSale.customer.name === 'Karthik Raja', 'Customer name recorded');

  // Verify stock deduction
  const newStock = S.services.stock.getStock(storeId, productId);
  assert(newStock === initialStock - 2, 'Physical store stock accurately decremented from ' + initialStock + ' to ' + newStock);

  // Verify movement recorded
  const movements = S.store.storage.get('movements');
  const saleMov = movements.find(m => m.refId === recordedSale.id && m.type === 'sale');
  assert(saleMov !== undefined, 'Movement ledger recorded sale entry');
  assert(saleMov.qty === 2 && saleMov.fromId === storeId, 'Movement qty is 2 from store');
} catch (e) {
  assert(false, 'Valid sale recording failed: ' + e.message);
}

// Customer Return
try {
  const returnRecord = S.services.sales.recordReturn({
    saleId: recordedSale.id,
    qty: 1,
    reason: 'Customer requested model exchange',
  });
  assert(returnRecord.id.startsWith('sal_'), 'Return recorded with ID: ' + returnRecord.id);
  assert(returnRecord.type === 'return', 'Record type is return');
  assert(returnRecord.originalSaleId === recordedSale.id, 'Original sale ID linked');

  // Verify stock restored
  const restoredStock = S.services.stock.getStock(storeId, productId);
  assert(restoredStock === initialStock - 1, 'Stock restored by 1 unit after return: ' + restoredStock);

  // Verify return movement
  const movements = S.store.storage.get('movements');
  const returnMov = movements.find(m => m.refId === returnRecord.id && m.type === 'return');
  assert(returnMov !== undefined && returnMov.qty === 1 && returnMov.toId === storeId, 'Movement ledger recorded positive return movement (+1) to store');
} catch (e) {
  assert(false, 'Customer return failed: ' + e.message);
}

// Return quantity exceeding sale quantity rejected
let excessiveReturnError = false;
try {
  S.services.sales.recordReturn({
    saleId: recordedSale.id,
    qty: 2, // 1 already returned, only 1 remaining!
    reason: 'Excessive return attempt',
  });
} catch (e) {
  excessiveReturnError = true;
  assert(true, 'Correctly blocked return exceeding remaining quantity: ' + e.message);
}
assert(excessiveReturnError, 'Over-return prevention passed');

// Monthly targets management
S.services.auth.login('usr_001'); // HO
const targets = S.services.sales.getTargets();
assert(targets.length === 13, 'Monthly targets retrieved for all 13 stores in subtree (12 seeded + 1 created)');
const t1 = targets[0];
assert(t1.storeId && t1.amount >= 0 && t1.achieved >= 0, 'Target record has storeId, amount, and achieved metrics');

// Update target
S.services.sales.setTarget(storeId, t1.month, 1500000);
const updatedTargets = S.services.sales.getTargets();
const updatedT = updatedTargets.find(t => t.storeId === storeId);
assert(updatedT.amount === 1500000, 'Monthly target updated successfully to 15,00,000');

console.log('\n--- 3. Testing Views Render ---');

// Render network view (HO user)
const networkEl = S.views.network();
assert(networkEl !== null && networkEl.className.includes('page'), 'views.network() rendered page shell');

// Render officeDetail view
const officeDetailEl = S.views.officeDetail({ officeId: 'off_001' });
assert(officeDetailEl !== null && officeDetailEl.className.includes('page'), 'views.officeDetail(HO) rendered');

const storeDetailEl = S.views.officeDetail({ officeId: 'off_011' });
assert(storeDetailEl !== null && storeDetailEl.className.includes('page'), 'views.officeDetail(Store) rendered');

// Render sales view for Store user
S.services.auth.login('usr_011');
const storeSalesEl = S.views.sales();
assert(storeSalesEl !== null && storeSalesEl.className.includes('page'), 'views.sales(Store POS) rendered');

// Render sales view for HO user
S.services.auth.login('usr_001');
const hoSalesEl = S.views.sales();
assert(hoSalesEl !== null && hoSalesEl.className.includes('page'), 'views.sales(HO Analytics) rendered');

console.log('\n=======================================');
console.log(`Phase 5 Verification: ${passed} passed, ${failed} failed.`);
console.log('=======================================\n');

if (failed > 0) process.exit(1);
