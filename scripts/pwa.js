/**
 * Framesearch - PWA Manager
 * 
 * Автор: SerGioPlay
 * GitHub: https://github.com/SerGioPlay01
 * Проект: https://github.com/SerGioPlay01/framesearch
 * Сайт: https://sergioplay-dev.vercel.app/
 * 
 * © 2026 Framesearch.  
 */

class PWAManager {
    constructor() {
        this.deferredPrompt = null;
        this.isInstalled = false;
        this.swRegistration = null;
    }

    async init() {
        // Check if already installed
        this.checkInstallation();

        // Register service worker
        await this.registerServiceWorker();

        // Setup install prompt
        this.setupInstallPrompt();

        // Setup update checker
        this.setupUpdateChecker();

        // Add install button to footer
        this.addInstallButton();

        // Handle app shortcuts
        this.handleShortcuts();
    }

    checkInstallation() {
        // Check if running as installed PWA
        if (window.matchMedia('(display-mode: standalone)').matches || 
            window.navigator.standalone === true) {
            this.isInstalled = true;
            console.log('[PWA] Running as installed app');
        }
    }

    async registerServiceWorker() {
        if (!('serviceWorker' in navigator)) {
            console.log('[PWA] Service Worker not supported');
            return;
        }

        try {
            this.swRegistration = await navigator.serviceWorker.register('/sw.js', {
                scope: '/'
            });

            console.log('[PWA] Service Worker registered:', this.swRegistration);

            // Check for updates every hour
            setInterval(() => {
                this.swRegistration.update();
            }, 60 * 60 * 1000);

        } catch (error) {
            console.error('[PWA] Service Worker registration failed:', error);
        }
    }

    setupInstallPrompt() {
        window.addEventListener('beforeinstallprompt', (e) => {
            console.log('[PWA] Install prompt available');
            
            // Prevent the mini-infobar from appearing
            e.preventDefault();
            
            // Save the event for later use
            this.deferredPrompt = e;
            
            // Show install button
            this.showInstallButton();
        });

        // Handle successful installation
        window.addEventListener('appinstalled', () => {
            console.log('[PWA] App installed successfully');
            this.isInstalled = true;
            this.deferredPrompt = null;
            this.hideInstallButton();
            this.showNotification('Приложение установлено!', 'success');
        });
    }

    setupUpdateChecker() {
        if (!this.swRegistration) return;

        this.swRegistration.addEventListener('updatefound', () => {
            const newWorker = this.swRegistration.installing;
            console.log('[PWA] New service worker found');

            newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    // New service worker available
                    this.showUpdateNotification();
                }
            });
        });
    }

    async showUpdateNotification() {
        const update = await dialog.confirm(
            'Доступна новая версия приложения. Обновить сейчас?',
            'Обновление доступно'
        );

        if (update) {
            // Tell the service worker to skip waiting
            if (this.swRegistration && this.swRegistration.waiting) {
                this.swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
            }

            // Reload the page
            window.location.reload();
        }
    }

    addInstallButton() {
        // Add install button to footer
        const footer = document.querySelector('.footer-section');
        if (!footer) return;

        const installButtonHTML = `
            <button id="pwaInstallBtn" class="btn btn-primary" style="display: none; width: 100%; margin-top: 1rem;">
                <i data-lucide="download"></i>
                Установить приложение
            </button>
        `;

        footer.insertAdjacentHTML('beforeend', installButtonHTML);

        const installBtn = document.getElementById('pwaInstallBtn');
        if (installBtn) {
            installBtn.addEventListener('click', () => this.promptInstall());
        }

        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    showInstallButton() {
        const installBtn = document.getElementById('pwaInstallBtn');
        if (installBtn && !this.isInstalled) {
            installBtn.style.display = 'block';
        }
    }

    hideInstallButton() {
        const installBtn = document.getElementById('pwaInstallBtn');
        if (installBtn) {
            installBtn.style.display = 'none';
        }
    }

    async promptInstall() {
        if (!this.deferredPrompt) {
            this.showNotification('Установка недоступна в этом браузере', 'info');
            return;
        }

        // Show the install prompt
        this.deferredPrompt.prompt();

        // Wait for the user's response
        const { outcome } = await this.deferredPrompt.userChoice;
        console.log('[PWA] Install prompt outcome:', outcome);

        if (outcome === 'accepted') {
            console.log('[PWA] User accepted the install prompt');
        } else {
            console.log('[PWA] User dismissed the install prompt');
        }

        // Clear the deferred prompt
        this.deferredPrompt = null;
    }

    handleShortcuts() {
        // Handle URL parameters from shortcuts
        const urlParams = new URLSearchParams(window.location.search);
        const action = urlParams.get('action');

        if (action === 'add' && typeof modal !== 'undefined') {
            // Open add video modal
            setTimeout(() => {
                modal.open();
            }, 500);
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `pwa-notification ${type}`;
        notification.innerHTML = `
            <i data-lucide="${type === 'success' ? 'check-circle' : 'info'}"></i>
            <span>${message}</span>
        `;
        document.body.appendChild(notification);

        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        setTimeout(() => notification.classList.add('show'), 10);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Preload critical resources
    preloadResources(urls) {
        if (!this.swRegistration) return;

        this.swRegistration.active.postMessage({
            type: 'CACHE_URLS',
            urls: urls
        });
    }

    // Check network status
    setupNetworkMonitoring() {
        window.addEventListener('online', () => {
            this.showNotification('Соединение восстановлено', 'success');
        });

        window.addEventListener('offline', () => {
            this.showNotification('Работа в оффлайн режиме', 'info');
        });
    }

    // Get app info
    getAppInfo() {
        return {
            isInstalled: this.isInstalled,
            isOnline: navigator.onLine,
            hasServiceWorker: !!this.swRegistration,
            canInstall: !!this.deferredPrompt
        };
    }
}

// Create global instance
const pwaManager = new PWAManager();
window.pwaManager = pwaManager;

// Initialize PWA on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        pwaManager.init();
        pwaManager.setupNetworkMonitoring();
    });
} else {
    pwaManager.init();
    pwaManager.setupNetworkMonitoring();
}
