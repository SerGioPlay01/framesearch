/**
 * Framesearch - URL Cleaner
 * Removes .html extensions from browser address bar
 * 
 * Автор: SerGioPlay
 * GitHub: https://github.com/SerGioPlay01
 * Проект: https://github.com/SerGioPlay01/framesearch
 * Сайт: https://sergioplay-dev.vercel.app/
 * 
 * © 2026 Framesearch.  
 */

(function() {
    'use strict';
    
    // Pages that should keep .html extension
    const excludedPages = [
        'terms',
        'privacy',
        'cookies',
        'disclaimer',
        'license',
        'landing'
    ];
    
    // Remove .html from current URL if present
    function cleanCurrentUrl() {
        const currentPath = window.location.pathname;
        
        // Check if URL ends with .html
        if (currentPath.endsWith('.html')) {
            // Get page name without extension
            const pageName = currentPath.split('/').pop().replace('.html', '');
            
            // Skip cleaning for excluded pages
            if (excludedPages.includes(pageName)) {
                return;
            }
            
            const cleanPath = currentPath.replace(/\.html$/, '');
            const newUrl = window.location.origin + cleanPath + window.location.search + window.location.hash;
            
            // Replace current URL without reloading
            window.history.replaceState(null, '', newUrl);
        }
    }
    
    // Clean URL on page load
    cleanCurrentUrl();
    
})();
