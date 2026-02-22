/**
 * Framesearch - Floating Actions Manager
 * Управление единым блоком плавающих кнопок
 * 
 * Автор: SerGioPlay
 * © 2026 Framesearch
 */

class FloatingActionsManager {
    constructor() {
        this.container = null;
        this.mainButton = null;
        this.secondaryActions = null;
        this.toggleButton = null;
        this.scrollTopButton = null;
        this.isExpanded = false;
        this.lastScrollTop = 0;
    }

    init() {
        this.createFloatingActions();
        this.attachEventListeners();
        this.initScrollBehavior();
    }

    createFloatingActions() {
        const actionsHTML = `
            <div class="fab-backdrop" id="fabBackdrop"></div>
            <div class="floating-actions" id="floatingActions">
                <!-- Scroll to Top -->
                <button class="fab-btn fab-scroll-top" id="scrollTopBtn" title="Наверх" aria-label="Прокрутить наверх">
                    <i data-lucide="arrow-up"></i>
                </button>
                
                <!-- Secondary Actions -->
                <div class="fab-secondary" id="fabSecondary">
                    <!-- Add Content -->
                    <button class="fab-btn add-btn" id="addContentFabBtn" title="Добавить контент" aria-label="Добавить новое видео или музыку">
                        <span class="fab-label" data-i18n="action.addVideo">Добавить контент</span>
                        <i data-lucide="plus-circle"></i>
                    </button>
                    
                    <!-- App Lock -->
                    <button class="fab-btn lock-btn" id="appLockFabBtn" title="Защита приложения" aria-label="Настройки защиты приложения">
                        <span class="fab-label" data-i18n="appLock.settingsTitle">Защита приложения</span>
                        <i data-lucide="shield"></i>
                    </button>
                    
                    <!-- Privacy Settings -->
                    <button class="fab-btn privacy-btn" id="privacyFabBtn" title="Настройки конфиденциальности" aria-label="Настройки конфиденциальности">
                        <span class="fab-label">Конфиденциальность</span>
                        <i data-lucide="cookie"></i>
                    </button>
                    
                    <!-- Import -->
                    <button class="fab-btn import-btn" id="importFabBtn" title="Импорт" aria-label="Импорт данных">
                        <span class="fab-label" data-i18n="action.import">Импорт</span>
                        <i data-lucide="upload"></i>
                    </button>
                    
                    <!-- Collections -->
                    <button class="fab-btn collections-btn" id="collectionsFabBtn" title="Коллекции" aria-label="Управление коллекциями">
                        <span class="fab-label" data-i18n="collections.title">Коллекции</span>
                        <i data-lucide="folder"></i>
                    </button>
                    
                    <!-- Search -->
                    <button class="fab-btn search-btn" id="searchFabBtn" title="Поиск" aria-label="Открыть поиск">
                        <span class="fab-label" data-i18n="action.search">Поиск</span>
                        <i data-lucide="search"></i>
                    </button>
                    
                    <!-- Theme Settings -->
                    <button class="fab-btn theme-btn" id="themeFabBtn" title="Настройки темы" aria-label="Открыть настройки темы">
                        <span class="fab-label" data-i18n="theme.settings">Настройки темы</span>
                        <i data-lucide="palette"></i>
                    </button>
                </div>
                
                <!-- Main Menu Button -->
                <button class="fab-main" id="fabMain" title="Меню" aria-label="Открыть меню действий">
                    <i data-lucide="menu"></i>
                </button>
            </div>
        `;

        // Remove old floating buttons if they exist
        const oldFab = document.querySelector('.fab');
        const oldThemeBtn = document.querySelector('.floating-btn.theme-btn');
        const oldScrollBtn = document.querySelector('.scroll-to-top');
        const oldCookieBtn = document.querySelector('.cookie-settings-btn');
        
        if (oldFab) oldFab.remove();
        if (oldThemeBtn) oldThemeBtn.remove();
        if (oldScrollBtn) oldScrollBtn.remove();
        if (oldCookieBtn) oldCookieBtn.remove();

        document.body.insertAdjacentHTML('beforeend', actionsHTML);
        
        this.container = document.getElementById('floatingActions');
        this.mainButton = document.getElementById('fabMain');
        this.secondaryActions = document.getElementById('fabSecondary');
        this.backdrop = document.getElementById('fabBackdrop');
        this.scrollTopButton = document.getElementById('scrollTopBtn');
        
        // Initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    attachEventListeners() {
        // Main button - Toggle menu
        if (this.mainButton) {
            this.mainButton.addEventListener('click', (e) => {
                e.stopPropagation();
                if (this.isExpanded) {
                    this.collapseSecondaryActions();
                } else {
                    this.expandSecondaryActions();
                }
            });
        }

        // Backdrop click - Close menu
        if (this.backdrop) {
            this.backdrop.addEventListener('click', () => {
                this.collapseSecondaryActions();
            });
        }

        // Add Content button
        const addContentBtn = document.getElementById('addContentFabBtn');
        if (addContentBtn) {
            addContentBtn.addEventListener('click', () => {
                if (typeof modal !== 'undefined' && modal.open) {
                    modal.open();
                } else {
                    logger.warn('Modal object not found');
                }
                this.collapseSecondaryActions();
            });
        }

        // App Lock button
        const appLockBtn = document.getElementById('appLockFabBtn');
        if (appLockBtn) {
            appLockBtn.addEventListener('click', () => {
                if (typeof appLock !== 'undefined' && appLock.showSettingsModal) {
                    appLock.showSettingsModal();
                } else {
                    logger.warn('App Lock not initialized');
                }
                this.collapseSecondaryActions();
            });
        }

        // Privacy/Cookie settings button
        const privacyBtn = document.getElementById('privacyFabBtn');
        if (privacyBtn) {
            privacyBtn.addEventListener('click', () => {
                if (typeof openCookieSettings === 'function') {
                    openCookieSettings();
                } else {
                    // Fallback: trigger click on cookie settings button if it exists
                    const cookieBtn = document.querySelector('.cookie-settings-btn');
                    if (cookieBtn) {
                        cookieBtn.click();
                    }
                }
                this.collapseSecondaryActions();
            });
        }

        // Theme button
        const themeBtn = document.getElementById('themeFabBtn');
        if (themeBtn) {
            themeBtn.addEventListener('click', () => {
                if (typeof themeManager !== 'undefined' && themeManager.openModal) {
                    themeManager.openModal();
                }
                this.collapseSecondaryActions();
            });
        }

        // Search button
        const searchBtn = document.getElementById('searchFabBtn');
        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                window.location.href = 'search_results.html';
            });
        }

        // Collections button
        const collectionsBtn = document.getElementById('collectionsFabBtn');
        if (collectionsBtn) {
            collectionsBtn.addEventListener('click', () => {
                if (typeof collectionsManager !== 'undefined' && collectionsManager.open) {
                    collectionsManager.open();
                }
                this.collapseSecondaryActions();
            });
        }

        // Import button
        const importBtn = document.getElementById('importFabBtn');
        if (importBtn) {
            importBtn.addEventListener('click', () => {
                if (typeof importManager !== 'undefined' && importManager.open) {
                    importManager.open();
                }
                this.collapseSecondaryActions();
            });
        }

        // Scroll to top button
        if (this.scrollTopButton) {
            this.scrollTopButton.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }

        // Close menu on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isExpanded) {
                this.collapseSecondaryActions();
            }
        });
    }

    initScrollBehavior() {
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Show/hide scroll to top button
            if (scrollTop > 300) {
                this.scrollTopButton?.classList.add('visible');
            } else {
                this.scrollTopButton?.classList.remove('visible');
            }
            
            // Auto-collapse on scroll
            if (this.isExpanded) {
                this.collapseSecondaryActions();
            }
        });
    }

    expandSecondaryActions() {
        this.isExpanded = true;
        this.secondaryActions?.classList.add('expanded');
        this.mainButton?.classList.add('active');
        this.backdrop?.classList.add('active');
    }

    collapseSecondaryActions() {
        this.isExpanded = false;
        this.secondaryActions?.classList.remove('expanded');
        this.mainButton?.classList.remove('active');
        this.backdrop?.classList.remove('active');
    }

    // Public methods for external control
    showBadge(buttonId, count) {
        const button = document.getElementById(buttonId);
        if (!button) return;
        
        let badge = button.querySelector('.fab-badge');
        if (!badge) {
            badge = document.createElement('span');
            badge.className = 'fab-badge';
            button.appendChild(badge);
        }
        
        badge.textContent = count > 99 ? '99+' : count;
        badge.style.display = count > 0 ? 'flex' : 'none';
    }

    hideBadge(buttonId) {
        const button = document.getElementById(buttonId);
        if (!button) return;
        
        const badge = button.querySelector('.fab-badge');
        if (badge) {
            badge.style.display = 'none';
        }
    }

    addPulseEffect(buttonId) {
        const button = document.getElementById(buttonId);
        if (button) {
            button.classList.add('pulse');
        }
    }

    removePulseEffect(buttonId) {
        const button = document.getElementById(buttonId);
        if (button) {
            button.classList.remove('pulse');
        }
    }

    hide() {
        if (this.container) {
            this.container.style.display = 'none';
        }
    }

    show() {
        if (this.container) {
            this.container.style.display = 'flex';
        }
    }
}

// Create global instance
const floatingActionsManager = new FloatingActionsManager();
window.floatingActionsManager = floatingActionsManager;

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        floatingActionsManager.init();
    });
} else {
    floatingActionsManager.init();
}

// Reinitialize icons when language changes
window.addEventListener('languageChanged', () => {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});

// Export for use in other scripts
window.FloatingActionsManager = FloatingActionsManager;
