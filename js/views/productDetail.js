// views/productDetail.js — Product detail view with specs, subtree stock breakdown, and recent history
(function () {
  'use strict';

  const auth      = window.Stockify.services.auth;
  const prodSvc   = window.Stockify.services.products;
  const selectors = window.Stockify.store.selectors;
  const storage   = window.Stockify.store.storage;
  const fmt       = window.Stockify.utils.format;
  const thumb     = window.Stockify.components.productThumb;
  const modal     = window.Stockify.components.modal;
  const toast     = window.Stockify.components.toast;

  /**
   * Render Product Detail view (#/inventory/:id).
   * @param {Object} params - { productId }
   * @returns {HTMLElement}
   */
  function render(params) {
    const user = auth.getCurrentUser();
    const officeId = user ? user.officeId : 'off_001';
    const isHeadOffice = user && user.role === 'head';

    const page = document.createElement('div');
    page.className = 'page';

    const pId = params ? params.productId : null;
    const product = prodSvc.getById(pId);

    if (!product) {
      const card = document.createElement('div');
      card.className = 'card empty-state';
      card.innerHTML =
        '<h3 class="empty-state__title">Product not found</h3>' +
        '<p class="empty-state__body">The requested product does not exist or has been removed.</p>' +
        '<button class="btn btn--secondary mt-4" id="back-to-inv">Back to Inventory</button>';
      card.querySelector('#back-to-inv').addEventListener('click', function () {
        window.Stockify.router.navigate('#/inventory');
      });
      page.appendChild(card);
      return page;
    }

    const subtree = selectors.subtreeIds(officeId);
    const totalSubtreeStock = selectors.totalQty(product.id, subtree);
    const status = selectors.stockStatus(totalSubtreeStock, product.reorderLevel);

    // ── Header Bar with Back button & HO Actions ──
    const header = document.createElement('div');
    header.className = 'page-header';

    const left = document.createElement('div');
    left.className = 'flex items-center gap-3';

    const backBtn = document.createElement('button');
    backBtn.className = 'btn btn--secondary btn--sm';
    backBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg> <span>Back</span>';
    backBtn.addEventListener('click', function () {
      window.Stockify.router.navigate('#/inventory');
    });

    const titleDiv = document.createElement('div');
    const title = document.createElement('h1');
    title.className = 'page-title';
    title.textContent = product.name;

    const skuSub = document.createElement('span');
    skuSub.className = 'text-sm text-muted';
    skuSub.textContent = 'SKU: ' + product.sku + ' · ' + product.brand;

    titleDiv.appendChild(title);
    titleDiv.appendChild(skuSub);
    left.appendChild(backBtn);
    left.appendChild(titleDiv);

    header.appendChild(left);

    // HO Action buttons: Edit, Deactivate
    if (isHeadOffice) {
      const actions = document.createElement('div');
      actions.className = 'flex items-center gap-2';

      const editBtn = document.createElement('button');
      editBtn.className = 'btn btn--secondary';
      editBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> <span>Edit</span>';
      editBtn.addEventListener('click', function () {
        window.Stockify.router.navigate('#/inventory/' + product.id + '/edit');
      });

      const deactBtn = document.createElement('button');
      deactBtn.className = 'btn btn--secondary';
      deactBtn.style.color = 'var(--danger)';
      deactBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg> <span>Deactivate</span>';
      deactBtn.addEventListener('click', function () {
        modal.confirm(
          'Are you sure you want to deactivate "' + product.name + '"? It will be hidden from new allocations and product listings.',
          'Deactivate Product',
          function () {
            try {
              prodSvc.deactivate(product.id);
              toast.success('Product deactivated successfully.');
              window.Stockify.router.navigate('#/inventory');
            } catch (err) {
              toast.error(err.message);
            }
          }
        );
      });

      actions.appendChild(editBtn);
      actions.appendChild(deactBtn);
      header.appendChild(actions);
    }

    page.appendChild(header);

    // ── Main Details Grid (Product Card + Specs & Stock Breakdown) ──
    const mainGrid = document.createElement('div');
    mainGrid.style.display = 'grid';
    mainGrid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(320px, 1fr))';
    mainGrid.style.gap = '20px';

    // Left Column: Photo & Core Pricing Card
    const leftCard = document.createElement('div');
    leftCard.className = 'card';
    leftCard.style.display = 'flex';
    leftCard.style.flexDirection = 'column';
    leftCard.style.gap = '20px';

    // Photo Box
    const photoBox = document.createElement('div');
    photoBox.style.background = 'var(--surface-soft)';
    photoBox.style.borderRadius = 'var(--radius-card)';
    photoBox.style.padding = '24px';
    photoBox.style.display = 'flex';
    photoBox.style.justifyContent = 'center';
    photoBox.style.alignItems = 'center';

    const largeThumb = thumb.create(product, 240);
    photoBox.appendChild(largeThumb);
    leftCard.appendChild(photoBox);

    // Pricing & Reorder Summary
    const priceBox = document.createElement('div');
    priceBox.className = 'flex justify-between items-center';
    priceBox.innerHTML =
      '<div>' +
        '<div class="text-xs text-muted">Selling Price (MRP)</div>' +
        '<div class="text-2xl font-medium tabular-nums">' + fmt.inr(product.price) + '</div>' +
      '</div>' +
      '<div style="text-align:right">' +
        '<div class="text-xs text-muted">Cost Price</div>' +
        '<div class="text-lg font-medium tabular-nums">' + fmt.inr(product.costPrice) + '</div>' +
      '</div>';
    leftCard.appendChild(priceBox);

    // Status & Subtree Stock Pill
    const statusRow = document.createElement('div');
    statusRow.className = 'flex justify-between items-center';
    statusRow.style.paddingTop = '16px';
    statusRow.style.borderTop = '1px solid var(--border)';
    statusRow.innerHTML =
      '<div>' +
        '<div class="text-xs text-muted">Total Stock (Your Subtree)</div>' +
        '<div class="text-lg font-semi">' + fmt.num(totalSubtreeStock) + ' Units</div>' +
      '</div>' +
      '<div>' +
        '<span class="badge badge--' + status + '" style="font-size:13px;padding:4px 12px;">' +
          (status === 'out' ? 'Out of Stock' : (status === 'low' ? 'Low Stock' : 'Healthy Stock')) +
        '</span>' +
      '</div>';
    leftCard.appendChild(statusRow);

    mainGrid.appendChild(leftCard);

    // Right Column: Specifications & Stock by Office Breakdown
    const rightCol = document.createElement('div');
    rightCol.style.display = 'flex';
    rightCol.style.flexDirection = 'column';
    rightCol.style.gap = '20px';

    // Specs Card
    const specsCard = document.createElement('div');
    specsCard.className = 'card';
    specsCard.innerHTML =
      '<h3 class="font-medium text-md mb-3">Specifications</h3>' +
      '<table class="data-table">' +
        '<tbody>' +
          '<tr><td class="text-muted" style="width:140px">Category</td><td class="font-medium">' + product.category.toUpperCase() + '</td></tr>' +
          '<tr><td class="text-muted">Brand</td><td class="font-medium">' + product.brand + '</td></tr>' +
          (product.variant.storage ? '<tr><td class="text-muted">Storage</td><td class="font-medium">' + product.variant.storage + '</td></tr>' : '') +
          (product.variant.ram ? '<tr><td class="text-muted">RAM</td><td class="font-medium">' + product.variant.ram + '</td></tr>' : '') +
          (product.variant.caseSize ? '<tr><td class="text-muted">Case Size</td><td class="font-medium">' + product.variant.caseSize + '</td></tr>' : '') +
          (product.variant.color ? '<tr><td class="text-muted">Colour</td><td class="font-medium">' + product.variant.color + '</td></tr>' : '') +
          '<tr><td class="text-muted">Reorder Threshold</td><td class="font-medium">' + product.reorderLevel + ' units</td></tr>' +
          (product.description ? '<tr><td class="text-muted">Description</td><td>' + product.description + '</td></tr>' : '') +
        '</tbody>' +
      '</table>';
    rightCol.appendChild(specsCard);

    // Stock Breakdown by Office Card
    const breakdownCard = document.createElement('div');
    breakdownCard.className = 'card';
    breakdownCard.innerHTML = '<h3 class="font-medium text-md mb-3">Stock Breakdown Across Your Network</h3>';

    const allOffices = selectors.getAllOffices();
    const officeStockRows = allOffices
      .filter(function (o) { return subtree.includes(o.id) && o.active; })
      .map(function (o) {
        const qty = selectors.getQty(o.id, product.id);
        const val = qty * product.costPrice;
        return {
          office: o,
          qty: qty,
          val: val,
        };
      });

    const breakdownTable = document.createElement('table');
    breakdownTable.className = 'data-table';
    breakdownTable.innerHTML =
      '<thead>' +
        '<tr>' +
          '<th>Office / Node</th>' +
          '<th>Type</th>' +
          '<th>City</th>' +
          '<th>Quantity</th>' +
          '<th style="text-align:right">Stock Value</th>' +
        '</tr>' +
      '</thead>' +
      '<tbody>' +
        officeStockRows.map(function (r) {
          return '<tr>' +
            '<td><strong>' + r.office.name + '</strong></td>' +
            '<td><span class="badge badge--' + r.office.type + '">' + r.office.type.toUpperCase() + '</span></td>' +
            '<td class="text-muted">' + (r.office.city || '—') + '</td>' +
            '<td class="font-medium">' + fmt.num(r.qty) + '</td>' +
            '<td style="text-align:right" class="font-medium tabular-nums">' + fmt.inr(r.val) + '</td>' +
          '</tr>';
        }).join('') +
      '</tbody>';

    breakdownCard.appendChild(breakdownTable);
    rightCol.appendChild(breakdownCard);

    mainGrid.appendChild(rightCol);
    page.appendChild(mainGrid);

    // ── Recent Movements for this Product ──
    const movCard = document.createElement('div');
    movCard.className = 'card mt-5';
    movCard.innerHTML = '<h3 class="font-medium text-md mb-3">Recent Movement History</h3>';

    const allMovements = storage.get('movements') || [];
    const prodMovements = allMovements
      .filter(function (m) {
        return m.productId === product.id && (subtree.includes(m.toId) || subtree.includes(m.fromId));
      })
      .sort(function (a, b) { return new Date(b.at) - new Date(a.at); })
      .slice(0, 10);

    if (prodMovements.length === 0) {
      const p = document.createElement('p');
      p.className = 'text-muted text-sm';
      p.textContent = 'No recorded movements for this product in your subtree.';
      movCard.appendChild(p);
    } else {
      const movTable = document.createElement('table');
      movTable.className = 'data-table';
      movTable.innerHTML =
        '<thead>' +
          '<tr>' +
            '<th>Date & Time</th>' +
            '<th>Action</th>' +
            '<th>Quantity</th>' +
            '<th>Source / Destination</th>' +
            '<th>Reference</th>' +
          '</tr>' +
        '</thead>' +
        '<tbody>' +
          prodMovements.map(function (m) {
            return '<tr>' +
              '<td class="text-sm">' + fmt.datetime(m.at) + '</td>' +
              '<td><span class="badge badge--info">' + m.type.toUpperCase() + '</span></td>' +
              '<td class="font-semi">' + fmt.num(m.qty) + '</td>' +
              '<td class="text-sm text-muted">' + (m.toId ? 'To: ' + m.toId : '') + (m.fromId ? ' From: ' + m.fromId : '') + '</td>' +
              '<td class="text-xs text-muted">' + (m.refId || m.refType || '—') + '</td>' +
            '</tr>';
          }).join('') +
        '</tbody>';
      movCard.appendChild(movTable);
    }

    page.appendChild(movCard);
    return page;
  }

  window.Stockify.views.productDetail = render;
})();

