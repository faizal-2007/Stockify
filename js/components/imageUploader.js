// components/imageUploader.js — Client-side drag-and-drop & file picker image uploader with canvas resizing
(function () {
  'use strict';

  const imgUtil = window.Stockify.utils.image;

  /**
   * Create an Image Uploader component.
   * Enforces mandatory photo rules, provides 1:1 preview, Replace/Remove buttons,
   * client-side resize to max 600px via canvas, and returns JPEG data URL.
   * @param {Object} options - { initialImage, onImageSelected, onImageRemoved }
   * @returns {HTMLElement}
   */
  function create(options) {
    const opts = options || {};
    let currentDataUrl = opts.initialImage || null;

    const wrap = document.createElement('div');
    wrap.className = 'image-uploader-wrap';

    // Dropzone container
    const dropzone = document.createElement('div');
    dropzone.className = 'image-dropzone';
    dropzone.setAttribute('tabindex', '0');
    dropzone.setAttribute('role', 'button');
    dropzone.setAttribute('aria-label', 'Upload product image (JPG, PNG, WEBP up to 5 MB)');

    // Hidden file input
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/jpeg,image/png,image/webp';
    fileInput.style.display = 'none';

    // Preview container (1:1 square)
    const previewWrap = document.createElement('div');
    previewWrap.className = 'image-preview-wrap';
    previewWrap.style.display = currentDataUrl ? 'flex' : 'none';

    const previewImg = document.createElement('img');
    previewImg.className = 'image-preview-img';
    previewImg.alt = 'Uploaded product preview';
    if (currentDataUrl) previewImg.src = currentDataUrl;
    previewWrap.appendChild(previewImg);

    // Empty placeholder prompt
    const promptWrap = document.createElement('div');
    promptWrap.className = 'image-prompt-wrap';
    promptWrap.style.display = currentDataUrl ? 'none' : 'flex';
    promptWrap.innerHTML =
      '<div class="image-prompt-icon">' +
        '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>' +
      '</div>' +
      '<div class="image-prompt-text font-medium">Click or drag image here</div>' +
      '<div class="image-prompt-sub text-xs text-muted">JPG, PNG or WEBP (Max 5 MB)</div>';

    dropzone.appendChild(previewWrap);
    dropzone.appendChild(promptWrap);
    dropzone.appendChild(fileInput);

    // Controls: Replace & Remove
    const controls = document.createElement('div');
    controls.className = 'image-uploader-controls';
    controls.style.display = currentDataUrl ? 'flex' : 'none';
    controls.style.gap = '8px';
    controls.style.marginTop = '10px';

    const replaceBtn = document.createElement('button');
    replaceBtn.type = 'button';
    replaceBtn.className = 'btn btn--secondary btn--sm';
    replaceBtn.textContent = 'Replace';

    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'btn btn--ghost btn--sm';
    removeBtn.style.color = 'var(--danger)';
    removeBtn.textContent = 'Remove';

    controls.appendChild(replaceBtn);
    controls.appendChild(removeBtn);

    // Inline error message
    const errorEl = document.createElement('div');
    errorEl.className = 'form-error';
    errorEl.style.marginTop = '6px';
    errorEl.style.display = 'none';

    wrap.appendChild(dropzone);
    wrap.appendChild(controls);
    wrap.appendChild(errorEl);

    function showError(msg) {
      errorEl.textContent = msg;
      errorEl.style.display = 'block';
    }

    function clearError() {
      errorEl.textContent = '';
      errorEl.style.display = 'none';
    }

    function handleFile(file) {
      if (!file) return;
      clearError();

      imgUtil.resizeToDataUrl(file).then(function (dataUrl) {
        currentDataUrl = dataUrl;
        previewImg.src = dataUrl;
        previewWrap.style.display = 'flex';
        promptWrap.style.display = 'none';
        controls.style.display = 'flex';

        if (opts.onImageSelected) opts.onImageSelected(dataUrl);
      }).catch(function (err) {
        showError(err.message || 'Error processing image.');
      });
    }

    // Drag and drop events
    dropzone.addEventListener('dragover', function (e) {
      e.preventDefault();
      dropzone.classList.add('drag-active');
    });

    dropzone.addEventListener('dragleave', function () {
      dropzone.classList.remove('drag-active');
    });

    dropzone.addEventListener('drop', function (e) {
      e.preventDefault();
      dropzone.classList.remove('drag-active');
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFile(e.dataTransfer.files[0]);
      }
    });

    dropzone.addEventListener('click', function () {
      fileInput.click();
    });

    dropzone.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        fileInput.click();
      }
    });

    fileInput.addEventListener('change', function () {
      if (fileInput.files && fileInput.files.length > 0) {
        handleFile(fileInput.files[0]);
      }
    });

    replaceBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      fileInput.click();
    });

    removeBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      currentDataUrl = null;
      fileInput.value = '';
      previewImg.src = '';
      previewWrap.style.display = 'none';
      promptWrap.style.display = 'flex';
      controls.style.display = 'none';
      clearError();
      if (opts.onImageRemoved) opts.onImageRemoved();
    });

    // Expose method to get value
    wrap.getValue = function () {
      return currentDataUrl;
    };

    return wrap;
  }

  window.Stockify.components.imageUploader = { create };
})();

