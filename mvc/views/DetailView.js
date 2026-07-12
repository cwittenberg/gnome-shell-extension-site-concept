// GoF Pattern: Observer (Observer Participant)
class DetailView {
    constructor() {
        this.mapInstance = null;
        this.currentMediaItems = [];
        this.defaultExtensionSvg = `<i class="fa-solid fa-gear text-4xl"></i>`;
        
        this.bindEvents();
    }

    bindEvents() {
        // Global detail events can go here. 
        // Media carousel events are dynamically bound in setupCarouselBehaviors()
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
            // Unload the DOM content to stop iframe audio/video leaks
            // Otherwise it keeps playing in the background when switching extensions :)
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
              <div class="flex h-full w-full items-center justify-center bg-gnome-white dark:bg-[#2d2640] text-gnome-blue overflow-hidden rounded-3xl">
                ${iconHtml}
              </div>
            `;
        }

        const ratingContainer = document.getElementById('detail-rating-container');
        if (ratingContainer) {
            ratingContainer.innerHTML = `
              <div class="flex items-center gap-2 text-sm font-semibold text-gnome-black dark:text-gnome-white">
                <span class="text-gnome-orange">★ ${extension.rating.toFixed(1)}</span>
                <span class="text-gnome-grey">(${extension.ratingCount} ratings)</span>
              </div>
            `;
        }

        const installContainer = document.getElementById('detail-install-container');
        if (installContainer && !installContainer.dataset.bound) {
            installContainer.dataset.bound = 'true';
            installContainer.addEventListener('click', () => {
                const btn = document.getElementById('detail-install-toggle');
                const label = document.getElementById('detail-toggle-label');
                const knob = document.getElementById('detail-toggle-knob');
                
                const isInstalled = btn.getAttribute('aria-checked') === 'true';
                const newState = !isInstalled;
                
                btn.setAttribute('aria-checked', newState.toString());
                if (newState) {
                    btn.classList.remove('bg-[#c0bfbc]', 'dark:bg-[#3d3846]');
                    btn.classList.add('bg-gnome-blue');
                    knob.classList.remove('translate-x-1');
                    knob.classList.add('translate-x-6');
                    label.textContent = 'ENABLE';
                    label.classList.add('text-gnome-blue');
                } else {
                    btn.classList.add('bg-[#c0bfbc]', 'dark:bg-[#3d3846]');
                    btn.classList.remove('bg-gnome-blue');
                    knob.classList.add('translate-x-1');
                    knob.classList.remove('translate-x-6');
                    label.textContent = 'DISABLE';
                    label.classList.remove('text-gnome-blue');
                }
            });
        }
        
        // Reset toggle state when opening a new extension
        const btn = document.getElementById('detail-install-toggle');
        const label = document.getElementById('detail-toggle-label');
        const knob = document.getElementById('detail-toggle-knob');
        if (btn && label && knob) {
            btn.setAttribute('aria-checked', 'false');
            btn.classList.add('bg-[#c0bfbc]', 'dark:bg-[#3d3846]');
            btn.classList.remove('bg-gnome-blue');
            knob.classList.add('translate-x-1');
            knob.classList.remove('translate-x-6');
            label.textContent = 'DISABLE';
            label.classList.remove('text-gnome-blue');
        }

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
                  <div class="border border-[#c0bfbc] dark:border-[#3d3846] rounded-xl p-4 bg-[#f6f5f4] dark:bg-[#2d2640]">
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
                reviewsContainer.innerHTML = '<p class="text-sm text-[#5e5c64] dark:text-[#c0bfbc] italic">No reviews have been submitted for this extension yet.</p>';
            } else {
                reviewsContainer.innerHTML = reviews.map((review) => `
                  <div class="border border-[#c0bfbc] dark:border-[#3d3846] rounded-xl p-4 bg-gnome-white dark:bg-[#2d2640]">
                    <div class="flex items-center justify-between gap-3">
                      <div>
                        <p class="font-bold text-gnome-black dark:text-gnome-white">${this.escapeHtml(review.user)}</p>
                        <p class="text-sm text-gnome-grey mt-1">${this.escapeHtml(review.date)}</p>
                      </div>
                      <div class="text-gnome-orange font-semibold text-lg">★ ${review.rating}</div>
                    </div>
                    <p class="text-sm text-[#5e5c64] dark:text-[#c0bfbc] mt-4 leading-relaxed">${this.escapeHtml(review.text)}</p>
                  </div>
                `).join('');
            }
        }

        this.renderMedia(extension.media || []);
        this.renderLinks(extension);
        this.renderAnalyticsMap(extension);
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

    renderAnalyticsMap(extension) {
        const mapContainer = document.getElementById('detail-analytics-map');
        if (!mapContainer) return;

        mapContainer.innerHTML = '<div id="actual-world-map" style="width: 100%; height: 280px; margin: 0 auto;"></div>';

        if (this.mapInstance) {
            try { this.mapInstance.destroy(); } catch(e) {}
        }

        const isDarkMode = document.documentElement.classList.contains('dark');
        const fillBaseColor = isDarkMode ? '#3d3846' : '#c0bfbc';

        const markerData = [
            { name: "United States", coords: [37.0902, -95.7129], installs: 45200 },
            { name: "Germany", coords: [51.1657, 10.4515], installs: 31000 },
            { name: "Brazil", coords: [-14.2350, -51.9253], installs: 18400 },
            { name: "Japan", coords: [36.2048, 138.2529], installs: 12100 },
            { name: "India", coords: [20.5937, 78.9629], installs: 25600 },
            { name: "United Kingdom", coords: [55.3781, -3.4360], installs: 19800 },
            { name: "France", coords: [46.2276, 2.2137], installs: 21500 }
        ];

        const maxInstalls = Math.max(...markerData.map(m => m.installs));

        const bubbleMarkers = markerData.map(data => {
            const radius = 4 + (data.installs / maxInstalls) * 12;
            return {
                name: `${data.name} - ${data.installs.toLocaleString()} installs`,
                coords: data.coords,
                style: {
                    initial: {
                        r: radius,
                        fill: 'rgba(53, 132, 228, 0.5)',
                        stroke: '#3584e4',
                        strokeWidth: 1.5,
                        strokeOpacity: 1
                    },
                    hover: {
                        fill: 'rgba(255, 120, 0, 0.6)',
                        stroke: '#ff7800',
                        strokeWidth: 2
                    }
                }
            };
        });

        this.mapInstance = new jsVectorMap({
            selector: '#actual-world-map',
            map: 'world',
            zoomButtons: false,
            zoomOnScroll: false,
            backgroundColor: 'transparent',
            regionStyle: {
                initial: {
                    fill: fillBaseColor,
                    stroke: 'none',
                    strokeWidth: 0,
                    fillOpacity: 1
                },
                hover: {
                    fill: '#1c71d8',
                    fillOpacity: 0.8,
                    cursor: 'pointer'
                }
            },
            markers: bubbleMarkers
        });
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