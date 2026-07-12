// GoF Pattern: Observer (Observer Participant)
class DetailView {
    constructor() {
        this.currentMediaItems = [];
        this.defaultExtensionSvg = `<i class="fa-solid fa-gear text-4xl"></i>`;
        
        this.bindEvents();
    }

    bindEvents() {
        // Interactive star rating mechanics for the review submission form
        const starContainer = document.getElementById('interactive-star-rating');
        if (starContainer) {
            const stars = starContainer.querySelectorAll('i');
            let selectedRating = 0;

            stars.forEach(star => {
                star.addEventListener('mouseover', (e) => {
                    const hoverValue = parseInt(e.target.getAttribute('data-rating'));
                    stars.forEach(s => {
                        if (parseInt(s.getAttribute('data-rating')) <= hoverValue) {
                            s.classList.replace('fa-regular', 'fa-solid');
                            s.classList.add('text-gnome-orange');
                        } else {
                            s.classList.replace('fa-solid', 'fa-regular');
                            s.classList.remove('text-gnome-orange');
                        }
                    });
                });

                star.addEventListener('mouseout', () => {
                    stars.forEach(s => {
                        if (parseInt(s.getAttribute('data-rating')) <= selectedRating) {
                            s.classList.replace('fa-regular', 'fa-solid');
                            s.classList.add('text-gnome-orange');
                        } else {
                            s.classList.replace('fa-solid', 'fa-regular');
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
                    iconHtml = extension.icon; // fallback to inline svg if needed
                }
            }
            detailIcon.innerHTML = `
              <div class="flex h-full w-full items-center justify-center bg-gnome-white dark:bg-gnome-card-dark text-gnome-blue overflow-hidden rounded-3xl">
                ${iconHtml}
              </div>
            `;
        }

        const ratingContainer = document.getElementById('detail-rating-container');
        if (ratingContainer) {
            ratingContainer.innerHTML = `
              <div class="flex items-center gap-2 text-sm font-semibold text-gnome-black dark:text-gnome-white">
                <span class="text-gnome-orange"><i class="fa-solid fa-star"></i> ${extension.rating.toFixed(1)}</span>
                <span class="text-gnome-grey">(${extension.ratingCount} ratings)</span>
            </div>
            `;
        }

        this.renderHostConnectorControls(extension);

        const description = document.getElementById('detail-description');
        if (description) {
            description.innerHTML = this.renderMarkdown(extension.mdDescription || extension.description);
        }

        const versionsContainer = document.getElementById('detail-versions-container');
        if (versionsContainer) {
            const versions = extension.versions || [];
            if (versions.length === 0) {
                versionsContainer.innerHTML = '<p class="text-sm text-gnome-text-muted-light dark:text-gnome-text-muted-dark italic">No version history available.</p>';
            } else {
                versionsContainer.innerHTML = versions.map((version) => `
                  <div class="border border-gnome-border-light dark:border-gnome-border-dark rounded-xl p-4 bg-gnome-page-bg dark:bg-gnome-card-dark">
                    <div class="flex items-center justify-between gap-3">
                      <div>
                        <p class="font-bold text-sm text-gnome-black dark:text-gnome-white">Version ${this.escapeHtml(version.version)}</p>
                        <p class="text-sm text-gnome-grey mt-1">${this.escapeHtml(version.comment)}</p>
                      </div>
                      <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${version.status === 'Active' ? 'bg-gnome-green/15 text-gnome-green' : 'bg-gnome-red/15 text-gnome-red'}">${this.escapeHtml(version.status)}</span>
                    </div>
                  </div>
                `).join('');
            }
        }

        const reviewsContainer = document.getElementById('detail-reviews-container');
        if (reviewsContainer) {
            const reviews = extension.reviews || [];
            if (reviews.length === 0) {
                reviewsContainer.innerHTML = '<p class="text-sm text-gnome-text-muted-light dark:text-gnome-text-muted-dark italic">No reviews have been submitted for this extension yet.</p>';
            } else {
                reviewsContainer.innerHTML = reviews.map((review) => `
                  <div class="border border-gnome-border-light dark:border-gnome-border-dark rounded-xl p-4 bg-gnome-white dark:bg-gnome-card-dark">
                    <div class="flex items-center justify-between gap-3">
                      <div>
                        <p class="font-bold text-gnome-black dark:text-gnome-white">${this.escapeHtml(review.user)}</p>
                        <p class="text-sm text-gnome-grey mt-1">${this.escapeHtml(review.date)}</p>
                      </div>
                      <div class="text-gnome-orange font-semibold text-lg"><i class="fa-solid fa-star"></i> ${review.rating}</div>
                    </div>
                    <p class="text-sm text-gnome-text-muted-light dark:text-gnome-text-muted-dark mt-4 leading-relaxed">${this.escapeHtml(review.text)}</p>
                  </div>
                `).join('');
            }
        }

        this.renderMedia(extension.media || []);
        this.renderLinks(extension);
    }

    renderHostConnectorControls(extension) {
        const installContainer = document.getElementById('detail-install-container');
        const btn = document.getElementById('detail-install-toggle');
        const label = document.getElementById('detail-toggle-label');
        const knob = document.getElementById('detail-toggle-knob');
        
        const uninstallBtn = document.getElementById('detail-uninstall-btn');
        const updateContainer = document.getElementById('detail-update-container');
        const systemBadge = document.getElementById('detail-system-badge');
        const errorBanner = document.getElementById('detail-error-banner');
        const errorMessage = document.getElementById('detail-error-message');

        // Cleanup any previous bindings using cloned node strategy to prevent multi-fires
        const newInstallContainer = installContainer.cloneNode(true);
        installContainer.parentNode.replaceChild(newInstallContainer, installContainer);
        
        const newBtn = newInstallContainer.querySelector('#detail-install-toggle');
        const newLabel = newInstallContainer.querySelector('#detail-toggle-label');
        const newKnob = newInstallContainer.querySelector('#detail-toggle-knob');

        const newUninstallBtn = uninstallBtn.cloneNode(true);
        uninstallBtn.parentNode.replaceChild(newUninstallBtn, uninstallBtn);

        const newUpdateContainer = updateContainer.cloneNode(true);
        updateContainer.parentNode.replaceChild(newUpdateContainer, updateContainer);
        
        // Render Error State
        if (extension.hasError && extension.installed) {
            errorBanner.classList.remove('hidden');
            errorMessage.textContent = extension.errorMessage || "Unknown exception occurred.";
        } else {
            errorBanner.classList.add('hidden');
            errorMessage.textContent = "";
        }

        // Render System Extension Badge
        if (extension.isSystem) {
            systemBadge.classList.remove('hidden');
            newUninstallBtn.classList.add('hidden'); // Cannot uninstall system extensions via web
        } else {
            systemBadge.classList.add('hidden');
            if (extension.installed) newUninstallBtn.classList.remove('hidden');
        }

        // Render Updates
        if (extension.hasUpdate && extension.installed && !extension.isSystem) {
            newUpdateContainer.classList.remove('hidden');
        } else {
            newUpdateContainer.classList.add('hidden');
        }

        // Setup base toggle styling based on installed/enabled state
        if (extension.installed && extension.enabled) {
            newBtn.setAttribute('aria-checked', 'true');
            newBtn.classList.remove('bg-gnome-border-light', 'dark:bg-gnome-border-dark');
            newBtn.classList.add('bg-gnome-blue');
            newKnob.classList.remove('translate-x-1');
            newKnob.classList.add('translate-x-6');
            newLabel.textContent = 'ENABLED';
            newLabel.classList.add('text-gnome-blue');
        } else if (extension.installed && !extension.enabled) {
            newBtn.setAttribute('aria-checked', 'false');
            newBtn.classList.add('bg-gnome-border-light', 'dark:bg-gnome-border-dark');
            newBtn.classList.remove('bg-gnome-blue');
            newKnob.classList.add('translate-x-1');
            newKnob.classList.remove('translate-x-6');
            newLabel.textContent = 'DISABLED';
            newLabel.classList.remove('text-gnome-blue');
        } else {
            newBtn.setAttribute('aria-checked', 'false');
            newBtn.classList.add('bg-gnome-border-light', 'dark:bg-gnome-border-dark');
            newBtn.classList.remove('bg-gnome-blue');
            newKnob.classList.add('translate-x-1');
            newKnob.classList.remove('translate-x-6');
            newLabel.textContent = 'INSTALL';
            newLabel.classList.remove('text-gnome-blue');
        }

        // Handle Toggle / Install interactions
        newInstallContainer.addEventListener('click', () => {
            if (window.GnomeConnector && window.GnomeConnector.isConnected) {
                if (!extension.installed) {
                    window.GnomeConnector.install(extension.uuid);
                    extension.installed = true;
                    extension.enabled = true;
                    
                    newBtn.setAttribute('aria-checked', 'true');
                    newLabel.textContent = 'ENABLED';
                    newLabel.classList.add('text-gnome-blue');
                    newBtn.classList.remove('bg-gnome-border-light', 'dark:bg-gnome-border-dark');
                    newBtn.classList.add('bg-gnome-blue');
                    newKnob.classList.remove('translate-x-1');
                    newKnob.classList.add('translate-x-6');
                    newUninstallBtn.classList.remove('hidden');
                } else {
                    extension.enabled = !extension.enabled;
                    if (extension.enabled) {
                        window.GnomeConnector.enable(extension.uuid);
                        newBtn.setAttribute('aria-checked', 'true');
                        newBtn.classList.remove('bg-gnome-border-light', 'dark:bg-gnome-border-dark');
                        newBtn.classList.add('bg-gnome-blue');
                        newKnob.classList.remove('translate-x-1');
                        newKnob.classList.add('translate-x-6');
                        newLabel.textContent = 'ENABLED';
                        newLabel.classList.add('text-gnome-blue');
                    } else {
                        window.GnomeConnector.disable(extension.uuid);
                        newBtn.setAttribute('aria-checked', 'false');
                        newBtn.classList.add('bg-gnome-border-light', 'dark:bg-gnome-border-dark');
                        newBtn.classList.remove('bg-gnome-blue');
                        newKnob.classList.add('translate-x-1');
                        newKnob.classList.remove('translate-x-6');
                        newLabel.textContent = 'DISABLED';
                        newLabel.classList.remove('text-gnome-blue');
                    }
                }
            } else {
                alert("GNOME Shell integration is not installed or running. Cannot manage extensions.");
            }
        });

        // Handle Uninstall Interaction
        newUninstallBtn.addEventListener('click', () => {
            if (window.GnomeConnector && window.GnomeConnector.isConnected) {
                if (confirm(`Are you sure you want to uninstall ${extension.name}?`)) {
                    window.GnomeConnector.uninstall(extension.uuid);
                    extension.installed = false;
                    extension.enabled = false;
                    
                    // Reset UI Mock State
                    newUninstallBtn.classList.add('hidden');
                    newUpdateContainer.classList.add('hidden');
                    newLabel.textContent = 'INSTALL';
                    newLabel.classList.remove('text-gnome-blue');
                    newBtn.classList.add('bg-gnome-border-light', 'dark:bg-gnome-border-dark');
                    newBtn.classList.remove('bg-gnome-blue');
                    newKnob.classList.add('translate-x-1');
                    newKnob.classList.remove('translate-x-6');
                    errorBanner.classList.add('hidden');
                }
            }
        });

        // Handle Update Interaction
        newUpdateContainer.addEventListener('click', () => {
            if (window.GnomeConnector && window.GnomeConnector.isConnected) {
                window.GnomeConnector.update(extension.uuid);
                newUpdateContainer.classList.add('hidden');
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

        // Generate the native scroll-snap track
        const trackHtml = this.currentMediaItems.map((media, index) => {
            let content = '';
            if (media.type === 'video') {
                const ytId = this.getYoutubeId(media.url);
                if (ytId) {
                    content = `<iframe class="w-full h-full object-cover pointer-events-auto" src="https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&loop=1&playlist=${ytId}&controls=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`;
                } else {
                    content = `<video class="w-full h-full object-cover" controls playsinline poster="${this.escapeHtml(media.poster || '')}">
                                 <source src="${this.escapeHtml(media.url)}" type="video/mp4">
                               </video>`;
                }
            } else {
                content = `<img src="${this.escapeHtml(media.url)}" alt="Preview ${index + 1}" class="w-full h-full object-cover select-none">`;
            }
            
            // Generate the Caption Overlay
            let captionHtml = '';
            if (media.caption) {
                captionHtml = `
                    <div class="absolute bottom-10 left-0 right-0 flex justify-center z-10 pointer-events-none">
                        <span class="bg-black/60 text-white text-xs font-semibold px-4 py-1.5 rounded-full backdrop-blur-md border border-white/20 shadow-lg tracking-wide">
                            ${this.escapeHtml(media.caption)}
                        </span>
                    </div>
                `;
            }
            
            return `<div class="min-w-full h-full flex-shrink-0 snap-center relative flex items-center justify-center bg-black" data-index="${index}">${content}${captionHtml}</div>`;
        }).join('');

        // Generate expanding pill indicators (overlayed)
        const dotsHtml = this.currentMediaItems.map((_, index) => {
            const activeClasses = index === 0 ? 'w-5 bg-white' : 'w-1.5 bg-white/50 hover:bg-white/90';
            return `<button type="button" data-dot-index="${index}" class="carousel-dot transition-all duration-300 ease-out rounded-full h-1.5 shadow-[0_1px_3px_rgba(0,0,0,0.5)] ${activeClasses} focus:outline-none" aria-label="Go to slide ${index + 1}"></button>`;
        }).join('');

        // Apply track, arrows, and pill indicators to the main container
        carouselMain.className = "w-full aspect-video bg-black rounded-xl overflow-hidden mb-3 relative group shadow-inner";
        carouselMain.innerHTML = `
            <div id="carousel-track" class="w-full h-full flex overflow-x-auto snap-x snap-mandatory scrollbar-hide scroll-smooth">
                ${trackHtml}
            </div>
            
            <button id="carousel-prev" class="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/30 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black/50 hover:scale-105 hover:shadow-lg border border-white/20 z-10 hidden sm:flex pointer-events-none" aria-label="Previous image">
                <i class="fa-solid fa-chevron-left text-lg pr-1"></i>
            </button>
            <button id="carousel-next" class="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/30 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black/50 hover:scale-105 hover:shadow-lg border border-white/20 z-10 hidden sm:flex pointer-events-none" aria-label="Next image">
                <i class="fa-solid fa-chevron-right text-lg pl-1"></i>
            </button>

            <div class="absolute bottom-3 left-0 right-0 flex justify-center items-center gap-1.5 z-20 pointer-events-auto">
                ${dotsHtml}
            </div>
        `;

        // Generate Thumbnails underneath.
        carouselThumbnails.className = "flex gap-2.5 overflow-x-auto scrollbar-hide py-1 w-full";
        carouselThumbnails.innerHTML = this.currentMediaItems.map((media, index) => {
            let thumbUrl = media.url;
            if (media.type === 'video') {
                const ytId = this.getYoutubeId(media.url);
                if (ytId) {
                    thumbUrl = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
                } else {
                    thumbUrl = media.poster || '';
                }
            }
            
            const activeClasses = index === 0 ? 'border-gnome-blue opacity-100 scale-100' : 'border-transparent opacity-50 hover:opacity-100 scale-95 hover:scale-100';
            
            return `
              <button type="button" data-thumb-index="${index}" class="carousel-thumb flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all duration-300 focus:outline-none ${activeClasses}">
                <img src="${this.escapeHtml(thumbUrl)}" alt="Thumbnail ${index + 1}" class="w-full h-full object-cover">
              </button>
            `;
        }).join('');

        // Initialize interactivity
        this.setupCarouselBehaviors();
    }

    setupCarouselBehaviors() {
        const track = document.getElementById('carousel-track');
        const prevBtn = document.getElementById('carousel-prev');
        const nextBtn = document.getElementById('carousel-next');
        const dots = document.querySelectorAll('.carousel-dot');
        const thumbs = document.querySelectorAll('.carousel-thumb');

        if (!track || dots.length === 0) return;

        // UI update function synced to exact scroll layout
        const updateUI = () => {
            const width = track.clientWidth;
            if (width === 0) return; // Prevent calc error on hidden views

            // Add half a track width to accurately calculate the center item during snap
            const activeIndex = Math.floor((track.scrollLeft + width / 2) / width);

            // Update pills
            dots.forEach((dot, idx) => {
                if (idx === activeIndex) {
                    dot.className = 'carousel-dot transition-all duration-300 ease-out rounded-full h-1.5 w-5 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.5)] focus:outline-none';
                } else {
                    dot.className = 'carousel-dot transition-all duration-300 ease-out rounded-full h-1.5 w-1.5 bg-white/50 hover:bg-white/90 shadow-[0_1px_3px_rgba(0,0,0,0.5)] focus:outline-none';
                }
            });

            // Update thumbnails
            thumbs.forEach((thumb, idx) => {
                if (idx === activeIndex) {
                    thumb.className = 'carousel-thumb flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all duration-300 focus:outline-none border-gnome-blue opacity-100 scale-100';
                } else {
                    thumb.className = 'carousel-thumb flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all duration-300 focus:outline-none border-transparent opacity-50 hover:opacity-100 scale-95 hover:scale-100';
                }
            });

            // Update directional arrow visibility
            if (prevBtn) {
                if (activeIndex === 0) {
                    prevBtn.style.opacity = '0';
                    prevBtn.style.pointerEvents = 'none';
                } else {
                    prevBtn.style.opacity = '';
                    prevBtn.style.pointerEvents = 'auto';
                }
            }
            if (nextBtn) {
                if (activeIndex === dots.length - 1) {
                    nextBtn.style.opacity = '0';
                    nextBtn.style.pointerEvents = 'none';
                } else {
                    nextBtn.style.opacity = '';
                    nextBtn.style.pointerEvents = 'auto';
                }
            }
        };

        // Bind scroll updates
        let scrollTimeout;
        track.addEventListener('scroll', () => {
            window.clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(updateUI, 15); // Short debounce for buttery smooth rendering
        });

        // Initialize boundaries on load
        updateUI();

        // Arrow Controls
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                track.scrollBy({ left: -track.clientWidth, behavior: 'smooth' });
            });
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                track.scrollBy({ left: track.clientWidth, behavior: 'smooth' });
            });
        }

        // Indicator & Thumbnail Navigation
        const navigateTo = (e) => {
            const idx = parseInt(e.currentTarget.getAttribute('data-dot-index') || e.currentTarget.getAttribute('data-thumb-index'), 10);
            track.scrollTo({ left: idx * track.clientWidth, behavior: 'smooth' });
        };

        dots.forEach(dot => dot.addEventListener('click', navigateTo));
        thumbs.forEach(thumb => thumb.addEventListener('click', navigateTo));
        
        // Recalculate on browser resize
        window.addEventListener('resize', updateUI);

        // --- Auto-play Carousel Logic ---
        const onlyPictures = this.currentMediaItems.every(media => media.type !== 'video');
        let autoplayTimer = null;

        const startAutoplay = () => {
            if (!onlyPictures || dots.length <= 1) return;
            
            stopAutoplay(); // clear existing to prevent duplicates
            autoplayTimer = setInterval(() => {
                const width = track.clientWidth;
                if (width === 0) return; // Wait if DOM is hidden
                
                const activeIndex = Math.floor((track.scrollLeft + width / 2) / width);
                const nextIndex = (activeIndex + 1) % dots.length;
                track.scrollTo({ left: nextIndex * width, behavior: 'smooth' });
            }, 4000); // 4 second interval
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

        const links = [
            { label: 'Homepage', href: extension.homepage },
            { label: 'Bug tracker', href: extension.bugTracker }
        ].filter((link) => link.href && link.href !== '#');

        linksContainer.innerHTML = links.map((link) => `
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