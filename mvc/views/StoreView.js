// mvc/views/StoreView.js
// GoF Pattern: Observer (Observer Participant)
class StoreView {
    constructor() {
        this.controller = null;
        this.defaultExtensionSvg = `<i class="text-gnome-blue icon icon-settings text-4xl"></i>`;
        
        // Cache state variables to prevent unnecessary DOM redraws and flashing
        this._lastFeaturedTab = null;
        this._lastIsFeaturedHidden = null;
        this._lastFeaturedItemsPerPage = null;
        this._lastSelectedCategory = null;
        this._categoriesRendered = false;
        
        this._lastGridSearchTerm = null;
        this._lastGridCategory = null;
        this._lastGridSortBy = null;
        this._lastGridShellVersion = null;
        this._lastGridPage = null;
        this._lastGridItemsPerPage = null;
        this._lastGridLayoutMode = null;
        this._gridRendered = false;
        
        this.bindEvents();
        this.bindScrollEvents();
    }

    setController(controller) {
        this.controller = controller;
    }
    
    // Helper method to keep card click logic clean and DRY
    handleCardClick(card) {
        if (!this.controller) return;
        const extId = card.getAttribute('data-extension-id');
        
        // Add unfolding animation class
        card.classList.add('card-unfold-active');
        
        // Wait for the CSS animation to complete before switching views
        setTimeout(() => {
            this.controller.handleOpenExtension(extId);
            // Clean up to ensure state is reset if navigating back
            card.classList.remove('card-unfold-active');
        }, 350);
    }

    scrollToFilters() {
        // Yield to the event loop so the controller can update the model and the view can react
        // (adding/removing .hero-hidden, .hidden, etc.)
        setTimeout(() => {
            const hero = document.getElementById('hero-section');
            const isHeroHidden = hero && hero.classList.contains('hero-hidden');
            
            if (isHeroHidden) {
                // When filtered, the hero and featured sections are gone.
                // The category bar is the top-most element in main.
                // Scrolling to 0 aligns it perfectly under the sticky header.
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                // When unfiltered (All), the hero and featured sections are present.
                // We need to scroll down to the category bar.
                const header = document.querySelector('.gnome-header');
                const filterContainer = document.querySelector('.gnome-filter-container');
                
                if (header && filterContainer) {
                    const headerHeight = header.offsetHeight;
                    
                    // The hero section has a 500ms transition. 
                    // To avoid a jarring jump, we do an initial smooth scroll...
                    const initialTop = filterContainer.getBoundingClientRect().top + window.scrollY - headerHeight - 24;
                    window.scrollTo({ top: initialTop, behavior: 'smooth' });
                    
                    // ...and a precise snap after the layout stabilizes
                    setTimeout(() => {
                        const finalTop = filterContainer.getBoundingClientRect().top + window.scrollY - headerHeight - 24;
                        window.scrollTo({ top: finalTop, behavior: 'smooth' });
                    }, 510);
                }
            }
        }, 10);
    }

