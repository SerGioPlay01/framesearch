/**
 * Framesearch - Theme Customization Manager
 * 
 * Автор: SerGioPlay
 * GitHub: https://github.com/SerGioPlay01
 * Проект: https://github.com/SerGioPlay01/framesearch
 * Сайт: https://sergioplay-dev.vercel.app/
 * 
 * © 2026 Framesearch.  
 */

class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('framesearch-theme') || 'default';
        this.customColors = this.loadCustomColors();
        this.themes = {
            default: {
                name: 'Темная элегантность',
                description: 'Классический темный стиль с синими акцентами',
                icon: 'moon',
                colors: {
                    '--bg-primary': '#0f172a',
                    '--bg-secondary': '#1e293b',
                    '--bg-tertiary': '#334155',
                    '--text-primary': '#ffffff',
                    '--text-secondary': '#cbd5e1',
                    '--accent-primary': '#a5b4fc',
                    '--accent-secondary': '#818cf8',
                    '--glass-bg': 'rgba(30, 41, 59, 0.4)',
                    '--glass-border': 'rgba(255, 255, 255, 0.05)',
                    '--overlay-start': 'rgba(15, 23, 42, 0.3)',
                    '--overlay-end': 'rgba(15, 23, 42, 0.95)',
                    '--card-hover-scale': '1.05',
                    '--border-radius': '12px',
                    '--shadow-color': 'rgba(0, 0, 0, 0.3)',
                    '--btn-primary-bg': '#a5b4fc',
                    '--btn-primary-hover': '#818cf8',
                    '--btn-secondary-bg': 'rgba(255, 255, 255, 0.05)',
                    '--btn-secondary-hover': 'rgba(255, 255, 255, 0.1)',
                    '--danger-color': '#ef4444',
                    '--danger-hover': '#dc2626',
                    '--success-color': '#10b981',
                    '--success-hover': '#059669',
                    '--overlay-dark': 'rgba(0, 0, 0, 0.8)',
                    '--overlay-light': 'rgba(255, 255, 255, 0.1)'
                }
            },
            purple: {
                name: 'Фиолетовая ночь',
                description: 'Мягкие фиолетовые тона для вечернего просмотра',
                icon: 'sparkles',
                colors: {
                    '--bg-primary': '#1a0b2e',
                    '--bg-secondary': '#2d1b4e',
                    '--bg-tertiary': '#3f2d5c',
                    '--text-primary': '#ffffff',
                    '--text-secondary': '#d8b4fe',
                    '--accent-primary': '#c084fc',
                    '--accent-secondary': '#a855f7',
                    '--glass-bg': 'rgba(45, 27, 78, 0.4)',
                    '--glass-border': 'rgba(192, 132, 252, 0.1)',
                    '--overlay-start': 'rgba(26, 11, 46, 0.3)',
                    '--overlay-end': 'rgba(26, 11, 46, 0.95)',
                    '--card-hover-scale': '1.05',
                    '--border-radius': '12px',
                    '--shadow-color': 'rgba(168, 85, 247, 0.3)',
                    '--btn-primary-bg': '#c084fc',
                    '--btn-primary-hover': '#a855f7',
                    '--btn-secondary-bg': 'rgba(255, 255, 255, 0.05)',
                    '--btn-secondary-hover': 'rgba(255, 255, 255, 0.1)',
                    '--danger-color': '#ef4444',
                    '--danger-hover': '#dc2626',
                    '--success-color': '#10b981',
                    '--success-hover': '#059669',
                    '--overlay-dark': 'rgba(0, 0, 0, 0.8)',
                    '--overlay-light': 'rgba(255, 255, 255, 0.1)'
                }
            },
            ocean: {
                name: 'Океанская свежесть',
                description: 'Освежающие голубые и бирюзовые оттенки',
                icon: 'waves',
                colors: {
                    '--bg-primary': '#0a1929',
                    '--bg-secondary': '#1a2f42',
                    '--bg-tertiary': '#2a4558',
                    '--text-primary': '#ffffff',
                    '--text-secondary': '#a5d8ff',
                    '--accent-primary': '#22d3ee',
                    '--accent-secondary': '#06b6d4',
                    '--glass-bg': 'rgba(26, 47, 66, 0.4)',
                    '--glass-border': 'rgba(34, 211, 238, 0.1)',
                    '--overlay-start': 'rgba(10, 25, 41, 0.3)',
                    '--overlay-end': 'rgba(10, 25, 41, 0.95)',
                    '--card-hover-scale': '1.05',
                    '--border-radius': '12px',
                    '--shadow-color': 'rgba(34, 211, 238, 0.3)',
                    '--btn-primary-bg': '#22d3ee',
                    '--btn-primary-hover': '#06b6d4',
                    '--btn-secondary-bg': 'rgba(255, 255, 255, 0.05)',
                    '--btn-secondary-hover': 'rgba(255, 255, 255, 0.1)',
                    '--danger-color': '#ef4444',
                    '--danger-hover': '#dc2626',
                    '--success-color': '#10b981',
                    '--success-hover': '#059669',
                    '--overlay-dark': 'rgba(0, 0, 0, 0.8)',
                    '--overlay-light': 'rgba(255, 255, 255, 0.1)'
                }
            },
            sunset: {
                name: 'Закатное сияние',
                description: 'Теплые оранжевые и розовые оттенки заката',
                icon: 'sunset',
                colors: {
                    '--bg-primary': '#1a0f0a',
                    '--bg-secondary': '#2d1810',
                    '--bg-tertiary': '#3d2418',
                    '--text-primary': '#ffffff',
                    '--text-secondary': '#fecaca',
                    '--accent-primary': '#fb923c',
                    '--accent-secondary': '#f97316',
                    '--glass-bg': 'rgba(45, 24, 16, 0.4)',
                    '--glass-border': 'rgba(251, 146, 60, 0.1)',
                    '--overlay-start': 'rgba(26, 15, 10, 0.3)',
                    '--overlay-end': 'rgba(26, 15, 10, 0.95)',
                    '--card-hover-scale': '1.06',
                    '--border-radius': '16px',
                    '--shadow-color': 'rgba(251, 146, 60, 0.4)',
                    '--btn-primary-bg': '#fb923c',
                    '--btn-primary-hover': '#f97316',
                    '--btn-secondary-bg': 'rgba(255, 255, 255, 0.05)',
                    '--btn-secondary-hover': 'rgba(255, 255, 255, 0.1)',
                    '--danger-color': '#ef4444',
                    '--danger-hover': '#dc2626',
                    '--success-color': '#10b981',
                    '--success-hover': '#059669',
                    '--overlay-dark': 'rgba(0, 0, 0, 0.8)',
                    '--overlay-light': 'rgba(255, 255, 255, 0.1)'
                }
            },
            forest: {
                name: 'Лесная тишина',
                description: 'Успокаивающие зеленые тона природы',
                icon: 'trees',
                colors: {
                    '--bg-primary': '#0a1f0f',
                    '--bg-secondary': '#14291a',
                    '--bg-tertiary': '#1e3d28',
                    '--text-primary': '#ffffff',
                    '--text-secondary': '#bbf7d0',
                    '--accent-primary': '#4ade80',
                    '--accent-secondary': '#22c55e',
                    '--glass-bg': 'rgba(20, 41, 26, 0.4)',
                    '--glass-border': 'rgba(74, 222, 128, 0.1)',
                    '--overlay-start': 'rgba(10, 31, 15, 0.3)',
                    '--overlay-end': 'rgba(10, 31, 15, 0.95)',
                    '--card-hover-scale': '1.05',
                    '--border-radius': '14px',
                    '--shadow-color': 'rgba(74, 222, 128, 0.3)',
                    '--btn-primary-bg': '#4ade80',
                    '--btn-primary-hover': '#22c55e',
                    '--btn-secondary-bg': 'rgba(255, 255, 255, 0.05)',
                    '--btn-secondary-hover': 'rgba(255, 255, 255, 0.1)',
                    '--danger-color': '#ef4444',
                    '--danger-hover': '#dc2626',
                    '--success-color': '#10b981',
                    '--success-hover': '#059669',
                    '--overlay-dark': 'rgba(0, 0, 0, 0.8)',
                    '--overlay-light': 'rgba(255, 255, 255, 0.1)'
                }
            },
            rose: {
                name: 'Розовая мечта',
                description: 'Нежные розовые оттенки для романтического настроения',
                icon: 'heart',
                colors: {
                    '--bg-primary': '#1f0a1a',
                    '--bg-secondary': '#2d1424',
                    '--bg-tertiary': '#3d1e32',
                    '--text-primary': '#ffffff',
                    '--text-secondary': '#fbcfe8',
                    '--accent-primary': '#f472b6',
                    '--accent-secondary': '#ec4899',
                    '--glass-bg': 'rgba(45, 20, 36, 0.4)',
                    '--glass-border': 'rgba(244, 114, 182, 0.1)',
                    '--overlay-start': 'rgba(31, 10, 26, 0.3)',
                    '--overlay-end': 'rgba(31, 10, 26, 0.95)',
                    '--card-hover-scale': '1.07',
                    '--border-radius': '18px',
                    '--shadow-color': 'rgba(244, 114, 182, 0.4)',
                    '--btn-primary-bg': '#f472b6',
                    '--btn-primary-hover': '#ec4899',
                    '--btn-secondary-bg': 'rgba(255, 255, 255, 0.05)',
                    '--btn-secondary-hover': 'rgba(255, 255, 255, 0.1)',
                    '--danger-color': '#ef4444',
                    '--danger-hover': '#dc2626',
                    '--success-color': '#10b981',
                    '--success-hover': '#059669',
                    '--overlay-dark': 'rgba(0, 0, 0, 0.8)',
                    '--overlay-light': 'rgba(255, 255, 255, 0.1)'
                }
            }
        };
    }

    loadCustomColors() {
        const stored = localStorage.getItem('framesearch-custom-colors');
        return stored ? JSON.parse(stored) : null;
    }

    saveCustomColors(colors) {
        localStorage.setItem('framesearch-custom-colors', JSON.stringify(colors));
        this.customColors = colors;
    }

    init() {
        this.createThemeButton();
        this.createThemeModal();
        this.applyTheme(this.currentTheme);
        this.attachEventListeners();
    }

    createThemeButton() {
        const buttonHTML = `
            <button id="themeToggleBtn" class="floating-btn theme-btn" title="Настройки темы">
                <i data-lucide="palette"></i>
            </button>
        `;
        document.body.insertAdjacentHTML('beforeend', buttonHTML);
    }

    createThemeModal() {
        const t = (key) => window.i18n ? window.i18n.t(key) : key;
        
        const themeTranslations = {
            'default': { name: t('theme.default.name'), desc: t('theme.default.desc') },
            'purple': { name: t('theme.midnight'), desc: t('theme.midnight.desc') },
            'ocean': { name: t('theme.ocean'), desc: t('theme.ocean.desc') },
            'sunset': { name: t('theme.sunset'), desc: t('theme.sunset.desc') },
            'forest': { name: t('theme.forest'), desc: t('theme.forest.desc') },
            'rose': { name: t('theme.rose'), desc: t('theme.rose.desc') },
            'mono': { name: t('theme.mono'), desc: t('theme.mono.desc') }
        };
        
        const themesHTML = Object.entries(this.themes).map(([key, theme]) => {
            const trans = themeTranslations[key] || { name: theme.name, desc: theme.description };
            return `
            <div class="theme-option ${this.currentTheme === key ? 'active' : ''}" data-theme="${key}">
                <div class="theme-preview" style="background: ${theme.colors['--bg-primary']}; border-color: ${theme.colors['--accent-primary']};">
                    <div class="theme-preview-accent" style="background: ${theme.colors['--accent-primary']};"></div>
                    <div class="theme-preview-secondary" style="background: ${theme.colors['--bg-secondary']};"></div>
                </div>
                <div class="theme-info">
                    <div class="theme-icon">
                        <i data-lucide="${theme.icon}"></i>
                    </div>
                    <h4>${trans.name}</h4>
                    <p>${trans.desc}</p>
                </div>
                <div class="theme-check">
                    <i data-lucide="check-circle"></i>
                </div>
            </div>
        `;
        }).join('');

        const modalHTML = `
            <div id="themeModal" class="modal">
                <div class="modal-overlay"></div>
                <div class="modal-content theme-modal-content">
                    <div class="modal-header">
                        <h2>
                            <i data-lucide="palette"></i>
                            <span data-i18n="theme.settings">Настройка темы</span>
                        </h2>
                        <button class="modal-close" onclick="themeManager.closeModal()">
                            <i data-lucide="x"></i>
                        </button>
                    </div>

                    <div class="modal-body">
                        <p class="theme-description" data-i18n="theme.description">
                            Выберите готовую тему или создайте свою уникальную
                        </p>
                        
                        <div class="theme-tabs">
                            <button class="theme-tab active" data-tab="presets">
                                <i data-lucide="layout-grid"></i>
                                <span data-i18n="theme.tabs.presets">Готовые темы</span>
                            </button>
                            <button class="theme-tab" data-tab="custom">
                                <i data-lucide="sliders"></i>
                                <span data-i18n="theme.tabs.custom">Кастомизация</span>
                            </button>
                        </div>

                        <div class="theme-tab-content active" data-content="presets">
                            <div class="theme-grid">
                                ${themesHTML}
                            </div>
                        </div>

                        <div class="theme-tab-content" data-content="custom">
                            <div class="custom-theme-editor">
                                <h3 data-i18n="theme.custom.title">Создайте свою тему</h3>
                                <p style="color: #9ca3af; margin-bottom: 1.5rem;" data-i18n="theme.custom.subtitle">Настройте цвета и параметры интерфейса</p>
                                
                                <div class="color-controls">
                                    <div class="color-control-group">
                                        <label>
                                            <span data-i18n="theme.custom.bg.primary">Основной фон</span>
                                            <input type="color" id="customBgPrimary" value="#0f172a">
                                        </label>
                                        <label>
                                            <span data-i18n="theme.custom.bg.secondary">Вторичный фон</span>
                                            <input type="color" id="customBgSecondary" value="#1e293b">
                                        </label>
                                        <label>
                                            <span data-i18n="theme.custom.bg.tertiary">Третичный фон</span>
                                            <input type="color" id="customBgTertiary" value="#334155">
                                        </label>
                                    </div>

                                    <div class="color-control-group">
                                        <label>
                                            <span data-i18n="theme.custom.text.primary">Основной текст</span>
                                            <input type="color" id="customTextPrimary" value="#ffffff">
                                        </label>
                                        <label>
                                            <span data-i18n="theme.custom.text.secondary">Вторичный текст</span>
                                            <input type="color" id="customTextSecondary" value="#cbd5e1">
                                        </label>
                                    </div>

                                    <div class="color-control-group">
                                        <label>
                                            <span data-i18n="theme.custom.accent.primary">Основной акцент</span>
                                            <input type="color" id="customAccentPrimary" value="#a5b4fc">
                                        </label>
                                        <label>
                                            <span data-i18n="theme.custom.accent.secondary">Вторичный акцент</span>
                                            <input type="color" id="customAccentSecondary" value="#818cf8">
                                        </label>
                                    </div>

                                    <div class="slider-control-group">
                                        <label>
                                            <span><span data-i18n="theme.custom.border.radius">Скругление углов</span>: <span id="borderRadiusValue">12</span>px</span>
                                            <input type="range" id="customBorderRadius" min="0" max="24" value="12" step="2">
                                        </label>
                                        <label>
                                            <span><span data-i18n="theme.custom.hover.scale">Масштаб при наведении</span>: <span id="hoverScaleValue">1.05</span></span>
                                            <input type="range" id="customHoverScale" min="1.00" max="1.15" value="1.05" step="0.01">
                                        </label>
                                    </div>
                                </div>

                                <div class="custom-theme-actions">
                                    <button class="btn btn-secondary" onclick="themeManager.resetCustomTheme()">
                                        <i data-lucide="rotate-ccw"></i>
                                        <span data-i18n="theme.custom.reset">Сбросить</span>
                                    </button>
                                    <button class="btn btn-primary" onclick="themeManager.applyCustomTheme()">
                                        <i data-lucide="check"></i>
                                        <span data-i18n="theme.custom.apply">Применить</span>
                                    </button>
                                </div>

                                <div class="custom-theme-preview">
                                    <h4 data-i18n="theme.custom.preview">Предпросмотр</h4>
                                    <div class="preview-card" id="customPreviewCard">
                                        <div class="preview-card-header">
                                            <h5 data-i18n="theme.custom.preview.card">Пример карточки</h5>
                                            <span class="preview-badge" data-i18n="theme.custom.preview.badge">HD</span>
                                        </div>
                                        <p data-i18n="theme.custom.preview.text">Текст описания с вторичным цветом</p>
                                        <button class="preview-button" data-i18n="theme.custom.preview.button">Кнопка</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    attachEventListeners() {
        // Open modal button
        const themeBtn = document.getElementById('themeToggleBtn');
        if (themeBtn) {
            themeBtn.addEventListener('click', () => this.openModal());
        }

        // Theme selection
        const themeOptions = document.querySelectorAll('.theme-option');
        themeOptions.forEach(option => {
            option.addEventListener('click', () => {
                const theme = option.dataset.theme;
                this.selectTheme(theme);
            });
        });

        // Tab switching
        const themeTabs = document.querySelectorAll('.theme-tab');
        themeTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabName = tab.dataset.tab;
                this.switchTab(tabName);
            });
        });

        // Custom color inputs
        this.attachCustomColorListeners();

        // Close on overlay click
        const modal = document.getElementById('themeModal');
        const overlay = modal?.querySelector('.modal-overlay');
        if (overlay) {
            overlay.addEventListener('click', () => this.closeModal());
        }
    }

    attachCustomColorListeners() {
        // Color pickers
        const colorInputs = [
            'customBgPrimary', 'customBgSecondary', 'customBgTertiary',
            'customTextPrimary', 'customTextSecondary',
            'customAccentPrimary', 'customAccentSecondary'
        ];

        colorInputs.forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                input.addEventListener('input', () => this.updateCustomPreview());
            }
        });

        // Sliders
        const borderRadiusSlider = document.getElementById('customBorderRadius');
        if (borderRadiusSlider) {
            borderRadiusSlider.addEventListener('input', (e) => {
                document.getElementById('borderRadiusValue').textContent = e.target.value;
                this.updateCustomPreview();
            });
        }

        const hoverScaleSlider = document.getElementById('customHoverScale');
        if (hoverScaleSlider) {
            hoverScaleSlider.addEventListener('input', (e) => {
                document.getElementById('hoverScaleValue').textContent = e.target.value;
                this.updateCustomPreview();
            });
        }
    }

    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.theme-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`)?.classList.add('active');

        // Update tab content
        document.querySelectorAll('.theme-tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.querySelector(`[data-content="${tabName}"]`)?.classList.add('active');

        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    updateCustomPreview() {
        const previewCard = document.getElementById('customPreviewCard');
        if (!previewCard) return;

        const bgPrimary = document.getElementById('customBgPrimary').value;
        const bgSecondary = document.getElementById('customBgSecondary').value;
        const textPrimary = document.getElementById('customTextPrimary').value;
        const textSecondary = document.getElementById('customTextSecondary').value;
        const accentPrimary = document.getElementById('customAccentPrimary').value;
        const borderRadius = document.getElementById('customBorderRadius').value;

        previewCard.style.background = bgSecondary;
        previewCard.style.borderRadius = `${borderRadius}px`;
        previewCard.style.color = textPrimary;
        
        const header = previewCard.querySelector('.preview-card-header h5');
        if (header) header.style.color = textPrimary;
        
        const description = previewCard.querySelector('p');
        if (description) description.style.color = textSecondary;
        
        const badge = previewCard.querySelector('.preview-badge');
        if (badge) {
            badge.style.background = accentPrimary;
            badge.style.color = bgPrimary;
        }
        
        const button = previewCard.querySelector('.preview-button');
        if (button) {
            button.style.background = accentPrimary;
            button.style.color = bgPrimary;
            button.style.borderRadius = `${borderRadius}px`;
        }
    }

    applyCustomTheme() {
        const bgPrimary = document.getElementById('customBgPrimary').value;
        const bgSecondary = document.getElementById('customBgSecondary').value;
        const accentPrimary = document.getElementById('customAccentPrimary').value;
        const accentSecondary = document.getElementById('customAccentSecondary').value;
        
        const customColors = {
            '--bg-primary': bgPrimary,
            '--bg-secondary': bgSecondary,
            '--bg-tertiary': document.getElementById('customBgTertiary').value,
            '--text-primary': document.getElementById('customTextPrimary').value,
            '--text-secondary': document.getElementById('customTextSecondary').value,
            '--accent-primary': accentPrimary,
            '--accent-secondary': accentSecondary,
            '--border-radius': document.getElementById('customBorderRadius').value + 'px',
            '--card-hover-scale': document.getElementById('customHoverScale').value,
            '--glass-bg': this.hexToRgba(bgSecondary, 0.4),
            '--glass-border': this.hexToRgba(accentPrimary, 0.1),
            '--overlay-start': this.hexToRgba(bgPrimary, 0.3),
            '--overlay-end': this.hexToRgba(bgPrimary, 0.95),
            '--shadow-color': this.hexToRgba(accentPrimary, 0.3),
            '--btn-primary-bg': accentPrimary,
            '--btn-primary-hover': accentSecondary,
            '--btn-secondary-bg': 'rgba(255, 255, 255, 0.05)',
            '--btn-secondary-hover': 'rgba(255, 255, 255, 0.1)',
            '--danger-color': '#ef4444',
            '--danger-hover': '#dc2626',
            '--success-color': '#10b981',
            '--success-hover': '#059669',
            '--overlay-dark': 'rgba(0, 0, 0, 0.8)',
            '--overlay-light': 'rgba(255, 255, 255, 0.1)'
        };

        // Apply to document
        const root = document.documentElement;
        Object.entries(customColors).forEach(([property, value]) => {
            root.style.setProperty(property, value);
        });

        // Save custom theme
        this.saveCustomColors(customColors);
        this.currentTheme = 'custom';
        localStorage.setItem('framesearch-theme', 'custom');

        // Show feedback
        this.showThemeApplied('Пользовательская тема');
        this.closeModal();
    }

    resetCustomTheme() {
        // Reset to default theme values
        document.getElementById('customBgPrimary').value = '#0f172a';
        document.getElementById('customBgSecondary').value = '#1e293b';
        document.getElementById('customBgTertiary').value = '#334155';
        document.getElementById('customTextPrimary').value = '#ffffff';
        document.getElementById('customTextSecondary').value = '#cbd5e1';
        document.getElementById('customAccentPrimary').value = '#a5b4fc';
        document.getElementById('customAccentSecondary').value = '#818cf8';
        document.getElementById('customBorderRadius').value = '12';
        document.getElementById('customHoverScale').value = '1.05';
        document.getElementById('borderRadiusValue').textContent = '12';
        document.getElementById('hoverScaleValue').textContent = '1.05';

        this.updateCustomPreview();
    }

    hexToRgba(hex, alpha) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    openModal() {
        const modal = document.getElementById('themeModal');
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    closeModal() {
        const modal = document.getElementById('themeModal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    selectTheme(themeKey) {
        // Update active state
        document.querySelectorAll('.theme-option').forEach(option => {
            option.classList.remove('active');
        });
        document.querySelector(`[data-theme="${themeKey}"]`)?.classList.add('active');

        // Apply theme
        this.applyTheme(themeKey);
        
        // Save to localStorage
        localStorage.setItem('framesearch-theme', themeKey);
        this.currentTheme = themeKey;

        // Show feedback
        this.showThemeApplied();
    }

    applyTheme(themeKey) {
        let colors;
        
        if (themeKey === 'custom' && this.customColors) {
            colors = this.customColors;
        } else {
            const theme = this.themes[themeKey];
            if (!theme) return;
            colors = theme.colors;
        }

        const root = document.documentElement;
        Object.entries(colors).forEach(([property, value]) => {
            root.style.setProperty(property, value);
        });

        // Add smooth transition
        document.body.style.transition = 'background-color 0.5s ease, color 0.5s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 500);
    }

    async showThemeApplied(themeName = null) {
        if (!themeName) {
            themeName = this.themes[this.currentTheme]?.name || 'Пользовательская тема';
        }
        
        // Create temporary notification
        const notification = document.createElement('div');
        notification.className = 'theme-notification';
        notification.innerHTML = `
            <i data-lucide="check-circle"></i>
            <span>Тема "${themeName}" применена</span>
        `;
        document.body.appendChild(notification);
        
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        // Animate in
        setTimeout(() => notification.classList.add('show'), 10);

        // Remove after delay
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }
}

// Create global instance
const themeManager = new ThemeManager();
window.themeManager = themeManager;

// Apply theme immediately (before DOM load to prevent flash)
themeManager.applyTheme(themeManager.currentTheme);

// Initialize UI on load
document.addEventListener('DOMContentLoaded', () => {
    themeManager.init();
});


// Listen for language changes
window.addEventListener('languageChanged', () => {
    // Update theme modal if it exists
    const modal = document.getElementById('themeModal');
    if (modal) {
        const wasActive = modal.classList.contains('active');
        modal.remove();
        themeManager.createThemeModal();
        if (wasActive) {
            setTimeout(() => themeManager.openModal(), 100);
        }
    }
});
