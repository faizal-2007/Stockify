// views/inventory.js — Inventory catalogue page with Grid/Table toggle, search, and category/status/brand filters
(function () {
  'use strict';

  const auth      = window.Stockify.services.auth;
  const prodSvc   = window.Stockify.services.products;
  const selectors = window.Stockify.store.selectors;
  const fmt       = window.Stockify.utils.format;
  const thumb     = window.Stockify.components.productThumb;
  const storage   = window.Stockify.store.storage;

  /**
   * Render the Inventory Page (#/inventory).
   * @returns {HTMLElement}
   */
  function render() {
    const user = auth.getCurrentUser();
    const officeId = user ? user.officeId : 'off_001';
    const isHeadOffice = user && user.role === 'head';

    const page = document.createElement('div');
    page.className = 'page';

    // State
    const settings = storage.get('settings') || {};
    let currentView = settings.inventoryView || 'grid'; // 'grid' | 'table'
    let currentCategory = 'all';
    let currentStatus = 'all';
    let currentBrand = 'all';
    let searchQuery = '';

    // Check for query parameters in hash (e.g., #/inventory?status=out)
    const hash = (typeof window !== 'undefined' && window.location && window.location.hash) ? window.location.hash : '';
    if (hash.includes('?')) {
      const qStr = hash.split('?')[1];
      const params = new URLSearchParams(qStr);
      if (params.has('status')) currentStatus = params.get('status');
      if (params.has('category')) currentCategory = params.get('category');
    }

    // ── Header Bar ──
    const header = document.createElement('div');
    header.className = 'page-header';

    const titleGroup = document.createElement('div');
    const title = document.createElement('h1');
    title.className = 'page-title';
    title.textContent = 'Inventory Catalogue';

    const subtitle = document.createElement('p');
    subtitle.className = 'text-sm text-muted';
    subtitle.textContent = 'Browse, filter, and track stock across devices in your subtree.';
    titleGroup.appendChild(title);
    titleGroup.appendChild(subtitle);

    const actionGroup = document.createElement('div');
    actionGroup.className = 'flex items-center gap-3';

    // Grid / Table View Switcher
    const viewSwitch = document.createElement('div');
    viewSwitch.className = 'seg-control';
    viewSwitch.innerHTML =
      '<button type="button" class="seg-control__btn' + (currentView === 'grid' ? ' active' : '') + '" data-view="grid" aria-label="Grid view">' +
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>' +
      '</button>' +
      '<button type="button" class="seg-control__btn' + (currentView === 'table' ? ' active' : '') + '" data-view="table" aria-label="Table view">' +
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>' +
      '</button>';

    actionGroup.appendChild(viewSwitch);

    // "Add Product" button (Head Office only)
    if (isHeadOffice) {
      const addBtn = document.createElement('button');
      addBtn.className = 'btn btn--primary';
      addBtn.type = 'button';
      addBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg> <span>Add Product</span>';
      addBtn.addEventListener('click', function () {
        window.Stockify.router.navigate('#/inventory/new');
      });
      actionGroup.appendChild(addBtn);
    }

    header.appendChild(titleGroup);
    header.appendChild(actionGroup);
    page.appendChild(header);

    // ── Filter Bar ──
    const filterCard = document.createElement('div');
    filterCard.className = 'card page-filter-bar';
    filterCard.style.padding = '14px 20px';

    // Search input (debounced 250ms)
    const searchWrap = document.createElement('div');
    searchWrap.className = 'search-wrap';
    searchWrap.style.flex = '1';
    searchWrap.style.minWidth = '220px';
    searchWrap.innerHTML =
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>' +
      '<input type="text" class="input" placeholder="Search by name, brand, or SKU…" aria-label="Search products">';

    const searchInput = searchWrap.querySelector('input');
    let searchDebounceTimer = null;
    searchInput.addEventListener('input', function () {
      clearTimeout(searchDebounceTimer);
      searchDebounceTimer = setTimeout(function () {
        searchQuery = searchInput.value;
        renderItems();
      }, 250);
    });

    // Category chips
    const catGroup = document.createElement('div');
    catGroup.className = 'flex items-center gap-1';
    const categories = [
      { id: 'all', label: 'All' },
      { id: 'smartphone', label: 'Phones' },
      { id: 'smartwatch', label: 'Watches' },
      { id: 'tablet', label: 'Tablets' },
    ];
    categories.forEach(function (cat) {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'btn btn--secondary btn--sm rounded-pill' + (currentCategory === cat.id ? ' active-chip' : '');
      chip.textContent = cat.label;
      chip.addEventListener('click', function () {
        currentCategory = cat.id;
        catGroup.querySelectorAll('button').forEach(function (b) { b.classList.remove('active-chip'); });
        chip.classList.add('active-chip');
        renderItems();
      });
      catGroup.appendChild(chip);
    });

    // Status chips
    const statusGroup = document.createElement('div');
    statusGroup.className = 'flex items-center gap-1';
    const statuses = [
      { id: 'all', label: 'All Status' },
      { id: 'healthy', label: 'Healthy' },
      { id: 'low', label: 'Low Stock' },
      { id: 'out', label: 'Out of Stock' },
    ];
    statuses.forEach(function (st) {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'btn btn--secondary btn--sm rounded-pill' + (currentStatus === st.id ? ' active-chip' : '');
      chip.textContent = st.label;
      chip.addEventListener('click', function () {
        currentStatus = st.id;
        statusGroup.querySelectorAll('button').forEach(function (b) { b.classList.remove('active-chip'); });
        chip.classList.add('active-chip');
        renderItems();
      });
      statusGroup.appendChild(chip);
    });

    // Brand Select dropdown
    const brandSelect = document.createElement('select');
    brandSelect.className = 'select';
    brandSelect.style.width = '140px';
    brandSelect.style.height = '36px';

    const allBrands = Array.from(new Set(
      (storage.get('products') || [])
        .map(function (p) { return p.brand; })
        .filter(Boolean)
    )).sort();

    let brandOpts = '<option value="all">All Brands</option>';
    allBrands.forEach(function (b) {
      brandOpts += '<option value="' + fmt.escapeHtml(b) + '">' + fmt.escapeHtml(b) + '</option>';
    });
    brandSelect.innerHTML = brandOpts;

    brandSelect.addEventListener('change', function () {
      currentBrand = this.value;
      renderItems();
    });

    filterCard.appendChild(searchWrap);
    filterCard.appendChild(catGroup);
    filterCard.appendChild(statusGroup);
    filterCard.appendChild(brandSelect);
    page.appendChild(filterCard);

    // ── Content Container (Grid or Table) ──
    const contentArea = document.createElement('div');
    contentArea.id = 'inventory-content';
    page.appendChild(contentArea);

    // Switch view click handlers
    viewSwitch.querySelectorAll('button').forEach(function (btn) {
      btn.addEventListener('click', function () {
        currentView = btn.getAttribute('data-view');
        viewSwitch.querySelectorAll('button').forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');

        // Persist view preference in settings
        const s = storage.get('settings') || {};
        s.inventoryView = currentView;
        storage.set('settings', s);

        renderItems();
      });
    });

    function renderItems() {
      contentArea.innerHTML = '';

      const products = prodSvc.list({
        search: searchQuery,
        category: currentCategory,
        status: currentStatus,
        brand: currentBrand,
        officeId: officeId,
      });

      if (!products || products.length === 0) {
        const empty = document.createElement('div');
        empty.className = 'card empty-state';
        empty.style.padding = '60px 20px';
        empty.innerHTML =
          '<div class="empty-state__icon"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></div>' +
          '<h3 class="empty-state__title">No products found</h3>' +
          '<p class="empty-state__body">Try adjusting your search terms or clearing status filters.</p>';
        contentArea.appendChild(empty);
        return;
      }

      if (currentView === 'grid') {
        renderGridView(contentArea, products, officeId);
      } else {
        renderTableView(contentArea, products, officeId);
      }
    }

    renderItems();
    return page;
  }

  function renderGridView(container, products, officeId) {
    const subtree = selectors.subtreeIds(officeId);
    const grid = document.createElement('div');
    grid.className = 'inv-grid';

    products.forEach(function (p) {
      const stock = selectors.totalQty(p.id, subtree);
      const status = selectors.stockStatus(stock, p.reorderLevel);

      const card = document.createElement('div');
      card.className = 'product-card';
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'button');

      // Photo container using productThumb
      const photoWrap = document.createElement('div');
      photoWrap.className = 'product-card__photo';
      const imgThumb = thumb.create(p, 160);
      photoWrap.appendChild(imgThumb);

      // Card body
      const body = document.createElement('div');
      body.className = 'product-card__body';

      const brand = document.createElement('span');
      brand.className = 'product-card__brand font-semi text-xs';
      brand.textContent = p.brand;

      const name = document.createElement('h3');
      name.className = 'product-card__name';
      name.textContent = p.name;

      // Variant info (e.g. 256GB · Black)
      const variantStr = [
        p.variant.storage,
        p.variant.caseSize,
        p.variant.color,
      ].filter(Boolean).join(' · ');

      const variantEl = document.createElement('div');
      variantEl.className = 'text-xs text-muted';
      variantEl.textContent = variantStr || p.category;

      const price = document.createElement('div');
      price.className = 'product-card__price tabular-nums';
      price.textContent = fmt.inr(p.price);

      // Footer: Stock count & Status pill
      const footer = document.createElement('div');
      footer.className = 'product-card__footer';

      const stockCount = document.createElement('span');
      stockCount.className = 'text-xs font-medium';
      stockCount.textContent = stock + ' in stock';

      const statusBadge = document.createElement('span');
      statusBadge.className = 'badge badge--' + status;
      statusBadge.textContent = status === 'out' ? 'Out of Stock' : (status === 'low' ? 'Low Stock' : 'Healthy');

      footer.appendChild(stockCount);
      footer.appendChild(statusBadge);

      body.appendChild(brand);
      body.appendChild(name);
      body.appendChild(variantEl);
      body.appendChild(price);
      body.appendChild(footer);

      card.appendChild(photoWrap);
      card.appendChild(body);

      function openDetail() {
        window.Stockify.router.navigate('#/inventory/' + p.id);
      }

      card.addEventListener('click', openDetail);
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openDetail();
        }
      });

      grid.appendChild(card);
    });

    container.appendChild(grid);
  }

  function renderTableView(container, products, officeId) {
    const subtree = selectors.subtreeIds(officeId);
    const card = document.createElement('div');
    card.className = 'card';
    card.style.overflowX = 'auto';

    const table = document.createElement('table');
    table.className = 'data-table';
    table.innerHTML =
      '<thead>' +
        '<tr>' +
          '<th style="width:56px">Photo</th>' +
          '<th>Product</th>' +
          '<th>Category</th>' +
          '<th>Variant</th>' +
          '<th>Price</th>' +
          '<th>Subtree Stock</th>' +
          '<th>Status</th>' +
          '<th style="text-align:right">Action</th>' +
        '</tr>' +
      '</thead>';

    const tbody = document.createElement('tbody');

    products.forEach(function (p) {
      const stock = selectors.totalQty(p.id, subtree);
      const status = selectors.stockStatus(stock, p.reorderLevel);

      const tr = document.createElement('tr');
      tr.style.cursor = 'pointer';

      // 1. Photo thumbnail
      const tdThumb = document.createElement('td');
      tdThumb.appendChild(thumb.create(p, 44));
      tr.appendChild(tdThumb);

      // 2. Name & SKU
      const tdName = document.createElement('td');
      const nameDiv = document.createElement('div');
      nameDiv.className = 'font-medium';
      nameDiv.textContent = p.name;
      const skuDiv = document.createElement('div');
      skuDiv.className = 'text-xs text-muted';
      skuDiv.textContent = p.sku;
      tdName.appendChild(nameDiv);
      tdName.appendChild(skuDiv);
      tr.appendChild(tdName);

      // 3. Category
      const tdCat = document.createElement('td');
      tdCat.textContent = p.category.charAt(0).toUpperCase() + p.category.slice(1);
      tr.appendChild(tdCat);

      // 4. Variant
      const tdVar = document.createElement('td');
      const vStr = [p.variant.storage, p.variant.caseSize, p.variant.color].filter(Boolean).join(', ');
      tdVar.className = 'text-sm text-muted';
      tdVar.textContent = vStr || '—';
      tr.appendChild(tdVar);

      // 5. Price
      const tdPrice = document.createElement('td');
      tdPrice.className = 'font-medium tabular-nums';
      tdPrice.textContent = fmt.inr(p.price);
      tr.appendChild(tdPrice);

      // 6. Subtree Stock
      const tdStock = document.createElement('td');
      tdStock.className = 'tabular-nums font-semi';
      tdStock.textContent = fmt.num(stock) + ' units';
      tr.appendChild(tdStock);

      // 7. Status Pill
      const tdStatus = document.createElement('td');
      const pill = document.createElement('span');
      pill.className = 'badge badge--' + status;
      pill.textContent = status === 'out' ? 'Out' : (status === 'low' ? 'Low' : 'Healthy');
      tdStatus.appendChild(pill);
      tr.appendChild(tdStatus);

      // 8. Action button
      const tdAct = document.createElement('td');
      tdAct.style.textAlign = 'right';
      const viewBtn = document.createElement('button');
      viewBtn.className = 'btn btn--ghost btn--sm';
      viewBtn.textContent = 'View';
      tdAct.appendChild(viewBtn);
      tr.appendChild(tdAct);

      tr.addEventListener('click', function () {
        window.Stockify.router.navigate('#/inventory/' + p.id);
      });

      tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    card.appendChild(table);
    container.appendChild(card);
  }

  window.Stockify.views.inventory = render;
})();
