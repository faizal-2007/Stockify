// views/activity.js — Full movement & allocation audit ledger with pagination
(function () {
  'use strict';

  const dom         = window.Stockify.utils.dom;
  const format      = window.Stockify.utils.format;
  const auth        = window.Stockify.services.auth;
  const productThumb= window.Stockify.components.productThumb;
  const storage     = window.Stockify.store.storage;
  const selectors   = window.Stockify.store.selectors;

  const PAGE_SIZE = 25;

  const TYPE_LABELS = {
    all: 'All Activities',
    stock_in: 'Stock In',
    dispatch: 'Dispatch',
    receive: 'Receive',
    sale: 'Retail Sale',
    return: 'Customer Return',
    discrepancy: 'Discrepancy',
    adjustment: 'Adjustment',
  };

  const TYPE_CLASSES = {
    stock_in: 'badge--info',
    dispatch: 'badge--neutral',
    receive: 'badge--success',
    sale: 'badge--primary',
    return: 'badge--teal',
    discrepancy: 'badge--danger',
    adjustment: 'badge--warning',
  };

  /**
   * Render the full Activity audit trail page.
   * @returns {HTMLElement}
   */
  function render() {
    const user = auth.getCurrentUser();
    const page = dom.h('div', { className: 'page' });

    if (!user) {
      page.appendChild(dom.h('div', { className: 'card empty-state' }, 'Please log in to view activity history.'));
      return page;
    }

    const accessibleOffices = selectors.subtreeIds(user.officeId);
    const officeIdsSet = new Set(accessibleOffices);

    const allOffices = (storage.get('offices') || []).filter(function (o) { return officeIdsSet.has(o.id); });
    const allProducts = storage.get('products') || [];
    const allUsers = storage.get('users') || [];

    const offMap = new Map();
    allOffices.forEach(function (o) { offMap.set(o.id, o); });
    const prdMap = new Map();
    allProducts.forEach(function (p) { prdMap.set(p.id, p); });
    const usrMap = new Map();
    allUsers.forEach(function (u) { usrMap.set(u.id, u); });

    // ── Header ──
    const headerRow = dom.h('div', { className: 'flex-between flex-wrap gap-4' },
      dom.h('div', {},
        dom.h('h1', { style: 'font-size: var(--font-size-2xl); font-weight: 700; color: var(--text);' }, 'Activity & Audit Trail'),
        dom.h('p', { style: 'font-size: var(--font-size-sm); color: var(--text-muted); margin-top: 4px;' },
          'Immutable ledger of all stock additions, inter-office allocations, retail sales, and returns'
        )
      )
    );
    page.appendChild(headerRow);

    // ── Filter Bar ──
    const filterCard = dom.h('div', { className: 'card flex flex-wrap gap-4 items-center', style: 'padding: var(--sp-4);' });

    // Type select
    const typeWrap = dom.h('div', { className: 'flex flex-col gap-1' });
    typeWrap.appendChild(dom.h('label', { className: 'text-xs text-muted' }, 'Transaction Type'));
    const typeSelect = dom.h('select', { className: 'select' });
    Object.keys(TYPE_LABELS).forEach(function (k) {
      typeSelect.appendChild(dom.h('option', { value: k }, TYPE_LABELS[k]));
    });
    typeWrap.appendChild(typeSelect);
    filterCard.appendChild(typeWrap);

    // Office select
    const officeWrap = dom.h('div', { className: 'flex flex-col gap-1' });
    officeWrap.appendChild(dom.h('label', { className: 'text-xs text-muted' }, 'Location'));
    const officeSelect = dom.h('select', { className: 'select', style: 'min-width: 180px;' });
    officeSelect.appendChild(dom.h('option', { value: '' }, 'All Subtree Locations'));
    allOffices.forEach(function (o) {
      officeSelect.appendChild(dom.h('option', { value: o.id }, o.name + ' (' + o.city + ')'));
    });
    officeWrap.appendChild(officeSelect);
    filterCard.appendChild(officeWrap);

    // Product select
    const prdWrap = dom.h('div', { className: 'flex flex-col gap-1' });
    prdWrap.appendChild(dom.h('label', { className: 'text-xs text-muted' }, 'Product'));
    const prdSelect = dom.h('select', { className: 'select', style: 'max-width: 220px;' });
    prdSelect.appendChild(dom.h('option', { value: '' }, 'All Products'));
    allProducts.forEach(function (p) {
      prdSelect.appendChild(dom.h('option', { value: p.id }, p.name + ' (' + p.sku + ')'));
    });
    prdWrap.appendChild(prdSelect);
    filterCard.appendChild(prdWrap);

    // Date From
    const dateFromWrap = dom.h('div', { className: 'flex flex-col gap-1' });
    dateFromWrap.appendChild(dom.h('label', { className: 'text-xs text-muted' }, 'From'));
    const dateFromInput = dom.h('input', { type: 'date', className: 'input' });
    dateFromWrap.appendChild(dateFromInput);
    filterCard.appendChild(dateFromWrap);

    // Date To
    const dateToWrap = dom.h('div', { className: 'flex flex-col gap-1' });
    dateToWrap.appendChild(dom.h('label', { className: 'text-xs text-muted' }, 'To'));
    const dateToInput = dom.h('input', { type: 'date', className: 'input' });
    dateToWrap.appendChild(dateToInput);
    filterCard.appendChild(dateToWrap);

    // Search query
    const searchWrap = dom.h('div', { className: 'flex flex-col gap-1 flex-1', style: 'min-width: 200px;' });
    searchWrap.appendChild(dom.h('label', { className: 'text-xs text-muted' }, 'Search'));
    const searchInput = dom.h('input', { type: 'text', className: 'input', placeholder: 'Search ref, product, user, notes...' });
    searchWrap.appendChild(searchInput);
    filterCard.appendChild(searchWrap);

    page.appendChild(filterCard);

    // ── Table Container ──
    const tableCard = dom.h('div', { className: 'card flex flex-col gap-4' });
    const tableWrap = dom.h('div', { className: 'table-wrap' });
    tableCard.appendChild(tableWrap);

    // ── Pagination Footer ──
    const paginationBar = dom.h('div', { className: 'flex-between items-center flex-wrap gap-4 pt-3', style: 'border-top: 1px solid var(--border);' });
    const pageInfo = dom.h('div', { className: 'text-sm text-muted' });
    const navButtons = dom.h('div', { className: 'flex gap-2' });
    const prevBtn = dom.h('button', { className: 'btn btn--secondary btn--sm' }, '← Previous');
    const nextBtn = dom.h('button', { className: 'btn btn--secondary btn--sm' }, 'Next →');
    navButtons.appendChild(prevBtn);
    navButtons.appendChild(nextBtn);
    paginationBar.appendChild(pageInfo);
    paginationBar.appendChild(navButtons);
    tableCard.appendChild(paginationBar);

    page.appendChild(tableCard);

    let currentPage = 1;

    function refresh() {
      const q = (searchInput.value || '').trim().toLowerCase();
      const type = typeSelect.value;
      const officeId = officeSelect.value;
      const pId = prdSelect.value;
      const fromTime = dateFromInput.value ? new Date(dateFromInput.value).getTime() : 0;
      const toTime = dateToInput.value ? new Date(dateToInput.value).getTime() + 86400000 : Infinity;

      const rawMovements = storage.get('movements') || [];

      // Filter to movements within user's subtree
      const filtered = rawMovements.filter(function (m) {
        // Scoped to accessible offices
        const inScope = (m.toId && officeIdsSet.has(m.toId)) || (m.fromId && officeIdsSet.has(m.fromId));
        if (!inScope) return false;

        if (type !== 'all' && m.type !== type) return false;
        if (officeId && m.toId !== officeId && m.fromId !== officeId) return false;
        if (pId && m.productId !== pId) return false;

        const mTime = new Date(m.at).getTime();
        if (mTime < fromTime || mTime > toTime) return false;

        if (q) {
          const prd = prdMap.get(m.productId);
          const prdName = prd ? prd.name.toLowerCase() : '';
          const prdSku = prd ? prd.sku.toLowerCase() : '';
          const ref = (m.refId || '').toLowerCase();
          const u = usrMap.get(m.by);
          const uName = u ? u.name.toLowerCase() : '';
          const matches = prdName.includes(q) || prdSku.includes(q) || ref.includes(q) || uName.includes(q);
          if (!matches) return false;
        }

        return true;
      });

      // Sort newest first
      filtered.sort(function (a, b) { return new Date(b.at) - new Date(a.at); });

      const totalItems = filtered.length;
      const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
      if (currentPage > totalPages) currentPage = totalPages;

      const startIdx = (currentPage - 1) * PAGE_SIZE;
      const pageItems = filtered.slice(startIdx, startIdx + PAGE_SIZE);

      tableWrap.innerHTML = '';

      if (totalItems === 0) {
        tableWrap.appendChild(dom.h('div', { className: 'card empty-state' }, 'No activity records match your filter criteria.'));
        pageInfo.textContent = 'Showing 0 records';
        prevBtn.disabled = true;
        nextBtn.disabled = true;
        return;
      }

      pageInfo.textContent = 'Showing ' + (startIdx + 1) + '–' + Math.min(startIdx + PAGE_SIZE, totalItems) + ' of ' + format.number(totalItems) + ' activity records';
      prevBtn.disabled = currentPage <= 1;
      nextBtn.disabled = currentPage >= totalPages;

      const table = dom.h('table', { className: 'table' });
      table.appendChild(dom.h('thead', {},
        dom.h('tr', {},
          dom.h('th', { style: 'width: 48px;' }, 'Photo'),
          dom.h('th', {}, 'Device / Product'),
          dom.h('th', {}, 'Type'),
          dom.h('th', { style: 'text-align: right;' }, 'Quantity'),
          dom.h('th', {}, 'Source / Origin'),
          dom.h('th', {}, 'Destination / Target'),
          dom.h('th', {}, 'Operator'),
          dom.h('th', {}, 'Timestamp')
        )
      ));

      const tbody = dom.h('tbody', {});
      pageItems.forEach(function (m) {
        const prd = prdMap.get(m.productId);
        const fromOff = m.fromId ? offMap.get(m.fromId) : null;
        const toOff = m.toId ? offMap.get(m.toId) : null;
        const u = usrMap.get(m.by);
        const typeClass = TYPE_CLASSES[m.type] || 'badge--neutral';
        const isDeduction = m.fromId && !m.toId; // e.g. sale

        tbody.appendChild(dom.h('tr', {},
          dom.h('td', {}, prd ? productThumb(prd, 'sm') : null),
          dom.h('td', {},
            prd ? dom.h('a', { href: '#/inventory/' + prd.id, style: 'font-weight: 500; color: var(--text); text-decoration: none;' }, prd.name)
                : dom.h('span', {}, m.productId),
            prd ? dom.h('div', { style: 'font-size: var(--font-size-xs); color: var(--text-muted); font-family: monospace;' }, prd.sku) : null
          ),
          dom.h('td', {},
            dom.h('span', { className: 'badge ' + typeClass, style: 'text-transform: capitalize;' }, TYPE_LABELS[m.type] || m.type),
            m.refId ? dom.h('div', { style: 'font-size: var(--font-size-xs); color: var(--text-muted); font-family: monospace; margin-top: 2px;' }, m.refId) : null
          ),
          dom.h('td', {
            style: 'text-align: right; font-weight: 600; color: ' + (isDeduction ? 'var(--danger)' : 'var(--text)') + ';',
          }, (isDeduction ? '-' : '+') + format.number(m.qty)),
          dom.h('td', {},
            fromOff ? dom.h('a', { href: '#/network/' + fromOff.id, style: 'color: var(--text); text-decoration: none;' }, fromOff.name)
                    : dom.h('span', { style: 'color: var(--text-muted);' }, m.refType === 'supplier' ? 'External Supplier' : '—')
          ),
          dom.h('td', {},
            toOff ? dom.h('a', { href: '#/network/' + toOff.id, style: 'color: var(--text); text-decoration: none;' }, toOff.name)
                  : dom.h('span', { style: 'color: var(--text-muted);' }, m.type === 'sale' ? 'Retail Customer' : '—')
          ),
          dom.h('td', { style: 'font-size: var(--font-size-xs); color: var(--text-muted);' }, u ? u.name : (m.by || 'system')),
          dom.h('td', { style: 'font-size: var(--font-size-xs); color: var(--text-muted);' },
            dom.h('div', { style: 'font-weight: 500; color: var(--text);' }, format.dateTime(m.at)),
            dom.h('div', {}, format.relative(m.at))
          )
        ));
      });

      table.appendChild(tbody);
      tableWrap.appendChild(table);
    }

    prevBtn.addEventListener('click', function () {
      if (currentPage > 1) {
        currentPage--;
        refresh();
      }
    });

    nextBtn.addEventListener('click', function () {
      currentPage++;
      refresh();
    });

    typeSelect.addEventListener('change', function () { currentPage = 1; refresh(); });
    officeSelect.addEventListener('change', function () { currentPage = 1; refresh(); });
    prdSelect.addEventListener('change', function () { currentPage = 1; refresh(); });
    dateFromInput.addEventListener('change', function () { currentPage = 1; refresh(); });
    dateToInput.addEventListener('change', function () { currentPage = 1; refresh(); });
    searchInput.addEventListener('input', function () { currentPage = 1; refresh(); });

    refresh();
    return page;
  }

  window.Stockify.views.activity = render;
})();

