class UploadView {
    constructor() {
        this.container = document.getElementById('upload-view');
    }

    render() {
        if (!this.container) return;
        this.container.innerHTML = `
            <div class="max-w-6xl mx-auto px-4 sm:px-6 pt-10">
              
              <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                  <div>
                      <h1 class="text-4xl font-extrabold text-gnome-black dark:text-gnome-white mb-2 tracking-tight">Developer Dashboard</h1>
                      <p class="text-base text-gnome-grey">Manage your extensions and track their review process.</p>
                  </div>
              </div>

              <!-- Dev Tabs UI -->
              <div class="flex border-b border-[#c0bfbc] dark:border-[#3d3846] mb-8 overflow-x-auto scrollbar-hide">
                  <button id="tab-my-extensions" class="upload-tab-btn active px-6 py-3 font-bold text-sm text-gnome-blue border-b-2 border-gnome-blue whitespace-nowrap focus:outline-none">
                      My Extensions
                  </button>
                  <button id="tab-upload-new" class="upload-tab-btn px-6 py-3 font-bold text-sm text-[#5e5c64] dark:text-[#c0bfbc] hover:text-gnome-black dark:hover:text-gnome-white border-b-2 border-transparent transition-colors whitespace-nowrap focus:outline-none">
                      Add New
                  </button>
              </div>
              
              <!-- Tab 1: My Extensions List -->
              <div id="view-my-extensions" class="upload-view-pane block">
                  <div class="bg-gnome-white dark:bg-[#2d2640] border border-[#c0bfbc] dark:border-[#3d3846] rounded-2xl shadow-sm overflow-hidden">
                      <table class="w-full text-left border-collapse">
                          <thead>
                              <tr class="bg-[#f6f5f4] dark:bg-[#241F31] border-b border-[#c0bfbc] dark:border-[#3d3846]">
                                  <th class="py-3 px-5 text-xs font-bold uppercase tracking-wider text-gnome-grey">Extension</th>
                                  <th class="py-3 px-5 text-xs font-bold uppercase tracking-wider text-gnome-grey">Version</th>
                                  <th class="py-3 px-5 text-xs font-bold uppercase tracking-wider text-gnome-grey">Status</th>
                                  <th class="py-3 px-5 text-xs font-bold uppercase tracking-wider text-gnome-grey text-right">Actions</th>
                              </tr>
                          </thead>
                          <tbody class="divide-y divide-[#c0bfbc] dark:divide-[#3d3846]">
                              <!-- Mock My Extension Item 1 -->
                              <tr class="hover:bg-[#f6f5f4] dark:hover:bg-[#322b47] transition-colors">
                                  <td class="py-4 px-5">
                                      <p class="font-bold text-sm text-gnome-black dark:text-gnome-white">Snap Text Extractor</p>
                                      <p class="text-xs text-gnome-grey mt-0.5">snaptext@cwittenberg</p>
                                  </td>
                                  <td class="py-4 px-5">
                                      <span class="text-sm font-mono text-gnome-black dark:text-gnome-white">10</span>
                                  </td>
                                  <td class="py-4 px-5">
                                      <span class="inline-block bg-gnome-green/15 border border-gnome-green/30 text-gnome-green text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">Active</span>
                                  </td>
                                  <td class="py-4 px-5 text-right space-x-2">
                                      <button class="text-gnome-grey hover:text-gnome-blue transition-colors" title="Edit Metadata"><i class="fa-solid fa-pen"></i></button>
                                      <button class="text-gnome-grey hover:text-gnome-blue transition-colors" title="Upload Patch"><i class="fa-solid fa-upload"></i></button>
                                  </td>
                              </tr>
                              
                              <!-- Mock My Extension Item 2 -->
                              <tr class="hover:bg-[#f6f5f4] dark:hover:bg-[#322b47] transition-colors">
                                  <td class="py-4 px-5">
                                      <p class="font-bold text-sm text-gnome-black dark:text-gnome-white">OmniPanel</p>
                                      <p class="text-xs text-gnome-grey mt-0.5">omnipanel@christian</p>
                                  </td>
                                  <td class="py-4 px-5">
                                      <span class="text-sm font-mono text-gnome-black dark:text-gnome-white">11</span>
                                  </td>
                                  <td class="py-4 px-5">
                                      <span class="inline-block bg-gnome-orange/15 border border-gnome-orange/30 text-gnome-orange text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">Unreviewed</span>
                                  </td>
                                  <td class="py-4 px-5 text-right space-x-2">
                                      <button class="text-gnome-grey hover:text-gnome-blue transition-colors" title="Edit Metadata"><i class="fa-solid fa-pen"></i></button>
                                      <button class="text-gnome-grey hover:text-gnome-blue transition-colors" title="Upload Patch"><i class="fa-solid fa-upload"></i></button>
                                  </td>
                              </tr>
                          </tbody>
                      </table>
                  </div>
              </div>

              <!-- Tab 2: Add New (Upload Form) -->
              <div id="view-upload-new" class="upload-view-pane hidden">
                  <div class="bg-gnome-white dark:bg-[#2d2640] border border-[#c0bfbc] dark:border-[#3d3846] rounded-2xl p-8 sm:p-12 shadow-sm max-w-3xl mx-auto">
                    <h3 class="font-extrabold text-2xl text-gnome-black dark:text-gnome-white mb-2 text-center">Submit an Extension</h3>
                    <p class="text-gnome-grey text-center mb-8">Upload your GNOME Shell extension zip file containing your metadata.json and source code.</p>
                    
                    <form id="upload-form" class="space-y-6">
                      <div id="upload-dropzone" class="border-2 border-dashed border-[#c0bfbc] dark:border-[#3d3846] rounded-xl p-12 flex flex-col items-center justify-center bg-[#f6f5f4] dark:bg-gnome-black hover:border-gnome-blue hover:bg-gnome-blue/5 transition-all cursor-pointer text-center group">
                        <i class="fa-solid fa-cloud-arrow-up text-5xl text-gnome-grey group-hover:text-gnome-blue transition-colors mb-4"></i>
                        <span class="text-lg font-bold text-gnome-black dark:text-gnome-white mb-2">Drag and drop your .zip here</span>
                        <span class="text-sm font-semibold text-gnome-blue mb-1">or click to browse</span>
                        <input type="file" id="upload-file-input" class="hidden" accept=".zip" />
                      </div>

                      <div id="upload-file-info" class="hidden flex items-center justify-between bg-[#f6f5f4] dark:bg-[#3d3846] p-4 rounded-xl border border-[#c0bfbc] dark:border-[#5e5c64]">
                          <div class="flex items-center gap-3 overflow-hidden">
                              <i class="fa-solid fa-file-zipper text-gnome-blue text-2xl"></i>
                              <div class="min-w-0">
                                  <p id="upload-file-name" class="text-sm font-bold text-gnome-black dark:text-gnome-white truncate">extension.zip</p>
                                  <p id="upload-file-size" class="text-xs text-gnome-grey truncate">0 KB</p>
                              </div>
                          </div>
                          <button type="button" id="upload-remove-file" class="text-gnome-grey hover:text-gnome-red p-2 rounded-lg transition-colors">
                              <i class="fa-solid fa-xmark"></i>
                          </button>
                      </div>

                      <button type="button" id="upload-submit-btn" class="bg-gnome-blue text-white px-6 py-3.5 rounded-xl text-base font-bold hover:bg-[#1c71d8] transition-colors w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-gnome-blue focus:ring-offset-2 dark:focus:ring-offset-[#2d2640] opacity-50 cursor-not-allowed" disabled>
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
                dropzone.classList.add('border-gnome-blue', 'bg-gnome-blue/5');
            });

            dropzone.addEventListener('dragleave', (e) => {
                e.preventDefault();
                dropzone.classList.remove('border-gnome-blue', 'bg-gnome-blue/5');
            });

            dropzone.addEventListener('drop', (e) => {
                e.preventDefault();
                dropzone.classList.remove('border-gnome-blue', 'bg-gnome-blue/5');
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