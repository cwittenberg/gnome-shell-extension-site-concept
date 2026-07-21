class NavigationView {
    constructor() {
        this.navLinks = document.querySelectorAll('.gnome-nav-link');
        this.logo = document.querySelector('.logo');
        this.categoryContainer = document.getElementById('categories-container');
    }

    bindNavClicks(handler) {
        document.addEventListener('click', (e) => {
            const navEl = e.target.closest('[data-nav]');
            if (navEl) {
                handler(navEl.getAttribute('data-nav'));
            }
        });
    }

    bindLogoClick(handler) {
        if (this.logo) {
            this.logo.addEventListener('click', () => handler('store'));
        }
    }

    setActiveNav(targetNav) {
        this.navLinks.forEach(n => n.classList.remove('active'));
        document.querySelectorAll(`.gnome-nav-link[data-nav="${targetNav}"]`).forEach(n => n.classList.add('active'));
    }

    observeCategoryChanges() {
        if (!this.categoryContainer) return;
        
        const observer = new MutationObserver((mutations) => {
            for (let mutation of mutations) {
                // Handle direct class updates to existing children
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    if (mutation.target.classList && mutation.target.classList.contains('active')) {
                        this.scrollToActiveCategory(mutation.target);
                    }
                } 
                // Handle new active children being freshly injected into the DOM
                else if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1) { // Node.ELEMENT_NODE
                            if (node.classList.contains('active')) {
                                this.scrollToActiveCategory(node);
                            } else {
                                const activeChild = node.querySelector?.('.active');
                                if (activeChild) {
                                    this.scrollToActiveCategory(activeChild);
                                }
                            }
                        }
                    });
                }
            }
        });
        
        observer.observe(this.categoryContainer, {
            attributes: true,
            childList: true,
            subtree: true,
            attributeFilter: ['class']
        });
    }

    scrollToActiveCategory(activeItem) {
        // Stop execution if mobile view (Tailwind 'sm' breakpoint is 640px)
        if (window.innerWidth < 640 || !this.categoryContainer) return;

        const containerRect = this.categoryContainer.getBoundingClientRect();
        const itemRect = activeItem.getBoundingClientRect();

        // Check if the pill is partially or fully out of the parent's viewing bounds
        const isFullyVisible = (itemRect.left >= containerRect.left) && (itemRect.right <= containerRect.right);

        if (!isFullyVisible) {
            // Delta calculated to place the active pill dead center of the category bar
            const scrollAmount = (itemRect.left - containerRect.left) - (containerRect.width / 2) + (itemRect.width / 2);
            
            this.categoryContainer.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        }
    }
}