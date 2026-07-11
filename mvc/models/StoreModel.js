// GoF Pattern: Observer (Subject Participant)
class StoreModel {
    constructor() {
        this.observers = [];
        this.extensions = [];
        this.categories = [];
        
        this.state = {
            selectedCategory: 'All',
            sortBy: 'downloads',
            searchTerm: ''
        };
    }

    addObserver(observer) {
        this.observers.push(observer);
    }

    removeObserver(observer) {
        this.observers = this.observers.filter(obs => obs !== observer);
    }

    notifyObservers() {
        const data = {
            state: this.state,
            categories: this.categories,
            featured: this.extensions.filter(e => e.featured).slice(0, 4),
            filtered: this.getFilteredExtensions()
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
        this.notifyObservers();
    }

    setCategory(category) {
        this.state.selectedCategory = category;
        this.notifyObservers();
    }

    setSortBy(sortBy) {
        this.state.sortBy = sortBy;
        this.notifyObservers();
    }

    getFilteredExtensions() {
        return this.extensions.filter((extension) => {
            const matchesCategory = this.state.selectedCategory === 'All' || extension.category === this.state.selectedCategory;
            const matchesSearch = !this.state.searchTerm || [extension.name, extension.author, extension.description, extension.category].join(' ').toLowerCase().includes(this.state.searchTerm);
            return matchesCategory && matchesSearch;
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