// views/settings.js — App preferences, live quota monitor, JSON export/import, and demo reset
(function () {
  'use strict';

  const dom     = window.Stockify.utils.dom;
  const format  = window.Stockify.utils.format;
  const storage = window.Stockify.store.storage;
  const seed    = window.Stockify.store.seed;
  const modal   = window.Stockify.components.modal;
  const toast   = window.Stockify.components.toast;
  const sidebar = window.Stockify.components.sidebar;
  const events  = window.Stockify.events;

  /**
   * Render the Settings page.
   * @returns {HTMLElement}
   */
  function render() {
    const page = dom.h('div', { className: 'page' });

    // ── Header ──
    const headerRow = dom.h('div', { className: 'flex-between flex-wrap gap-4' },
      dom.h('div', {},
        dom.h('h1', { style: 'font-size: var(--font-size-2xl); font-weight: 700; color: var(--text);' }, 'System Settings & Preferences'),
        dom.h('p', { style: 'font-size: var(--font-size-sm); color: var(--text-muted); margin-top: 4px;' },
          'Application preferences, inventory thresholds, storage quota telemetry, and database backup / reset'
        )
      )
    );
    page.appendChild(headerRow);

    const settings = storage.get('settings') || {
      theme: 'light',
      reorderDefault: 10,
      transitDaysThreshold: 5,
      currencyDisplay: 'symbol',
    };

    const grid = dom.h('div', { className: 'grid-2 gap-6' });

    // ── 1. PREFERENCES CARD ──
    const prefCard = dom.h('div', { className: 'card flex flex-col gap-4' });
    prefCard.appendChild(dom.h('h3', { className: 'card-title' }, 'Operational Preferences'));

    const prefForm = dom.h('form', { className: 'flex flex-col gap-4' });

    // Theme selector
    const themeGroup = dom.h('div', { className: 'form-group' });
    themeGroup.appendChild(dom.h('label', { className: 'form-label' }, 'Theme Mode'));
    const themeSelect = dom.h('select', { className: 'select' });
    themeSelect.appendChild(dom.h('option', { value: 'light', selected: settings.theme === 'light' }, '☀️ Light Theme'));
    themeSelect.appendChild(dom.h('option', { value: 'dark', selected: settings.theme === 'dark' }, '🌙 Dark Theme'));
    themeGroup.appendChild(themeSelect);
    prefForm.appendChild(themeGroup);

    // Default Reorder Level
    const reorderGroup = dom.h('div', { className: 'form-group' });
    reorderGroup.appendChild(dom.h('label', { className: 'form-label' }, 'Default Reorder Level (Units) *'));
    const reorderInput = dom.h('input', {
      type: 'number',
      className: 'input',
      min: '1',
      max: '500',
      value: settings.reorderDefault || 10,
      required: true,
    });
    reorderGroup.appendChild(reorderInput);
    reorderGroup.appendChild(dom.h('div', { className: 'text-xs text-muted mt-1' },
      'Fallback threshold used for low-stock alerts when a product has no custom reorder level.'
    ));
    prefForm.appendChild(reorderGroup);

    // In-Transit Delay Threshold
    const transitGroup = dom.h('div', { className: 'form-group' });
    transitGroup.appendChild(dom.h('label', { className: 'form-label' }, 'In-Transit Delay Threshold (Days) *'));
    const transitInput = dom.h('input', {
      type: 'number',
      className: 'input',
      min: '1',
      max: '30',
      value: settings.transitDaysThreshold || 5,
      required: true,
    });
    transitGroup.appendChild(transitInput);
    transitGroup.appendChild(dom.h('div', { className: 'text-xs text-muted mt-1' },
      'Dispatched consignments remaining unconfirmed beyond this threshold trigger "Overdue in Transit" alerts.'
    ));
    prefForm.appendChild(transitGroup);

    // Currency Display
    const currGroup = dom.h('div', { className: 'form-group' });
    currGroup.appendChild(dom.h('label', { className: 'form-label' }, 'Currency Symbol Display'));
    const currSelect = dom.h('select', { className: 'select' });
    currSelect.appendChild(dom.h('option', { value: 'symbol', selected: settings.currencyDisplay !== 'code' }, 'Rupee Symbol (₹)'));
    currSelect.appendChild(dom.h('option', { value: 'code', selected: settings.currencyDisplay === 'code' }, 'Currency Code (INR)'));
    currGroup.appendChild(currSelect);
    prefForm.appendChild(currGroup);

    // Save button
    const savePrefBtn = dom.h('button', { type: 'submit', className: 'btn btn--primary' }, 'Save Preferences');
    prefForm.appendChild(savePrefBtn);

    prefCard.appendChild(prefForm);
    grid.appendChild(prefCard);

    // ── 2. LOCALSTORAGE QUOTA MONITOR CARD ──
    const quotaCard = dom.h('div', { className: 'card flex flex-col gap-4' });
    quotaCard.appendChild(dom.h('h3', { className: 'card-title' }, 'Storage Quota & Telemetry'));

    const stats = storage.getStorageStats();
    const usedKB = Math.round(stats.bytesUsed / 1024);
    const maxKB = Math.round(stats.maxBytes / 1024);

    quotaCard.appendChild(dom.h('div', { className: 'flex-between items-center' },
      dom.h('span', { className: 'text-sm text-muted' }, 'Browser Web Storage Capacity'),
      dom.h('span', { style: 'font-weight: 600; font-size: var(--font-size-base); color: var(--text);' },
        stats.percent + '% used'
      )
    ));

    // Progress bar
    const progressTrack = dom.h('div', {
      style: 'width: 100%; height: 12px; background: var(--surface-soft); border-radius: var(--radius-pill); overflow: hidden;',
    });
    const progressFill = dom.h('div', {
      style: 'height: 100%; width: ' + Math.min(stats.percent, 100) + '%; background: ' +
        (stats.isWarning ? 'var(--warning)' : 'var(--primary-grad)') + '; transition: width 0.4s ease;',
    });
    progressTrack.appendChild(progressFill);
    quotaCard.appendChild(progressTrack);

    quotaCard.appendChild(dom.h('div', { className: 'flex-between text-xs text-muted' },
      dom.h('span', {}, usedKB + ' KB stored (approx.)'),
      dom.h('span', {}, maxKB + ' KB allocated (5 MB max)')
    ));

    // 80% Warning Banner
    if (stats.isWarning) {
      quotaCard.appendChild(dom.h('div', {
        className: 'badge badge--warning flex gap-2 items-center',
        style: 'padding: var(--sp-3); border-radius: var(--radius-sm); font-size: var(--font-size-xs);',
      },
        dom.icon('info', 16),
        dom.h('span', {}, 'Storage usage has exceeded 80%. We recommend exporting a JSON backup to prevent browser quota exhaustion.')
      ));
    } else {
      quotaCard.appendChild(dom.h('div', {
        className: 'badge badge--success flex gap-2 items-center',
        style: 'padding: var(--sp-3); border-radius: var(--radius-sm); font-size: var(--font-size-xs);',
      },
        dom.icon('check', 16),
        dom.h('span', {}, 'Storage quota health is optimal. No action required.')
      ));
    }

    grid.appendChild(quotaCard);
    page.appendChild(grid);

    // ── 3. DATA BACKUP & RESET SECTION ──
    const backupCard = dom.h('div', { className: 'card flex flex-col gap-4' });
    backupCard.appendChild(dom.h('h3', { className: 'card-title' }, 'Data Backup, Recovery & Maintenance'));

    const actionRow = dom.h('div', { className: 'grid-3 gap-4' });

    // Export JSON
    const exportBox = dom.h('div', {
      className: 'card flex flex-col justify-between gap-3',
      style: 'border: 1px solid var(--border); padding: var(--sp-4);',
    },
      dom.h('div', {},
        dom.h('h4', { style: 'font-weight: 600; font-size: var(--font-size-base);' }, 'Export Data (JSON)'),
        dom.h('p', { className: 'text-xs text-muted mt-1' },
          'Download a full snapshot of all offices, catalog products, inventory stock, allocations, movements, and sales.'
        )
      ),
      dom.h('button', { id: 'btn-export-json', className: 'btn btn--secondary w-full' },
        dom.icon('download', 16),
        dom.h('span', {}, 'Download JSON Backup')
      )
    );

    // Import JSON
    const importBox = dom.h('div', {
      className: 'card flex flex-col justify-between gap-3',
      style: 'border: 1px solid var(--border); padding: var(--sp-4);',
    },
      dom.h('div', {},
        dom.h('h4', { style: 'font-weight: 600; font-size: var(--font-size-base);' }, 'Import Data (JSON)'),
        dom.h('p', { className: 'text-xs text-muted mt-1' },
          'Restore your database from an existing Stockify JSON backup file. Validates schema before overwriting.'
        )
      ),
      dom.h('div', {},
        dom.h('input', { type: 'file', id: 'import-file-input', accept: '.json', style: 'display: none;' }),
        dom.h('button', { id: 'btn-import-json', className: 'btn btn--secondary w-full' },
          dom.icon('layers', 16),
          dom.h('span', {}, 'Select & Import File')
        )
      )
    );

    // Reset Demo Data
    const resetBox = dom.h('div', {
      className: 'card flex flex-col justify-between gap-3',
      style: 'border: 1px solid var(--danger); padding: var(--sp-4);',
    },
      dom.h('div', {},
        dom.h('h4', { style: 'font-weight: 600; font-size: var(--font-size-base); color: var(--danger);' }, 'Reset Demo Data'),
        dom.h('p', { className: 'text-xs text-muted mt-1' },
          'Wipe current LocalStorage entries and restore the pristine seed dataset (15 products, 22 offices, sample sales & allocations).'
        )
      ),
      dom.h('button', { id: 'btn-reset-demo', className: 'btn btn--danger w-full' },
        dom.icon('zap', 16),
        dom.h('span', {}, 'Reset to Seed Data')
      )
    );

    actionRow.appendChild(exportBox);
    actionRow.appendChild(importBox);
    actionRow.appendChild(resetBox);
    backupCard.appendChild(actionRow);
    page.appendChild(backupCard);

    // ── EVENT HANDLERS ──

    // Save preferences
    prefForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const updatedTheme = themeSelect.value;
      const updatedReorder = parseInt(reorderInput.value, 10);
      const updatedTransit = parseInt(transitInput.value, 10);
      const updatedCurr = currSelect.value;

      settings.theme = updatedTheme;
      settings.reorderDefault = updatedReorder;
      settings.transitDaysThreshold = updatedTransit;
      settings.currencyDisplay = updatedCurr;

      storage.set('settings', settings);

      if (sidebar && sidebar.applyTheme) {
        sidebar.applyTheme(updatedTheme);
      }

      toast.show('Settings saved successfully! Thresholds updated.', 'success');
      events.emit('stock:changed');
      events.emit('allocation:changed');
    });

    // Theme selector change live preview
    themeSelect.addEventListener('change', function () {
      if (sidebar && sidebar.applyTheme) {
        sidebar.applyTheme(themeSelect.value);
      }
    });

    // Export JSON
    exportBox.querySelector('#btn-export-json').addEventListener('click', function () {
      const dump = storage.exportAll();
      const jsonStr = JSON.stringify(dump, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Stockify_Backup_' + new Date().toISOString().slice(0, 10) + '.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.show('Database JSON backup downloaded.', 'success');
    });

    // Import JSON
    const fileInput = importBox.querySelector('#import-file-input');
    const importBtn = importBox.querySelector('#btn-import-json');

    importBtn.addEventListener('click', function () {
      fileInput.click();
    });

    fileInput.addEventListener('change', function () {
      const file = fileInput.files && fileInput.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = function (evt) {
        try {
          const parsed = JSON.parse(evt.target.result);
          // Schema validation: must have stockify.offices and stockify.products
          if (!parsed || typeof parsed !== 'object' || !parsed['stockify.offices'] || !parsed['stockify.products']) {
            throw new Error('Invalid backup file. The uploaded JSON does not match the Stockify database schema.');
          }

          modal.confirm({
            title: 'Confirm Database Restore',
            message: 'Importing this backup will overwrite your current inventory and transaction history. Are you sure you wish to proceed?',
            confirmLabel: 'Overwrite & Restore',
            danger: true,
            onConfirm: function () {
              storage.importAll(parsed);
              toast.show('Data imported successfully! Reloading...', 'success');
              setTimeout(function () { window.location.reload(); }, 600);
            },
          });
        } catch (err) {
          modal.alert({
            title: 'Import Failed',
            message: err.message,
            buttonLabel: 'Close',
          });
        }
      };
      reader.readAsText(file);
      fileInput.value = '';
    });

    // Reset Demo Data
    resetBox.querySelector('#btn-reset-demo').addEventListener('click', function () {
      modal.confirm({
        title: 'Reset All Demo Data?',
        message: 'This will completely erase any custom products, offices, allocations, and retail sales, restoring the pristine seed state. This cannot be undone.',
        confirmLabel: 'Reset Everything',
        danger: true,
        onConfirm: function () {
          seed.reseed();
          toast.show('Demo data reseeded fresh! Reloading...', 'success');
          setTimeout(function () { window.location.reload(); }, 600);
        },
      });
    });

    return page;
  }

  window.Stockify.views.settings = render;
})();