    bindEvents() {
        const searchInput = document.getElementById('search-input');
        const sortSelect = document.getElementById('sort-select');
        const shellVersionSelect = document.getElementById('shell-version-select');
        const gridBtn = document.getElementById('layout-grid-btn');
        const rowBtn = document.getElementById('layout-row-btn');
        
        if (searchInput) {
            searchInput.addEventListener('input', (event) => {
                if (this.controller) this.controller.handleSearch(event.target.value.trim());
                
                // Auto switch to store view when typing starts
                if(event.target.value.trim() !== '' && document.getElementById('store-view').classList.contains('hidden')) {
                    if(window.showViewHandler) window.showViewHandler('store');
                }
            });
        }
        
        if (sortSelect) {
            sortSelect.addEventListener('change', (event) => {
                if (this.controller) {
                    this.controller.handleSort(event.target.value);
                    this.scrollToFilters();
                }
            });
        }

        if (shellVersionSelect) {
            shellVersionSelect.addEventListener('change', (event) => {
                if (this.controller) {
                    this.controller.handleShellVersion(event.target.value);
                    this.scrollToFilters();
                }
            });
        }
        
        if (gridBtn) {
            gridBtn.addEventListener('click', () => {
                if (this.controller && typeof this.controller.handleLayoutMode === 'function') {
                    this.controller.handleLayoutMode('grid');
                } else {
                    console.error('StoreController is missing handleLayoutMode. Please update mvc/controllers/StoreController.js');
                }
            });
        }
        
        if (rowBtn) {
            rowBtn.addEventListener('click', () => {
                if (this.controller && typeof this.controller.handleLayoutMode === 'function') {
                    this.controller.handleLayoutMode('row');
                } else {
                    console.error('StoreController is missing handleLayoutMode. Please update mvc/controllers/StoreController.js');
                }
            });
        }
        
        // 1. Categories Container Events
        const categoriesContainer = document.getElementById('categories-container');
        if (categoriesContainer) {
            categoriesContainer.addEventListener('click', (event) => {
                const categoryBtn = event.target.closest('[data-category]');
                if (categoryBtn && this.controller) {
                    this.controller.handleCategory(categoryBtn.getAttribute('data-category'));
                    this.scrollToFilters();
                }
            });
        }

        // 2. Featured Section Events
        const featuredSection = document.getElementById('featured-section');
        if (featuredSection) {
            featuredSection.addEventListener('click', (event) => {
                const catFilterBtn = event.target.closest('[data-category-filter]');
                if (catFilterBtn && this.controller) {
                    event.stopPropagation();
                    this.controller.handleCategory(catFilterBtn.getAttribute('data-category-filter'));
                    this.scrollToFilters();
                    return;
                }

                const toggleFeaturedBtn = event.target.closest('[data-action="toggle-featured"]');
                if (toggleFeaturedBtn && this.controller) {
                    event.preventDefault();
                    this.controller.handleToggleFeatured();
                    return;
                }
                
                const featuredTabBtn = event.target.closest('[data-featured-tab]');
                if (featuredTabBtn && this.controller) {
                    event.preventDefault();
                    this.controller.handleFeaturedTab(featuredTabBtn.getAttribute('data-featured-tab'));
                    return;
                }
                
                const card = event.target.closest('[data-extension-id]');
                if (card) {
                    this.handleCardClick(card);
                }
            });
            
            featuredSection.addEventListener('change', (event) => {
                const itemsPerPageSelect = event.target.closest('[data-action="change-items-per-page"]');
                if (itemsPerPageSelect && this.controller) {
                    this.controller.handleItemsPerPage(itemsPerPageSelect.value);
                }
            });
        }

        // 3. Extensions Grid Events (Search & Filter Results)
        const extensionsGrid = document.getElementById('extensions-grid');
        if (extensionsGrid) {
            extensionsGrid.addEventListener('click', (event) => {
                const catFilterBtn = event.target.closest('[data-category-filter]');
                if (catFilterBtn && this.controller) {
                    event.stopPropagation();
                    this.controller.handleCategory(catFilterBtn.getAttribute('data-category-filter'));
                    this.scrollToFilters();
                    return;
                }

                const card = event.target.closest('[data-extension-id]');
                if (card) {
                    this.handleCardClick(card);
                }
            });
        }

        // 4. Pagination Events
        const paginationContainer = document.getElementById('pagination-container');
        if (paginationContainer) {
            paginationContainer.addEventListener('click', (event) => {
                const pageBtn = event.target.closest('[data-page]');
                if (pageBtn && this.controller) {
                    event.preventDefault();
                    const pageNum = parseInt(pageBtn.getAttribute('data-page'), 10);
                    if (!isNaN(pageNum)) {
                        this.controller.handlePageChange(pageNum);
                        this.scrollToFilters();
                    }
                }
            });
        }
        
        // 5. Results Header Events (For items-per-page select when searching/filtering)
        const resultsHeader = document.getElementById('results-header');
        if (resultsHeader) {
            resultsHeader.addEventListener('change', (event) => {
                const itemsPerPageSelect = event.target.closest('[data-action="change-items-per-page"]');
                if (itemsPerPageSelect && this.controller) {
                    this.controller.handleItemsPerPage(itemsPerPageSelect.value);
                    this.scrollToFilters();
                }
            });
        }
    }
    
