/**
 * Framesearch - Preloader Manager
 * Управление креативным прелоадером с анимациями
 * 
 * Автор: SerGioPlay
 * © 2026 Framesearch
 */

class PreloaderManager {
    constructor() {
        this.preloader = null;
        this.loadingBar = null;
        this.loadingPercentage = null;
        this.loadingText = null;
        this.loadingTip = null;
        this.progress = 0;
        this.targetProgress = 0;
        this.isComplete = false;
        this.startTime = Date.now();
        this.minDisplayTime = 1500; // Minimum display time in ms
        
        // Tips will be loaded from i18n
        this.tips = [];
        this.currentTipIndex = 0;
    }
    
    getTranslation(key, fallback) {
        if (typeof i18n !== 'undefined' && typeof i18n.t === 'function') {
            return i18n.t(key);
        }
        return fallback;
    }
    
    loadTips() {
        // Load tips from i18n if available
        if (typeof i18n !== 'undefined' && typeof i18n.t === 'function') {
            this.tips = [
                { icon: '🎬', text: i18n.t('preloader.tip1') },
                { icon: '🔍', text: i18n.t('preloader.tip2') },
                { icon: '⚡', text: i18n.t('preloader.tip3') },
                { icon: '🎨', text: i18n.t('preloader.tip4') },
                { icon: '📱', text: i18n.t('preloader.tip5') },
                { icon: '🔒', text: i18n.t('preloader.tip6') },
                { icon: '🎯', text: i18n.t('preloader.tip7') },
                { icon: '⭐', text: i18n.t('preloader.tip8') },
                { icon: '🌐', text: i18n.t('preloader.tip9') },
                { icon: '🎭', text: i18n.t('preloader.tip10') }
            ];
        } else {
            // Fallback to Russian
            this.tips = [
                { icon: '🎬', text: 'Framesearch хранит все данные локально в вашем браузере' },
                { icon: '🔍', text: 'Используйте Ctrl+K для быстрого поиска по коллекции' },
                { icon: '⚡', text: 'Добавляйте видео одним кликом с помощью Ctrl+N' },
                { icon: '🎨', text: 'Выберите одну из 7 готовых тем или создайте свою' },
                { icon: '📱', text: 'Установите PWA приложение для работы оффлайн' },
                { icon: '🔒', text: 'Экспортируйте данные с паролем для безопасного обмена' },
                { icon: '🎯', text: 'Организуйте видео в коллекции для удобной навигации' },
                { icon: '⭐', text: 'Отмечайте избранное для быстрого доступа' },
                { icon: '🌐', text: 'Поддержка 4 типов источников: балансеры, прямые ссылки, соцсети, iframe' },
                { icon: '🎭', text: 'Переключайтесь между режимами просмотра: список, плитка, постеры' }
            ];
        }
    }

    init() {
        this.loadTips();
        this.createPreloader();
        this.attachEventListeners();
        this.startLoading();
        this.startTipRotation();
    }

