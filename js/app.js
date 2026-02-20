import State from './state.js';

const App = {
    init() {
        this.bindEvents();
        this.highlightActiveLink();
        console.log('LifeOS Initialized');
    },

    bindEvents() {
        // Theme Toggle
        const themeBtn = document.getElementById('theme-toggle');
        if (themeBtn) {
            themeBtn.addEventListener('click', () => {
                State.toggleTheme();
                this.updateThemeIcon();
            });
        }

        // Sidebar Toggle (Mobile)
        const menuBtn = document.getElementById('menu-toggle');
        const sidebar = document.querySelector('.sidebar');
        if (menuBtn && sidebar) {
            menuBtn.addEventListener('click', () => {
                sidebar.classList.toggle('open');
            });
        }

        // Settings Modal
        const settingsBtn = document.getElementById('settings-btn');
        const modal = document.getElementById('settings-modal');
        const closeBtn = document.querySelector('.close-modal');
        const saveApiBtn = document.getElementById('save-api-key');
        const apiInput = document.getElementById('api-key-input');

        if (settingsBtn && modal) {
            settingsBtn.addEventListener('click', () => {
                apiInput.value = State.settings.apiKey || '';
                modal.classList.add('active');
            });
        }

        if (closeBtn && modal) {
            closeBtn.addEventListener('click', () => {
                modal.classList.remove('active');
            });
        }

        if (saveApiBtn && apiInput) {
            saveApiBtn.addEventListener('click', () => {
                State.setApiKey(apiInput.value);
                modal.classList.remove('active');
                this.showNotification('API Key Saved Successfully');
            });
        }
    },

    updateThemeIcon() {
        const icon = document.querySelector('#theme-toggle i');
        if (icon) {
            icon.className = State.settings.theme === 'dark' ? 'ri-sun-line' : 'ri-moon-line';
        }
    },

    highlightActiveLink() {
        const currentPath = window.location.pathname;
        const page = currentPath.split('/').pop() || 'index.html';
        const links = document.querySelectorAll('.nav-link');

        links.forEach(link => {
            if (link.getAttribute('href') === page) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    },

    showNotification(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type} glass-panel animate-in`;
        toast.innerHTML = `
            <i class="ri-${type === 'success' ? 'checkbox-circle' : 'error-warning'}-line"></i>
            <span>${message}</span>
        `;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.classList.add('fade-out');
            setTimeout(() => toast.remove(), 500);
        }, 3000);
    }
};

document.addEventListener('DOMContentLoaded', () => App.init());

export default App;
