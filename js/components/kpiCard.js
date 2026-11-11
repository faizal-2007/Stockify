// components/kpiCard.js — Individual KPI card component with circular gradient icon & subtle arc decoration
(function () {
  'use strict';

  /**
   * Renders a KPI card according to design.md specifications.
   * @param {Object} kpi - { label, formattedValue, trendPct, trendDirection, trendGood, color, footer }
   * @returns {HTMLElement}
   */
  function create(kpi) {
    const card = document.createElement('div');
    card.className = 'card kpi-card';

    // Header: label + gradient icon
    const header = document.createElement('div');
    header.className = 'kpi-card__header';

    const lbl = document.createElement('div');
    lbl.className = 'kpi-card__label';
    lbl.textContent = kpi.label;

    const iconWrap = document.createElement('div');
    iconWrap.className = 'kpi-card__icon kpi-card__icon--' + (kpi.color || 'blue');
    iconWrap.setAttribute('aria-hidden', 'true');

    // Distinct SVG icon per card color
    if (kpi.color === 'blue') {
      // Box / Package icon
      iconWrap.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m16.5 9.4-9-5.19M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.29 7 12 12 20.71 7"/><line x1="12" y1="22" x2="12" y2="12"/></svg>';
    } else if (kpi.color === 'purple') {
      // Currency / Rupee / Bank icon
      iconWrap.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="6" y1="4" x2="18" y2="4"/><line x1="6" y1="9" x2="18" y2="9"/><path d="M6 4h6a4 4 0 0 1 0 8H6"/><line x1="9" y1="12" x2="18" y2="21"/></svg>';
    } else {
      // Alert triangle / low stock icon
      iconWrap.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>';
    }

    header.appendChild(lbl);
    header.appendChild(iconWrap);

    // Value
    const val = document.createElement('div');
    val.className = 'kpi-card__value';
    val.textContent = kpi.formattedValue;

    // Trend: arrow + percentage
    const trend = document.createElement('div');
    const isUp = kpi.trendDirection === 'up';
    // semantic color: if good -> success green, if bad -> danger red
    const trendColorClass = kpi.trendGood ? 'kpi-card__trend--good' : 'kpi-card__trend--down';
    trend.className = 'kpi-card__trend ' + trendColorClass;

    const arrowSvg = isUp
      ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>'
      : '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>';

    trend.innerHTML = arrowSvg + '<span>' + (kpi.trendPct !== undefined ? kpi.trendPct + '%' : '') + '</span>';

    // Footer
    const footer = document.createElement('div');
    footer.className = 'kpi-card__footer';
    footer.textContent = kpi.footer || 'From last month';

    // Faint arc decoration in bottom right corner
    const arc = document.createElement('div');
    arc.className = 'kpi-card__arc kpi-card__arc--' + (kpi.color || 'blue');
    arc.setAttribute('aria-hidden', 'true');

    card.appendChild(header);
    card.appendChild(val);
    card.appendChild(trend);
    card.appendChild(footer);
    card.appendChild(arc);

    return card;
  }

  window.Stockify.components.kpiCard = { create };
})();
