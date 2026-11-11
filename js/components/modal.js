// components/modal.js — Accessible modal and confirmation dialogs
(function () {
  'use strict';

  /**
   * Show a modal dialog.
   * @param {Object} options - { title, content, confirmText, confirmClass, onConfirm, cancelText, onCancel }
   * @returns {HTMLElement} backdrop element
   */
  function show(options) {
    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop';
    backdrop.setAttribute('role', 'dialog');
    backdrop.setAttribute('aria-modal', 'true');

    const modal = document.createElement('div');
    modal.className = 'modal';

    // Header
    const header = document.createElement('div');
    header.className = 'modal__header';

    const title = document.createElement('h3');
    title.className = 'modal__title';
    title.textContent = options.title || 'Notification';

    const closeBtn = document.createElement('button');
    closeBtn.className = 'btn btn--ghost btn--icon';
    closeBtn.setAttribute('aria-label', 'Close modal');
    closeBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';

    header.appendChild(title);
    header.appendChild(closeBtn);

    // Body
    const body = document.createElement('div');
    body.className = 'modal__body';
    if (typeof options.content === 'string') {
      const p = document.createElement('p');
      p.textContent = options.content;
      body.appendChild(p);
    } else if (options.content instanceof Node) {
      body.appendChild(options.content);
    }

    // Footer
    const footer = document.createElement('div');
    footer.className = 'modal__footer';

    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'btn btn--secondary';
    cancelBtn.type = 'button';
    cancelBtn.textContent = options.cancelText || 'Cancel';

    const confirmBtn = document.createElement('button');
    confirmBtn.className = 'btn ' + (options.confirmClass || 'btn--primary');
    confirmBtn.type = 'button';
    confirmBtn.textContent = options.confirmText || 'Confirm';

    footer.appendChild(cancelBtn);
    footer.appendChild(confirmBtn);

    modal.appendChild(header);
    modal.appendChild(body);
    modal.appendChild(footer);
    backdrop.appendChild(modal);

    document.body.appendChild(backdrop);

    function close() {
      if (backdrop.parentNode) backdrop.parentNode.removeChild(backdrop);
      document.removeEventListener('keydown', handleKey);
    }

    function handleKey(e) {
      if (e.key === 'Escape') {
        close();
        if (options.onCancel) options.onCancel();
      }
    }

    closeBtn.addEventListener('click', function () {
      close();
      if (options.onCancel) options.onCancel();
    });

    cancelBtn.addEventListener('click', function () {
      close();
      if (options.onCancel) options.onCancel();
    });

    confirmBtn.addEventListener('click', function () {
      close();
      if (options.onConfirm) options.onConfirm();
    });

    backdrop.addEventListener('click', function (e) {
      if (e.target === backdrop) {
        close();
        if (options.onCancel) options.onCancel();
      }
    });

    document.addEventListener('keydown', handleKey);
    confirmBtn.focus();

    return backdrop;
  }

  /**
   * Show a confirmation prompt.
   * @param {string} message
   * @param {string} title
   * @param {Function} onConfirm
   */
  function confirm(message, title, onConfirm) {
    show({
      title: title || 'Are you sure?',
      content: message,
      confirmText: 'Confirm',
      confirmClass: 'btn--danger',
      onConfirm: onConfirm,
    });
  }

  window.Stockify.components.modal = { show, confirm };
})();

