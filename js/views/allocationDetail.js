// views/allocationDetail.js — Allocation detail view/drawer with horizontal timeline, line items, and contextual actions
(function () {
  'use strict';

  const auth      = window.Stockify.services.auth;
  const allocSvc  = window.Stockify.services.allocations;
  const selectors = window.Stockify.store.selectors;
  const fmt       = window.Stockify.utils.format;
  const thumb     = window.Stockify.components.productThumb;
  const modal     = window.Stockify.components.modal;
  const toast     = window.Stockify.components.toast;

  /**
   * Render Allocation Detail View (#/allocations/:id).
   * @param {Object} params - { allocationId }
   * @returns {HTMLElement}
   */
  function render(params) {
    const user = auth.getCurrentUser();
    if (!user) return document.createElement('div');

    const page = document.createElement('div');
    page.className = 'page';

    const aId = params ? params.allocationId : null;
    const allocation = allocSvc.getById(aId);

    if (!allocation) {
      const card = document.createElement('div');
      card.className = 'card empty-state';
      card.innerHTML =
        '<h3 class="empty-state__title">Allocation Not Found</h3>' +
        '<p class="empty-state__body">The requested allocation record does not exist.</p>' +
        '<button class="btn btn--secondary mt-4" id="back-to-allocs">Back to Allocations</button>';
      card.querySelector('#back-to-allocs').addEventListener('click', function () {
        window.Stockify.router.navigate('#/allocations');
      });
      page.appendChild(card);
      return page;
    }

    // Subtree Scoping check: user must be in sender or receiver subtree
    const subtree = selectors.subtreeIds(user.officeId);
    if (!subtree.includes(allocation.fromId) && !subtree.includes(allocation.toId)) {
      const card = document.createElement('div');
      card.className = 'card empty-state';
      card.innerHTML =
        '<h3 class="empty-state__title">Access Restricted</h3>' +
        '<p class="empty-state__body">You do not have permission to view allocations outside your subtree.</p>';
      page.appendChild(card);
      return page;
    }

    const offices = selectors.getAllOffices();
    const offMap = {};
    offices.forEach(function (o) { offMap[o.id] = o; });

    const fromOffice = offMap[allocation.fromId];
    const toOffice   = offMap[allocation.toId];

    // Determine current user relationships
    const isSender   = user.officeId === allocation.fromId;
    const isReceiver = user.officeId === allocation.toId;

    // ── Header Bar ──
    const header = document.createElement('div');
    header.className = 'page-header';

    const left = document.createElement('div');
    left.className = 'flex items-center gap-3';

    const backBtn = document.createElement('button');
    backBtn.className = 'btn btn--secondary btn--sm';
    backBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg> <span>All Allocations</span>';
    backBtn.addEventListener('click', function () {
      window.Stockify.router.navigate('#/allocations');
    });

    const titleDiv = document.createElement('div');
    const title = document.createElement('h1');
    title.className = 'page-title';
    title.textContent = allocation.code;

    const routeSub = document.createElement('div');
    routeSub.className = 'flex items-center gap-2 mt-1';
    routeSub.innerHTML =
      '<span class="badge badge--' + (fromOffice ? fromOffice.type : 'head') + '">' + (fromOffice ? fromOffice.name : allocation.fromId) + '</span>' +
      '<span class="text-muted">➔</span>' +
      '<span class="badge badge--' + (toOffice ? toOffice.type : 'store') + '">' + (toOffice ? toOffice.name : allocation.toId) + '</span>' +
      '<span class="badge badge--' + allocation.status + '" style="margin-left:8px;">' + allocation.status.toUpperCase() + '</span>';

    titleDiv.appendChild(title);
    titleDiv.appendChild(routeSub);
    left.appendChild(backBtn);
    left.appendChild(titleDiv);
    header.appendChild(left);

    // Print Button on right
    const rightActions = document.createElement('div');
    rightActions.className = 'flex items-center gap-2';

    const printBtn = document.createElement('button');
    printBtn.className = 'btn btn--secondary btn--sm';
    printBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg> <span>Print Delivery Note</span>';
    printBtn.addEventListener('click', function () {
      window.print();
    });
    rightActions.appendChild(printBtn);
    header.appendChild(rightActions);

    page.appendChild(header);

    // ── Horizontal Status Timeline Card ──
    const timelineCard = document.createElement('div');
    timelineCard.className = 'card mb-5';
    timelineCard.innerHTML = '<h3 class="font-medium text-md mb-4">Allocation Progress</h3>';

    const timelineWrap = document.createElement('div');
    timelineWrap.className = 'alloc-timeline';

    const stages = [
      { key: 'requested', label: 'Requested' },
      { key: 'approved',  label: 'Approved' },
      { key: 'dispatched',label: 'Dispatched' },
      { key: 'received',  label: 'Received' },
    ];

    // Determine current stage index
    const stageOrder = ['requested', 'approved', 'dispatched', 'received'];
    let currentIdx = stageOrder.indexOf(allocation.status);
    if (allocation.status === 'rejected' || allocation.status === 'cancelled') {
      currentIdx = -1;
    }

    stages.forEach(function (st, idx) {
      const step = document.createElement('div');
      const isPast = idx <= currentIdx;
      const isCurrent = idx === currentIdx;

      step.className = 'timeline-step' + (isPast ? ' active' : '') + (isCurrent ? ' current' : '');

      const timelineEntry = allocation.timeline.find(function (t) { return t.status === st.key; });

      step.innerHTML =
        '<div class="timeline-step__marker">' +
          (isPast
            ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>'
            : '<span>' + (idx + 1) + '</span>') +
        '</div>' +
        '<div class="timeline-step__label font-medium">' + st.label + '</div>' +
        '<div class="timeline-step__time text-xs text-muted">' + (timelineEntry ? fmt.datetime(timelineEntry.at) : '—') + '</div>';

      timelineWrap.appendChild(step);
    });

    timelineCard.appendChild(timelineWrap);
    page.appendChild(timelineCard);

    // ── Discrepancy Alert Banner (if applicable) ──
    if (allocation.hasDiscrepancy) {
      const discBanner = document.createElement('div');
      discBanner.className = 'card mb-5';
      discBanner.style.background = 'var(--danger-tint)';
      discBanner.style.border = '1px solid var(--danger)';
      discBanner.innerHTML =
        '<div class="flex items-center gap-3">' +
          '<div style="color:var(--danger)"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></div>' +
          '<div class="flex-1">' +
            '<div class="font-semi" style="color:var(--danger)">Delivery Discrepancy Flagged</div>' +
            '<div class="text-sm">' + (allocation.discrepancyNote || 'Short received by destination store.') + '</div>' +
            '<div class="text-xs text-muted mt-1">' +
              (allocation.discrepancyAcknowledged
                ? 'Status: Discrepancy acknowledged by sender. Shortfall reconciled back to sender inventory.'
                : 'Status: Pending sender acknowledgment.') +
            '</div>' +
          '</div>' +
        '</div>';

      // If sender and not yet acknowledged -> Show "Acknowledge Discrepancy" action button
      if (isSender && !allocation.discrepancyAcknowledged) {
        const ackBtn = document.createElement('button');
        ackBtn.className = 'btn btn--primary btn--sm mt-3';
        ackBtn.textContent = 'Acknowledge Discrepancy & Reclaim Shortfall';
        ackBtn.addEventListener('click', function () {
          modal.confirm(
            'Confirm receipt discrepancy? The unreceived stock shortfall will be automatically returned back to your office inventory.',
            'Acknowledge Discrepancy',
            function () {
              try {
                allocSvc.acknowledgeDiscrepancy(allocation.id);
                toast.success('Discrepancy acknowledged. Shortfall returned to stock.');
                window.Stockify.router.handleRoute();
              } catch (err) {
                toast.error(err.message);
              }
            }
          );
        });
        discBanner.appendChild(ackBtn);
      }

      page.appendChild(discBanner);
    }

    // ── Allocation Line Items Table ──
    const itemsCard = document.createElement('div');
    itemsCard.className = 'card mb-5';
    itemsCard.style.padding = '0';
    itemsCard.style.overflow = 'hidden';

    const itemsHeader = document.createElement('div');
    itemsHeader.style.padding = '18px 24px';
    itemsHeader.style.borderBottom = '1px solid var(--border)';
    itemsHeader.innerHTML = '<h3 class="font-medium text-md">Consignment Line Items</h3>';
    itemsCard.appendChild(itemsHeader);

    const table = document.createElement('table');
    table.className = 'data-table';
    table.innerHTML =
      '<thead>' +
        '<tr>' +
          '<th style="width:56px">Photo</th>' +
          '<th>Product Model</th>' +
          '<th>SKU</th>' +
          '<th style="text-align:right">Requested</th>' +
          '<th style="text-align:right">Dispatched</th>' +
          '<th style="text-align:right">Received</th>' +
          '<th style="text-align:right">Unit Cost</th>' +
        '</tr>' +
      '</thead>';

    const tbody = document.createElement('tbody');

    allocation.items.forEach(function (item) {
      const prd = selectors.getProduct(item.productId);
      const tr = document.createElement('tr');

      // Photo
      const tdPhoto = document.createElement('td');
      tdPhoto.appendChild(thumb.create(prd, 44));
      tr.appendChild(tdPhoto);

      // Name & Brand
      const tdName = document.createElement('td');
      tdName.innerHTML =
        '<div class="font-medium">' + (prd ? prd.name : item.productId) + '</div>' +
        '<div class="text-xs text-muted">' + (prd ? prd.brand : '') + '</div>';
      tr.appendChild(tdName);

      // SKU
      const tdSku = document.createElement('td');
      tdSku.className = 'text-xs text-muted';
      tdSku.textContent = prd ? prd.sku : '—';
      tr.appendChild(tdSku);

      // Qty Requested
      const tdReq = document.createElement('td');
      tdReq.style.textAlign = 'right';
      tdReq.className = 'tabular-nums';
      tdReq.textContent = fmt.num(item.qtyRequested);
      tr.appendChild(tdReq);

      // Qty Dispatched
      const tdDisp = document.createElement('td');
      tdDisp.style.textAlign = 'right';
      tdDisp.className = 'tabular-nums font-semi';
      tdDisp.textContent = fmt.num(item.qtyDispatched);
      tr.appendChild(tdDisp);

      // Qty Received
      const tdRec = document.createElement('td');
      tdRec.style.textAlign = 'right';
      tdRec.className = 'tabular-nums font-semi';
      if (item.qtyDispatched > 0 && item.qtyReceived < item.qtyDispatched && allocation.status === 'received') {
        tdRec.style.color = 'var(--danger)';
      }
      tdRec.textContent = fmt.num(item.qtyReceived);
      tr.appendChild(tdRec);

      // Unit Cost
      const tdCost = document.createElement('td');
      tdCost.style.textAlign = 'right';
      tdCost.className = 'tabular-nums text-sm text-muted';
      tdCost.textContent = prd ? fmt.inr(prd.costPrice) : '—';
      tr.appendChild(tdCost);

      tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    itemsCard.appendChild(table);
    page.appendChild(itemsCard);

    // ── Contextual Action Bar at Bottom ──
    const actionBar = document.createElement('div');
    actionBar.className = 'card flex items-center justify-between';
    actionBar.style.padding = '16px 24px';

    const actionInfo = document.createElement('div');
    actionInfo.className = 'text-sm text-muted';
    actionInfo.textContent = allocation.note ? 'Notes: ' + allocation.note : 'No special delivery instructions.';
    actionBar.appendChild(actionInfo);

    const btnGroup = document.createElement('div');
    btnGroup.className = 'flex items-center gap-3';

    // 1. APPROVE / REJECT: Parent can approve/reject when status === 'requested'
    if (isSender && allocation.status === 'requested') {
      const rejectBtn = document.createElement('button');
      rejectBtn.className = 'btn btn--secondary';
      rejectBtn.style.color = 'var(--danger)';
      rejectBtn.textContent = 'Reject Request';
      rejectBtn.addEventListener('click', function () {
        const reasonInput = document.createElement('input');
        reasonInput.type = 'text';
        reasonInput.className = 'input mt-2';
        reasonInput.placeholder = 'State why this request cannot be fulfilled…';

        modal.show({
          title: 'Reject Stock Request',
          content: reasonInput,
          confirmText: 'Reject Request',
          confirmClass: 'btn--danger',
          onConfirm: function () {
            const reason = reasonInput.value.trim();
            if (!reason) {
              toast.error('Rejection reason is required.');
              return;
            }
            try {
              allocSvc.reject(allocation.id, reason);
              toast.success('Stock request rejected.');
              window.Stockify.router.handleRoute();
            } catch (err) {
              toast.error(err.message);
            }
          }
        });
      });

      const approveBtn = document.createElement('button');
      approveBtn.className = 'btn btn--primary';
      approveBtn.textContent = 'Approve Request';
      approveBtn.addEventListener('click', function () {
        try {
          allocSvc.approve(allocation.id);
          toast.success('Stock request approved.');
          window.Stockify.router.handleRoute();
        } catch (err) {
          toast.error(err.message);
        }
      });

      btnGroup.appendChild(rejectBtn);
      btnGroup.appendChild(approveBtn);
    }

    // 2. DISPATCH: Parent can dispatch when status === 'approved'
    if (isSender && allocation.status === 'approved') {
      const dispatchBtn = document.createElement('button');
      dispatchBtn.className = 'btn btn--primary';
      dispatchBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg> <span>Dispatch Consignment</span>';
      dispatchBtn.addEventListener('click', function () {
        modal.confirm(
          'Dispatch stock now? Dispatched quantities will be deducted from your inventory immediately.',
          'Confirm Dispatch',
          function () {
            try {
              allocSvc.dispatch(allocation.id);
              toast.success('Consignment dispatched successfully.');
              window.Stockify.router.handleRoute();
            } catch (err) {
              toast.error(err.message);
            }
          }
        );
      });
      btnGroup.appendChild(dispatchBtn);
    }

    // 3. CONFIRM RECEIPT: Receiver can receive when status === 'dispatched'
    if (isReceiver && allocation.status === 'dispatched') {
      const confirmReceiptBtn = document.createElement('button');
      confirmReceiptBtn.className = 'btn btn--primary';
      confirmReceiptBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> <span>Confirm Receipt</span>';

      confirmReceiptBtn.addEventListener('click', function () {
        // Modal with item checklist to confirm exact units received
        const formWrap = document.createElement('div');
        formWrap.innerHTML = '<p class="text-sm text-muted mb-3">Verify received physical quantities against dispatch count:</p>';

        const recInputs = {};
        allocation.items.forEach(function (it) {
          const prd = selectors.getProduct(it.productId);
          const row = document.createElement('div');
          row.className = 'flex justify-between items-center py-2';
          row.innerHTML =
            '<div class="text-sm font-medium">' + (prd ? prd.name : it.productId) + ' (Dispatched: ' + it.qtyDispatched + ')</div>';

          const inp = document.createElement('input');
          inp.type = 'number';
          inp.className = 'input tabular-nums text-center';
          inp.style.width = '80px';
          inp.style.height = '32px';
          inp.min = '0';
          inp.max = String(it.qtyDispatched);
          inp.value = String(it.qtyDispatched);

          row.appendChild(inp);
          formWrap.appendChild(row);
          recInputs[it.productId] = inp;
        });

        const noteInput = document.createElement('input');
        noteInput.type = 'text';
        noteInput.className = 'input mt-3';
        noteInput.placeholder = 'Discrepancy / damages note (optional if full receipt)';
        formWrap.appendChild(noteInput);

        modal.show({
          title: 'Confirm Stock Receipt',
          content: formWrap,
          confirmText: 'Accept Consignment',
          confirmClass: 'btn--primary',
          onConfirm: function () {
            const receiveItems = allocation.items.map(function (it) {
              return {
                productId: it.productId,
                qtyReceived: Number(recInputs[it.productId].value) || 0,
              };
            });

            try {
              allocSvc.receive(allocation.id, receiveItems, noteInput.value);
              toast.success('Stock received and added to your inventory.');
              window.Stockify.router.handleRoute();
            } catch (err) {
              toast.error(err.message);
            }
          }
        });
      });

      btnGroup.appendChild(confirmReceiptBtn);
    }

    // 4. CANCEL: Can cancel before dispatch
    if ((isSender || isReceiver) && (allocation.status === 'requested' || allocation.status === 'approved')) {
      const cancelBtn = document.createElement('button');
      cancelBtn.className = 'btn btn--ghost btn--sm';
      cancelBtn.style.color = 'var(--text-muted)';
      cancelBtn.textContent = 'Cancel Allocation';
      cancelBtn.addEventListener('click', function () {
        modal.confirm('Are you sure you want to cancel this allocation request?', 'Cancel Allocation', function () {
          try {
            allocSvc.cancel(allocation.id);
            toast.info('Allocation cancelled.');
            window.Stockify.router.handleRoute();
          } catch (err) {
            toast.error(err.message);
          }
        });
      });
      btnGroup.appendChild(cancelBtn);
    }

    actionBar.appendChild(btnGroup);
    page.appendChild(actionBar);

    return page;
  }

  window.Stockify.views.allocationDetail = render;
})();

