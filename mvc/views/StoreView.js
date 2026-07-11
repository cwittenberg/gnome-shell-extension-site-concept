// GoF Pattern: Observer (Observer Participant)
class StoreView {
    constructor() {
        this.controller = null;
        this.defaultExtensionSvg = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-8 h-8">
                <path d="M16 11V7a2 2 0 00-2-2h-1V3.5a2.5 2.5 0 00-5 0V5H7a2 2 0 00-2 2v1H3.5a2.5 2.5 0 000 5H5v3a2 2 0 002 2h1v1.5a2.5 2.5 0 005 0V19h3a2 2 0 002-2v-1h1.5a2.5 2.5 0 000-5H16z" />
            </svg>`;
        this.bindEvents();
        this.bindScrollEvents();
    }
    setController(controller) {
        this.controller = controller;
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
        
        // Global Event Delegation for dynamic structural components
        document.body.addEventListener('click', (event) => {
            // Toggle Featured Section
            const toggleFeaturedBtn = event.target.closest('[data-action="toggle-featured"]');
            if (toggleFeaturedBtn && this.controller) {
                event.preventDefault();
                this.controller.handleToggleFeatured();
                return;
            }
            
            // Pill Categories Filter
            const categoryBtn = event.target.closest('[data-category]');
            if (categoryBtn && this.controller) {
                this.controller.handleCategory(categoryBtn.getAttribute('data-category'));
            }
            
            // Featured Tabs Pill Buttons
            const featuredTabBtn = event.target.closest('[data-featured-tab]');
            if (featuredTabBtn && this.controller) {
                event.preventDefault();
                this.controller.handleFeaturedTab(featuredTabBtn.getAttribute('data-featured-tab'));
            }
            
            // Pagination Click Triggers
            const pageBtn = event.target.closest('[data-page]');
            if (pageBtn && this.controller) {
                event.preventDefault();
                const pageNum = parseInt(pageBtn.getAttribute('data-page'), 10);
                if (!isNaN(pageNum)) {
                    this.controller.handlePageChange(pageNum);
                    window.scrollTo({ top: document.getElementById('main-divider').offsetTop - 80, behavior: 'smooth' });
                }
            }
            
            // General Extension Cards Open Details
            const card = event.target.closest('[data-extension-id]');
            if (card && this.controller) {
                // Ensure clicks on pagination elements inside body don't misfire card detail views
                if (event.target.closest('#pagination-container') || event.target.closest('#featured-section button')) return;
                
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
        });
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
        this.renderFeatured(data.featured, data.state.featuredTab, data.state.isFeaturedHidden);
        this.renderExtensions(data.filtered, data.state.selectedCategory);
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
    renderFeatured(featured, activeTab, isHidden) {
        const featuredSection = document.getElementById('featured-section');
        if (!featuredSection) return;
        
        if (isHidden) {
            // Remove the large bottom margin when hidden so the gap isn't huge
            featuredSection.classList.remove('mb-12');
            featuredSection.classList.add('mb-2');
            
            featuredSection.innerHTML = `
                <div class="flex justify-end animate-fade-in">
                    <button type="button" data-action="toggle-featured" class="text-sm font-semibold text-gnome-grey hover:text-gnome-blue transition-colors flex items-center gap-2 bg-[#f6f5f4] dark:bg-[#2d2640] px-4 py-2 rounded-xl border border-[#c0bfbc] dark:border-[#3d3846] shadow-sm">
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
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
        
        const hideBtnHtml = `
            <button type="button" data-action="toggle-featured" class="ml-auto text-sm font-semibold text-gnome-grey hover:text-gnome-blue transition-colors flex items-center gap-1 px-3 py-1.5 rounded-full hover:bg-[#deddda] dark:hover:bg-[#3d3846]" title="Hide Featured">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" /></svg>
                Hide
            </button>
        `;
        
        const extensionsToShow = featured[activeTab] || [];
        
        featuredSection.innerHTML = `
            <div class="flex flex-col gap-6 animate-fade-in">
                <div class="flex items-center gap-2 overflow-x-auto scrollbar-hide w-full">
                    ${tabsHtml}
                    ${hideBtnHtml}
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    ${extensionsToShow.map(ext => this.generateCardHTML(ext)).join('')}
                </div>
            </div>
        `;
    }
    renderExtensions(visible, selectedCategory) {
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
                <h3 class="text-sm font-bold text-gnome-black dark:text-gnome-white">Showing extensions ${visible.length}</h3>
                <p class="text-sm text-gnome-grey">Filtered by ${this.escapeHtml(selectedCategory)}</p>
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
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
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
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
            </button>
        `;
        
        container.innerHTML = paginationHtml;
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
                            <div class="text-sm font-semibold text-gnome-blue">  ${extension.rating.toFixed(1)}</div>
                            <div class="text-[10px] uppercase tracking-wider text-gnome-grey">${extension.downloads.toLocaleString()} dls</div>
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