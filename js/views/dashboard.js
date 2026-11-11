// views/dashboard.js — Full Dashboard view assembled from scoped service data & modular components
(function () {
  'use strict';

  const auth       = window.Stockify.services.auth;
  const dashSvc    = window.Stockify.services.dashboard;
  const selectors  = window.Stockify.store.selectors;
  const fmt        = window.Stockify.utils.format;
  const kpiCard    = window.Stockify.components.kpiCard;
  const barChart   = window.Stockify.components.barChart;
  const gauge      = window.Stockify.components.gauge;
  const actList    = window.Stockify.components.activityList;
  const alertList  = window.Stockify.components.alertList;
  const thumb      = window.Stockify.components.productThumb;

  /**
   * Renders the complete Dashboard view matching the reference design layout:
   * Row 1: Welcome block (4 cols) + 3 KPI cards (8 cols)
   * Row 2: Inventory Statistics (8 cols) + Sales Overview (4 cols)
   * Row 3: Recent Activities (4 cols) + Alerts & Notifications (4 cols) + Top Selling Products (4 cols)
   * @returns {HTMLElement}
   */
  function render() {
    const user = auth.getCurrentUser();
    const officeId = user ? user.officeId : 'off_001';
    const role = user ? user.role : 'head';

    const page = document.createElement('div');
    page.className = 'page';

    // 12-Column Dashboard Grid Container
    const grid = document.createElement('div');
    grid.className = 'dash-grid';

    // ══════════════════════════════════════════════════════════
    // ROW 1: WELCOME BLOCK (4 cols) + 3 KPI CARDS (8 cols)
    // ══════════════════════════════════════════════════════════
    const welcomeBlock = document.createElement('div');
    welcomeBlock.className = 'dash-welcome welcome-block';

    const greeting = document.createElement('h1');
    greeting.className = 'welcome-block__greeting';
    const firstName = user ? user.name.split(' ')[0] : 'User';
    greeting.textContent = 'Welcome Back, ' + firstName + '!';

    const subtitle = document.createElement('p');
    subtitle.className = 'welcome-block__subtitle';
    subtitle.textContent = dashSvc.getScopeSubtitle(user);

    welcomeBlock.appendChild(greeting);
    welcomeBlock.appendChild(subtitle);
    grid.appendChild(welcomeBlock);

    // KPI Cards Row (8 cols)
    const kpiRow = document.createElement('div');
    kpiRow.className = 'dash-kpi-row';

    const kpiMetrics = dashSvc.getKpiMetrics(officeId);
    kpiMetrics.forEach(function (metric) {
      const cardEl = kpiCard.create(metric);
      kpiRow.appendChild(cardEl);
    });
    grid.appendChild(kpiRow);

    // ══════════════════════════════════════════════════════════
    // ROW 2: INVENTORY STATISTICS (8 cols) + SALES OVERVIEW (4 cols)
    // ══════════════════════════════════════════════════════════
    const invStatsCard = barChart.create(officeId);
    invStatsCard.classList.add('dash-inv-stats');
    grid.appendChild(invStatsCard);

    const salesGaugeCard = gauge.create(officeId);
    salesGaugeCard.classList.add('dash-sales-ov');
    grid.appendChild(salesGaugeCard);

    // ══════════════════════════════════════════════════════════
    // ROW 3: RECENT ACTIVITIES (4 cols) + ALERTS (4 cols) + TOP SELLING (4 cols)
    // ══════════════════════════════════════════════════════════
    const activitiesCard = actList.create(officeId);
    grid.appendChild(activitiesCard);

    const alertsCard = alertList.create(officeId, role);
    grid.appendChild(alertsCard);

    // Top Selling Products Card (4 cols)
    const topProdCard = renderTopSellingProducts(officeId);
    grid.appendChild(topProdCard);

    page.appendChild(grid);
    return page;
  }

  /**
   * Helper to build the Top Selling Products card (3 items with photos, SKU, price, units)
   * @param {string} officeId
   * @returns {HTMLElement}
   */
  function renderTopSellingProducts(officeId) {
    const card = document.createElement('div');
    card.className = 'card dash-top-prod';

    const header = document.createElement('div');
    header.className = 'top-prod__header';

    const title = document.createElement('h3');
    title.className = 'top-prod__title';
    title.textContent = 'Top Selling Products';

    const viewInventoryBtn = document.createElement('button');
    viewInventoryBtn.className = 'btn btn--ghost btn--sm';
    viewInventoryBtn.type = 'button';
    viewInventoryBtn.textContent = 'View All';
    viewInventoryBtn.addEventListener('click', function () {
      window.Stockify.router.navigate('#/inventory');
    });

    header.appendChild(title);
    header.appendChild(viewInventoryBtn);
    card.appendChild(header);

    const list = document.createElement('div');
    list.className = 'top-prod__list';

    // Top 3 products in the last 30 days
    const topItems = selectors.topSellingProducts(officeId, 30, 3);

    if (!topItems || topItems.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'empty-state';
      empty.style.padding = '30px 0';
      empty.innerHTML = '<p class="empty-state__body">No sales recorded in the last 30 days.</p>';
      card.appendChild(empty);
      return card;
    }

    topItems.forEach(function (item) {
      const prd = item.product;
      const row = document.createElement('div');
      row.className = 'top-prod-row';
      row.setAttribute('role', 'button');
      row.setAttribute('tabindex', '0');
      row.style.cursor = 'pointer';

      // 64px Product Photo using productThumb
      const thumbEl = thumb.create(prd, 60);
      thumbEl.className = 'top-prod-row__thumb';

      // Center info: name + short SKU
      const info = document.createElement('div');
      info.className = 'top-prod-row__info';

      const name = document.createElement('div');
      name.className = 'top-prod-row__name';
      name.textContent = prd.name;

      const sku = document.createElement('div');
      sku.className = 'top-prod-row__sku';
      sku.textContent = 'ID: ' + prd.sku;

      info.appendChild(name);
      info.appendChild(sku);

      // Right side: Price + Units sold
      const right = document.createElement('div');
      right.className = 'top-prod-row__right';

      const price = document.createElement('div');
      price.className = 'top-prod-row__price tabular-nums';
      price.textContent = fmt.inr(prd.price);

      const units = document.createElement('div');
      units.className = 'top-prod-row__units';
      units.textContent = fmt.num(item.units) + ' Orders';

      right.appendChild(price);
      right.appendChild(units);

      row.appendChild(thumbEl);
      row.appendChild(info);
      row.appendChild(right);

      row.addEventListener('click', function () {
        window.Stockify.router.navigate('#/inventory/' + prd.id);
      });
      row.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          window.Stockify.router.navigate('#/inventory/' + prd.id);
        }
      });

      list.appendChild(row);
    });

    card.appendChild(list);
    return card;
  }

  window.Stockify.views.dashboard = render;
})();
