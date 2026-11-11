// utils/csv.js — CSV export utility
(function () {
  'use strict';

  /**
   * Convert an array of objects to a CSV string.
   * @param {Object[]} rows
   * @param {string[]} columns - Column keys to include
   * @param {Object} [headers] - Display names for column keys
   * @returns {string}
   */
  function toCSV(rows, columns, headers) {
    const cols = columns || (rows.length > 0 ? Object.keys(rows[0]) : []);
    const headerRow = cols.map(function (c) {
      return csvCell((headers && headers[c]) || c);
    }).join(',');

    const dataRows = rows.map(function (row) {
      return cols.map(function (c) { return csvCell(row[c]); }).join(',');
    });

    return [headerRow].concat(dataRows).join('\r\n');
  }

  /**
   * Escape a cell value for CSV.
   * @param {*} v
   * @returns {string}
   */
  function csvCell(v) {
    if (v === null || v === undefined) return '';
    const s = String(v);
    if (s.includes(',') || s.includes('"') || s.includes('\n')) {
      return '"' + s.replace(/"/g, '""') + '"';
    }
    return s;
  }

  /**
   * Trigger a browser download of a CSV file with UTF-8 BOM (\uFEFF)
   * for perfect rendering in Microsoft Excel and other spreadsheet viewers.
   * @param {string} csvString
   * @param {string} filename
   */
  function download(csvString, filename) {
    const bom = '\uFEFF';
    const blob = new Blob([bom + csvString], { type: 'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = filename || 'export.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  window.Stockify.utils.csv = { toCSV, download };
})();

