// components/productThumb.js — Product photo thumbnail with placeholder fallback
(function () {
  'use strict';

  const FALLBACK_SRC = 'assets/images/placeholder-product.svg';

  /**
   * Create a standardized product thumbnail element.
   * Every product image rendered across the app must use this component.
   * @param {Object} product - Product model { name, brand, image, variant }
   * @param {number} [size=48] - Dimension in pixels (width & height)
   * @param {string} [className=''] - Additional CSS classes
   * @returns {HTMLElement}
   */
  function create(product, size, className) {
    const s = size || 48;
    const wrap = document.createElement('div');
    wrap.className = 'product-thumb' + (className ? ' ' + className : '');
    wrap.style.width = s + 'px';
    wrap.style.height = s + 'px';
    wrap.style.flexShrink = '0';

    const img = document.createElement('img');
    const brand = product && product.brand ? product.brand : '';
    const name = product && product.name ? product.name : 'Product';
    const color = product && product.variant && product.variant.color ? ' ' + product.variant.color : '';

    img.alt = (brand + ' ' + name + color).trim();
    img.loading = 'lazy';
    img.src = (product && product.image) ? product.image : FALLBACK_SRC;

    img.onerror = function () {
      if (img.src !== FALLBACK_SRC) {
        img.src = FALLBACK_SRC;
      }
    };

    wrap.appendChild(img);
    return wrap;
  }

  function productThumb(product, size, className) {
    let s = 48;
    if (typeof size === 'number') s = size;
    else if (size === 'xs') s = 24;
    else if (size === 'sm') s = 36;
    else if (size === 'md') s = 48;
    else if (size === 'lg') s = 80;
    else if (size === 'xl') s = 140;

    return create(product, s, className);
  }
  productThumb.create = create;

  window.Stockify.components.productThumb = productThumb;
})();
