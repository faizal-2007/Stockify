// tests/test_employee_governance.js — Tests for Login Portal, Command Chain Governance, Password Resets & Personnel Reports
const fs = require('fs');
const path = require('path');

// Setup DOM and window mock
const mockStorage = {};
const mockLocalStorage = {
  getItem(key) { return mockStorage[key] !== undefined ? mockStorage[key] : null; },
  setItem(key, val) { mockStorage[key] = String(val); },
  removeItem(key) { delete mockStorage[key]; },
  clear() { Object.keys(mockStorage).forEach(k => delete mockStorage[k]); }
};

global.localStorage = mockLocalStorage;
global.window = {
  localStorage: mockLocalStorage,
  location: { hash: '', href: '' },
  addEventListener: () => {},
  dispatchEvent: () => {},
  CustomEvent: class CustomEvent { constructor(name, detail) { this.name = name; this.detail = detail; } }
};
global.document = {
  documentElement: { setAttribute: () => {}, getAttribute: () => 'light' },
  addEventListener: () => {}
};

// Load dependencies
function loadScript(relPath) {
  const code = fs.readFileSync(path.join(__dirname, '..', relPath), 'utf8');
  eval(code);
}

loadScript('js/namespace.js');
loadScript('js/events.js');
loadScript('js/utils/format.js');
loadScript('js/utils/dom.js');
loadScript('js/utils/id.js');
loadScript('js/utils/validate.js');
loadScript('js/utils/csv.js');
loadScript('js/store/storage.js');
loadScript('js/store/seed.js');
loadScript('js/store/selectors.js');
loadScript('js/services/auth.js');
loadScript('js/services/alerts.js');
loadScript('js/services/reports.js');

const auth = window.Stockify.services.auth;
const storage = window.Stockify.store.storage;
const seed = window.Stockify.store.seed;
const reports = window.Stockify.services.reports;

let passed = 0;
let failed = 0;

function assert(condition, desc) {
  if (condition) {
    console.log('  PASS: ' + desc);
    passed++;
  } else {
    console.error('  FAIL: ' + desc);
    failed++;
  }
}

console.log('=====================================================');
console.log('TEST: EMPLOYEE GOVERNANCE, PASSWORDS & COMMAND CHAIN');
console.log('=====================================================');

// 1. Seed
seed.seed();
const offices = storage.get('offices');
const users = storage.get('users');
assert(offices.length === 756, 'Karnataka offices count is 756');
assert(users.length === 759, 'Karnataka employees count is 759');

// 2. Head Office Admin Login with Password
try {
  auth.login('usr_001', 'Stockify@123');
  const curUser = auth.getCurrentUser();
  assert(curUser && curUser.id === 'usr_001', 'Head Office Admin (usr_001) logged in successfully with valid password');
  assert(curUser.role === 'head', 'Head Office Admin has "head" role');
} catch (e) {
  assert(false, 'Login failed: ' + e.message);
}

// 3. Login with Wrong Password
let rejectedWrongPwd = false;
try {
  auth.login('usr_001', 'WrongPassword!123');
} catch (e) {
  rejectedWrongPwd = true;
  assert(true, 'Login with incorrect password correctly rejected: ' + e.message);
}
assert(rejectedWrongPwd, 'Invalid password was blocked');

// 4. Login by Email
try {
  auth.login('faizal@stockify.in', 'Stockify@123');
  assert(auth.getCurrentUser().id === 'usr_001', 'Login by email address (faizal@stockify.in) succeeded');
} catch (e) {
  assert(false, 'Email login failed: ' + e.message);
}

// 5. Store Lead Login
try {
  auth.login('usr_009', 'Stockify@123');
  assert(auth.getCurrentUser().role === 'store', 'Store Lead (usr_009 - Arjun Kumar) logged in with role "store"');
} catch (e) {
  assert(false, 'Store lead login failed: ' + e.message);
}

// 6. Forgot Password Request by Employee
let resetReq = null;
try {
  resetReq = auth.requestPasswordReset('usr_009', 'Store tablet was replaced, forgot retail terminal password.');
  assert(resetReq && resetReq.id && resetReq.id.startsWith('pr_'), 'Password reset request created: ' + resetReq.id);
  assert(resetReq.status === 'pending', 'Reset request status is pending');
  assert(resetReq.userName === 'Arjun Kumar', 'Correct user attached to request: ' + resetReq.userName);
} catch (e) {
  assert(false, 'Reset request failed: ' + e.message);
}

// 7. Head Office Reviews and Resolves Reset Request
auth.login('usr_001', 'Stockify@123'); // HO logs in
const pendingRequests = auth.getPasswordResetRequests({ status: 'pending' });
assert(pendingRequests.length >= 1, 'Head Office sees pending password reset requests (count: ' + pendingRequests.length + ')');

