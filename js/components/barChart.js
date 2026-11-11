// components/barChart.js — Hand-written SVG hairline-stripe bar chart for Inventory Statistics
(function () {
  'use strict';

  const fmt = window.Stockify.utils.format;
  const dom = window.Stockify.utils.dom;

  /**
   * Renders the Inventory Statistics card with hairline-stripe SVG bar chart,
   * period switcher (Daily/Weekly/Monthly), hover tooltip, and "View as table" modal.
   * @param {string} officeId
   * @returns {HTMLElement}
   */
  function create(officeId) {
    const card = document.createElement('div');
    card.className = 'card inv-stats';

    // State
    let currentPeriod = 'monthly'; // 'daily' | 'weekly' | 'monthly'
    let showTableModal = false;

    // Header
    const header = document.createElement('div');
    header.className = 'inv-stats__header';

    const titleWrap = document.createElement('div');
    titleWrap.className = 'flex items-center gap-3';

    const title = document.createElement('h3');
    title.className = 'inv-stats__title';
    title.textContent = 'Inventory Statistics';
    titleWrap.appendChild(title);

    // Legend
    const legend = document.createElement('div');
    legend.className = 'inv-stats__legend';
    legend.innerHTML =
      '<div class="inv-stats__legend-item">' +
        '<span class="inv-stats__legend-dot" style="background:var(--yellow)"></span>' +
        '<span>Stock in</span>' +
      '</div>' +
      '<div class="inv-stats__legend-item">' +
        '<span class="inv-stats__legend-dot" style="background:var(--purple)"></span>' +
        '<span>Stock Out</span>' +
      '</div>' +
      '<div class="inv-stats__legend-item">' +
        '<span class="inv-stats__legend-dot" style="background:var(--primary)"></span>' +
        '<span>Stock Value</span>' +
      '</div>';

    // Controls: period selector + Table Toggle button
    const controls = document.createElement('div');
    controls.style.display = 'flex';
    controls.style.alignItems = 'center';
    controls.style.gap = '8px';

    const periodSelect = document.createElement('select');
    periodSelect.className = 'inv-stats__period-select';
    periodSelect.setAttribute('aria-label', 'Select timeframe period');
    periodSelect.innerHTML =
      '<option value="monthly" selected>Monthly</option>' +
      '<option value="weekly">Weekly</option>' +
      '<option value="daily">Daily</option>';

    const tableToggleBtn = document.createElement('button');
    tableToggleBtn.className = 'btn btn--secondary btn--sm';
    tableToggleBtn.type = 'button';
    tableToggleBtn.setAttribute('aria-label', 'View chart data as table');
    tableToggleBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3h18v18H3z"/><path d="M21 9H3M21 15H3M9 3v18M15 3v18"/></svg> <span>Table</span>';

    controls.appendChild(periodSelect);
    controls.appendChild(tableToggleBtn);

    header.appendChild(titleWrap);
    header.appendChild(legend);
    header.appendChild(controls);
    card.appendChild(header);

    // Chart container
    const chartWrap = document.createElement('div');
    chartWrap.className = 'chart-wrap';
    card.appendChild(chartWrap);

    // Tooltip element
    const tooltip = document.createElement('div');
    tooltip.className = 'chart-tooltip';
    chartWrap.appendChild(tooltip);

    // Table view container (accessible fallback & modal)
    const tableContainer = document.createElement('div');
    tableContainer.style.display = 'none';
    tableContainer.style.marginTop = '16px';
    card.appendChild(tableContainer);

    function updateChart() {
      const data = window.Stockify.services.dashboard.getInventoryStatistics(officeId, currentPeriod);
      renderSvgChart(chartWrap, tooltip, data);
      renderDataTable(tableContainer, data);
    }

    periodSelect.addEventListener('change', function () {
      currentPeriod = this.value;
      updateChart();
    });

    tableToggleBtn.addEventListener('click', function () {
      showTableModal = !showTableModal;
      tableContainer.style.display = showTableModal ? 'block' : 'none';
      tableToggleBtn.classList.toggle('active', showTableModal);
    });

    // Initial render
    updateChart();

    return card;
  }

  /**
   * Render hand-crafted SVG hairline-stripe bar chart.
   */
  function renderSvgChart(chartWrap, tooltip, data) {
    // Remove previous SVG
    const existingSvg = chartWrap.querySelector('svg');
    if (existingSvg) existingSvg.remove();

    if (!data || data.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'empty-state';
      empty.style.padding = '40px 0';
      empty.textContent = 'No inventory data recorded for this timeframe.';
      chartWrap.appendChild(empty);
      return;
    }

    const W = 800;
    const H = 260;
    const padL = 50;
    const padR = 20;
    const padT = 20;
    const padB = 40;
    const chartW = W - padL - padR;
    const chartH = H - padT - padB;

    // Determine scale based on max values
    let maxVal = 0;
    data.forEach(function (d) {
      if (d.stockValue > maxVal) maxVal = d.stockValue;
      if (d.stockIn * 1000 > maxVal) maxVal = d.stockIn * 1000;
      if (d.stockOut * 1000 > maxVal) maxVal = d.stockOut * 1000;
    });

    if (maxVal === 0) maxVal = 100000;
    // Round up maxVal to a nice grid step (4 steps)
    const step = Math.ceil(maxVal / 4);
    const niceMax = step * 4;

    const svg = dom.svgEl('svg', {
      viewBox: '0 0 ' + W + ' ' + H,
      preserveAspectRatio: 'xMidYMid meet',
      role: 'img',
      'aria-label': 'Inventory Statistics bar chart',
    });

    // Background horizontal dashed grid lines & Y labels
    for (let i = 0; i <= 4; i++) {
      const yVal = niceMax - (i * step);
      const yPos = padT + (i * (chartH / 4));

      // Dashed line
      const line = dom.svgEl('line', {
        x1: padL,
        y1: yPos,
        x2: W - padR,
        y2: yPos,
        stroke: 'var(--border)',
        'stroke-dasharray': '3,3',
        'stroke-width': '1',
      });
      svg.appendChild(line);

      // Y Label
      const labelText = fmt.inr(yVal, true);
      const text = dom.svgEl('text', {
        x: padL - 8,
        y: yPos + 4,
        'text-anchor': 'end',
        'font-size': '11',
        'fill': 'var(--text-muted)',
      });
      text.textContent = labelText;
      svg.appendChild(text);
    }

    // Number of periods
    const colCount = data.length;
    const colWidth = chartW / colCount;

    // Draw textured hairline columns for each period
    data.forEach(function (d, idx) {
      const colX = padL + idx * colWidth;
      const group = dom.svgEl('g', {
        class: 'chart-bar-group',
        tabindex: '0',
        role: 'graphics-symbol',
        'aria-label': d.label + ': Stock In ' + d.stockIn + ', Stock Out ' + d.stockOut + ', Value ' + fmt.inr(d.stockValue),
        style: 'cursor:pointer;',
      });

      // Hit area for hover/focus
      const hitArea = dom.svgEl('rect', {
        x: colX + 4,
        y: padT,
        width: Math.max(10, colWidth - 8),
        height: chartH,
        fill: 'transparent',
      });
      group.appendChild(hitArea);

      // The vertical hairline stripes (1-2px stripes with 2px gap)
      const barAreaW = Math.max(14, colWidth * 0.55);
      const barStartX = colX + (colWidth - barAreaW) / 2;
      const stripeGap = 3;
      const stripeWidth = 1.5;
      const stripeCount = Math.floor(barAreaW / stripeGap);

      // Bar height calculated from Stock Value
      const barH = Math.max(12, (d.stockValue / niceMax) * chartH);
      const barY = padT + chartH - barH;

      const stripesGroup = dom.svgEl('g', { class: 'hairline-stripes' });

      for (let s = 0; s < stripeCount; s++) {
        const sx = barStartX + s * stripeGap;
        const stripe = dom.svgEl('line', {
          x1: sx,
          y1: padT + chartH,
          x2: sx,
          y2: barY,
          stroke: 'var(--border)',
          'stroke-width': stripeWidth,
        });
        stripesGroup.appendChild(stripe);
      }
      group.appendChild(stripesGroup);

      // Small horizontal tick markers for Stock In (yellow), Stock Out (purple), Stock Value (blue)
      const inRatio = Math.min(1, (d.stockIn * 1000) / niceMax);
      const outRatio = Math.min(1, (d.stockOut * 1000) / niceMax);
      const inY = padT + chartH - (inRatio * chartH);
      const outY = padT + chartH - (outRatio * chartH);

      // Stock In Tick (Yellow)
      const inTick = dom.svgEl('line', {
        x1: barStartX - 2,
        y1: inY,
        x2: barStartX + barAreaW / 2,
        y2: inY,
        stroke: 'var(--yellow)',
        'stroke-width': '2.5',
        'stroke-linecap': 'round',
      });
      group.appendChild(inTick);

      // Stock Out Tick (Purple)
      const outTick = dom.svgEl('line', {
        x1: barStartX + barAreaW / 2,
        y1: outY,
        x2: barStartX + barAreaW + 2,
        y2: outY,
        stroke: 'var(--purple)',
        'stroke-width': '2.5',
        'stroke-linecap': 'round',
      });
      group.appendChild(outTick);

      // Stock Value Crown Tick (Blue)
      const valTick = dom.svgEl('line', {
        x1: barStartX - 3,
        y1: barY,
        x2: barStartX + barAreaW + 3,
        y2: barY,
        stroke: 'var(--primary)',
        'stroke-width': '3',
        'stroke-linecap': 'round',
      });
      group.appendChild(valTick);

      // X Label (Month / Day / Week)
      const xLabel = dom.svgEl('text', {
        x: colX + colWidth / 2,
        y: H - 14,
        'text-anchor': 'middle',
        'font-size': '11',
        'fill': 'var(--text-muted)',
        'font-weight': '500',
      });
      xLabel.textContent = d.label;
      group.appendChild(xLabel);

      // Hover events
      function onHover(e) {
        // Highlight stripes to gradient blue
        stripesGroup.querySelectorAll('line').forEach(function (l) {
          l.setAttribute('stroke', 'var(--primary)');
        });
        xLabel.setAttribute('fill', 'var(--primary)');

        // Position tooltip
        tooltip.innerHTML =
          '<div style="font-weight:600;margin-bottom:4px;font-size:12px;">' + d.label + '</div>' +
          '<div class="chart-tooltip__row">' +
            '<span class="chart-tooltip__dot" style="background:var(--primary)"></span>' +
            '<span>Stock value: <strong>' + fmt.inr(d.stockValue) + '</strong></span>' +
          '</div>' +
          '<div class="chart-tooltip__row">' +
            '<span class="chart-tooltip__dot" style="background:var(--yellow)"></span>' +
            '<span>Stock in: <strong>' + fmt.num(d.stockIn) + ' units</strong></span>' +
          '</div>' +
          '<div class="chart-tooltip__row">' +
            '<span class="chart-tooltip__dot" style="background:var(--purple)"></span>' +
            '<span>Stock out: <strong>' + fmt.num(d.stockOut) + ' units</strong></span>' +
          '</div>';

        const wrapRect = chartWrap.getBoundingClientRect();
        const mouseX = (e.clientX || (colX + colWidth / 2)) - wrapRect.left;
        tooltip.style.left = Math.min(wrapRect.width - 150, Math.max(10, mouseX - 60)) + 'px';
        tooltip.style.top = '10px';
        tooltip.classList.add('visible');
      }

      function onLeave() {
        stripesGroup.querySelectorAll('line').forEach(function (l) {
          l.setAttribute('stroke', 'var(--border)');
        });
        xLabel.setAttribute('fill', 'var(--text-muted)');
        tooltip.classList.remove('visible');
      }

      group.addEventListener('mouseenter', onHover);
      group.addEventListener('focus', onHover);
      group.addEventListener('mouseleave', onLeave);
      group.addEventListener('blur', onLeave);

      svg.appendChild(group);
    });

    chartWrap.appendChild(svg);
  }

  /**
   * Accessible table representation of chart data
   */
  function renderDataTable(container, data) {
    container.innerHTML = '';
    const table = document.createElement('table');
    table.className = 'data-table';
    table.innerHTML =
      '<thead>' +
        '<tr>' +
          '<th>Period</th>' +
          '<th>Stock In (Units)</th>' +
          '<th>Stock Out (Units)</th>' +
          '<th>Stock Value</th>' +
        '</tr>' +
      '</thead>' +
      '<tbody>' +
        data.map(function (d) {
          return '<tr>' +
            '<td><strong>' + d.label + '</strong></td>' +
            '<td>' + fmt.num(d.stockIn) + '</td>' +
            '<td>' + fmt.num(d.stockOut) + '</td>' +
            '<td>' + fmt.inr(d.stockValue) + '</td>' +
          '</tr>';
        }).join('') +
      '</tbody>';
    container.appendChild(table);
  }

  window.Stockify.components.barChart = { create };
})();

