class NavigationController {
    constructor(view) {
        this.view = view;

        // Bind DOM events to controller handlers
        this.view.bindNavClicks(this.handleNavClick.bind(this));
        this.view.bindLogoClick(this.handleLogoClick.bind(this));
        
        // Initialize UI observers
        this.view.observeCategoryChanges();
    }

    handleNavClick(targetNav) {
        this.view.setActiveNav(targetNav);
    }

    handleLogoClick() {
        this.view.setActiveNav('store');
    }
}

// Auto-initialize global UI Logic once the DOM is assembled
document.addEventListener('DOMContentLoaded', () => {
    const navView = new NavigationView();
    const navController = new NavigationController(navView);
});