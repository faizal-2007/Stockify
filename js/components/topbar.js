// components/topbar.js — Top bar pill, notification alerts dropdown, and user management modals
(function () {
  'use strict';

  const auth    = window.Stockify.services.auth;
  const alerts  = window.Stockify.services.alerts;
  const fmt     = window.Stockify.utils.format;
  const router  = window.Stockify.router;
  const dom     = window.Stockify.utils.dom;
  const modal   = window.Stockify.components.modal;
  const toast   = window.Stockify.components.toast;
  const storage = window.Stockify.store.storage;

  // Nav items: label, route, roles that can see it
  const NAV_ITEMS = [
    { label: 'Dashboard Overview', route: '#/dashboard',   roles: null },
    { label: 'Inventory',          route: '#/inventory',   roles: null },
    { label: 'Allocations',        route: '#/allocations', roles: null },
    { label: 'Network',            route: '#/network',     roles: ['head', 'zone', 'district'] },
    { label: 'Sales',              route: '#/sales',       roles: null },
    { label: 'Reports',            route: '#/reports',     roles: null },
    { label: 'Activity',           route: '#/activity',    roles: null },
  ];

  /**
   * Build the top bar element.
   * @returns {HTMLElement}
   */
  function build() {
    const user     = auth.getCurrentUser();
    const greeting = fmt.greeting();

    const bar = document.createElement('div');
    bar.className = 'top-bar';
    bar.setAttribute('role', 'banner');

    const pill = document.createElement('div');
    pill.className = 'top-bar__pill';

    // ── Logo ──
    const logo = document.createElement('div');
    logo.className = 'top-bar__logo';
    logo.innerHTML =
      '<div class="top-bar__logo-icon" aria-hidden="true">' +
        '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
          '<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>' +
        '</svg>' +
      '</div>' +
      '<span class="top-bar__wordmark">Stockify</span>';
    logo.style.cursor = 'pointer';
    logo.addEventListener('click', function () { router.navigate('#/dashboard'); });

    // ── Nav ──
    const nav = document.createElement('nav');
    nav.className = 'top-bar__nav';
    nav.setAttribute('aria-label', 'Primary navigation');

    NAV_ITEMS.forEach(function (item) {
      if (user && item.roles && !item.roles.includes(user.role)) return;

      const btn = document.createElement('button');
      btn.className = 'top-bar__nav-item';
      btn.setAttribute('data-route', item.route);
      btn.setAttribute('aria-current', 'false');
      btn.textContent = item.label;
      btn.addEventListener('click', function () {
        router.navigate(item.route);
      });
      nav.appendChild(btn);
    });

    // ── Actions (settings + bell + user) ──
    const actions = document.createElement('div');
    actions.className = 'top-bar__actions';

    // Settings button
    const settingsBtn = document.createElement('button');
    settingsBtn.className = 'top-bar__icon-btn';
    settingsBtn.setAttribute('aria-label', 'Settings');
    settingsBtn.innerHTML =
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">' +
        '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>' +
        '<circle cx="12" cy="12" r="3"/>' +
      '</svg>';
    settingsBtn.addEventListener('click', function () { router.navigate('#/settings'); });

    // Bell button with notifications dropdown
    const bellWrap = document.createElement('div');
    bellWrap.style.position = 'relative';

    const bellBtn = document.createElement('button');
    bellBtn.className = 'top-bar__icon-btn';
    bellBtn.setAttribute('aria-label', 'Notifications and Alerts');
    bellBtn.innerHTML =
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">' +
        '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>' +
      '</svg>';

    const dot = document.createElement('div');
    dot.className = 'top-bar__badge';
    dot.setAttribute('aria-label', 'Unread notifications');
    bellBtn.appendChild(dot);
    bellWrap.appendChild(bellBtn);

    // Notification dropdown logic
    let notifDropdown = null;
    bellBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      if (notifDropdown) {
        closeNotifDropdown();
      } else {
        openNotifDropdown();
      }
    });

    function openNotifDropdown() {
      if (!user) return;
      notifDropdown = document.createElement('div');
      notifDropdown.className = 'notification-dropdown';

      const unreadCount = alerts.getUnreadCount(user.officeId, user.role);
      const header = dom.h('div', { className: 'notification-dropdown__header' },
        dom.h('span', {}, 'Live Alerts & Warnings'),
        dom.h('span', { className: 'badge ' + (unreadCount > 0 ? 'badge--danger' : 'badge--success') },
          unreadCount > 0 ? unreadCount + ' Actionable' : 'All Clear'
        )
      );
      notifDropdown.appendChild(header);

      const alertList = alerts.getAlerts(user.officeId, user.role);
      alertList.forEach(function (al) {
        const item = dom.h('div', {
          className: 'notification-dropdown__item card--tinted card--tinted-' + al.type,
        },
          dom.h('div', { className: 'flex flex-col flex-1 min-w-0' },
            dom.h('div', { style: 'font-weight: 600; font-size: var(--font-size-xs);' }, al.title),
            dom.h('div', { style: 'font-size: 11px; color: var(--text-muted);' }, al.message)
          ),
          dom.h('div', { className: 'flex gap-1 items-center flex-shrink-0' },
            dom.h('span', { className: 'badge ' + (al.count > 0 ? 'badge--' + al.type : 'badge--neutral') }, String(al.count)),
            dom.icon('chevron-right', 14)
          )
        );

        item.addEventListener('click', function () {
          closeNotifDropdown();
          router.navigate(al.route);
        });

        notifDropdown.appendChild(item);
      });

      // View full activity link
      const footerLink = dom.h('div', {
        style: 'text-align: center; padding-top: var(--sp-2); border-top: 1px solid var(--border); font-size: var(--font-size-xs);',
      },
        dom.h('a', {
          href: '#/activity',
          style: 'color: var(--primary); text-decoration: none; font-weight: 500;',
        }, 'View Complete Activity Ledger →')
      );
      footerLink.querySelector('a').addEventListener('click', function () { closeNotifDropdown(); });
      notifDropdown.appendChild(footerLink);

      bellWrap.appendChild(notifDropdown);
    }

    function closeNotifDropdown() {
      if (notifDropdown && notifDropdown.parentNode) {
        notifDropdown.parentNode.removeChild(notifDropdown);
      }
      notifDropdown = null;
    }

    // User chip (with dropdown)
    const userChip = buildUserChip(user, greeting);

    actions.appendChild(settingsBtn);
    actions.appendChild(bellWrap);
    actions.appendChild(userChip);

    pill.appendChild(logo);
    pill.appendChild(nav);
    pill.appendChild(actions);
    bar.appendChild(pill);

    // Global document click closes dropdowns
    document.addEventListener('click', function () {
      closeNotifDropdown();
    });

    return bar;
  }

  /**
   * Build the user chip with dropdown.
   * @param {Object} user
   * @param {string} greeting
   * @returns {HTMLElement}
   */
  function buildUserChip(user, greeting) {
    const chip = document.createElement('div');
    chip.className = 'top-bar__user';
    chip.setAttribute('aria-haspopup', 'menu');
    chip.setAttribute('aria-expanded', 'false');
    chip.style.position = 'relative';

    const avatar = document.createElement('div');
    avatar.className = 'top-bar__avatar';
    avatar.textContent = user ? (user.initials || fmt.initials(user.name)) : '?';

    const info = document.createElement('div');
    info.className = 'top-bar__user-info';

    const gr = document.createElement('span');
    gr.className = 'top-bar__greeting';
    gr.textContent = greeting;

    const name = document.createElement('span');
    name.className = 'top-bar__name';
    name.textContent = user ? user.name.split(' ')[0] : 'User';

    const chevron = document.createElement('span');
    chevron.setAttribute('aria-hidden', 'true');
    chevron.innerHTML =
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
        '<polyline points="6 9 12 15 18 9"/>' +
      '</svg>';

    info.appendChild(gr);
    info.appendChild(name);
    chip.appendChild(avatar);
    chip.appendChild(info);
    chip.appendChild(chevron);

    // Dropdown menu
    let dropdown = null;
    chip.addEventListener('click', function (e) {
      e.stopPropagation();
      if (dropdown) {
        closeDropdown();
      } else {
        openDropdown();
      }
    });

    function openDropdown() {
      dropdown = document.createElement('div');
      dropdown.className = 'user-dropdown';
      dropdown.setAttribute('role', 'menu');

      const profileItem = menuItem('Profile Details', function () {
        openProfileModal(user);
      });

      const switchItem  = menuItem('Switch Demo User', function () {
        openSwitchUserModal();
      });

      const settingsItem= menuItem('Preferences & Backup', function () {
        router.navigate('#/settings');
      });

      const divider     = document.createElement('div');
      divider.className = 'user-dropdown__divider';

      const logoutItem  = menuItem('Logout', function () {
        auth.logout();
        window.location.href = 'login.html';
      }, true);

      dropdown.appendChild(profileItem);
      dropdown.appendChild(switchItem);
      dropdown.appendChild(settingsItem);
      dropdown.appendChild(divider);
      dropdown.appendChild(logoutItem);

      chip.appendChild(dropdown);
      chip.setAttribute('aria-expanded', 'true');
    }

    function closeDropdown() {
      if (dropdown && dropdown.parentNode) dropdown.parentNode.removeChild(dropdown);
      dropdown = null;
      chip.setAttribute('aria-expanded', 'false');
    }

    function menuItem(label, onClick, isDanger) {
      const item = document.createElement('div');
      item.className = 'user-dropdown__item' + (isDanger ? ' danger' : '');
      item.setAttribute('role', 'menuitem');
      item.setAttribute('tabindex', '0');
      item.textContent = label;
      item.addEventListener('click', function (e) {
        e.stopPropagation();
        closeDropdown();
        if (onClick) onClick();
      });
      return item;
    }

    document.addEventListener('click', function () { closeDropdown(); });
    return chip;
  }

  // ── Profile Modal ──
  function openProfileModal(user) {
    if (!user) return;
    const offices = storage.get('offices') || [];
    const office = offices.find(function (o) { return o.id === user.officeId; });

    const content = dom.h('div', { className: 'flex flex-col gap-4' },
      dom.h('div', { className: 'flex gap-4 items-center p-3 card--tinted card--tinted-info', style: 'border-radius: var(--radius-card);' },
        dom.h('div', { className: 'top-bar__avatar', style: 'width: 56px; height: 56px; font-size: var(--font-size-lg);' },
          user.initials || fmt.initials(user.name)
        ),
        dom.h('div', {},
          dom.h('div', { style: 'font-size: var(--font-size-lg); font-weight: 700;' }, user.name),
          dom.h('span', { className: 'badge badge--primary' }, auth.ROLE_LABELS[user.role] || user.role)
        )
      ),
      dom.h('div', { className: 'grid-2 gap-3 text-sm' },
        dom.h('div', { className: 'card p-3', style: 'background: var(--surface-soft);' },
          dom.h('div', { className: 'text-xs text-muted' }, 'Assigned Office'),
          dom.h('div', { style: 'font-weight: 600;' }, office ? office.name : user.officeId),
          dom.h('div', { className: 'text-xs text-muted' }, office ? (office.code + ' • ' + office.city) : '')
        ),
        dom.h('div', { className: 'card p-3', style: 'background: var(--surface-soft);' },
          dom.h('div', { className: 'text-xs text-muted' }, 'Access Tier'),
          dom.h('div', { style: 'font-weight: 600; text-transform: capitalize;' }, user.role + ' Level'),
          dom.h('div', { className: 'text-xs text-muted' }, 'Scoped to office subtree')
        )
      ),
      dom.h('div', { className: 'flex-end gap-3 mt-2' },
        dom.h('button', {
          className: 'btn btn--primary',
          onclick: function () { dialog.close(); },
        }, 'Done')
      )
    );

    const dialog = modal.show({
      title: 'User Profile Details',
      content: content,
      size: 'sm',
    });
  }

  // ── Switch User Modal ──
  function openSwitchUserModal() {
    const users = auth.getDemoUsers();
    const offices = storage.get('offices') || [];
    const offMap = new Map();
    offices.forEach(function (o) { offMap.set(o.id, o); });

    const content = dom.h('div', { className: 'flex flex-col gap-3', style: 'max-height: 480px; overflow-y: auto;' });

    users.forEach(function (u) {
      const off = offMap.get(u.officeId);
      const isCurrent = auth.getCurrentUser() && auth.getCurrentUser().id === u.id;

      const item = dom.h('div', {
        className: 'card flex-between items-center p-3 cursor-pointer ' + (isCurrent ? 'card--tinted card--tinted-info' : ''),
        style: 'border: 1px solid var(--border); transition: border-color var(--transition-fast);',
      },
        dom.h('div', { className: 'flex gap-3 items-center' },
          dom.h('div', { className: 'top-bar__avatar', style: 'width: 40px; height: 40px;' }, u.initials || fmt.initials(u.name)),
          dom.h('div', {},
            dom.h('div', { style: 'font-weight: 600; font-size: var(--font-size-sm);' }, u.name),
            dom.h('div', { className: 'text-xs text-muted' }, (off ? off.name : u.officeId) + ' (' + (off ? off.city : '') + ')')
          )
        ),
        dom.h('div', { className: 'flex gap-2 items-center' },
          dom.h('span', { className: 'badge badge--neutral' }, auth.ROLE_LABELS[u.role] || u.role),
          isCurrent ? dom.h('span', { className: 'badge badge--success' }, 'Active') : null
        )
      );

      item.addEventListener('click', function () {
        auth.login(u.id);
        toast.show('Switched account to ' + u.name + ' (' + (auth.ROLE_LABELS[u.role] || u.role) + ')', 'success');
        dialog.close();
        setTimeout(function () { window.location.reload(); }, 300);
      });

      content.appendChild(item);
    });

    const dialog = modal.show({
      title: 'Switch Demo User',
      content: content,
      size: 'md',
    });
  }

  /**
   * Update the notification dot visibility.
   * @param {boolean} hasUnread
   */
  function setUnreadDot(hasUnread) {
    const dot = document.querySelector('.top-bar__badge');
    if (dot) {
      dot.style.display = hasUnread ? 'block' : 'none';
    }
  }

  window.Stockify.components.topbar = { build, setUnreadDot };
})();