    bindScrollEvents() {
        const catContainer = document.getElementById('categories-container');
        const scrollLeftBtn = document.getElementById('cat-scroll-left');
        const scrollRightBtn = document.getElementById('cat-scroll-right');
        
        if (catContainer && scrollLeftBtn && scrollRightBtn) {
            const updateScrollButtons = () => {
                scrollLeftBtn.classList.toggle('hidden', catContainer.scrollLeft <= 0);
                scrollRightBtn.classList.toggle('hidden', catContainer.scrollLeft + catContainer.clientWidth >= catContainer.scrollWidth - 1);
            };
            
            catContainer.addEventListener('scroll', updateScrollButtons);
            window.addEventListener('resize', updateScrollButtons);
            
            // Re-verify sizing anytime new nodes get injected
            const observer = new MutationObserver(() => updateScrollButtons());
            observer.observe(catContainer, { childList: true, subtree: true });
            
            scrollLeftBtn.addEventListener('click', () => {
                catContainer.scrollBy({ left: -200, behavior: 'smooth' });
            });
            
            scrollRightBtn.addEventListener('click', () => {
                catContainer.scrollBy({ left: 200, behavior: 'smooth' });
            });
        }
    }

    update(data) {
        // Sync DOM inputs with state to handle external resets (like clicking the logo)
        const searchInput = document.getElementById('search-input');
        if (searchInput && searchInput.value !== data.state.searchTerm) {
            searchInput.value = data.state.searchTerm;
        }

        const sortSelect = document.getElementById('sort-select');
        if (sortSelect && sortSelect.value !== data.state.sortBy) {
            sortSelect.value = data.state.sortBy;
        }

        const shellVersionSelect = document.getElementById('shell-version-select');
        if (shellVersionSelect && shellVersionSelect.value !== data.state.shellVersion) {
            shellVersionSelect.value = data.state.shellVersion;
        }
        
        this.updateLayoutToggleUI(data.state.layoutMode);
        
        // Only render categories if they actually changed to preserve scroll position
        if (this._lastSelectedCategory !== data.state.selectedCategory || !this._categoriesRendered) {
            this.renderCategories(data.categories, data.state.selectedCategory);
            this._lastSelectedCategory = data.state.selectedCategory;
            this._categoriesRendered = true;
            // Scroll the newly active category into view
            setTimeout(() => {
                const container = document.getElementById('categories-container');
                if (container) {
                    const activeBtn = container.querySelector('.gnome-category-btn.active');
                    if (activeBtn) {
                        activeBtn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
                    }
                }
            }, 50);
        }
        
        // Check if featured section actually needs an update to prevent animation flashing
        const featuredNeedsUpdate = 
            this._lastFeaturedTab !== data.state.featuredTab || 
            this._lastIsFeaturedHidden !== data.state.isFeaturedHidden ||
            this._lastFeaturedItemsPerPage !== data.state.itemsPerPage;
            
        if (featuredNeedsUpdate) {
            this.renderFeatured(data.featured, data.state.featuredTab, data.state.isFeaturedHidden, data.state.itemsPerPage);
            this._lastFeaturedTab = data.state.featuredTab;
            this._lastIsFeaturedHidden = data.state.isFeaturedHidden;
            this._lastFeaturedItemsPerPage = data.state.itemsPerPage;
        }
        
        const isFiltering = data.state.selectedCategory !== 'All' || data.state.searchTerm.trim() !== '' || data.state.shellVersion !== 'all';
        
        const gridNeedsUpdate =
            this._lastGridSearchTerm !== data.state.searchTerm ||
            this._lastGridCategory !== data.state.selectedCategory ||
            this._lastGridSortBy !== data.state.sortBy ||
            this._lastGridShellVersion !== data.state.shellVersion ||
            this._lastGridPage !== data.pagination.currentPage ||
            this._lastGridItemsPerPage !== data.state.itemsPerPage ||
            this._lastGridLayoutMode !== data.state.layoutMode ||
            !this._gridRendered;

        if (gridNeedsUpdate) {
            // Grid elements always update based on pagination/filtering
            this.renderExtensions(data.filtered, data.state.selectedCategory, data.state.itemsPerPage, data.pagination.totalItems, data.state.layoutMode, isFiltering);
            this.renderPagination(data.pagination);
            
            this._lastGridSearchTerm = data.state.searchTerm;
            this._lastGridCategory = data.state.selectedCategory;
            this._lastGridSortBy = data.state.sortBy;
            this._lastGridShellVersion = data.state.shellVersion;
            this._lastGridPage = data.pagination.currentPage;
            this._lastGridItemsPerPage = data.state.itemsPerPage;
            this._lastGridLayoutMode = data.state.layoutMode;
            this._gridRendered = true;
        }
        
        // Element Hooks
        const heroSection = document.getElementById('hero-section');
        const heroContent = document.getElementById('hero-content');
        const homeBottomContent = document.getElementById('home-bottom-content');
        const featuredSection = document.getElementById('featured-section');
        const mainDivider = document.getElementById('main-divider');
        const resultsHeader = document.getElementById('results-header');
        
        // Smooth Auto-hide Hero section logic and home banners
        if (heroSection && heroContent) {
            if (isFiltering) {
                heroSection.classList.add('hero-hidden');
                heroContent.classList.add('opacity-0', 'scale-95');
                if (homeBottomContent) homeBottomContent.classList.add('hidden');
            } else {
                heroSection.classList.remove('hero-hidden');
                heroContent.classList.remove('opacity-0', 'scale-95');
                if (homeBottomContent) homeBottomContent.classList.remove('hidden');
            }
        }
        
        // Hide Featured components when searching/filtering
        if (featuredSection && mainDivider && resultsHeader) {
            if (isFiltering) {
                featuredSection.classList.add('hidden');
                mainDivider.classList.add('hidden');
                resultsHeader.classList.remove('hidden');
            } else {
                featuredSection.classList.remove('hidden');
                mainDivider.classList.remove('hidden');
                resultsHeader.classList.add('hidden');
            }
        }
    }

