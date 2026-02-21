/**
 * Framesearch - Custom Scrollbar Effects
 * 
 * Автор: SerGioPlay
 * GitHub: https://github.com/SerGioPlay01
 * Проект: https://github.com/SerGioPlay01/framesearch
 * Сайт: https://sergioplay-dev.vercel.app/
 * 
 * © 2026 Framesearch.  
 */

class ScrollbarEffects {
    constructor() {
        this.scrollTimeout = null;
        this.init();
    }

    init() {
        this.createScrollProgress();
        this.addScrollListeners();
        this.addScrollingClass();
    }

    // Create scroll progress indicator
    createScrollProgress() {
        window.addEventListener('scroll', () => {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            
            // Update progress bar
            if (document.body.style) {
                document.body.style.setProperty('--scroll-progress', scrolled + '%');
            }
            
            // Update body::after width via CSS variable
            document.documentElement.style.setProperty('--scroll-width', scrolled + '%');
        });
    }

    // Add scrolling class for glow effect
    addScrollingClass() {
        let scrollTimer = null;
        
        window.addEventListener('scroll', () => {
            document.body.classList.add('scrolling');
            
            clearTimeout(scrollTimer);
            scrollTimer = setTimeout(() => {
                document.body.classList.remove('scrolling');
            }, 1000);
        });
    }

    // Add scroll listeners for custom effects
    addScrollListeners() {
        // Smooth scroll behavior
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                if (href !== '#' && document.querySelector(href)) {
                    e.preventDefault();
                    document.querySelector(href).scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Add scroll snap for cards grid
        const cardsGrid = document.querySelector('.cards-grid');
        if (cardsGrid) {
            cardsGrid.style.scrollSnapType = 'y proximity';
            
            const cards = cardsGrid.querySelectorAll('.card');
            cards.forEach(card => {
                card.style.scrollSnapAlign = 'start';
            });
        }

        // Hide/show navbar on scroll
        let lastScroll = 0;
        const navbar = document.getElementById('navbar');
        
        if (navbar) {
            window.addEventListener('scroll', () => {
                const currentScroll = window.pageYOffset;
                
                if (currentScroll <= 0) {
                    navbar.classList.remove('scroll-up');
                    return;
                }
                
                if (currentScroll > lastScroll && currentScroll > 100) {
                    // Scroll down
                    navbar.classList.add('scroll-down');
                    navbar.classList.remove('scroll-up');
                } else if (currentScroll < lastScroll) {
                    // Scroll up
                    navbar.classList.remove('scroll-down');
                    navbar.classList.add('scroll-up');
                }
                
                lastScroll = currentScroll;
            });
        }

        // Scroll to top button
        this.createScrollToTopButton();
    }

    // Create scroll to top button
    createScrollToTopButton() {
        const button = document.createElement('button');
        button.className = 'scroll-to-top';
        button.innerHTML = '<i data-lucide="arrow-up"></i>';
        button.setAttribute('aria-label', 'Scroll to top');
        button.style.cssText = `
            position: fixed;
            top: 5rem;
            right: 2rem;
            width: 3rem;
            height: 3rem;
            border-radius: 50%;
            background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
            border: none;
            color: var(--bg-primary);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 10px 25px var(--shadow-color);
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            z-index: 99;
        `;

        document.body.appendChild(button);

        // Show/hide button on scroll
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                button.style.opacity = '1';
                button.style.visibility = 'visible';
            } else {
                button.style.opacity = '0';
                button.style.visibility = 'hidden';
            }
        });

        // Scroll to top on click
        button.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        // Hover effect
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'scale(1.1) rotate(360deg)';
            button.style.boxShadow = '0 15px 35px var(--shadow-color)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'scale(1) rotate(0deg)';
            button.style.boxShadow = '0 10px 25px var(--shadow-color)';
        });

        // Initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    // Add custom scrollbar to specific elements
    addCustomScrollbar(selector) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            element.style.scrollbarWidth = 'thin';
            element.style.scrollbarColor = 'var(--accent-primary) rgba(0, 0, 0, 0.2)';
        });
    }
}

// Initialize scrollbar effects
document.addEventListener('DOMContentLoaded', () => {
    const scrollbarEffects = new ScrollbarEffects();
    
    // Add custom scrollbar to specific elements
    scrollbarEffects.addCustomScrollbar('.modal-body');
    scrollbarEffects.addCustomScrollbar('.cards-grid');
    scrollbarEffects.addCustomScrollbar('.collections-grid');
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ScrollbarEffects;
}
