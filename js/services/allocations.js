// services/allocations.js — Allocation state machine, stock transit, and auditable history
(function () {
  'use strict';

  const storage   = window.Stockify.store.storage;
  const selectors = window.Stockify.store.selectors;
  const stockSvc  = window.Stockify.services.stock;
  const auth      = window.Stockify.services.auth;
  const idGen     = window.Stockify.utils.id;
  const events    = window.Stockify.events;

  function StateError(msg) { this.name = 'StateError'; this.message = msg; }
  StateError.prototype = Object.create(Error.prototype);

  function PermissionError(msg) { this.name = 'PermissionError'; this.message = msg; }
  PermissionError.prototype = Object.create(Error.prototype);

  function ValidationError(msg) { this.name = 'ValidationError'; this.message = msg; }
  ValidationError.prototype = Object.create(Error.prototype);

  /**
   * Helper to verify direct parent-child relationship.
   * Stock can only move between a direct parent and child.
   */
  function verifyDirectParentChild(parentId, childId) {
    const child = selectors.getOffice(childId);
    if (!child || child.parentId !== parentId) {
      throw new PermissionError('Invalid allocation route: Stock can only move between a direct parent office and its direct child.');
    }
  }

  /**
   * Get an allocation by ID with full item details.
   * @param {string} allocationId
   * @returns {Object|null}
   */
  function getById(allocationId) {
    const allocations = storage.get('allocations') || [];
    return allocations.find(function (a) { return a.id === allocationId; }) || null;
  }

  /**
   * List allocations scoped to the user's subtree.
   * A user sees allocations where their office or an office in their subtree is sender or receiver.
   * @param {Object} [filters] - { status, search, fromDate, toDate }
   * @returns {Array<Object>}
   */
  function list(filters) {
    const user = auth.getCurrentUser();
    if (!user) return [];

    const f = filters || {};
    const subtree = selectors.subtreeIds(user.officeId);
    const allocations = storage.get('allocations') || [];
    const offices = selectors.getAllOffices();
    const offMap = {};
    offices.forEach(function (o) { offMap[o.id] = o; });

    return allocations.filter(function (a) {
      // Scoping: sender or receiver must be in user's subtree
      const inScope = subtree.includes(a.fromId) || subtree.includes(a.toId);
      if (!inScope) return false;

      // Status filter
      if (f.status && f.status !== 'all' && a.status !== f.status) return false;

      // Search (code, sender name, receiver name)
      if (f.search && f.search.trim()) {
        const q = f.search.trim().toLowerCase();
        const fromName = (offMap[a.fromId] ? offMap[a.fromId].name : '').toLowerCase();
        const toName   = (offMap[a.toId] ? offMap[a.toId].name : '').toLowerCase();
        const matchCode = a.code.toLowerCase().includes(q);
        if (!matchCode && !fromName.includes(q) && !toName.includes(q)) return false;
      }

      // Date range filter
      if (f.fromDate) {
        const d = new Date(a.createdAt).getTime();
        if (d < new Date(f.fromDate).getTime()) return false;
      }
      if (f.toDate) {
        const d = new Date(a.createdAt).getTime();
        if (d > new Date(f.toDate).getTime()) return false;
      }

      return true;
    }).sort(function (a, b) {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }

  /**
   * Status summary counts for tabs.
   * @returns {{ all: number, requested: number, approved: number, dispatched: number, received: number }}
   */
  function getStatusCounts() {
    const all = list({ status: 'all' });
    const counts = { all: all.length, requested: 0, approved: 0, dispatched: 0, received: 0 };
    all.forEach(function (a) {
      if (counts[a.status] !== undefined) counts[a.status]++;
    });
    return counts;
  }

  /**
   * 1. PUSH ALLOCATION: Parent pushes stock to a direct child.
   * Status goes straight to 'dispatched'.
   * Immediately deducts stock from sender and places in transit.
   * @param {string} toId - Direct child office ID
   * @param {Array<{ productId: string, qty: number }>} items
   * @param {string} [note='']
   * @returns {Object} created allocation
   */
  function createPush(toId, items, note) {
    if (toId && typeof toId === 'object' && !Array.isArray(toId)) {
      items = toId.items;
      note = toId.note;
      toId = toId.toId;
    }
    const user = auth.getCurrentUser();
    if (!user) throw new PermissionError('Authentication required.');

    const fromId = user.officeId;
    const senderOffice = selectors.getOffice(fromId);
    if (!senderOffice || senderOffice.type === 'store') {
      throw new PermissionError('Stores cannot push allocations. Stores may only request stock.');
    }

    verifyDirectParentChild(fromId, toId);

    if (!items || items.length === 0) {
      throw new ValidationError('Allocation must contain at least one product line.');
    }

    // Verify sender has sufficient available stock for all lines
    items.forEach(function (it) {
      const available = selectors.getQty(fromId, it.productId);
      const prd = selectors.getProduct(it.productId);
      const prdName = prd ? prd.name : it.productId;
      if (it.qty <= 0 || !Number.isInteger(it.qty)) {
        throw new ValidationError('Quantity for ' + prdName + ' must be a positive integer.');
      }
      if (available < it.qty) {
        throw new ValidationError('Insufficient stock for ' + prdName + ' (Available: ' + available + ', Requested: ' + it.qty + ').');
      }
    });

    const alc = idGen.allocationId();
    const now = new Date().toISOString();

    const allocationItems = items.map(function (it) {
      return {
        productId: it.productId,
        qtyRequested: it.qty,
        qtyDispatched: it.qty,
        qtyReceived: 0,
      };
    });

    const record = {
      id: alc.id,
      code: alc.code,
      type: 'push',
      fromId: fromId,
      toId: toId,
      status: 'dispatched',
      items: allocationItems,
      note: note ? note.trim() : '',
      discrepancyNote: '',
      hasDiscrepancy: false,
      discrepancyAcknowledged: false,
      createdBy: user.id,
      createdAt: now,
      timeline: [
        { status: 'dispatched', at: now, by: user.id, note: 'Push allocation dispatched' }
      ],
    };

    // Deduct stock from sender and write movements
    items.forEach(function (it) {
      stockSvc.adjust(fromId, it.productId, -it.qty, {
        type: 'dispatch',
        refType: 'allocation',
        refId: record.code,
        fromId: fromId,
        toId: toId,
        by: user.id,
      });
    });

    const allocations = storage.get('allocations') || [];
    allocations.push(record);
    storage.set('allocations', allocations);

    events.emit('allocation:changed', { allocationId: record.id });
    return record;
  }

  /**
   * 2. STOCK REQUEST: Child requests stock from direct parent.
   * Status starts at 'requested'.
   * @param {Array<{ productId: string, qty: number }>} items
   * @param {string} [note='']
   * @returns {Object} created request
   */
  function createRequest(items, note) {
    const user = auth.getCurrentUser();
    if (!user) throw new PermissionError('Authentication required.');

    const childOffice = selectors.getOffice(user.officeId);
    if (!childOffice || !childOffice.parentId) {
      throw new PermissionError('Head Office cannot request stock (no parent).');
    }

    const toId = user.officeId; // receiver is the requester
    const fromId = childOffice.parentId; // sender will be the parent

    if (!items || items.length === 0) {
      throw new ValidationError('Request must contain at least one product item.');
    }

    items.forEach(function (it) {
      if (it.qty <= 0 || !Number.isInteger(it.qty)) {
        throw new ValidationError('Requested quantity must be a positive integer.');
      }
    });

    const alc = idGen.allocationId();
    const now = new Date().toISOString();

    const allocationItems = items.map(function (it) {
      return {
        productId: it.productId,
        qtyRequested: it.qty,
        qtyDispatched: 0,
        qtyReceived: 0,
      };
    });

    const record = {
      id: alc.id,
      code: alc.code,
      type: 'request',
      fromId: fromId,
      toId: toId,
      status: 'requested',
      items: allocationItems,
      note: note ? note.trim() : '',
      discrepancyNote: '',
      hasDiscrepancy: false,
      discrepancyAcknowledged: false,
      createdBy: user.id,
      createdAt: now,
      timeline: [
        { status: 'requested', at: now, by: user.id, note: 'Stock request submitted' }
      ],
    };

    const allocations = storage.get('allocations') || [];
    allocations.push(record);
    storage.set('allocations', allocations);

    events.emit('allocation:changed', { allocationId: record.id });
    return record;
  }

  /**
   * 3. APPROVE REQUEST: Parent approves child's request.
   * Status moves: requested -> approved.
   */
  function approve(allocationId) {
    const user = auth.getCurrentUser();
    const a = getById(allocationId);
    if (!a) throw new ValidationError('Allocation not found.');

    if (a.status !== 'requested') {
      throw new StateError('Cannot approve allocation in status: ' + a.status);
    }

    // Only the parent office (fromId) can approve
    if (!user || user.officeId !== a.fromId) {
      throw new PermissionError('Only the parent office can approve this request.');
    }

    const now = new Date().toISOString();
    a.status = 'approved';
    a.timeline.push({ status: 'approved', at: now, by: user.id, note: 'Request approved' });

    saveAllocation(a);
    events.emit('allocation:changed', { allocationId: a.id });
    return a;
  }

  /**
   * 4. REJECT REQUEST: Parent rejects child's request with reason.
   * Status moves: requested -> rejected.
   */
  function reject(allocationId, reason) {
    const user = auth.getCurrentUser();
    const a = getById(allocationId);
    if (!a) throw new ValidationError('Allocation not found.');

    if (a.status !== 'requested') {
      throw new StateError('Cannot reject allocation in status: ' + a.status);
    }
    if (!user || user.officeId !== a.fromId) {
      throw new PermissionError('Only the parent office can reject this request.');
    }
    if (!reason || !reason.trim()) {
      throw new ValidationError('A rejection reason is required.');
    }

    const now = new Date().toISOString();
    a.status = 'rejected';
    a.timeline.push({ status: 'rejected', at: now, by: user.id, note: reason.trim() });

    saveAllocation(a);
    events.emit('allocation:changed', { allocationId: a.id });
    return a;
  }

  /**
   * 5. DISPATCH APPROVED REQUEST: Parent dispatches items (full or partial).
   * Status moves: approved -> dispatched.
   * Deducts dispatched quantities from sender immediately.
   * @param {string} allocationId
   * @param {Array<{ productId: string, qtyDispatched: number }>} [dispatchItems]
   */
  function dispatch(allocationId, dispatchItems) {
    const user = auth.getCurrentUser();
    const a = getById(allocationId);
    if (!a) throw new ValidationError('Allocation not found.');

    if (a.status !== 'approved') {
      throw new StateError('Cannot dispatch allocation in status: ' + a.status + '. It must be approved first.');
    }
    if (!user || user.officeId !== a.fromId) {
      throw new PermissionError('Only the parent dispatching office can dispatch this allocation.');
    }

    // Update dispatched quantities if specified, otherwise dispatch full requested
    const dispatchMap = {};
    if (dispatchItems && dispatchItems.length > 0) {
      dispatchItems.forEach(function (it) { dispatchMap[it.productId] = it.qtyDispatched; });
    }

    a.items.forEach(function (item) {
      const qtyToDispatch = dispatchMap[item.productId] !== undefined ? dispatchMap[item.productId] : item.qtyRequested;
      const available = selectors.getQty(a.fromId, item.productId);
      const prd = selectors.getProduct(item.productId);
      const prdName = prd ? prd.name : item.productId;

      if (qtyToDispatch < 0 || !Number.isInteger(qtyToDispatch)) {
        throw new ValidationError('Dispatch quantity for ' + prdName + ' must be a non-negative integer.');
      }
      if (available < qtyToDispatch) {
        throw new ValidationError('Insufficient stock to dispatch ' + prdName + ' (Available: ' + available + ', Dispatching: ' + qtyToDispatch + ').');
      }

      item.qtyDispatched = qtyToDispatch;
    });

    const now = new Date().toISOString();
    a.status = 'dispatched';
    a.timeline.push({ status: 'dispatched', at: now, by: user.id, note: 'Shipment dispatched' });

    // Deduct stock from sender
    a.items.forEach(function (item) {
      if (item.qtyDispatched > 0) {
        stockSvc.adjust(a.fromId, item.productId, -item.qtyDispatched, {
          type: 'dispatch',
          refType: 'allocation',
          refId: a.code,
          fromId: a.fromId,
          toId: a.toId,
          by: user.id,
        });
      }
    });

    saveAllocation(a);
    events.emit('allocation:changed', { allocationId: a.id });
    return a;
  }

  /**
   * 6. CONFIRM RECEIPT: Receiving child confirms incoming allocation.
   * Status moves: dispatched -> received.
   * Adds received quantities to receiver stock.
   * If received < dispatched, flags discrepancy and writes discrepancy movement.
   * @param {string} allocationId
   * @param {Array<{ productId: string, qtyReceived: number }>} [receiveItems]
   * @param {string} [shortNote='']
   */
  function receive(allocationId, receiveItems, shortNote) {
    const user = auth.getCurrentUser();
    const a = getById(allocationId);
    if (!a) throw new ValidationError('Allocation not found.');

    if (a.status !== 'dispatched') {
      throw new StateError('Cannot confirm receipt for allocation in status: ' + a.status);
    }
    if (!user || user.officeId !== a.toId) {
      throw new PermissionError('Only the destination receiving office can confirm receipt.');
    }

    const receiveMap = {};
    if (receiveItems && receiveItems.length > 0) {
      receiveItems.forEach(function (it) { receiveMap[it.productId] = it.qtyReceived; });
    }

    let hasDiscrepancy = false;
    let discrepancyDetails = [];

    a.items.forEach(function (item) {
      const rec = receiveMap[item.productId] !== undefined ? receiveMap[item.productId] : item.qtyDispatched;
      if (rec < 0 || !Number.isInteger(rec)) {
        throw new ValidationError('Received quantity must be a non-negative integer.');
      }
      if (rec > item.qtyDispatched) {
        throw new ValidationError('Received quantity cannot exceed dispatched quantity.');
      }

      item.qtyReceived = rec;
      const shortfall = item.qtyDispatched - rec;
      if (shortfall > 0) {
        hasDiscrepancy = true;
        discrepancyDetails.push(shortfall + ' units shortfall');
      }
    });

    const now = new Date().toISOString();
    a.status = 'received';
    a.hasDiscrepancy = hasDiscrepancy;
    if (hasDiscrepancy) {
      a.discrepancyNote = shortNote ? shortNote.trim() : 'Short received: ' + discrepancyDetails.join(', ');
    }

    a.timeline.push({
      status: 'received',
      at: now,
      by: user.id,
      note: hasDiscrepancy ? 'Received with discrepancy: ' + a.discrepancyNote : 'Receipt confirmed in full',
    });

    // Add received stock to receiver
    a.items.forEach(function (item) {
      if (item.qtyReceived > 0) {
        stockSvc.adjust(a.toId, item.productId, item.qtyReceived, {
          type: 'receive',
          refType: 'allocation',
          refId: a.code,
          fromId: a.fromId,
          toId: a.toId,
          by: user.id,
        });
      }

      // Log discrepancy movement if any shortfall
      const shortfall = item.qtyDispatched - item.qtyReceived;
      if (shortfall > 0) {
        const movements = storage.get('movements') || [];
        movements.push({
          id: idGen.movementId(),
          at: now,
          type: 'discrepancy',
          productId: item.productId,
          qty: shortfall,
          fromId: a.fromId,
          toId: a.toId,
          refType: 'allocation',
          refId: a.code,
          by: user.id,
        });
        storage.set('movements', movements);
      }
    });

    saveAllocation(a);
    events.emit('allocation:changed', { allocationId: a.id });
    return a;
  }

  /**
   * 7. ACKNOWLEDGE DISCREPANCY: Sender acknowledges receipt discrepancy,
   * returning unreceived shortfall back to sender's stock.
   */
  function acknowledgeDiscrepancy(allocationId) {
    const user = auth.getCurrentUser();
    const a = getById(allocationId);
    if (!a) throw new ValidationError('Allocation not found.');

    if (a.status !== 'received' || !a.hasDiscrepancy) {
      throw new StateError('Allocation does not have an active unacknowledged discrepancy.');
    }
    if (a.discrepancyAcknowledged) {
      throw new StateError('Discrepancy has already been acknowledged.');
    }
    if (!user || user.officeId !== a.fromId) {
      throw new PermissionError('Only the original sender office can acknowledge the discrepancy.');
    }

    const now = new Date().toISOString();
    a.discrepancyAcknowledged = true;
    a.timeline.push({
      status: 'discrepancy_acknowledged',
      at: now,
      by: user.id,
      note: 'Discrepancy acknowledged by sender. Shortfall returned to sender stock.',
    });

    // Return the shortfall to the sender
    a.items.forEach(function (item) {
      const shortfall = item.qtyDispatched - item.qtyReceived;
      if (shortfall > 0) {
        stockSvc.adjust(a.fromId, item.productId, shortfall, {
          type: 'adjustment',
          refType: 'discrepancy_reconciliation',
          refId: a.code,
          fromId: null,
          toId: a.fromId,
          by: user.id,
        });
      }
    });

    saveAllocation(a);
    events.emit('allocation:changed', { allocationId: a.id });
    return a;
  }

  /**
   * 8. CANCEL: Cancel pre-dispatch allocation only (requested or approved).
   */
  function cancel(allocationId) {
    const user = auth.getCurrentUser();
    const a = getById(allocationId);
    if (!a) throw new ValidationError('Allocation not found.');

    if (a.status !== 'requested' && a.status !== 'approved') {
      throw new StateError('Only pre-dispatch allocations can be cancelled (current: ' + a.status + ').');
    }

    // Either party (requester or approver) can cancel
    if (!user || (user.officeId !== a.fromId && user.officeId !== a.toId)) {
      throw new PermissionError('Only the involved offices can cancel this allocation.');
    }

    const now = new Date().toISOString();
    a.status = 'cancelled';
    a.timeline.push({ status: 'cancelled', at: now, by: user.id, note: 'Allocation cancelled' });

    saveAllocation(a);
    events.emit('allocation:changed', { allocationId: a.id });
    return a;
  }

  function saveAllocation(allocation) {
    const allocations = storage.get('allocations') || [];
    const index = allocations.findIndex(function (item) { return item.id === allocation.id; });
    if (index !== -1) {
      allocations[index] = allocation;
      storage.set('allocations', allocations);
    }
  }

  window.Stockify.services.allocations = {
    list,
    getById,
    getStatusCounts,
    createPush,
    createPushAllocation: createPush,
    createRequest,
    createRequestAllocation: createRequest,
    approve,
    reject,
    dispatch,
    receive,
    confirmReceipt: receive,
    acknowledgeDiscrepancy,
    cancel,
    StateError,
    PermissionError,
    ValidationError,
  };
})();

