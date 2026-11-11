// views/officeDetail.js — Comprehensive office dashboard, inventory, allocations & retail ledger
(function () {
  'use strict';

  const dom         = window.Stockify.utils.dom;
  const format      = window.Stockify.utils.format;
  const auth        = window.Stockify.services.auth;
  const officesSvc  = window.Stockify.services.offices;
  const productThumb= window.Stockify.components.productThumb;
  const toast       = window.Stockify.components.toast;
  const storage     = window.Stockify.store.storage;

  const TYPE_LABELS = {
    head: 'Head Office',
    zone: 'Zonal Office',
    district: 'District Office',
    store: 'Retail Store',
  };

  const TYPE_CLASSES = {
    head: 'badge--info',
    zone: 'badge--purple',
    district: 'badge--teal',
    store: 'badge--warning',
  };

  /**
   * Render the Office Detail page.
   * @param {Object} params - { officeId }
   * @returns {HTMLElement}
   */
  function render(params) {
    const page = dom.h('div', { className: 'page' });
    const officeId = (params && params.officeId) ? params.officeId : null;

    if (!officeId) {
      page.appendChild(dom.h('div', { className: 'card empty-state' }, 'Office ID not specified.'));
      return page;
    }

    let detail;
    try {
      detail = officesSvc.getOfficeDetail(officeId);
    } catch (err) {
      page.appendChild(dom.h('div', { className: 'card empty-state' },
        dom.h('h3', {}, 'Access Denied or Not Found'),
        dom.h('p', { style: 'color: var(--text-muted); margin-top: 8px;' }, err.message),
        dom.h('a', { href: '#/network', className: 'btn btn--secondary mt-4' }, 'Back to Network')
      ));
      return page;
    }

    const office = detail.office;
    const user = auth.currentUser();

    // ── Header & Action Bar ──
    const headerRow = dom.h('div', { className: 'flex-between flex-wrap gap-4' },
      dom.h('div', {},
        dom.h('div', { className: 'flex gap-2 items-center' },
          dom.h('a', { href: '#/network', className: 'btn btn--ghost btn--sm' }, dom.icon('chevron-right', 16, { style: 'transform: rotate(180deg);' })),
          dom.h('h1', { style: 'font-size: var(--font-size-2xl); font-weight: 700; color: var(--text);' }, office.name),
          dom.h('span', { className: 'badge ' + (TYPE_CLASSES[office.type] || 'badge--neutral') }, TYPE_LABELS[office.type] || office.type),
          dom.h('span', { style: 'font-size: var(--font-size-sm); color: var(--text-muted); font-family: monospace;' }, office.code)
        ),
        dom.h('p', { style: 'font-size: var(--font-size-sm); color: var(--text-muted); margin-top: 4px;' },
          'City: ' + office.city + ' • Manager: ' + office.manager + ' • ' + (office.active !== false ? 'Active' : 'Inactive')
        )
      )
    );

    const actionGroup = dom.h('div', { className: 'flex gap-3 flex-wrap' });

    // Edit office button
    if (officesSvc.canManageOffice(office.type, office.parentId)) {
      const editBtn = dom.h('button', { className: 'btn btn--secondary' },
        dom.icon('pencil', 16),
        dom.h('span', {}, 'Edit Office')
      );
      editBtn.addEventListener('click', function () {
        if (window.Stockify.views.openOfficeModal) {
          window.Stockify.views.openOfficeModal(office, function () {
            window.location.reload();
          });
        }
      });
      actionGroup.appendChild(editBtn);
    }

    // Quick Allocation or Sales button
    if (office.type === 'store' && user.role === 'store' && user.officeId === office.id) {
      const saleBtn = dom.h('a', { href: '#/sales', className: 'btn btn--primary' },
        dom.icon('receipt', 16),
        dom.h('span', {}, 'Record Sale')
      );
      actionGroup.appendChild(saleBtn);
    } else if (office.type !== 'head') {
      const reqBtn = dom.h('a', { href: '#/allocations/request', className: 'btn btn--secondary' },
        dom.icon('box', 16),
        dom.h('span', {}, 'Request Stock')
      );
      actionGroup.appendChild(reqBtn);
    }

    headerRow.appendChild(actionGroup);
    page.appendChild(headerRow);

    // ── KPI Summary Cards ──
    const kpiGrid = dom.h('div', { className: 'grid-4' });

    // Local physical units
    const localUnits = detail.inventory.reduce(function (sum, item) { return sum + item.qty; }, 0);
    const localValue = detail.inventory.reduce(function (sum, item) { return sum + item.totalValue; }, 0);

    const kpi1 = dom.h('div', { className: 'kpi-card' },
      dom.h('div', { className: 'kpi-card__header' },
        dom.h('span', { className: 'kpi-card__label' }, 'Location Stock'),
        dom.h('div', { className: 'kpi-card__icon kpi-card__icon--blue' }, dom.icon('box', 20))
      ),
      dom.h('div', { className: 'kpi-card__value' }, format.number(localUnits) + ' Units'),
      dom.h('div', { className: 'kpi-card__footer' }, 'Physical stock in this facility')
    );

    const kpi2 = dom.h('div', { className: 'kpi-card' },
      dom.h('div', { className: 'kpi-card__header' },
        dom.h('span', { className: 'kpi-card__label' }, 'Location Stock Value'),
        dom.h('div', { className: 'kpi-card__icon kpi-card__icon--purple' }, dom.icon('layers', 20))
      ),
      dom.h('div', { className: 'kpi-card__value' }, format.currency(localValue)),
      dom.h('div', { className: 'kpi-card__footer' }, 'Valued at acquisition cost')
    );

    const kpi3 = dom.h('div', { className: 'kpi-card' },
      dom.h('div', { className: 'kpi-card__header' },
        dom.h('span', { className: 'kpi-card__label' }, 'Subtree Units'),
        dom.h('div', { className: 'kpi-card__icon kpi-card__icon--teal' }, dom.icon('clipboard', 20))
      ),
      dom.h('div', { className: 'kpi-card__value' }, format.number(detail.subtreeMetrics.totalUnits) + ' Units'),
      dom.h('div', { className: 'kpi-card__footer' }, (detail.subtreeMetrics.storesCount || 0) + ' Stores under management')
    );

    const kpi4 = dom.h('div', { className: 'kpi-card' },
      dom.h('div', { className: 'kpi-card__header' },
        dom.h('span', { className: 'kpi-card__label' }, 'Subtree Stock Value'),
        dom.h('div', { className: 'kpi-card__icon kpi-card__icon--blue' }, dom.icon('trending-up', 20))
      ),
      dom.h('div', { className: 'kpi-card__value' }, format.currency(detail.subtreeMetrics.totalValue)),
      dom.h('div', { className: 'kpi-card__footer' }, 'Total network capitalization')
    );

    kpiGrid.appendChild(kpi1);
    kpiGrid.appendChild(kpi2);
    kpiGrid.appendChild(kpi3);
    kpiGrid.appendChild(kpi4);
    page.appendChild(kpiGrid);

    // ── Direct Child Offices (if applicable) ──
    if (detail.children && detail.children.length > 0) {
      const childCard = dom.h('div', { className: 'card' });
      childCard.appendChild(dom.h('h3', { className: 'card-title mb-4' },
        'Subordinate Offices (' + detail.children.length + ')'
      ));

      const childGrid = dom.h('div', { className: 'grid-3 gap-4' });
      detail.children.forEach(function (childItem) {
        const c = childItem.office;
        const m = childItem.metrics;
        const cCard = dom.h('a', {
          href: '#/network/' + c.id,
          className: 'card flex flex-col justify-between',
          style: 'padding: var(--sp-4); text-decoration: none; color: inherit; border: 1px solid var(--border);',
        },
          dom.h('div', {},
            dom.h('div', { className: 'flex-between items-center mb-2' },
              dom.h('span', { className: 'badge ' + (TYPE_CLASSES[c.type] || 'badge--neutral') }, TYPE_LABELS[c.type] || c.type),
              dom.h('span', { style: 'font-size: var(--font-size-xs); font-family: monospace; color: var(--text-muted);' }, c.code)
            ),
            dom.h('div', { style: 'font-weight: 600; font-size: var(--font-size-base); color: var(--text);' }, c.name),
            dom.h('div', { style: 'font-size: var(--font-size-xs); color: var(--text-muted); margin-top: 2px;' }, c.city + ' • Manager: ' + c.manager)
          ),
          dom.h('div', { className: 'flex-between items-center mt-4 pt-3', style: 'border-top: 1px solid var(--border); font-size: var(--font-size-xs);' },
            dom.h('span', { style: 'color: var(--text-muted);' }, format.number(m.totalUnits) + ' Units'),
            dom.h('span', { style: 'font-weight: 600; color: var(--text);' }, format.currency(m.totalValue))
          )
        );
        childGrid.appendChild(cCard);
      });
      childCard.appendChild(childGrid);
      page.appendChild(childCard);
    }

    // ── Section: Current Inventory ──
    const invCard = dom.h('div', { className: 'card' });
    invCard.appendChild(dom.h('h3', { className: 'card-title mb-4' }, 'Current Stock at this Facility'));

    const tableWrap = dom.h('div', { className: 'table-wrap' });
    const table = dom.h('table', { className: 'table' });

    const thead = dom.h('thead', {},
      dom.h('tr', {},
        dom.h('th', { style: 'width: 48px;' }, 'Photo'),
        dom.h('th', {}, 'Product'),
        dom.h('th', {}, 'SKU'),
        dom.h('th', {}, 'Category'),
        dom.h('th', { style: 'text-align: right;' }, 'Stock Qty'),
        dom.h('th', { style: 'text-align: right;' }, 'Unit Cost'),
        dom.h('th', { style: 'text-align: right;' }, 'Total Value'),
        dom.h('th', { style: 'text-align: center;' }, 'Status')
      )
    );

    const tbody = dom.h('tbody', {});
    detail.inventory.forEach(function (item) {
      const p = item.product;
      const statusBadgeClass = item.status === 'healthy' ? 'badge--success' : (item.status === 'low' ? 'badge--warning' : 'badge--danger');
      const statusLabel = item.status === 'healthy' ? 'Healthy' : (item.status === 'low' ? 'Low Stock' : 'Out of Stock');

      const tr = dom.h('tr', {},
        dom.h('td', {}, productThumb(p, 'sm')),
        dom.h('td', {},
          dom.h('a', { href: '#/inventory/' + p.id, style: 'font-weight: 500; color: var(--text); text-decoration: none;' }, p.name),
          dom.h('div', { style: 'font-size: var(--font-size-xs); color: var(--text-muted);' }, p.brand)
        ),
        dom.h('td', { style: 'font-family: monospace; font-size: var(--font-size-xs);' }, p.sku),
        dom.h('td', { style: 'text-transform: capitalize; color: var(--text-muted); font-size: var(--font-size-sm);' }, p.category),
        dom.h('td', { style: 'text-align: right; font-weight: 600;' }, format.number(item.qty)),
        dom.h('td', { style: 'text-align: right; color: var(--text-muted);' }, format.currency(item.unitCost)),
        dom.h('td', { style: 'text-align: right; font-weight: 500;' }, format.currency(item.totalValue)),
        dom.h('td', { style: 'text-align: center;' },
          dom.h('span', { className: 'badge ' + statusBadgeClass }, statusLabel)
        )
      );
      tbody.appendChild(tr);
    });

    table.appendChild(thead);
    table.appendChild(tbody);
    tableWrap.appendChild(table);
    invCard.appendChild(tableWrap);
    page.appendChild(invCard);

    // ── Section: Recent Allocations ──
    const alcCard = dom.h('div', { className: 'card' });
    alcCard.appendChild(dom.h('h3', { className: 'card-title mb-4' }, 'Recent Allocations Involving this Office'));

    if (detail.allocations.length === 0) {
      alcCard.appendChild(dom.h('p', { style: 'color: var(--text-muted); font-size: var(--font-size-sm);' }, 'No recent allocations recorded.'));
    } else {
      const alcWrap = dom.h('div', { className: 'table-wrap' });
      const alcTable = dom.h('table', { className: 'table' });
      const alcThead = dom.h('thead', {},
        dom.h('tr', {},
          dom.h('th', {}, 'Code'),
          dom.h('th', {}, 'Direction'),
          dom.h('th', {}, 'Items'),
          dom.h('th', {}, 'Status'),
          dom.h('th', {}, 'Date')
        )
      );
      const alcTbody = dom.h('tbody', {});
      const officesList = officesSvc.getHierarchy();

      detail.allocations.forEach(function (alc) {
        const isSender = alc.fromId === office.id;
        const totalItems = alc.items.reduce(function (sum, it) { return sum + (it.qtyDispatched || it.qtyRequested); }, 0);
        const statusBadgeClass = alc.status === 'received' ? 'badge--success' : (alc.status === 'dispatched' ? 'badge--info' : 'badge--warning');

        const tr = dom.h('tr', {},
          dom.h('td', {},
            dom.h('a', { href: '#/allocations/' + alc.id, style: 'font-weight: 600; font-family: monospace; color: var(--primary); text-decoration: none;' }, alc.code)
          ),
          dom.h('td', {},
            dom.h('span', { className: 'badge ' + (isSender ? 'badge--neutral' : 'badge--teal') }, isSender ? 'Outbound' : 'Inbound')
          ),
          dom.h('td', {}, totalItems + ' units (' + alc.items.length + ' items)'),
          dom.h('td', {},
            dom.h('span', { className: 'badge ' + statusBadgeClass, style: 'text-transform: capitalize;' }, alc.status)
          ),
          dom.h('td', { style: 'font-size: var(--font-size-xs); color: var(--text-muted);' }, format.dateTime(alc.createdAt))
        );
        alcTbody.appendChild(tr);
      });

      alcTable.appendChild(alcThead);
      alcTable.appendChild(alcTbody);
      alcWrap.appendChild(alcTable);
      alcCard.appendChild(alcWrap);
    }
    page.appendChild(alcCard);

    // ── Section: Recent Sales (If Store) ──
    if (office.type === 'store') {
      const salesCard = dom.h('div', { className: 'card' });
      salesCard.appendChild(dom.h('h3', { className: 'card-title mb-4' }, 'Recent Retail Transactions'));

      if (detail.sales.length === 0) {
        salesCard.appendChild(dom.h('p', { style: 'color: var(--text-muted); font-size: var(--font-size-sm);' }, 'No sales recorded for this store yet.'));
      } else {
        const salesWrap = dom.h('div', { className: 'table-wrap' });
        const salesTable = dom.h('table', { className: 'table' });
        const sThead = dom.h('thead', {},
          dom.h('tr', {},
            dom.h('th', {}, 'Sale ID'),
            dom.h('th', {}, 'Product'),
            dom.h('th', { style: 'text-align: right;' }, 'Qty'),
            dom.h('th', { style: 'text-align: right;' }, 'Total Amount'),
            dom.h('th', {}, 'Payment'),
            dom.h('th', {}, 'Customer'),
            dom.h('th', {}, 'Date & Time')
          )
        );
        const sTbody = dom.h('tbody', {});
        const productsMap = new Map();
        (storage.get('products') || []).forEach(function (p) { productsMap.set(p.id, p); });

        detail.sales.forEach(function (s) {
          const prd = productsMap.get(s.productId);
          const isReturn = s.type === 'return';
          const totalVal = s.qty * s.unitPrice;

          const tr = dom.h('tr', {},
            dom.h('td', { style: 'font-family: monospace; font-size: var(--font-size-xs); font-weight: 600;' }, s.id),
            dom.h('td', {},
              dom.h('div', { className: 'flex gap-2 items-center' },
                prd ? productThumb(prd, 'sm') : null,
                dom.h('span', { style: 'font-weight: 500;' }, prd ? prd.name : s.productId)
              )
            ),
            dom.h('td', { style: 'text-align: right; font-weight: 600;' }, (isReturn ? '-' : '') + s.qty),
            dom.h('td', { style: 'text-align: right; font-weight: 600; color: ' + (isReturn ? 'var(--danger)' : 'var(--text)') + ';' },
              (isReturn ? '- ' : '') + format.currency(totalVal)
            ),
            dom.h('td', {},
              dom.h('span', { className: 'badge badge--neutral', style: 'text-transform: uppercase;' }, s.payment)
            ),
            dom.h('td', { style: 'color: var(--text-muted); font-size: var(--font-size-xs);' },
              (s.customer && s.customer.name) ? s.customer.name : 'Walk-in'
            ),
            dom.h('td', { style: 'color: var(--text-muted); font-size: var(--font-size-xs);' }, format.dateTime(s.at))
          );
          sTbody.appendChild(tr);
        });

        salesTable.appendChild(sThead);
        salesTable.appendChild(sTbody);
        salesWrap.appendChild(salesTable);
        salesCard.appendChild(salesWrap);
      }
      page.appendChild(salesCard);
    }

    return page;
  }

  window.Stockify.views.officeDetail = render;
})();
