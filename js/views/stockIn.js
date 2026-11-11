// views/stockIn.js — Supplier stock-in page for Head Office
(function () {
  'use strict';

  const auth      = window.Stockify.services.auth;
  const prodSvc   = window.Stockify.services.products;
  const stockSvc  = window.Stockify.services.stock;
  const selectors = window.Stockify.store.selectors;
  const fmt       = window.Stockify.utils.format;
  const thumb     = window.Stockify.components.productThumb;
  const toast     = window.Stockify.components.toast;

  /**
   * Render Stock-in page (#/stock-in).
   * Guarded for Head Office only.
   * @returns {HTMLElement}
   */
  function render() {
    const user = auth.getCurrentUser();
    if (!user || user.role !== 'head') {
      const page = document.createElement('div');
      page.className = 'page';
      const card = document.createElement('div');
      card.className = 'card empty-state';
      card.innerHTML =
        '<h3 class="empty-state__title">Access Restricted</h3>' +
        '<p class="empty-state__body">Only Head Office administrators can receive stock-in from suppliers.</p>';
      page.appendChild(card);
      return page;
    }

    const page = document.createElement('div');
    page.className = 'page';

    // Header Bar
    const header = document.createElement('div');
    header.className = 'page-header';

    const titleGroup = document.createElement('div');
    const title = document.createElement('h1');
    title.className = 'page-title';
    title.textContent = 'Supplier Stock-In';

    const subtitle = document.createElement('p');
    subtitle.className = 'text-sm text-muted';
    subtitle.textContent = 'Receive new stock consignments from manufacturers and distributors directly into Head Office inventory.';

    titleGroup.appendChild(title);
    titleGroup.appendChild(subtitle);
    header.appendChild(titleGroup);
    page.appendChild(header);

    // Form Container
    const formCard = document.createElement('div');
    formCard.className = 'card';
    formCard.style.maxWidth = '680px';
    formCard.style.margin = '0 auto';

    const form = document.createElement('form');
    form.style.display = 'flex';
    form.style.flexDirection = 'column';
    form.style.gap = '20px';

    // 1. Product Selection Dropdown with Live Preview Box
    const prodGroup = document.createElement('div');
    prodGroup.className = 'form-group';
    prodGroup.innerHTML = '<label class="form-label">Select Product <span class="required">*</span></label>';

    const select = document.createElement('select');
    select.className = 'select';
    select.id = 'stockin-product-select';
    select.required = true;

    const products = prodSvc.list();
    select.innerHTML = '<option value="">-- Choose a product --</option>' +
      products.map(function (p) {
        return '<option value="' + p.id + '">' + p.brand + ' ' + p.name + ' (' + p.sku + ')</option>';
      }).join('');

    prodGroup.appendChild(select);
    form.appendChild(prodGroup);

    // Product Preview Box (shows image and current HO stock)
    const previewBox = document.createElement('div');
    previewBox.id = 'stockin-preview-box';
    previewBox.style.display = 'none';
    previewBox.style.background = 'var(--surface-soft)';
    previewBox.style.borderRadius = 'var(--radius-card)';
    previewBox.style.padding = '16px';
    previewBox.style.alignItems = 'center';
    previewBox.style.gap = '16px';

    form.appendChild(previewBox);

    // 2. Quantity
    const qtyGroup = document.createElement('div');
    qtyGroup.className = 'form-group';
    qtyGroup.innerHTML =
      '<label class="form-label">Quantity to Add (Units) <span class="required">*</span></label>' +
      '<input type="number" class="input tabular-nums" id="stockin-qty" min="1" step="1" placeholder="e.g. 50" required>';
    form.appendChild(qtyGroup);

    // 3. Supplier Name & Reference Row
    const infoRow = document.createElement('div');
    infoRow.style.display = 'grid';
    infoRow.style.gridTemplateColumns = '1fr 1fr';
    infoRow.style.gap = '16px';
    infoRow.innerHTML =
      '<div class="form-group">' +
        '<label class="form-label">Supplier / Distributor <span class="required">*</span></label>' +
        '<input type="text" class="input" id="stockin-supplier" placeholder="e.g. Apple India / Ingram Micro" required>' +
      '</div>' +
      '<div class="form-group">' +
        '<label class="form-label">PO / Invoice Number</label>' +
        '<input type="text" class="input" id="stockin-ref" placeholder="e.g. INV-2026-9041">' +
      '</div>';
    form.appendChild(infoRow);

    // 4. Submit Button
    const submitBtn = document.createElement('button');
    submitBtn.type = 'submit';
    submitBtn.className = 'btn btn--primary w-full mt-2';
    submitBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12l7 7 7-7"/><rect x="2" y="19" width="20" height="2" rx="1"/></svg> <span>Confirm Stock-In</span>';
    form.appendChild(submitBtn);

    formCard.appendChild(form);
    page.appendChild(formCard);

    // Product Selection handler
    select.addEventListener('change', function () {
      const pId = select.value;
      if (!pId) {
        previewBox.style.display = 'none';
        previewBox.innerHTML = '';
        return;
      }

      const p = prodSvc.getById(pId);
      if (!p) return;

      const hoStock = selectors.getQty('off_001', p.id);

      previewBox.innerHTML = '';
      previewBox.style.display = 'flex';

      const thumbEl = thumb.create(p, 64);
      const info = document.createElement('div');
      info.className = 'flex flex-col';
      info.innerHTML =
        '<div class="font-medium">' + p.brand + ' ' + p.name + '</div>' +
        '<div class="text-xs text-muted">SKU: ' + p.sku + ' · Price: ' + fmt.inr(p.price) + '</div>' +
        '<div class="text-sm font-semi mt-1" style="color:var(--primary)">Current Head Office Stock: ' + fmt.num(hoStock) + ' units</div>';

      previewBox.appendChild(thumbEl);
      previewBox.appendChild(info);
    });

    // Form submission
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const pId = select.value;
      const qty = Number(form.querySelector('#stockin-qty').value);
      const supplier = form.querySelector('#stockin-supplier').value.trim();
      const reference = form.querySelector('#stockin-ref').value.trim();

      if (!pId) {
        toast.error('Please select a product.');
        return;
      }
      if (isNaN(qty) || qty <= 0) {
        toast.error('Please enter a valid positive quantity.');
        return;
      }
      if (!supplier) {
        toast.error('Please enter the supplier name.');
        return;
      }

      try {
        const newQty = stockSvc.stockIn(pId, qty, supplier, reference);
        const p = prodSvc.getById(pId);
        toast.success('Successfully received ' + qty + ' units of ' + (p ? p.name : 'product') + '. New HO stock: ' + newQty);
        window.Stockify.router.navigate('#/inventory/' + pId);
      } catch (err) {
        toast.error(err.message || 'Stock-in failed.');
      }
    });

    return page;
  }

  window.Stockify.views.stockIn = render;
})();

