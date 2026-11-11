// components/drawer.js — Accessible side drawer panel with sliding transition
(function () {
  'use strict';

  /**
   * Open a side drawer panel.
   * @param {Object} options - { title, content, footer, onClose }
   * @returns {HTMLElement} drawer backdrop element
   */
  function open(options) {
    const backdrop = document.createElement('div');
    backdrop.className = 'drawer-backdrop';
    backdrop.setAttribute('role', 'dialog');
    backdrop.setAttribute('aria-modal', 'true');

    const drawer = document.createElement('div');
    drawer.className = 'drawer';

    // Header
    const header = document.createElement('div');
    header.className = 'modal__header';

    const title = document.createElement('h3');
    title.className = 'modal__title';
    title.textContent = options.title || 'Details';

    const closeBtn = document.createElement('button');
    closeBtn.className = 'btn btn--ghost btn--icon';
    closeBtn.setAttribute('aria-label', 'Close drawer');
    closeBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';

    header.appendChild(title);
    header.appendChild(closeBtn);
    drawer.appendChild(header);

    // Body
    const body = document.createElement('div');
    body.className = 'modal__body';
    if (options.content instanceof Node) {
      body.appendChild(options.content);
    } else if (typeof options.content === 'string') {
      const p = document.createElement('p');
      p.textContent = options.content;
      body.appendChild(p);
    }
    drawer.appendChild(body);

    // Footer (optional)
    if (options.footer) {
      const footer = document.createElement('div');
      footer.className = 'modal__footer';
      if (options.footer instanceof Node) footer.appendChild(options.footer);
      drawer.appendChild(footer);
    }

    backdrop.appendChild(drawer);
    document.body.appendChild(backdrop);

    function close() {
      if (backdrop.parentNode) backdrop.parentNode.removeChild(backdrop);
      document.removeEventListener('keydown', handleKey);
      if (options.onClose) options.onClose();
    }

    function handleKey(e) {
      if (e.key === 'Escape') close();
    }

    closeBtn.addEventListener('click', close);
    backdrop.addEventListener('click', function (e) {
      if (e.target === backdrop) close();
    });

    document.addEventListener('keydown', handleKey);

    backdrop.close = close;
    return backdrop;
  }

  window.Stockify.components.drawer = { open };
})();

