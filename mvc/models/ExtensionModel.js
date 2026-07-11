// GoF Pattern: Observer (Subject Participant)
class ExtensionModel {
    constructor() {
        this.selectedExtension = null;
        this.observers = [];
    }

    addObserver(observer) {
        this.observers.push(observer);
    }

    removeObserver(observer) {
        this.observers = this.observers.filter(obs => obs !== observer);
    }

    notifyObservers() {
        for (const observer of this.observers) {
            observer.update(this.selectedExtension);
        }
    }

    setExtension(extension) {
        this.selectedExtension = extension;
        this.notifyObservers();
    }

    getExtension() {
        return this.selectedExtension;
    }
}

window.ExtensionModel = ExtensionModel;