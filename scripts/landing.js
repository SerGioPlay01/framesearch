/**
 * Framesearch Landing Page Scripts
 */

// Navbar scroll effect
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// Mobile menu toggle
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const mobileMenuBackdrop = document.getElementById('mobileMenuBackdrop');
const mobileMenuClose = document.getElementById('mobileMenuClose');

if (mobileMenuBtn && mobileMenu && mobileMenuBackdrop && mobileMenuClose) {
    let isMenuOpen = false;
    
    // Toggle menu
    const toggleMenu = (show) => {
        isMenuOpen = show;
        
        if (show) {
            mobileMenu.classList.add('active');
            mobileMenuBackdrop.classList.add('active');
            mobileMenuBtn.classList.add('active');
            document.body.style.overflow = 'hidden';
        } else {
            mobileMenu.classList.remove('active');
            mobileMenuBackdrop.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
            document.body.style.overflow = '';
        }
    };
    
    // Open menu on button click
    mobileMenuBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleMenu(!isMenuOpen);
    });
    
    // Close menu on close button click
    mobileMenuClose.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleMenu(false);
    });
    
    // Close menu when clicking on a link
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            toggleMenu(false);
        });
    });
    
    // Close menu when clicking backdrop
    mobileMenuBackdrop.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleMenu(false);
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isMenuOpen) {
            toggleMenu(false);
        }
        
        // Ctrl+K - Focus search (prevent browser's default)
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            const isInputFocused = document.activeElement.tagName === 'INPUT' || 
                                  document.activeElement.tagName === 'TEXTAREA' ||
                                  document.activeElement.isContentEditable;
            if (!isInputFocused) {
                e.preventDefault();
                e.stopPropagation();
                const searchInput = document.querySelector('.search-input');
                if (searchInput) {
                    searchInput.focus();
                    searchInput.select();
                }
            }
        }
    });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all feature cards, steps, and theme cards
document.querySelectorAll('.feature-card, .step, .theme-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Parallax effect for gradient orbs (disabled on mobile)
if (window.innerWidth > 768) {
    window.addEventListener('mousemove', (e) => {
        const orbs = document.querySelectorAll('.gradient-orb');
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        orbs.forEach((orb, index) => {
            const speed = (index + 1) * 20;
            const x = (mouseX - 0.5) * speed;
            const y = (mouseY - 0.5) * speed;
            
            orb.style.transform = `translate(${x}px, ${y}px)`;
        });
    });
}

// Add hover effect to buttons
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
    });
    
    btn.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// Animate stats on scroll
const animateStats = () => {
    const stats = document.querySelectorAll('.stat-value');
    
    stats.forEach(stat => {
        const text = stat.textContent;
        
        // Skip if not a number
        if (text === '∞' || text === '100%' || text === '0') {
            return;
        }
        
        const target = parseInt(text);
        let current = 0;
        const increment = target / 50;
        const duration = 1000;
        const stepTime = duration / 50;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                stat.textContent = target;
                clearInterval(timer);
            } else {
                stat.textContent = Math.floor(current);
            }
        }, stepTime);
    });
};

// Trigger stats animation when hero is visible
const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateStats();
            heroObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
    heroObserver.observe(heroStats);
}

// Add ripple effect to buttons
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add ripple styles dynamically
const style = document.createElement('style');
style.textContent = `
    .btn {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Lazy load images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                imageObserver.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Add active state to nav links based on scroll position
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-links a[href="#${sectionId}"]`);
        
        if (navLink && scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-links a').forEach(link => {
                link.classList.remove('active');
            });
            navLink.classList.add('active');
        }
    });
});

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debounce to scroll handlers
const debouncedScroll = debounce(() => {
    // Your scroll logic here
}, 10);

window.addEventListener('scroll', debouncedScroll);

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Add loaded class styles
const loadedStyle = document.createElement('style');
loadedStyle.textContent = `
    body {
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    body.loaded {
        opacity: 1;
    }
`;
document.head.appendChild(loadedStyle);

console.log('%c🎬 Framesearch Landing', 'font-size: 20px; font-weight: bold; color: #6366f1;');
console.log('%cПерсональное видеохранилище нового поколения', 'font-size: 14px; color: #8b5cf6;');
console.log('%c© 2026 SerGioPlay', 'font-size: 12px; color: #94a3b8;');
