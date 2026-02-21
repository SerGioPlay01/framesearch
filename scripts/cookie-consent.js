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
        this.historyKey = 'framesearch-consent-history';
        this.consent = this.loadConsent();
        this.preferences = this.loadPreferences();
        this.scriptRegistry = new Map();
        this.blockedScripts = new Set();
        this.scriptObserver = null;
        this.scanInterval = null;
        this.detectedScripts = {
            necessary: new Set(),
            functional: new Set(),
            analytics: new Set(),
            external: new Set()
        };
    }
    
    // Get translation helper
    t(key) {
        return window.i18n ? window.i18n.t(key) : key;
    }
    
    // Get script categories with translations and auto-detection
    getScriptCategories() {
        // Auto-detect scripts on page
        this.autoDetectScripts();
        
        return {
            necessary: {
                name: this.t('cookie.category.necessary'),
                description: this.t('cookie.category.necessary.desc'),
                required: true,
                scripts: Array.from(this.detectedScripts.necessary),
                count: this.detectedScripts.necessary.size
            },
            functional: {
                name: this.t('cookie.category.functional'),
                description: this.t('cookie.category.functional.desc'),
                required: false,
                scripts: Array.from(this.detectedScripts.functional),
                count: this.detectedScripts.functional.size
            },
            analytics: {
                name: this.t('cookie.category.analytics'),
                description: this.t('cookie.category.analytics.desc'),
                required: false,
                scripts: Array.from(this.detectedScripts.analytics),
                count: this.detectedScripts.analytics.size
            },
            external: {
                name: this.t('cookie.category.external'),
                description: this.t('cookie.category.external.desc'),
                required: false,
                scripts: Array.from(this.detectedScripts.external),
                count: this.detectedScripts.external.size
            }
        };
    }

    // AUTO-DETECT SCRIPTS ON PAGE
    autoDetectScripts() {
        // Clear previous detections
        Object.keys(this.detectedScripts).forEach(key => this.detectedScripts[key].clear());
        
        // Detect necessary scripts
        if ('indexedDB' in window) this.detectedScripts.necessary.add('IndexedDB');
        if ('localStorage' in window) this.detectedScripts.necessary.add('localStorage');
        if ('serviceWorker' in navigator) this.detectedScripts.necessary.add('Service Worker');
        
        // Detect all scripts
        document.querySelectorAll('script[src]').forEach(script => {
            const src = script.src.toLowerCase();
            const filename = script.src.split('/').pop();
            
            // Functional
            if (src.includes('theme') || src.includes('i18n') || src.includes('view-mode') || 
                src.includes('responsive') || src.includes('modal')) {
                this.detectedScripts.functional.add(filename);
            }
            
            // Analytics
            if (src.includes('metrika') || src.includes('analytics') || src.includes('gtag')) {
                this.detectedScripts.analytics.add(filename);
            }
        });
        
        // Detect analytics globals
        if (typeof ym !== 'undefined') this.detectedScripts.analytics.add('Yandex.Metrica');
        if (typeof gtag !== 'undefined') this.detectedScripts.analytics.add('Google Analytics');
        
        // Detect external iframes
        document.querySelectorAll('iframe[src]').forEach(iframe => {
            const src = iframe.src.toLowerCase();
            if (src.includes('kodik')) this.detectedScripts.external.add('Kodik Player');
            if (src.includes('collaps')) this.detectedScripts.external.add('Collaps Player');
            if (src.includes('alloha')) this.detectedScripts.external.add('Alloha Player');
            if (src.includes('hdrezka')) this.detectedScripts.external.add('HDRezka Player');
            if (src.includes('vibix')) this.detectedScripts.external.add('Vibix Player');
            if (!src.includes('kodik') && !src.includes('collaps') && !src.includes('alloha') && 
                !src.includes('hdrezka') && !src.includes('vibix')) {
                this.detectedScripts.external.add('External iframe');
            }
        });
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
        
        // Start monitoring
        this.startScriptMonitoring();
        this.startPeriodicScan();
        
        // Add settings button to footer
        this.addSettingsButton();
    }

    // REAL-TIME SCRIPT MONITORING
    startScriptMonitoring() {
        this.scriptObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.tagName === 'SCRIPT' || node.tagName === 'IFRAME') {
                        this.handleNewElement(node);
                    }
                });
            });
        });

        this.scriptObserver.observe(document.documentElement, {
            childList: true,
            subtree: true
        });

        logger.info('Script monitoring active');
    }

    handleNewElement(element) {
        const category = this.categorizeElement(element);
        
        if (!this.preferences[category] && category !== 'necessary') {
            this.blockElement(element);
            logger.warn(`Blocked ${element.tagName}: ${element.src || 'inline'} (${category})`);
        }
    }

    categorizeElement(element) {
        const src = (element.src || '').toLowerCase();
        
        if (src.includes('metrika') || src.includes('analytics')) return 'analytics';
        if (src.includes('theme') || src.includes('i18n')) return 'functional';
        if (src.includes('kodik') || src.includes('collaps') || src.includes('alloha') || 
            src.includes('hdrezka') || src.includes('vibix') || element.tagName === 'IFRAME') {
            return 'external';
        }
        
        return 'necessary';
    }

    blockElement(element) {
        if (element.tagName === 'SCRIPT') {
            element.type = 'text/plain';
            element.setAttribute('data-blocked-by-consent', 'true');
        } else if (element.tagName === 'IFRAME') {
            element.style.display = 'none';
            element.setAttribute('data-blocked-by-consent', 'true');
            this.addBlockedPlaceholder(element);
        }
        
        this.blockedScripts.add(element);
    }

    addBlockedPlaceholder(iframe) {
        const placeholder = document.createElement('div');
        placeholder.className = 'iframe-blocked-placeholder glass-card';
        placeholder.style.cssText = 'padding: 2rem; text-align: center; margin: 1rem 0;';
        placeholder.innerHTML = `
            <i data-lucide="shield-off" style="width: 48px; height: 48px; margin: 0 auto 1rem; color: #ef4444;"></i>
            <h3 style="color: white; margin-bottom: 0.5rem;">${this.t('cookie.blocked')}</h3>
            <p style="color: #9ca3af; margin-bottom: 1rem;">${this.t('cookie.blocked.desc')}</p>
            <button class="btn btn-primary" onclick="cookieConsent.showSettings()">
                <i data-lucide="settings"></i>
                ${this.t('cookie.blocked.action')}
            </button>
        `;
        iframe.parentNode.insertBefore(placeholder, iframe);
        
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    // PERIODIC SCANNING
    startPeriodicScan() {
        this.scanInterval = setInterval(() => {
            this.scanForUnauthorizedCookies();
            this.autoDetectScripts(); // Refresh script detection
        }, 10000); // Scan every 10 seconds
        
        logger.info('Periodic scanning active');
    }

    scanForUnauthorizedCookies() {
        const cookies = document.cookie.split(';');
        let removed = 0;
        
        cookies.forEach(cookie => {
            const name = cookie.trim().split('=')[0];
            const category = this.categorizeCookie(name);
            
            if (!this.preferences[category] && category !== 'necessary') {
                this.removeCookie(name);
                removed++;
            }
        });
        
        if (removed > 0) {
            logger.warn(`Removed ${removed} unauthorized cookies`);
        }
    }

    categorizeCookie(name) {
        const lowerName = name.toLowerCase();
        
        if (lowerName.includes('_ym') || lowerName.includes('metrika')) return 'analytics';
        if (lowerName.includes('_ga') || lowerName.includes('gtag')) return 'analytics';
        if (lowerName.includes('theme') || lowerName.includes('lang') || lowerName.includes('view')) return 'functional';
        if (lowerName.includes('consent') || lowerName.includes('framesearch')) return 'necessary';
        
        return 'external';
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
                        <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                            <h4>${category.name}</h4>
                            <span class="cookie-count-badge">${category.count} ${category.count === 1 ? 'script' : 'scripts'}</span>
                        </div>
                        <p>${category.description}</p>
                        ${category.scripts.length > 0 ? `
                            <details class="cookie-scripts-details">
                                <summary><strong>${this.t('cookie.scripts')}:</strong> ${this.t('cookie.scripts.show')}</summary>
                                <ul class="cookie-scripts-list">
                                    ${category.scripts.map(script => `<li><code>${script}</code></li>`).join('')}
                                </ul>
                            </details>
                        ` : `<p style="color: #6b7280; font-size: 0.875rem; margin-top: 0.5rem;">${this.t('cookie.scripts.none')}</p>`}
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
        
        // Apply analytics preferences
        if (this.preferences.analytics) {
            this.enableYandexMetrica();
        } else {
            this.disableYandexMetrica();
        }
        
        // Block external scripts if not allowed
        if (!this.preferences.external) {
            this.blockExternalScripts();
        }
    }

    enableYandexMetrica() {
        // Yandex.Metrica is already loaded in HTML
        // Just enable tracking if it was disabled
        if (typeof ym !== 'undefined') {
            try {
                ym(106947056, 'setUserID', null);
                logger.analytics('Yandex.Metrica enabled');
            } catch (e) {
                logger.error('Failed to enable Yandex.Metrica', e);
            }
        }
    }

    disableYandexMetrica() {
        // Disable Yandex.Metrica tracking
        if (typeof ym !== 'undefined') {
            try {
                ym(106947056, 'notBounce');
                logger.analytics('Yandex.Metrica disabled');
            } catch (e) {
                logger.error('Failed to disable Yandex.Metrica', e);
            }
        }
        
        // Remove Yandex.Metrica cookies
        this.removeCookie('_ym_uid');
        this.removeCookie('_ym_d');
        this.removeCookie('_ym_isad');
        this.removeCookie('_ym_visorc');
    }

    removeCookie(name) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname};`;
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
                logger.error('Failed to clear data', error);
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
            logger.error('Export failed', error);
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
