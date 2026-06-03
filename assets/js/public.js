/**
 * WP Custom Pinterest Share Plugin Script
 */
(function() {
    'use strict';

    // Modal elements references
    let modalOverlay = null;
    let currentImage = null;

    /**
     * Creates and injects the modal HTML structure into the document.
     */
    function createModal() {
        if (modalOverlay) return;

        // Create overlay element
        modalOverlay = document.createElement('div');
        modalOverlay.className = 'wpcps-modal-overlay';
        modalOverlay.id = 'wpcps-share-modal';

        // Modal content template
        modalOverlay.innerHTML = `
            <div class="wpcps-modal-container">
                <div class="wpcps-modal-header">
                    <h3>Pin to Pinterest</h3>
                    <button type="button" class="wpcps-modal-close-x" id="wpcps-close-x">&times;</button>
                </div>
                <div class="wpcps-modal-body">
                    <div class="wpcps-modal-preview-section">
                        <img src="" alt="Preview" class="wpcps-modal-thumbnail" id="wpcps-preview-thumb">
                        <div class="wpcps-modal-preview-info">
                            <strong>Source Image:</strong>
                            <div id="wpcps-preview-src" style="font-size: 11px; margin-top: 4px; opacity: 0.8; max-height: 40px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"></div>
                        </div>
                    </div>
                    
                    <div class="wpcps-form-group">
                        <label for="wpcps-input-title">Title</label>
                        <input type="text" id="wpcps-input-title" class="wpcps-input-text" placeholder="Enter pin title..." maxlength="100">
                        <span class="wpcps-char-counter" id="wpcps-title-counter">0 / 100</span>
                    </div>

                    <div class="wpcps-form-group">
                        <label for="wpcps-input-desc">Description</label>
                        <textarea id="wpcps-input-desc" class="wpcps-textarea" placeholder="Enter pin description..." maxlength="800"></textarea>
                        <span class="wpcps-char-counter" id="wpcps-desc-counter">0 / 800</span>
                    </div>

                    <div class="wpcps-form-group">
                        <label>Link Type</label>
                        <div class="wpcps-radio-group">
                            <label class="wpcps-radio-label">
                                <input type="radio" name="wpcps-link-type" value="current" class="wpcps-radio-input" checked>
                                Current Page URL
                            </label>
                            <label class="wpcps-radio-label">
                                <input type="radio" name="wpcps-link-type" value="custom" class="wpcps-radio-input">
                                Custom URL
                            </label>
                        </div>
                    </div>

                    <div class="wpcps-form-group wpcps-custom-url-container" id="wpcps-custom-url-group">
                        <label for="wpcps-input-custom-url">Custom URL</label>
                        <input type="url" id="wpcps-input-custom-url" class="wpcps-input-text" placeholder="https://...">
                    </div>
                </div>
                <div class="wpcps-modal-footer">
                    <button type="button" class="wpcps-modal-btn wpcps-modal-btn-cancel" id="wpcps-btn-cancel">Cancel</button>
                    <button type="button" class="wpcps-modal-btn wpcps-modal-btn-pin" id="wpcps-btn-submit">Pin it</button>
                </div>
            </div>
        `;

        document.body.appendChild(modalOverlay);

        // Bind events for inputs & counters
        const inputTitle = document.getElementById('wpcps-input-title');
        const titleCounter = document.getElementById('wpcps-title-counter');
        inputTitle.addEventListener('input', () => {
            titleCounter.textContent = `${inputTitle.value.length} / 100`;
        });

        const inputDesc = document.getElementById('wpcps-input-desc');
        const descCounter = document.getElementById('wpcps-desc-counter');
        inputDesc.addEventListener('input', () => {
            descCounter.textContent = `${inputDesc.value.length} / 800`;
        });

        // Link type change toggle
        const radioOptions = document.querySelectorAll('input[name="wpcps-link-type"]');
        const customUrlGroup = document.getElementById('wpcps-custom-url-group');
        radioOptions.forEach(radio => {
            radio.addEventListener('change', (e) => {
                if (e.target.value === 'custom') {
                    customUrlGroup.classList.add('wpcps-show');
                } else {
                    customUrlGroup.classList.remove('wpcps-show');
                }
            });
        });

        // Close handlers
        const closeX = document.getElementById('wpcps-close-x');
        const btnCancel = document.getElementById('wpcps-btn-cancel');

        const closeModal = () => {
            modalOverlay.classList.remove('wpcps-active');
            // Clear inputs on close
            inputTitle.value = '';
            inputDesc.value = '';
            titleCounter.textContent = '0 / 100';
            descCounter.textContent = '0 / 800';
            document.getElementById('wpcps-input-custom-url').value = '';
            document.querySelector('input[name="wpcps-link-type"][value="current"]').checked = true;
            customUrlGroup.classList.remove('wpcps-show');
        };

        closeX.addEventListener('click', closeModal);
        btnCancel.addEventListener('click', closeModal);
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                closeModal();
            }
        });

        // Pin button action
        const btnSubmit = document.getElementById('wpcps-btn-submit');
        btnSubmit.addEventListener('click', () => {
            if (!currentImage) return;

            const title = inputTitle.value.trim();
            const desc = inputDesc.value.trim();
            
            // Text merging logic
            let mergedDescription = '';
            if (title && desc) {
                mergedDescription = `${title}\n\n${desc}`;
            } else {
                mergedDescription = title || desc;
            }

            // Target URL Selection
            let targetUrl = window.location.href;
            const selectedLinkType = document.querySelector('input[name="wpcps-link-type"]:checked').value;
            if (selectedLinkType === 'custom') {
                const customUrl = document.getElementById('wpcps-input-custom-url').value.trim();
                if (customUrl) {
                    targetUrl = customUrl;
                }
            }

            // Image URL
            const mediaUrl = currentImage.src;

            // Compile URL
            const pinterestUrl = `https://www.pinterest.com/pin/create/button/?url=${encodeURIComponent(targetUrl)}&media=${encodeURIComponent(mediaUrl)}&description=${encodeURIComponent(mergedDescription)}`;

            // Popup execution
            window.open(pinterestUrl, 'Pinterest', 'width=750,height=600,toolbar=0,status=0');

            // Close modal
            closeModal();
        });
    }

    /**
     * Opens the Pinterest Modal for a specific image.
     */
    function openPinterestModal(img) {
        createModal();
        currentImage = img;

        // Set preview content
        document.getElementById('wpcps-preview-thumb').src = img.src;
        document.getElementById('wpcps-preview-src').textContent = img.src;

        // Show modal
        setTimeout(() => {
            modalOverlay.classList.add('wpcps-active');
        }, 10);
    }

    /**
     * Initializes the hover buttons on valid content images.
     */
    function initImageButtons() {
        const selectors = [
            '.entry-content img',
            'article img',
            '.post img',
            '.entry img',
            '.post-content img',
            '.wp-block-image img'
        ];
        
        const images = document.querySelectorAll(selectors.join(', '));
        
        images.forEach(img => {
            if (img.classList.contains('wpcps-processed') || img.closest('.wpcps-wrapper')) {
                return;
            }
            
            const setupWrapper = () => {
                if (img.naturalWidth < 200 || img.naturalHeight < 200) {
                    return;
                }
                
                img.classList.add('wpcps-processed');
                
                const wrapper = document.createElement('div');
                wrapper.className = 'wpcps-wrapper';
                
                const alignments = ['alignleft', 'alignright', 'aligncenter', 'alignnone', 'size-full', 'size-medium', 'size-large'];
                alignments.forEach(cls => {
                    if (img.classList.contains(cls)) {
                        wrapper.classList.add(cls);
                        img.classList.remove(cls);
                    }
                });
                
                if (img.parentNode) {
                    img.parentNode.insertBefore(wrapper, img);
                    wrapper.appendChild(img);
                    
                    const button = document.createElement('button');
                    button.type = 'button';
                    button.className = 'wpcps-btn';
                    button.innerHTML = '<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" style="display:inline-block;vertical-align:middle;margin-right:4px;"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.08 3.16 9.4 7.63 11.16-.1-.95-.2-2.4.04-3.43.22-.93 1.4-5.94 1.4-5.94s-.36-.72-.36-1.78c0-1.66.96-2.9 2.16-2.9 1.02 0 1.51.77 1.51 1.68 0 1.03-.65 2.56-.99 3.99-.28 1.18.59 2.15 1.76 2.15 2.1 0 3.73-2.22 3.73-5.43 0-2.84-2.04-4.83-4.96-4.83-3.38 0-5.36 2.54-5.36 5.15 0 1.02.39 2.12.88 2.72.1.12.11.23.08.35-.09.37-.29 1.18-.33 1.34-.05.21-.18.26-.42.15-1.57-.73-2.55-3.02-2.55-4.86 0-3.96 2.87-7.6 8.3-7.6 4.36 0 7.74 3.1 7.74 7.25 0 4.33-2.73 7.82-6.52 7.82-1.27 0-2.47-.66-2.88-1.44l-.78 2.99c-.28 1.09-1.05 2.45-1.56 3.28C10.15 23.83 11.06 24 12 24c6.63 0 12-5.37 12-12S18.63 0 12 0z"/></svg><span>Pin it</span>';
                    
                    button.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        openPinterestModal(img);
                    });
                    
                    wrapper.appendChild(button);
                }
            };
            
            if (img.complete) {
                setupWrapper();
            } else {
                img.addEventListener('load', setupWrapper);
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initImageButtons);
    } else {
        initImageButtons();
    }

    window.wpcpsOpenPinterestModal = openPinterestModal;
})();
