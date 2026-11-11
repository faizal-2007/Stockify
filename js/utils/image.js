// utils/image.js — Canvas resize → compressed JPEG data URL
(function () {
  'use strict';

  const MAX_SIZE = 600;   // px on longest edge
  const QUALITY  = 0.8;   // JPEG quality
  const MAX_INPUT_BYTES = 5 * 1024 * 1024; // 5 MB

  /**
   * Validate a File object for type and size.
   * @param {File} file
   * @returns {{ ok: boolean, error?: string }}
   */
  function validateFile(file) {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type)) {
      return { ok: false, error: 'Only JPG, PNG and WEBP images are accepted.' };
    }
    if (file.size > MAX_INPUT_BYTES) {
      return { ok: false, error: 'Image must be smaller than 5 MB.' };
    }
    return { ok: true };
  }

  /**
   * Load a File into an HTMLImageElement.
   * @param {File} file
   * @returns {Promise<HTMLImageElement>}
   */
  function loadImage(file) {
    return new Promise(function (resolve, reject) {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = function () { URL.revokeObjectURL(url); resolve(img); };
      img.onerror = function () { URL.revokeObjectURL(url); reject(new Error('Could not load image.')); };
      img.src = url;
    });
  }

  /**
   * Resize an image File to max 600px on longest edge, return a JPEG data URL.
   * @param {File} file
   * @returns {Promise<string>} JPEG data URL
   * @throws {Error} If validation fails or canvas fails
   */
  function resizeToDataUrl(file) {
    const validation = validateFile(file);
    if (!validation.ok) return Promise.reject(new Error(validation.error));

    return loadImage(file).then(function (img) {
      let w = img.naturalWidth;
      let h = img.naturalHeight;

      if (w > MAX_SIZE || h > MAX_SIZE) {
        if (w >= h) { h = Math.round(h * MAX_SIZE / w); w = MAX_SIZE; }
        else        { w = Math.round(w * MAX_SIZE / h); h = MAX_SIZE; }
      }

      const canvas = document.createElement('canvas');
      canvas.width  = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, w, h);
      return canvas.toDataURL('image/jpeg', QUALITY);
    });
  }

  /**
   * Check if a string is a valid data URL or a relative path.
   * @param {string} src
   * @returns {boolean}
   */
  function isValidImageSrc(src) {
    if (!src) return false;
    return src.startsWith('data:image/') || src.startsWith('assets/') || src.startsWith('/');
  }

  window.Stockify.utils.image = { validateFile, resizeToDataUrl, isValidImageSrc, MAX_SIZE, QUALITY };
})();

