(function () {
    let detailController;
    let storeController;

    function init() {
        // Initialize Mock GNOME Host Connector
        window.GnomeConnector = {
            isConnected: true, // Set to false to see the missing connector warning
            shellVersion: 'all', // FIX: Set to 'all' so the mock catalog isn't hidden by the string-matching filter on load
            install: (id) => console.log(`[GNOME Connector] Triggering install for ${id}`),
            uninstall: (id) => console.log(`[GNOME Connector] Triggering uninstall for ${id}`),
            enable: (id) => console.log(`[GNOME Connector] Enabling ${id}`),
            disable: (id) => console.log(`[GNOME Connector] Disabling ${id}`),
            openPrefs: (id) => console.log(`[GNOME Connector] Opening native GTK preferences for ${id}`),
            update: (id) => console.log(`[GNOME Connector] Updating ${id} to latest version`)
        };

        handleConnectorWarning();

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

        // Auto-detect shell version if connector is present
        if (window.GnomeConnector.isConnected) {
            storeController.handleShellVersion(window.GnomeConnector.shellVersion);
        }
    }

    function handleConnectorWarning() {
        const warning = document.getElementById('connector-warning');
        if (warning) {
            if (!window.GnomeConnector.isConnected) {
                warning.classList.remove('hidden');
            } else {
                warning.classList.add('hidden');
            }
        }
    }

    function updateConfigJSON() {
        const config = {
            mode: localStorage.getItem('gnome_mode') || 'dark',
            header: localStorage.getItem('gnome_header') || 'default',
            base: localStorage.getItem('gnome_base') || 'default',
            card: localStorage.getItem('gnome_card') || 'default',
            accent: localStorage.getItem('gnome_accent') || 'blue',
            gradTop: localStorage.getItem('gnome_grad_top') || 'default',
            gradBottom: localStorage.getItem('gnome_grad_bottom') || 'default'
        };
        const jsonStr = JSON.stringify(config, null, 2);
        document.querySelectorAll('.config-json-output').forEach(el => {
            el.textContent = jsonStr;
        });
    }

    function bindGlobalEvents() {
        const mobileMenuButton = document.getElementById('mobile-menu-btn');

        if (mobileMenuButton) {
            mobileMenuButton.addEventListener('click', () => {
                const mobileMenu = document.getElementById('mobile-menu');
                if (mobileMenu) {
                    const isHidden = mobileMenu.classList.toggle('hidden');
                    mobileMenuButton.setAttribute('aria-expanded', String(!isHidden));
                }
            });
        }

        // Setup Explicit Mode Buttons
        const modeBtns = document.querySelectorAll('.mode-btn');
        modeBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                setMode(e.currentTarget.getAttribute('data-mode'));
            });
        });

        // Setup Top Bar (Header) Interactive Selection
        const headerBtns = document.querySelectorAll('.header-btn');
        headerBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                setHeader(e.currentTarget.getAttribute('data-header'));
            });
        });

        // Setup Base Layout Interactive Selection
        const baseBtns = document.querySelectorAll('.base-btn');
        baseBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                setBaseLayout(e.currentTarget.getAttribute('data-base'));
            });
        });

        // Setup Card Tint Interactive Selection
        const cardBtns = document.querySelectorAll('.card-btn');
        cardBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                setCardTint(e.currentTarget.getAttribute('data-card'));
            });
        });

        // Setup Accent Color Interactive Selection
        const accentBtns = document.querySelectorAll('.accent-btn');
        accentBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                setAccentColor(e.currentTarget.getAttribute('data-accent'));
            });
        });

        // Setup Gradient Top Interactive Selection
        const gradTopBtns = document.querySelectorAll('.grad-top-btn');
        gradTopBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                setGradTop(e.currentTarget.getAttribute('data-grad-top'));
            });
        });

        // Setup Gradient Bottom Interactive Selection
        const gradBotBtns = document.querySelectorAll('.grad-bot-btn');
        gradBotBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                setGradBottom(e.currentTarget.getAttribute('data-grad-bottom'));
            });
        });

        // Setup Preset Interactive Selection
        const presetBtns = document.querySelectorAll('.preset-btn');
        presetBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                applyPreset(e.currentTarget.getAttribute('data-preset'));
            });
        });

        // Setup JSON Copy to Clipboard Capability
        const copyBtns = document.querySelectorAll('.copy-config-btn');
        copyBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const config = {
                    mode: localStorage.getItem('gnome_mode') || 'dark',
                    header: localStorage.getItem('gnome_header') || 'default',
                    base: localStorage.getItem('gnome_base') || 'default',
                    card: localStorage.getItem('gnome_card') || 'default',
                    accent: localStorage.getItem('gnome_accent') || 'blue',
                    gradTop: localStorage.getItem('gnome_grad_top') || 'default',
                    gradBottom: localStorage.getItem('gnome_grad_bottom') || 'default'
                };
                navigator.clipboard.writeText(JSON.stringify(config, null, 2)).then(() => {
                    const originalHTML = btn.innerHTML;
                    btn.innerHTML = '<i class="fa-solid fa-check"></i> Copied';
                    setTimeout(() => {
                        btn.innerHTML = originalHTML;
                    }, 2000);
                });
            });
        });

        // Initialize Matrix State from localStorage Configuration Tree
        const savedMode = localStorage.getItem('gnome_mode') || 'dark';
        const savedHeader = localStorage.getItem('gnome_header') || 'default';
        const savedBase = localStorage.getItem('gnome_base') || 'default';
        const savedCard = localStorage.getItem('gnome_card') || 'default';
        const savedAccent = localStorage.getItem('gnome_accent') || 'blue';
        const savedGradTop = localStorage.getItem('gnome_grad_top') || 'default';
        const savedGradBottom = localStorage.getItem('gnome_grad_bottom') || 'default';
        
        setMode(savedMode);
        setHeader(savedHeader);
        setBaseLayout(savedBase);
        setCardTint(savedCard);
        setAccentColor(savedAccent);
        setGradTop(savedGradTop);
        setGradBottom(savedGradBottom);
        
        updateConfigJSON();

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

    function setMode(mode) {
        const html = document.documentElement;
        if (mode === 'dark') {
            html.classList.add('dark');
        } else {
            html.classList.remove('dark');
        }
        localStorage.setItem('gnome_mode', mode);
        updateConfigJSON();
    }

    function setHeader(header) {
        const html = document.documentElement;
        if (header === 'default') {
            html.removeAttribute('data-header');
        } else {
            html.setAttribute('data-header', header);
        }
        localStorage.setItem('gnome_header', header);
        updateConfigJSON();
    }

    function setBaseLayout(base) {
        const html = document.documentElement;
        if (base === 'default') {
            html.removeAttribute('data-base');
        } else {
            html.setAttribute('data-base', base);
        }
        localStorage.setItem('gnome_base', base);
        updateConfigJSON();
    }

    function setCardTint(card) {
        const html = document.documentElement;
        if (card === 'default') {
            html.removeAttribute('data-card');
        } else {
            html.setAttribute('data-card', card);
        }
        localStorage.setItem('gnome_card', card);
        updateConfigJSON();
    }

    function setAccentColor(accent) {
        const html = document.documentElement;
        html.setAttribute('data-accent', accent);
        localStorage.setItem('gnome_accent', accent);
        updateConfigJSON();
    }

    function setGradTop(gradTop) {
        const html = document.documentElement;
        if (gradTop === 'default') {
            html.removeAttribute('data-grad-top');
        } else {
            html.setAttribute('data-grad-top', gradTop);
        }
        localStorage.setItem('gnome_grad_top', gradTop);
        updateConfigJSON();
    }

    function setGradBottom(gradBottom) {
        const html = document.documentElement;
        if (gradBottom === 'default') {
            html.removeAttribute('data-grad-bottom');
        } else {
            html.setAttribute('data-grad-bottom', gradBottom);
        }
        localStorage.setItem('gnome_grad_bottom', gradBottom);
        updateConfigJSON();
    }

    function applyPreset(presetName) {
        switch (presetName) {
            case 'classic':
                setMode('dark');
                setHeader('default');
                setBaseLayout('default');
                setCardTint('default');
                setAccentColor('blue');
                setGradTop('default');
                setGradBottom('default');
                break;
            case 'ubuntu':
                setMode('dark');
                setHeader('console');
                setBaseLayout('console');
                setCardTint('default');
                setAccentColor('orange');
                setGradTop('orange');
                setGradBottom('purple');
                break;
            case 'forest':
                setMode('dark');
                setHeader('green');
                setBaseLayout('console');
                setCardTint('green');
                setAccentColor('green');
                setGradTop('green');
                setGradBottom('console');
                break;
            case 'sunset':
                setMode('dark');
                setHeader('orange');
                setBaseLayout('default');
                setCardTint('red');
                setAccentColor('yellow');
                setGradTop('red');
                setGradBottom('orange');
                break;
        }
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
                link.classList.add('bg-[var(--header-hover-bg)]', 'text-[var(--header-text)]');
                link.classList.remove('text-[var(--header-muted)]');
            } else {
                link.classList.remove('bg-[var(--header-hover-bg)]', 'text-[var(--header-text)]');
                link.classList.add('text-[var(--header-muted)]');
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();