class LocalView {
    constructor() {
        this.container = document.getElementById('local-view');
    }

    render() {
        if (!this.container) return;

        this.container.innerHTML = `
            <div class="max-w-4xl mx-auto px-4 sm:px-6 pt-10">
              <h1 class="text-4xl font-extrabold text-gnome-black dark:text-gnome-white mb-6 tracking-tight">Installed extensions</h1>
              
              <div class="bg-[#d9edf7] dark:bg-[#243f55] border border-[#bce8f1] dark:border-[#2f5573] rounded-xl p-4 sm:p-5 mb-8 flex items-start gap-4 shadow-sm">
                <div class="text-[#31708f] dark:text-[#9bc2d5] shrink-0 mt-0.5">
                  <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div class="text-sm text-[#31708f] dark:text-[#9bc2d5] leading-relaxed">
                  <p>To control GNOME Shell extensions using this site you must install GNOME Shell integration that consists of two parts: browser extension and native host messaging application.</p>
                  <p class="mt-2">
                    <a href="#" onclick="return false;" class="font-bold underline hover:no-underline">Click here to install browser extension</a>. 
                    See <a href="https://gnome.pages.gitlab.gnome.org/gnome-browser-integration/pages/installation-guide.html" target="_blank" rel="noreferrer" class="font-bold underline hover:no-underline">wiki page</a> for native host connector installation instructions.
                  </p>
                </div>
              </div>

              <div class="bg-gnome-white dark:bg-[#2d2640] border border-[#c0bfbc] dark:border-[#3d3846] rounded-2xl p-10 sm:p-16 shadow-md text-center">
                <svg class="w-12 h-12 text-gnome-grey mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                </svg>
                <h3 class="text-xl font-bold text-gnome-black dark:text-gnome-white mb-2">No extensions detected</h3>
                <p class="text-base text-gnome-grey">GNOME Shell Extensions cannot list your installed extensions without the host connector.</p>
              </div>
            </div>
        `;
    }
}

window.LocalView = LocalView;