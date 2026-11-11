// components/activityList.js — Recent activities list component
(function () {
  'use strict';

  const fmt = window.Stockify.utils.format;
  const thumb = window.Stockify.components.productThumb;

  /**
   * Renders the Recent Activities card with 4 enriched rows.
   * Uses product thumbnails when a product is involved, or tinted action icons.
   * @param {string} officeId
   * @returns {HTMLElement}
   */
  function create(officeId) {
    const card = document.createElement('div');
    card.className = 'card dash-recent-act';

    const header = document.createElement('div');
    header.className = 'recent-act__header';

    const title = document.createElement('h3');
    title.className = 'recent-act__title';
    title.textContent = 'Recent Activities';

    const viewAllBtn = document.createElement('button');
    viewAllBtn.className = 'btn btn--ghost btn--sm';
    viewAllBtn.type = 'button';
    viewAllBtn.textContent = 'View All';
    viewAllBtn.addEventListener('click', function () {
      window.Stockify.router.navigate('#/activity');
    });

    header.appendChild(title);
    header.appendChild(viewAllBtn);
    card.appendChild(header);

    const list = document.createElement('div');
    list.className = 'recent-act__list';

    const activities = window.Stockify.services.activity.getRecent(officeId, 4);

    if (!activities || activities.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'empty-state';
      empty.style.padding = '30px 0';
      empty.innerHTML = '<p class="empty-state__body">No recent activities found.</p>';
      card.appendChild(empty);
      return card;
    }

    activities.forEach(function (act) {
      const row = document.createElement('div');
      row.className = 'activity-row';

      // Left icon or product thumbnail
      let iconOrThumb;
      if (act.product) {
        iconOrThumb = thumb.create(act.product, 36);
        iconOrThumb.style.borderRadius = '8px';
      } else {
        iconOrThumb = document.createElement('div');
        iconOrThumb.className = 'activity-row__icon';

        if (act.type === 'stock_in') {
          iconOrThumb.style.background = 'rgba(74, 168, 245, 0.15)';
          iconOrThumb.style.color = 'var(--primary)';
          iconOrThumb.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>';
        } else if (act.type === 'dispatch') {
          iconOrThumb.style.background = 'rgba(139, 92, 246, 0.15)';
          iconOrThumb.style.color = 'var(--purple)';
          iconOrThumb.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="13" y2="16"/></svg>';
        } else if (act.type === 'receive') {
          iconOrThumb.style.background = 'rgba(245, 185, 10, 0.15)';
          iconOrThumb.style.color = 'var(--yellow)';
          iconOrThumb.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m16.5 9.4-9-5.19M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>';
        } else {
          iconOrThumb.style.background = 'rgba(22, 163, 74, 0.15)';
          iconOrThumb.style.color = 'var(--success)';
          iconOrThumb.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>';
        }
      }

      // Body: Title + detail
      const body = document.createElement('div');
      body.className = 'activity-row__body';

      const rowTitle = document.createElement('div');
      rowTitle.className = 'activity-row__title';
      rowTitle.textContent = act.title;

      const rowDetail = document.createElement('div');
      rowDetail.className = 'activity-row__detail';
      rowDetail.textContent = act.detail;

      body.appendChild(rowTitle);
      body.appendChild(rowDetail);

      // Relative Time
      const time = document.createElement('div');
      time.className = 'activity-row__time';
      time.textContent = fmt.relative(act.at);

      row.appendChild(iconOrThumb);
      row.appendChild(body);
      row.appendChild(time);
      list.appendChild(row);
    });

    card.appendChild(list);
    return card;
  }

  window.Stockify.components.activityList = { create };
})();

