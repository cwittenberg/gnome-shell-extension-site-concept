class ProfileView {
    constructor() {
        this.container = document.getElementById('profile-view');
        this.defaultExtensionSvg = `<i class="icon icon-settings text-4xl"></i>`;
    }

    render() {
        if (!this.container) return;

        // Use the authenticated user's ID/username if logged in to demonstrate matching owner profiles. 
        // Default to a known mock author from EXTENSIONS data to demonstrate output.
        const currentProfileUsername = window.AuthState.isLoggedIn && window.AuthState.user ? window.AuthState.user.username : 'cwittenberg';
        const isOwner = window.AuthState.isLoggedIn && window.AuthState.user && window.AuthState.user.username === currentProfileUsername;

        const extData = typeof EXTENSIONS !== 'undefined' ? EXTENSIONS : [];
        const createdBy = extData.filter(e => e.author === currentProfileUsername);
        const maintainedBy = extData.filter(e => e.maintainers && e.maintainers.includes(currentProfileUsername) && e.author !== currentProfileUsername);

        let createdHtml = '';
        if (createdBy.length === 0) {
            createdHtml = `<p class="text-gnome-grey italic">This user has not created any extensions.</p>`;
        } else {
            createdHtml = `<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">${createdBy.map(ext => this.generateProfileCardHTML(ext, isOwner)).join('')}</div>`;
        }

        let maintainedHtml = '';
        if (maintainedBy.length === 0) {
            maintainedHtml = `<p class="text-gnome-grey italic">This user is not maintaining any extensions.</p>`;
        } else {
            maintainedHtml = `<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">${maintainedBy.map(ext => this.generateProfileCardHTML(ext, isOwner)).join('')}</div>`;
        }

        this.container.innerHTML = `
            <div class="max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-16 animate-fade-in">
                
                <!-- Profile Header -->
                <div class="flex items-center gap-6 mb-12">
                    <div class="w-24 h-24 rounded-full bg-gradient-to-br from-gnome-blue to-gnome-purple flex items-center justify-center text-white text-4xl font-extrabold shadow-md">
                        ${currentProfileUsername.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h1 class="text-4xl font-extrabold text-gnome-black dark:text-gnome-white tracking-tight">${this.escapeHtml(currentProfileUsername)}</h1>
                        <p class="text-lg text-gnome-grey mt-1">GNOME Extension Contributor</p>
                    </div>
                </div>

                <div class="space-y-12">
                    <section>
                        <h2 class="gnome-title-section mb-6 pb-2 border-b border-[#c0bfbc] dark:border-[#3d3846]">Extensions Created By ${this.escapeHtml(currentProfileUsername)}</h2>
                        ${createdHtml}
                    </section>
                    
                    <section>
                        <h2 class="gnome-title-section mb-6 pb-2 border-b border-[#c0bfbc] dark:border-[#3d3846]">Extensions Maintained By ${this.escapeHtml(currentProfileUsername)}</h2>
                        ${maintainedHtml}
                    </section>
                </div>
            </div>
        `;

        this.bindEvents();
    }

    bindEvents() {
        const extensionLinks = this.container.querySelectorAll('[data-extension-id]');
        extensionLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                // Ignore click if clicking on the manage button specifically
                if (e.target.closest('[data-action="manage"]')) return;
                
                const id = link.getAttribute('data-extension-id');
                if (window.openExtensionHandler) window.openExtensionHandler(id);
            });
        });

        const manageBtns = this.container.querySelectorAll('[data-action="manage"]');
        manageBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                // Route to developer dashboard
                if (window.showViewHandler) window.showViewHandler('upload');
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

    generateProfileCardHTML(extension, isOwner) {
        // Derive review status badge (Mock logic mapping data to EGO UI requirements)
        let statusBadge = '';
        let borderColor = '';
        
        if (extension.hasError) {
            statusBadge = `<span class="bg-gnome-red/15 text-gnome-red border border-gnome-red/20 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">Rejected</span>`;
            borderColor = '!border-gnome-red';
        } else if (extension.new) {
            statusBadge = `<span class="bg-gnome-orange/15 text-gnome-orange border border-gnome-orange/20 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">Pending</span>`;
            borderColor = '!border-gnome-orange';
        } else {
            statusBadge = `<span class="bg-gnome-green/15 text-gnome-green border border-gnome-green/20 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">Active</span>`;
        }

        const manageBtn = isOwner ? `
            <button type="button" data-action="manage" class="gnome-btn-icon bg-[#f6f5f4] dark:bg-[#3d3846] hover:bg-gnome-blue hover:text-white transition-colors" title="Manage Extension">
                <i class="icon icon-settings"></i>
            </button>
        ` : '';

        return `
            <article class="extension-card group gnome-card-panel p-4 flex flex-col justify-between cursor-pointer ${borderColor}" data-extension-id="${extension.id}">
                <div>
                    <div class="flex items-start justify-between gap-3">
                        <div class="flex items-center gap-3 min-w-0">
                            <div class="ext-icon-wrapper h-10 w-10 shrink-0 rounded-xl overflow-hidden bg-[#f6f5f4] dark:bg-[#241F31] flex items-center justify-center text-gnome-blue">
                                <div class="scale-75 w-full h-full flex items-center justify-center">
                                    ${this.renderIcon(extension)}
                                </div>
                            </div>
                            <div class="min-w-0">
                                <h3 class="font-bold text-sm text-gnome-black dark:text-gnome-white truncate">${this.escapeHtml(extension.name)}</h3>
                                <div class="mt-1">${statusBadge}</div>
                            </div>
                        </div>
                    </div>
                    <p class="text-xs text-gnome-grey mt-3 line-clamp-2">${this.escapeHtml(extension.description)}</p>
                </div>
                
                <div class="mt-4 flex items-center justify-between pt-3 border-t border-[#c0bfbc] dark:border-[#3d3846]">
                    <div class="flex items-center gap-3">
                        <div class="text-xs font-semibold text-gnome-blue"><i class="icon icon-star"></i> ${extension.rating.toFixed(1)}</div>
                        <div class="text-[10px] uppercase tracking-wider text-gnome-grey flex items-center gap-1"><i class="icon icon-download-color"></i> ${extension.downloads.toLocaleString()}</div>
                    </div>
                    ${manageBtn}
                </div>
            </article>
        `;
    }

    escapeHtml(value) {
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }
}

window.ProfileView = ProfileView;