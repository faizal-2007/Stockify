// services/alerts.js — Live alerts & notifications scoped by subtree
(function () {
  'use strict';

  const selectors = window.Stockify.store.selectors;
  const storage   = window.Stockify.store.storage;

  /**
   * Compute scoped alerts list with navigation routes and severity.
   * @param {string} officeId
   * @param {string} role
   * @returns {Array<{ id: string, type: string, title: string, count: number, message: string, route: string }>}
   */
  function getAlerts(officeId, role) {
    const counts = selectors.getAlertCounts(officeId, role);
    const alerts = [];

    // 1. Out of Stock Alert (danger tint, bag-x / close icon)
    alerts.push({
      id: 'out-of-stock',
      type: 'danger',
      title: 'Out of Stock Alert',
      count: counts.outOfStock,
      message: counts.outOfStock > 0
        ? counts.outOfStock + ' item' + (counts.outOfStock === 1 ? ' is' : 's are') + ' out of stock'
        : 'All items are currently in stock',
      route: '#/inventory?status=out',
    });

    // 2. In Transit Too Long (green/teal tint, timer/clock icon)
    alerts.push({
      id: 'in-transit',
      type: 'success',
      title: 'In Transit Overdue',
      count: counts.inTransitLong,
      message: counts.inTransitLong > 0
        ? counts.inTransitLong + ' shipment' + (counts.inTransitLong === 1 ? '' : 's') + ' overdue in transit'
        : 'All shipments moving on schedule',
      route: '#/allocations?status=dispatched',
    });

    // 3. Low Stock Alert (warning/amber tint, alert triangle icon)
    alerts.push({
      id: 'low-stock',
      type: 'warning',
      title: 'Low Stock Alert',
      count: counts.lowStock,
      message: counts.lowStock > 0
        ? counts.lowStock + ' item' + (counts.lowStock === 1 ? ' is' : 's are') + ' running low'
        : 'Healthy stock levels across models',
      route: '#/inventory?status=low',
    });

    // 4. Pending Requests (blue/info tint, spinner / clipboard icon)
    alerts.push({
      id: 'pending-requests',
      type: 'info',
      title: 'Pending Requests',
      count: counts.pendingRequests,
      message: counts.pendingRequests > 0
        ? counts.pendingRequests + ' allocation request' + (counts.pendingRequests === 1 ? ' is' : 's are') + ' pending'
        : 'No pending allocation requests',
      route: '#/allocations?status=requested',
    });

    // 5. Password Reset Requests (for Head Office administrators)
    if (role === 'head') {
      const pwReqs = storage.get('password_requests') || [];
      const pendingPw = pwReqs.filter(function (r) { return r.status === 'pending'; }).length;
      alerts.push({
        id: 'password-requests',
        type: 'warning',
        title: 'Password Reset Requests',
        count: pendingPw,
        message: pendingPw > 0
          ? pendingPw + ' employee password reset request' + (pendingPw === 1 ? '' : 's') + ' pending approval'
          : 'All employee password requests resolved',
        route: '#/employees?tab=requests',
      });
    }

    return alerts;
  }

  /**
   * Total actionable alerts count (for notification badge)
   * @param {string} officeId
   * @param {string} role
   * @returns {number}
   */
  function getUnreadCount(officeId, role) {
    const counts = selectors.getAlertCounts(officeId, role);
    let total = counts.outOfStock + counts.inTransitLong + counts.pendingRequests;
    if (role === 'head') {
      const pwReqs = storage.get('password_requests') || [];
      total += pwReqs.filter(function (r) { return r.status === 'pending'; }).length;
    }
    return total;
  }

  window.Stockify.services.alerts = { getAlerts, getUnreadCount };
})();
