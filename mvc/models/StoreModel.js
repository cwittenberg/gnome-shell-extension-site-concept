// GoF Pattern: Observer (Subject Participant)
class StoreModel {
    constructor() {
        this.observers = [];
        this.extensions = [];
        this.categories = [];
        
        // Persist layout mode preference across reloads
        const savedLayout = localStorage.getItem('gnome_ext_layout') || 'grid';
        
        this.state = {
            selectedCategory: 'All',
            sortBy: 'downloads',
            shellVersion: 'all',
            searchTerm: '',
            featuredTab: 'trending',
            currentPage: 1,
            itemsPerPage: 8,
            isFeaturedHidden: false,
            layoutMode: savedLayout
        };
    }

    addObserver(observer) {
        this.observers.push(observer);
    }

    removeObserver(observer) {
        this.observers = this.observers.filter(obs => obs !== observer);
    }

    notifyObservers() {
        const allExtensions = [...this.extensions];
        const filtered = this.getFilteredExtensions();
        const totalItems = filtered.length;
        const totalPages = Math.ceil(totalItems / this.state.itemsPerPage) || 1;
        
        if (this.state.currentPage > totalPages) {
            this.state.currentPage = totalPages;
        }
        
        const startIndex = (this.state.currentPage - 1) * this.state.itemsPerPage;
        const paginatedExtensions = filtered.slice(startIndex, startIndex + this.state.itemsPerPage);
        
        const data = {
            state: this.state,
            categories: this.categories,
            // Pre-process sorted categories for the Featured tab view
            featured: {
                trending: [...allExtensions].sort((a, b) => b.ratingCount - a.ratingCount).slice(0, 4),
                popular: [...allExtensions].sort((a, b) => b.downloads - a.downloads).slice(0, 4),
                newest: [...allExtensions].sort((a, b) => (b.new ? 1 : 0) - (a.new ? 1 : 0)).slice(0, 4),
                updated: [...allExtensions].sort((a, b) => b.version - a.version).slice(0, 4)
            },
            filtered: paginatedExtensions,
            pagination: {
                currentPage: this.state.currentPage,
                totalPages: totalPages,
                totalItems: totalItems
            }
        };
        
        for (const observer of this.observers) {
            observer.update(data);
        }
    }

    setData(extensions, categories) {
        this.extensions = extensions;
        this.categories = categories;
        this.notifyObservers();
    }

    setSearchTerm(term) {
        this.state.searchTerm = term.toLowerCase();
        this.state.currentPage = 1;
        this.notifyObservers();
    }

    setCategory(category) {
        this.state.selectedCategory = category;
        this.state.currentPage = 1;
        this.notifyObservers();
    }

    setSortBy(sortBy) {
        this.state.sortBy = sortBy;
        this.state.currentPage = 1;
        this.notifyObservers();
    }

    setShellVersion(version) {
        this.state.shellVersion = version;
        this.state.currentPage = 1;
        this.notifyObservers();
    }

    setFeaturedTab(tab) {
        this.state.featuredTab = tab;
        this.notifyObservers();
    }

    setPage(page) {
        this.state.currentPage = page;
        this.notifyObservers();
    }

    setItemsPerPage(limit) {
        this.state.itemsPerPage = parseInt(limit, 10);
        this.state.currentPage = 1;
        this.notifyObservers();
    }

    toggleFeatured() {
        this.state.isFeaturedHidden = !this.state.isFeaturedHidden;
        this.notifyObservers();
    }

    setLayoutMode(mode) {
        this.state.layoutMode = mode;
        localStorage.setItem('gnome_ext_layout', mode);
        this.notifyObservers();
    }

    resetFilters() {
        this.state.selectedCategory = 'All';
        this.state.sortBy = 'downloads';
        this.state.shellVersion = 'all';
        this.state.searchTerm = '';
        this.state.currentPage = 1;
        this.state.featuredTab = 'trending';
        this.notifyObservers();
    }

    getFilteredExtensions() {
        return this.extensions.filter((extension) => {
            const matchesCategory = this.state.selectedCategory === 'All' || extension.category === this.state.selectedCategory;
            const matchesSearch = !this.state.searchTerm || [extension.name, extension.author, extension.description, extension.category].join(' ').toLowerCase().includes(this.state.searchTerm);
            
            let matchesVersion = true;
            if (this.state.shellVersion !== 'all') {
                const versionStr = this.state.shellVersion;
                const extText = JSON.stringify(extension).toLowerCase();
                matchesVersion = extText.includes('gnome ' + versionStr) || extText.includes('gnome' + versionStr) || extText.includes('gnome shell ' + versionStr);
            }

            return matchesCategory && matchesSearch && matchesVersion;
        }).sort((a, b) => {
            switch (this.state.sortBy) {
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
}

window.StoreModel = StoreModel;