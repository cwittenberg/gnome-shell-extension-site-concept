class UploadView {
    constructor() {
        this.container = document.getElementById('upload-view');
    }

    render() {
        if (!this.container) return;

        this.container.innerHTML = `
            <div class="max-w-4xl mx-auto px-4 sm:px-6 pt-10">
              <h1 class="text-4xl font-extrabold text-gnome-black dark:text-gnome-white mb-4 tracking-tight">Add yours</h1>
              <p class="text-lg text-gnome-grey mb-8">Upload and submit your GNOME Shell extension to the official directory.</p>
              
              <div class="bg-gnome-white dark:bg-[#2d2640] border border-[#c0bfbc] dark:border-[#3d3846] rounded-2xl p-6 sm:p-10 shadow-md">
                <form class="space-y-6">
                  <div>
                    <label class="block text-sm font-bold text-gnome-black dark:text-gnome-white mb-2">Extension ZIP file</label>
                    <div class="border-2 border-dashed border-[#c0bfbc] dark:border-[#3d3846] rounded-xl p-10 flex flex-col items-center justify-center bg-[#f6f5f4] dark:bg-gnome-black hover:border-gnome-blue transition-colors cursor-pointer">
                      <i class="fa-solid fa-cloud-arrow-up text-4xl text-gnome-grey mb-4"></i>
                      <span class="text-base font-semibold text-gnome-blue mb-1">Click to browse or drag and drop</span>
                      <span class="text-sm text-gnome-grey">Must be a valid GNOME Shell extension .zip</span>
                    </div>
                  </div>

                  <div class="border-t border-[#c0bfbc] dark:border-[#3d3846] pt-6 flex justify-end">
                    <button type="button" class="bg-gnome-blue text-white px-8 py-3 rounded-lg font-bold hover:bg-[#1c71d8] transition-colors w-full sm:w-auto shadow-md">Upload Extension</button>
                  </div>
                </form>
              </div>
            </div>
        `;
    }
}

window.UploadView = UploadView;