// components/toast.js — Toast notification system
(function () {
  'use strict';

  const DISMISS_MS = 4000;
  let container = null;

  function getContainer() {
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      container.setAttribute('aria-live', 'polite');
      container.setAttribute('aria-atomic', 'false');
      document.body.appendChild(container);
    }
    return container;
  }

  /**
   * Show a toast notification.
   * @param {string} message
   * @param {'info'|'success'|'error'|'warning'} [type='info']
   * @param {number} [duration=4000] ms, 0 = no auto-dismiss
   */
  function show(message, type, duration) {
    const c = getContainer();
    type = type || 'info';
    duration = duration === undefined ? DISMISS_MS : duration;

    const toast = document.createElement('div');
    toast.className = 'toast' + (type !== 'info' ? ' toast--' + type : '');
    toast.setAttribute('role', 'alert');

    const dot = document.createElement('div');
    dot.className = 'toast__dot';

    const msg = document.createElement('div');
    msg.className = 'toast__msg';
    msg.textContent = message;

    const closeBtn = document.createElement('button');
    closeBtn.className = 'toast__close';
    closeBtn.setAttribute('aria-label', 'Dismiss');
    closeBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';

    toast.appendChild(dot);
    toast.appendChild(msg);
    toast.appendChild(closeBtn);
    c.appendChild(toast);

    function dismiss() {
      toast.classList.add('removing');
      toast.addEventListener('animationend', function () {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, { once: true });
      // Fallback if animation doesn't fire
      setTimeout(function () {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 300);
    }

    closeBtn.addEventListener('click', dismiss);
    if (duration > 0) setTimeout(dismiss, duration);
  }

  /**
   * Convenience wrappers.
   */
  function success(msg) { show(msg, 'success'); }
  function error(msg)   { show(msg, 'error'); }
  function warning(msg) { show(msg, 'warning'); }
  function info(msg)    { show(msg, 'info'); }

  window.Stockify.components.toast = { show, success, error, warning, info };
})();

