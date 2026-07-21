(function () {
    let detailController;
    let storeController;

    // Global Auth State
    window.AuthState = {
        isLoggedIn: false,
        user: null
    };

    function initThemeDetection() {
        const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const updateTheme = (e) => {
            if (e.matches) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        };

        updateTheme(darkModeMediaQuery);
        darkModeMediaQuery.addEventListener('change', updateTheme);
    }

    function init() {
        initThemeDetection();
        
        window.GnomeConnector = {
            isConnected: false, 
            shellVersion: 'all', 
            install: (id) => console.log(`[GNOME Connector] Triggering install for ${id}`),
            uninstall: (id) => console.log(`[GNOME Connector] Triggering uninstall for ${id}`),
            enable: (id) => console.log(`[GNOME Connector] Enabling ${id}`),
            disable: (id) => console.log(`[GNOME Connector] Disabling ${id}`),
            openPrefs: (id) => console.log(`[GNOME Connector] Opening native GTK preferences for ${id}`),
            update: (id) => console.log(`[GNOME Connector] Updating ${id} to latest version`)
        };

        handleConnectorWarning();

        // Initialize static views
        const authView = new window.AuthView();
        authView.render();
        
        const profileView = new window.ProfileView();
        profileView.render();
        
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
        window.showViewHandler = showView;
        window.updateAuthUI = updateAuthUI;
        
        bindGlobalEvents();
        updateAuthUI();
        
        // Populate the Store
        const extData = typeof EXTENSIONS !== 'undefined' ? EXTENSIONS : [];
        const catData = typeof CATEGORIES !== 'undefined' ? CATEGORIES : [];
        storeController.init(extData, catData);

        if (window.GnomeConnector.isConnected) {
            storeController.handleShellVersion(window.GnomeConnector.shellVersion);
        }
    }

    function handleConnectorWarning() {
        const warning = document.getElementById('connector-warning');
        if (warning) {
            if (!window.GnomeConnector.isConnected && !sessionStorage.getItem('connectorWarningDismissed')) {
                warning.classList.remove('hidden');
            } else {
                warning.classList.add('hidden');
            }
        }
    }

    function updateAuthUI() {
        const isAuth = window.AuthState.isLoggedIn;

        document.querySelectorAll('.auth-user').forEach(el => {
            if (isAuth) el.classList.remove('hidden');
            else el.classList.add('hidden');
        });

        document.querySelectorAll('.auth-guest').forEach(el => {
            if (!isAuth) el.classList.remove('hidden');
            else el.classList.add('hidden');
        });

        document.querySelectorAll('.auth-required').forEach(el => {
            if (isAuth) el.classList.remove('hidden');
            else el.classList.add('hidden');
        });
    }

    function bindGlobalEvents() {
        const mobileMenuButton = document.getElementById('mobile-menu-btn');
        if (mobileMenuButton) {
            mobileMenuButton.addEventListener('click', () => {
                const mobileMenu = document.getElementById('mobile-menu');
                const searchContainer = document.getElementById('search-container');
                if (mobileMenu) {
                    const isHidden = mobileMenu.classList.toggle('hidden');
                    mobileMenuButton.setAttribute('aria-expanded', String(!isHidden));
                    if (searchContainer) {
                        if (isHidden) {
                            searchContainer.classList.add('hidden');
                        } else {
                            searchContainer.classList.remove('hidden');
                        }
                    }
                }
            });
        }

        document.querySelectorAll('a[data-nav], button[data-nav]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const view = e.currentTarget.getAttribute('data-nav');
                
                if (view === 'store') {
                    detailController.clearExtension();
                } else if (view !== 'details') {
                    detailController.clearExtension();
                }
                
                showView(view);
                
                const mobileMenu = document.getElementById('mobile-menu');
                const mobileMenuButton = document.getElementById('mobile-menu-btn');
                const searchContainer = document.getElementById('search-container');
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                    mobileMenuButton.setAttribute('aria-expanded', 'false');
                    if (searchContainer) {
                        searchContainer.classList.add('hidden');
                    }
                }
            });
        });
        
        // Setup logo explicitly
        const logo = document.querySelector('.logo');
        if (logo) {
            logo.addEventListener('click', () => {
                showView('store');
                if (storeController) storeController.handleReset();
                window.scrollTo(0, 0);
            });
        }
        
        // Log out handler
        document.querySelectorAll('#nav-logout-btn, #nav-logout-mobile-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                window.AuthState.isLoggedIn = false;
                window.AuthState.user = null;
                updateAuthUI();
                showView('store');
            });
        });

        // Close connector warning
        const closeWarningBtn = document.getElementById('close-connector-warning');
        if (closeWarningBtn) {
            closeWarningBtn.addEventListener('click', () => {
                const warning = document.getElementById('connector-warning');
                if (warning) {
                    warning.classList.add('hidden');
                    sessionStorage.setItem('connectorWarningDismissed', 'true');
                }
            });
        }

        // Handle Scroll to Top Button Visibility Globally
        window.addEventListener('scroll', () => {
            const scrollTopBtn = document.getElementById('scroll-to-top-btn');
            if (scrollTopBtn) {
                if (window.scrollY > 300) {
                    scrollTopBtn.classList.remove('scale-0', 'opacity-0');
                    scrollTopBtn.classList.add('scale-100', 'opacity-100');
                } else {
                    scrollTopBtn.classList.add('scale-0', 'opacity-0');
                    scrollTopBtn.classList.remove('scale-100', 'opacity-100');
                }
            }
        });
    }

    function openExtension(extensionId) {
        showView('details');
        const extData = typeof EXTENSIONS !== 'undefined' ? EXTENSIONS : [];
        detailController.openExtension(extensionId, extData);
        window.scrollTo(0, 0);
    }

    function showView(view) {
        const views = ['store', 'details', 'upload', 'local', 'about', 'auth', 'profile'];

        views.forEach(v => {
            const el = document.getElementById(`${v}-view`);
            if (el) {
                if (v === view) {
                    el.classList.remove('hidden');
                    el.classList.add('block');
                    
                    // Trigger a re-render if it's the profile view to reflect auth changes
                    if (v === 'profile' && window.ProfileView) {
                        const pv = new window.ProfileView();
                        pv.render();
                    }
                } else {
                    el.classList.add('hidden');
                    el.classList.remove('block'); 
                }
            }
        });

        document.querySelectorAll('nav a[data-nav], #mobile-menu a[data-nav], nav button[data-nav]').forEach(link => {
            const navTarget = link.getAttribute('data-nav');
            const isActive = navTarget === view || (view === 'details' && navTarget === 'store');
            
            // Clean state
            link.classList.remove('bg-[#f6f5f4]', 'dark:bg-[#2d2640]', 'text-gnome-black', 'dark:text-gnome-white');
            if (link.tagName === 'A') {
                link.classList.add('text-[#5e5c64]', 'dark:text-[#c0bfbc]', 'hover:bg-[#f6f5f4]', 'dark:hover:bg-[#2d2640]');
            }
            
            // Apply active state
            if (isActive) {
                if (link.tagName === 'A') {
                    link.classList.remove('text-[#5e5c64]', 'dark:text-[#c0bfbc]', 'hover:bg-[#f6f5f4]', 'dark:hover:bg-[#2d2640]');
                    link.classList.add('bg-[#f6f5f4]', 'dark:bg-[#2d2640]', 'text-gnome-black', 'dark:text-gnome-white');
                }
            }
        });
        
        // Dispatch resize to trigger observer updates on scroll tracks
        window.dispatchEvent(new Event('resize'));
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();