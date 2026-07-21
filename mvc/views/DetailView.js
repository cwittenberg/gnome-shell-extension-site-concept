class DetailView {
    constructor() {
        this.currentMediaItems = [];
        this.defaultExtensionSvg = `<i class="icon icon-settings text-4xl"></i>`;
        
        this.bindEvents();
    }

    bindEvents() {
        const starContainer = document.getElementById('interactive-star-rating');
        if (starContainer) {
            const stars = starContainer.querySelectorAll('i');
            let selectedRating = 0;

            stars.forEach(star => {
                star.addEventListener('mouseover', (e) => {
                    const hoverValue = parseInt(e.target.getAttribute('data-rating'));
                    stars.forEach(s => {
                        if (parseInt(s.getAttribute('data-rating')) <= hoverValue) {
                            s.classList.add('text-gnome-orange');
                        } else {
                            s.classList.remove('text-gnome-orange');
                        }
                    });
                });

                star.addEventListener('mouseout', () => {
                    stars.forEach(s => {
                        if (parseInt(s.getAttribute('data-rating')) <= selectedRating) {
                            s.classList.add('text-gnome-orange');
                        } else {
                            s.classList.remove('text-gnome-orange');
                        }
                    });
                });

                star.addEventListener('click', (e) => {
                    selectedRating = parseInt(e.target.getAttribute('data-rating'));
                });
            });
        }
    }

    update(extension) {
        if (!extension) {
            this.clearDetails();
            return;
        }
        this.renderDetails(extension);
    }

    clearDetails() {
        const carouselMain = document.getElementById('carousel-main');
        if (carouselMain) {
            carouselMain.innerHTML = '';
        }
    }

    renderDetails(extension) {
        document.getElementById('detail-title').textContent = extension.name;
        document.getElementById('detail-author').textContent = extension.author;
        document.getElementById('detail-meta-uuid').textContent = extension.uuid;
        
        document.getElementById('detail-meta-categories').textContent = extension.category || 'N/A';
        document.getElementById('detail-meta-locale').textContent = (extension.locales || ['en-US']).join(', ');
        
        document.getElementById('detail-meta-maintainers').textContent = (extension.maintainers || []).join(', ');
        document.getElementById('detail-meta-version').textContent = extension.version;
        document.getElementById('detail-meta-downloads').textContent = extension.downloads.toLocaleString();

        const detailIcon = document.getElementById('detail-icon');
        if (detailIcon) {
            let iconHtml = this.defaultExtensionSvg;
            if (extension.icon) {
                if (extension.icon.startsWith('http') || extension.icon.startsWith('/')) {
                    const safeSvg = this.defaultExtensionSvg.replace(/"/g, '&quot;');
                    iconHtml = `<img src="${this.escapeHtml(extension.icon)}" alt="${this.escapeHtml(extension.name)} icon" class="w-full h-full object-contain p-2" onerror="this.outerHTML='${safeSvg}'">`;
                } else {
                    iconHtml = extension.icon;
                }
            }

            detailIcon.innerHTML = `
              <div class="flex h-full w-full items-center justify-center bg-gnome-white dark:bg-[#2d2640] text-gnome-blue overflow-hidden rounded-3xl">
                ${iconHtml}
              </div>
            `;
        }

        const ratingContainer = document.getElementById('detail-rating-container');
        if (ratingContainer) {
            ratingContainer.innerHTML = `
              <div class="flex items-center justify-center sm:justify-start gap-2 text-sm font-semibold text-gnome-black dark:text-gnome-white">
                <span class="text-gnome-orange"><i class="icon icon-star"></i> ${extension.rating.toFixed(1)}</span>
                <span class="text-gnome-grey">(${extension.ratingCount} ratings)</span>
            </div>
            `;
        }
        
        this.renderWarnings(extension);
        this.renderHostConnectorControls(extension);

        const description = document.getElementById('detail-description');
        if (description) {
            description.innerHTML = this.renderMarkdown(extension.mdDescription || extension.description);
        }

        const versionsContainer = document.getElementById('detail-versions-container');
        if (versionsContainer) {
            const versions = extension.versions || [];
            if (versions.length === 0) {
                versionsContainer.innerHTML = '<p class="text-sm text-[#5e5c64] dark:text-[#c0bfbc] italic">No version history available.</p>';
            } else {
                versionsContainer.innerHTML = versions.map((version) => `
                  <div class="gnome-card-panel p-4 bg-[#f6f5f4] dark:bg-[#241F31]">
                    <div class="flex flex-col gap-2">
                        <div class="flex items-center justify-between gap-3">
                          <div>
                            <p class="font-bold text-sm text-gnome-black dark:text-gnome-white">Version ${this.escapeHtml(version.version)}</p>
                            <p class="text-sm text-gnome-grey mt-1">${this.escapeHtml(version.comment)}</p>
                          </div>
                          <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${version.status === 'Active' ? 'bg-gnome-green/15 text-gnome-green' : 'bg-gnome-red/15 text-gnome-red'}">${this.escapeHtml(version.status)}</span>
                        </div>
                        <div class="mt-2 text-right">
                            <button onclick="window.showViewHandler('upload')" class="text-gnome-blue hover:underline text-xs font-bold transition-colors">View Review Thread</button>
                        </div>
                    </div>
                  </div>
                `).join('');
            }
        }

        const reviewsContainer = document.getElementById('detail-reviews-container');
        if (reviewsContainer) {
            const reviews = extension.reviews || [];
            if (reviews.length === 0) {
                reviewsContainer.innerHTML = '<p class="text-sm text-[#5e5c64] dark:text-[#c0bfbc] italic">No reviews have been submitted for this extension yet.</p>';
            } else {
                reviewsContainer.innerHTML = reviews.map((review) => `
                  <div class="gnome-card-panel p-4 group">
                    <div class="flex items-center justify-between gap-3">
                      <div class="flex items-center gap-2">
                        <p class="font-bold text-gnome-black dark:text-gnome-white">${this.escapeHtml(review.user)}</p>
                        ${review.isAuthor ? `<span class="bg-gnome-blue/15 text-gnome-blue text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full border border-transparent contrast-more:border-gnome-blue/20">Maintainer</span>` : ''}
                      </div>
                      <div class="flex items-center gap-3">
                        <p class="text-sm text-gnome-grey">${this.escapeHtml(review.date)}</p>
                        <div class="text-gnome-orange font-semibold text-sm"><i class="icon icon-star"></i> ${review.rating}</div>
                        <!-- EGO Admin Delete Button -->
                        <button class="opacity-0 group-hover:opacity-100 text-gnome-grey hover:text-gnome-red transition-all ml-2" title="Remove review from public view (Admin)">
                            <i class="icon icon-bin"></i>
                        </button>
                      </div>
                    </div>
                    <p class="text-sm text-[#5e5c64] dark:text-[#c0bfbc] mt-4 leading-relaxed">${this.escapeHtml(review.text)}</p>
                  </div>
                `).join('');
            }
        }

        // Add the Bug Report warning box to the interactive review form dynamically
        const bugTrackerUrl = extension.bugTracker || extension.url || extension.homepage || '#';
        const interactiveFormBox = document.querySelector('.gnome-card-panel.p-5.animate-fade-in.mb-8');
        
        if (interactiveFormBox) {
            let warningNode = interactiveFormBox.querySelector('#review-bug-warning');
            
            if (!warningNode) {
                const warningHtml = `
                    <div id="review-bug-warning" class="hidden bg-gnome-orange/10 border border-gnome-orange/20 text-gnome-orange px-3 py-2 rounded-lg text-sm mb-0 flex items-start gap-2 transition-all duration-300 opacity-0 overflow-hidden" style="max-height: 0;">
                        <i class="icon icon-info mt-0.5 shrink-0 text-base"></i>
                        <p><strong>Reviews are not bug reports.</strong> If you are experiencing issues or need support, please use the <a id="review-bug-link" href="#" target="_blank" rel="noreferrer" class="underline font-bold hover:text-gnome-orange/80">Bug Tracker</a>.</p>
                    </div>
                `;
                interactiveFormBox.insertAdjacentHTML('afterbegin', warningHtml);
                warningNode = interactiveFormBox.querySelector('#review-bug-warning');
                
                const textarea = interactiveFormBox.querySelector('textarea');
                if (textarea) {
                    textarea.addEventListener('focus', () => {
                        warningNode.classList.remove('hidden');
                        // Small delay to allow display:block to apply before animating opacity/height
                        setTimeout(() => {
                            warningNode.classList.remove('opacity-0');
                            warningNode.classList.add('opacity-100', 'mb-4');
                            warningNode.style.maxHeight = '100px';
                        }, 10);
                    });
                    
                    textarea.addEventListener('blur', (e) => {
                        // Delay hiding slightly to allow clicks on the bug link to process first
                        setTimeout(() => {
                            const bugLink = interactiveFormBox.querySelector('#review-bug-link');
                            if (e.target.value.trim() === '' && document.activeElement !== bugLink) {
                                warningNode.classList.remove('opacity-100', 'mb-4');
                                warningNode.classList.add('opacity-0');
                                warningNode.style.maxHeight = '0';
                                setTimeout(() => {
                                    warningNode.classList.add('hidden');
                                }, 300);
                            }
                        }, 150);
                    });
                }
            }
            
            const bugLink = interactiveFormBox.querySelector('#review-bug-link');
            if (bugLink) {
                bugLink.href = bugTrackerUrl;
            }
        }

        this.renderMedia(extension.media || []);
        this.renderLinks(extension);
    }
    
    renderWarnings(extension) {
        const warningsContainer = document.getElementById('detail-warnings-container');
        if (!warningsContainer) return;
        
        const warnings = extension.warnings || [];
        
        if (warnings.length === 0) {
            warningsContainer.innerHTML = '';
            warningsContainer.classList.add('hidden');
            return;
        }
        
        warningsContainer.classList.remove('hidden');
        warningsContainer.className = 'mb-4 flex flex-wrap justify-center sm:justify-start gap-2';
        warningsContainer.innerHTML = warnings.map(warn => {
            let icon = '<i class="icon icon-exclamation-color"></i>';
            if (warn.includes('Subprocess')) icon = '<i class="icon icon-terminal-color"></i>';
            if (warn.includes('Python')) icon = '<i class="icon icon-python-color"></i>';
            if (warn.includes('Clipboard')) icon = '<i class="icon icon-copy-color"></i>';
            
            return `
                <span class="inline-flex items-center gap-1.5 bg-gnome-orange/15 text-gnome-orange border border-gnome-orange/20 px-2.5 py-1 rounded-md text-xs font-bold" title="Security / Environment Warning">
                    ${icon} ${this.escapeHtml(warn)}
                </span>
            `;
        }).join('');
    }

    renderHostConnectorControls(extension) {
        const wrapper = document.getElementById('detail-actions-wrapper');
        if (!wrapper) return;
        
        // Clone to clear previous event listeners
        const newWrapper = wrapper.cloneNode(true);
        wrapper.parentNode.replaceChild(newWrapper, wrapper);

        const toggleBtn = document.getElementById('detail-install-toggle');
        const uninstallBtn = document.getElementById('detail-uninstall-btn');
        const updateContainer = document.getElementById('detail-update-container');
        const installBtn = document.getElementById('detail-install-btn');
        const prefsBtn = document.getElementById('detail-prefs-btn');
        const donateBtn = document.getElementById('detail-donate-btn');
        const incompatibleBtn = document.getElementById('detail-incompatible-btn');
        const bugBtn = document.getElementById('detail-bug-btn');
        
        const systemBadge = document.getElementById('detail-system-badge');
        const errorBanner = document.getElementById('detail-error-banner');
        const errorMessage = document.getElementById('detail-error-message');

        const isInstalled = extension.installed === true;
        let isEnabled = extension.enabled === true;
        const hasSettings = extension.hasSettings === true;
        
        // Mock compatibility check: default to true unless explicitly flagged
        const isCompatible = extension.compatible !== false; 

        // 1. Bug Report Link
        const bugTrackerUrl = extension.bugTracker || extension.url || extension.homepage || '#';
        bugBtn.href = bugTrackerUrl;

        // 2. Donate Button: Display if URL exists (Mocked as always active to show design)
        const donateUrl = extension.donate || '#sponsor';
        donateBtn.classList.remove('hidden');
        donateBtn.href = donateUrl;

        // 3. Settings Button: Display only when installed & has settings
        if (isInstalled && hasSettings) {
            prefsBtn.classList.remove('hidden');
            prefsBtn.addEventListener('click', () => {
                if (window.GnomeConnector && window.GnomeConnector.isConnected) {
                    window.GnomeConnector.openPrefs(extension.uuid);
                }
            });
        } else {
            prefsBtn.classList.add('hidden');
        }

        // 4. Uninstall/Remove Button: Display only when installed
        if (extension.hasError && isInstalled) {
            errorBanner.classList.remove('hidden');
            errorMessage.textContent = extension.errorMessage || "Unknown exception occurred.";
        } else {
            errorBanner.classList.add('hidden');
            errorMessage.textContent = "";
        }

        if (extension.isSystem) {
            systemBadge.classList.remove('hidden');
            uninstallBtn.classList.add('hidden');
        } else {
            systemBadge.classList.add('hidden');
            if (isInstalled) {
                uninstallBtn.classList.remove('hidden');
            } else {
                uninstallBtn.classList.add('hidden');
            }
        }

        // 5. Update Button: Display when an update is available and extension is installed
        if (extension.hasUpdate && isInstalled && !extension.isSystem) {
            updateContainer.classList.remove('hidden');
        } else {
            updateContainer.classList.add('hidden');
        }

        // 6. Install Button: Display only when NOT installed 
        if (!isInstalled) {
            installBtn.classList.remove('hidden');
        } else {
            installBtn.classList.add('hidden');
        }

        // 7. Incompatible Button: Display only when installed and marked as incompatible
        if (isInstalled && !isCompatible) {
            incompatibleBtn.classList.remove('hidden');
        } else {
            incompatibleBtn.classList.add('hidden');
        }

        // 8. Top Toggle Switch State Validation
        if (isInstalled) {
            toggleBtn.classList.remove('pointer-events-none', 'opacity-50');
            if (isEnabled) {
                toggleBtn.setAttribute('aria-checked', 'true');
            } else {
                toggleBtn.setAttribute('aria-checked', 'false');
            }
        } else {
            toggleBtn.classList.add('pointer-events-none', 'opacity-50');
            toggleBtn.setAttribute('aria-checked', 'false');
        }

        // --- Event Listeners ---
        
        toggleBtn.addEventListener('click', () => {
            if (window.GnomeConnector && window.GnomeConnector.isConnected) {
                isEnabled = !isEnabled;
                if (isEnabled) {
                    window.GnomeConnector.enable(extension.uuid);
                    toggleBtn.setAttribute('aria-checked', 'true');
                } else {
                    window.GnomeConnector.disable(extension.uuid);
                    toggleBtn.setAttribute('aria-checked', 'false');
                }
            } else {
                alert("GNOME Shell integration is not installed or running. Cannot manage extensions.");
            }
        });

        installBtn.addEventListener('click', () => {
            if (window.GnomeConnector && window.GnomeConnector.isConnected) {
                window.GnomeConnector.install(extension.uuid);
                
                // Optimistically update UI to installed state
                installBtn.classList.add('hidden');
                toggleBtn.classList.remove('pointer-events-none', 'opacity-50');
                toggleBtn.setAttribute('aria-checked', 'true');
                
                if (!extension.isSystem) {
                    uninstallBtn.classList.remove('hidden');
                }
                if (hasSettings) {
                    prefsBtn.classList.remove('hidden');
                }
                
                isEnabled = true;
            } else {
                alert("GNOME Shell integration is not installed or running. Cannot manage extensions.");
            }
        });

        uninstallBtn.addEventListener('click', () => {
            if (window.GnomeConnector && window.GnomeConnector.isConnected) {
                if (confirm(`Are you sure you want to uninstall ${extension.name}?`)) {
                    window.GnomeConnector.uninstall(extension.uuid);
                    
                    uninstallBtn.classList.add('hidden');
                    updateContainer.classList.add('hidden');
                    prefsBtn.classList.add('hidden');
                    installBtn.classList.remove('hidden');
                    
                    toggleBtn.classList.add('pointer-events-none', 'opacity-50');
                    toggleBtn.setAttribute('aria-checked', 'false');
                    
                    if (errorBanner) errorBanner.classList.add('hidden');
                }
            } else {
                alert("GNOME Shell integration is not installed or running. Cannot manage extensions.");
            }
        });

        updateContainer.addEventListener('click', () => {
            if (window.GnomeConnector && window.GnomeConnector.isConnected) {
                window.GnomeConnector.update(extension.uuid);
                updateContainer.classList.add('hidden');
            }
        });
    }

    getYoutubeId(url) {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    }

    renderMedia(mediaItems) {
        this.currentMediaItems = mediaItems || [];
        const carouselMain = document.getElementById('carousel-main');
        const carouselThumbnails = document.getElementById('carousel-thumbnails');
        
        if (!carouselMain || !carouselThumbnails) return;

        if (!this.currentMediaItems.length) {
            carouselMain.innerHTML = '<p class="text-sm text-gnome-grey">No media available</p>';
            carouselThumbnails.innerHTML = '';
            return;
        }

        const trackHtml = this.currentMediaItems.map((media, index) => {
            let content = '';
            if (media.type === 'video') {
                const ytId = this.getYoutubeId(media.url);
                if (ytId) {
                    content = `<iframe class="w-full h-full object-contain pointer-events-auto" src="https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&loop=1&playlist=${ytId}&controls=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`;
                } else {
                    content = `<video class="w-full h-full object-contain" controls playsinline poster="${this.escapeHtml(media.poster || '')}">
                                 <source src="${this.escapeHtml(media.url)}" type="video/mp4">
                               </video>`;
                }
            } else {
                content = `<img src="${this.escapeHtml(media.url)}" alt="Preview ${index + 1}" class="w-full h-full object-contain select-none">`;
            }
            
            let captionHtml = '';
            if (media.caption) {
                captionHtml = `
                    <div class="absolute top-4 left-0 right-0 flex justify-center z-10 pointer-events-none px-4">
                        <span class="bg-black/75 text-white text-sm sm:text-base font-bold px-4 py-1.5 rounded-full backdrop-blur-md border border-white/20 shadow-lg tracking-wide text-center max-w-[90%]">
                            ${this.escapeHtml(media.caption)}
                        </span>
                    </div>
                `;
            }

            return `<div class="min-w-full h-full flex-shrink-0 snap-center relative flex items-center justify-center bg-black" data-index="${index}">${content}${captionHtml}</div>`;
        }).join('');

        const dotsHtml = this.currentMediaItems.map((_, index) => {
            const activeClasses = index === 0 ? 'w-5 bg-white' : 'w-1.5 bg-white/50 hover:bg-white/90';
            return `<button type="button" data-dot-index="${index}" class="carousel-dot transition-all duration-300 ease-out rounded-full h-1.5 shadow-[0_1px_3px_rgba(0,0,0,0.5)] ${activeClasses} focus:outline-none" aria-label="Go to slide ${index + 1}"></button>`;
        }).join('');

        carouselMain.className = "w-full max-h-72 sm:max-h-80 md:max-h-96 aspect-video bg-[#241F31] dark:bg-black rounded-xl overflow-hidden mb-3 relative group shadow-inner";
        carouselMain.innerHTML = `
            <div id="carousel-track" class="w-full h-full flex overflow-x-auto snap-x snap-mandatory scrollbar-hide">
                ${trackHtml}
            </div>
            <button id="carousel-prev" class="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/30 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black/50 hover:scale-105 hover:shadow-lg border border-white/20 z-10 hidden sm:flex pointer-events-none" aria-label="Previous image">
                <i class="icon icon-arrow-left text-lg pr-1"></i>
            </button>
            <button id="carousel-next" class="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/30 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black/50 hover:scale-105 hover:shadow-lg border border-white/20 z-10 hidden sm:flex pointer-events-none" aria-label="Next image">
                <i class="icon icon-arrow-right text-lg pl-1"></i>
            </button>
            <div class="absolute bottom-3 left-0 right-0 flex justify-center items-center gap-1.5 z-20 pointer-events-auto">
                ${dotsHtml}
            </div>
        `;

        carouselThumbnails.className = "flex gap-2.5 overflow-x-auto scrollbar-hide py-1 w-full";
        carouselThumbnails.innerHTML = this.currentMediaItems.map((media, index) => {
            let thumbUrl = media.url;
            if (media.type === 'video') {
                const ytId = this.getYoutubeId(media.url);
                if (ytId) thumbUrl = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
                else thumbUrl = media.poster || '';
            }

            const activeClasses = index === 0 ? 'border-gnome-blue opacity-100 scale-100' : 'border-transparent opacity-50 hover:opacity-100 scale-95 hover:scale-100';
            
            return `
              <button type="button" data-thumb-index="${index}" class="carousel-thumb flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all duration-300 focus:outline-none ${activeClasses}">
                <img src="${this.escapeHtml(thumbUrl)}" alt="Thumbnail ${index + 1}" class="w-full h-full object-cover">
              </button>
            `;
        }).join('');

        this.setupCarouselBehaviors();
    }

    setupCarouselBehaviors() {
        const track = document.getElementById('carousel-track');
        const prevBtn = document.getElementById('carousel-prev');
        const nextBtn = document.getElementById('carousel-next');
        const dots = document.querySelectorAll('.carousel-dot');
        const thumbs = document.querySelectorAll('.carousel-thumb');

        if (!track || dots.length === 0) return;

        const updateUI = () => {
            const width = track.clientWidth;
            if (width === 0) return;
            const activeIndex = Math.floor((track.scrollLeft + width / 2) / width);

            dots.forEach((dot, idx) => {
                if (idx === activeIndex) dot.className = 'carousel-dot transition-all duration-300 ease-out rounded-full h-1.5 w-5 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.5)] focus:outline-none';
                else dot.className = 'carousel-dot transition-all duration-300 ease-out rounded-full h-1.5 w-1.5 bg-white/50 hover:bg-white/90 shadow-[0_1px_3px_rgba(0,0,0,0.5)] focus:outline-none';
            });

            thumbs.forEach((thumb, idx) => {
                if (idx === activeIndex) thumb.className = 'carousel-thumb flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all duration-300 focus:outline-none border-gnome-blue opacity-100 scale-100';
                else thumb.className = 'carousel-thumb flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all duration-300 focus:outline-none border-transparent opacity-50 hover:opacity-100 scale-95 hover:scale-100';
            });

            if (prevBtn) {
                if (activeIndex === 0) { prevBtn.style.opacity = '0'; prevBtn.style.pointerEvents = 'none'; }
                else { prevBtn.style.opacity = ''; prevBtn.style.pointerEvents = 'auto'; }
            }
            if (nextBtn) {
                if (activeIndex === dots.length - 1) { nextBtn.style.opacity = '0'; nextBtn.style.pointerEvents = 'none'; }
                else { nextBtn.style.opacity = ''; nextBtn.style.pointerEvents = 'auto'; }
            }
        };

        let scrollFrame;
        track.addEventListener('scroll', () => {
            if (scrollFrame) window.cancelAnimationFrame(scrollFrame);
            scrollFrame = window.requestAnimationFrame(updateUI);
        }, { passive: true });

        updateUI();

        if (prevBtn) prevBtn.addEventListener('click', () => { track.scrollBy({ left: -track.clientWidth }); });
        if (nextBtn) nextBtn.addEventListener('click', () => { track.scrollBy({ left: track.clientWidth }); });

        const navigateTo = (e) => {
            const idx = parseInt(e.currentTarget.getAttribute('data-dot-index') || e.currentTarget.getAttribute('data-thumb-index'), 10);
            track.scrollTo({ left: idx * track.clientWidth });
        };

        dots.forEach(dot => dot.addEventListener('click', navigateTo));
        thumbs.forEach(thumb => thumb.addEventListener('click', navigateTo));
        
        window.addEventListener('resize', updateUI);

        const onlyPictures = this.currentMediaItems.every(media => media.type !== 'video');
        let autoplayTimer = null;

        const startAutoplay = () => {
            if (!onlyPictures || dots.length <= 1) return;
            stopAutoplay();
            autoplayTimer = setInterval(() => {
                const width = track.clientWidth;
                if (width === 0) return;
                const activeIndex = Math.floor((track.scrollLeft + width / 2) / width);
                const nextIndex = (activeIndex + 1) % dots.length;
                track.scrollTo({ left: nextIndex * width });
            }, 4000);
        };

        const stopAutoplay = () => {
            if (autoplayTimer) {
                clearInterval(autoplayTimer);
                autoplayTimer = null;
            }
        };

        startAutoplay();

        const carouselMain = document.getElementById('carousel-main');
        if (carouselMain) {
            carouselMain.addEventListener('mouseenter', stopAutoplay);
            carouselMain.addEventListener('mouseleave', startAutoplay);
            carouselMain.addEventListener('touchstart', stopAutoplay, { passive: true });
            carouselMain.addEventListener('touchend', startAutoplay, { passive: true });
        }
    }

    renderLinks(extension) {
        const linksContainer = document.getElementById('detail-meta-links');
        if (!linksContainer) return;

        const bugTrackerUrl = extension.bugTracker || extension.url || extension.homepage;

        const links = [
            { label: 'Homepage', href: extension.homepage },
            { label: 'Bug tracker', href: bugTrackerUrl }
        ].filter((link) => link.href && link.href !== '#');

        const uniqueLinks = Array.from(new Map(links.map(item => [item.href, item])).values());

        linksContainer.innerHTML = uniqueLinks.map((link) => `
          <a href="${this.escapeHtml(link.href)}" target="_blank" rel="noreferrer" class="text-sm font-semibold text-gnome-blue hover:underline">${this.escapeHtml(link.label)}</a>
        `).join('');
    }

    renderMarkdown(markdown) {
        if (window.marked && typeof window.marked.parse === 'function') {
            return window.marked.parse(markdown);
        }
        return this.escapeHtml(markdown).replace(/\n/g, '<br>');
    }

    escapeHtml(value) {
        return String(value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#39;');
    }
}

window.DetailView = DetailView;