/**
 * Framesearch - Advanced Cookie Consent Manager
 * 
 * Автор: SerGioPlay
 * GitHub: https://github.com/SerGioPlay01
 * Проект: https://github.com/SerGioPlay01/framesearch
 * Сайт: https://sergioplay-dev.vercel.app/
 * 
 * © 2026 Framesearch.  
 */

class CookieConsentManager {
    constructor() {
        this.consentKey = 'framesearch-cookie-consent';
        this.preferencesKey = 'framesearch-cookie-preferences';
        this.consent = this.loadConsent();
        this.preferences = this.loadPreferences();
    }
    
    // Get translation helper
    t(key) {
        return window.i18n ? window.i18n.t(key) : key;
    }
    
    // Get script categories with translations
    getScriptCategories() {
        return {
            necessary: {
                name: this.t('cookie.category.necessary'),
                description: this.t('cookie.category.necessary.desc'),
                required: true,
                scripts: []
            },
            functional: {
                name: this.t('cookie.category.functional'),
                description: this.t('cookie.category.functional.desc'),
                required: false,
                scripts: []
            },
            analytics: {
                name: this.t('cookie.category.analytics'),
                description: this.t('cookie.category.analytics.desc'),
                required: false,
                scripts: []
            },
            external: {
                name: this.t('cookie.category.external'),
                description: this.t('cookie.category.external.desc'),
                required: false,
                scripts: []
            }
        };
    }

    loadConsent() {
        const stored = localStorage.getItem(this.consentKey);
        return stored ? JSON.parse(stored) : null;
    }

    loadPreferences() {
        const stored = localStorage.getItem(this.preferencesKey);
        return stored ? JSON.parse(stored) : {
            necessary: true,
            functional: true,
            analytics: false,
            external: true
        };
    }

    saveConsent(consent) {
        this.consent = consent;
        localStorage.setItem(this.consentKey, JSON.stringify(consent));
    }

    savePreferences(preferences) {
        this.preferences = preferences;
        localStorage.setItem(this.preferencesKey, JSON.stringify(preferences));
    }

    needsConsent() {
        return !this.consent;
    }

    init() {
        if (this.needsConsent()) {
            this.showBanner();
        } else {
            this.applyPreferences();
        }
        
        // Add settings button to footer
        this.addSettingsButton();
    }

