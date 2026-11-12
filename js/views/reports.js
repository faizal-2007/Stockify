// views/reports.js — Comprehensive business intelligence reports with CSV export
(function () {
  'use strict';

  const dom         = window.Stockify.utils.dom;
  const format      = window.Stockify.utils.format;
  const csv         = window.Stockify.utils.csv;
  const auth        = window.Stockify.services.auth;
  const reportsSvc  = window.Stockify.services.reports;
  const productThumb= window.Stockify.components.productThumb;
  const toast       = window.Stockify.components.toast;
  const storage     = window.Stockify.store.storage;
  const selectors   = window.Stockify.store.selectors;

  const TABS = [
    { id: 'stock-office', label: 'Stock by Office & Category' },
    { id: 'stock-ageing', label: 'Stock Ageing' },
    { id: 'sales-period', label: 'Sales by Product & Period' },
    { id: 'turnaround',   label: 'Allocation Turnaround' },
    { id: 'low-stock',    label: 'Low & Out of Stock' },
    { id: 'employees',    label: 'Employees & Personnel' },
  ];

  /**
   * Render the Reports page.
   * @returns {HTMLElement}
   */
  function render() {
    const user = auth.getCurrentUser();
    const page = dom.h('div', { className: 'page' });

    if (!user) {
      page.appendChild(dom.h('div', { className: 'card empty-state' }, 'Please log in to view reports.'));
      return page;
    }

    let activeTab = 'stock-office';
    const accessibleOffices = selectors.subtreeIds(user.officeId);
    const allOffices = (storage.get('offices') || []).filter(function (o) {
      return accessibleOffices.includes(o.id) && o.active !== false;
    });

    // ── Header & Action Bar ──
    const headerRow = dom.h('div', { className: 'flex-between flex-wrap gap-4' },
      dom.h('div', {},
        dom.h('h1', { style: 'font-size: var(--font-size-2xl); font-weight: 700; color: var(--text);' }, 'Reports & Business Intelligence'),
        dom.h('p', { style: 'font-size: var(--font-size-sm); color: var(--text-muted); margin-top: 4px;' },
          'Subtree data analytics, stock ageing analysis, turnaround metrics, and inventory deficit audit'
        )
      ),
      dom.h('button', {
        id: 'report-export-btn',
        className: 'btn btn--secondary',
      },
        dom.icon('download', 16),
        dom.h('span', {}, 'Export CSV')
      )
    );
    page.appendChild(headerRow);

    // ── Tab Bar ──
    const tabNav = dom.h('div', { className: 'flex gap-2 flex-wrap pb-2', style: 'border-bottom: 1px solid var(--border);' });
    TABS.forEach(function (tab) {
      const btn = dom.h('button', {
        className: 'btn btn--sm ' + (tab.id === activeTab ? 'btn--primary' : 'btn--secondary'),
        dataset: { tab: tab.id },
      }, tab.label);

      btn.addEventListener('click', function () {
        activeTab = tab.id;
        tabNav.querySelectorAll('button').forEach(function (b) {
          b.className = 'btn btn--sm ' + (b.getAttribute('data-tab') === activeTab ? 'btn--primary' : 'btn--secondary');
        });
        updateFilterVisibility();
        refreshReport();
      });
      tabNav.appendChild(btn);
    });
    page.appendChild(tabNav);

    // ── Filter Bar ──
    const filterCard = dom.h('div', { className: 'card flex flex-wrap gap-4 items-center', style: 'padding: var(--sp-4);' });

    // Office filter
    const officeFilterWrap = dom.h('div', { className: 'flex flex-col gap-1' });
    officeFilterWrap.appendChild(dom.h('label', { className: 'text-xs text-muted' }, 'Location'));
    const officeSelect = dom.h('select', { className: 'select', style: 'min-width: 220px;' });
    officeSelect.appendChild(dom.h('option', { value: '' }, 'Entire Subtree (' + allOffices.length + ' locations)'));

    const officeGroups = [
      { type: 'head', label: 'Head Office' },
      { type: 'zone', label: 'Zonal Divisions' },
      { type: 'district', label: 'District Offices' },
      { type: 'taluk', label: 'Taluk Offices' },
      { type: 'store', label: 'Retail Stores' }
    ];

    officeGroups.forEach(function (g) {
      const groupOffices = allOffices.filter(function (o) { return o.type === g.type; });
      if (groupOffices.length > 0) {
        const optgroup = dom.h('optgroup', { label: g.label + ' (' + groupOffices.length + ')' });
        groupOffices.forEach(function (o) {
          optgroup.appendChild(dom.h('option', { value: o.id }, o.name + (o.city ? ' · ' + o.city : '')));
        });
        officeSelect.appendChild(optgroup);
      }
    });
    officeFilterWrap.appendChild(officeSelect);
    filterCard.appendChild(officeFilterWrap);

    // Category filter
    const catFilterWrap = dom.h('div', { className: 'flex flex-col gap-1' });
    catFilterWrap.appendChild(dom.h('label', { className: 'text-xs text-muted' }, 'Category'));
    const catSelect = dom.h('select', { className: 'select' },
      dom.h('option', { value: '' }, 'All Categories'),
      dom.h('option', { value: 'smartphone' }, 'Smartphones'),
      dom.h('option', { value: 'laptop' }, 'Laptops'),
      dom.h('option', { value: 'tablet' }, 'Tablets'),
      dom.h('option', { value: 'smartwatch' }, 'Smartwatches')
    );
    catFilterWrap.appendChild(catSelect);
    filterCard.appendChild(catFilterWrap);

    // Date From
    const dateFromWrap = dom.h('div', { className: 'flex flex-col gap-1', id: 'filter-date-from' });
    dateFromWrap.appendChild(dom.h('label', { className: 'text-xs text-muted' }, 'Date From'));
    const dateFromInput = dom.h('input', { type: 'date', className: 'input' });
    dateFromWrap.appendChild(dateFromInput);
    filterCard.appendChild(dateFromWrap);

    // Date To
    const dateToWrap = dom.h('div', { className: 'flex flex-col gap-1', id: 'filter-date-to' });
    dateToWrap.appendChild(dom.h('label', { className: 'text-xs text-muted' }, 'Date To'));
    const dateToInput = dom.h('input', { type: 'date', className: 'input' });
    dateToWrap.appendChild(dateToInput);
    filterCard.appendChild(dateToWrap);

    // Search query
    const searchWrap = dom.h('div', { className: 'flex flex-col gap-1 flex-1', style: 'min-width: 200px;' });
    searchWrap.appendChild(dom.h('label', { className: 'text-xs text-muted' }, 'Search'));
    const searchInput = dom.h('input', { type: 'text', className: 'input', placeholder: 'Search products or offices...' });
    searchWrap.appendChild(searchInput);
    filterCard.appendChild(searchWrap);

    page.appendChild(filterCard);

    // ── Summary KPI Banner ──
    const summaryCard = dom.h('div', { className: 'grid-4' });
    page.appendChild(summaryCard);

    // ── Report Content Container ──
    const contentCard = dom.h('div', { className: 'card flex flex-col gap-4' });
    const tableWrap = dom.h('div', { className: 'table-wrap' });
    contentCard.appendChild(tableWrap);
    page.appendChild(contentCard);

    function updateFilterVisibility() {
      const isDateNeeded = activeTab === 'sales-period' || activeTab === 'turnaround';
      dateFromWrap.style.display = isDateNeeded ? 'flex' : 'none';
      dateToWrap.style.display = isDateNeeded ? 'flex' : 'none';
      catFilterWrap.style.display = (activeTab === 'turnaround' || activeTab === 'stock-office' || activeTab === 'employees') ? 'none' : 'flex';
    }

    let currentExportHandler = null;

    function refreshReport() {
      tableWrap.innerHTML = '';
      summaryCard.innerHTML = '';
      const q = (searchInput.value || '').trim().toLowerCase();
      const officeId = officeSelect.value || null;
      const category = catSelect.value || null;
      const dateFrom = dateFromInput.value || null;
      const dateTo = dateToInput.value || null;

      if (activeTab === 'stock-office') {
        renderStockOfficeReport({ officeId, q });
      } else if (activeTab === 'stock-ageing') {
        renderStockAgeingReport({ officeId, category, q });
      } else if (activeTab === 'sales-period') {
        renderSalesPeriodReport({ officeId, category, dateFrom, dateTo, q });
      } else if (activeTab === 'turnaround') {
        renderTurnaroundReport({ officeId, dateFrom, dateTo, q });
      } else if (activeTab === 'low-stock') {
        renderLowStockReport({ officeId, category, q });
      } else if (activeTab === 'employees') {
        renderEmployeeReport({ officeId, search: q });
      }
    }

    // ── 1. Stock by Office & Category ──
    function renderStockOfficeReport(filters) {
      const res = reportsSvc.stockByOfficeAndCategory(filters);
      let rows = res.rows;
      if (filters.q) {
        rows = rows.filter(function (r) {
          return r.officeName.toLowerCase().includes(filters.q) ||
                 r.officeCode.toLowerCase().includes(filters.q) ||
                 r.city.toLowerCase().includes(filters.q);
        });
      }

      // Summary
      summaryCard.appendChild(createSummaryItem('Total Network Units', format.number(res.totals.totalUnits), 'Physical stock units across subtree'));
      summaryCard.appendChild(createSummaryItem('Total Stock Value', format.currency(res.totals.totalValue), 'Valued at acquisition cost'));
      summaryCard.appendChild(createSummaryItem('Smartphones Share', format.currency(res.totals.spValue), format.number(res.totals.spUnits) + ' phones'));
      summaryCard.appendChild(createSummaryItem('Smartwatches & Tablets', format.currency(res.totals.swValue + res.totals.tbValue), format.number(res.totals.swUnits + res.totals.tbUnits) + ' wearables & tabs'));

      if (rows.length === 0) {
        tableWrap.appendChild(dom.h('div', { className: 'card empty-state' }, 'No offices match your filters.'));
        return;
      }

      const table = dom.h('table', { className: 'table' });
      table.appendChild(dom.h('thead', {},
        dom.h('tr', {},
          dom.h('th', {}, 'Office Name'),
          dom.h('th', {}, 'Type'),
          dom.h('th', {}, 'City'),
          dom.h('th', { style: 'text-align: right;' }, 'Smartphones (Units / ₹)'),
          dom.h('th', { style: 'text-align: right;' }, 'Laptops (Units / ₹)'),
          dom.h('th', { style: 'text-align: right;' }, 'Tablets (Units / ₹)'),
          dom.h('th', { style: 'text-align: right;' }, 'Smartwatches (Units / ₹)'),
          dom.h('th', { style: 'text-align: right;' }, 'Total Units'),
          dom.h('th', { style: 'text-align: right;' }, 'Total Value')
        )
      ));

      const tbody = dom.h('tbody', {});
      rows.forEach(function (r) {
        tbody.appendChild(dom.h('tr', {},
          dom.h('td', {},
            dom.h('a', { href: '#/network/' + r.officeId, style: 'font-weight: 600; color: var(--text); text-decoration: none;' }, r.officeName),
            dom.h('div', { style: 'font-size: var(--font-size-xs); color: var(--text-muted); font-family: monospace;' }, r.officeCode)
          ),
          dom.h('td', { style: 'text-transform: capitalize; color: var(--text-muted);' }, r.officeType),
          dom.h('td', { style: 'color: var(--text-muted);' }, r.city),
          dom.h('td', { style: 'text-align: right;' }, format.number(r.smartphones.units) + ' (' + format.currency(r.smartphones.value) + ')'),
          dom.h('td', { style: 'text-align: right;' }, format.number(r.laptops ? r.laptops.units : 0) + ' (' + format.currency(r.laptops ? r.laptops.value : 0) + ')'),
          dom.h('td', { style: 'text-align: right;' }, format.number(r.tablets.units) + ' (' + format.currency(r.tablets.value) + ')'),
          dom.h('td', { style: 'text-align: right;' }, format.number(r.smartwatches.units) + ' (' + format.currency(r.smartwatches.value) + ')'),
          dom.h('td', { style: 'text-align: right; font-weight: 600;' }, format.number(r.totalUnits)),
          dom.h('td', { style: 'text-align: right; font-weight: 600; color: var(--primary);' }, format.currency(r.totalValue))
        ));
      });
      table.appendChild(tbody);
      tableWrap.appendChild(table);

      currentExportHandler = function () {
        const exportData = rows.map(function (r) {
          return {
            'Office Code': r.officeCode,
            'Office Name': r.officeName,
            'Type': r.officeType,
            'City': r.city,
            'Smartphone Units': r.smartphones.units,
            'Smartphone Value (INR)': r.smartphones.value,
            'Laptop Units': r.laptops ? r.laptops.units : 0,
            'Laptop Value (INR)': r.laptops ? r.laptops.value : 0,
            'Tablet Units': r.tablets.units,
            'Tablet Value (INR)': r.tablets.value,
            'Smartwatch Units': r.smartwatches.units,
            'Smartwatch Value (INR)': r.smartwatches.value,
            'Total Stock Units': r.totalUnits,
            'Total Stock Value (INR)': r.totalValue,
          };
        });
        const csvStr = csv.toCSV(exportData);
        csv.download(csvStr, 'Stockify_Stock_By_Office_' + new Date().toISOString().slice(0, 10) + '.csv');
        toast.show('Stock by office report exported to CSV.', 'success');
      };
    }

    // ── 2. Stock Ageing ──
    function renderStockAgeingReport(filters) {
      const res = reportsSvc.stockAgeing(filters);
      let rows = res.rows;
      if (filters.q) {
        rows = rows.filter(function (r) {
          return r.product.name.toLowerCase().includes(filters.q) ||
                 r.product.sku.toLowerCase().includes(filters.q) ||
                 r.office.name.toLowerCase().includes(filters.q);
        });
      }

      summaryCard.appendChild(createSummaryItem('Active Products Tracked', format.number(rows.length), 'Locations with inventory'));
      summaryCard.appendChild(createSummaryItem('Fast Moving (0-30d)', format.number(res.totals.bracket0_30), 'Recent activity recorded'));
      summaryCard.appendChild(createSummaryItem('Moderate (31-90d)', format.number(res.totals.bracket31_60 + res.totals.bracket61_90), 'Attention recommended'));
      summaryCard.appendChild(createSummaryItem('Stagnant (> 90d)', format.number(res.totals.bracket90Plus), 'Action required (reallocate/discount)'));

      if (rows.length === 0) {
        tableWrap.appendChild(dom.h('div', { className: 'card empty-state' }, 'No ageing stock records match filters.'));
        return;
      }

      const table = dom.h('table', { className: 'table' });
      table.appendChild(dom.h('thead', {},
        dom.h('tr', {},
          dom.h('th', { style: 'width: 48px;' }, 'Photo'),
          dom.h('th', {}, 'Product'),
          dom.h('th', {}, 'Location'),
          dom.h('th', { style: 'text-align: right;' }, 'Quantity'),
          dom.h('th', { style: 'text-align: right;' }, 'Days Inactive'),
          dom.h('th', {}, 'Ageing Bracket'),
          dom.h('th', { style: 'text-align: right;' }, 'Inventory Value')
        )
      ));

      const tbody = dom.h('tbody', {});
      rows.forEach(function (r) {
        const p = r.product;
        const o = r.office;
        const badgeClass = r.bracket === '90+ days' ? 'badge--danger' : (r.bracket === '61-90 days' ? 'badge--warning' : (r.bracket === '31-60 days' ? 'badge--info' : 'badge--success'));

        tbody.appendChild(dom.h('tr', {},
          dom.h('td', {}, productThumb(p, 'sm')),
          dom.h('td', {},
            dom.h('a', { href: '#/inventory/' + p.id, style: 'font-weight: 500; color: var(--text); text-decoration: none;' }, p.name),
            dom.h('div', { style: 'font-size: var(--font-size-xs); color: var(--text-muted); font-family: monospace;' }, p.sku)
          ),
          dom.h('td', {},
            dom.h('a', { href: '#/network/' + o.id, style: 'color: var(--text); text-decoration: none;' }, o.name),
            dom.h('div', { style: 'font-size: var(--font-size-xs); color: var(--text-muted);' }, o.city)
          ),
          dom.h('td', { style: 'text-align: right; font-weight: 600;' }, format.number(r.qty)),
          dom.h('td', { style: 'text-align: right;' }, r.daysOld + ' days'),
          dom.h('td', {}, dom.h('span', { className: 'badge ' + badgeClass }, r.bracket)),
          dom.h('td', { style: 'text-align: right; font-weight: 600;' }, format.currency(r.value))
        ));
      });
      table.appendChild(tbody);
      tableWrap.appendChild(table);

      currentExportHandler = function () {
        const exportData = rows.map(function (r) {
          return {
            'SKU': r.product.sku,
            'Product Name': r.product.name,
            'Category': r.product.category,
            'Office Name': r.office.name,
            'Office Code': r.office.code,
            'City': r.office.city,
            'Quantity': r.qty,
            'Days Inactive': r.daysOld,
            'Ageing Bracket': r.bracket,
            'Total Value (INR)': r.value,
          };
        });
        const csvStr = csv.toCSV(exportData);
        csv.download(csvStr, 'Stockify_Stock_Ageing_' + new Date().toISOString().slice(0, 10) + '.csv');
        toast.show('Stock ageing report exported to CSV.', 'success');
      };
    }

    // ── 3. Sales by Product & Period ──
    function renderSalesPeriodReport(filters) {
      const res = reportsSvc.salesByProductStorePeriod(filters);
      let rows = res.rows;
      if (filters.q) {
        rows = rows.filter(function (r) {
          return r.product.name.toLowerCase().includes(filters.q) ||
                 r.product.sku.toLowerCase().includes(filters.q) ||
                 r.store.name.toLowerCase().includes(filters.q);
        });
      }

      summaryCard.appendChild(createSummaryItem('Gross Sales Revenue', format.currency(res.totals.grossRevenue), format.number(res.totals.unitsSold) + ' units sold'));
      summaryCard.appendChild(createSummaryItem('Customer Returns', format.currency(res.totals.grossRevenue - res.totals.netRevenue), format.number(res.totals.unitsReturned) + ' units returned'));
      summaryCard.appendChild(createSummaryItem('Net Sales Revenue', format.currency(res.totals.netRevenue), format.number(res.totals.netUnits) + ' net units sold'));
      summaryCard.appendChild(createSummaryItem('Active Products Sold', format.number(rows.length), 'Distinct store-product items'));

      if (rows.length === 0) {
        tableWrap.appendChild(dom.h('div', { className: 'card empty-state' }, 'No sales transactions match the period and filters.'));
        return;
      }

      const table = dom.h('table', { className: 'table' });
      table.appendChild(dom.h('thead', {},
        dom.h('tr', {},
          dom.h('th', { style: 'width: 48px;' }, 'Photo'),
          dom.h('th', {}, 'Product'),
          dom.h('th', {}, 'Retail Store'),
          dom.h('th', { style: 'text-align: right;' }, 'Sold Qty'),
          dom.h('th', { style: 'text-align: right;' }, 'Returned Qty'),
          dom.h('th', { style: 'text-align: right;' }, 'Net Qty'),
          dom.h('th', { style: 'text-align: right;' }, 'Gross Revenue'),
          dom.h('th', { style: 'text-align: right;' }, 'Net Revenue')
        )
      ));

      const tbody = dom.h('tbody', {});
      rows.forEach(function (r) {
        tbody.appendChild(dom.h('tr', {},
          dom.h('td', {}, productThumb(r.product, 'sm')),
          dom.h('td', {},
            dom.h('a', { href: '#/inventory/' + r.product.id, style: 'font-weight: 500; color: var(--text); text-decoration: none;' }, r.product.name),
            dom.h('div', { style: 'font-size: var(--font-size-xs); color: var(--text-muted); font-family: monospace;' }, r.product.sku)
          ),
          dom.h('td', {},
            dom.h('a', { href: '#/network/' + r.store.id, style: 'color: var(--text); text-decoration: none;' }, r.store.name),
            dom.h('div', { style: 'font-size: var(--font-size-xs); color: var(--text-muted);' }, r.store.city)
          ),
          dom.h('td', { style: 'text-align: right; font-weight: 500;' }, format.number(r.unitsSold)),
          dom.h('td', { style: 'text-align: right; color: var(--danger); font-weight: 500;' }, r.unitsReturned > 0 ? '-' + r.unitsReturned : '0'),
          dom.h('td', { style: 'text-align: right; font-weight: 600;' }, format.number(r.netUnits)),
          dom.h('td', { style: 'text-align: right; color: var(--text-muted);' }, format.currency(r.grossRevenue)),
          dom.h('td', { style: 'text-align: right; font-weight: 600; color: var(--primary);' }, format.currency(r.netRevenue))
        ));
      });
      table.appendChild(tbody);
      tableWrap.appendChild(table);

      currentExportHandler = function () {
        const exportData = rows.map(function (r) {
          return {
            'SKU': r.product.sku,
            'Product Name': r.product.name,
            'Category': r.product.category,
            'Retail Store': r.store.name,
            'City': r.store.city,
            'Sold Units': r.unitsSold,
            'Returned Units': r.unitsReturned,
            'Net Units': r.netUnits,
            'Gross Revenue (INR)': r.grossRevenue,
            'Net Revenue (INR)': r.netRevenue,
          };
        });
        const csvStr = csv.toCSV(exportData);
        csv.download(csvStr, 'Stockify_Sales_Report_' + new Date().toISOString().slice(0, 10) + '.csv');
        toast.show('Sales report exported to CSV.', 'success');
      };
    }

    // ── 4. Allocation Turnaround ──
    function renderTurnaroundReport(filters) {
      const res = reportsSvc.allocationTurnaround(filters);
      let rows = res.rows;
      if (filters.q) {
        rows = rows.filter(function (r) {
          return r.code.toLowerCase().includes(filters.q) ||
                 r.sender.name.toLowerCase().includes(filters.q) ||
                 r.receiver.name.toLowerCase().includes(filters.q);
        });
      }

      summaryCard.appendChild(createSummaryItem('Total Consignments', format.number(res.totals.totalAllocations), 'Completed & active transfers'));
      summaryCard.appendChild(createSummaryItem('Avg Dispatch Time', res.totals.avgReqToDispHours + ' hrs', 'Request to dispatch transit approval'));
      summaryCard.appendChild(createSummaryItem('Avg Delivery Time', res.totals.avgDispToRecHours + ' hrs', 'Dispatch to receipt confirmation'));
      summaryCard.appendChild(createSummaryItem('Discrepancy Rate', res.totals.discrepancyRate + '%', res.totals.discrepancyCount + ' short receipts flagged'));

      if (rows.length === 0) {
        tableWrap.appendChild(dom.h('div', { className: 'card empty-state' }, 'No allocation history matches your filters.'));
        return;
      }

      const table = dom.h('table', { className: 'table' });
      table.appendChild(dom.h('thead', {},
        dom.h('tr', {},
          dom.h('th', {}, 'Code'),
          dom.h('th', {}, 'Origin / Sender'),
          dom.h('th', {}, 'Destination / Receiver'),
          dom.h('th', { style: 'text-align: right;' }, 'Total Units'),
          dom.h('th', { style: 'text-align: right;' }, 'Approval Time'),
          dom.h('th', { style: 'text-align: right;' }, 'Delivery Time'),
          dom.h('th', {}, 'Status')
        )
      ));

      const tbody = dom.h('tbody', {});
      rows.forEach(function (r) {
        const statusBadgeClass = r.status === 'received' ? 'badge--success' : (r.status === 'dispatched' ? 'badge--info' : 'badge--warning');

        tbody.appendChild(dom.h('tr', {},
          dom.h('td', {},
            dom.h('a', { href: '#/allocations/' + r.id, style: 'font-weight: 600; font-family: monospace; color: var(--primary); text-decoration: none;' }, r.code)
          ),
          dom.h('td', {},
            dom.h('div', { style: 'font-weight: 500;' }, r.sender.name),
            dom.h('div', { style: 'font-size: var(--font-size-xs); color: var(--text-muted);' }, r.sender.city)
          ),
          dom.h('td', {},
            dom.h('div', { style: 'font-weight: 500;' }, r.receiver.name),
            dom.h('div', { style: 'font-size: var(--font-size-xs); color: var(--text-muted);' }, r.receiver.city)
          ),
          dom.h('td', { style: 'text-align: right; font-weight: 600;' }, format.number(r.totalUnits)),
          dom.h('td', { style: 'text-align: right;' }, r.reqToDispHours !== null ? r.reqToDispHours + 'h' : '—'),
          dom.h('td', { style: 'text-align: right;' }, r.dispToRecHours !== null ? r.dispToRecHours + 'h' : (r.status === 'dispatched' ? 'In transit' : '—')),
          dom.h('td', {},
            dom.h('span', { className: 'badge ' + statusBadgeClass, style: 'text-transform: capitalize;' }, r.status),
            r.hasDiscrepancy ? dom.h('span', { className: 'badge badge--danger ml-1', title: 'Discrepancy noted' }, 'Shortfall') : null
          )
        ));
      });
      table.appendChild(tbody);
      tableWrap.appendChild(table);

      currentExportHandler = function () {
        const exportData = rows.map(function (r) {
          return {
            'Allocation Code': r.code,
            'From Office': r.sender.name,
            'To Office': r.receiver.name,
            'Status': r.status,
            'Total Units': r.totalUnits,
            'Request to Dispatch (hrs)': r.reqToDispHours || '',
            'Dispatch to Receipt (hrs)': r.dispToRecHours || '',
            'Has Discrepancy': r.hasDiscrepancy ? 'YES' : 'NO',
            'Date Created': r.createdAt,
          };
        });
        const csvStr = csv.toCSV(exportData);
        csv.download(csvStr, 'Stockify_Allocation_Turnaround_' + new Date().toISOString().slice(0, 10) + '.csv');
        toast.show('Turnaround report exported to CSV.', 'success');
      };
    }

    // ── 5. Low & Out of Stock Audit ──
    function renderLowStockReport(filters) {
      const res = reportsSvc.lowAndOutOfStock(filters);
      let rows = res.rows;
      if (filters.q) {
        rows = rows.filter(function (r) {
          return r.product.name.toLowerCase().includes(filters.q) ||
                 r.product.sku.toLowerCase().includes(filters.q) ||
                 r.office.name.toLowerCase().includes(filters.q);
        });
      }

      summaryCard.appendChild(createSummaryItem('Total Deficit Units', format.number(res.totals.totalShortfallUnits), 'Required to meet reorder levels'));
      summaryCard.appendChild(createSummaryItem('Reorder Capitalization', format.currency(res.totals.totalReorderCost), 'Estimated stock replenishment cost'));
      summaryCard.appendChild(createSummaryItem('Out of Stock Incidents', format.number(res.totals.outCount), 'Complete stock stockout events'));
      summaryCard.appendChild(createSummaryItem('Low Stock Warnings', format.number(res.totals.lowCount), 'Depleted below reorder threshold'));

      if (rows.length === 0) {
        tableWrap.appendChild(dom.h('div', { className: 'card empty-state' }, 'Great news! No products are currently below reorder levels.'));
        return;
      }

      const table = dom.h('table', { className: 'table' });
      table.appendChild(dom.h('thead', {},
        dom.h('tr', {},
          dom.h('th', { style: 'width: 48px;' }, 'Photo'),
          dom.h('th', {}, 'Product'),
          dom.h('th', {}, 'Location'),
          dom.h('th', { style: 'text-align: right;' }, 'Current Stock'),
          dom.h('th', { style: 'text-align: right;' }, 'Reorder Level'),
          dom.h('th', { style: 'text-align: right;' }, 'Shortfall'),
          dom.h('th', {}, 'Status'),
          dom.h('th', { style: 'text-align: right;' }, 'Replenishment Cost')
        )
      ));

      const tbody = dom.h('tbody', {});
      rows.forEach(function (r) {
        const p = r.product;
        const o = r.office;
        const isOut = r.qty === 0;

        tbody.appendChild(dom.h('tr', {},
          dom.h('td', {}, productThumb(p, 'sm')),
          dom.h('td', {},
            dom.h('a', { href: '#/inventory/' + p.id, style: 'font-weight: 500; color: var(--text); text-decoration: none;' }, p.name),
            dom.h('div', { style: 'font-size: var(--font-size-xs); color: var(--text-muted); font-family: monospace;' }, p.sku)
          ),
          dom.h('td', {},
            dom.h('a', { href: '#/network/' + o.id, style: 'color: var(--text); text-decoration: none;' }, o.name),
            dom.h('div', { style: 'font-size: var(--font-size-xs); color: var(--text-muted);' }, o.city)
          ),
          dom.h('td', { style: 'text-align: right; font-weight: 600; color: ' + (isOut ? 'var(--danger)' : 'var(--warning)') + ';' }, format.number(r.qty)),
          dom.h('td', { style: 'text-align: right; color: var(--text-muted);' }, format.number(r.reorderLevel)),
          dom.h('td', { style: 'text-align: right; font-weight: 600;' }, format.number(r.shortfall)),
          dom.h('td', {},
            dom.h('span', { className: 'badge ' + (isOut ? 'badge--danger' : 'badge--warning') }, r.status)
          ),
          dom.h('td', { style: 'text-align: right; font-weight: 600; color: var(--text);' }, format.currency(r.reorderCost))
        ));
      });
      table.appendChild(tbody);
      tableWrap.appendChild(table);

      currentExportHandler = function () {
        const exportData = rows.map(function (r) {
          return {
            'SKU': r.product.sku,
            'Product Name': r.product.name,
            'Category': r.product.category,
            'Office Name': r.office.name,
            'City': r.office.city,
            'Current Stock': r.qty,
            'Reorder Level': r.reorderLevel,
            'Shortfall (Units)': r.shortfall,
            'Status': r.status,
            'Replenishment Cost (INR)': r.reorderCost,
          };
        });
        const csvStr = csv.toCSV(exportData);
        csv.download(csvStr, 'Stockify_Low_Stock_Audit_' + new Date().toISOString().slice(0, 10) + '.csv');
        toast.show('Low stock audit exported to CSV.', 'success');
      };
    }

    // ── 6. Employees & Personnel Report ──
    function renderEmployeeReport(filters) {
      const res = reportsSvc.employeeReport(filters);
      let rows = res.rows;

      summaryCard.appendChild(createSummaryItem('Total Personnel', format.number(res.totals.totalStaff), 'Staff across selected jurisdiction'));
      summaryCard.appendChild(createSummaryItem('Active Staff', format.number(res.totals.activeStaff), format.number(res.totals.inactiveStaff) + ' inactive / deactivated'));
      summaryCard.appendChild(createSummaryItem('Administrative Leads', format.number(res.totals.headCount + res.totals.zoneCount + res.totals.districtCount), 'HO, Zonal & District managers'));
      summaryCard.appendChild(createSummaryItem('Store & Taluk Leads', format.number(res.totals.talukCount + res.totals.storeCount), 'Field officers & store leads'));

      if (rows.length === 0) {
        tableWrap.appendChild(dom.h('div', { className: 'card empty-state' }, 'No personnel match your filters.'));
        return;
      }

      const table = dom.h('table', { className: 'table' });
      table.appendChild(dom.h('thead', {},
        dom.h('tr', {},
          dom.h('th', {}, 'Emp ID'),
          dom.h('th', {}, 'Employee Name'),
          dom.h('th', {}, 'Role & Jurisdiction'),
          dom.h('th', {}, 'Office Location'),
          dom.h('th', {}, 'Contact Email'),
          dom.h('th', {}, 'Phone Number'),
          dom.h('th', { style: 'text-align: center;' }, 'Status')
        )
      ));

      const tbody = dom.h('tbody', {});
      rows.forEach(function (r) {
        const roleBadgeClass = r.role === 'head' ? 'badge--primary' : (r.role === 'zone' ? 'badge--info' : (r.role === 'district' ? 'badge--warning' : 'badge--neutral'));
        tbody.appendChild(dom.h('tr', {},
          dom.h('td', { style: 'font-family: monospace; font-size: var(--font-size-xs); font-weight: 600;' }, r.id),
          dom.h('td', {},
            dom.h('div', { style: 'font-weight: 600; color: var(--text);' }, r.name),
            dom.h('div', { style: 'font-size: var(--font-size-xs); color: var(--text-muted);' }, r.designation || r.roleLabel)
          ),
          dom.h('td', {},
            dom.h('span', { className: 'badge ' + roleBadgeClass }, r.roleLabel)
          ),
          dom.h('td', {},
            dom.h('div', { style: 'font-weight: 500;' }, r.officeName),
            dom.h('div', { style: 'font-size: var(--font-size-xs); color: var(--text-muted);' }, (r.city ? r.city + ' · ' : '') + r.officeCode)
          ),
          dom.h('td', { style: 'font-size: var(--font-size-sm); color: var(--text-muted);' }, r.email),
          dom.h('td', { style: 'font-size: var(--font-size-sm); color: var(--text-muted);' }, r.phone),
          dom.h('td', { style: 'text-align: center;' },
            dom.h('span', { className: 'badge ' + (r.active ? 'badge--success' : 'badge--danger') }, r.statusLabel)
          )
        ));
      });
      table.appendChild(tbody);
      tableWrap.appendChild(table);

      currentExportHandler = function () {
        const exportData = rows.map(function (r) {
          return {
            'Employee ID': r.id,
            'Name': r.name,
            'Role': r.roleLabel,
            'Designation': r.designation,
            'Office Code': r.officeCode,
            'Office Name': r.officeName,
            'Office Type': r.officeType,
            'City': r.city,
            'Email': r.email,
            'Phone': r.phone,
            'Status': r.statusLabel
          };
        });
        const csvStr = csv.toCSV(exportData);
        csv.download(csvStr, 'Stockify_Employee_Report_' + new Date().toISOString().slice(0, 10) + '.csv');
        toast.show('Employee report exported to CSV.', 'success');
      };
    }

    function createSummaryItem(label, value, subtitle) {
      return dom.h('div', { className: 'kpi-card' },
        dom.h('div', { className: 'kpi-card__header' },
          dom.h('span', { className: 'kpi-card__label' }, label)
        ),
        dom.h('div', { className: 'kpi-card__value', style: 'font-size: var(--font-size-xl);' }, value),
        dom.h('div', { className: 'kpi-card__footer' }, subtitle)
      );
    }

    // Hook listeners
    officeSelect.addEventListener('change', refreshReport);
    catSelect.addEventListener('change', refreshReport);
    dateFromInput.addEventListener('change', refreshReport);
    dateToInput.addEventListener('change', refreshReport);
    searchInput.addEventListener('input', refreshReport);

    const exportBtn = headerRow.querySelector('#report-export-btn');
    if (exportBtn) {
      exportBtn.addEventListener('click', function () {
        if (currentExportHandler) currentExportHandler();
      });
    }

    // Initial render
    updateFilterVisibility();
    refreshReport();

    return page;
  }

  window.Stockify.views.reports = render;
})();