    updateLayoutToggleUI(layoutMode) {
        const gridBtn = document.getElementById('layout-grid-btn');
        const rowBtn = document.getElementById('layout-row-btn');
        
        if (gridBtn && rowBtn) {
            if (layoutMode === 'grid' || !layoutMode) {
                gridBtn.className = 'gnome-btn-icon h-full rounded-none active';
                rowBtn.className = 'gnome-btn-icon h-full rounded-none';
            } else {
                rowBtn.className = 'gnome-btn-icon h-full rounded-none active';
                gridBtn.className = 'gnome-btn-icon h-full rounded-none';
            }
        }
    }

    renderCategories(categories, selectedCategory) {
        const container = document.getElementById('categories-container');
        if (!container) return;
        
        const buttons = categories.map((category) => {
            const active = category === selectedCategory;
            return `
                <button type="button" data-category="${this.escapeHtml(category)}" class="gnome-category-btn ${active ? 'active' : ''}">
                    ${this.escapeHtml(category)}
                </button>
            `;
        }).join('');
        
        container.innerHTML = buttons;
    }

    renderFeatured(featured, activeTab, isHidden, itemsPerPage) {
        const featuredSection = document.getElementById('featured-section');
        if (!featuredSection) return;
        
        if (isHidden) {
            // Remove the large bottom margin when hidden so the gap isn't huge
            featuredSection.classList.remove('mb-12');
            featuredSection.classList.add('mb-2');
            
            featuredSection.innerHTML = `
                <div class="flex justify-end items-center gap-3 animate-fade-in">
                    <select data-action="change-items-per-page" class="gnome-select h-[38px]">
                        <option value="8" ${itemsPerPage === 8 ? 'selected' : ''}>8 items per page</option>
                        <option value="16" ${itemsPerPage === 16 ? 'selected' : ''}>16 items per page</option>
                        <option value="32" ${itemsPerPage === 32 ? 'selected' : ''}>32 items per page</option>
                        <option value="64" ${itemsPerPage === 64 ? 'selected' : ''}>64 items per page</option>
                        <option value="128" ${itemsPerPage === 128 ? 'selected' : ''}>128 items per page</option>
                    </select>
                    <button type="button" data-action="toggle-featured" class="gnome-btn-icon w-auto px-4 h-[38px] text-sm font-semibold gap-2 border border-[#c0bfbc] dark:border-[#3d3846] bg-[#f6f5f4] dark:bg-[#2d2640]">
                        <i class="icon icon-angles-down"></i>
                        Show Featured
                    </button>
                </div>
            `;
            return;
        }

        // Restore the original margin when the section is visible
        featuredSection.classList.remove('mb-2');
        featuredSection.classList.add('mb-12');

        const tabs = [
            { id: 'trending', label: 'Trending' },
            { id: 'popular', label: 'Popular' },
            { id: 'newest', label: 'New' },
            { id: 'updated', label: 'Updated' }
        ];
        
        const tabsHtml = tabs.map(tab => {
            const isActive = tab.id === activeTab;
            return `
                <button type="button" data-featured-tab="${tab.id}" class="gnome-tab-btn ${isActive ? 'active' : ''}">
                    ${this.escapeHtml(tab.label)}
                </button>
            `;
        }).join('');
        
        const controlsHtml = `
            <div class="ml-auto flex items-center gap-3">
                <select data-action="change-items-per-page" class="gnome-select h-[38px]">
                    <option value="8" ${itemsPerPage === 8 ? 'selected' : ''}>8 items per page</option>
                    <option value="16" ${itemsPerPage === 16 ? 'selected' : ''}>16 items per page</option>
                    <option value="32" ${itemsPerPage === 32 ? 'selected' : ''}>32 items per page</option>
                    <option value="64" ${itemsPerPage === 64 ? 'selected' : ''}>64 items per page</option>
                    <option value="128" ${itemsPerPage === 128 ? 'selected' : ''}>128 items per page</option>
                </select>
                <button type="button" data-action="toggle-featured" class="gnome-btn-icon w-auto px-4 h-[38px] text-sm font-semibold gap-2 border border-[#c0bfbc] dark:border-[#3d3846] bg-[#f6f5f4] dark:bg-[#2d2640]" title="Hide Featured">
                    <i class="icon icon-angles-up"></i>
                    Hide
                </button>
            </div>
        `;
        
        const extensionsToShow = featured[activeTab] || [];
        
        featuredSection.innerHTML = `
            <div class="flex flex-col gap-6 animate-fade-in">
                <div class="flex items-center gap-2 overflow-x-auto scrollbar-hide w-full">
                    ${tabsHtml}
                    ${controlsHtml}
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    ${extensionsToShow.map(ext => this.generateCardHTML(ext)).join('')}
                </div>
            </div>
        `;
    }