    createPreloader() {
        const preloaderHTML = `
            <div class="preloader" id="preloader">
                <div class="preloader-bg"></div>
                
                <div class="preloader-particles">
                    <div class="particle"></div>
                    <div class="particle"></div>
                    <div class="particle"></div>
                    <div class="particle"></div>
                    <div class="particle"></div>
                </div>
                
                <div class="preloader-content">
                    <div class="preloader-logo">
                        Frame<span class="logo-accent">search</span>
                    </div>
                    
                    <div class="film-strip">
                        <div class="film-frames">
                            <div class="film-frame">
                                <i data-lucide="film"></i>
                            </div>
                            <div class="film-frame">
                                <i data-lucide="video"></i>
                            </div>
                            <div class="film-frame">
                                <i data-lucide="play-circle"></i>
                            </div>
                            <div class="film-frame">
                                <i data-lucide="film"></i>
                            </div>
                        </div>
                        <div class="loading-percentage" id="loadingPercentage">0%</div>
                    </div>
                    
                    <div class="loading-bar-container">
                        <div class="loading-bar" id="loadingBar"></div>
                    </div>
                    
                    <div class="loading-text" id="loadingText">${this.getTranslation('preloader.loading', 'Загрузка...')}</div>
                </div>
                
                <div class="loading-tips">
                    <div class="loading-tip" id="loadingTip">
                        <span class="loading-tip-icon">💡</span>
                        <span>${this.getTranslation('preloader.initialTip', 'Загружаем ваше персональное видеохранилище...')}</span>
                    </div>
                </div>
                
                <button class="preloader-skip" id="preloaderSkip">
                    <i data-lucide="skip-forward"></i>
                    <span data-i18n="preloader.skip">${this.getTranslation('preloader.skip', 'Пропустить')}</span>
                </button>
            </div>
        `;

        document.body.insertAdjacentHTML('afterbegin', preloaderHTML);
        
        this.preloader = document.getElementById('preloader');
        this.loadingBar = document.getElementById('loadingBar');
        this.loadingPercentage = document.getElementById('loadingPercentage');
        this.loadingText = document.getElementById('loadingText');
        this.loadingTip = document.getElementById('loadingTip');
        
        // Initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    attachEventListeners() {
        // Skip button
        const skipBtn = document.getElementById('preloaderSkip');
        if (skipBtn) {
            skipBtn.addEventListener('click', () => this.hide());
        }

        // Listen for i18n initialization to update texts
        window.addEventListener('i18nReady', () => {
            this.updateTextsWithTranslations();
        });

        // Listen for language changes
        window.addEventListener('languageChanged', () => {
            this.loadTips();
            this.showRandomTip();
            this.updateTextsWithTranslations();
        });

        // Track actual page load progress
        if (document.readyState === 'complete') {
            // Page already loaded
            setTimeout(() => this.setProgress(100), 100);
        } else {
            // Listen for load events
            window.addEventListener('load', () => {
                setTimeout(() => this.setProgress(100), 100);
            });
            
            // Also listen for DOMContentLoaded as backup
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => {
                    setTimeout(() => this.setProgress(80), 100);
                });
            }
        }

        // Track resource loading simulation
        this.trackResourceLoading();
    }

    updateTextsWithTranslations() {
        // Helper function for translation
        const t = (key, fallback) => {
            if (typeof i18n !== 'undefined' && typeof i18n.t === 'function') {
                return i18n.t(key);
            }
            return fallback;
        };

        // Update loading text if still visible
        if (this.loadingText && !this.isComplete) {
            const currentText = this.loadingText.textContent;
            // Only update if it's still showing the default loading text
            if (currentText === 'Загрузка...' || currentText === 'Loading...') {
                this.loadingText.textContent = t('preloader.loading', 'Загрузка...');
            }
        }

        // Update skip button text
        const skipBtn = document.querySelector('#preloaderSkip span[data-i18n="preloader.skip"]');
        if (skipBtn && typeof i18n !== 'undefined' && typeof i18n.t === 'function') {
            skipBtn.textContent = i18n.t('preloader.skip');
        }
    }

    trackResourceLoading() {
        // Store resource definitions for later updates
        this.resourceStages = [
            { key: 'preloader.loading.styles', fallback: 'Стили', delay: 200, progress: 20 },
            { key: 'preloader.loading.scripts', fallback: 'Скрипты', delay: 400, progress: 40 },
            { key: 'preloader.loading.database', fallback: 'База данных', delay: 600, progress: 60 },
            { key: 'preloader.loading.interface', fallback: 'Интерфейс', delay: 800, progress: 80 },
            { key: 'preloader.loading.ready', fallback: 'Готово', delay: 1000, progress: 100 }
        ];

        this.resourceStages.forEach((resource) => {
            setTimeout(() => {
                if (!this.isComplete) {
                    this.setProgress(resource.progress);
                    // Try to get translation, fallback to default
                    const text = this.getTranslation(resource.key, resource.fallback);
                    this.setLoadingText(text);
                }
            }, resource.delay);
        });
    }

    startLoading() {
        // Smooth progress animation
        const animate = () => {
            if (!this.isComplete) {
                if (this.progress < this.targetProgress) {
                    this.progress += (this.targetProgress - this.progress) * 0.1;
                    
                    if (this.loadingBar) {
                        this.loadingBar.style.width = `${this.progress}%`;
                    }
                    
                    if (this.loadingPercentage) {
                        this.loadingPercentage.textContent = `${Math.round(this.progress)}%`;
                    }
                }
                
                if (this.progress >= 99.5 && this.targetProgress >= 100 && !this.isComplete) {
                    this.isComplete = true;
                    this.progress = 100;
                    if (this.loadingBar) {
                        this.loadingBar.style.width = '100%';
                    }
                    if (this.loadingPercentage) {
                        this.loadingPercentage.textContent = '100%';
                    }
                    this.onLoadComplete();
                } else {
                    requestAnimationFrame(animate);
                }
            }
        };
        
        animate();
    }

    setProgress(value) {
        this.targetProgress = Math.min(100, Math.max(0, value));
    }

    setLoadingText(text) {
        if (this.loadingText) {
            this.loadingText.style.opacity = '0';
            setTimeout(() => {
                this.loadingText.textContent = text;
                this.loadingText.style.opacity = '1';
            }, 150);
        }
    }

    startTipRotation() {
        // Show random tip every 3 seconds
        this.showRandomTip();
        
        this.tipInterval = setInterval(() => {
            if (!this.isComplete) {
                this.showRandomTip();
            }
        }, 3000);
    }

    showRandomTip() {
        if (!this.loadingTip) return;
        
        // Get random tip different from current
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.tips.length);
        } while (newIndex === this.currentTipIndex && this.tips.length > 1);
        
        this.currentTipIndex = newIndex;
        const tip = this.tips[this.currentTipIndex];
        
        // Fade out
        this.loadingTip.style.opacity = '0';
        
        setTimeout(() => {
            this.loadingTip.innerHTML = `
                <span class="loading-tip-icon">${tip.icon}</span>
                <span>${tip.text}</span>
            `;
            // Fade in
            this.loadingTip.style.opacity = '1';
        }, 300);
    }

    onLoadComplete() {
        // Ensure minimum display time
        const elapsedTime = Date.now() - this.startTime;
        const remainingTime = Math.max(0, this.minDisplayTime - elapsedTime);
        
        setTimeout(() => {
            this.hide();
        }, remainingTime);
    }

    hide() {
        if (this.tipInterval) {
            clearInterval(this.tipInterval);
        }
        
        if (this.preloader) {
            this.preloader.classList.add('hidden');
            
            // Remove from DOM after transition
            setTimeout(() => {
                if (this.preloader && this.preloader.parentNode) {
                    this.preloader.remove();
                }
            }, 500);
        }
        
        // Dispatch event for other scripts
        window.dispatchEvent(new Event('preloaderHidden'));
    }

    // Public method to manually set progress
    updateProgress(value, text = null) {
        this.setProgress(value);
        if (text) {
            this.setLoadingText(text);
        }
    }
}

// Auto-initialize preloader
const preloaderManager = new PreloaderManager();
window.preloaderManager = preloaderManager;

// Start preloader immediately
if (document.readyState === 'loading') {
    preloaderManager.init();
} else {
    // If DOM already loaded, show briefly
    preloaderManager.init();
    setTimeout(() => {
        preloaderManager.setProgress(100);
    }, 100);
}

// Ensure preloader completes on window load
window.addEventListener('load', () => {
    setTimeout(() => {
        if (preloaderManager && !preloaderManager.isComplete) {
            preloaderManager.setProgress(100);
        }
    }, 100);
});

// Fallback: force hide after 5 seconds
setTimeout(() => {
    if (preloaderManager && preloaderManager.preloader && !preloaderManager.preloader.classList.contains('hidden')) {
        preloaderManager.hide();
    }
}, 5000);

// Export for use in other scripts
window.PreloaderManager = PreloaderManager;
