// services/products.js — Product catalogue management with validation and HO permission checks
(function () {
  'use strict';

  const storage   = window.Stockify.store.storage;
  const selectors = window.Stockify.store.selectors;
  const auth      = window.Stockify.services.auth;
  const idGen     = window.Stockify.utils.id;
  const events    = window.Stockify.events;

  function PermissionError(msg) { this.name = 'PermissionError'; this.message = msg; }
  PermissionError.prototype = Object.create(Error.prototype);

  function ValidationError(msg) { this.name = 'ValidationError'; this.message = msg; }
  ValidationError.prototype = Object.create(Error.prototype);

  /**
   * List all products with optional filters.
   * @param {Object} [filters] - { search, category, status, brand, officeId }
   * @returns {Array<Object>}
   */
  function list(filters) {
    const products = storage.get('products') || [];
    const f = filters || {};
    const officeId = f.officeId || (auth.getCurrentUser() ? auth.getCurrentUser().officeId : 'off_001');
    const subtree = selectors.subtreeIds(officeId);

    return products.filter(function (p) {
      if (!p.active && !f.includeInactive) return false;

      // Category filter
      if (f.category && f.category !== 'all' && p.category !== f.category) return false;

      // Brand filter
      if (f.brand && f.brand !== 'all' && p.brand.toLowerCase() !== f.brand.toLowerCase()) return false;

      // Search query (name, brand, SKU)
      if (f.search && f.search.trim()) {
        const q = f.search.trim().toLowerCase();
        const matchName  = p.name.toLowerCase().includes(q);
        const matchBrand = p.brand.toLowerCase().includes(q);
        const matchSku   = p.sku.toLowerCase().includes(q);
        if (!matchName && !matchBrand && !matchSku) return false;
      }

      // Stock status filter (scoped to subtree)
      if (f.status && f.status !== 'all') {
        const total = selectors.totalQty(p.id, subtree);
        const st = selectors.stockStatus(total, p.reorderLevel);
        if (st !== f.status) return false;
      }

      return true;
    });
  }

  /**
   * Get a single product by ID.
   * @param {string} productId
   * @returns {Object|null}
   */
  function getById(productId) {
    return selectors.getProduct(productId);
  }

  /**
   * Validate product payload before create or update.
   * @param {Object} data
   * @param {string} [excludeId]
   */
  function validateProductData(data, excludeId) {
    if (!data.name || !data.name.trim()) throw new ValidationError('Product name is required.');
    if (!data.brand || !data.brand.trim()) throw new ValidationError('Brand is required.');
    if (!data.category) throw new ValidationError('Category is required.');
    if (!data.sku || !data.sku.trim()) throw new ValidationError('SKU is required.');
    if (!data.image || !data.image.trim()) throw new ValidationError('Product photo is mandatory.');

    const cost = Number(data.costPrice);
    const price = Number(data.price);
    const reorder = Number(data.reorderLevel);

    if (isNaN(cost) || cost < 0) throw new ValidationError('Cost price must be a non-negative number.');
    if (isNaN(price) || price < 0) throw new ValidationError('Selling price must be a non-negative number.');
    if (isNaN(reorder) || reorder < 0) throw new ValidationError('Reorder level must be a non-negative number.');

    // Check SKU uniqueness
    const products = storage.get('products') || [];
    const duplicate = products.find(function (p) {
      return p.sku.toUpperCase() === data.sku.trim().toUpperCase() && p.id !== excludeId;
    });
    if (duplicate) {
      throw new ValidationError('SKU "' + data.sku + '" is already used by another product.');
    }
  }

  /**
   * Create a new product. Head Office only.
   * @param {Object} data
   * @returns {Object} created product
   */
  function create(data) {
    const user = auth.getCurrentUser();
    if (!user || user.role !== 'head') {
      throw new PermissionError('Only Head Office can create new products.');
    }

    validateProductData(data);

    const products = storage.get('products') || [];
    const newId = idGen.productId();

    const product = {
      id: newId,
      sku: data.sku.trim().toUpperCase(),
      name: data.name.trim(),
      brand: data.brand.trim(),
      category: data.category,
      variant: data.variant || {},
      costPrice: Number(data.costPrice),
      price: Number(data.price),
      reorderLevel: Number(data.reorderLevel) || 10,
      image: data.image,
      description: data.description ? data.description.trim() : '',
      active: true,
      createdAt: new Date().toISOString(),
      createdBy: user.id,
    };

    products.push(product);
    storage.set('products', products);

    // Initialise 0 stock row for Head Office
    const stock = storage.get('stock') || [];
    const offices = selectors.getAllOffices();
    offices.forEach(function (off) {
      stock.push({ officeId: off.id, productId: newId, qty: 0 });
    });
    storage.set('stock', stock);

    events.emit('product:created', { product: product });
    return product;
  }

  /**
   * Update an existing product. Head Office only.
   * @param {string} productId
   * @param {Object} updates
   * @returns {Object} updated product
   */
  function update(productId, updates) {
    const user = auth.getCurrentUser();
    if (!user || user.role !== 'head') {
      throw new PermissionError('Only Head Office can edit products.');
    }

    const products = storage.get('products') || [];
    const index = products.findIndex(function (p) { return p.id === productId; });
    if (index === -1) throw new ValidationError('Product not found: ' + productId);

    const merged = Object.assign({}, products[index], updates);
    validateProductData(merged, productId);

    products[index] = merged;
    storage.set('products', products);

    events.emit('product:updated', { product: merged });
    return merged;
  }

  /**
   * Deactivate a product. Head Office only. Products with stock or history cannot be hard deleted.
   * @param {string} productId
   * @returns {Object} deactivated product
   */
  function deactivate(productId) {
    const user = auth.getCurrentUser();
    if (!user || user.role !== 'head') {
      throw new PermissionError('Only Head Office can deactivate products.');
    }

    const products = storage.get('products') || [];
    const p = products.find(function (item) { return item.id === productId; });
    if (!p) throw new ValidationError('Product not found: ' + productId);

    p.active = false;
    storage.set('products', products);

    events.emit('product:deactivated', { productId: productId });
    return p;
  }

  window.Stockify.services.products = {
    list,
    getById,
    create,
    update,
    deactivate,
    PermissionError,
    ValidationError,
  };
})();

