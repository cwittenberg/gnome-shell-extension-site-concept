class LocalView {
    constructor() {
        this.container = document.getElementById('local-view');
        this.defaultExtensionSvg = `<i class="icon icon-settings text-4xl"></i>`;
    }

    render() {
        if (!this.container) return;

        const isConnected = window.GnomeConnector && window.GnomeConnector.isConnected;
        let contentHtml = '';

        if (!isConnected) {
            contentHtml = `
               <div class="bg-[#d9edf7] dark:bg-[#243f55] border border-[#bce8f1] dark:border-[#2f5573] rounded-xl p-4 sm:p-5 mb-8 flex items-start gap-4 shadow-sm">
                 <div class="text-[#31708f] dark:text-[#9bc2d5] shrink-0 mt-0.5">
                   <i class="icon icon-info text-2xl"></i>
                 </div>
                 <div class="text-[12pt] text-[#31708f] dark:text-[#9bc2d5] leading-relaxed">
                   <p>To control GNOME Shell extensions using this site you must install GNOME Shell integration that consists of two parts: browser extension and native host messaging application.</p>
                   <p class="mt-2">
                     <a href="#" onclick="return false;" class="font-bold underline hover:no-underline">Click here to install browser extension</a>. 
                     See <a href="https://gnome.pages.gitlab.gnome.org/gnome-browser-integration/pages/installation-guide.html" target="_blank" rel="noreferrer" class="font-bold underline hover:no-underline">wiki page</a> for native host connector installation instructions.
                   </p>
                 </div>
               </div>

               <div class="gnome-card-panel p-10 sm:p-16 shadow-md text-center">
                 <i class="icon icon-extension-disabled text-5xl text-gnome-grey mx-auto mb-4 block"></i>
                 <h3 class="text-[18pt] font-extrabold text-gnome-black dark:text-gnome-white mb-2">No extensions detected</h3>
                 <p class="text-[12pt] text-gnome-grey">GNOME Shell Extensions cannot list your installed extensions without the host connector.</p>
               </div>
             `;
        } else {
            const extensionsData = typeof EXTENSIONS !== 'undefined' ? EXTENSIONS : [];
            const localExtensions = extensionsData.filter(e => e.installed);

            if (localExtensions.length === 0) {
                contentHtml = `
                   <div class="gnome-card-panel p-10 sm:p-16 shadow-md text-center">
                     <i class="icon icon-folder-open text-5xl text-gnome-grey mx-auto mb-4 block"></i>
                     <h3 class="text-[18pt] font-extrabold text-gnome-black dark:text-gnome-white mb-2">No Extensions Installed</h3>
                     <p class="text-[12pt] text-gnome-grey mb-6">You don't have any GNOME Shell extensions installed on your system.</p>
                     <a href="#" data-nav="search" class="bg-gnome-blue text-white px-6 py-2.5 rounded-lg text-[12pt] font-bold shadow-sm hover:bg-[#1c71d8] transition-colors inline-block">Explore Store</a>
                   </div>
                 `;
            } else {
                const listHtml = localExtensions.map(ext => this.generateLocalRowHTML(ext)).join('');
                contentHtml = `
                    <!-- Global Extension Controls -->
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gnome-card-panel p-5 mb-8 animate-fade-in">
                        <div class="flex items-center justify-between w-full sm:w-auto gap-6 mb-4 sm:mb-0">
                            <span class="font-bold text-gnome-black dark:text-gnome-white">Disable All Extensions</span>
                            <button id="local-global-disable" class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none bg-[#c0bfbc] dark:bg-[#3d3846]" role="switch" aria-checked="false">
                                <span class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1"></span>
                            </button>
                        </div>
                        <div class="w-px h-8 bg-[#c0bfbc] dark:bg-[#3d3846] hidden sm:block"></div>
                        <div class="flex items-center justify-between w-full sm:w-auto gap-6">
                            <span class="font-bold text-gnome-black dark:text-gnome-white">Disable Version Validation</span>
                            <button id="local-version-validation" class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none bg-[#c0bfbc] dark:bg-[#3d3846]" role="switch" aria-checked="false">
                                <span class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1"></span>
                            </button>
                        </div>
                    </div>
                    
                    <div class="flex flex-col gap-3">
                        ${listHtml}
                    </div>
                `;
            }
        }

        this.container.innerHTML = `
            <div class="max-w-5xl mx-auto px-4 sm:px-6 pt-10 pb-16">
               <div class="flex justify-between items-end mb-6">
                   <h1 class="text-[24pt] font-extrabold text-gnome-black dark:text-gnome-white tracking-tight">Installed Extensions</h1>
               </div>
               ${contentHtml}
            </div>
        `;
        this.bindEvents();
    }

    bindEvents() {
        // Global Toggles
        const globalDisable = document.getElementById('local-global-disable');
        if (globalDisable) {
            globalDisable.addEventListener('click', () => {
                const isChecked = globalDisable.getAttribute('aria-checked') === 'true';
                if (isChecked) {
                    globalDisable.setAttribute('aria-checked', 'false');
                    globalDisable.classList.replace('bg-gnome-blue', 'bg-[#c0bfbc]');
                    globalDisable.querySelector('span').classList.replace('translate-x-6', 'translate-x-1');
                } else {
                    globalDisable.setAttribute('aria-checked', 'true');
                    globalDisable.classList.replace('bg-[#c0bfbc]', 'bg-gnome-blue');
                    globalDisable.querySelector('span').classList.replace('translate-x-1', 'translate-x-6');
                }
            });
        }

        const versionValidation = document.getElementById('local-version-validation');
        if (versionValidation) {
            versionValidation.addEventListener('click', () => {
                const isChecked = versionValidation.getAttribute('aria-checked') === 'true';
                if (isChecked) {
                    versionValidation.setAttribute('aria-checked', 'false');
                    versionValidation.classList.replace('bg-gnome-blue', 'bg-[#c0bfbc]');
                    versionValidation.querySelector('span').classList.replace('translate-x-6', 'translate-x-1');
                } else {
                    versionValidation.setAttribute('aria-checked', 'true');
                    versionValidation.classList.replace('bg-[#c0bfbc]', 'bg-gnome-blue');
                    versionValidation.querySelector('span').classList.replace('translate-x-1', 'translate-x-6');
                }
            });
        }

        // Row Interactions
        const rows = this.container.querySelectorAll('article[data-extension-id]');
        rows.forEach(row => {
            const uuid = row.getAttribute('data-extension-uuid');

            // Toggle Extension
            const toggleBtn = row.querySelector('.local-install-toggle');
            if (toggleBtn) {
                toggleBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const isEnabled = toggleBtn.getAttribute('aria-checked') === 'true';
                    if (isEnabled) {
                        window.GnomeConnector.disable(uuid);
                        toggleBtn.setAttribute('aria-checked', 'false');
                        toggleBtn.classList.add('bg-[#c0bfbc]', 'dark:bg-[#3d3846]');
                        toggleBtn.classList.remove('bg-gnome-blue');
                        toggleBtn.querySelector('span').classList.replace('translate-x-6', 'translate-x-1');
                    } else {
                        window.GnomeConnector.enable(uuid);
                        toggleBtn.setAttribute('aria-checked', 'true');
                        toggleBtn.classList.remove('bg-[#c0bfbc]', 'dark:bg-[#3d3846]');
                        toggleBtn.classList.add('bg-gnome-blue');
                        toggleBtn.querySelector('span').classList.replace('translate-x-1', 'translate-x-6');
                    }
                });
            }

            // Uninstall Button
            const uninstallBtn = row.querySelector('.local-uninstall-btn');
            if (uninstallBtn) {
                uninstallBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (confirm('Are you sure you want to uninstall this extension?')) {
                        window.GnomeConnector.uninstall(uuid);
                        
                        row.style.transition = 'all 350ms ease';
                        row.style.opacity = '0';
                        row.style.transform = 'scale(0.98)';
                        row.style.maxHeight = row.offsetHeight + 'px';
                        
                        setTimeout(() => {
                            row.style.maxHeight = '0';
                            row.style.paddingTop = '0';
                            row.style.paddingBottom = '0';
                            row.style.marginTop = '0';
                            row.style.marginBottom = '0';
                            row.style.borderWidth = '0';
                            
                            setTimeout(() => { row.remove(); }, 350);
                        }, 50);
                    }
                });
            }

            // Update Button
            const updateBtn = row.querySelector('.local-update-btn');
            if (updateBtn) {
                updateBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    window.GnomeConnector.update(uuid);
                    updateBtn.remove();
                });
            }

            // Settings/Prefs Button
            const prefsBtn = row.querySelector('.local-prefs-btn');
            if (prefsBtn) {
                prefsBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    window.GnomeConnector.openPrefs(uuid);
                });
            }

            // Details Link 
            row.addEventListener('click', () => {
                const id = row.getAttribute('data-extension-id');
                if (window.openExtensionHandler) window.openExtensionHandler(id);
            });
        });
    }

    renderIcon(extension) {
        if (!extension.icon) return this.defaultExtensionSvg;
        if (extension.icon.startsWith('http') || extension.icon.startsWith('/')) {
            const safeSvg = this.defaultExtensionSvg.replace(/"/g, '&quot;');
            return `<img src="${this.escapeHtml(extension.icon)}" alt="" class="w-full h-full object-cover" onerror="this.outerHTML='${safeSvg}'">`;
        }
        return extension.icon;
    }

    escapeHtml(value) {
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    generateLocalRowHTML(extension) {
        const isSystem = extension.isSystem === true;
        const hasError = extension.hasError === true;
        
        let actionsHtml = '';

        if (extension.hasSettings) {
            actionsHtml += `
                <button type="button" class="local-prefs-btn text-gnome-grey hover:text-gnome-blue transition-colors flex items-center justify-center w-8 h-8 rounded-full bg-[#f6f5f4] dark:bg-[#3d3846]" title="Preferences">
                    <i class="icon icon-settings"></i>
                </button>
            `;
        }

        if (extension.hasUpdate && !isSystem) {
            actionsHtml += `
                <button type="button" class="local-update-btn text-white bg-gnome-green hover:bg-[#2ebc6c] transition-colors flex items-center justify-center w-8 h-8 rounded-full shadow-sm" title="Update Available">
                    <i class="icon icon-download"></i>
                </button>
            `;
        }

        if (!isSystem) {
            actionsHtml += `
                <button type="button" class="local-uninstall-btn text-gnome-grey hover:text-gnome-red transition-colors flex items-center justify-center w-8 h-8 rounded-full bg-[#f6f5f4] dark:bg-[#3d3846]" title="Uninstall">
                    <i class="icon icon-bin"></i>
                </button>
            `;
        } else { 
            actionsHtml += `
                <div class="text-gnome-grey flex items-center justify-center w-8 h-8" title="System extensions cannot be uninstalled here">
                    <i class="icon icon-lock text-sm opacity-50"></i>
                </div>
            `;
        }

        const isEnabled = extension.enabled === true;
        actionsHtml += `
            <button type="button" class="local-install-toggle ml-2 relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${isEnabled ? 'bg-gnome-blue' : 'bg-[#c0bfbc] dark:bg-[#3d3846]'}" role="switch" aria-checked="${isEnabled}">
                <span class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isEnabled ? 'translate-x-6' : 'translate-x-1'}"></span>
            </button>
        `;

        let errorBanner = '';
        if (hasError) {
            errorBanner = `
                <div class="mt-3 col-span-12 bg-gnome-red/10 border border-gnome-red/30 text-gnome-red px-3 py-2 rounded-md text-xs flex items-start gap-2 max-w-full overflow-hidden">
                    <i class="icon icon-error mt-0.5 shrink-0"></i>
                    <div class="min-w-0">
                        <span class="font-bold">Error loading extension</span>
                        <p class="font-mono mt-0.5 opacity-80 break-all">${this.escapeHtml(extension.errorMessage)}</p>
                    </div>
                </div>
            `;
        }

        return `
            <article class="group gnome-card-panel p-4 cursor-pointer hover:border-gnome-blue hover:shadow-md transition-all duration-300 animate-fade-in ${hasError ? '!border-gnome-red' : ''}" data-extension-id="${extension.id}" data-extension-uuid="${this.escapeHtml(extension.uuid)}">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div class="flex items-center gap-4 min-w-0 flex-1">
                        <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#f6f5f4] dark:bg-[#241F31] overflow-hidden text-gnome-blue">
                            <div class="scale-[0.8] flex items-center justify-center w-full h-full">
                                ${this.renderIcon(extension)}
                            </div>
                        </div>
                        <div class="min-w-0 flex-1">
                            <div class="flex items-center gap-2">
                                <h3 class="font-bold text-[12pt] text-gnome-black dark:text-gnome-white truncate">${this.escapeHtml(extension.name)}</h3>
                                ${isSystem ? `<span class="bg-[#deddda] dark:bg-[#3d3846] text-gnome-grey dark:text-[#c0bfbc] text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full border border-[#c0bfbc] dark:border-[#5e5c64] shrink-0">System</span>` : ''}
                            </div>
                            <p class="text-xs text-gnome-grey mt-0.5 truncate">${this.escapeHtml(extension.uuid)}</p>
                        </div>
                    </div>
                    
                    <div class="flex items-center justify-between sm:justify-end gap-2 shrink-0 border-t border-[#c0bfbc] sm:border-t-0 dark:border-[#3d3846] pt-3 sm:pt-0 mt-2 sm:mt-0">
                        ${actionsHtml}
                    </div>
                </div>
                ${errorBanner}
            </article>
        `;
    }
}

window.LocalView = LocalView;