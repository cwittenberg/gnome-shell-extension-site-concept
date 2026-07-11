(function () {
  const defaultExtensionSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-8 h-8">
      <path d="M16 11V7a2 2 0 00-2-2h-1V3.5a2.5 2.5 0 00-5 0V5H7a2 2 0 00-2 2v1H3.5a2.5 2.5 0 000 5H5v3a2 2 0 002 2h1v1.5a2.5 2.5 0 005 0V19h3a2 2 0 002-2v-1h1.5a2.5 2.5 0 000-5H16z" />
    </svg>`;

  const state = {
    selectedCategory: 'All',
    sortBy: 'downloads',
    searchTerm: '',
    selectedExtension: null
  };

  function init() {
    bindEvents();
    render();
    window.closeExtension = closeExtension;
  }

  function bindEvents() {
    const searchInput = document.getElementById('search-input');
    const sortSelect = document.getElementById('sort-select');
    const categoriesContainer = document.getElementById('categories-container');
    const mobileMenuButton = document.getElementById('mobile-menu-btn');
    const themeToggle = document.getElementById('theme-toggle');
    const themeToggleMobile = document.getElementById('theme-toggle-mobile');

    if (searchInput) {
      searchInput.addEventListener('input', (event) => {
        state.searchTerm = event.target.value.trim().toLowerCase();
        render();
      });
    }

    if (sortSelect) {
      sortSelect.addEventListener('change', (event) => {
        state.sortBy = event.target.value;
        render();
      });
    }

    if (categoriesContainer) {
      categoriesContainer.addEventListener('click', (event) => {
        const button = event.target.closest('[data-category]');
        if (!button) return;
        state.selectedCategory = button.getAttribute('data-category');
        render();
      });
    }

    if (mobileMenuButton) {
      mobileMenuButton.addEventListener('click', () => {
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu) {
          const isHidden = mobileMenu.classList.toggle('hidden');
          mobileMenuButton.setAttribute('aria-expanded', String(!isHidden));
        }
      });
    }

    [themeToggle, themeToggleMobile].forEach((button) => {
      if (button) {
        button.addEventListener('click', toggleTheme);
      }
    });

    document.querySelectorAll('a[data-nav]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const view = e.currentTarget.getAttribute('data-nav');
        
        if (view === 'store') {
          closeExtension();
        } else {
          state.selectedExtension = null;
          showView(view);
        }
        
        const mobileMenu = document.getElementById('mobile-menu');
        const mobileMenuButton = document.getElementById('mobile-menu-btn');
        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
          mobileMenu.classList.add('hidden');
          mobileMenuButton.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  function toggleTheme() {
    document.documentElement.classList.toggle('dark');
  }

  function render() {
    renderCategories();
    renderFeatured();
    renderExtensions();

    if (state.selectedExtension) {
      renderDetails();
      showView('details');
    } else {
      showView('store');
    }
  }

  function renderCategories() {
    const container = document.getElementById('categories-container');
    if (!container) return;

    const buttons = CATEGORIES.map((category) => {
      const active = category === state.selectedCategory;
      return `
        <button
          type="button"
          data-category="${escapeHtml(category)}"
          class="px-3 py-1.5 rounded-full text-sm font-semibold transition-all ${active ? 'bg-gnome-blue text-white' : 'bg-gnome-white dark:bg-[#2d2640] text-[#5e5c64] dark:text-[#c0bfbc] border border-[#deddda] dark:border-[#3d3846]'}"
        >
          ${escapeHtml(category)}
        </button>
      `;
    }).join('');

    container.innerHTML = buttons;
  }

  function renderFeatured() {
    const featuredGrid = document.getElementById('featured-grid');
    if (!featuredGrid) return;

    const featured = EXTENSIONS.filter((extension) => extension.featured).slice(0, 4);

    featuredGrid.innerHTML = featured.map((extension) => `
      <article class="bg-gnome-white dark:bg-[#2d2640] border border-[#deddda] dark:border-[#3d3846] rounded-2xl p-4 shadow-sm cursor-pointer hover:border-gnome-blue transition-all" data-extension-id="${extension.id}">
        <div class="flex items-start justify-between gap-3">
          <div class="flex items-start gap-3 min-w-0">
            <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#f6f5f4] dark:bg-[#241F31]">
              ${extension.icon || defaultExtensionSvg}
            </div>
            <div>
              <h3 class="font-bold text-gnome-black dark:text-gnome-white">${escapeHtml(extension.name)}</h3>
              <p class="text-sm text-gnome-grey mt-1">${escapeHtml(extension.author)}</p>
            </div>
          </div>
          <span class="text-xs font-semibold bg-gnome-blue/10 text-gnome-blue px-2.5 py-1 rounded-full">Featured</span>
        </div>
        <p class="text-sm text-[#5e5c64] dark:text-[#c0bfbc] mt-3">${escapeHtml(extension.description)}</p>
      </article>
    `).join('');

    featuredGrid.querySelectorAll('[data-extension-id]').forEach((card) => {
      card.addEventListener('click', () => openExtension(card.getAttribute('data-extension-id')));
    });
  }

  function renderExtensions() {
    const grid = document.getElementById('extensions-grid');
    const emptyState = document.getElementById('empty-state');
    const resultsHeader = document.getElementById('results-header');

    if (!grid || !emptyState || !resultsHeader) return;

    const visible = getFilteredExtensions();

    if (!visible.length) {
      grid.innerHTML = '';
      emptyState.classList.remove('hidden');
      resultsHeader.innerHTML = '';
      return;
    }

    emptyState.classList.add('hidden');
    resultsHeader.innerHTML = `
      <div>
        <h3 class="text-sm font-bold text-gnome-black dark:text-gnome-white">${visible.length} extensions</h3>
        <p class="text-sm text-gnome-grey">Filtered by ${escapeHtml(state.selectedCategory)}</p>
      </div>
    `;

    grid.innerHTML = visible.map((extension) => `
      <article class="bg-gnome-white dark:bg-[#2d2640] border border-[#deddda] dark:border-[#3d3846] rounded-2xl p-4 shadow-sm cursor-pointer hover:border-gnome-blue transition-all flex flex-col justify-between" data-extension-id="${extension.id}">
        <div>
          <div class="flex items-start justify-between gap-3">
            <div class="flex items-start gap-3 min-w-0">
              <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#f6f5f4] dark:bg-[#241F31]">
                ${extension.icon || defaultExtensionSvg}
              </div>
              <div class="min-w-0">
                <h3 class="font-bold text-gnome-black dark:text-gnome-white truncate">${escapeHtml(extension.name)}</h3>
                <p class="text-sm text-gnome-grey mt-1 truncate">${escapeHtml(extension.author)}</p>
              </div>
            </div>
            <div class="text-right shrink-0">
              <div class="text-sm font-semibold text-gnome-blue">★ ${extension.rating.toFixed(1)}</div>
              <div class="text-xs text-gnome-grey">${extension.downloads.toLocaleString()} dls</div>
            </div>
          </div>
          <p class="text-sm text-[#5e5c64] dark:text-[#c0bfbc] mt-3 line-clamp-3">${escapeHtml(extension.description)}</p>
        </div>
        <div class="mt-4 flex items-center justify-between pt-4 border-t border-[#deddda] dark:border-[#3d3846]">
          <span class="text-xs font-semibold bg-[#f6f5f4] dark:bg-[#3d3846] text-gnome-grey px-2.5 py-1 rounded-full">${escapeHtml(extension.category)}</span>
          <button type="button" class="text-sm font-semibold text-gnome-blue hover:underline">View details</button>
        </div>
      </article>
    `).join('');

    grid.querySelectorAll('[data-extension-id]').forEach((card) => {
      card.addEventListener('click', () => openExtension(card.getAttribute('data-extension-id')));
    });
  }

  function getFilteredExtensions() {
    return EXTENSIONS.filter((extension) => {
      const matchesCategory = state.selectedCategory === 'All' || extension.category === state.selectedCategory;
      const matchesSearch = !state.searchTerm || [extension.name, extension.author, extension.description, extension.category].join(' ').toLowerCase().includes(state.searchTerm);
      return matchesCategory && matchesSearch;
    }).sort((a, b) => {
      switch (state.sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'newest':
          return (b.new ? 1 : 0) - (a.new ? 1 : 0);
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return b.downloads - a.downloads;
      }
    });
  }

  function openExtension(extensionId) {
    state.selectedExtension = EXTENSIONS.find((extension) => String(extension.id) === String(extensionId)) || EXTENSIONS[0];
    renderDetails();
    showView('details');
    window.scrollTo(0, 0);
  }

  function closeExtension() {
    state.selectedExtension = null;
    showView('store');
  }

  function showView(view) {
    const views = ['store', 'details', 'upload', 'local', 'about'];
    views.forEach(v => {
      const el = document.getElementById(`${v}-view`);
      if (el) el.classList.toggle('hidden', v !== view);
    });

    document.querySelectorAll('nav a[data-nav], #mobile-menu a[data-nav]').forEach(link => {
      const navTarget = link.getAttribute('data-nav');
      // If we are showing 'details', keep the 'store' (Extensions) navigation item active
      const isActive = navTarget === view || (view === 'details' && navTarget === 'store');
      
      if (isActive) {
        link.classList.add('bg-[#f6f5f4]', 'dark:bg-[#2d2640]', 'text-gnome-black', 'dark:text-gnome-white');
        link.classList.remove('text-[#5e5c64]', 'dark:text-[#c0bfbc]', 'hover:bg-[#f6f5f4]', 'dark:hover:bg-[#2d2640]');
      } else {
        link.classList.remove('bg-[#f6f5f4]', 'dark:bg-[#2d2640]', 'text-gnome-black', 'dark:text-gnome-white');
        link.classList.add('text-[#5e5c64]', 'dark:text-[#c0bfbc]', 'hover:bg-[#f6f5f4]', 'dark:hover:bg-[#2d2640]');
      }
    });
  }

  function renderDetails() {
    const extension = state.selectedExtension;
    if (!extension) return;

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
          ${extension.icon || defaultExtensionSvg}
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
      installButton.className = 'w-full md:w-48 text-center text-sm font-bold px-6 py-3 rounded-lg transition-all shadow-sm bg-gnome-blue text-gnome-white hover:bg-[#1c71d8]';
    }

    const description = document.getElementById('detail-description');
    if (description) {
      description.innerHTML = renderMarkdown(extension.mdDescription || extension.description);
    }

    const versionsContainer = document.getElementById('detail-versions-container');
    if (versionsContainer) {
      versionsContainer.innerHTML = (extension.versions || []).map((version) => `
        <div class="border border-[#deddda] dark:border-[#3d3846] rounded-xl p-4 bg-[#f6f5f4] dark:bg-[#2d2640]">
          <div class="flex items-center justify-between gap-3">
            <div>
              <p class="font-bold text-sm text-gnome-black dark:text-gnome-white">Version ${escapeHtml(version.version)}</p>
              <p class="text-sm text-gnome-grey mt-1">${escapeHtml(version.comment)}</p>
            </div>
            <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${version.status === 'Active' ? 'bg-gnome-green/15 text-gnome-green' : 'bg-gnome-red/15 text-gnome-red'}">${escapeHtml(version.status)}</span>
          </div>
        </div>
      `).join('');
    }

    const reviewsContainer = document.getElementById('detail-reviews-container');
    if (reviewsContainer) {
      reviewsContainer.innerHTML = (extension.reviews || []).map((review) => `
        <div class="border border-[#deddda] dark:border-[#3d3846] rounded-xl p-4 bg-gnome-white dark:bg-[#2d2640]">
          <div class="flex items-center justify-between gap-3">
            <div>
              <p class="font-bold text-gnome-black dark:text-gnome-white">${escapeHtml(review.user)}</p>
              <p class="text-sm text-gnome-grey">${escapeHtml(review.date)}</p>
            </div>
            <div class="text-gnome-orange font-semibold">★ ${review.rating}</div>
          </div>
          <p class="text-sm text-[#5e5c64] dark:text-[#c0bfbc] mt-3">${escapeHtml(review.text)}</p>
        </div>
      `).join('');
    }

    renderMedia(extension.media || []);
    renderLinks(extension);
    renderAnalyticsMap(extension);
  }

  function renderMedia(mediaItems) {
    const carouselMain = document.getElementById('carousel-main');
    const carouselThumbnails = document.getElementById('carousel-thumbnails');

    if (!carouselMain || !carouselThumbnails) return;

    if (!mediaItems.length) {
      carouselMain.innerHTML = '<p class="text-sm text-gnome-grey">No media available</p>';
      carouselThumbnails.innerHTML = '';
      return;
    }

    const firstMedia = mediaItems[0];
    if (firstMedia.type === 'video') {
      carouselMain.innerHTML = `
        <video class="w-full h-full object-cover rounded-xl" controls autoplay muted loop playsinline poster="${escapeHtml(firstMedia.poster || '')}">
          <source src="${escapeHtml(firstMedia.url)}" type="video/mp4">
        </video>
      `;
    } else {
      carouselMain.innerHTML = `<img src="${escapeHtml(firstMedia.url)}" alt="Extension preview" class="w-full h-full object-cover rounded-xl">`;
    }

    carouselThumbnails.innerHTML = mediaItems.map((media) => `
      <button type="button" class="flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden border border-[#deddda] dark:border-[#3d3846]">
        ${media.type === 'video' ? `<img src="${escapeHtml(media.poster || '')}" alt="Preview" class="w-full h-full object-cover">` : `<img src="${escapeHtml(media.url)}" alt="Preview" class="w-full h-full object-cover">`}
      </button>
    `).join('');
  }

  function renderLinks(extension) {
    const linksContainer = document.getElementById('detail-meta-links');
    if (!linksContainer) return;

    const links = [
      { label: 'Homepage', href: extension.homepage },
      { label: 'Bug tracker', href: extension.bugTracker }
    ].filter((link) => link.href && link.href !== '#');

    linksContainer.innerHTML = links.map((link) => `
      <a href="${escapeHtml(link.href)}" target="_blank" rel="noreferrer" class="text-sm font-semibold text-gnome-blue hover:underline">${escapeHtml(link.label)}</a>
    `).join('');
  }

  function renderAnalyticsMap(extension) {
    const mapContainer = document.getElementById('detail-analytics-map');
    if (!mapContainer) return;
    
    // Inject the real vector SVG map provided by data-mock.js instead of building a text grid.
    if (window.worldMapSvg) {
        mapContainer.innerHTML = window.worldMapSvg;
    } else {
        mapContainer.innerHTML = '<p class="text-sm text-gnome-grey text-center w-full">Geomap visualization currently unavailable.</p>';
    }
  }

  function renderMarkdown(markdown) {
    if (window.marked && typeof window.marked.parse === 'function') {
      return window.marked.parse(markdown);
    }
    return escapeHtml(markdown).replace(/\n/g, '<br>');
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();