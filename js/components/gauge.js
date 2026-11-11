// components/gauge.js — Hand-written SVG radial-tick semi-circular gauge for Sales Overview
(function () {
  'use strict';

  const fmt = window.Stockify.utils.format;
  const dom = window.Stockify.utils.dom;

  /**
   * Renders the Sales Overview card with radial tick lines gauge,
   * centered percentage, sales count, and total ₹ sales value.
   * @param {string} officeId
   * @returns {HTMLElement}
   */
  function create(officeId) {
    const card = document.createElement('div');
    card.className = 'card sales-ov';

    const overview = window.Stockify.services.dashboard.getSalesOverview(officeId);

    // Header
    const header = document.createElement('div');
    header.className = 'sales-ov__header';

    const title = document.createElement('h3');
    title.className = 'sales-ov__title';
    title.textContent = 'Sales Overview';

    const menuBtn = document.createElement('button');
    menuBtn.className = 'sales-ov__menu';
    menuBtn.type = 'button';
    menuBtn.setAttribute('aria-label', 'Sales options');
    menuBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>';

    menuBtn.addEventListener('click', function () {
      window.Stockify.router.navigate('#/sales');
    });

    header.appendChild(title);
    header.appendChild(menuBtn);
    card.appendChild(header);

    // Gauge container
    const gaugeWrap = document.createElement('div');
    gaugeWrap.className = 'gauge-wrap';

    // SVG Radial Tick Gauge (~200 degrees arc: 170° to 370° or -190° to 10°)
    const W = 280;
    const H = 190;
    const cx = W / 2;
    const cy = 135;
    const radius = 95;
    const tickLen = 14;

    const svg = dom.svgEl('svg', {
      viewBox: '0 0 ' + W + ' ' + H,
      class: 'gauge-svg',
      width: '100%',
      height: '190',
      role: 'img',
      'aria-label': 'Sales Goal Achievement: ' + overview.percent + '%',
    });

    // Angle span: 200 degrees (-190 deg to 10 deg)
    const startAngle = -190 * (Math.PI / 180);
    const endAngle = 10 * (Math.PI / 180);
    const totalTicks = 42;
    const filledTicksCount = Math.round((overview.percent / 100) * totalTicks);

    const ticksGroup = dom.svgEl('g', { class: 'gauge-ticks' });

    for (let i = 0; i < totalTicks; i++) {
      const t = i / (totalTicks - 1);
      const angle = startAngle + t * (endAngle - startAngle);
      const isFilled = i < filledTicksCount;

      const rInner = radius - tickLen;
      const rOuter = radius;

      const x1 = cx + rInner * Math.cos(angle);
      const y1 = cy + rInner * Math.sin(angle);
      const x2 = cx + rOuter * Math.cos(angle);
      const y2 = cy + rOuter * Math.sin(angle);

      // Color calculation for gradient fill
      let strokeColor = 'var(--border)';
      let strokeWidth = '2';

      if (isFilled) {
        // Gradient effect from light sky blue to rich blue
        strokeColor = 'var(--primary)';
        strokeWidth = '2.5';
      }

      const tick = dom.svgEl('line', {
        x1: x1,
        y1: y1,
        x2: x2,
        y2: y2,
        stroke: strokeColor,
        'stroke-width': strokeWidth,
        'stroke-linecap': 'round',
        style: isFilled ? 'transition: stroke 0.6s ease-out;' : '',
      });

      ticksGroup.appendChild(tick);
    }
    svg.appendChild(ticksGroup);

    // Percentage Text in Center
    const pctText = dom.svgEl('text', {
      x: cx,
      y: cy - 8,
      'text-anchor': 'middle',
      class: 'gauge__pct',
      'font-size': '44',
      'font-weight': '600',
      fill: 'var(--text)',
    });
    pctText.textContent = overview.percent + '%';
    svg.appendChild(pctText);

    // "Sales Goal" label below percentage
    const goalText = dom.svgEl('text', {
      x: cx,
      y: cy + 18,
      'text-anchor': 'middle',
      class: 'gauge__label',
      'font-size': '13',
      fill: 'var(--text-muted)',
      'font-weight': '500',
    });
    goalText.textContent = 'Sales Goal';
    svg.appendChild(goalText);

    gaugeWrap.appendChild(svg);
    card.appendChild(gaugeWrap);

    // Bottom Stats: Number of sales & Total sales
    const statsRow = document.createElement('div');
    statsRow.className = 'sales-ov__stats';

    const statCount = document.createElement('div');
    statCount.className = 'sales-ov__stat';
    statCount.innerHTML =
      '<div class="sales-ov__stat-label">Number of sales</div>' +
      '<div class="sales-ov__stat-value tabular-nums">' + fmt.num(overview.salesCount) + '</div>';

    const statTotal = document.createElement('div');
    statTotal.className = 'sales-ov__stat';
    statTotal.style.textAlign = 'right';
    statTotal.innerHTML =
      '<div class="sales-ov__stat-label">Total Sales</div>' +
      '<div class="sales-ov__stat-value tabular-nums">' + fmt.inr(overview.totalSales) + '</div>';

    statsRow.appendChild(statCount);
    statsRow.appendChild(statTotal);
    card.appendChild(statsRow);

    return card;
  }

  window.Stockify.components.gauge = { create };
})();

