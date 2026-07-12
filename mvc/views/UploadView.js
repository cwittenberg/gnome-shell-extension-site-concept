/**
 * GNOME Brand Book Alignment:
 * - Typography: Header 1 uses 24pt, Header 3 uses 18pt, and Body Text uses 12pt (Inter font via standard classes)[cite: 2].
 * - Color: Primary Blue #3584e4 is used for active tabs, inline controls, and line numbers[cite: 2].
 * - Color: Secondary Green #33D17A, Orange #FF7800, and Red #E01B24 are used for status dots and diff blocks[cite: 2].
 * - Style: Added EGO-style file navigation and comment threads natively integrated using GNOME Boxed Lists and distinct panel sections.
 */

class UploadView {
    constructor() {
        this.container = document.getElementById('upload-view');
        
        // Mock Data to support EGO-style file navigation, diff viewing, and review logs
        this.mockReviewData = {
            snaptext: {
                title: "Review: Snap Text Extractor (v10)",
                comments: [
                    { 
                        author: "EGO Reviewer (EGO-Admin)", 
                        date: "2 days ago", 
                        type: "approved", 
                        text: "Confirmation: Code review passed GNOME extension architecture requirements perfectly. The implementation of connectObject() is clean and tracking cleanup functions are fully unbound on disable." 
                    }
                ],
                files: [
                    { 
                        name: "extension.js", 
                        status: "modified", 
                        additions: 1, 
                        deletions: 1, 
                        diff: [
                            { type: 'normal', oldLine: 42, newLine: 42, text: '    enable() {' },
                            { type: 'normal', oldLine: 43, newLine: 43, text: '        this._settings = ExtensionUtils.getSettings();' },
                            { type: 'delete', oldLine: 44, newLine: '', text: '-       this._settings.connect(\'changed\', () => { this._update(); });' },
                            { type: 'add', oldLine: '', newLine: 44, text: '+       this._settings.connectObject(\'changed\', () => this._update(), this);' },
                            { type: 'normal', oldLine: 45, newLine: 45, text: '    }' }
                        ]
                    },
                    { 
                        name: "metadata.json", 
                        status: "modified", 
                        additions: 1, 
                        deletions: 1, 
                        diff: [
                            { type: 'normal', oldLine: 2, newLine: 2, text: '    "name": "Snap Text Extractor",' },
                            { type: 'delete', oldLine: 3, newLine: '', text: '-    "version": 9,' },
                            { type: 'add', oldLine: '', newLine: 3, text: '+    "version": 10,' },
                            { type: 'normal', oldLine: 4, newLine: 4, text: '    "uuid": "snaptext@cwittenberg"' }
                        ]
                    },
                    { 
                        name: "prefs.js", 
                        status: "unchanged", 
                        additions: 0, 
                        deletions: 0, 
                        diff: [
                            { type: 'normal', oldLine: 1, newLine: 1, text: '// No changes detected in this file' },
                            { type: 'normal', oldLine: 2, newLine: 2, text: 'export default class Prefs {' },
                            { type: 'normal', oldLine: 3, newLine: 3, text: '    fillPreferencesWindow(window) {' },
                            { type: 'normal', oldLine: 4, newLine: 4, text: '        // ...' },
                            { type: 'normal', oldLine: 5, newLine: 5, text: '    }' },
                            { type: 'normal', oldLine: 6, newLine: 6, text: '}' }
                        ]
                    }
                ]
            },
            omnipanel: {
                title: "Review: OmniPanel (v11)",
                comments: [
                    { 
                        author: "EGO Reviewer (EGO-Admin)", 
                        date: "1 week ago", 
                        type: "rejected", 
                        text: "Rejection: Please ensure you are disconnecting all signals in the disable() block. There is a persistent memory leak detected because an anonymous window tracking function remains bound globally. All code must pass EGO guideline reviews." 
                    },
                    { 
                        author: "cwittenberg (You)", 
                        date: "3 days ago", 
                        type: "author", 
                        text: "Thanks for the feedback. I've uploaded a new patch that replaces the anonymous callbacks with disconnectObject() bindings. Could you please re-review?" 
                    }
                ],
                files: [
                    { 
                        name: "extension.js", 
                        status: "modified", 
                        additions: 2, 
                        deletions: 1, 
                        diff: [
                            { type: 'normal', oldLine: 89, newLine: 89, text: '    disable() {' },
                            { type: 'delete', oldLine: 90, newLine: '', text: '-       // TODO: clean up layout listeners later' },
                            { type: 'add', oldLine: '', newLine: 90, text: '+       global.display.disconnectObject(this);' },
                            { type: 'add', oldLine: '', newLine: 91, text: '+       this._windowTracker = null;' },
                            { type: 'normal', oldLine: 91, newLine: 92, text: '    }' }
                        ]
                    },
                    { 
                        name: "windowManager.js", 
                        status: "unchanged", 
                        additions: 0, 
                        deletions: 0, 
                        diff: [
                            { type: 'normal', oldLine: 1, newLine: 1, text: '// No changes detected in this file' }
                        ]
                    }
                ]
            }
        };
    }

