(function () {
    let detailController;
    let storeController;

    function init() {
        // Initialize static views and generate their HTML
        const uploadView = new window.UploadView();
        uploadView.render();
        const localView = new window.LocalView();
        localView.render();
        const aboutView = new window.AboutView();
        aboutView.render();

        // Initialize Extension Detail MVC
        const detailModel = new window.ExtensionModel();
        const detailView = new window.DetailView();
        detailController = new window.DetailController(detailModel, detailView);
        
        // Initialize Store Overview MVC
        const storeModel = new window.StoreModel();
        const storeView = new window.StoreView();
        storeController = new window.StoreController(storeModel, storeView);
        
        // Setup global callbacks & hooks
        window.openExtensionHandler = openExtension;
        window.closeExtension = closeExtension;
        
        bindGlobalEvents();
        
        // Populate the Store
        const extData = typeof EXTENSIONS !== 'undefined' ? EXTENSIONS : [];
        const catData = typeof CATEGORIES !== 'undefined' ? CATEGORIES : [];
        storeController.init(extData, catData);
    }

    function bindGlobalEvents() {
        const mobileMenuButton = document.getElementById('mobile-menu-btn');
        const themeToggle = document.getElementById('theme-toggle');
        const themeToggleMobile = document.getElementById('theme-toggle-mobile');

        if (mobileMenuButton) {
            mobileMenuButton.addEventListener('click', () => {
                const mobileMenu = document.getElementById('mobile-menu');
                if (mobileMenu) {
                    const isHidden = mobileMenu.classList.toggle('hidden');
                    mobileMenuButton.setAttribute('aria-expanded', String(!isHidden));
                }
            });
        }

        [themeToggle, themeToggleMobile].forEach((button) => {
            if (button) {
                button.addEventListener('click', toggleTheme);
            }
        });

        document.querySelectorAll('a[data-nav]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const view = e.currentTarget.getAttribute('data-nav');
                
                if (view === 'store') {
                    closeExtension();
                } else {
                    detailController.clearExtension();
                    showView(view);
                }
                
                const mobileMenu = document.getElementById('mobile-menu');
                const mobileMenuButton = document.getElementById('mobile-menu-btn');
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                    mobileMenuButton.setAttribute('aria-expanded', 'false');
                }
            });
        });

        // Handle Scroll to Top Button Visibility
        window.addEventListener('scroll', () => {
            const scrollTopBtn = document.getElementById('scroll-to-top-btn');
            if (scrollTopBtn) {
                const detailsView = document.getElementById('details-view');
                // Show when details view is open and we scrolled down past 300px
                if (detailsView && !detailsView.classList.contains('hidden') && window.scrollY > 300) {
                    scrollTopBtn.classList.remove('scale-0', 'opacity-0');
                    scrollTopBtn.classList.add('scale-100', 'opacity-100');
                } else {
                    scrollTopBtn.classList.add('scale-0', 'opacity-0');
                    scrollTopBtn.classList.remove('scale-100', 'opacity-100');
                }
            }
        });
    }

    function toggleTheme() {
        document.documentElement.classList.toggle('dark');
    }

    function openExtension(extensionId) {
        showView('details');
        
        const extData = typeof EXTENSIONS !== 'undefined' ? EXTENSIONS : [];
        detailController.openExtension(extensionId, extData);
        window.scrollTo(0, 0);
    }

    function closeExtension() {
        detailController.clearExtension();
        if (storeController && typeof storeController.handleReset === 'function') {
            storeController.handleReset();
        }
        showView('store');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function showView(view) {
        const views = ['store', 'details', 'upload', 'local', 'about'];
        views.forEach(v => {
            const el = document.getElementById(`${v}-view`);
            if (el) {
                if (v === view) {
                    el.classList.remove('hidden');
                } else {
                    el.classList.add('hidden');
                    el.classList.remove('block'); 
                }
            }
        });

        document.querySelectorAll('nav a[data-nav], #mobile-menu a[data-nav]').forEach(link => {
            const navTarget = link.getAttribute('data-nav');
            // If we are showing 'details', keep the 'store' (Extensions) navigation item active
            const isActive = navTarget === view || (view === 'details' && navTarget === 'store');
            
            if (isActive) {
                link.classList.add('bg-[#f6f5f4]', 'dark:bg-[#2d2640]', 'text-gnome-black', 'dark:text-gnome-white');
                link.classList.remove('text-[#5e5c64]', 'dark:text-[#c0bfbc]', 'hover:bg-[#f6f5f4]', 'dark:hover:bg-[#2d2640]');
            } else {
                link.classList.remove('bg-[#f6f5f4]', 'dark:bg-[#2d2640]', 'text-gnome-black', 'dark:text-gnome-white');
                link.classList.add('text-[#5e5c64]', 'dark:text-[#c0bfbc]', 'hover:bg-[#f6f5f4]', 'dark:hover:bg-[#2d2640]');
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();