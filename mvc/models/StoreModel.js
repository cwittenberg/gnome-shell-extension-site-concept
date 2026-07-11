// GoF Pattern: Observer (Subject Participant)
class StoreModel {
    constructor() {
        this.observers = [];
        this.extensions = [];
        this.categories = [];
        
        this.state = {
            selectedCategory: 'All',
            sortBy: 'downloads',
            searchTerm: '',
            featuredTab: 'trending'
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

    setFeaturedTab(tab) {
        this.state.featuredTab = tab;
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