    renderExtensions(visible, selectedCategory, itemsPerPage, totalItems, layoutMode, isFiltering) {
        const grid = document.getElementById('extensions-grid');
        const emptyState = document.getElementById('empty-state');
        const resultsHeader = document.getElementById('results-header');
        
        if (!grid || !emptyState || !resultsHeader) return;
        
        if (!visible.length) {
            grid.innerHTML = '';
            emptyState.classList.remove('hidden');
            resultsHeader.innerHTML = '';
            return;
        }
        
        emptyState.classList.add('hidden');

        resultsHeader.innerHTML = `
            <div class="animate-fade-in ${isFiltering ? '' : 'hidden'}">
                <h3 class="text-sm font-bold text-gnome-black dark:text-gnome-white">Found ${totalItems} extension${totalItems !== 1 ? 's' : ''}</h3>
                <p class="text-sm text-gnome-grey">Filtered by ${this.escapeHtml(selectedCategory)}</p>
            </div>
            <div class="animate-fade-in flex items-center ml-auto">
                <select data-action="change-items-per-page" class="gnome-select h-[38px]">
                    <option value="8" ${itemsPerPage === 8 ? 'selected' : ''}>8 items per page</option>
                    <option value="16" ${itemsPerPage === 16 ? 'selected' : ''}>16 items per page</option>
                    <option value="32" ${itemsPerPage === 32 ? 'selected' : ''}>32 items per page</option>
                    <option value="64" ${itemsPerPage === 64 ? 'selected' : ''}>64 items per page</option>
                    <option value="128" ${itemsPerPage === 128 ? 'selected' : ''}>128 items per page</option>
                </select>
            </div>
        `;
        
        if (layoutMode === 'row') {
            grid.className = 'flex flex-col gap-3';
            grid.innerHTML = visible.map(ext => this.generateRowHTML(ext)).join('');
        } else {
            grid.className = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4';
            grid.innerHTML = visible.map(ext => this.generateCardHTML(ext)).join('');
        }
    }

