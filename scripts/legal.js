/**
 * Framesearch - Legal Pages Script
 * 
 * Автор: PsyGioX
 * GitHub: https://github.com/PsyGioX
 * Проект: https://github.com/PsyGioX/framesearch
 * Сайт: https://PsyGioX-dev.vercel.app/
 */

class LegalPageManager {
    constructor() {
        this.currentLang = localStorage.getItem('language') || 'ru';
        this.init();
    }

    init() {
        // Set initial language
        this.switchLanguage(this.currentLang);
        
        // Add event listeners to tabs
        document.querySelectorAll('.language-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const lang = e.currentTarget.dataset.lang;
                this.switchLanguage(lang);
            });
        });
    }

    switchLanguage(lang) {
        this.currentLang = lang;
        localStorage.setItem('language', lang);
        
        // Update tabs
        document.querySelectorAll('.language-tab').forEach(tab => {
            if (tab.dataset.lang === lang) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });
        
        // Update content
        document.querySelectorAll('.language-content').forEach(content => {
            if (content.dataset.lang === lang) {
                content.classList.add('active');
            } else {
                content.classList.remove('active');
            }
        });
        
        // Update HTML lang attribute
        document.documentElement.lang = lang;
    }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    new LegalPageManager();
    
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});