    render() {
        if (!this.container) return;
        this.container.innerHTML = `
            <div class="max-w-5xl mx-auto px-4 sm:px-6 pt-10">
                
                <div class="mb-8">
                    <h1 class="text-[24pt] font-extrabold text-gnome-black dark:text-gnome-white mb-2 tracking-tight">Developer Dashboard</h1>
                    <p class="text-[12pt] font-medium text-gnome-grey">Manage your extensions and track their review process.</p>
                </div>

                <!-- Dev Tabs UI -->
                <div class="flex gap-6 border-b border-[#c0bfbc] dark:border-[#3d3846] mb-8 overflow-x-auto scrollbar-hide">
                    <button id="tab-my-extensions" class="upload-tab-btn active pb-3 font-bold text-[12pt] text-gnome-blue border-b-2 border-gnome-blue whitespace-nowrap focus:outline-none">
                        My Extensions
                    </button>
                    <button id="tab-upload-new" class="upload-tab-btn pb-3 font-bold text-[12pt] text-[#5e5c64] dark:text-[#c0bfbc] hover:text-gnome-black dark:hover:text-gnome-white border-b-2 border-transparent transition-colors whitespace-nowrap focus:outline-none">
                        Add New
                    </button>
                </div>
                
                <!-- Tab 1: My Extensions List & Reviewer Split Pane -->
                <div id="view-my-extensions" class="upload-view-pane block animate-fade-in">
                    <div class="space-y-8">
                        <!-- GNOME Boxed List Container -->
                        <div class="bg-gnome-white dark:bg-[#2d2640] border border-[#c0bfbc] dark:border-[#3d3846] rounded-xl shadow-sm overflow-hidden flex flex-col">
                            
                            <!-- Boxed List Item 1 -->
                            <div class="flex items-center justify-between p-4 border-b border-[#c0bfbc] dark:border-[#3d3846] hover:bg-[#f6f5f4] dark:hover:bg-[#322b47] transition-colors cursor-pointer" data-action="view-review" data-target="snaptext">
                                <div class="flex items-center gap-4 sm:gap-6 w-full">
                                    <div class="flex-1 min-w-0">
                                        <p class="font-bold text-[12pt] text-gnome-black dark:text-gnome-white truncate">Snap Text Extractor</p>
                                        <p class="text-sm text-gnome-grey truncate mt-0.5">snaptext@cwittenberg</p>
                                    </div>
                                    <div class="hidden sm:block w-20 shrink-0">
                                        <span class="text-[12pt] font-mono text-gnome-black dark:text-gnome-white">v10</span>
                                    </div>
                                    <div class="w-28 shrink-0 flex items-center gap-2.5">
                                        <span class="w-3 h-3 rounded-full bg-gnome-green"></span>
                                        <span class="text-sm font-bold text-gnome-black dark:text-gnome-white">Active</span>
                                    </div>
                                    <div class="flex items-center justify-end gap-1.5 shrink-0" onclick="event.stopPropagation();">
                                        <button class="w-9 h-9 flex items-center justify-center rounded-lg text-gnome-grey hover:bg-[#deddda] dark:hover:bg-[#3d3846] hover:text-gnome-black dark:hover:text-gnome-white transition-colors" title="Edit Metadata"><i class="fa-solid fa-pen"></i></button>
                                        <button class="w-9 h-9 flex items-center justify-center rounded-lg text-gnome-grey hover:bg-[#deddda] dark:hover:bg-[#3d3846] hover:text-gnome-black dark:hover:text-gnome-white transition-colors" title="Upload Patch"><i class="fa-solid fa-upload"></i></button>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Boxed List Item 2 -->
                            <div class="flex items-center justify-between p-4 hover:bg-[#f6f5f4] dark:hover:bg-[#322b47] transition-colors cursor-pointer" data-action="view-review" data-target="omnipanel">
                                <div class="flex items-center gap-4 sm:gap-6 w-full">
                                    <div class="flex-1 min-w-0">
                                        <p class="font-bold text-[12pt] text-gnome-black dark:text-gnome-white truncate">OmniPanel</p>
                                        <p class="text-sm text-gnome-grey truncate mt-0.5">omnipanel@christian</p>
                                    </div>
                                    <div class="hidden sm:block w-20 shrink-0">
                                        <span class="text-[12pt] font-mono text-gnome-black dark:text-gnome-white">v11</span>
                                    </div>
                                    <div class="w-28 shrink-0 flex items-center gap-2.5">
                                        <span class="w-3 h-3 rounded-full bg-gnome-orange"></span>
                                        <span class="text-sm font-bold text-gnome-black dark:text-gnome-white">Pending</span>
                                    </div>
                                    <div class="flex items-center justify-end gap-1.5 shrink-0" onclick="event.stopPropagation();">
                                        <button class="w-9 h-9 flex items-center justify-center rounded-lg text-gnome-grey hover:bg-[#deddda] dark:hover:bg-[#3d3846] hover:text-gnome-black dark:hover:text-gnome-white transition-colors" title="Edit Metadata"><i class="fa-solid fa-pen"></i></button>
                                        <button class="w-9 h-9 flex items-center justify-center rounded-lg text-gnome-grey hover:bg-[#deddda] dark:hover:bg-[#3d3846] hover:text-gnome-black dark:hover:text-gnome-white transition-colors" title="Upload Patch"><i class="fa-solid fa-upload"></i></button>
                                    </div>
                                </div>
                            </div>

                        </div>

                        <!-- Integrated EGO Code Review Panel -->
                        <div id="review-details-panel" class="hidden space-y-8 animate-fade-in pb-16">
                            <div class="flex items-center justify-between border-t border-[#c0bfbc] dark:border-[#3d3846] pt-8">
                                <h3 id="review-panel-title" class="text-[18pt] font-extrabold text-gnome-black dark:text-gnome-white tracking-tight">Review Context</h3>
                                <button id="close-review-btn" class="text-sm font-bold text-gnome-grey hover:text-gnome-blue transition-colors flex items-center gap-1.5 bg-[#f6f5f4] dark:bg-[#3d3846] px-3 py-1.5 rounded-lg border border-[#c0bfbc] dark:border-[#5e5c64]">
                                    <i class="fa-solid fa-xmark"></i> Hide Review
                                </button>
                            </div>

                            <!-- Structural Source Code Diff Engine Output Layout -->
                            <div class="space-y-3">
                                <h4 class="text-sm font-bold text-gnome-grey uppercase tracking-wider">Source Code Comparison</h4>
                                <div class="bg-gnome-white dark:bg-[#2d2640] border border-[#c0bfbc] dark:border-[#3d3846] rounded-xl shadow-sm overflow-hidden flex flex-col md:flex-row">
                                    
                                    <!-- File List Navigation (Sidebar) -->
                                    <div class="w-full md:w-1/3 border-b md:border-b-0 md:border-r border-[#c0bfbc] dark:border-[#3d3846] bg-[#f6f5f4] dark:bg-[#241F31]">
                                        <div class="p-3 border-b border-[#c0bfbc] dark:border-[#3d3846]">
                                            <span class="text-xs font-bold text-gnome-grey uppercase tracking-wider">Files</span>
                                        </div>
                                        <ul class="flex flex-col h-64 overflow-y-auto scrollbar-hide" id="review-file-list">
                                            <!-- Dynamically generated file list -->
                                        </ul>
                                    </div>

                                    <!-- Diff View (Main) -->
                                    <div class="w-full md:w-2/3 bg-gnome-white dark:bg-gnome-black flex flex-col">
                                        <div class="p-3 border-b border-[#c0bfbc] dark:border-[#3d3846] flex justify-between items-center bg-[#f6f5f4] dark:bg-[#2d2640]">
                                            <span id="diff-file-badge" class="font-mono text-sm font-bold text-gnome-black dark:text-gnome-white"></span>
                                        </div>
                                        <div class="overflow-x-auto overflow-y-auto h-64 font-mono text-sm leading-relaxed p-0">
                                            <div class="w-full table border-collapse divide-y divide-[#c0bfbc]/20 dark:divide-[#3d3846]/40" id="diff-lines-container">
                                                <!-- Unified line rows will be dynamically drawn here -->
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>

                            <!-- EGO Feedback Section & Interaction -->
                            <div class="space-y-3">
                                <h4 class="text-sm font-bold text-gnome-grey uppercase tracking-wider">Review Log</h4>
                                
                                <div id="ego-comments-container" class="space-y-3">
                                    <!-- Dynamic EGO Threads will appear here -->
                                </div>

                                <!-- Add Comment / Reply Box -->
                                <div class="mt-4 border border-[#c0bfbc] dark:border-[#3d3846] rounded-xl p-4 bg-gnome-white dark:bg-[#2d2640] shadow-sm">
                                    <textarea id="review-comment-textarea" class="w-full bg-[#f6f5f4] dark:bg-gnome-black border border-[#c0bfbc] dark:border-[#3d3846] rounded-lg p-3 text-sm text-gnome-black dark:text-gnome-white focus:outline-none focus:border-gnome-blue focus:ring-1 focus:ring-gnome-blue resize-y" rows="3" placeholder="Add a comment or reply to the reviewer..."></textarea>
                                    <div class="flex justify-between items-center mt-3">
                                        <span class="text-xs text-gnome-grey"><i class="fa-solid fa-circle-info mr-1"></i> Comments are public and visible to reviewers.</span>
                                        <button id="submit-review-comment-btn" class="bg-gnome-blue text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-[#1c71d8] transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-gnome-blue focus:ring-offset-2 dark:focus:ring-offset-[#2d2640]">Submit Comment</button>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                <!-- Tab 2: Add New (Upload Form) -->
                <div id="view-upload-new" class="upload-view-pane hidden animate-fade-in">
                    <div class="bg-gnome-white dark:bg-[#2d2640] border border-[#c0bfbc] dark:border-[#3d3846] rounded-xl p-8 sm:p-12 shadow-sm max-w-2xl mx-auto">
                      <h3 class="font-extrabold text-[18pt] text-gnome-black dark:text-gnome-white mb-2 text-center">Submit an Extension</h3>
                      <p class="text-[12pt] text-gnome-grey text-center mb-8">Upload your GNOME Shell extension archive containing your metadata.json and source code.</p>
                      
                      <form id="upload-form" class="space-y-6">
                        <div id="upload-dropzone" class="border border-[#c0bfbc] dark:border-[#3d3846] rounded-xl p-12 flex flex-col items-center justify-center bg-[#f6f5f4] dark:bg-[#241F31] hover:border-gnome-blue dark:hover:border-gnome-blue transition-colors cursor-pointer text-center group">
                          <i class="fa-solid fa-file-zipper text-4xl text-gnome-grey group-hover:text-gnome-blue transition-colors mb-4"></i>
                          <span class="text-[12pt] font-bold text-gnome-black dark:text-gnome-white mb-1">Select or drop your .zip here</span>
                          <input type="file" id="upload-file-input" class="hidden" accept=".zip" />
                        </div>

                        <div id="upload-file-info" class="hidden flex items-center justify-between bg-[#f6f5f4] dark:bg-[#3d3846] p-4 rounded-xl border border-[#c0bfbc] dark:border-[#5e5c64]">
                            <div class="flex items-center gap-4 overflow-hidden">
                                <i class="fa-solid fa-file-zipper text-gnome-blue text-2xl"></i>
                                <div class="min-w-0">
                                    <p id="upload-file-name" class="text-[12pt] font-bold text-gnome-black dark:text-gnome-white truncate">extension.zip</p>
                                    <p id="upload-file-size" class="text-sm text-gnome-grey truncate">0 KB</p>
                                </div>
                            </div>
                            <button type="button" id="upload-remove-file" class="text-gnome-grey hover:text-gnome-red p-2 rounded-lg transition-colors" title="Remove file">
                                <i class="fa-solid fa-xmark text-lg"></i>
                            </button>
                        </div>

                        <button type="button" id="upload-submit-btn" class="bg-gnome-blue text-white px-6 py-3 rounded-lg text-[12pt] font-bold hover:bg-[#1c71d8] transition-colors w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-gnome-blue focus:ring-offset-2 dark:focus:ring-offset-[#2d2640] opacity-50 cursor-not-allowed" disabled>
                          Submit Extension
                        </button>
                      </form>
                    </div>
                </div>

            </div>
        `;

        this.bindEvents();
    }

