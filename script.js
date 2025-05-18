// Security: Prevent prototype pollution
Object.freeze(Object.prototype);

// Security: Sanitize user input
function sanitizeHTML(str) {
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
}

// Security: Validate URLs
function isValidURL(str) {
    try {
        new URL(str);
        return true;
    } catch {
        return false;
    }
}

// Security: Debounce scroll event
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

// Accessibility: Handle keyboard navigation
function handleKeyboardNavigation(event) {
    if (event.key === 'Escape') {
        const menuToggle = document.querySelector('.menu-toggle');
        const navMenu = document.querySelector('.nav-menu');
        if (navMenu?.classList.contains('active')) {
            menuToggle?.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('no-scroll');
            menuToggle?.setAttribute('aria-expanded', 'false');
        }
    }
}

// Initialize all functionality
document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');
    const mobileStickyCta = document.querySelector('.mobile-sticky-cta');
    const featuresSection = document.querySelector('#features-section');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Menu functionality
    menuToggle?.addEventListener('click', () => {
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.classList.toggle('active');
        navMenu?.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
        menuToggle.setAttribute('aria-expanded', !isExpanded);
    });

    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle?.classList.remove('active');
            navMenu?.classList.remove('active');
            document.body.classList.remove('no-scroll');
            menuToggle?.setAttribute('aria-expanded', 'false');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navMenu?.classList.contains('active') && 
            !navMenu.contains(e.target) && 
            !menuToggle?.contains(e.target)) {
            menuToggle?.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('no-scroll');
            menuToggle?.setAttribute('aria-expanded', 'false');
        }
    });

    // Add keyboard navigation support
    document.addEventListener('keydown', handleKeyboardNavigation);

    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            if (!href) return;
            
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                target.setAttribute('tabindex', '-1');
                target.focus();
            }
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', debounce(function() {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            navbar.classList.toggle('scrolled', window.scrollY > 10);
        }
    }, prefersReducedMotion ? 0 : 10));

    // Intersection Observer setup
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                obs.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all cards and sections
    document.querySelectorAll('.feature-card, .tradie-feature, .features-container > h2, .contact-container').forEach(element => {
        observer.observe(element);
    });

    // Mobile Sticky CTA Visibility Control
    if (mobileStickyCta && featuresSection) {
        const featuresObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (window.innerWidth <= 768) {
                    mobileStickyCta.classList.toggle('visible', entry.isIntersecting);
                } else {
                    mobileStickyCta.classList.remove('visible');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '-10% 0px'
        });

        featuresObserver.observe(featuresSection);

        // Update on window resize
        window.addEventListener('resize', debounce(() => {
            if (window.innerWidth > 768) {
                mobileStickyCta.classList.remove('visible');
            }
        }, 100));
    }
}); 