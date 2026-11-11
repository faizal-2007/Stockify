// views/network.js — Organizational hierarchy tree, office metrics, and office creation modal
(function () {
  'use strict';

  const dom       = window.Stockify.utils.dom;
  const format    = window.Stockify.utils.format;
  const auth      = window.Stockify.services.auth;
  const officesSvc= window.Stockify.services.offices;
  const modal     = window.Stockify.components.modal;
  const toast     = window.Stockify.components.toast;
  const storage   = window.Stockify.store.storage;

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
   * Render the Network Hierarchy Page.
   * @returns {HTMLElement}
   */
  function render() {
    const user = auth.currentUser();
    const page = dom.h('div', { className: 'page' });

    // ── Header & Action Bar ──
    const headerRow = dom.h('div', { className: 'flex-between flex-wrap gap-4' },
      dom.h('div', {},
        dom.h('h1', { style: 'font-size: var(--font-size-2xl); font-weight: 700; color: var(--text);' }, 'Network Hierarchy'),
        dom.h('p', { style: 'font-size: var(--font-size-sm); color: var(--text-muted); margin-top: 4px;' },
          'Multi-tier organizational structure, physical stock counts, and inventory health distribution'
        )
      )
    );

    // Can this user add any office?
    const canAdd = officesSvc.canManageOffice('store') || officesSvc.canManageOffice('district') || officesSvc.canManageOffice('zone');
    if (canAdd) {
      const addBtn = dom.h('button', { className: 'btn btn--primary' },
        dom.icon('plus', 16),
        dom.h('span', {}, 'Add Office')
      );
      addBtn.addEventListener('click', function () {
        openOfficeModal(null, refreshTree);
      });
      headerRow.appendChild(addBtn);
    }
    page.appendChild(headerRow);

    // ── Filter Bar ──
    const filterCard = dom.h('div', { className: 'card flex-between flex-wrap gap-4', style: 'padding: var(--sp-4);' });
    const searchInput = dom.h('input', {
      type: 'text',
      className: 'input',
      placeholder: 'Search office by name, code, city, manager...',
      style: 'max-width: 360px;',
    });

    const chipsWrap = dom.h('div', { className: 'flex gap-2 flex-wrap' });
    const types = [
      { id: 'all', label: 'All Offices' },
      { id: 'head', label: 'Head Office' },
      { id: 'zone', label: 'Zones' },
      { id: 'district', label: 'Districts' },
      { id: 'store', label: 'Stores' },
    ];
    let selectedType = 'all';

    types.forEach(function (t) {
      const chip = dom.h('button', {
        className: 'btn btn--secondary btn--sm ' + (t.id === selectedType ? 'active-chip' : ''),
      }, t.label);
      chip.addEventListener('click', function () {
        selectedType = t.id;
        chipsWrap.querySelectorAll('button').forEach(function (b) { b.classList.remove('active-chip'); });
        chip.classList.add('active-chip');
        applyFilter();
      });
      chipsWrap.appendChild(chip);
    });

    filterCard.appendChild(searchInput);
    filterCard.appendChild(chipsWrap);
    page.appendChild(filterCard);

    // ── Tree Container ──
    const treeContainer = dom.h('div', { className: 'network-tree' });
    page.appendChild(treeContainer);

    function refreshTree() {
      treeContainer.innerHTML = '';
      const rootNode = officesSvc.getHierarchy();
      if (!rootNode) {
        treeContainer.appendChild(dom.h('div', { className: 'card empty-state' }, 'No offices found in scope.'));
        return;
      }
      renderNode(rootNode, 1, treeContainer);
      applyFilter();
    }

    /**
     * Recursively renders a hierarchy node.
     */
    function renderNode(node, level, parentEl) {
      const nodeWrap = dom.h('div', {
        className: 'tree-node-wrap tree-level-' + Math.min(level, 4),
        dataset: {
          id: node.id,
          type: node.type,
          text: (node.name + ' ' + node.code + ' ' + node.city + ' ' + node.manager).toLowerCase(),
        },
      });

      const card = dom.h('div', {
        className: 'tree-node-card tree-node-card--' + node.type,
      });

      // Left: icon + meta
      const left = dom.h('div', { className: 'tree-node-card__left' });
      const icon = dom.h('div', {
        className: 'tree-node-card__icon',
        style: 'background: var(--surface-soft); color: var(--primary);',
      }, dom.icon(node.type === 'store' ? 'box' : 'clipboard', 22));

      const meta = dom.h('div', { className: 'tree-node-card__meta' });
      const titleRow = dom.h('div', { className: 'tree-node-card__title' },
        dom.h('a', {
          href: '#/network/' + node.id,
          style: 'color: inherit; text-decoration: none; font-weight: 600;',
        }, node.name),
        dom.h('span', { className: 'badge ' + (TYPE_CLASSES[node.type] || 'badge--neutral') }, TYPE_LABELS[node.type] || node.type),
        dom.h('span', { style: 'font-size: var(--font-size-xs); color: var(--text-muted); font-family: monospace;' }, node.code)
      );

      const subtitleRow = dom.h('div', { className: 'tree-node-card__subtitle' },
        dom.h('span', {}, 'Manager: ' + node.manager),
        dom.h('span', {}, '•'),
        dom.h('span', {}, node.city),
        node.type !== 'store' ? dom.h('span', {}, '•') : null,
        node.type !== 'store' ? dom.h('span', {}, (node.metrics.storesCount || 0) + ' Stores in Subtree') : null
      );

      meta.appendChild(titleRow);
      meta.appendChild(subtitleRow);
      left.appendChild(icon);
      left.appendChild(meta);

      // Right: metrics
      const right = dom.h('div', { className: 'tree-node-card__metrics' });

      // Units
      const unitsCol = dom.h('div', { className: 'tree-metric-col' },
        dom.h('span', { className: 'tree-metric-col__label' }, 'Physical Units'),
        dom.h('span', { className: 'tree-metric-col__val' }, format.number(node.metrics.totalUnits))
      );

      // Value
      const valCol = dom.h('div', { className: 'tree-metric-col' },
        dom.h('span', { className: 'tree-metric-col__label' }, 'Total Stock Value'),
        dom.h('span', { className: 'tree-metric-col__val' }, format.currency(node.metrics.totalValue))
      );

      // Health Mini-Bar
      const totalStockItems = node.metrics.healthy + node.metrics.low + node.metrics.out;
      const hPct = totalStockItems > 0 ? (node.metrics.healthy / totalStockItems) * 100 : 100;
      const lPct = totalStockItems > 0 ? (node.metrics.low / totalStockItems) * 100 : 0;
      const oPct = totalStockItems > 0 ? (node.metrics.out / totalStockItems) * 100 : 0;

      const healthCol = dom.h('div', { className: 'tree-metric-col' },
        dom.h('span', { className: 'tree-metric-col__label' }, 'Stock Health'),
        dom.h('div', {
          className: 'mini-health-bar',
          title: 'Healthy: ' + node.metrics.healthy + ' | Low: ' + node.metrics.low + ' | Out: ' + node.metrics.out,
        },
          dom.h('div', { className: 'mini-health-bar__seg--healthy', style: 'width:' + hPct + '%;' }),
          dom.h('div', { className: 'mini-health-bar__seg--low', style: 'width:' + lPct + '%;' }),
          dom.h('div', { className: 'mini-health-bar__seg--out', style: 'width:' + oPct + '%;' })
        )
      );

      // Detail Link
      const viewBtn = dom.h('a', {
        href: '#/network/' + node.id,
        className: 'btn btn--ghost btn--sm',
        title: 'View Office Details',
      }, dom.icon('chevron-right', 16));

      right.appendChild(unitsCol);
      right.appendChild(valCol);
      right.appendChild(healthCol);
      right.appendChild(viewBtn);

      card.appendChild(left);
      card.appendChild(right);
      nodeWrap.appendChild(card);

      parentEl.appendChild(nodeWrap);

      // Children
      if (node.children && node.children.length > 0) {
        node.children.forEach(function (child) {
          renderNode(child, level + 1, parentEl);
        });
      }
    }

    function applyFilter() {
      const q = (searchInput.value || '').trim().toLowerCase();
      const nodeWraps = treeContainer.querySelectorAll('.tree-node-wrap');

      nodeWraps.forEach(function (wrap) {
        const type = wrap.getAttribute('data-type');
        const text = wrap.getAttribute('data-text');

        const matchesType = (selectedType === 'all' || type === selectedType);
        const matchesQuery = (!q || text.includes(q));

        wrap.style.display = (matchesType && matchesQuery) ? '' : 'none';
      });
    }

    searchInput.addEventListener('input', applyFilter);

    // Initial Tree render
    refreshTree();

    return page;
  }

  /**
   * Modal dialog to add or edit an office.
   */
  function openOfficeModal(existingOffice, onSaved) {
    const user = auth.currentUser();
    const isEdit = Boolean(existingOffice);
    const allOffices = storage.get('offices') || [];

    // Determine allowed types
    const allowedTypes = [];
    if (user.role === 'head') {
      if (!isEdit) allowedTypes.push('zone', 'district', 'store');
      else allowedTypes.push(existingOffice.type);
    } else if (user.role === 'zone') {
      if (!isEdit) allowedTypes.push('district', 'store');
      else allowedTypes.push(existingOffice.type);
    } else if (user.role === 'district') {
      if (!isEdit) allowedTypes.push('store');
      else allowedTypes.push(existingOffice.type);
    }

    if (allowedTypes.length === 0) {
      toast.show('You do not have permission to manage offices.', 'danger');
      return;
    }

    const form = dom.h('form', { className: 'flex flex-col gap-4' });

    // Type selector
    const typeGroup = dom.h('div', { className: 'form-group' });
    typeGroup.appendChild(dom.h('label', { className: 'form-label' }, 'Office Type *'));
    const typeSelect = dom.h('select', { className: 'select', disabled: isEdit });
    allowedTypes.forEach(function (t) {
      const opt = dom.h('option', { value: t }, TYPE_LABELS[t]);
      if (existingOffice && existingOffice.type === t) opt.selected = true;
      typeSelect.appendChild(opt);
    });
    typeGroup.appendChild(typeSelect);
    form.appendChild(typeGroup);

    // Parent Office selector (hidden if head office or editing)
    const parentGroup = dom.h('div', { className: 'form-group' });
    parentGroup.appendChild(dom.h('label', { className: 'form-label' }, 'Parent Office *'));
    const parentSelect = dom.h('select', { className: 'select', disabled: isEdit });
    parentGroup.appendChild(parentSelect);
    form.appendChild(parentGroup);

    function populateParents() {
      parentSelect.innerHTML = '';
      const chosenType = typeSelect.value;
      const expectedParentType = chosenType === 'zone' ? 'head' : (chosenType === 'district' ? 'zone' : 'district');

      const validParents = allOffices.filter(function (o) {
        return o.type === expectedParentType && o.active !== false;
      });

      validParents.forEach(function (p) {
        const opt = dom.h('option', { value: p.id }, p.name + ' (' + p.city + ')');
        if (existingOffice && existingOffice.parentId === p.id) opt.selected = true;
        parentSelect.appendChild(opt);
      });
    }

    typeSelect.addEventListener('change', populateParents);
    populateParents();

    // Code
    const codeGroup = dom.h('div', { className: 'form-group' });
    codeGroup.appendChild(dom.h('label', { className: 'form-label' }, 'Office Code *'));
    const codeInput = dom.h('input', {
      type: 'text',
      className: 'input',
      value: existingOffice ? existingOffice.code : '',
      placeholder: 'e.g. STR-BLR-04',
      required: true,
    });
    codeGroup.appendChild(codeInput);
    form.appendChild(codeGroup);

    // Name
    const nameGroup = dom.h('div', { className: 'form-group' });
    nameGroup.appendChild(dom.h('label', { className: 'form-label' }, 'Office Name *'));
    const nameInput = dom.h('input', {
      type: 'text',
      className: 'input',
      value: existingOffice ? existingOffice.name : '',
      placeholder: 'e.g. Indiranagar Retail Outlet',
      required: true,
    });
    nameGroup.appendChild(nameInput);
    form.appendChild(nameGroup);

    // City
    const cityGroup = dom.h('div', { className: 'form-group' });
    cityGroup.appendChild(dom.h('label', { className: 'form-label' }, 'City *'));
    const cityInput = dom.h('input', {
      type: 'text',
      className: 'input',
      value: existingOffice ? existingOffice.city : '',
      placeholder: 'e.g. Bengaluru',
      required: true,
    });
    cityGroup.appendChild(cityInput);
    form.appendChild(cityGroup);

    // Manager
    const managerGroup = dom.h('div', { className: 'form-group' });
    managerGroup.appendChild(dom.h('label', { className: 'form-label' }, 'Manager Name *'));
    const managerInput = dom.h('input', {
      type: 'text',
      className: 'input',
      value: existingOffice ? existingOffice.manager : '',
      placeholder: 'e.g. Rahul Sharma',
      required: true,
    });
    managerGroup.appendChild(managerInput);
    form.appendChild(managerGroup);

    // Error alert
    const errorAlert = dom.h('div', {
      className: 'badge badge--danger',
      style: 'display: none; padding: var(--sp-3); width: 100%; border-radius: var(--radius-sm);',
    });
    form.appendChild(errorAlert);

    // Buttons
    const actions = dom.h('div', { className: 'flex-end gap-3 mt-4' });
    const cancelBtn = dom.h('button', { type: 'button', className: 'btn btn--secondary' }, 'Cancel');
    const submitBtn = dom.h('button', { type: 'submit', className: 'btn btn--primary' }, isEdit ? 'Save Changes' : 'Create Office');
    actions.appendChild(cancelBtn);
    actions.appendChild(submitBtn);
    form.appendChild(actions);

    const dialog = modal.show({
      title: isEdit ? 'Edit Office: ' + existingOffice.name : 'Add New Office',
      content: form,
      size: 'md',
    });

    cancelBtn.addEventListener('click', function () {
      dialog.close();
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      errorAlert.style.display = 'none';

      try {
        if (isEdit) {
          officesSvc.updateOffice(existingOffice.id, {
            code: codeInput.value,
            name: nameInput.value,
            city: cityInput.value,
            manager: managerInput.value,
          });
          toast.show('Office details updated successfully.', 'success');
        } else {
          officesSvc.createOffice({
            type: typeSelect.value,
            parentId: parentSelect.value,
            code: codeInput.value,
            name: nameInput.value,
            city: cityInput.value,
            manager: managerInput.value,
          });
          toast.show('Office created successfully with initialized inventory.', 'success');
        }

        dialog.close();
        if (onSaved) onSaved();
      } catch (err) {
        errorAlert.textContent = err.message;
        errorAlert.style.display = 'block';
      }
    });
  }

  window.Stockify.views.network = render;
  window.Stockify.views.openOfficeModal = openOfficeModal;
})();

