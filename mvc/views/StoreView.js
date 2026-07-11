// GoF Pattern: Observer (Observer Participant)
class StoreView {
    constructor() {
        this.controller = null;
        this.defaultExtensionSvg = `<i class="fa-solid fa-puzzle-piece text-4xl"></i>`;
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

    bindEvents() {
        const searchInput = document.getElementById('search-input');
        const sortSelect = document.getElementById('sort-select');
        
        if (searchInput) {
            searchInput.addEventListener('input', (event) => {
                if (this.controller) this.controller.handleSearch(event.target.value.trim());
            });
        }
        
        if (sortSelect) {
            sortSelect.addEventListener('change', (event) => {
                if (this.controller) this.controller.handleSort(event.target.value);
            });
        }
        
        // 1. Categories Container Events
        const categoriesContainer = document.getElementById('categories-container');
        if (categoriesContainer) {
            categoriesContainer.addEventListener('click', (event) => {
                const categoryBtn = event.target.closest('[data-category]');
                if (categoryBtn && this.controller) {
                    this.controller.handleCategory(categoryBtn.getAttribute('data-category'));
                }
            });
        }

        // 2. Featured Section Events
        const featuredSection = document.getElementById('featured-section');
        if (featuredSection) {
            featuredSection.addEventListener('click', (event) => {
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
                        window.scrollTo({ top: document.getElementById('main-divider').offsetTop - 80, behavior: 'smooth' });
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
        this.renderCategories(data.categories, data.state.selectedCategory);
        this.renderFeatured(data.featured, data.state.featuredTab, data.state.isFeaturedHidden, data.state.itemsPerPage);
        this.renderExtensions(data.filtered, data.state.selectedCategory, data.state.itemsPerPage, data.pagination.totalItems);
        this.renderPagination(data.pagination);
        
        const isFiltering = data.state.selectedCategory !== 'All' || data.state.searchTerm.trim() !== '';
        
        // Element Hooks
        const heroSection = document.getElementById('hero-section');
        const heroContent = document.getElementById('hero-content');
        const featuredSection = document.getElementById('featured-section');
        const mainDivider = document.getElementById('main-divider');
        const resultsHeader = document.getElementById('results-header');
        
        // Smooth Auto-hide Hero section logic
        if (heroSection && heroContent) {
            if (isFiltering) {
                heroSection.classList.add('hero-hidden');
                heroContent.classList.add('opacity-0', 'scale-95');
            } else {
                heroSection.classList.remove('hero-hidden');
                heroContent.classList.remove('opacity-0', 'scale-95');
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

    renderCategories(categories, selectedCategory) {
        const container = document.getElementById('categories-container');
        if (!container) return;
        
        const buttons = categories.map((category) => {
            const active = category === selectedCategory;
            return `
                <button
                    type="button"
                    data-category="${this.escapeHtml(category)}"
                    class="px-4 py-1.5 rounded-lg text-sm font-semibold transition-all whitespace-nowrap flex-shrink-0 ${active ? 'bg-gnome-blue text-white shadow-sm' : 'text-[#5e5c64] dark:text-[#c0bfbc] hover:bg-[#deddda] dark:hover:bg-[#3d3846]'}"
                >
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
                    <select data-action="change-items-per-page" class="text-sm font-semibold text-[#5e5c64] bg-[#f6f5f4] border-[#c0bfbc] dark:text-[#c0bfbc] dark:bg-[#2d2640] dark:border-[#3d3846] border rounded-xl px-3 py-1.5 shadow-sm hover:border-gnome-blue transition-all focus:outline-none focus:border-gnome-blue cursor-pointer h-[38px]">
                        <option value="8" ${itemsPerPage === 8 ? 'selected' : ''}>8 items per page</option>
                        <option value="32" ${itemsPerPage === 32 ? 'selected' : ''}>32 items per page</option>
                        <option value="64" ${itemsPerPage === 64 ? 'selected' : ''}>64 items per page</option>
                        <option value="128" ${itemsPerPage === 128 ? 'selected' : ''}>128 items per page</option>
                    </select>
                    <button type="button" data-action="toggle-featured" class="text-sm font-semibold text-gnome-grey hover:text-gnome-blue transition-colors flex items-center gap-2 bg-[#f6f5f4] dark:bg-[#2d2640] px-4 py-1.5 rounded-xl border border-[#c0bfbc] dark:border-[#3d3846] shadow-sm h-[38px]">
                        <i class="fa-solid fa-chevron-down"></i>
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
                <button type="button" data-featured-tab="${tab.id}" class="px-5 py-1.5 rounded-full text-sm font-bold transition-all ${isActive ? 'bg-gnome-blue text-white shadow-sm scale-105' : 'bg-transparent text-[#5e5c64] dark:text-[#c0bfbc] hover:bg-[#deddda] dark:hover:bg-[#3d3846] hover:text-gnome-black dark:hover:text-gnome-white'}">
                    ${this.escapeHtml(tab.label)}
                </button>
            `;
        }).join('');
        
        const controlsHtml = `
            <div class="ml-auto flex items-center gap-3">
                <select data-action="change-items-per-page" class="text-sm font-semibold text-[#5e5c64] bg-[#f6f5f4] border-[#c0bfbc] dark:text-[#c0bfbc] dark:bg-[#2d2640] dark:border-[#3d3846] border rounded-xl px-3 py-1.5 shadow-sm hover:border-gnome-blue transition-all focus:outline-none focus:border-gnome-blue cursor-pointer h-[38px]">
                    <option value="8" ${itemsPerPage === 8 ? 'selected' : ''}>8 items per page</option>
                    <option value="32" ${itemsPerPage === 32 ? 'selected' : ''}>32 items per page</option>
                    <option value="64" ${itemsPerPage === 64 ? 'selected' : ''}>64 items per page</option>
                    <option value="128" ${itemsPerPage === 128 ? 'selected' : ''}>128 items per page</option>
                </select>
                <button type="button" data-action="toggle-featured" class="text-sm font-semibold text-gnome-grey hover:text-gnome-blue transition-colors flex items-center gap-2 bg-[#f6f5f4] dark:bg-[#2d2640] px-4 py-1.5 rounded-xl border border-[#c0bfbc] dark:border-[#3d3846] shadow-sm h-[38px]" title="Hide Featured">
                    <i class="fa-solid fa-chevron-up"></i>
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

    renderExtensions(visible, selectedCategory, itemsPerPage, totalItems) {
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
            <div class="animate-fade-in">
                <h3 class="text-sm font-bold text-gnome-black dark:text-gnome-white">Found ${totalItems} extension${totalItems !== 1 ? 's' : ''}</h3>
                <p class="text-sm text-gnome-grey">Filtered by ${this.escapeHtml(selectedCategory)}</p>
            </div>
            <div class="animate-fade-in flex items-center">
                <select data-action="change-items-per-page" class="text-sm font-semibold text-[#5e5c64] bg-[#f6f5f4] border-[#c0bfbc] dark:text-[#c0bfbc] dark:bg-[#2d2640] dark:border-[#3d3846] border rounded-xl px-3 py-1.5 shadow-sm hover:border-gnome-blue transition-all focus:outline-none focus:border-gnome-blue cursor-pointer h-[38px]">
                    <option value="8" ${itemsPerPage === 8 ? 'selected' : ''}>8 items per page</option>
                    <option value="32" ${itemsPerPage === 32 ? 'selected' : ''}>32 items per page</option>
                    <option value="64" ${itemsPerPage === 64 ? 'selected' : ''}>64 items per page</option>
                    <option value="128" ${itemsPerPage === 128 ? 'selected' : ''}>128 items per page</option>
                </select>
            </div>
        `;
        
        grid.innerHTML = visible.map(ext => this.generateCardHTML(ext)).join('');
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
            <button type="button" data-page="${pagination.currentPage - 1}" ${isPrevDisabled ? 'disabled' : ''} class="px-3.5 py-2 rounded-xl text-sm font-semibold transition-all border border-[#c0bfbc] dark:border-[#3d3846] ${isPrevDisabled ? 'opacity-30 cursor-not-allowed' : 'text-gnome-black dark:text-gnome-white hover:bg-[#deddda] dark:hover:bg-[#3d3846]'}" aria-label="Previous page">
                <i class="fa-solid fa-chevron-left"></i>
            </button>
        `;
        
        // Page index buttons
        for (let i = 1; i <= pagination.totalPages; i++) {
            const isCurrent = i === pagination.currentPage;
            paginationHtml += `
                <button type="button" data-page="${i}" class="px-4 py-2 rounded-xl text-sm font-bold transition-all ${isCurrent ? 'bg-gnome-blue text-white shadow-md scale-105' : 'border border-[#c0bfbc] dark:border-[#3d3846] text-[#5e5c64] dark:text-[#c0bfbc] hover:bg-[#deddda] dark:hover:bg-[#3d3846]'}" aria-label="Page ${i}">
                    ${i}
                </button>
            `;
        }
        
        // Next page button
        const isNextDisabled = pagination.currentPage === pagination.totalPages;
        paginationHtml += `
            <button type="button" data-page="${pagination.currentPage + 1}" ${isNextDisabled ? 'disabled' : ''} class="px-3.5 py-2 rounded-xl text-sm font-semibold transition-all border border-[#c0bfbc] dark:border-[#3d3846] ${isNextDisabled ? 'opacity-30 cursor-not-allowed' : 'text-gnome-black dark:text-gnome-white hover:bg-[#deddda] dark:hover:bg-[#3d3846]'}" aria-label="Next page">
                <i class="fa-solid fa-chevron-right"></i>
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

    generateCardHTML(extension) {
        return `
            <article class="extension-card bg-gnome-white dark:bg-[#2d2640] border border-[#c0bfbc] dark:border-[#3d3846] rounded-2xl p-4 shadow-md cursor-pointer hover:border-gnome-blue transition-all duration-300 flex flex-col justify-between animate-fade-in" data-extension-id="${extension.id}">
                <div>
                    <div class="flex items-start justify-between gap-3">
                        <div class="flex items-start gap-3 min-w-0">
                            <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#f6f5f4] dark:bg-[#241F31]">
                                ${extension.icon || this.defaultExtensionSvg}
                            </div>
                            <div class="min-w-0">
                                <h3 class="font-bold text-gnome-black dark:text-gnome-white truncate">${this.escapeHtml(extension.name)}</h3>
                                <p class="text-sm text-gnome-grey mt-1 truncate">${this.escapeHtml(extension.author)}</p>
                            </div>
                        </div>
                        <div class="text-right shrink-0">
                            <div class="text-sm font-semibold text-gnome-blue">★ ${extension.rating.toFixed(1)}</div>
                            <div class="text-[10px] uppercase tracking-wider text-gnome-grey">${this.formatDownloads(extension.downloads)}</div>
                        </div>
                    </div>
                    <p class="text-sm text-[#5e5c64] dark:text-[#c0bfbc] mt-3 line-clamp-3">${this.escapeHtml(extension.description)}</p>
                </div>
                
                <div class="mt-4 flex items-center justify-between pt-4 border-t border-[#c0bfbc] dark:border-[#3d3846]">
                    <span class="text-xs font-semibold bg-[#f6f5f4] dark:bg-[#3d3846] text-gnome-grey px-2.5 py-1 rounded-full">${this.escapeHtml(extension.category)}</span>
                    <button type="button" class="text-sm font-semibold text-gnome-blue hover:underline">View details</button>
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