class AuthView {
    constructor() {
        this.container = document.getElementById('auth-view');
    }
    
    render() {
        if (!this.container) return;
        
        this.container.innerHTML = `
            <div class="max-w-md mx-auto pt-16 pb-24 px-4">
                <div class="gnome-card-panel p-8 sm:p-10 animate-fade-in shadow-xl">
                    <div class="flex justify-center mb-6">
                        <i class="icon icon-gnome-brandmark text-6xl text-gnome-blue"></i>
                    </div>
                    <h2 class="text-2xl font-extrabold text-center text-gnome-black dark:text-gnome-white mb-6" id="auth-title">Log in to GNOME</h2>
                    
                    <form id="auth-form" class="space-y-4">
                        <div id="register-fields" class="hidden space-y-4">
                            <div>
                                <label class="block text-sm font-bold text-gnome-black dark:text-gnome-white mb-1">Email Address</label>
                                <input type="email" id="auth-email" class="gnome-input" placeholder="developer@example.com" autocomplete="email">
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-bold text-gnome-black dark:text-gnome-white mb-1">Username</label>
                            <input type="text" id="auth-username" class="gnome-input" placeholder="Username" autocomplete="username">
                        </div>
                        <div>
                            <label class="block text-sm font-bold text-gnome-black dark:text-gnome-white mb-1">Password</label>
                            <input type="password" id="auth-password" class="gnome-input" placeholder="••••••••" autocomplete="current-password">
                        </div>
                        <div id="register-password-confirm" class="hidden">
                            <label class="block text-sm font-bold text-gnome-black dark:text-gnome-white mb-1">Confirm Password</label>
                            <input type="password" id="auth-password-confirm" class="gnome-input" placeholder="••••••••" autocomplete="new-password">
                        </div>
                        
                        <button type="button" id="auth-submit-btn" class="gnome-btn-primary w-full py-3 mt-6 text-base shadow-md">Log In</button>
                    </form>
                    
                    <div class="mt-8 text-center text-sm text-gnome-grey border-t border-[#c0bfbc] dark:border-[#3d3846] pt-6">
                        <p id="auth-toggle-text">Don't have an account? <a href="#" id="auth-toggle-btn" class="text-gnome-blue hover:underline font-bold">Register here</a></p>
                    </div>
                </div>
            </div>
        `;

        this.bindEvents();
    }
    
    bindEvents() {
        let isLogin = true;
        const toggleBtn = document.getElementById('auth-toggle-btn');
        const submitBtn = document.getElementById('auth-submit-btn');
        const title = document.getElementById('auth-title');
        const regFields = document.getElementById('register-fields');
        const regPassConfirm = document.getElementById('register-password-confirm');
        const toggleText = document.getElementById('auth-toggle-text');
        
        if (toggleBtn) {
            toggleBtn.addEventListener('click', (e) => {
                e.preventDefault();
                isLogin = !isLogin;

                if (isLogin) {
                    title.textContent = 'Log in to GNOME';
                    submitBtn.textContent = 'Log In';
                    regFields.classList.add('hidden');
                    regPassConfirm.classList.add('hidden');
                    document.getElementById('auth-password').setAttribute('autocomplete', 'current-password');
                    toggleText.innerHTML = `Don't have an account? <a href="#" id="auth-toggle-btn" class="text-gnome-blue hover:underline font-bold">Register here</a>`;
                } else {
                    title.textContent = 'Create an Account';
                    submitBtn.textContent = 'Register';
                    regFields.classList.remove('hidden');
                    regPassConfirm.classList.remove('hidden');
                    document.getElementById('auth-password').setAttribute('autocomplete', 'new-password');
                    toggleText.innerHTML = `Already have an account? <a href="#" id="auth-toggle-btn" class="text-gnome-blue hover:underline font-bold">Log in</a>`;
                }
                
                this.bindEvents(); 
            });
        }

        if (submitBtn) {
            submitBtn.addEventListener('click', () => {
                // Mock Authentication Logic
                window.AuthState.isLoggedIn = true;
                window.AuthState.user = {
                    username: document.getElementById('auth-username').value || 'Developer',
                    id: 'USR-8472-GNOME'
                };
                
                if (window.updateAuthUI) window.updateAuthUI();
                
                // Route back to the unified store upon successful login
                if (window.showViewHandler) {
                    window.showViewHandler('store');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            });
        }
    }
}

window.AuthView = AuthView;