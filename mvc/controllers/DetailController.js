class DetailController {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        // Register View as observer of the Model
        this.model.addObserver(this.view);
    }

    openExtension(extensionId, extensionsData) {
        const extension = extensionsData.find((ext) => String(ext.id) === String(extensionId)) || extensionsData[0];
        this.model.setExtension(extension);
    }

    clearExtension() {
        this.model.setExtension(null);
    }
}

window.DetailController = DetailController;