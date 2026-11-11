// views/productForm.js — Add and Edit product form with mandatory image uploader and live preview
(function () {
  'use strict';

  const auth      = window.Stockify.services.auth;
  const prodSvc   = window.Stockify.services.products;
  const idGen     = window.Stockify.utils.id;
  const fmt       = window.Stockify.utils.format;
  const uploader  = window.Stockify.components.imageUploader;
  const toast     = window.Stockify.components.toast;

  /**
   * Render Product Add or Edit form (#/inventory/new or #/inventory/:id/edit).
   * Guarded for Head Office role only.
   * @param {Object} params - { productId }
   * @returns {HTMLElement}
   */
  function render(params) {
    const user = auth.getCurrentUser();
    if (!user || user.role !== 'head') {
      const page = document.createElement('div');
      page.className = 'page';
      const card = document.createElement('div');
      card.className = 'card empty-state';
      card.innerHTML =
        '<h3 class="empty-state__title">Access Restricted</h3>' +
        '<p class="empty-state__body">Only Head Office administrators can create or edit catalogue products.</p>';
      page.appendChild(card);
      return page;
    }

    const isEdit = !!(params && params.productId);
    const existing = isEdit ? prodSvc.getById(params.productId) : null;

    if (isEdit && !existing) {
      const page = document.createElement('div');
      page.className = 'page';
      const card = document.createElement('div');
      card.className = 'card empty-state';
      card.innerHTML = '<h3 class="empty-state__title">Product not found</h3>';
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
      if (isEdit) window.Stockify.router.navigate('#/inventory/' + existing.id);
      else window.Stockify.router.navigate('#/inventory');
    });

    const titleDiv = document.createElement('div');
    const title = document.createElement('h1');
    title.className = 'page-title';
    title.textContent = isEdit ? 'Edit Product: ' + existing.name : 'Add New Product';

    titleDiv.appendChild(title);
    left.appendChild(backBtn);
    left.appendChild(titleDiv);
    header.appendChild(left);
    page.appendChild(header);

    // Form container (2 columns: left Image Uploader & Live Preview, right Fields)
    const formGrid = document.createElement('div');
    formGrid.style.display = 'grid';
    formGrid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(360px, 1fr))';
    formGrid.style.gap = '24px';

    // ── LEFT COLUMN: Image Uploader & Live Preview ──
    const leftCol = document.createElement('div');
    leftCol.style.display = 'flex';
    leftCol.style.flexDirection = 'column';
    leftCol.style.gap = '20px';

    // Image Upload Card
    const uploadCard = document.createElement('div');
    uploadCard.className = 'card';
    uploadCard.innerHTML =
      '<h3 class="font-medium text-md mb-1">Product Photo <span class="required" style="color:var(--danger)">*</span></h3>' +
      '<p class="text-xs text-muted mb-4">Mandatory: upload a clear product photo on clean background.</p>';

    let uploadedImage = existing ? existing.image : null;

    const uploaderEl = uploader.create({
      initialImage: uploadedImage,
      onImageSelected: function (dataUrl) {
        uploadedImage = dataUrl;
        updateLivePreview();
        validateForm();
      },
      onImageRemoved: function () {
        uploadedImage = null;
        updateLivePreview();
        validateForm();
      },
    });

    uploadCard.appendChild(uploaderEl);
    leftCol.appendChild(uploadCard);

    // Live Preview Card
    const previewContainer = document.createElement('div');
    previewContainer.className = 'card';
    previewContainer.innerHTML =
      '<h3 class="font-medium text-md mb-2">Live Catalogue Preview</h3>' +
      '<p class="text-xs text-muted mb-4">How this item will display on the inventory grid.</p>' +
      '<div id="form-live-preview"></div>';

    leftCol.appendChild(previewContainer);
    formGrid.appendChild(leftCol);

    // ── RIGHT COLUMN: Product Details Form ──
    const formCard = document.createElement('div');
    formCard.className = 'card';

    const form = document.createElement('form');
    form.style.display = 'flex';
    form.style.flexDirection = 'column';
    form.style.gap = '16px';

    // Category Segmented Control
    const catGroup = document.createElement('div');
    catGroup.className = 'form-group';
    catGroup.innerHTML =
      '<label class="form-label">Category <span class="required">*</span></label>' +
      '<div class="seg-control mt-1" id="cat-segment">' +
        '<button type="button" class="seg-control__btn' + ((!existing || existing.category === 'smartphone') ? ' active' : '') + '" data-cat="smartphone">Smartphone</button>' +
        '<button type="button" class="seg-control__btn' + (existing && existing.category === 'smartwatch' ? ' active' : '') + '" data-cat="smartwatch">Smartwatch</button>' +
        '<button type="button" class="seg-control__btn' + (existing && existing.category === 'tablet' ? ' active' : '') + '" data-cat="tablet">Tablet</button>' +
      '</div>';
    form.appendChild(catGroup);

    let currentCategory = existing ? existing.category : 'smartphone';

    // Name & Brand
    const nameRow = document.createElement('div');
    nameRow.style.display = 'grid';
    nameRow.style.gridTemplateColumns = '1fr 1fr';
    nameRow.style.gap = '16px';
    nameRow.innerHTML =
      '<div class="form-group">' +
        '<label class="form-label">Product Name <span class="required">*</span></label>' +
        '<input type="text" class="input" id="inp-name" placeholder="e.g. iPhone 17 Pro" required value="' + (existing ? escapeHtml(existing.name) : '') + '">' +
        '<div class="form-error" id="err-name" style="display:none"></div>' +
      '</div>' +
      '<div class="form-group">' +
        '<label class="form-label">Brand <span class="required">*</span></label>' +
        '<input type="text" class="input" id="inp-brand" placeholder="e.g. Apple" required value="' + (existing ? escapeHtml(existing.brand) : '') + '">' +
        '<div class="form-error" id="err-brand" style="display:none"></div>' +
      '</div>';
    form.appendChild(nameRow);

    // SKU Field with Auto-Suggest Button
    const skuGroup = document.createElement('div');
    skuGroup.className = 'form-group';
    skuGroup.innerHTML =
      '<div class="flex justify-between items-center">' +
        '<label class="form-label">SKU (Unique) <span class="required">*</span></label>' +
        '<button type="button" class="btn btn--ghost btn--sm" id="btn-auto-sku" style="padding:0;font-size:12px;">Auto-suggest</button>' +
      '</div>' +
      '<input type="text" class="input" id="inp-sku" placeholder="e.g. SP-APL-IP17P-256-BLK" required value="' + (existing ? escapeHtml(existing.sku) : '') + '">' +
      '<div class="form-error" id="err-sku" style="display:none"></div>';
    form.appendChild(skuGroup);

    // Dynamic Category Variant Fields Container
    const variantContainer = document.createElement('div');
    variantContainer.id = 'category-variant-fields';
    variantContainer.style.display = 'grid';
    variantContainer.style.gridTemplateColumns = 'repeat(auto-fit, minmax(130px, 1fr))';
    variantContainer.style.gap = '14px';
    form.appendChild(variantContainer);

    // Pricing Row (Cost Price, Selling Price, Reorder Level)
    const priceRow = document.createElement('div');
    priceRow.style.display = 'grid';
    priceRow.style.gridTemplateColumns = '1fr 1fr 1fr';
    priceRow.style.gap = '14px';
    priceRow.innerHTML =
      '<div class="form-group">' +
        '<label class="form-label">Cost Price (₹) <span class="required">*</span></label>' +
        '<input type="number" class="input tabular-nums" id="inp-cost" min="0" placeholder="0" required value="' + (existing ? existing.costPrice : '') + '">' +
      '</div>' +
      '<div class="form-group">' +
        '<label class="form-label">Selling Price (₹) <span class="required">*</span></label>' +
        '<input type="number" class="input tabular-nums" id="inp-price" min="0" placeholder="0" required value="' + (existing ? existing.price : '') + '">' +
      '</div>' +
      '<div class="form-group">' +
        '<label class="form-label">Reorder Level <span class="required">*</span></label>' +
        '<input type="number" class="input tabular-nums" id="inp-reorder" min="0" placeholder="10" required value="' + (existing ? existing.reorderLevel : '10') + '">' +
      '</div>';
    form.appendChild(priceRow);

    // Price Warning Banner (e.g. Selling Price < Cost Price)
    const priceWarning = document.createElement('div');
    priceWarning.id = 'price-warning';
    priceWarning.style.display = 'none';
    priceWarning.style.background = 'var(--danger-tint)';
    priceWarning.style.color = 'var(--danger)';
    priceWarning.style.padding = '8px 12px';
    priceWarning.style.borderRadius = 'var(--radius-btn)';
    priceWarning.style.fontSize = '12px';
    priceWarning.textContent = 'Warning: Selling price is less than cost price (negative gross margin).';
    form.appendChild(priceWarning);

    // Description Field
    const descGroup = document.createElement('div');
    descGroup.className = 'form-group';
    descGroup.innerHTML =
      '<label class="form-label">Description (Optional)</label>' +
      '<textarea class="input" id="inp-desc" rows="3" style="height:auto;padding:10px" placeholder="Product details, specs summary, highlights…">' +
        (existing && existing.description ? escapeHtml(existing.description) : '') +
      '</textarea>';
    form.appendChild(descGroup);

    // Submit Button
    const submitBtn = document.createElement('button');
    submitBtn.type = 'submit';
    submitBtn.className = 'btn btn--primary w-full mt-4';
    submitBtn.id = 'btn-save-product';
    submitBtn.disabled = true;
    submitBtn.textContent = isEdit ? 'Save Changes' : 'Create Product';
    form.appendChild(submitBtn);

    formCard.appendChild(form);
    formGrid.appendChild(formCard);
    page.appendChild(formGrid);

    // ── Variant Fields Renderer by Category ──
    function renderVariantFields() {
      variantContainer.innerHTML = '';
      const existingVar = existing ? existing.variant : {};

      if (currentCategory === 'smartphone' || currentCategory === 'tablet') {
        variantContainer.innerHTML =
          '<div class="form-group">' +
            '<label class="form-label">Storage</label>' +
            '<input type="text" class="input" id="inp-var-storage" placeholder="e.g. 256GB" value="' + (existingVar.storage || '') + '">' +
          '</div>' +
          '<div class="form-group">' +
            '<label class="form-label">RAM</label>' +
            '<input type="text" class="input" id="inp-var-ram" placeholder="e.g. 12GB" value="' + (existingVar.ram || '') + '">' +
          '</div>' +
          '<div class="form-group">' +
            '<label class="form-label">Colour</label>' +
            '<input type="text" class="input" id="inp-var-color" placeholder="e.g. Black" value="' + (existingVar.color || '') + '">' +
          '</div>';
      } else if (currentCategory === 'smartwatch') {
        variantContainer.innerHTML =
          '<div class="form-group">' +
            '<label class="form-label">Case Size</label>' +
            '<input type="text" class="input" id="inp-var-casesize" placeholder="e.g. 44mm" value="' + (existingVar.caseSize || '') + '">' +
          '</div>' +
          '<div class="form-group">' +
            '<label class="form-label">Colour</label>' +
            '<input type="text" class="input" id="inp-var-color" placeholder="e.g. Titanium" value="' + (existingVar.color || '') + '">' +
          '</div>';
      }

      // Bind input listeners on variant fields for auto-suggest and preview
      variantContainer.querySelectorAll('input').forEach(function (inp) {
        inp.addEventListener('input', function () {
          updateLivePreview();
          validateForm();
        });
      });
    }

    renderVariantFields();

    // Category button toggles
    catGroup.querySelectorAll('button').forEach(function (btn) {
      btn.addEventListener('click', function () {
        catGroup.querySelectorAll('button').forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        currentCategory = btn.getAttribute('data-cat');
        renderVariantFields();
        updateLivePreview();
        validateForm();
      });
    });

    // Auto-suggest SKU button
    form.querySelector('#btn-auto-sku').addEventListener('click', function () {
      const name = form.querySelector('#inp-name').value;
      const brand = form.querySelector('#inp-brand').value;
      const storageEl = form.querySelector('#inp-var-storage');
      const caseEl = form.querySelector('#inp-var-casesize');
      const colorEl = form.querySelector('#inp-var-color');

      const storageVal = storageEl ? storageEl.value : (caseEl ? caseEl.value : '');
      const colorVal = colorEl ? colorEl.value : '';

      const suggested = idGen.suggestSku(currentCategory, brand, name, storageVal, colorVal);
      form.querySelector('#inp-sku').value = suggested;
      validateForm();
    });

    // Form validation check
    function validateForm() {
      const name = form.querySelector('#inp-name').value.trim();
      const brand = form.querySelector('#inp-brand').value.trim();
      const sku = form.querySelector('#inp-sku').value.trim();
      const cost = Number(form.querySelector('#inp-cost').value);
      const price = Number(form.querySelector('#inp-price').value);
      const reorder = Number(form.querySelector('#inp-reorder').value);

      let isValid = true;

      // Photo validation: mandatory
      if (!uploadedImage) isValid = false;
      if (!name) isValid = false;
      if (!brand) isValid = false;
      if (!sku) isValid = false;
      if (isNaN(cost) || cost < 0 || form.querySelector('#inp-cost').value === '') isValid = false;
      if (isNaN(price) || price < 0 || form.querySelector('#inp-price').value === '') isValid = false;
      if (isNaN(reorder) || reorder < 0 || form.querySelector('#inp-reorder').value === '') isValid = false;

      // Price warning (selling < cost)
      if (price > 0 && cost > 0 && price < cost) {
        priceWarning.style.display = 'block';
      } else {
        priceWarning.style.display = 'none';
      }

      submitBtn.disabled = !isValid;
      return isValid;
    }

    // Live preview update
    function updateLivePreview() {
      const previewArea = previewContainer.querySelector('#form-live-preview');
      const name = form.querySelector('#inp-name').value.trim() || 'Product Name';
      const brand = form.querySelector('#inp-brand').value.trim() || 'Brand';
      const price = Number(form.querySelector('#inp-price').value) || 0;

      const storageEl = form.querySelector('#inp-var-storage');
      const caseEl = form.querySelector('#inp-var-casesize');
      const colorEl = form.querySelector('#inp-var-color');
      const vStr = [storageEl ? storageEl.value : '', caseEl ? caseEl.value : '', colorEl ? colorEl.value : ''].filter(Boolean).join(' · ');

      previewArea.innerHTML =
        '<div class="product-card" style="max-width:260px;margin:0 auto;pointer-events:none;">' +
          '<div class="product-card__photo" style="aspect-ratio:1;">' +
            '<img src="' + (uploadedImage || 'assets/images/placeholder-product.svg') + '" alt="Preview" style="width:100%;height:100%;object-fit:contain;padding:10%;">' +
          '</div>' +
          '<div class="product-card__body">' +
            '<span class="product-card__brand font-semi text-xs">' + escapeHtml(brand) + '</span>' +
            '<h3 class="product-card__name">' + escapeHtml(name) + '</h3>' +
            '<div class="text-xs text-muted">' + (escapeHtml(vStr) || currentCategory) + '</div>' +
            '<div class="product-card__price tabular-nums">' + fmt.inr(price) + '</div>' +
            '<div class="product-card__footer">' +
              '<span class="text-xs font-medium">0 in stock</span>' +
              '<span class="badge badge--out">Out of Stock</span>' +
            '</div>' +
          '</div>' +
        '</div>';
    }

    // Input change listeners
    ['inp-name', 'inp-brand', 'inp-sku', 'inp-cost', 'inp-price', 'inp-reorder'].forEach(function (id) {
      form.querySelector('#' + id).addEventListener('input', function () {
        updateLivePreview();
        validateForm();
      });
    });

    // Form Submission
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validateForm()) return;

      const storageEl = form.querySelector('#inp-var-storage');
      const ramEl = form.querySelector('#inp-var-ram');
      const caseEl = form.querySelector('#inp-var-casesize');
      const colorEl = form.querySelector('#inp-var-color');

      const variantData = {};
      if (storageEl && storageEl.value.trim()) variantData.storage = storageEl.value.trim();
      if (ramEl && ramEl.value.trim()) variantData.ram = ramEl.value.trim();
      if (caseEl && caseEl.value.trim()) variantData.caseSize = caseEl.value.trim();
      if (colorEl && colorEl.value.trim()) variantData.color = colorEl.value.trim();

      const payload = {
        name: form.querySelector('#inp-name').value.trim(),
        brand: form.querySelector('#inp-brand').value.trim(),
        category: currentCategory,
        sku: form.querySelector('#inp-sku').value.trim(),
        costPrice: Number(form.querySelector('#inp-cost').value),
        price: Number(form.querySelector('#inp-price').value),
        reorderLevel: Number(form.querySelector('#inp-reorder').value),
        image: uploadedImage,
        variant: variantData,
        description: form.querySelector('#inp-desc').value.trim(),
      };

      try {
        if (isEdit) {
          prodSvc.update(existing.id, payload);
          toast.success('Product "' + payload.name + '" updated.');
          window.Stockify.router.navigate('#/inventory/' + existing.id);
        } else {
          const created = prodSvc.create(payload);
          toast.success('Product "' + created.name + '" created successfully.');
          window.Stockify.router.navigate('#/inventory/' + created.id);
        }
      } catch (err) {
        toast.error(err.message || 'Failed to save product.');
      }
    });

    updateLivePreview();
    validateForm();

    return page;
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  window.Stockify.views.productForm = render;
})();

