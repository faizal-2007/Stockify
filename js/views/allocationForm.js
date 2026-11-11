// views/allocationForm.js — Push allocation (#/allocations/new) and Stock request (#/allocations/request)
(function () {
  'use strict';

  const auth      = window.Stockify.services.auth;
  const allocSvc  = window.Stockify.services.allocations;
  const prodSvc   = window.Stockify.services.products;
  const selectors = window.Stockify.store.selectors;
  const fmt       = window.Stockify.utils.format;
  const thumb     = window.Stockify.components.productThumb;
  const modal     = window.Stockify.components.modal;
  const toast     = window.Stockify.components.toast;

  /**
   * Render New Allocation (Push) or Stock Request View.
   * Path determines behavior:
   * #/allocations/new -> Push (Parent -> Direct Child)
   * #/allocations/request -> Request (Child -> Direct Parent)
   * @returns {HTMLElement}
   */
  function render() {
    const user = auth.getCurrentUser();
    if (!user) return document.createElement('div');

    const hash = (typeof window !== 'undefined' && window.location && window.location.hash) ? window.location.hash : '';
    const isRequest = hash.includes('request');

    // Role checks:
    // Push is allowed for HO, Zone, District (Stores cannot push)
    if (!isRequest && user.role === 'store') {
      const page = document.createElement('div');
      page.className = 'page';
      const card = document.createElement('div');
      card.className = 'card empty-state';
      card.innerHTML =
        '<h3 class="empty-state__title">Access Restricted</h3>' +
        '<p class="empty-state__body">Retail stores cannot push stock allocations. Please use Stock Request instead.</p>' +
        '<button class="btn btn--secondary mt-4" id="goto-request">Go to Stock Request</button>';
      card.querySelector('#goto-request').addEventListener('click', function () {
        window.Stockify.router.navigate('#/allocations/request');
      });
      page.appendChild(card);
      return page;
    }

    // Request is allowed for Zone, District, Store (HO has no parent)
    if (isRequest && user.role === 'head') {
      const page = document.createElement('div');
      page.className = 'page';
      const card = document.createElement('div');
      card.className = 'card empty-state';
      card.innerHTML =
        '<h3 class="empty-state__title">Access Restricted</h3>' +
        '<p class="empty-state__body">Head Office has no parent office and cannot request stock.</p>';
      page.appendChild(card);
      return page;
    }

    const page = document.createElement('div');
    page.className = 'page';

    // ── Header Bar ──
    const header = document.createElement('div');
    header.className = 'page-header';

    const left = document.createElement('div');
    left.className = 'flex items-center gap-3';

    const backBtn = document.createElement('button');
    backBtn.className = 'btn btn--secondary btn--sm';
    backBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg> <span>Cancel</span>';
    backBtn.addEventListener('click', function () {
      window.Stockify.router.navigate('#/allocations');
    });

    const titleDiv = document.createElement('div');
    const title = document.createElement('h1');
    title.className = 'page-title';
    title.textContent = isRequest ? 'Request Stock from Parent' : 'New Stock Allocation (Push)';

    const subtitle = document.createElement('p');
    subtitle.className = 'text-sm text-muted';
    subtitle.textContent = isRequest
      ? 'Select required models to order replenishment from your direct parent office.'
      : 'Select a direct child branch and assign available inventory lines for dispatch.';

    titleDiv.appendChild(title);
    titleDiv.appendChild(subtitle);
    left.appendChild(backBtn);
    left.appendChild(titleDiv);
    header.appendChild(left);
    page.appendChild(header);

    // Form Layout (2 Columns: Product Selection Grid on left, Destination & Summary Panel on right)
    const layout = document.createElement('div');
    layout.style.display = 'grid';
    layout.style.gridTemplateColumns = 'repeat(auto-fit, minmax(360px, 1fr))';
    layout.style.gap = '24px';

    // ── LEFT: Product Picker Grid with Search & Filters ──
    const leftCol = document.createElement('div');
    leftCol.style.display = 'flex';
    leftCol.style.flexDirection = 'column';
    leftCol.style.gap = '16px';

    // Filter Bar for Product Picker
    const pickerFilterCard = document.createElement('div');
    pickerFilterCard.className = 'card flex items-center gap-2';
    pickerFilterCard.style.padding = '12px 16px';

    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.className = 'input';
    searchInput.placeholder = 'Search models…';
    searchInput.style.height = '36px';
    searchInput.style.flex = '1';

    const catSelect = document.createElement('select');
    catSelect.className = 'select';
    catSelect.style.height = '36px';
    catSelect.style.width = '130px';
    catSelect.innerHTML =
      '<option value="all">All Devices</option>' +
      '<option value="smartphone">Phones</option>' +
      '<option value="smartwatch">Watches</option>' +
      '<option value="tablet">Tablets</option>';

    pickerFilterCard.appendChild(searchInput);
    pickerFilterCard.appendChild(catSelect);
    leftCol.appendChild(pickerFilterCard);

    // Products Grid
    const prodGrid = document.createElement('div');
    prodGrid.style.display = 'grid';
    prodGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(170px, 1fr))';
    prodGrid.style.gap = '14px';
    leftCol.appendChild(prodGrid);

    layout.appendChild(leftCol);

    // ── RIGHT: Destination Office & Running Allocation Summary ──
    const rightCol = document.createElement('div');
    rightCol.style.display = 'flex';
    rightCol.style.flexDirection = 'column';
    rightCol.style.gap = '16px';

    const summaryCard = document.createElement('div');
    summaryCard.className = 'card';
    summaryCard.style.position = 'sticky';
    summaryCard.style.top = '90px';

    // Destination selector
    const destGroup = document.createElement('div');
    destGroup.className = 'form-group mb-4';

    const currentOffice = selectors.getOffice(user.officeId);

    if (isRequest) {
      // For stock requests: Destination is locked to direct parent
      const parentOffice = selectors.getOffice(currentOffice.parentId);
      destGroup.innerHTML =
        '<label class="form-label">Destination (Your Parent)</label>' +
        '<div class="input flex items-center font-medium" style="background:var(--border);">' +
          (parentOffice ? parentOffice.name + ' (' + parentOffice.type.toUpperCase() + ')' : 'Parent Office') +
        '</div>';
    } else {
      // For push allocations: Destination can only be direct children
      const children = selectors.getChildren(user.officeId);
      destGroup.innerHTML =
        '<label class="form-label">Assign To Direct Child <span class="required">*</span></label>';

      const destSelect = document.createElement('select');
      destSelect.className = 'select';
      destSelect.id = 'alloc-dest-select';
      destSelect.innerHTML = '<option value="">-- Choose direct child branch --</option>' +
        children.map(function (c) {
          return '<option value="' + c.id + '">' + c.name + ' (' + c.city + ' · ' + c.type.toUpperCase() + ')</option>';
        }).join('');

      destGroup.appendChild(destSelect);
    }
    summaryCard.appendChild(destGroup);

    // Note Input
    const noteGroup = document.createElement('div');
    noteGroup.className = 'form-group mb-4';
    noteGroup.innerHTML =
      '<label class="form-label">Notes / Instructions</label>' +
      '<textarea class="input" id="alloc-note" rows="2" style="height:auto;padding:8px" placeholder="e.g. Urgent stock replenishment for weekend promo…"></textarea>';
    summaryCard.appendChild(noteGroup);

    // Summary Line Items Container
    const summaryItems = document.createElement('div');
    summaryItems.id = 'alloc-summary-items';
    summaryItems.style.maxHeight = '240px';
    summaryItems.style.overflowY = 'auto';
    summaryItems.style.borderTop = '1px solid var(--border)';
    summaryItems.style.borderBottom = '1px solid var(--border)';
    summaryItems.style.padding = '12px 0';
    summaryItems.style.marginBottom = '14px';
    summaryCard.appendChild(summaryItems);

    // Totals Section
    const totalsDiv = document.createElement('div');
    totalsDiv.className = 'flex justify-between items-center mb-4';
    totalsDiv.innerHTML =
      '<div>' +
        '<div class="text-xs text-muted">Total Units</div>' +
        '<div class="text-lg font-semi" id="alloc-total-units">0</div>' +
      '</div>' +
      '<div style="text-align:right">' +
        '<div class="text-xs text-muted">Total Value</div>' +
        '<div class="text-lg font-semi tabular-nums" id="alloc-total-value">₹0</div>' +
      '</div>';
    summaryCard.appendChild(totalsDiv);

    // Action Submit Button
    const submitBtn = document.createElement('button');
    submitBtn.type = 'button';
    submitBtn.className = 'btn btn--primary w-full';
    submitBtn.id = 'btn-submit-alloc';
    submitBtn.disabled = true;
    submitBtn.textContent = isRequest ? 'Submit Stock Request' : 'Confirm & Dispatch Allocation';
    summaryCard.appendChild(submitBtn);

    rightCol.appendChild(summaryCard);
    layout.appendChild(rightCol);
    page.appendChild(layout);

    // ── Selection State ──
    // Map: productId -> quantity selected
    const selectedQty = {};

    function renderPicker() {
      prodGrid.innerHTML = '';
      const q = (searchInput && searchInput.value) ? searchInput.value.trim().toLowerCase() : '';
      const cat = (catSelect && catSelect.value) ? catSelect.value : 'all';

      const products = prodSvc.list({
        search: q,
        category: cat,
      });

      products.forEach(function (p) {
        // Source available stock:
        // For push: sender's current stock
        // For request: informationally shows parent stock
        const sourceOfficeId = isRequest ? currentOffice.parentId : user.officeId;
        const availableStock = selectors.getQty(sourceOfficeId, p.id);

        const card = document.createElement('div');
        card.className = 'card';
        card.style.padding = '12px';
        card.style.display = 'flex';
        card.style.flexDirection = 'column';
        card.style.gap = '8px';

        // Thumb
        const tWrap = document.createElement('div');
        tWrap.style.display = 'flex';
        tWrap.style.justifyContent = 'center';
        tWrap.appendChild(thumb.create(p, 90));
        card.appendChild(tWrap);

        // Name & Specs
        const nameDiv = document.createElement('div');
        nameDiv.innerHTML =
          '<div class="font-medium text-sm text-ellipsis" style="white-space:nowrap;overflow:hidden;" title="' + p.name + '">' + p.name + '</div>' +
          '<div class="text-xs text-muted">' + (isRequest ? 'Parent Stock: ' : 'Available: ') + '<strong>' + availableStock + '</strong></div>';
        card.appendChild(nameDiv);

        // Quantity Stepper
        const currentSelected = selectedQty[p.id] || 0;

        const stepper = document.createElement('div');
        stepper.className = 'flex items-center gap-1 mt-auto';

        const minusBtn = document.createElement('button');
        minusBtn.type = 'button';
        minusBtn.className = 'btn btn--secondary btn--sm';
        minusBtn.style.padding = '0 8px';
        minusBtn.textContent = '-';

        const qtyInput = document.createElement('input');
        qtyInput.type = 'number';
        qtyInput.className = 'input text-center tabular-nums';
        qtyInput.style.height = '32px';
        qtyInput.style.padding = '0 4px';
        qtyInput.min = '0';
        if (!isRequest) qtyInput.max = String(availableStock);
        qtyInput.value = currentSelected;

        const plusBtn = document.createElement('button');
        plusBtn.type = 'button';
        plusBtn.className = 'btn btn--secondary btn--sm';
        plusBtn.style.padding = '0 8px';
        plusBtn.textContent = '+';

        minusBtn.addEventListener('click', function () {
          const cur = Number(qtyInput.value) || 0;
          if (cur > 0) {
            qtyInput.value = cur - 1;
            selectedQty[p.id] = cur - 1;
            if (selectedQty[p.id] === 0) delete selectedQty[p.id];
            updateSummary();
          }
        });

        plusBtn.addEventListener('click', function () {
          const cur = Number(qtyInput.value) || 0;
          if (!isRequest && cur >= availableStock) {
            toast.warning('Cannot allocate more than available stock (' + availableStock + ').');
            return;
          }
          qtyInput.value = cur + 1;
          selectedQty[p.id] = cur + 1;
          updateSummary();
        });

        qtyInput.addEventListener('change', function () {
          let val = Number(qtyInput.value) || 0;
          if (val < 0) val = 0;
          if (!isRequest && val > availableStock) {
            val = availableStock;
            toast.warning('Capped at maximum available stock (' + availableStock + ').');
          }
          qtyInput.value = val;
          selectedQty[p.id] = val;
          if (val === 0) delete selectedQty[p.id];
          updateSummary();
        });

        stepper.appendChild(minusBtn);
        stepper.appendChild(qtyInput);
        stepper.appendChild(plusBtn);
        card.appendChild(stepper);

        prodGrid.appendChild(card);
      });
    }

    function updateSummary() {
      summaryItems.innerHTML = '';
      const keys = Object.keys(selectedQty);

      let totalUnits = 0;
      let totalValue = 0;

      if (keys.length === 0) {
        summaryItems.innerHTML = '<div class="text-xs text-muted text-center py-3">No products added to allocation.</div>';
      } else {
        keys.forEach(function (pId) {
          const qty = selectedQty[pId];
          const prd = selectors.getProduct(pId);
          if (!prd || qty <= 0) return;

          totalUnits += qty;
          totalValue += qty * prd.costPrice;

          const row = document.createElement('div');
          row.className = 'flex justify-between items-center py-1';
          row.innerHTML =
            '<div class="flex items-center gap-2" style="min-width:0">' +
              '<span class="font-semi text-xs text-muted">' + qty + 'x</span>' +
              '<span class="text-xs font-medium text-ellipsis" style="white-space:nowrap;overflow:hidden;">' + prd.name + '</span>' +
            '</div>' +
            '<div class="text-xs font-semi tabular-nums" style="flex-shrink:0">' + fmt.inr(qty * prd.costPrice) + '</div>';
          summaryItems.appendChild(row);
        });
      }

      summaryCard.querySelector('#alloc-total-units').textContent = fmt.num(totalUnits);
      summaryCard.querySelector('#alloc-total-value').textContent = fmt.inr(totalValue);

      // Validate destination and items
      const hasDest = isRequest ? true : (summaryCard.querySelector('#alloc-dest-select') && summaryCard.querySelector('#alloc-dest-select').value);
      submitBtn.disabled = !(hasDest && totalUnits > 0);
    }

    searchInput.addEventListener('input', renderPicker);
    catSelect.addEventListener('change', renderPicker);

    if (!isRequest) {
      summaryCard.querySelector('#alloc-dest-select').addEventListener('change', updateSummary);
    }

    // Submit handler
    submitBtn.addEventListener('click', function () {
      const keys = Object.keys(selectedQty);
      const items = keys.map(function (k) {
        return { productId: k, qty: selectedQty[k] };
      }).filter(function (it) { return it.qty > 0; });

      if (items.length === 0) return;

      const note = summaryCard.querySelector('#alloc-note').value;

      if (isRequest) {
        // Stock request flow
        try {
          const req = allocSvc.createRequest(items, note);
          toast.success('Stock request ' + req.code + ' submitted successfully.');
          window.Stockify.router.navigate('#/allocations/' + req.id);
        } catch (err) {
          toast.error(err.message);
        }
      } else {
        // Push allocation flow with confirmation
        const destId = summaryCard.querySelector('#alloc-dest-select').value;
        const destOffice = selectors.getOffice(destId);

        modal.confirm(
          'Are you sure you want to dispatch this allocation of ' + items.length + ' model(s) to ' + (destOffice ? destOffice.name : 'child office') + '? Stock will be immediately deducted from your inventory.',
          'Confirm Dispatch',
          function () {
            try {
              const alc = allocSvc.createPush(destId, items, note);
              toast.success('Allocation ' + alc.code + ' dispatched successfully.');
              window.Stockify.router.navigate('#/allocations/' + alc.id);
            } catch (err) {
              toast.error(err.message);
            }
          }
        );
      }
    });

    renderPicker();
    updateSummary();

    return page;
  }

  window.Stockify.views.allocationForm = render;
})();