    bindEvents() {
        const tabMyExt = document.getElementById('tab-my-extensions');
        const tabUpload = document.getElementById('tab-upload-new');
        const viewMyExt = document.getElementById('view-my-extensions');
        const viewUpload = document.getElementById('view-upload-new');

        if (tabMyExt && tabUpload) {
            tabMyExt.addEventListener('click', () => {
                tabMyExt.classList.add('text-gnome-blue', 'border-gnome-blue');
                tabMyExt.classList.remove('text-[#5e5c64]', 'dark:text-[#c0bfbc]', 'border-transparent');
                
                tabUpload.classList.remove('text-gnome-blue', 'border-gnome-blue');
                tabUpload.classList.add('text-[#5e5c64]', 'dark:text-[#c0bfbc]', 'border-transparent');

                viewMyExt.classList.remove('hidden');
                viewMyExt.classList.add('block');
                
                viewUpload.classList.add('hidden');
                viewUpload.classList.remove('block');
            });

            tabUpload.addEventListener('click', () => {
                tabUpload.classList.add('text-gnome-blue', 'border-gnome-blue');
                tabUpload.classList.remove('text-[#5e5c64]', 'dark:text-[#c0bfbc]', 'border-transparent');
                
                tabMyExt.classList.remove('text-gnome-blue', 'border-gnome-blue');
                tabMyExt.classList.add('text-[#5e5c64]', 'dark:text-[#c0bfbc]', 'border-transparent');

                viewUpload.classList.remove('hidden');
                viewUpload.classList.add('block');
                
                viewMyExt.classList.add('hidden');
                viewMyExt.classList.remove('block');
                
                // Close the review panel implicitly when leaving the Extensions tab
                document.getElementById('review-details-panel').classList.add('hidden');
            });
        }

        // Row Click Action for Review Details Integration
        const reviewRows = this.container.querySelectorAll('[data-action="view-review"]');
        reviewRows.forEach(row => {
            row.addEventListener('click', () => {
                const target = row.getAttribute('data-target');
                this.loadReviewDetails(target);
            });
        });

        const closeReviewBtn = document.getElementById('close-review-btn');
        if (closeReviewBtn) {
            closeReviewBtn.addEventListener('click', () => {
                document.getElementById('review-details-panel').classList.add('hidden');
            });
        }

        // File list delegation for changing diff view
        const fileListContainer = document.getElementById('review-file-list');
        if (fileListContainer) {
            fileListContainer.addEventListener('click', (e) => {
                const fileItem = e.target.closest('li[data-filename]');
                if (fileItem) {
                    const targetExtension = fileItem.getAttribute('data-target');
                    const filename = fileItem.getAttribute('data-filename');
                    this.renderFileDiff(targetExtension, filename);
                }
            });
        }

        // Comment Submission
        const submitCommentBtn = document.getElementById('submit-review-comment-btn');
        const commentTextarea = document.getElementById('review-comment-textarea');
        if (submitCommentBtn && commentTextarea) {
            submitCommentBtn.addEventListener('click', () => {
                const text = commentTextarea.value.trim();
                if (text) {
                    const commentsContainer = document.getElementById('ego-comments-container');
                    const newCommentHtml = this.generateCommentHtml({
                        author: "cwittenberg (You)",
                        date: "Just now",
                        type: "author",
                        text: text
                    });
                    commentsContainer.insertAdjacentHTML('beforeend', newCommentHtml);
                    commentTextarea.value = '';
                }
            });
        }

        const dropzone = document.getElementById('upload-dropzone');
        const fileInput = document.getElementById('upload-file-input');
        const fileInfo = document.getElementById('upload-file-info');
        const fileName = document.getElementById('upload-file-name');
        const fileSize = document.getElementById('upload-file-size');
        const removeFileBtn = document.getElementById('upload-remove-file');
        const submitBtn = document.getElementById('upload-submit-btn');

        if (dropzone && fileInput) {
            dropzone.addEventListener('click', () => fileInput.click());

            dropzone.addEventListener('dragover', (e) => {
                e.preventDefault();
                dropzone.classList.add('border-gnome-blue');
            });

            dropzone.addEventListener('dragleave', (e) => {
                e.preventDefault();
                dropzone.classList.remove('border-gnome-blue');
            });

            dropzone.addEventListener('drop', (e) => {
                e.preventDefault();
                dropzone.classList.remove('border-gnome-blue');
                if (e.dataTransfer.files.length) {
                    fileInput.files = e.dataTransfer.files;
                    updateFileUI(e.dataTransfer.files[0]);
                }
            });

            fileInput.addEventListener('change', (e) => {
                if (e.target.files.length) {
                    updateFileUI(e.target.files[0]);
                }
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
                submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
            } else {
                dropzone.classList.remove('hidden');
                fileInfo.classList.add('hidden');
                fileInfo.classList.remove('flex');
                fileName.textContent = '';
                fileSize.textContent = '';
                
                submitBtn.disabled = true;
                submitBtn.classList.add('opacity-50', 'cursor-not-allowed');
            }
        };

        if (removeFileBtn) {
            removeFileBtn.addEventListener('click', () => {
                fileInput.value = '';
                updateFileUI(null);
            });
        }

        if (submitBtn) {
            submitBtn.addEventListener('click', () => {
                submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i> Uploading...';
                submitBtn.disabled = true;
                
                setTimeout(() => {
                    submitBtn.innerHTML = '<i class="fa-solid fa-check mr-2"></i> Successfully Uploaded';
                    submitBtn.classList.replace('bg-gnome-blue', 'bg-gnome-green');
                    submitBtn.classList.replace('hover:bg-[#1c71d8]', 'hover:bg-[#2ebc6c]');
                    
                    setTimeout(() => {
                        fileInput.value = '';
                        updateFileUI(null);
                        submitBtn.innerHTML = 'Submit Extension';
                        submitBtn.classList.replace('bg-gnome-green', 'bg-gnome-blue');
                        submitBtn.classList.replace('hover:bg-[#2ebc6c]', 'hover:bg-[#1c71d8]');
                        
                        // Switch back to "My Extensions" view
                        if (tabMyExt) tabMyExt.click();
                    }, 2000);
                }, 1500);
            });
        }
    }

    loadReviewDetails(targetExtension) {
        const panel = document.getElementById('review-details-panel');
        const panelTitle = document.getElementById('review-panel-title');
        const commentsContainer = document.getElementById('ego-comments-container');
        
        const data = this.mockReviewData[targetExtension];
        if (!data) return;

        panel.classList.remove('hidden');
        panelTitle.textContent = data.title;
        
        // Render Review Log Threads
        commentsContainer.innerHTML = data.comments.map(c => this.generateCommentHtml(c)).join('');

        // Initial setup for Diff Panel (Loads the first file by default)
        const firstFilename = data.files.length > 0 ? data.files[0].name : '';
        this.renderFileDiff(targetExtension, firstFilename);
        
        // Scroll the panel into view naturally
        panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    renderFileDiff(targetExtension, filename) {
        const fileListContainer = document.getElementById('review-file-list');
        const diffLinesContainer = document.getElementById('diff-lines-container');
        const fileBadge = document.getElementById('diff-file-badge');

        const data = this.mockReviewData[targetExtension];
        if (!data) return;

        // Render Sidebar Navigation
        fileListContainer.innerHTML = data.files.map(file => {
            const isActive = file.name === filename;
            const bgClass = isActive ? 'bg-[#deddda] dark:bg-[#3d3846] border-l-gnome-blue' : 'border-l-transparent hover:bg-[#deddda] dark:hover:bg-[#3d3846]';
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
                <li class="cursor-pointer px-4 py-3 border-b border-[#c0bfbc] dark:border-[#3d3846] flex justify-between items-center transition-colors border-l-4 ${bgClass}" data-filename="${this.escapeHtml(file.name)}" data-target="${targetExtension}">
                    <span class="font-mono text-sm ${textClass} truncate pr-2">${this.escapeHtml(file.name)}</span>
                    ${statsHtml}
                </li>
            `;
        }).join('');

        // Render Main Diff Box
        const selectedFile = data.files.find(f => f.name === filename);
        if (selectedFile) {
            fileBadge.textContent = selectedFile.name;
            diffLinesContainer.innerHTML = this.generateDiffHtml(selectedFile.diff);
        } else {
            fileBadge.textContent = "Select a file";
            diffLinesContainer.innerHTML = '';
        }
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
                    <div class="table-cell w-10 sm:w-12 text-right select-none pr-2 sm:pr-3 py-0.5 border-r border-[#c0bfbc]/20 dark:border-[#3d3846]/40 ${numBg}">${line.oldLine}</div>
                    <div class="table-cell w-10 sm:w-12 text-right select-none px-2 sm:px-3 py-0.5 border-r border-[#c0bfbc]/20 dark:border-[#3d3846]/40 ${numBg}">${line.newLine}</div>
                    <div class="table-cell pl-3 sm:pl-4 pr-4 py-0.5 whitespace-pre ${textStyle}">${this.escapeHtml(line.text)}</div>
                </div>
            `;
        }).join('');
    }

    generateCommentHtml(comment) {
        let dotColor = 'bg-[#c0bfbc] dark:bg-[#5e5c64]';
        if (comment.type === 'approved') dotColor = 'bg-gnome-green';
        if (comment.type === 'rejected') dotColor = 'bg-gnome-red';
        if (comment.type === 'author') dotColor = 'bg-gnome-blue';

        return `
            <div class="bg-[#f6f5f4] dark:bg-[#241F31] border border-[#c0bfbc] dark:border-[#3d3846] rounded-xl p-4 shadow-sm animate-fade-in">
                <div class="flex items-center gap-3 justify-between mb-3 border-b border-[#c0bfbc]/50 dark:border-[#3d3846]/50 pb-2">
                    <div class="flex items-center gap-2">
                        <span class="w-2.5 h-2.5 rounded-full ${dotColor}"></span>
                        <span class="font-bold text-sm text-gnome-black dark:text-gnome-white">${this.escapeHtml(comment.author)}</span>
                    </div>
                    <span class="text-xs font-semibold text-gnome-grey">${this.escapeHtml(comment.date)}</span>
                </div>
                <p class="text-[12pt] text-gnome-black dark:text-[#c0bfbc] leading-relaxed">
                    ${this.escapeHtml(comment.text)}
                </p>
            </div>
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

window.UploadView = UploadView;