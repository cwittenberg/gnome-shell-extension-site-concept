class StoreController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        
        this.view.setController(this);
        this.model.addObserver(this.view);
    }

    init(extensions, categories) {
        this.model.setData(extensions, categories);
    }

    handleSearch(term) {
        this.model.setSearchTerm(term);
    }

    handleCategory(category) {
        this.model.setCategory(category);
    }

    handleSort(sortBy) {
        this.model.setSortBy(sortBy);
    }

    handleShellVersion(version) {
        this.model.setShellVersion(version);
    }

    handleFeaturedTab(tab) {
        this.model.setFeaturedTab(tab);
    }

    handlePageChange(page) {
        this.model.setPage(page);
    }

    handleItemsPerPage(limit) {
        this.model.setItemsPerPage(limit);
    }

    handleToggleFeatured() {
        this.model.toggleFeatured();
    }

    handleLayoutMode(mode) {
        if (this.model && typeof this.model.setLayoutMode === 'function') {
            this.model.setLayoutMode(mode);
        } else {
            console.warn('StoreModel is missing setLayoutMode. Please verify mvc/models/StoreModel.js is updated.');
        }
    }

    handleReset() {
        if (this.model && typeof this.model.resetFilters === 'function') {
            this.model.resetFilters();
        }
    }

    handleOpenExtension(id) {
        // Hooks into the main app.js routing handling
        if (window.openExtensionHandler) {
            window.openExtensionHandler(id);
        }
    }
}

window.StoreController = StoreController;