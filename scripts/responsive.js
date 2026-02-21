/**
 * Framesearch - Responsive Enhancements
 * 
 * Автор: SerGioPlay
 * GitHub: https://github.com/SerGioPlay01
 * Проект: https://github.com/SerGioPlay01/framesearch
 * Сайт: https://sergioplay-dev.vercel.app/
 * 
 * © 2026 Framesearch.  
 */

// Horizontal scroll for filter buttons on mobile
function initFilterButtonsScroll() {
    const filterButtons = document.querySelector('.filter-buttons');
    if (!filterButtons) return;

    // Check if horizontal scroll is needed
    function checkScrollNeeded() {
        const isScrollable = filterButtons.scrollWidth > filterButtons.clientWidth;
        
        if (isScrollable && window.innerWidth < 768) {
            filterButtons.style.overflowX = 'auto';
            filterButtons.style.flexWrap = 'nowrap';
            filterButtons.style.scrollbarWidth = 'thin';
            filterButtons.style.webkitOverflowScrolling = 'touch';
            
            // Add padding for better UX
            if (window.innerWidth < 640) {
                filterButtons.style.margin = '0 -0.75rem';
                filterButtons.style.paddingLeft = '0.75rem';
                filterButtons.style.paddingRight = '0.75rem';
            }
        } else {
            filterButtons.style.overflowX = '';
            filterButtons.style.flexWrap = 'wrap';
            filterButtons.style.margin = '';
            filterButtons.style.paddingLeft = '';
            filterButtons.style.paddingRight = '';
        }
    }

    // Smooth scroll to active button
    function scrollToActiveButton() {
        const activeBtn = filterButtons.querySelector('.filter-btn.active');
        if (activeBtn && window.innerWidth < 768) {
            setTimeout(() => {
                const buttonRect = activeBtn.getBoundingClientRect();
                const containerRect = filterButtons.getBoundingClientRect();
                const scrollLeft = activeBtn.offsetLeft - (containerRect.width / 2) + (buttonRect.width / 2);
                
                filterButtons.scrollTo({
                    left: scrollLeft,
                    behavior: 'smooth'
                });
            }, 100);
        }
    }

    // Initialize
    checkScrollNeeded();
    scrollToActiveButton();

    // Re-check on window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            checkScrollNeeded();
            scrollToActiveButton();
        }, 150);
    });

    // Scroll to active button when filter changes
    filterButtons.addEventListener('click', (e) => {
        if (e.target.classList.contains('filter-btn')) {
            setTimeout(scrollToActiveButton, 50);
        }
    });

    // Add touch scroll momentum for iOS
    let isScrolling = false;
    let startX;
    let scrollLeft;

    filterButtons.addEventListener('touchstart', (e) => {
        isScrolling = true;
        startX = e.touches[0].pageX - filterButtons.offsetLeft;
        scrollLeft = filterButtons.scrollLeft;
    }, { passive: true });

    filterButtons.addEventListener('touchmove', (e) => {
        if (!isScrolling) return;
        const x = e.touches[0].pageX - filterButtons.offsetLeft;
        const walk = (x - startX) * 2;
        filterButtons.scrollLeft = scrollLeft - walk;
    }, { passive: true });

    filterButtons.addEventListener('touchend', () => {
        isScrolling = false;
    });
}

// Optimize cards grid for different screen sizes
function optimizeCardsGrid() {
    const cardsGrid = document.querySelector('.cards-grid');
    if (!cardsGrid) return;

    function updateGridColumns() {
        const width = window.innerWidth;
        let columns;

        if (width < 375) {
            columns = 1;
        } else if (width < 640) {
            columns = 2;
        } else if (width < 768) {
            columns = 3;
        } else if (width < 1024) {
            columns = 3;
        } else if (width < 1280) {
            columns = 4;
        } else {
            columns = 5;
        }

        // Apply via CSS custom property for smooth transitions
        cardsGrid.style.setProperty('--grid-columns', columns);
    }

    updateGridColumns();

    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(updateGridColumns, 150);
    });
}

// Improve touch interactions for mobile
function enhanceTouchInteractions() {
    // Add active state for touch on buttons
    const buttons = document.querySelectorAll('.btn, .filter-btn, .action-btn, .card-action-btn');
    
    buttons.forEach(button => {
        button.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.95)';
        }, { passive: true });

        button.addEventListener('touchend', function() {
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        }, { passive: true });

        button.addEventListener('touchcancel', function() {
            this.style.transform = '';
        }, { passive: true });
    });
}

