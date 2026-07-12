/**
 * Todo: add more of the existing EGO stuff here
 * Conceptually just to show the idea here
 */
class UploadView {
    constructor() {
        this.container = document.getElementById('upload-view');
    }

    render() {
        if (!this.container) return;
        this.container.innerHTML = `
            <div class="max-w-4xl mx-auto px-4 sm:px-6 pt-10">
                
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
                
                <!-- Tab 1: My Extensions List (GNOME Boxed List Style) -->
                <div id="view-my-extensions" class="upload-view-pane block animate-fade-in">
                    <div class="bg-gnome-white dark:bg-[#2d2640] border border-[#c0bfbc] dark:border-[#3d3846] rounded-xl shadow-sm overflow-hidden flex flex-col">
                        
                        <!-- Boxed List Item 1 -->
                        <div class="flex items-center justify-between p-4 border-b border-[#c0bfbc] dark:border-[#3d3846] hover:bg-[#f6f5f4] dark:hover:bg-[#322b47] transition-colors">
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
                                <div class="flex items-center justify-end gap-1.5 shrink-0">
                                    <button class="w-9 h-9 flex items-center justify-center rounded-lg text-gnome-grey hover:bg-[#deddda] dark:hover:bg-[#3d3846] hover:text-gnome-black dark:hover:text-gnome-white transition-colors" title="Edit Metadata"><i class="fa-solid fa-pen"></i></button>
                                    <button class="w-9 h-9 flex items-center justify-center rounded-lg text-gnome-grey hover:bg-[#deddda] dark:hover:bg-[#3d3846] hover:text-gnome-black dark:hover:text-gnome-white transition-colors" title="Upload Patch"><i class="fa-solid fa-upload"></i></button>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Boxed List Item 2 -->
                        <div class="flex items-center justify-between p-4 hover:bg-[#f6f5f4] dark:hover:bg-[#322b47] transition-colors">
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
                                <div class="flex items-center justify-end gap-1.5 shrink-0">
                                    <button class="w-9 h-9 flex items-center justify-center rounded-lg text-gnome-grey hover:bg-[#deddda] dark:hover:bg-[#3d3846] hover:text-gnome-black dark:hover:text-gnome-white transition-colors" title="Edit Metadata"><i class="fa-solid fa-pen"></i></button>
                                    <button class="w-9 h-9 flex items-center justify-center rounded-lg text-gnome-grey hover:bg-[#deddda] dark:hover:bg-[#3d3846] hover:text-gnome-black dark:hover:text-gnome-white transition-colors" title="Upload Patch"><i class="fa-solid fa-upload"></i></button>
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
}

window.UploadView = UploadView;