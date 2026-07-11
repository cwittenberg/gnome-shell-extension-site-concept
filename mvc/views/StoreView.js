// GoF Pattern: Observer (Observer Participant)
class StoreView {
    constructor() {
        this.controller = null;
        this.defaultExtensionSvg = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-8 h-8">
                <path d="M16 11V7a2 2 0 00-2-2h-1V3.5a2.5 2.5 0 00-5 0V5H7a2 2 0 00-2 2v1H3.5a2.5 2.5 0 000 5H5v3a2 2 0 002 2h1v1.5a2.5 2.5 0 005 0V19h3a2 2 0 002-2v-1h1.5a2.5 2.5 0 000-5H16z" />
            </svg>`;
        this.bindEvents();
    }

    setController(controller) {
        this.controller = controller;
    }

    bindEvents() {
        const searchInput = document.getElementById('search-input');
        const sortSelect = document.getElementById('sort-select');
        const categoriesContainer = document.getElementById('categories-container');
        const featuredGrid = document.getElementById('featured-grid');
        const extensionsGrid = document.getElementById('extensions-grid');

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

        if (categoriesContainer) {
            categoriesContainer.addEventListener('click', (event) => {
                const button = event.target.closest('[data-category]');
                if (!button) return;
                if (this.controller) this.controller.handleCategory(button.getAttribute('data-category'));
            });
        }

        // Delegate extension card clicks
        if (featuredGrid) {
            featuredGrid.addEventListener('click', (event) => {
                const card = event.target.closest('[data-extension-id]');
                if (card && this.controller) this.controller.handleOpenExtension(card.getAttribute('data-extension-id'));
            });
        }

        if (extensionsGrid) {
            extensionsGrid.addEventListener('click', (event) => {
                const card = event.target.closest('[data-extension-id]');
                if (card && this.controller) this.controller.handleOpenExtension(card.getAttribute('data-extension-id'));
            });
        }
    }

    update(data) {
        this.renderCategories(data.categories, data.state.selectedCategory);
        this.renderFeatured(data.featured);
        this.renderExtensions(data.filtered, data.state.selectedCategory);
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
                    class="px-3 py-1.5 rounded-full text-sm font-semibold transition-all ${active ? 'bg-gnome-blue text-white' : 'bg-gnome-white dark:bg-[#2d2640] text-[#5e5c64] dark:text-[#c0bfbc] border border-[#deddda] dark:border-[#3d3846]'}"
                >
                    ${this.escapeHtml(category)}
                </button>
            `;
        }).join('');
        container.innerHTML = buttons;
    }

    renderFeatured(featured) {
        const featuredGrid = document.getElementById('featured-grid');
        if (!featuredGrid) return;

        featuredGrid.innerHTML = featured.map((extension) => `
            <article class="extension-card bg-gnome-white dark:bg-[#2d2640] border border-[#deddda] dark:border-[#3d3846] rounded-2xl p-4 shadow-sm cursor-pointer hover:border-gnome-blue transition-all" data-extension-id="${extension.id}">
                <div class="flex items-start justify-between gap-3">
                    <div class="flex items-start gap-3 min-w-0">
                        <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#f6f5f4] dark:bg-[#241F31]">
                            ${extension.icon || this.defaultExtensionSvg}
                        </div>
                        <div>
                            <h3 class="font-bold text-gnome-black dark:text-gnome-white">${this.escapeHtml(extension.name)}</h3>
                            <p class="text-sm text-gnome-grey mt-1">${this.escapeHtml(extension.author)}</p>
                        </div>
                    </div>
                    <span class="text-xs font-semibold bg-gnome-blue/10 text-gnome-blue px-2.5 py-1 rounded-full">Featured</span>
                </div>
                <p class="text-sm text-[#5e5c64] dark:text-[#c0bfbc] mt-3">${this.escapeHtml(extension.description)}</p>
            </article>
        `).join('');
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
            <div>
                <h3 class="text-sm font-bold text-gnome-black dark:text-gnome-white">${visible.length} extensions</h3>
                <p class="text-sm text-gnome-grey">Filtered by ${this.escapeHtml(selectedCategory)}</p>
            </div>
        `;

        grid.innerHTML = visible.map((extension) => `
            <article class="extension-card bg-gnome-white dark:bg-[#2d2640] border border-[#deddda] dark:border-[#3d3846] rounded-2xl p-4 shadow-sm cursor-pointer hover:border-gnome-blue transition-all flex flex-col justify-between" data-extension-id="${extension.id}">
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
                            <div class="text-xs text-gnome-grey">${extension.downloads.toLocaleString()} dls</div>
                        </div>
                    </div>
                    <p class="text-sm text-[#5e5c64] dark:text-[#c0bfbc] mt-3 line-clamp-3">${this.escapeHtml(extension.description)}</p>
                </div>
                <div class="mt-4 flex items-center justify-between pt-4 border-t border-[#deddda] dark:border-[#3d3846]">
                    <span class="text-xs font-semibold bg-[#f6f5f4] dark:bg-[#3d3846] text-gnome-grey px-2.5 py-1 rounded-full">${this.escapeHtml(extension.category)}</span>
                    <button type="button" class="text-sm font-semibold text-gnome-blue hover:underline">View details</button>
                </div>
            </article>
        `).join('');
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