    showBanner() {
        const bannerHTML = `
            <div id="cookieConsentBanner" class="cookie-banner glass-card">
                <div class="cookie-banner-content">
                    <div class="cookie-banner-icon">
                        <i data-lucide="cookie"></i>
                    </div>
                    <div class="cookie-banner-text">
                        <h3>${this.t('cookie.title')}</h3>
                        <p>${this.t('cookie.message')}</p>
                    </div>
                </div>
                <div class="cookie-banner-actions">
                    <button class="btn btn-secondary" onclick="cookieConsent.showSettings()">
                        <i data-lucide="settings"></i>
                        ${this.t('cookie.settings')}
                    </button>
                    <button class="btn btn-primary" onclick="cookieConsent.acceptAll()">
                        <i data-lucide="check"></i>
                        ${this.t('cookie.accept')}
                    </button>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', bannerHTML);
        
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        
        // Animate in
        setTimeout(() => {
            document.getElementById('cookieConsentBanner')?.classList.add('show');
        }, 100);
    }

    hideBanner() {
        const banner = document.getElementById('cookieConsentBanner');
        if (banner) {
            banner.classList.remove('show');
            setTimeout(() => banner.remove(), 300);
        }
    }

    showSettings() {
        this.hideBanner();
        
        const settingsHTML = `
            <div id="cookieSettingsModal" class="modal active">
                <div class="modal-overlay"></div>
                <div class="modal-content cookie-settings-modal">
                    <div class="modal-header">
                        <h2>
                            <i data-lucide="shield-check"></i>
                            ${this.t('cookie.settings.title')}
                        </h2>
                        <button class="modal-close" onclick="cookieConsent.closeSettings()">
                            <i data-lucide="x"></i>
                        </button>
                    </div>

                    <div class="modal-body">
                        <div class="cookie-settings-intro">
                            <p>${this.t('cookie.settings.intro')}</p>
                        </div>

                        <div class="cookie-categories">
                            ${this.renderCategories()}
                        </div>

                        <div class="cookie-settings-info">
                            <div class="info-card">
                                <i data-lucide="info"></i>
                                <div>
                                    <strong>${this.t('cookie.info.local.title')}</strong>
                                    <p>${this.t('cookie.info.local.desc')}</p>
                                </div>
                            </div>
                            <div class="info-card">
                                <i data-lucide="lock"></i>
                                <div>
                                    <strong>${this.t('cookie.info.tracking.title')}</strong>
                                    <p>${this.t('cookie.info.tracking.desc')}</p>
                                </div>
                            </div>
                            <div class="info-card">
                                <i data-lucide="shield"></i>
                                <div>
                                    <strong>${this.t('cookie.info.control.title')}</strong>
                                    <p>${this.t('cookie.info.control.desc')}</p>
                                </div>
                            </div>
                        </div>

                        <div class="cookie-actions-advanced">
                            <button class="btn btn-danger" onclick="cookieConsent.clearAllData()">
                                <i data-lucide="trash-2"></i>
                                ${this.t('cookie.action.clear')}
                            </button>
                            <button class="btn btn-secondary" onclick="cookieConsent.exportData()">
                                <i data-lucide="download"></i>
                                ${this.t('cookie.action.export')}
                            </button>
                        </div>
                    </div>

                    <div class="modal-footer">
                        <button class="btn btn-secondary" onclick="cookieConsent.rejectAll()">
                            ${this.t('cookie.decline')}
                        </button>
                        <button class="btn btn-primary" onclick="cookieConsent.saveSettings()">
                            <i data-lucide="check"></i>
                            ${this.t('cookie.save')}
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', settingsHTML);
        document.body.style.overflow = 'hidden';
        
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    renderCategories() {
        const categories = this.getScriptCategories();
        return Object.entries(categories).map(([key, category]) => `
            <div class="cookie-category ${category.required ? 'required' : ''}">
                <div class="cookie-category-header">
                    <div class="cookie-category-info">
                        <h4>${category.name}</h4>
                        <p>${category.description}</p>
                    </div>
                    <label class="cookie-toggle">
                        <input 
                            type="checkbox" 
                            id="cookie-${key}" 
                            ${this.preferences[key] ? 'checked' : ''} 
                            ${category.required ? 'disabled' : ''}
                            onchange="cookieConsent.updatePreference('${key}', this.checked)"
                        >
                        <span class="toggle-slider"></span>
                    </label>
                </div>
                ${category.required ? `<span class="required-badge">${this.t('cookie.required')}</span>` : ''}
            </div>
        `).join('');
    }

    updatePreference(category, value) {
        this.preferences[category] = value;
    }

    closeSettings() {
        const modal = document.getElementById('cookieSettingsModal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
            setTimeout(() => modal.remove(), 300);
        }
        
        // Show banner again if no consent yet
        if (!this.consent) {
            setTimeout(() => this.showBanner(), 400);
        }
    }

    acceptAll() {
        this.preferences = {
            necessary: true,
            functional: true,
            analytics: true,
            external: true
        };
        this.savePreferences(this.preferences);
        this.saveConsent({ accepted: true, date: new Date().toISOString() });
        this.hideBanner();
        this.applyPreferences();
        this.showNotification(this.t('cookie.notif.saved'), 'success');
    }

    rejectAll() {
        this.preferences = {
            necessary: true,
            functional: false,
            analytics: false,
            external: false
        };
        this.savePreferences(this.preferences);
        this.saveConsent({ accepted: false, date: new Date().toISOString() });
        this.closeSettings();
        this.applyPreferences();
        this.showNotification(this.t('cookie.notif.minimal'), 'info');
    }

    saveSettings() {
        this.savePreferences(this.preferences);
        this.saveConsent({ accepted: true, date: new Date().toISOString(), custom: true });
        this.closeSettings();
        this.applyPreferences();
        this.showNotification(this.t('cookie.notif.saved'), 'success');
    }

    applyPreferences() {
        // Apply functional preferences
        if (!this.preferences.functional) {
            // Disable theme switching
            localStorage.removeItem('framesearch-theme');
        }
        
        // Block external scripts if not allowed
        if (!this.preferences.external) {
            this.blockExternalScripts();
        }
        
        console.log('Cookie preferences applied:', this.preferences);
    }

    blockExternalScripts() {
        // Block iframe loading from external sources
        const iframes = document.querySelectorAll('iframe');
        iframes.forEach(iframe => {
            if (!iframe.dataset.consentBlocked) {
                iframe.dataset.consentBlocked = 'true';
                iframe.style.display = 'none';
                
                const placeholder = document.createElement('div');
                placeholder.className = 'iframe-blocked-placeholder';
                placeholder.innerHTML = `
                    <i data-lucide="shield-off"></i>
                    <p>${this.t('cookie.blocked')}</p>
                    <button class="btn btn-secondary btn-sm" onclick="cookieConsent.showSettings()">
                        ${this.t('cookie.blocked.action')}
                    </button>
                `;
                iframe.parentNode.insertBefore(placeholder, iframe);
            }
        });
    }

    async clearAllData() {
        const confirmed = await dialog.confirm(
            this.t('cookie.confirm.clear'),
            this.t('cookie.confirm.title')
        );
        
        if (confirmed) {
            try {
                // Clear IndexedDB
                await db.clearAll();
                
                // Clear localStorage
                localStorage.clear();
                
                // Clear sessionStorage
                sessionStorage.clear();
                
                this.showNotification(this.t('cookie.notif.cleared'), 'success');
                
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } catch (error) {
                console.error('Failed to clear data:', error);
                await dialog.alert(this.t('msg.error') + ': ' + error.message, this.t('msg.error'));
            }
        }
    }

    async exportData() {
        try {
            const data = await db.exportData();
            const blob = new Blob([data], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `framesearch-backup-${Date.now()}.framesearch`;
            a.click();
            URL.revokeObjectURL(url);
            
            this.showNotification(this.t('cookie.notif.exported'), 'success');
        } catch (error) {
            console.error('Export failed:', error);
            await dialog.alert(this.t('msg.error') + ': ' + error.message, this.t('msg.error'));
        }
    }

    addSettingsButton() {
        // Add floating settings button
        const buttonHTML = `
            <button id="cookieSettingsBtn" class="cookie-settings-btn" title="${this.t('cookie.settings.title')}" onclick="cookieConsent.showSettings()">
                <i data-lucide="shield-check"></i>
            </button>
        `;
        
        document.body.insertAdjacentHTML('beforeend', buttonHTML);
        
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `cookie-notification ${type}`;
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
}

// Create global instance
const cookieConsent = new CookieConsentManager();
window.cookieConsent = cookieConsent;

// Initialize on load - wait for i18n to be ready
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for i18n to initialize
    setTimeout(() => {
        cookieConsent.init();
    }, 100);
});


// Listen for language changes
window.addEventListener('languageChanged', () => {
    // Reload banner if visible
    const banner = document.getElementById('cookieConsentBanner');
    if (banner) {
        const wasVisible = banner.classList.contains('show');
        cookieConsent.hideBanner();
        if (wasVisible) {
            setTimeout(() => cookieConsent.showBanner(), 100);
        }
    }
    
    // Reload settings modal if open
    const modal = document.getElementById('cookieSettingsModal');
    if (modal) {
        const wasActive = modal.classList.contains('active');
        cookieConsent.closeSettings();
        if (wasActive) {
            setTimeout(() => cookieConsent.showSettings(), 100);
        }
    }
    
    // Update settings button title (it should always be present)
    const settingsBtn = document.getElementById('cookieSettingsBtn');
    if (settingsBtn) {
        settingsBtn.title = cookieConsent.t('cookie.settings.title');
    }
});
