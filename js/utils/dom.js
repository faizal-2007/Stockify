// utils/dom.js — DOM helpers: h(), qs(), qsa(), mount(), el creation
(function () {
  'use strict';

  /**
   * Create a DOM element with attributes and children.
   * Never uses innerHTML; builds the tree via DOM API.
   * @param {string} tag - Tag name
   * @param {Object} [attrs] - Attributes / properties
   * @param {...(Node|string|null|undefined)} children - Child nodes or text strings
   * @returns {HTMLElement}
   */
  function h(tag, attrs) {
    const el = document.createElement(tag);

    if (attrs) {
      Object.keys(attrs).forEach(function (key) {
        const val = attrs[key];
        if (val === null || val === undefined) return;

        // Event handlers
        if (key.startsWith('on') && typeof val === 'function') {
          el.addEventListener(key.slice(2).toLowerCase(), val);
          return;
        }
        // Class arrays
        if (key === 'className' && Array.isArray(val)) {
          el.className = val.filter(Boolean).join(' ');
          return;
        }
        // Data attributes
        if (key.startsWith('data-')) {
          el.setAttribute(key, val);
          return;
        }
        // aria attributes
        if (key.startsWith('aria-')) {
          el.setAttribute(key, val);
          return;
        }
        // Boolean-like attributes
        if (typeof val === 'boolean') {
          if (val) el.setAttribute(key, '');
          return;
        }
        // Regular attributes vs properties
        if (key in el) {
          el[key] = val;
        } else {
          el.setAttribute(key, val);
        }
      });
    }

    // Children (starting at index 2)
    for (let i = 2; i < arguments.length; i++) {
      const child = arguments[i];
      if (child === null || child === undefined) continue;
      if (child instanceof Node) {
        el.appendChild(child);
      } else if (Array.isArray(child)) {
        child.forEach(function (c) {
          if (c instanceof Node) el.appendChild(c);
          else if (c != null) el.appendChild(document.createTextNode(String(c)));
        });
      } else {
        el.appendChild(document.createTextNode(String(child)));
      }
    }

    return el;
  }

  /**
   * Query a single element (scoped or global).
   * @param {string} selector
   * @param {Element} [scope=document]
   * @returns {Element|null}
   */
  function qs(selector, scope) {
    return (scope || document).querySelector(selector);
  }

  /**
   * Query all matching elements.
   * @param {string} selector
   * @param {Element} [scope=document]
   * @returns {Element[]}
   */
  function qsa(selector, scope) {
    return Array.from((scope || document).querySelectorAll(selector));
  }

  /**
   * Replace the children of a container with new content.
   * @param {Element} container
   * @param {...(Node|string|null)} content
   */
  function mount(container, content) {
    while (container.firstChild) container.removeChild(container.firstChild);
    for (let i = 1; i < arguments.length; i++) {
      const c = arguments[i];
      if (c === null || c === undefined) continue;
      if (c instanceof Node) container.appendChild(c);
      else if (Array.isArray(c)) {
        c.forEach(function (item) {
          if (item instanceof Node) container.appendChild(item);
          else if (item != null) container.appendChild(document.createTextNode(String(item)));
        });
      } else {
        container.appendChild(document.createTextNode(String(c)));
      }
    }
  }

  /**
   * Create an SVG element (requires SVG namespace).
   * @param {string} tag
   * @param {Object} [attrs]
   * @returns {SVGElement}
   */
  function svgEl(tag, attrs) {
    const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (key) {
        el.setAttribute(key, attrs[key]);
      });
    }
    return el;
  }

  /**
   * Append a list of children to a parent.
   * @param {Element} parent
   * @param {Array} children
   */
  function appendAll(parent, children) {
    children.forEach(function (c) {
      if (c instanceof Node) parent.appendChild(c);
    });
  }

  const ICON_PATHS = {
    'plus': '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
    'chevron-right': '<polyline points="9 18 15 12 9 6"/>',
    'box': '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>',
    'clipboard': '<path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="13" y2="16"/>',
    'pencil': '<path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>',
    'receipt': '<path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1z"/><line x1="8" y1="7" x2="16" y2="7"/><line x1="8" y1="11" x2="16" y2="11"/><line x1="8" y1="15" x2="13" y2="15"/>',
    'printer': '<polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>',
    'zap': '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
    'credit-card': '<rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>',
    'layers': '<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>',
    'trending-up': '<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>',
    'info': '<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>',
    'check': '<polyline points="20 6 9 17 4 12"/>',
    'x': '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
  };

  /**
   * Create an inline SVG icon element.
   * @param {string} name - Icon name
   * @param {number} [size=20] - Size in pixels
   * @param {Object} [attrs] - Additional attributes
   * @returns {HTMLElement}
   */
  function icon(name, size, attrs) {
    const s = size || 20;
    const span = document.createElement('span');
    span.className = 'icon-wrap';
    span.style.display = 'inline-flex';
    span.style.alignItems = 'center';
    span.style.justifyContent = 'center';
    span.style.width = s + 'px';
    span.style.height = s + 'px';
    span.style.flexShrink = '0';
    if (attrs && attrs.style) {
      Object.assign(span.style, attrs.style);
    }
    const inner = ICON_PATHS[name] || '<circle cx="12" cy="12" r="8"/>';
    span.innerHTML = '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + inner + '</svg>';
    return span;
  }

  window.Stockify.utils.dom = { h, qs, qsa, mount, svgEl, appendAll, icon };
})();

