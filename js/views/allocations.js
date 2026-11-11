// views/allocations.js — Allocations list with status tabs, code search, and overlapping product thumbnails
(function () {
  'use strict';

  const auth      = window.Stockify.services.auth;
  const allocSvc  = window.Stockify.services.allocations;
  const selectors = window.Stockify.store.selectors;
  const fmt       = window.Stockify.utils.format;
  const thumb     = window.Stockify.components.productThumb;

  /**
   * Render Allocations List View (#/allocations).
   * @returns {HTMLElement}
   */
  function render() {
    const user = auth.getCurrentUser();
    if (!user) return document.createElement('div');

    const page = document.createElement('div');
    page.className = 'page';

    // State
    let currentStatus = 'all';
    let searchQuery = '';
    let fromDate = '';
    let toDate = '';

    // Check query params in hash (e.g. #/allocations?status=dispatched)
    const hash = (typeof window !== 'undefined' && window.location && window.location.hash) ? window.location.hash : '';
    if (hash.includes('?')) {
      const qStr = hash.split('?')[1];
      const params = new URLSearchParams(qStr);
      if (params.has('status')) currentStatus = params.get('status');
    }

    // ── Header Bar ──
    const header = document.createElement('div');
    header.className = 'page-header';

    const titleDiv = document.createElement('div');
    const title = document.createElement('h1');
    title.className = 'page-title';
    title.textContent = 'Stock Allocations';

    const subtitle = document.createElement('p');
    subtitle.className = 'text-sm text-muted';
    subtitle.textContent = 'Track, dispatch, approve, and receive stock transfers across the retail chain.';

    titleDiv.appendChild(title);
    titleDiv.appendChild(subtitle);
    header.appendChild(titleDiv);

    // Action Buttons: "New Allocation" (HO, Zone, District) & "Request Stock" (Zone, District, Store)
    const actions = document.createElement('div');
    actions.className = 'flex items-center gap-2';

    if (user.role !== 'store') {
      const pushBtn = document.createElement('button');
      pushBtn.className = 'btn btn--primary';
      pushBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> <span>New Allocation</span>';
      pushBtn.addEventListener('click', function () {
        window.Stockify.router.navigate('#/allocations/new');
      });
      actions.appendChild(pushBtn);
    }

    if (user.role !== 'head') {
      const reqBtn = document.createElement('button');
      reqBtn.className = 'btn btn--secondary';
      reqBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg> <span>Request Stock</span>';
      reqBtn.addEventListener('click', function () {
        window.Stockify.router.navigate('#/allocations/request');
      });
      actions.appendChild(reqBtn);
    }

    header.appendChild(actions);
    page.appendChild(header);

    // ── Status Tabs Bar ──
    const tabsCard = document.createElement('div');
    tabsCard.className = 'card';
    tabsCard.style.padding = '14px 20px';
    tabsCard.style.display = 'flex';
    tabsCard.style.alignItems = 'center';
    tabsCard.style.justifyContent = 'space-between';
    tabsCard.style.flexWrap = 'wrap';
    tabsCard.style.gap = '14px';

    const tabsWrap = document.createElement('div');
    tabsWrap.className = 'status-tabs';

    const filterControls = document.createElement('div');
    filterControls.className = 'flex items-center gap-2';

    // Search input
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.className = 'input';
    searchInput.placeholder = 'Search code, sender, receiver…';
    searchInput.style.height = '36px';
    searchInput.style.width = '240px';

    let searchTimer = null;
    searchInput.addEventListener('input', function () {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(function () {
        searchQuery = searchInput.value;
        renderRows();
      }, 250);
    });

    filterControls.appendChild(searchInput);
    tabsCard.appendChild(tabsWrap);
    tabsCard.appendChild(filterControls);
    page.appendChild(tabsCard);

    // ── Allocations List Container ──
    const listCard = document.createElement('div');
    listCard.className = 'card';
    listCard.style.padding = '0';
    listCard.style.overflow = 'hidden';
    page.appendChild(listCard);

    function updateTabs() {
      tabsWrap.innerHTML = '';
      const counts = allocSvc.getStatusCounts();
      const tabDefs = [
        { id: 'all', label: 'All', count: counts.all },
        { id: 'requested', label: 'Requested', count: counts.requested },
        { id: 'approved', label: 'Approved', count: counts.approved },
        { id: 'dispatched', label: 'Dispatched', count: counts.dispatched },
        { id: 'received', label: 'Received', count: counts.received },
      ];

      tabDefs.forEach(function (t) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'status-tab' + (currentStatus === t.id ? ' active' : '');
        btn.innerHTML = '<span>' + t.label + '</span> <span class="status-tab__count">' + t.count + '</span>';
        btn.addEventListener('click', function () {
          currentStatus = t.id;
          updateTabs();
          renderRows();
        });
        tabsWrap.appendChild(btn);
      });
    }

    function renderRows() {
      listCard.innerHTML = '';

      const items = allocSvc.list({
        status: currentStatus,
        search: searchQuery,
        fromDate: fromDate,
        toDate: toDate,
      });

      if (!items || items.length === 0) {
        const empty = document.createElement('div');
        empty.className = 'empty-state';
        empty.style.padding = '60px 20px';
        empty.innerHTML =
          '<div class="empty-state__icon"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg></div>' +
          '<h3 class="empty-state__title">No allocations found</h3>' +
          '<p class="empty-state__body">No stock movements currently match this filter criteria.</p>';
        listCard.appendChild(empty);
        return;
      }

      const offices = selectors.getAllOffices();
      const offMap = {};
      offices.forEach(function (o) { offMap[o.id] = o; });

      items.forEach(function (a) {
        const row = document.createElement('div');
        row.className = 'alloc-list-row';
        row.setAttribute('role', 'button');
        row.setAttribute('tabindex', '0');

        const fromOffice = offMap[a.fromId];
        const toOffice   = offMap[a.toId];

        // 1. Code & Type
        const codeDiv = document.createElement('div');
        codeDiv.style.minWidth = '110px';
        codeDiv.innerHTML =
          '<div class="font-semi text-sm">' + a.code + '</div>' +
          '<div class="text-xs text-muted" style="text-transform:capitalize">' + a.type + '</div>';

        // 2. Route with Office Badges: From > To
        const routeDiv = document.createElement('div');
        routeDiv.style.flex = '1';
        routeDiv.style.display = 'flex';
        routeDiv.style.alignItems = 'center';
        routeDiv.style.gap = '8px';

        const fromBadge = document.createElement('span');
        fromBadge.className = 'badge badge--' + (fromOffice ? fromOffice.type : 'head');
        fromBadge.textContent = fromOffice ? fromOffice.name : a.fromId;

        const arrowSvg = document.createElement('span');
        arrowSvg.className = 'text-muted';
        arrowSvg.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>';

        const toBadge = document.createElement('span');
        toBadge.className = 'badge badge--' + (toOffice ? toOffice.type : 'store');
        toBadge.textContent = toOffice ? toOffice.name : a.toId;

        routeDiv.appendChild(fromBadge);
        routeDiv.appendChild(arrowSvg);
        routeDiv.appendChild(toBadge);

        // 3. Up to 3 Overlapping Product Thumbnails + Item count
        const thumbStack = document.createElement('div');
        thumbStack.style.display = 'flex';
        thumbStack.style.alignItems = 'center';
        thumbStack.style.margin = '0 12px';

        const previewItems = a.items.slice(0, 3);
        previewItems.forEach(function (it, idx) {
          const prd = selectors.getProduct(it.productId);
          const t = thumb.create(prd, 34);
          t.style.marginLeft = idx > 0 ? '-12px' : '0';
          t.style.border = '2px solid var(--surface)';
          t.style.boxShadow = 'var(--shadow-card)';
          thumbStack.appendChild(t);
        });

        const itemCount = document.createElement('span');
        itemCount.className = 'text-xs text-muted';
        itemCount.style.marginLeft = '8px';
        const totalQty = a.items.reduce(function (sum, it) {
          return sum + (it.qtyDispatched || it.qtyRequested);
        }, 0);
        itemCount.textContent = totalQty + ' units (' + a.items.length + ' item' + (a.items.length === 1 ? '' : 's') + ')';
        thumbStack.appendChild(itemCount);

        // 4. Status Badge + Discrepancy indicator
        const statusDiv = document.createElement('div');
        statusDiv.style.minWidth = '120px';
        statusDiv.style.textAlign = 'right';

        const statusBadge = document.createElement('span');
        statusBadge.className = 'badge badge--' + a.status;
        statusBadge.textContent = a.status.toUpperCase();
        statusDiv.appendChild(statusBadge);

        if (a.hasDiscrepancy) {
          const discTag = document.createElement('div');
          discTag.className = 'text-xs';
          discTag.style.color = 'var(--danger)';
          discTag.style.fontWeight = '600';
          discTag.style.marginTop = '2px';
          discTag.textContent = a.discrepancyAcknowledged ? 'Shortage Settled' : 'Discrepancy Flagged';
          statusDiv.appendChild(discTag);
        }

        // 5. Date
        const dateDiv = document.createElement('div');
        dateDiv.style.minWidth = '90px';
        dateDiv.style.textAlign = 'right';
        dateDiv.className = 'text-xs text-muted';
        dateDiv.textContent = fmt.date(a.createdAt);

        row.appendChild(codeDiv);
        row.appendChild(routeDiv);
        row.appendChild(thumbStack);
        row.appendChild(statusDiv);
        row.appendChild(dateDiv);

        function openDetail() {
          window.Stockify.router.navigate('#/allocations/' + a.id);
        }

        row.addEventListener('click', openDetail);
        row.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openDetail();
          }
        });

        listCard.appendChild(row);
      });
    }

    updateTabs();
    renderRows();

    return page;
  }

  window.Stockify.views.allocations = render;
})();

