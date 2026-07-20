class UploadView {
    constructor() {
        this.container = document.getElementById('upload-view');
        
        // Mock Data expanded to support Phase 3 Dashboard workflows
        this.mockData = {
            extensions: [
                {
                    id: "snaptext",
                    uuid: "snaptext@cwittenberg",
                    name: "Snap Text Extractor",
                    role: "Author",
                    downloads: 12400,
                    rating: 4.8,
                    ratingCount: 45,
                    lastUpdated: "2026-06-20",
                    status: "Active",
                    categories: ["Utilities"],
                    maintainers: ["cwittenberg"],
                    versions: [
                        { version: 10, status: "Active" },
                        { version: 9, status: "Inactive" },
                        { version: 8, status: "Inactive" }
                    ]
                },
                {
                    id: "omnipanel",
                    uuid: "omnipanel@christian",
                    name: "OmniPanel",
                    role: "Maintainer",
                    downloads: 88,
                    rating: 4.8,
                    ratingCount: 2800,
                    lastUpdated: "2026-07-10",
                    status: "Pending",
                    categories: ["Window Management"],
                    maintainers: ["christian", "cwittenberg"],
                    versions: [
                        { version: 11, status: "Pending" },
                        { version: 10, status: "Active" }
                    ]
                }
            ],
            reviews: [
                {
                    extId: "snaptext",
                    extName: "Snap Text Extractor",
                    user: "LinuxFan99",
                    date: "2 hours ago",
                    rating: 5,
                    text: "Absolutely love the native OCR integration. Saves me so much time!"
                },
                {
                    extId: "omnipanel",
                    extName: "OmniPanel",
                    user: "GNOME_User42",
                    date: "1 day ago",
                    rating: 4,
                    text: "Great window manager, but the zone snapping is a bit too sensitive."
                }
            ],
            reviewLog: {
                snaptext: {
                    title: "EGO Review: Snap Text Extractor (v10)",
                    author: "cwittenberg",
                    url: "https://github.com/cwittenberg/snaptext",
                    bugTracker: "https://github.com/cwittenberg/snaptext/issues",
                    nameAvailable: true,
                    warnings: ["Standard Subprocesses", "Session Modes"],
                    comments: [{ author: "EGO-Admin", date: "2 days ago", type: "approved", text: "Code review passed GNOME architecture requirements." }],
                    files: [{ name: "extension.js", status: "modified", additions: 1, deletions: 1, diff: [{ type: 'normal', oldLine: 42, newLine: 42, text: '    enable() {' }] }]
                },
                omnipanel: {
                    title: "EGO Review: OmniPanel (v11)",
                    author: "christian",
                    url: "https://github.com/cwittenberg/omnipanel",
                    bugTracker: "https://github.com/cwittenberg/omnipanel/issues",
                    nameAvailable: true,
                    warnings: ["Session Modes"],
                    comments: [{ author: "EGO-Admin", date: "1 week ago", type: "rejected", text: "Please ensure you are disconnecting all signals in the disable() block." }],
                    files: [{ name: "extension.js", status: "modified", additions: 2, deletions: 1, diff: [{ type: 'normal', oldLine: 89, newLine: 89, text: '    disable() {' }] }]
                }
            }
        };
    }

    render() {
        if (!this.container) return;
        
        const currentUserId = window.AuthState && window.AuthState.user ? window.AuthState.user.id : 'USR-0000-GUEST';

        this.container.innerHTML = `
            <div class="max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-16">
                
                <div class="mb-8">
                    <h1 class="gnome-title-page mb-2">Dashboard</h1>
                    <p class="text-[12pt] font-medium text-gnome-grey">Manage your extensions, account settings, and community reviews.</p>
                </div>

                <!-- Dashboard Tabs -->
                <div class="flex gap-6 border-b border-[#c0bfbc] dark:border-[#3d3846] mb-8 overflow-x-auto scrollbar-hide">
                    <button data-tab-target="my-extensions" class="upload-tab-btn active pb-3 font-bold text-[12pt] text-gnome-blue border-b-2 border-gnome-blue whitespace-nowrap focus:outline-none">
                        My Extensions
                    </button>
                    <button data-tab-target="reviews-inbox" class="upload-tab-btn pb-3 font-bold text-[12pt] text-[#5e5c64] dark:text-[#c0bfbc] hover:text-gnome-black dark:hover:text-gnome-white border-b-2 border-transparent transition-colors whitespace-nowrap focus:outline-none">
                        Reviews Inbox
                    </button>
                    <button data-tab-target="upload-new" class="upload-tab-btn pb-3 font-bold text-[12pt] text-[#5e5c64] dark:text-[#c0bfbc] hover:text-gnome-black dark:hover:text-gnome-white border-b-2 border-transparent transition-colors whitespace-nowrap focus:outline-none">
                        Submit Extension
                    </button>
                    <button data-tab-target="account-settings" class="upload-tab-btn pb-3 font-bold text-[12pt] text-[#5e5c64] dark:text-[#c0bfbc] hover:text-gnome-black dark:hover:text-gnome-white border-b-2 border-transparent transition-colors whitespace-nowrap focus:outline-none">
                        Account Settings
                    </button>
                </div>
                
                <!-- Tab 1: My Extensions List -->
                <div id="view-my-extensions" class="upload-view-pane block animate-fade-in">
                    <div class="space-y-8">
                        <div class="gnome-card-panel overflow-hidden flex flex-col" id="dashboard-extensions-list">
                            ${this.renderExtensionsList()}
                        </div>
                    </div>
                </div>

                <!-- Tab 2: Reviews Inbox -->
                <div id="view-reviews-inbox" class="upload-view-pane hidden animate-fade-in">
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <h2 class="gnome-title-section">Reviews on your Extensions</h2>
                        <select id="review-filter-select" class="gnome-select max-w-xs">
                            <option value="all">All Extensions</option>
                            ${this.mockData.extensions.map(ext => `<option value="${this.escapeHtml(ext.id)}">${this.escapeHtml(ext.name)}</option>`).join('')}
                        </select>
                    </div>
                    <div id="reviews-inbox-container" class="space-y-4">
                        ${this.renderReviewsInbox('all')}
                    </div>
                </div>

                <!-- Tab 3: Submit New -->
                <div id="view-upload-new" class="upload-view-pane hidden animate-fade-in">
                    <div class="gnome-card-panel p-8 sm:p-12 max-w-2xl mx-auto">
                      <h3 class="gnome-title-section mb-2 text-center">Submit an Extension</h3>
                      <p class="text-[12pt] text-gnome-grey text-center mb-8">Upload your GNOME Shell extension archive containing your metadata.json and source code.</p>
                      
                      <form id="upload-form" class="space-y-6">
                        <div id="upload-dropzone" class="border border-[#c0bfbc] dark:border-[#3d3846] rounded-xl p-12 flex flex-col items-center justify-center bg-[#f6f5f4] dark:bg-[#241F31] hover:border-gnome-blue dark:hover:border-gnome-blue transition-colors cursor-pointer text-center group">
                          <i class="icon icon-file-add text-4xl text-gnome-grey group-hover:text-gnome-blue transition-colors mb-4"></i>
                          <span class="text-[12pt] font-bold text-gnome-black dark:text-gnome-white mb-1">Select or drop your .zip here</span>
                          <input type="file" id="upload-file-input" class="hidden" accept=".zip" />
                        </div>
                        
                        <div id="upload-file-info" class="hidden flex items-center justify-between bg-[#f6f5f4] dark:bg-[#3d3846] p-4 rounded-xl border border-[#c0bfbc] dark:border-[#5e5c64]">
                            <div class="flex items-center gap-4 overflow-hidden">
                                <i class="icon icon-package text-gnome-blue text-2xl"></i>
                                <div class="min-w-0">
                                    <p id="upload-file-name" class="text-[12pt] font-bold text-gnome-black dark:text-gnome-white truncate">extension.zip</p>
                                    <p id="upload-file-size" class="text-[12pt] text-gnome-grey truncate">0 KB</p>
                                </div>
                            </div>
                            <button type="button" id="upload-remove-file" class="gnome-btn-icon hover:text-gnome-red" title="Remove file">
                                <i class="icon icon-close text-lg"></i>
                            </button>
                        </div>

                        <button type="button" id="upload-submit-btn" class="gnome-btn-primary w-full py-3" disabled>
                          Submit Extension
                        </button>
                      </form>
                    </div>
                </div>

                <!-- Tab 4: Account Settings -->
                <div id="view-account-settings" class="upload-view-pane hidden animate-fade-in">
                    <div class="max-w-3xl space-y-8">
                        <div class="gnome-card-panel p-6 sm:p-8">
                            <h3 class="gnome-title-section mb-2">Account Information</h3>
                            <p class="text-sm text-gnome-grey mb-6">Your unique identifiers for development and maintainer requests.</p>
                            
                            <div class="mb-4">
                                <label class="block text-sm font-bold text-gnome-black dark:text-gnome-white mb-2">User ID (Provide this to authors to be added as a maintainer)</label>
                                <div class="flex items-center gap-2">
                                    <input type="text" readonly value="${this.escapeHtml(currentUserId)}" class="gnome-input font-mono bg-[#f6f5f4] dark:bg-[#241F31]">
                                    <button class="gnome-btn-primary shrink-0" onclick="navigator.clipboard.writeText('${this.escapeHtml(currentUserId)}')">Copy ID</button>
                                </div>
                            </div>
                        </div>

                        <div class="gnome-card-panel p-6 sm:p-8 border-gnome-red/50">
                            <h3 class="text-xl font-extrabold text-gnome-red mb-2">Danger Zone</h3>
                            <p class="text-sm text-gnome-grey mb-6">Permanently delete your account and all associated data. This action cannot be undone.</p>
                            
                            <div id="delete-account-step-1">
                                <button id="btn-init-delete" class="gnome-btn-danger">Delete Account</button>
                            </div>

                            <div id="delete-account-step-2" class="hidden bg-gnome-red/10 border border-gnome-red/30 p-4 rounded-lg">
                                <p class="font-bold text-gnome-red mb-3">Are you absolutely sure?</p>
                                <p class="text-sm text-gnome-black dark:text-[#c0bfbc] mb-4">This will permanently delete your account, remove your maintainer status from all extensions, and orphan any extensions you authored.</p>
                                <div class="flex items-center gap-3">
                                    <button id="btn-confirm-delete" class="gnome-btn-danger-filled">Yes, delete my account</button>
                                    <button id="btn-cancel-delete" class="gnome-btn-ghost border-transparent">Cancel</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        `;

        this.bindEvents();
    }

    renderExtensionsList() {
        return this.mockData.extensions.map(ext => {
            let statusBadge = '';
            if (ext.status === 'Active') statusBadge = `<span class="w-3 h-3 rounded-full bg-gnome-green" title="Active"></span>`;
            else if (ext.status === 'Pending') statusBadge = `<span class="w-3 h-3 rounded-full bg-gnome-orange" title="Pending EGO Review"></span>`;
            else statusBadge = `<span class="w-3 h-3 rounded-full bg-gnome-red" title="Rejected"></span>`;

            return `
                <div class="border-b border-[#c0bfbc] dark:border-[#3d3846] last:border-0">
                    <!-- Row Header (Clickable Accordion) -->
                    <div data-action="toggle-manage" data-id="${this.escapeHtml(ext.id)}" class="flex items-center justify-between p-4 hover:bg-[#f6f5f4] dark:hover:bg-[#322b47] transition-colors cursor-pointer select-none">
                        <div class="flex items-center gap-4 sm:gap-6 w-full">
                            <div class="flex-1 min-w-0">
                                <div class="flex items-center gap-2">
                                    <p class="font-bold text-[12pt] text-gnome-black dark:text-gnome-white truncate">${this.escapeHtml(ext.name)}</p>
                                    <span class="bg-[#deddda] dark:bg-[#3d3846] text-gnome-grey dark:text-[#c0bfbc] text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full border border-[#c0bfbc] dark:border-[#5e5c64] shrink-0">${this.escapeHtml(ext.role)}</span>
                                </div>
                                <p class="text-sm text-gnome-grey truncate mt-0.5">${this.escapeHtml(ext.uuid)}</p>
                            </div>
                            
                            <div class="w-24 shrink-0 flex items-center gap-2">
                                ${statusBadge}
                                <span class="text-sm font-bold text-gnome-black dark:text-gnome-white">${this.escapeHtml(ext.status)}</span>
                            </div>

                            <div class="flex items-center justify-end gap-1.5 shrink-0">
                                <button type="button" data-action="view-review" data-id="${this.escapeHtml(ext.id)}" class="gnome-btn-icon hover:bg-[#deddda] dark:hover:bg-[#5e5c64]" title="View EGO Review Log"><i class="icon icon-review-complete"></i></button>
                                <div class="w-8 flex justify-center">
                                    <i id="chevron-${this.escapeHtml(ext.id)}" class="icon icon-angles-down text-xl text-gnome-grey transition-transform duration-300"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Inline Panels -->
                    <div id="manage-panel-${this.escapeHtml(ext.id)}" class="hidden bg-[#f6f5f4] dark:bg-[#241F31] p-6 shadow-inner border-t border-[#c0bfbc] dark:border-[#3d3846]"></div>
                    <div id="review-panel-${this.escapeHtml(ext.id)}" class="hidden bg-[#f6f5f4] dark:bg-[#241F31] p-6 shadow-inner border-t border-[#c0bfbc] dark:border-[#3d3846]"></div>
                </div>
            `;
        }).join('');
    }

    renderManageExtension(extId) {
        const ext = this.mockData.extensions.find(e => e.id === extId);
        if (!ext) return '';

        const versionsHtml = ext.versions.map(v => `
            <div class="flex items-center justify-between p-3 border-b border-[#c0bfbc] dark:border-[#5e5c64] last:border-0">
                <div class="flex items-center gap-3">
                    <span class="font-mono font-bold text-gnome-black dark:text-gnome-white">v${v.version}</span>
                    <span class="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${v.status === 'Active' ? 'bg-gnome-green/15 text-gnome-green' : 'bg-gnome-orange/15 text-gnome-orange'}">${v.status}</span>
                </div>
                <div class="flex items-center gap-3">
                    <span class="text-sm font-bold text-gnome-grey">${v.status === 'Active' ? 'Activated' : 'Inactive'}</span>
                    <button type="button" class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${v.status === 'Active' ? 'bg-gnome-blue' : 'bg-[#c0bfbc] dark:bg-[#3d3846]'}" role="switch">
                        <span class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${v.status === 'Active' ? 'translate-x-6' : 'translate-x-1'}"></span>
                    </button>
                </div>
            </div>
        `).join('');

        return `
            <div class="flex items-center justify-between mb-6">
                <h2 class="text-xl font-extrabold text-gnome-black dark:text-gnome-white m-0">Manage Extension</h2>
                <button class="gnome-btn-primary">Save Changes</button>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div class="lg:col-span-2 space-y-8">
                    
                    <!-- Media Uploads -->
                    <div class="gnome-card-panel border-[#c0bfbc] dark:border-[#5e5c64] p-6">
                        <h3 class="gnome-title-uppercase-clean mb-4">Media</h3>
                        <div class="space-y-6">
                            <div>
                                <label class="block text-sm font-bold text-gnome-black dark:text-gnome-white mb-2">Project Icon / Avatar</label>
                                <div class="flex items-center gap-4">
                                    <div class="w-16 h-16 rounded-xl bg-white dark:bg-gnome-black border border-[#c0bfbc] dark:border-[#5e5c64] flex items-center justify-center text-gnome-grey">
                                        <i class="icon icon-image-file text-2xl"></i>
                                    </div>
                                    <button class="px-4 py-2 font-bold text-sm bg-white dark:bg-[#3d3846] hover:bg-[#deddda] dark:hover:bg-[#5e5c64] border border-[#c0bfbc] dark:border-[#5e5c64] rounded-lg transition-colors">Upload Icon</button>
                                </div>
                            </div>
                            
                            <div>
                                <label class="block text-sm font-bold text-gnome-black dark:text-gnome-white mb-2">Screenshots</label>
                                <div class="bg-white dark:bg-gnome-black border-2 border-dashed border-[#c0bfbc] dark:border-[#5e5c64] rounded-xl p-8 text-center hover:border-gnome-blue transition-colors cursor-pointer">
                                    <i class="icon icon-upload text-3xl text-gnome-grey mb-2"></i>
                                    <p class="text-sm font-bold text-gnome-black dark:text-gnome-white">Click to upload or drag and drop</p>
                                    <p class="text-xs text-gnome-grey mt-1">PNG, JPG, or WEBM (Max 5MB)</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Metadata -->
                    <div class="gnome-card-panel border-[#c0bfbc] dark:border-[#5e5c64] p-6">
                        <h3 class="gnome-title-uppercase-clean mb-4">Metadata</h3>
                        <div class="space-y-4">
                            <div>
                                <label class="block text-sm font-bold text-gnome-black dark:text-gnome-white mb-1">Categories</label>
                                <select class="gnome-select w-full bg-white dark:bg-gnome-black" multiple size="4">
                                    <option value="utilities" ${ext.categories.includes('Utilities') ? 'selected' : ''}>Utilities</option>
                                    <option value="window-management" ${ext.categories.includes('Window Management') ? 'selected' : ''}>Window Management</option>
                                    <option value="customization">Customization</option>
                                    <option value="system-monitor">System Monitor</option>
                                </select>
                                <p class="text-xs text-gnome-grey mt-1">Hold Ctrl (or Cmd) to select multiple.</p>
                            </div>
                        </div>
                    </div>

                    <!-- Ownership & Maintainers -->
                    <div class="gnome-card-panel border-[#c0bfbc] dark:border-[#5e5c64] p-6">
                        <h3 class="gnome-title-uppercase-clean mb-4">Ownership & Access</h3>
                        
                        <div class="space-y-6">
                            <div>
                                <label class="block text-sm font-bold text-gnome-black dark:text-gnome-white mb-2">Maintainers</label>
                                <div class="flex flex-wrap gap-2 mb-3">
                                    ${ext.maintainers.map(m => `
                                        <span class="inline-flex items-center gap-2 bg-white dark:bg-gnome-black border border-[#c0bfbc] dark:border-[#5e5c64] px-3 py-1 rounded-full text-sm font-bold">
                                            ${this.escapeHtml(m)}
                                            ${m !== ext.author ? `<i class="icon icon-close hover:text-gnome-red cursor-pointer"></i>` : `<span class="text-[9px] uppercase text-gnome-grey">Author</span>`}
                                        </span>
                                    `).join('')}
                                </div>
                                <div class="flex items-center gap-2">
                                    <input type="text" placeholder="Enter User ID to add maintainer" class="gnome-input bg-white dark:bg-gnome-black flex-1">
                                    <button class="px-4 py-2 font-bold text-sm bg-gnome-blue text-white rounded-lg hover:bg-[#1c71d8] transition-colors">Add</button>
                                </div>
                            </div>
                            
                            <div class="border-t border-[#c0bfbc] dark:border-[#5e5c64] pt-4">
                                <button class="px-4 py-2 font-bold text-sm text-gnome-orange border border-gnome-orange hover:bg-gnome-orange hover:text-white rounded-lg transition-colors">Transfer Ownership</button>
                            </div>
                        </div>
                    </div>

                    <!-- Danger Zone -->
                    <div class="gnome-card-panel bg-gnome-white dark:bg-gnome-black p-6 border-gnome-red/50">
                        <h3 class="text-lg font-extrabold text-gnome-red mb-2">Delete Extension</h3>
                        <p class="text-sm text-gnome-grey mb-4">Permanently remove this extension and all its versions from the store.</p>
                        <button class="gnome-btn-danger">Delete Extension</button>
                    </div>

                </div>

                <!-- Right Column: Stats & Versions -->
                <div class="space-y-8">
                    <!-- Stats Box -->
                    <div class="gnome-card-panel border-[#c0bfbc] dark:border-[#5e5c64] p-6">
                        <h3 class="gnome-title-uppercase-clean mb-4">Statistics</h3>
                        <dl class="space-y-4 text-sm">
                            <div>
                                <dt class="text-gnome-grey font-semibold">Your Role</dt>
                                <dd class="font-bold text-gnome-black dark:text-gnome-white mt-0.5">${this.escapeHtml(ext.role)}</dd>
                            </div>
                            <div>
                                <dt class="text-gnome-grey font-semibold">Total Downloads</dt>
                                <dd class="font-bold text-gnome-black dark:text-gnome-white mt-0.5">${ext.downloads.toLocaleString()}</dd>
                            </div>
                            <div>
                                <dt class="text-gnome-grey font-semibold">Ratings</dt>
                                <dd class="font-bold text-gnome-black dark:text-gnome-white mt-0.5"><i class="icon icon-star text-gnome-orange"></i> ${ext.rating.toFixed(1)} (${ext.ratingCount} total)</dd>
                            </div>
                            <div>
                                <dt class="text-gnome-grey font-semibold">Last Updated</dt>
                                <dd class="font-bold text-gnome-black dark:text-gnome-white mt-0.5">${this.escapeHtml(ext.lastUpdated)}</dd>
                            </div>
                        </dl>
                    </div>

                    <!-- Version List -->
                    <div class="gnome-card-panel border-[#c0bfbc] dark:border-[#5e5c64] p-0 overflow-hidden">
                        <div class="p-4 border-b border-[#c0bfbc] dark:border-[#5e5c64] bg-white dark:bg-[#2d2640]">
                            <h3 class="text-sm font-bold text-gnome-grey uppercase tracking-wider m-0">Versions</h3>
                        </div>
                        <div class="flex flex-col bg-white dark:bg-gnome-black">
                            ${versionsHtml}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderReviewsInbox(filterId) {
        let reviews = this.mockData.reviews;
        if (filterId !== 'all') {
            reviews = reviews.filter(r => r.extId === filterId);
        }
        
        if (reviews.length === 0) {
            return `<div class="p-8 text-center text-gnome-grey border border-[#c0bfbc] dark:border-[#3d3846] rounded-xl bg-[#f6f5f4] dark:bg-[#241F31]">No reviews found.</div>`;
        }

        return reviews.map(r => `
            <div class="gnome-card-panel p-5">
                <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-3">
                    <div>
                        <div class="flex items-center gap-2 mb-1">
                            <span class="font-bold text-gnome-black dark:text-gnome-white">${this.escapeHtml(r.user)}</span>
                            <span class="text-xs text-gnome-grey px-1.5 py-0.5 bg-[#f6f5f4] dark:bg-[#3d3846] rounded">on ${this.escapeHtml(r.extName)}</span>
                        </div>
                        <div class="text-xs text-gnome-grey">${this.escapeHtml(r.date)}</div>
                    </div>
                    <div class="text-gnome-orange font-bold"><i class="icon icon-star"></i> ${r.rating}.0</div>
                </div>
                <p class="text-sm text-gnome-black dark:text-[#c0bfbc] mb-4">${this.escapeHtml(r.text)}</p>
                
                <div class="border-t border-[#c0bfbc]/50 dark:border-[#3d3846]/50 pt-3">
                    <button class="text-sm font-bold text-gnome-blue hover:underline"><i class="icon icon-message-new"></i> Reply as Maintainer</button>
                </div>
            </div>
        `).join('');
    }

    renderEGOReview(extId, activeFilename = null) {
        const data = this.mockData.reviewLog[extId];
        if (!data) return '<p class="text-gnome-grey">No review log found.</p>';

        const filename = activeFilename || (data.files.length > 0 ? data.files[0].name : '');
        const selectedFile = data.files.find(f => f.name === filename);

        const commentsHtml = data.comments.map(c => {
            let dotColor = 'bg-[#c0bfbc] dark:bg-[#5e5c64]';
            if (c.type === 'approved') dotColor = 'bg-gnome-green';
            if (c.type === 'rejected') dotColor = 'bg-gnome-red';
            if (c.type === 'author') dotColor = 'bg-gnome-blue';
            
            return `
                <div class="gnome-card-panel border-[#c0bfbc] dark:border-[#5e5c64] p-4 mb-3 bg-white dark:bg-gnome-black">
                    <div class="flex items-center justify-between mb-2">
                        <div class="flex items-center gap-2">
                            <span class="w-2.5 h-2.5 rounded-full ${dotColor}"></span>
                            <span class="font-bold text-sm text-gnome-black dark:text-gnome-white">${this.escapeHtml(c.author)}</span>
                        </div>
                        <span class="text-xs text-gnome-grey">${this.escapeHtml(c.date)}</span>
                    </div>
                    <p class="text-sm text-gnome-black dark:text-[#c0bfbc]">${this.escapeHtml(c.text)}</p>
                </div>
            `;
        }).join('');

        let filesHtml = '';
        if (selectedFile) {
            filesHtml = `
                <div class="p-2 border-b border-[#c0bfbc] dark:border-[#5e5c64] bg-[#deddda] dark:bg-[#3d3846] flex justify-between items-center">
                    <span class="font-bold font-mono text-sm text-gnome-black dark:text-gnome-white">${this.escapeHtml(selectedFile.name)}</span>
                    <div class="text-xs">
                        ${selectedFile.additions > 0 ? `<span class="text-gnome-green font-bold mr-2">+${selectedFile.additions}</span>` : ''}
                        ${selectedFile.deletions > 0 ? `<span class="text-gnome-red font-bold">-${selectedFile.deletions}</span>` : ''}
                    </div>
                </div>
                <div class="bg-white dark:bg-gnome-black overflow-x-auto h-[13.5rem] font-mono text-sm pb-2">
                    ${this.generateDiffHtml(selectedFile.diff)}
                </div>
            `;
        }

        const fileListHtml = data.files.map(file => {
            const isActive = file.name === filename;
            const bgClass = isActive ? 'bg-white dark:bg-gnome-black border-l-gnome-blue' : 'border-l-transparent hover:bg-white dark:hover:bg-gnome-black';
            const textClass = file.status === 'unchanged' && !isActive ? 'text-gnome-grey' : 'text-gnome-black dark:text-gnome-white';
            
            let statsHtml = '';
            if (file.status === 'modified') {
                statsHtml = `
                    <div class="flex gap-2 text-xs font-bold shrink-0">
                        ${file.additions > 0 ? `<span class="text-gnome-green">+${file.additions}</span>` : ''}
                        ${file.deletions > 0 ? `<span class="text-gnome-red">-${file.deletions}</span>` : ''}
                    </div>
                `;
            }

            return `
                <li class="cursor-pointer px-3 py-2 border-b border-[#c0bfbc] dark:border-[#5e5c64] flex justify-between items-center transition-colors border-l-4 ${bgClass}" data-filename="${this.escapeHtml(file.name)}" data-target="${this.escapeHtml(extId)}">
                    <span class="font-mono text-sm ${textClass} truncate pr-2">${this.escapeHtml(file.name)}</span>
                    ${statsHtml}
                </li>
            `;
        }).join('');

        const warningsHtml = (data.warnings || []).map(warn => {
            return `<span class="inline-flex items-center gap-1.5 bg-gnome-orange/15 text-gnome-orange border border-gnome-orange/20 px-2 py-0.5 rounded-md text-xs font-bold" title="Security Warning"><i class="icon icon-exclamation-color"></i> ${this.escapeHtml(warn)}</span>`;
        }).join('');

        // Alternative versions mock list
        const extData = this.mockData.extensions.find(e => e.id === extId);
        const altVersionsHtml = (extData?.versions || []).map(v => `<a href="#" class="text-gnome-blue hover:underline text-sm font-bold block mb-1">Version ${v.version}</a>`).join('');

        return `
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4 border-b border-[#c0bfbc] dark:border-[#5e5c64] pb-4">
                <div>
                    <h2 class="text-xl font-extrabold text-gnome-black dark:text-gnome-white m-0">${this.escapeHtml(data.title)}</h2>
                    <p class="text-sm text-gnome-grey mt-1">Author: <span class="font-bold text-gnome-black dark:text-gnome-white">${this.escapeHtml(data.author)}</span></p>
                </div>
                <button class="gnome-btn-primary shrink-0"><i class="icon icon-download-color mr-2"></i> Download Package</button>
            </div>
            
            <!-- Package Info Box -->
            <div class="gnome-card-panel border-[#c0bfbc] dark:border-[#5e5c64] p-4 mb-6 bg-white dark:bg-[#2d2640]">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <div class="text-sm text-gnome-grey mb-1">Project Links</div>
                        <div class="flex flex-col gap-1">
                            <a href="${this.escapeHtml(data.url)}" target="_blank" class="text-gnome-blue hover:underline text-sm font-bold truncate"><i class="icon icon-link mr-1"></i> ${this.escapeHtml(data.url)}</a>
                            <a href="${this.escapeHtml(data.bugTracker)}" target="_blank" class="text-gnome-blue hover:underline text-sm font-bold truncate"><i class="icon icon-exclamation mr-1"></i> Bug Tracker</a>
                        </div>
                    </div>
                    <div>
                        <div class="text-sm text-gnome-grey mb-1">System Checks</div>
                        <div class="flex flex-col gap-2">
                            <div class="flex items-center gap-2">
                                <span class="text-sm font-bold text-gnome-black dark:text-gnome-white">Name Availability:</span>
                                ${data.nameAvailable ? `<span class="text-gnome-green font-bold text-sm flex items-center"><i class="icon icon-check mr-1"></i> Passed</span>` : `<span class="text-gnome-red font-bold text-sm flex items-center"><i class="icon icon-error mr-1"></i> Conflict</span>`}
                            </div>
                            <div class="flex flex-wrap gap-1.5">
                                ${warningsHtml}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 xl:grid-cols-12 gap-8">
                
                <!-- Left: Source Code Diff & Versions -->
                <div class="xl:col-span-8">
                    <h4 class="text-sm font-bold text-gnome-grey uppercase tracking-wider mb-3">Source Code Validation</h4>
                    <div class="gnome-card-panel overflow-hidden flex flex-col md:flex-row border-[#c0bfbc] dark:border-[#5e5c64] mb-6 h-80">
                        <div class="w-full md:w-1/3 border-b md:border-b-0 md:border-r border-[#c0bfbc] dark:border-[#5e5c64] bg-[#deddda] dark:bg-[#3d3846]">
                            <div class="p-2 border-b border-[#c0bfbc] dark:border-[#5e5c64]">
                                <span class="text-xs font-bold text-gnome-grey uppercase tracking-wider">Files</span>
                            </div>
                            <ul class="flex flex-col h-[17.5rem] overflow-y-auto scrollbar-hide bg-[#f6f5f4] dark:bg-[#241F31]">
                                ${fileListHtml}
                            </ul>
                        </div>
                        <div class="w-full md:w-2/3 bg-white dark:bg-gnome-black flex flex-col h-full">
                            ${filesHtml}
                        </div>
                    </div>
                    
                    <div class="gnome-card-panel border-[#c0bfbc] dark:border-[#5e5c64] p-4 bg-white dark:bg-[#2d2640]">
                        <h4 class="text-sm font-bold text-gnome-grey uppercase tracking-wider mb-2">Alternative Versions</h4>
                        <div class="flex flex-wrap gap-4">
                            ${altVersionsHtml}
                        </div>
                    </div>
                </div>

                <!-- Right: Review Log -->
                <div class="xl:col-span-4">
                    <h4 class="text-sm font-bold text-gnome-grey uppercase tracking-wider mb-3">Review Log</h4>
                    ${commentsHtml}
                    <div class="gnome-card-panel border-[#c0bfbc] dark:border-[#5e5c64] p-4 mt-4 bg-white dark:bg-gnome-black">
                        <textarea class="gnome-input mb-3 resize-y bg-[#f6f5f4] dark:bg-[#241F31]" rows="4" placeholder="Reply to reviewer..."></textarea>
                        <div class="text-right">
                            <button class="gnome-btn-primary">Submit Reply</button>
                        </div>
                    </div>
                </div>

            </div>
        `;
    }

    generateDiffHtml(lines) {
        return lines.map(line => {
            let rowBg = 'bg-transparent';
            let numBg = 'text-gnome-grey opacity-40';
            let textStyle = 'text-gnome-black dark:text-gnome-white opacity-80';
            
            if (line.type === 'add') {
                rowBg = 'bg-gnome-green/10 dark:bg-gnome-green/15';
                numBg = 'bg-gnome-green/20 text-gnome-green dark:bg-gnome-green/25 font-bold opacity-100';
                textStyle = 'text-gnome-green font-semibold opacity-100';
            } else if (line.type === 'delete') {
                rowBg = 'bg-gnome-red/10 dark:bg-gnome-red/15';
                numBg = 'bg-gnome-red/20 text-gnome-red dark:bg-gnome-red/25 font-bold opacity-100';
                textStyle = 'text-gnome-red line-through opacity-100';
            }

            return `
                <div class="table-row ${rowBg}">
                    <div class="table-cell w-10 sm:w-12 text-right select-none pr-2 sm:pr-3 py-0.5 border-r border-[#c0bfbc]/20 dark:border-[#3d3846]/40 ${numBg}">${line.oldLine || ''}</div>
                    <div class="table-cell w-10 sm:w-12 text-right select-none px-2 sm:px-3 py-0.5 border-r border-[#c0bfbc]/20 dark:border-[#3d3846]/40 ${numBg}">${line.newLine || ''}</div>
                    <div class="table-cell pl-3 sm:pl-4 pr-4 py-0.5 whitespace-pre ${textStyle}">${this.escapeHtml(line.text)}</div>
                </div>
            `;
        }).join('');
    }

    bindEvents() {
        // Tab Navigation
        const tabs = this.container.querySelectorAll('[data-tab-target]');
        const panes = this.container.querySelectorAll('.upload-view-pane');
        
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const target = tab.getAttribute('data-tab-target');
                
                tabs.forEach(t => {
                    t.classList.remove('active', 'text-gnome-blue', 'border-gnome-blue');
                    t.classList.add('text-[#5e5c64]', 'dark:text-[#c0bfbc]', 'border-transparent');
                });
                tab.classList.add('active', 'text-gnome-blue', 'border-gnome-blue');
                tab.classList.remove('text-[#5e5c64]', 'dark:text-[#c0bfbc]', 'border-transparent');
                
                panes.forEach(p => {
                    p.classList.add('hidden');
                    p.classList.remove('block');
                });

                document.getElementById(`view-${target}`).classList.remove('hidden');
                document.getElementById(`view-${target}`).classList.add('block');
                
                if (target !== 'my-extensions') {
                    // Force close all accordion panels when navigating away
                    this.container.querySelectorAll('[id^="manage-panel-"], [id^="review-panel-"]').forEach(p => p.classList.add('hidden'));
                    this.container.querySelectorAll('[id^="chevron-"]').forEach(c => c.classList.remove('rotate-180'));
                }
            });
        });

        // Event delegation for the extensions list (Accordion logic)
        const extList = document.getElementById('dashboard-extensions-list');
        if (extList) {
            extList.addEventListener('click', (e) => {
                const toggleRow = e.target.closest('[data-action="toggle-manage"]');
                const reviewBtn = e.target.closest('[data-action="view-review"]');

                if (reviewBtn) {
                    e.stopPropagation();
                    const id = reviewBtn.getAttribute('data-id');
                    const managePanel = document.getElementById(`manage-panel-${id}`);
                    const reviewPanel = document.getElementById(`review-panel-${id}`);
                    const chevron = document.getElementById(`chevron-${id}`);

                    if (reviewPanel.classList.contains('hidden')) {
                        // Close any other open panels globally
                        this.container.querySelectorAll('[id^="manage-panel-"], [id^="review-panel-"]').forEach(p => { p.classList.add('hidden'); p.innerHTML = ''; });
                        this.container.querySelectorAll('[id^="chevron-"]').forEach(c => c.classList.remove('rotate-180'));

                        reviewPanel.innerHTML = this.renderEGOReview(id);
                        reviewPanel.classList.remove('hidden');
                        managePanel.classList.add('hidden');
                        chevron.classList.add('rotate-180');
                    } else {
                        reviewPanel.classList.add('hidden');
                        reviewPanel.innerHTML = '';
                        chevron.classList.remove('rotate-180');
                    }
                    return;
                }

                if (toggleRow) {
                    const id = toggleRow.getAttribute('data-id');
                    const managePanel = document.getElementById(`manage-panel-${id}`);
                    const reviewPanel = document.getElementById(`review-panel-${id}`);
                    const chevron = document.getElementById(`chevron-${id}`);

                    if (managePanel.classList.contains('hidden')) {
                        // Close any other open panels globally
                        this.container.querySelectorAll('[id^="manage-panel-"], [id^="review-panel-"]').forEach(p => { p.classList.add('hidden'); p.innerHTML = ''; });
                        this.container.querySelectorAll('[id^="chevron-"]').forEach(c => c.classList.remove('rotate-180'));

                        managePanel.innerHTML = this.renderManageExtension(id);
                        managePanel.classList.remove('hidden');
                        reviewPanel.classList.add('hidden');
                        chevron.classList.add('rotate-180');
                    } else {
                        managePanel.classList.add('hidden');
                        managePanel.innerHTML = '';
                        chevron.classList.remove('rotate-180');
                    }
                }
            });
        }

        // Event delegation for review file clicking
        this.container.addEventListener('click', (e) => {
            const fileItem = e.target.closest('li[data-filename]');
            if (fileItem) {
                const targetExt = fileItem.getAttribute('data-target');
                const filename = fileItem.getAttribute('data-filename');
                const reviewPanel = document.getElementById(`review-panel-${targetExt}`);
                
                if (reviewPanel && !reviewPanel.classList.contains('hidden')) {
                    reviewPanel.innerHTML = this.renderEGOReview(targetExt, filename);
                }
            }
        });

        // Reviews Inbox Filter
        const filterSelect = document.getElementById('review-filter-select');
        const inboxContainer = document.getElementById('reviews-inbox-container');
        if (filterSelect && inboxContainer) {
            filterSelect.addEventListener('change', (e) => {
                inboxContainer.innerHTML = this.renderReviewsInbox(e.target.value);
            });
        }

        // Account Settings: Delete Account Workflow
        const btnInitDel = document.getElementById('btn-init-delete');
        const btnCancelDel = document.getElementById('btn-cancel-delete');
        const step1 = document.getElementById('delete-account-step-1');
        const step2 = document.getElementById('delete-account-step-2');
        
        if (btnInitDel && btnCancelDel) {
            btnInitDel.addEventListener('click', () => {
                step1.classList.add('hidden');
                step2.classList.remove('hidden');
            });
            btnCancelDel.addEventListener('click', () => {
                step2.classList.add('hidden');
                step1.classList.remove('hidden');
            });
        }

        // Submit New Extension Upload UI
        const dropzone = document.getElementById('upload-dropzone');
        const fileInput = document.getElementById('upload-file-input');
        const fileInfo = document.getElementById('upload-file-info');
        const fileName = document.getElementById('upload-file-name');
        const fileSize = document.getElementById('upload-file-size');
        const removeFileBtn = document.getElementById('upload-remove-file');
        const submitBtn = document.getElementById('upload-submit-btn');

        if (dropzone && fileInput) {
            dropzone.addEventListener('click', () => fileInput.click());
            
            dropzone.addEventListener('dragover', (e) => { e.preventDefault(); dropzone.classList.add('border-gnome-blue'); });
            dropzone.addEventListener('dragleave', (e) => { e.preventDefault(); dropzone.classList.remove('border-gnome-blue'); });
            
            dropzone.addEventListener('drop', (e) => {
                e.preventDefault();
                dropzone.classList.remove('border-gnome-blue');
                if (e.dataTransfer.files.length) {
                    fileInput.files = e.dataTransfer.files;
                    updateFileUI(e.dataTransfer.files[0]);
                }
            });

            fileInput.addEventListener('change', (e) => {
                if (e.target.files.length) updateFileUI(e.target.files[0]);
            });
        }

        const updateFileUI = (file) => {
            if (file) {
                dropzone.classList.add('hidden');
                fileInfo.classList.remove('hidden');
                fileInfo.classList.add('flex');
                fileName.textContent = file.name;
                fileSize.textContent = (file.size / 1024).toFixed(2) + ' KB';
                submitBtn.disabled = false;
            } else {
                dropzone.classList.remove('hidden');
                fileInfo.classList.add('hidden');
                fileInfo.classList.remove('flex');
                fileName.textContent = '';
                fileSize.textContent = '';
                submitBtn.disabled = true;
            }
        };

        if (removeFileBtn) {
            removeFileBtn.addEventListener('click', () => { fileInput.value = ''; updateFileUI(null); });
        }

        if (submitBtn) {
            submitBtn.addEventListener('click', () => {
                submitBtn.innerHTML = '<i class="icon icon-update-all mr-2"></i> Uploading...';
                submitBtn.disabled = true;
                
                setTimeout(() => {
                    submitBtn.innerHTML = '<i class="icon icon-check mr-2"></i> Successfully Uploaded';
                    submitBtn.classList.replace('bg-gnome-blue', 'bg-gnome-green');
                    submitBtn.classList.replace('hover:bg-[#1c71d8]', 'hover:bg-[#2ebc6c]');
                    
                    setTimeout(() => {
                        fileInput.value = '';
                        updateFileUI(null);
                        submitBtn.innerHTML = 'Submit Extension';
                        submitBtn.classList.replace('bg-gnome-green', 'bg-gnome-blue');
                        submitBtn.classList.replace('hover:bg-[#2ebc6c]', 'hover:bg-[#1c71d8]');
                        
                        const myExtTab = this.container.querySelector('[data-tab-target="my-extensions"]');
                        if (myExtTab) myExtTab.click();
                    }, 2000);
                }, 1500);
            });
        }
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

window.UploadView = UploadView;