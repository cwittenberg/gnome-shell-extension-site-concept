class AboutView {
    constructor() {
        this.container = document.getElementById('about-view');
    }

    render() {
        if (!this.container) return;
        this.container.innerHTML = `
            <div class="max-w-4xl mx-auto px-4 sm:px-6 pt-10">
              <h1 class="gnome-title-page text-4xl mb-4">About</h1>
              <div class="prose prose-slate dark:prose-invert max-w-none gnome-card-panel p-6 sm:p-10">
                <p>GNOME Shell extensions add functionality to the GNOME desktop that is not present by default. They can modify the appearance of the shell, add new panel indicators, change window management behavior, or integrate external services.</p>
                <p>Extensions are the primary way to customize GNOME, and this official extensions repository hosts thousands of them created by developers from around the world.</p>
              </div>
            </div>
        `;
    }
}
window.AboutView = AboutView;