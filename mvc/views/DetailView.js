// GoF Pattern: Observer (Observer Participant)
class DetailView {
    constructor() {
        this.mapInstance = null;
        this.currentMediaItems = [];
        this.defaultExtensionSvg = `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-8 h-8">
            <path d="M16 11V7a2 2 0 00-2-2h-1V3.5a2.5 2.5 0 00-5 0V5H7a2 2 0 00-2 2v1H3.5a2.5 2.5 0 000 5H5v3a2 2 0 002 2h1v1.5a2.5 2.5 0 005 0V19h3a2 2 0 002-2v-1h1.5a2.5 2.5 0 000-5H16z" />
          </svg>`;
          
        this.bindEvents();
    }

    bindEvents() {
        const thumbnailsContainer = document.getElementById('carousel-thumbnails');
        if (thumbnailsContainer) {
            thumbnailsContainer.addEventListener('click', (e) => {
                const btn = e.target.closest('button[data-media-index]');
                if (btn) {
                    const index = parseInt(btn.getAttribute('data-media-index'), 10);
                    if (!isNaN(index) && this.currentMediaItems[index]) {
                        this.renderMainMedia(this.currentMediaItems[index]);
                        
                        // Update active state visual
                        thumbnailsContainer.querySelectorAll('button').forEach(b => {
                            b.classList.remove('border-gnome-blue');
                            b.classList.add('border-[#c0bfbc]', 'dark:border-[#3d3846]');
                        });
                        btn.classList.remove('border-[#c0bfbc]', 'dark:border-[#3d3846]');
                        btn.classList.add('border-gnome-blue');
                    }
                }
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
            // Unload the DOM content to stop iframe audio/video leaks
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
            detailIcon.innerHTML = `
              <div class="flex h-full w-full items-center justify-center bg-gnome-white dark:bg-[#2d2640] p-4 text-gnome-blue">
                ${extension.icon || this.defaultExtensionSvg}
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

        const installButton = document.getElementById('detail-install-btn');
        if (installButton) {
            installButton.textContent = 'Install';
            installButton.className = 'detail-action-btn w-full md:w-48 text-center text-sm font-bold px-6 py-3 rounded-lg transition-all shadow-md bg-gnome-blue text-gnome-white hover:bg-[#1c71d8]';
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

    renderMainMedia(media) {
        const carouselMain = document.getElementById('carousel-main');
        if (!carouselMain) return;

        if (media.type === 'video') {
            const ytId = this.getYoutubeId(media.url);
            if (ytId) {
                carouselMain.innerHTML = `
                  <iframe class="w-full h-full object-cover rounded-xl"
                    src="https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&loop=1&playlist=${ytId}&controls=1"
                    title="YouTube video player" frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    referrerpolicy="strict-origin-when-cross-origin"
                    allowfullscreen>
                  </iframe>
                `;
            } else {
                carouselMain.innerHTML = `
                  <video class="w-full h-full object-cover rounded-xl" controls autoplay muted loop playsinline poster="${this.escapeHtml(media.poster || '')}">
                    <source src="${this.escapeHtml(media.url)}" type="video/mp4">
                  </video>
                `;
            }
        } else {
            carouselMain.innerHTML = `<img src="${this.escapeHtml(media.url)}" alt="Extension preview" class="w-full h-full object-cover rounded-xl">`;
        }
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

        // Render the first item by default
        this.renderMainMedia(this.currentMediaItems[0]);

        // Render thumbnails
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
            
            const borderClass = index === 0 ? 'border-gnome-blue' : 'border-[#c0bfbc] dark:border-[#3d3846]';
            
            return `
              <button type="button" data-media-index="${index}" class="flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden border-2 ${borderClass} hover:border-gnome-blue transition-colors focus:outline-none">
                <img src="${this.escapeHtml(thumbUrl)}" alt="Preview ${index + 1}" class="w-full h-full object-cover">
              </button>
            `;
        }).join('');
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