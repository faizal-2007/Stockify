// utils/format.js — INR formatting, dates, numbers (uses Intl only)
(function () {
  'use strict';

  /**
   * Format a number as Indian Rupees (₹1,24,999).
   * @param {number} amount
   * @param {boolean} [compact=false] - Use k/L/Cr shorthand
   * @returns {string}
   */
  function inr(amount, compact) {
    if (amount === null || amount === undefined || isNaN(amount)) return '₹0';
    const n = Number(amount);
    if (compact) {
      if (n >= 1e7) return '₹' + (n / 1e7).toFixed(2) + ' Cr';
      if (n >= 1e5) return '₹' + (n / 1e5).toFixed(2) + ' L';
      if (n >= 1e3) return '₹' + (n / 1e3).toFixed(1) + 'k';
    }
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(n);
  }

  /**
   * Format a plain integer with Indian grouping.
   * @param {number} n
   * @returns {string}
   */
  function num(n) {
    return new Intl.NumberFormat('en-IN').format(Number(n) || 0);
  }

  /**
   * Format a percentage value.
   * @param {number} value - 0–100
   * @param {number} [decimals=1]
   * @returns {string}
   */
  function pct(value, decimals) {
    const d = decimals !== undefined ? decimals : 1;
    return (Number(value) || 0).toFixed(d) + '%';
  }

  /**
   * Format an ISO date string as a friendly date (e.g. "11 Nov 2026").
   * @param {string} iso
   * @returns {string}
   */
  function date(iso) {
    if (!iso) return '';
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
    }).format(new Date(iso));
  }

  /**
   * Format an ISO date string as time only (e.g. "2:34 PM").
   * @param {string} iso
   * @returns {string}
   */
  function time(iso) {
    if (!iso) return '';
    return new Intl.DateTimeFormat('en-IN', {
      hour: '2-digit', minute: '2-digit', hour12: true,
    }).format(new Date(iso));
  }

  /**
   * Format an ISO date string as a relative time (e.g. "3 hours ago").
   * @param {string} iso
   * @returns {string}
   */
  function relative(iso) {
    if (!iso) return '';
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return mins + 'm ago';
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return hrs + 'h ago';
    const days = Math.floor(hrs / 24);
    if (days < 7) return days + 'd ago';
    return date(iso);
  }

  /**
   * Format an ISO string as "Mon DD, YYYY HH:MM AM/PM".
   * @param {string} iso
   * @returns {string}
   */
  function datetime(iso) {
    if (!iso) return '';
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true,
    }).format(new Date(iso));
  }

  /**
   * Return a greeting string based on the current hour.
   * @returns {string}
   */
  function greeting() {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  }

  /**
   * Return initials from a name string (up to 2 chars).
   * @param {string} name
   * @returns {string}
   */
  function initials(name) {
    if (!name) return '?';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  window.Stockify.utils.format = {
    inr, currency: inr,
    num, number: num,
    pct, date, time, relative,
    datetime, dateTime: datetime,
    greeting, initials,
  };
})();