    renderPagination(pagination) {
        const container = document.getElementById('pagination-container');
        if (!container) return;
        
        if (!pagination || pagination.totalPages <= 1) {
            container.innerHTML = '';
            return;
        }
        
        let paginationHtml = '';
        
        // Previous page button
        const isPrevDisabled = pagination.currentPage === 1;
        paginationHtml += `
            <button type="button" data-page="${pagination.currentPage - 1}" ${isPrevDisabled ? 'disabled' : ''} class="gnome-page-btn px-3.5" aria-label="Previous page">
                <i class="icon icon-arrow-left"></i>
            </button>
        `;
        
        // Page index buttons
        for (let i = 1; i <= pagination.totalPages; i++) {
            const isCurrent = i === pagination.currentPage;
            paginationHtml += `
                <button type="button" data-page="${i}" class="gnome-page-btn ${isCurrent ? 'active' : ''}" aria-label="Page ${i}">
                    ${i}
                </button>
            `;
        }
        
        // Next page button
        const isNextDisabled = pagination.currentPage === pagination.totalPages;
        paginationHtml += `
            <button type="button" data-page="${pagination.currentPage + 1}" ${isNextDisabled ? 'disabled' : ''} class="gnome-page-btn px-3.5" aria-label="Next page">
                <i class="icon icon-arrow-right"></i>
            </button>
        `;
        
        container.innerHTML = paginationHtml;
    }

    formatDownloads(downloads) {
        if (downloads >= 1000000) {
            return (Math.floor(downloads / 100000) / 10) + 'mln';
        } else if (downloads >= 1000) {
            return (Math.floor(downloads / 100) / 10) + 'k';
        }
        return downloads.toString();
    }
    