// Optimize modal for mobile
function optimizeModalForMobile() {
    const modal = document.querySelector('.modal');
    if (!modal) return;

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'class') {
                const isActive = modal.classList.contains('active');
                
                if (isActive && window.innerWidth < 768) {
                    // Prevent body scroll when modal is open on mobile
                    // But allow input focus
                    const scrollY = window.scrollY;
                    document.body.style.position = 'fixed';
                    document.body.style.top = `-${scrollY}px`;
                    document.body.style.width = '100%';
                    document.body.style.overflowY = 'scroll';
                } else {
                    // Restore scroll position
                    const scrollY = document.body.style.top;
                    document.body.style.position = '';
                    document.body.style.top = '';
                    document.body.style.width = '';
                    document.body.style.overflowY = '';
                    if (scrollY) {
                        window.scrollTo(0, parseInt(scrollY || '0') * -1);
                    }
                }
            }
        });
    });

    observer.observe(modal, { attributes: true });
}

// Improve navbar behavior on scroll for mobile
function enhanceNavbarScroll() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    let lastScrollTop = 0;
    let scrollTimeout;

    window.addEventListener('scroll', () => {
        if (window.innerWidth >= 768) return; // Only for mobile

        clearTimeout(scrollTimeout);
        
        scrollTimeout = setTimeout(() => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                // Scrolling down
                navbar.style.transform = 'translateY(-100%)';
            } else {
                // Scrolling up
                navbar.style.transform = 'translateY(0)';
            }
            
            lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        }, 100);
    }, { passive: true });
}

// Add pull-to-refresh indicator (visual only, no actual refresh)
function addPullToRefreshIndicator() {
    if (window.innerWidth >= 768) return;

    let startY = 0;
    let currentY = 0;
    let isPulling = false;

    const indicator = document.createElement('div');
    indicator.className = 'pull-to-refresh-indicator';
    indicator.innerHTML = '<i data-lucide="refresh-cw"></i>';
    indicator.style.cssText = `
        position: fixed;
        top: -60px;
        left: 50%;
        transform: translateX(-50%);
        width: 40px;
        height: 40px;
        background: var(--accent-primary);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--bg-primary);
        transition: all 0.3s ease;
        z-index: 9999;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    `;
    document.body.appendChild(indicator);

    // Initialize lucide icons for the indicator
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    document.addEventListener('touchstart', (e) => {
        if (window.pageYOffset === 0) {
            startY = e.touches[0].pageY;
            isPulling = true;
        }
    }, { passive: true });

    document.addEventListener('touchmove', (e) => {
        if (!isPulling) return;
        
        currentY = e.touches[0].pageY;
        const pullDistance = currentY - startY;

        if (pullDistance > 0 && pullDistance < 100) {
            indicator.style.top = `${-60 + pullDistance}px`;
            indicator.style.transform = `translateX(-50%) rotate(${pullDistance * 3.6}deg)`;
        }
    }, { passive: true });

    document.addEventListener('touchend', () => {
        isPulling = false;
        indicator.style.top = '-60px';
        indicator.style.transform = 'translateX(-50%) rotate(0deg)';
    }, { passive: true });
}

// Optimize images loading for mobile
function optimizeImagesForMobile() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    // Load image
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px'
        });

        // Observe all images with data-src
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// Add haptic feedback for supported devices
function addHapticFeedback() {
    if (!('vibrate' in navigator)) return;

    const interactiveElements = document.querySelectorAll('.btn, .filter-btn, .card, .action-card');
    
    interactiveElements.forEach(element => {
        element.addEventListener('click', () => {
            navigator.vibrate(10); // Short vibration
        });
    });
}

// Initialize all responsive enhancements
function initResponsiveEnhancements() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        initFilterButtonsScroll();
        optimizeCardsGrid();
        enhanceTouchInteractions();
        optimizeModalForMobile();
        enhanceNavbarScroll();
        addPullToRefreshIndicator();
        optimizeImagesForMobile();
        addHapticFeedback();
    }
}

// Auto-initialize
initResponsiveEnhancements();