try {
  const updatedReq = auth.resolvePasswordReset(resetReq.id, 'NewMangaluruStore@2026');
  assert(updatedReq.status === 'resolved', 'Head Office successfully resolved reset request');
  assert(updatedReq.resolvedBy === 'usr_001', 'Head Office recorded as resolver');
} catch (e) {
  assert(false, 'Resolve failed: ' + e.message);
}

// 8. Verify Employee Can Now Log In With New Password
try {
  auth.login('usr_009', 'NewMangaluruStore@2026');
  assert(auth.getCurrentUser().id === 'usr_009', 'Employee successfully logged in using new password set by Head Office');
} catch (e) {
  assert(false, 'Login with new password failed: ' + e.message);
}

// 9. Head Office Creates New Admin / Employee
auth.login('usr_001', 'Stockify@123');
let newEmp = null;
try {
  newEmp = auth.createUser({
    name: 'Suresh Bhat',
    email: 'suresh.bhat@stockify.in',
    phone: '+91 94481 23456',
    officeId: 'off_001',
    role: 'head',
    designation: 'Senior Inventory Director',
    password: 'HOSecretPassword@2026',
    active: true
  });
  assert(newEmp && newEmp.id, 'Head Office successfully created new admin user: ' + newEmp.id);
} catch (e) {
  assert(false, 'Create user failed: ' + e.message);
}

// 10. Non-HO cannot create or alter users
auth.login('usr_009', 'NewMangaluruStore@2026');
let nonHoBlocked = false;
try {
  auth.createUser({
    name: 'Unauthorized User',
    email: 'unauth@stockify.in',
    officeId: 'off_005',
    role: 'store',
    password: 'Pass'
  });
} catch (e) {
  nonHoBlocked = true;
  assert(true, 'Non-HO user blocked from creating users: ' + e.message);
}
assert(nonHoBlocked, 'Strict command chain authority enforced');

// 11. Head Office Alters Employee Password Directly
auth.login('usr_001', 'Stockify@123');
try {
  auth.updateUser(newEmp.id, { password: 'UpdatedAdminPass@999' });
  auth.login(newEmp.id, 'UpdatedAdminPass@999');
  assert(auth.getCurrentUser().id === newEmp.id, 'Employee logged in after direct password alteration by Head Office');
} catch (e) {
  assert(false, 'Direct password alteration failed: ' + e.message);
}

// 12. Deactivate User Account & Prevent Login
auth.login('usr_001', 'Stockify@123');
auth.updateUser(newEmp.id, { active: false });
let deactivatedBlocked = false;
try {
  auth.login(newEmp.id, 'UpdatedAdminPass@999');
} catch (e) {
  deactivatedBlocked = true;
  assert(true, 'Deactivated account correctly prevented from logging in: ' + e.message);
}
assert(deactivatedBlocked, 'Deactivation security check succeeded');

// 13. Reports: Employee & Personnel Report for Head Office (Entire Network)
auth.login('usr_001', 'Stockify@123');
const hoEmpReport = reports.employeeReport();
assert(hoEmpReport.totals.totalStaff >= 759, 'Head Office report covers entire personnel roster (' + hoEmpReport.totals.totalStaff + ' staff)');
assert(hoEmpReport.totals.headCount >= 4, 'Head Office count: ' + hoEmpReport.totals.headCount);
assert(hoEmpReport.totals.zoneCount >= 4, 'Zonal Directors count: ' + hoEmpReport.totals.zoneCount);
assert(hoEmpReport.totals.districtCount >= 31, 'District Managers count: ' + hoEmpReport.totals.districtCount);
assert(hoEmpReport.totals.talukCount >= 240, 'Taluk Officers count: ' + hoEmpReport.totals.talukCount);
assert(hoEmpReport.totals.storeCount >= 480, 'Store Leads count: ' + hoEmpReport.totals.storeCount);

// 14. Reports: Scoped Employee Report by specific District
const dkBantwalReport = reports.employeeReport({ officeId: 'off_003' }); // Dakshina Kannada District
assert(dkBantwalReport.rows.length > 0 && dkBantwalReport.rows.length < hoEmpReport.totals.totalStaff,
  'Scoped report for Dakshina Kannada District returns jurisdiction personnel (' + dkBantwalReport.rows.length + ' staff)');

// 15. Reports: Filter by role
const talukOfficersReport = reports.employeeReport({ role: 'taluk' });
assert(talukOfficersReport.rows.length === 240, 'Filtered report for taluk officers returns all 240 officers');

console.log('=====================================================');
console.log('RESULT: ' + passed + ' passed, ' + failed + ' failed.');
console.log('=====================================================');
if (failed > 0) process.exit(1);