    renderIcon(extension) {
        if (!extension.icon) return this.defaultExtensionSvg;

        if (extension.icon.startsWith('http') || extension.icon.startsWith('/')) {
            const safeSvg = this.defaultExtensionSvg.replace(/"/g, '&quot;');
            return `<img src="${this.escapeHtml(extension.icon)}" alt="" class="w-full h-full object-cover" onerror="this.outerHTML='${safeSvg}'">`;
        }
        
        return extension.icon; // Standard inline SVG if passed
    }

    generateRowHTML(extension) {
        return `
            <article class="extension-card group gnome-card-panel p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in" data-extension-id="${extension.id}">
                <div class="flex items-center gap-3 min-w-0 flex-1">
                    <div class="ext-icon-wrapper w-10 h-10">
                        <div class="scale-[0.8] flex items-center justify-center w-full h-full">
                            ${this.renderIcon(extension)}
                        </div>
                    </div>
                    <div class="min-w-0 flex-1 grid grid-cols-1 sm:grid-cols-12 items-center gap-2 sm:gap-4">
                        <div class="col-span-1 sm:col-span-4 lg:col-span-3 min-w-0">
                            <h3 class="font-bold text-sm text-gnome-black dark:text-gnome-white truncate">${this.escapeHtml(extension.name)}</h3>
                            <p class="text-xs text-gnome-grey truncate mt-0.5">${this.escapeHtml(extension.author)}</p>
                        </div>
                        <p class="text-sm line-clamp-2 hidden lg:block lg:col-span-6" title="${this.escapeHtml(extension.description)}">
                            ${this.escapeHtml(extension.description)}
                        </p>
                        <div class="hidden sm:flex col-span-8 lg:col-span-3 items-center justify-end gap-3 shrink-0">
                            <button type="button" data-category-filter="${this.escapeHtml(extension.category)}" class="gnome-badge max-w-[100px] truncate hover:bg-gnome-blue hover:text-white transition-colors cursor-pointer relative z-10">${this.escapeHtml(extension.category)}</button>
                            <div class="text-sm font-semibold text-gnome-blue w-12 text-right"><i class="icon icon-star"></i>  ${extension.rating.toFixed(1)}</div>
                            <div class="text-[10px] uppercase tracking-wider text-gnome-grey w-12 text-right flex items-center justify-end gap-1"><i class="icon icon-download-color"></i>${this.formatDownloads(extension.downloads)}</div>
                        </div>
                    </div>
                </div>
                
                <div class="flex items-center justify-between sm:justify-end gap-4 shrink-0 sm:ml-4 border-t border-[#c0bfbc] sm:border-t-0 dark:border-[#3d3846] pt-3 sm:pt-0 mt-2 sm:mt-0">
                    <div class="flex sm:hidden items-center gap-3">
                        <div class="text-sm font-semibold text-gnome-blue"><i class="icon icon-star"></i>  ${extension.rating.toFixed(1)}</div>
                        <div class="text-[10px] uppercase tracking-wider text-gnome-grey flex items-center gap-1"><i class="icon icon-download-color"></i>${this.formatDownloads(extension.downloads)}</div>
                    </div>
                    <button type="button" class="gnome-btn-icon bg-[#f6f5f4] dark:bg-[#3d3846] sm:bg-transparent sm:dark:bg-transparent group-hover:text-white group-hover:bg-gnome-blue sm:group-hover:bg-gnome-blue transition-colors" title="View details">
                        <i class="icon icon-arrow-right"></i>
                    </button>
                </div>
            </article>
        `;
    }

    generateCardHTML(extension) {
        return `
            <article class="extension-card group gnome-card-panel p-4 flex flex-col justify-between animate-fade-in" data-extension-id="${extension.id}" title="${this.escapeHtml(extension.description)}">
                <div>
                    <div class="flex items-start justify-between gap-3">
                        <div class="flex items-start gap-3 min-w-0">
                            <div class="ext-icon-wrapper h-12 w-12 rounded-2xl">
                                ${this.renderIcon(extension)}
                            </div>
                            <div class="min-w-0">
                                <h3 class="font-bold text-gnome-black dark:text-gnome-white truncate">${this.escapeHtml(extension.name)}</h3>
                                <p class="text-sm text-gnome-grey mt-1 truncate">${this.escapeHtml(extension.author)}</p>
                            </div>
                        </div>
                        <div class="text-right shrink-0">
                            <div class="text-sm font-semibold text-gnome-blue"><i class="icon icon-star"></i>  ${extension.rating.toFixed(1)}</div>
                            <div class="text-[10px] uppercase tracking-wider text-gnome-grey flex items-center justify-end gap-1 mt-0.5"><i class="icon icon-download-color"></i>${this.formatDownloads(extension.downloads)}</div>
                        </div>
                    </div>
                    <p class="text-sm mt-3 line-clamp-3">${this.escapeHtml(extension.description)}</p>
                </div>
                
                <div class="mt-4 flex items-center justify-between pt-4 border-t border-[#c0bfbc] dark:border-[#3d3846]">
                    <button type="button" data-category-filter="${this.escapeHtml(extension.category)}" class="gnome-badge hover:bg-gnome-blue hover:text-white transition-colors cursor-pointer relative z-10">${this.escapeHtml(extension.category)}</button>
                    <button type="button" class="gnome-btn-icon bg-[#f6f5f4] dark:bg-[#3d3846] group-hover:text-white group-hover:bg-gnome-blue transition-colors" title="View details">
                        <i class="icon icon-arrow-right"></i>
                    </button>
                </div>
            </article>
        `;
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

window.StoreView = StoreView;