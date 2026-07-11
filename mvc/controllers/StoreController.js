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

    handleOpenExtension(id) {
        // Hooks into the main app.js routing handling
        if (window.openExtensionHandler) {
            window.openExtensionHandler(id);
        }
    }
}

window.StoreController = StoreController;