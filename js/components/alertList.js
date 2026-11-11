// components/alertList.js — Alerts and Notifications widget component
(function () {
  'use strict';

  /**
   * Renders the Alerts and Notifications card with 4 tinted interactive rows.
   * Clicking a row navigates to the matching filtered view.
   * @param {string} officeId
   * @param {string} role
   * @returns {HTMLElement}
   */
  function create(officeId, role) {
    const card = document.createElement('div');
    card.className = 'card dash-alerts';

    const header = document.createElement('div');
    header.className = 'alerts-panel__header';

    const title = document.createElement('h3');
    title.className = 'alerts-panel__title';
    title.textContent = 'Alerts & Notifications';

    header.appendChild(title);
    card.appendChild(header);

    const list = document.createElement('div');
    list.className = 'alerts-panel__list';

    const alerts = window.Stockify.services.alerts.getAlerts(officeId, role);

    alerts.forEach(function (alert) {
      const row = document.createElement('div');
      row.className = 'alert-row alert-row--' + alert.type;
      row.setAttribute('role', 'button');
      row.setAttribute('tabindex', '0');
      row.setAttribute('aria-label', alert.title + ': ' + alert.message);

      // Icon container
      const icon = document.createElement('div');
      icon.className = 'alert-row__icon alert-row__icon--' + alert.type;

      if (alert.id === 'out-of-stock') {
        // Red bag / shopping x icon
        icon.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/><line x1="10" y1="13" x2="14" y2="17"/><line x1="14" y1="13" x2="10" y2="17"/></svg>';
      } else if (alert.id === 'in-transit') {
        // Green / teal timer clock icon
        icon.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>';
      } else if (alert.id === 'low-stock') {
        // Amber warning triangle
        icon.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>';
      } else {
        // Blue spinner / refresh icon
        icon.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>';
      }

      // Body: title + count/message
      const body = document.createElement('div');
      body.className = 'alert-row__body';

      const alertTitle = document.createElement('div');
      alertTitle.className = 'alert-row__title';
      alertTitle.textContent = alert.title;

      const alertCount = document.createElement('div');
      alertCount.className = 'alert-row__count';
      alertCount.textContent = alert.message;

      body.appendChild(alertTitle);
      body.appendChild(alertCount);

      // Right Chevron
      const chevron = document.createElement('div');
      chevron.className = 'alert-row__chevron';
      chevron.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>';

      row.appendChild(icon);
      row.appendChild(body);
      row.appendChild(chevron);

      function navigate() {
        if (alert.route) window.Stockify.router.navigate(alert.route);
      }

      row.addEventListener('click', navigate);
      row.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          navigate();
        }
      });

      list.appendChild(row);
    });

    card.appendChild(list);
    return card;
  }

  window.Stockify.components.alertList = { create };
})();

