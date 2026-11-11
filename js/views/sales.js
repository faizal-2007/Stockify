// views/sales.js — Quick-Sale POS terminal for stores & sales analytics/targets hub for parent offices
(function () {
  'use strict';

  const dom         = window.Stockify.utils.dom;
  const format      = window.Stockify.utils.format;
  const auth        = window.Stockify.services.auth;
  const salesSvc    = window.Stockify.services.sales;
  const stockSvc    = window.Stockify.services.stock;
  const officesSvc  = window.Stockify.services.offices;
  const productThumb= window.Stockify.components.productThumb;
  const modal       = window.Stockify.components.modal;
  const toast       = window.Stockify.components.toast;
  const storage     = window.Stockify.store.storage;
  const selectors   = window.Stockify.store.selectors;

  /**
   * Main render function for #/sales route.
   * @returns {HTMLElement}
   */
  function render() {
    const user = auth.currentUser();
    const page = dom.h('div', { className: 'page' });

    if (!user) {
      page.appendChild(dom.h('div', { className: 'card empty-state' }, 'Please log in to access sales.'));
      return page;
    }

    if (user.role === 'store') {
      renderStoreTerminal(page, user);
    } else {
      renderNetworkSalesOverview(page, user);
    }

    return page;
  }

  // ══════════════════════════════════════════════════════════
  // 1. STORE POS TERMINAL
  // ══════════════════════════════════════════════════════════
  function renderStoreTerminal(page, user) {
    const store = officesSvc.getOfficeById(user.officeId);
    const storeName = store ? store.name : 'Store Terminal';

    // Header
    const headerRow = dom.h('div', { className: 'flex-between flex-wrap gap-4' },
      dom.h('div', {},
        dom.h('h1', { style: 'font-size: var(--font-size-2xl); font-weight: 700; color: var(--text);' }, 'Point of Sale (POS)'),
        dom.h('p', { style: 'font-size: var(--font-size-sm); color: var(--text-muted); margin-top: 4px;' },
          storeName + ' • Terminal Operator: ' + user.name
        )
      ),
      dom.h('div', { className: 'badge badge--success' }, '● Live Store Register')
    );
    page.appendChild(headerRow);

    // Layout: 2 Columns (Left: Sale Form, Right: Today's Ledger)
    const posContainer = dom.h('div', { className: 'pos-container' });

    // ── LEFT: QUICK SALE PANEL ──
    const posCard = dom.h('div', { className: 'card flex flex-col gap-4' });
    posCard.appendChild(dom.h('h3', { className: 'card-title' }, 'New Retail Sale'));

    const allProducts = (storage.get('products') || []).filter(function (p) { return p.active !== false; });
    let selectedProduct = null;
    let selectedPayment = 'cash';

    // Product Picker Row
    const prdGroup = dom.h('div', { className: 'form-group' });
    prdGroup.appendChild(dom.h('label', { className: 'form-label' }, 'Select Product *'));

    const prdSelect = dom.h('select', { className: 'select' });
    prdSelect.appendChild(dom.h('option', { value: '' }, '-- Choose Device / Accessory --'));

    allProducts.forEach(function (p) {
      const stockQty = stockSvc.getStock(user.officeId, p.id);
      const opt = dom.h('option', { value: p.id },
        p.name + ' (' + p.sku + ') — Stock: ' + stockQty + ' units'
      );
      if (stockQty === 0) {
        opt.disabled = true;
        opt.textContent += ' [OUT OF STOCK]';
      }
      prdSelect.appendChild(opt);
    });
    prdGroup.appendChild(prdSelect);
    posCard.appendChild(prdGroup);

    // Product Preview Box
    const prdPreview = dom.h('div', {
      className: 'card flex gap-4 items-center',
      style: 'background: var(--surface-soft); padding: var(--sp-3); display: none;',
    });
    const thumbWrap = dom.h('div', { style: 'flex-shrink: 0;' });
    const prdInfo = dom.h('div', { className: 'flex flex-col flex-1 min-w-0' });
    const prdTitle = dom.h('div', { style: 'font-weight: 600; font-size: var(--font-size-base);' });
    const prdStockBadge = dom.h('div', { style: 'font-size: var(--font-size-xs); margin-top: 2px;' });
    prdInfo.appendChild(prdTitle);
    prdInfo.appendChild(prdStockBadge);
    prdPreview.appendChild(thumbWrap);
    prdPreview.appendChild(prdInfo);
    posCard.appendChild(prdPreview);

    // Quantity & Price Row
    const qtyPriceRow = dom.h('div', { className: 'grid-2 gap-4' });

    // Qty
    const qtyGroup = dom.h('div', { className: 'form-group' });
    qtyGroup.appendChild(dom.h('label', { className: 'form-label' }, 'Quantity *'));
    const qtyInput = dom.h('input', {
      type: 'number',
      className: 'input',
      min: '1',
      value: '1',
      required: true,
    });
    qtyGroup.appendChild(qtyInput);

    // Price
    const priceGroup = dom.h('div', { className: 'form-group' });
    priceGroup.appendChild(dom.h('label', { className: 'form-label' }, 'Unit Price (₹) *'));
    const priceInput = dom.h('input', {
      type: 'number',
      className: 'input',
      min: '0',
      value: '',
      required: true,
    });
    priceGroup.appendChild(priceInput);

    qtyPriceRow.appendChild(qtyGroup);
    qtyPriceRow.appendChild(priceGroup);
    posCard.appendChild(qtyPriceRow);

    // Payment Mode Toggle
    const payGroup = dom.h('div', { className: 'form-group' });
    payGroup.appendChild(dom.h('label', { className: 'form-label' }, 'Payment Mode *'));
    const payToggle = dom.h('div', { className: 'payment-toggle' });

    const modes = [
      { id: 'cash', label: 'Cash', icon: 'credit-card' },
      { id: 'upi', label: 'UPI / QR', icon: 'zap' },
      { id: 'card', label: 'Card / POS', icon: 'credit-card' },
    ];

    modes.forEach(function (m) {
      const btn = dom.h('button', {
        type: 'button',
        className: 'payment-toggle__btn ' + (m.id === selectedPayment ? 'selected' : ''),
      },
        dom.icon(m.icon, 18),
        dom.h('span', {}, m.label)
      );
      btn.addEventListener('click', function () {
        selectedPayment = m.id;
        payToggle.querySelectorAll('.payment-toggle__btn').forEach(function (b) { b.classList.remove('selected'); });
        btn.classList.add('selected');
      });
      payToggle.appendChild(btn);
    });
    payGroup.appendChild(payToggle);
    posCard.appendChild(payGroup);

    // Customer Name & Phone
    const custRow = dom.h('div', { className: 'grid-2 gap-4' });

    const nameGroup = dom.h('div', { className: 'form-group' });
    nameGroup.appendChild(dom.h('label', { className: 'form-label' }, 'Customer Name'));
    const nameInput = dom.h('input', { type: 'text', className: 'input', placeholder: 'e.g. Ramesh Kumar' });
    nameGroup.appendChild(nameInput);

    const phoneGroup = dom.h('div', { className: 'form-group' });
    phoneGroup.appendChild(dom.h('label', { className: 'form-label' }, 'Customer Phone'));
    const phoneInput = dom.h('input', { type: 'tel', className: 'input', placeholder: 'e.g. 98765 43210' });
    phoneGroup.appendChild(phoneInput);

    custRow.appendChild(nameGroup);
    custRow.appendChild(phoneGroup);
    posCard.appendChild(custRow);

    // Summary Box
    const summaryBox = dom.h('div', {
      className: 'card flex-between items-center',
      style: 'background: var(--surface-soft); padding: var(--sp-4); margin-top: var(--sp-2);',
    },
      dom.h('div', {},
        dom.h('div', { style: 'font-size: var(--font-size-xs); color: var(--text-muted);' }, 'Grand Total Amount'),
        dom.h('div', { style: 'font-size: var(--font-size-sm); color: var(--text-muted);' }, 'Inclusive of all local taxes')
      ),
      dom.h('div', {
        id: 'pos-total-display',
        style: 'font-size: var(--font-size-2xl); font-weight: 700; color: var(--primary);',
      }, '₹0')
    );
    posCard.appendChild(summaryBox);

    // Error alert
    const errorAlert = dom.h('div', {
      className: 'badge badge--danger',
      style: 'display: none; padding: var(--sp-3); width: 100%; border-radius: var(--radius-sm);',
    });
    posCard.appendChild(errorAlert);

    // Submit Button
    const submitBtn = dom.h('button', {
      type: 'button',
      className: 'btn btn--primary btn--lg w-full mt-2',
      disabled: true,
    },
      dom.icon('receipt', 18),
      dom.h('span', {}, 'Complete Sale & Print Receipt')
    );
    posCard.appendChild(submitBtn);

    posContainer.appendChild(posCard);

    // ── RIGHT: RECENT STORE SALES & RETURNS ──
    const ledgerCard = dom.h('div', { className: 'card flex flex-col gap-4' });
    ledgerCard.appendChild(dom.h('h3', { className: 'card-title' }, "Today's Store Transactions"));

    const ledgerListWrap = dom.h('div', { className: 'table-wrap', style: 'max-height: 600px; overflow-y: auto;' });
    ledgerCard.appendChild(ledgerListWrap);
    posContainer.appendChild(ledgerCard);

    page.appendChild(posContainer);

    // ── Update Logic ──
    function updateTotal() {
      const qty = parseInt(qtyInput.value, 10) || 0;
      const unitPrice = parseFloat(priceInput.value) || 0;
      const total = qty * unitPrice;
      const totalDisplay = posCard.querySelector('#pos-total-display');
      if (totalDisplay) {
        totalDisplay.textContent = format.currency(total);
      }

      const availableStock = selectedProduct ? stockSvc.getStock(user.officeId, selectedProduct.id) : 0;
      submitBtn.disabled = !selectedProduct || qty <= 0 || qty > availableStock || isNaN(unitPrice) || unitPrice < 0;
    }

    prdSelect.addEventListener('change', function () {
      const pId = prdSelect.value;
      selectedProduct = allProducts.find(function (p) { return p.id === pId; }) || null;
      if (selectedProduct) {
        thumbWrap.innerHTML = '';
        thumbWrap.appendChild(productThumb(selectedProduct, 'md'));
        prdTitle.textContent = selectedProduct.name + ' (' + selectedProduct.brand + ')';

        const avail = stockSvc.getStock(user.officeId, selectedProduct.id);
        prdStockBadge.innerHTML = '<span class="badge ' + (avail > 5 ? 'badge--success' : (avail > 0 ? 'badge--warning' : 'badge--danger')) + '">' + avail + ' Units In Stock</span>';

        priceInput.value = selectedProduct.price;
        qtyInput.max = avail;
        qtyInput.value = '1';
        prdPreview.style.display = 'flex';
      } else {
        prdPreview.style.display = 'none';
        priceInput.value = '';
      }
      updateTotal();
    });

    qtyInput.addEventListener('input', updateTotal);
    priceInput.addEventListener('input', updateTotal);

    function refreshLedger() {
      ledgerListWrap.innerHTML = '';
      const sales = salesSvc.getSales({ storeId: user.officeId }).slice(0, 20);

      if (sales.length === 0) {
        ledgerListWrap.appendChild(dom.h('p', { style: 'color: var(--text-muted); font-size: var(--font-size-sm); padding: var(--sp-4);' },
          'No retail transactions recorded yet today.'
        ));
        return;
      }

      const table = dom.h('table', { className: 'table' });
      const thead = dom.h('thead', {},
        dom.h('tr', {},
          dom.h('th', {}, 'Device'),
          dom.h('th', { style: 'text-align: right;' }, 'Qty'),
          dom.h('th', { style: 'text-align: right;' }, 'Amount'),
          dom.h('th', {}, 'Customer'),
          dom.h('th', { style: 'text-align: center;' }, 'Action')
        )
      );

      const tbody = dom.h('tbody', {});
      const productsMap = new Map();
      allProducts.forEach(function (p) { productsMap.set(p.id, p); });

      sales.forEach(function (sale) {
        const prd = productsMap.get(sale.productId);
        const isReturn = sale.type === 'return';
        const total = sale.qty * sale.unitPrice;

        const tr = dom.h('tr', {},
          dom.h('td', {},
            dom.h('div', { className: 'flex gap-2 items-center' },
              prd ? productThumb(prd, 'sm') : null,
              dom.h('div', {},
                dom.h('div', { style: 'font-weight: 500; font-size: var(--font-size-sm);' }, prd ? prd.name : sale.productId),
                dom.h('div', { style: 'font-size: var(--font-size-xs); color: var(--text-muted); font-family: monospace;' }, sale.id)
              )
            )
          ),
          dom.h('td', { style: 'text-align: right; font-weight: 600;' }, (isReturn ? '-' : '') + sale.qty),
          dom.h('td', {
            style: 'text-align: right; font-weight: 600; color: ' + (isReturn ? 'var(--danger)' : 'var(--text)') + ';',
          }, (isReturn ? '- ' : '') + format.currency(total)),
          dom.h('td', { style: 'font-size: var(--font-size-xs); color: var(--text-muted);' },
            (sale.customer && sale.customer.name) ? sale.customer.name : 'Walk-in'
          ),
          dom.h('td', { style: 'text-align: center;' },
            !isReturn ? (function () {
              const returnBtn = dom.h('button', {
                className: 'btn btn--secondary btn--sm',
                title: 'Process Return',
              }, 'Return');
              returnBtn.addEventListener('click', function () {
                openReturnModal(sale, prd, refreshLedger);
              });
              return returnBtn;
            })() : dom.h('span', { className: 'badge badge--danger' }, 'Returned')
          )
        );
        tbody.appendChild(tr);
      });

      table.appendChild(thead);
      table.appendChild(tbody);
      ledgerListWrap.appendChild(table);
    }

    submitBtn.addEventListener('click', function () {
      errorAlert.style.display = 'none';
      try {
        const qty = parseInt(qtyInput.value, 10);
        const unitPrice = parseFloat(priceInput.value);

        const saleRecord = salesSvc.recordSale({
          storeId: user.officeId,
          productId: selectedProduct.id,
          qty: qty,
          unitPrice: unitPrice,
          payment: selectedPayment,
          customer: {
            name: nameInput.value,
            phone: phoneInput.value,
          },
        });

        toast.show('Sale recorded successfully! Stock updated.', 'success');
        openReceiptModal(saleRecord, selectedProduct, storeName, user.name);

        // Reset form
        prdSelect.value = '';
        selectedProduct = null;
        prdPreview.style.display = 'none';
        nameInput.value = '';
        phoneInput.value = '';
        updateTotal();
        refreshLedger();
      } catch (err) {
        errorAlert.textContent = err.message;
        errorAlert.style.display = 'block';
      }
    });

    refreshLedger();
  }

  // ══════════════════════════════════════════════════════════
  // 2. PARENT OFFICE (HO, ZONE, DISTRICT) SALES OVERVIEW & TARGETS
  // ══════════════════════════════════════════════════════════
  function renderNetworkSalesOverview(page, user) {
    const headerRow = dom.h('div', { className: 'flex-between flex-wrap gap-4' },
      dom.h('div', {},
        dom.h('h1', { style: 'font-size: var(--font-size-2xl); font-weight: 700; color: var(--text);' }, 'Sales Intelligence & Targets'),
        dom.h('p', { style: 'font-size: var(--font-size-sm); color: var(--text-muted); margin-top: 4px;' },
          'Consolidated store sales performance, target achievement, and network transaction ledger'
        )
      )
    );
    page.appendChild(headerRow);

    // Terminal Notice Banner
    const infoBanner = dom.h('div', {
      className: 'card flex gap-3 items-center',
      style: 'background: var(--info-tint); border: 1px solid var(--primary); padding: var(--sp-4);',
    },
      dom.icon('info', 20, { style: 'color: var(--primary); flex-shrink: 0;' }),
      dom.h('div', { style: 'font-size: var(--font-size-sm); color: var(--text);' },
        'Retail checkout terminals are operated directly by Store personnel. As a management office, you have real-time visibility into all transactions and can set monthly targets for stores in your subtree.'
      )
    );
    page.appendChild(infoBanner);

    // KPI Cards
    const kpiRow = dom.h('div', { className: 'grid-4' });
    const now = new Date();
    const currentMonth = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0');
    const targets = salesSvc.getTargets(currentMonth);

    const totalAchieved = targets.reduce(function (sum, t) { return sum + t.achieved; }, 0);
    const totalTarget = targets.reduce(function (sum, t) { return sum + t.amount; }, 0);
    const overallPct = totalTarget > 0 ? Math.round((totalAchieved / totalTarget) * 1000) / 10 : 0;
    const allSalesInSubtree = salesSvc.getSales();
    const monthSales = allSalesInSubtree.filter(function (s) { return s.at.slice(0, 7) === currentMonth && s.type === 'sale'; });

    const kpi1 = dom.h('div', { className: 'kpi-card' },
      dom.h('div', { className: 'kpi-card__header' },
        dom.h('span', { className: 'kpi-card__label' }, 'Subtree Sales (Month)'),
        dom.h('div', { className: 'kpi-card__icon kpi-card__icon--blue' }, dom.icon('trending-up', 20))
      ),
      dom.h('div', { className: 'kpi-card__value' }, format.currency(totalAchieved)),
      dom.h('div', { className: 'kpi-card__footer' }, currentMonth + ' performance')
    );

    const kpi2 = dom.h('div', { className: 'kpi-card' },
      dom.h('div', { className: 'kpi-card__header' },
        dom.h('span', { className: 'kpi-card__label' }, 'Target Goal'),
        dom.h('div', { className: 'kpi-card__icon kpi-card__icon--purple' }, dom.icon('layers', 20))
      ),
      dom.h('div', { className: 'kpi-card__value' }, format.currency(totalTarget)),
      dom.h('div', { className: 'kpi-card__footer' }, targets.length + ' retail stores assigned')
    );

    const kpi3 = dom.h('div', { className: 'kpi-card' },
      dom.h('div', { className: 'kpi-card__header' },
        dom.h('span', { className: 'kpi-card__label' }, 'Goal Achievement'),
        dom.h('div', { className: 'kpi-card__icon kpi-card__icon--teal' }, dom.icon('zap', 20))
      ),
      dom.h('div', { className: 'kpi-card__value' }, overallPct + '%'),
      dom.h('div', { className: 'kpi-card__footer' }, 'Subtree weighted progress')
    );

    const kpi4 = dom.h('div', { className: 'kpi-card' },
      dom.h('div', { className: 'kpi-card__header' },
        dom.h('span', { className: 'kpi-card__label' }, 'Transactions (Month)'),
        dom.h('div', { className: 'kpi-card__icon kpi-card__icon--blue' }, dom.icon('receipt', 20))
      ),
      dom.h('div', { className: 'kpi-card__value' }, format.number(monthSales.length)),
      dom.h('div', { className: 'kpi-card__footer' }, 'Retail orders completed')
    );

    kpiRow.appendChild(kpi1);
    kpiRow.appendChild(kpi2);
    kpiRow.appendChild(kpi3);
    kpiRow.appendChild(kpi4);
    page.appendChild(kpiRow);

    // ── STORE TARGETS & ACHIEVEMENT TABLE ──
    const targetCard = dom.h('div', { className: 'card flex flex-col gap-4' });
    targetCard.appendChild(dom.h('div', { className: 'flex-between items-center' },
      dom.h('h3', { className: 'card-title' }, 'Store Monthly Sales Targets (' + currentMonth + ')'),
      dom.h('span', { style: 'font-size: var(--font-size-xs); color: var(--text-muted);' }, 'Click "Edit Target" to update quotas')
    ));

    const targetTableWrap = dom.h('div', { className: 'table-wrap' });
    const targetTable = dom.h('table', { className: 'table' });

    const tThead = dom.h('thead', {},
      dom.h('tr', {},
        dom.h('th', {}, 'Retail Store'),
        dom.h('th', {}, 'City'),
        dom.h('th', { style: 'text-align: right;' }, 'Monthly Target'),
        dom.h('th', { style: 'text-align: right;' }, 'Achieved'),
        dom.h('th', { style: 'width: 200px;' }, 'Achievement %'),
        dom.h('th', { style: 'text-align: center;' }, 'Action')
      )
    );

    const tTbody = dom.h('tbody', {});
    targets.forEach(function (t) {
      const isOver = t.percent >= 100;

      const tr = dom.h('tr', {},
        dom.h('td', {},
          dom.h('a', { href: '#/network/' + t.store.id, style: 'font-weight: 600; color: var(--text); text-decoration: none;' }, t.store.name),
          dom.h('div', { style: 'font-size: var(--font-size-xs); color: var(--text-muted); font-family: monospace;' }, t.store.code)
        ),
        dom.h('td', { style: 'color: var(--text-muted);' }, t.store.city),
        dom.h('td', { style: 'text-align: right; font-weight: 500;' }, format.currency(t.amount)),
        dom.h('td', { style: 'text-align: right; font-weight: 600;' }, format.currency(t.achieved)),
        dom.h('td', {},
          dom.h('div', { className: 'flex-between text-xs mb-1' },
            dom.h('span', { style: 'font-weight: 600;' }, t.percent + '%'),
            dom.h('span', { style: 'color: var(--text-muted);' }, format.currency(t.achieved) + ' / ' + format.currency(t.amount))
          ),
          dom.h('div', { className: 'target-progress-bar' },
            dom.h('div', {
              className: 'target-progress-fill ' + (isOver ? 'overachieved' : ''),
              style: 'width: ' + Math.min(t.percent, 100) + '%;',
            })
          )
        ),
        dom.h('td', { style: 'text-align: center;' },
          (function () {
            const editBtn = dom.h('button', { className: 'btn btn--secondary btn--sm' }, 'Edit Target');
            editBtn.addEventListener('click', function () {
              openTargetModal(t.store, currentMonth, t.amount, function () {
                window.location.reload();
              });
            });
            return editBtn;
          })()
        )
      );
      tTbody.appendChild(tr);
    });

    targetTable.appendChild(tThead);
    targetTable.appendChild(tTbody);
    targetTableWrap.appendChild(targetTable);
    targetCard.appendChild(targetTableWrap);
    page.appendChild(targetCard);

    // ── NETWORK TRANSACTION LEDGER ──
    const ledgerCard = dom.h('div', { className: 'card flex flex-col gap-4' });
    ledgerCard.appendChild(dom.h('h3', { className: 'card-title' }, 'Recent Network Sales Ledger'));

    const salesListWrap = dom.h('div', { className: 'table-wrap' });
    const salesTable = dom.h('table', { className: 'table' });

    const sThead = dom.h('thead', {},
      dom.h('tr', {},
        dom.h('th', {}, 'Date & Time'),
        dom.h('th', {}, 'Store Location'),
        dom.h('th', {}, 'Device / Product'),
        dom.h('th', { style: 'text-align: right;' }, 'Qty'),
        dom.h('th', { style: 'text-align: right;' }, 'Amount'),
        dom.h('th', {}, 'Payment'),
        dom.h('th', {}, 'Customer')
      )
    );

    const sTbody = dom.h('tbody', {});
    const productsMap = new Map();
    (storage.get('products') || []).forEach(function (p) { productsMap.set(p.id, p); });
    const officesMap = new Map();
    (storage.get('offices') || []).forEach(function (o) { officesMap.set(o.id, o); });

    const recentSales = allSalesInSubtree.slice(0, 30);
    recentSales.forEach(function (s) {
      const prd = productsMap.get(s.productId);
      const st = officesMap.get(s.storeId);
      const isReturn = s.type === 'return';

      const tr = dom.h('tr', {},
        dom.h('td', { style: 'font-size: var(--font-size-xs); color: var(--text-muted);' }, format.dateTime(s.at)),
        dom.h('td', {},
          dom.h('a', { href: '#/network/' + (st ? st.id : ''), style: 'font-weight: 500; color: var(--text); text-decoration: none;' }, st ? st.name : s.storeId),
          dom.h('div', { style: 'font-size: var(--font-size-xs); color: var(--text-muted);' }, st ? st.city : '')
        ),
        dom.h('td', {},
          dom.h('div', { className: 'flex gap-2 items-center' },
            prd ? productThumb(prd, 'sm') : null,
            dom.h('span', { style: 'font-weight: 500;' }, prd ? prd.name : s.productId)
          )
        ),
        dom.h('td', { style: 'text-align: right; font-weight: 600;' }, (isReturn ? '-' : '') + s.qty),
        dom.h('td', {
          style: 'text-align: right; font-weight: 600; color: ' + (isReturn ? 'var(--danger)' : 'var(--text)') + ';',
        }, (isReturn ? '- ' : '') + format.currency(s.qty * s.unitPrice)),
        dom.h('td', {},
          dom.h('span', { className: 'badge badge--neutral', style: 'text-transform: uppercase;' }, s.payment)
        ),
        dom.h('td', { style: 'font-size: var(--font-size-xs); color: var(--text-muted);' },
          (s.customer && s.customer.name) ? s.customer.name : 'Walk-in'
        )
      );
      sTbody.appendChild(tr);
    });

    salesTable.appendChild(sThead);
    salesTable.appendChild(sTbody);
    salesListWrap.appendChild(salesTable);
    ledgerCard.appendChild(salesListWrap);
    page.appendChild(ledgerCard);
  }

  // ══════════════════════════════════════════════════════════
  // MODALS: RECEIPT, RETURN, TARGET
  // ══════════════════════════════════════════════════════════
  function openReceiptModal(sale, product, storeName, cashierName) {
    const total = sale.qty * sale.unitPrice;
    const body = dom.h('div', { className: 'flex flex-col gap-4 text-center p-2' },
      dom.h('div', { style: 'font-size: var(--font-size-xl); font-weight: 700;' }, 'STOCKIFY RETAIL'),
      dom.h('div', { style: 'font-size: var(--font-size-xs); color: var(--text-muted);' },
        storeName + ' • ' + format.dateTime(sale.at) + '<br>Receipt #: ' + sale.id
      ),
      dom.h('hr', { style: 'border: none; border-top: 1px dashed var(--border); margin: var(--sp-2) 0;' }),
      dom.h('div', { className: 'flex-between items-center text-left' },
        dom.h('div', {},
          dom.h('div', { style: 'font-weight: 600;' }, product.name),
          dom.h('div', { style: 'font-size: var(--font-size-xs); color: var(--text-muted);' }, 'SKU: ' + product.sku)
        ),
        dom.h('div', { style: 'text-align: right;' },
          dom.h('div', { style: 'font-weight: 600;' }, sale.qty + ' x ' + format.currency(sale.unitPrice)),
          dom.h('div', { style: 'font-size: var(--font-size-base); font-weight: 700; color: var(--primary);' }, format.currency(total))
        )
      ),
      dom.h('hr', { style: 'border: none; border-top: 1px dashed var(--border); margin: var(--sp-2) 0;' }),
      dom.h('div', { className: 'flex-between text-xs', style: 'color: var(--text-muted);' },
        dom.h('span', {}, 'Payment Mode: ' + (sale.payment || 'cash').toUpperCase()),
        dom.h('span', {}, 'Customer: ' + ((sale.customer && sale.customer.name) || 'Walk-in'))
      ),
      dom.h('div', { style: 'font-size: var(--font-size-xs); color: var(--text-muted); margin-top: var(--sp-2);' },
        'Thank you for shopping with Stockify! Keep this receipt for warranty and returns.'
      )
    );

    const actions = dom.h('div', { className: 'flex-end gap-3 mt-4' });
    const printBtn = dom.h('button', { className: 'btn btn--secondary' }, dom.icon('printer', 16), dom.h('span', {}, 'Print'));
    const doneBtn = dom.h('button', { className: 'btn btn--primary' }, 'Done');
    actions.appendChild(printBtn);
    actions.appendChild(doneBtn);
    body.appendChild(actions);

    const dialog = modal.show({
      title: 'Tax Invoice & Receipt',
      content: body,
      size: 'sm',
    });

    printBtn.addEventListener('click', function () { window.print(); });
    doneBtn.addEventListener('click', function () { dialog.close(); });
  }

  function openReturnModal(sale, product, onReturned) {
    const body = dom.h('form', { className: 'flex flex-col gap-4' });

    body.appendChild(dom.h('div', { className: 'card flex gap-3 items-center', style: 'background: var(--surface-soft); padding: var(--sp-3);' },
      product ? productThumb(product, 'sm') : null,
      dom.h('div', {},
        dom.h('div', { style: 'font-weight: 600;' }, product ? product.name : sale.productId),
        dom.h('div', { style: 'font-size: var(--font-size-xs); color: var(--text-muted);' }, 'Original Sale: ' + sale.id + ' • ' + format.currency(sale.unitPrice) + ' / unit')
      )
    ));

    const qtyGroup = dom.h('div', { className: 'form-group' });
    qtyGroup.appendChild(dom.h('label', { className: 'form-label' }, 'Quantity to Return * (Max: ' + sale.qty + ')'));
    const qtyInput = dom.h('input', {
      type: 'number',
      className: 'input',
      min: '1',
      max: sale.qty,
      value: '1',
      required: true,
    });
    qtyGroup.appendChild(qtyInput);
    body.appendChild(qtyGroup);

    const reasonGroup = dom.h('div', { className: 'form-group' });
    reasonGroup.appendChild(dom.h('label', { className: 'form-label' }, 'Return Reason *'));
    const reasonSelect = dom.h('select', { className: 'select', required: true },
      dom.h('option', { value: 'Defective unit / DOA' }, 'Defective unit / DOA'),
      dom.h('option', { value: 'Customer changed mind' }, 'Customer changed mind'),
      dom.h('option', { value: 'Incorrect model purchased' }, 'Incorrect model purchased'),
      dom.h('option', { value: 'Packaging damaged' }, 'Packaging damaged')
    );
    reasonGroup.appendChild(reasonSelect);
    body.appendChild(reasonGroup);

    const errorAlert = dom.h('div', { className: 'badge badge--danger', style: 'display: none; padding: var(--sp-2); width: 100%;' });
    body.appendChild(errorAlert);

    const actions = dom.h('div', { className: 'flex-end gap-3 mt-4' });
    const cancelBtn = dom.h('button', { type: 'button', className: 'btn btn--secondary' }, 'Cancel');
    const submitBtn = dom.h('button', { type: 'submit', className: 'btn btn--primary' }, 'Confirm Return & Restore Stock');
    actions.appendChild(cancelBtn);
    actions.appendChild(submitBtn);
    body.appendChild(actions);

    const dialog = modal.show({
      title: 'Process Customer Return',
      content: body,
      size: 'md',
    });

    cancelBtn.addEventListener('click', function () { dialog.close(); });

    body.addEventListener('submit', function (e) {
      e.preventDefault();
      try {
        salesSvc.recordReturn({
          saleId: sale.id,
          qty: parseInt(qtyInput.value, 10),
          reason: reasonSelect.value,
        });
        toast.show('Return processed successfully! Inventory restored.', 'success');
        dialog.close();
        if (onReturned) onReturned();
      } catch (err) {
        errorAlert.textContent = err.message;
        errorAlert.style.display = 'block';
      }
    });
  }

  function openTargetModal(store, month, currentAmount, onSaved) {
    const body = dom.h('form', { className: 'flex flex-col gap-4' });

    body.appendChild(dom.h('p', { style: 'font-size: var(--font-size-sm); color: var(--text-muted);' },
      'Set the sales revenue quota for ' + store.name + ' (' + store.city + ') for ' + month + '.'
    ));

    const amtGroup = dom.h('div', { className: 'form-group' });
    amtGroup.appendChild(dom.h('label', { className: 'form-label' }, 'Target Amount (₹) *'));
    const amtInput = dom.h('input', {
      type: 'number',
      className: 'input',
      min: '0',
      step: '10000',
      value: currentAmount,
      required: true,
    });
    amtGroup.appendChild(amtInput);
    body.appendChild(amtGroup);

    const actions = dom.h('div', { className: 'flex-end gap-3 mt-4' });
    const cancelBtn = dom.h('button', { type: 'button', className: 'btn btn--secondary' }, 'Cancel');
    const saveBtn = dom.h('button', { type: 'submit', className: 'btn btn--primary' }, 'Save Target');
    actions.appendChild(cancelBtn);
    actions.appendChild(saveBtn);
    body.appendChild(actions);

    const dialog = modal.show({
      title: 'Edit Store Target: ' + store.name,
      content: body,
      size: 'sm',
    });

    cancelBtn.addEventListener('click', function () { dialog.close(); });

    body.addEventListener('submit', function (e) {
      e.preventDefault();
      salesSvc.setTarget(store.id, month, amtInput.value);
      toast.show('Monthly target updated successfully.', 'success');
      dialog.close();
      if (onSaved) onSaved();
    });
  }

  window.Stockify.views.sales = render;
})();

