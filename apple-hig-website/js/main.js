// Apple HIG Tutorial - Main JavaScript

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Navigation active state on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    const scrollPosition = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Mobile navigation toggle
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });
}

// Component tabs functionality
const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const targetTab = button.getAttribute('data-tab');
        
        // Remove active class from all buttons and contents
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        // Add active class to clicked button
        button.classList.add('active');
        
        // Show corresponding content
        const targetContent = document.getElementById(`${targetTab}-content`);
        if (targetContent) {
            targetContent.classList.add('active');
        }
    });
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all sections and cards
document.querySelectorAll('.section, .principle-card, .tutorial-card, .challenge-card').forEach(el => {
    observer.observe(el);
});

// Dark mode toggle (respects system preference)
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

function updateTheme(e) {
    if (e.matches) {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
    }
}

prefersDarkScheme.addListener(updateTheme);
updateTheme(prefersDarkScheme);

// Button ripple effect
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

// Navbar background on scroll
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Copy code functionality
document.querySelectorAll('.component-code').forEach(codeBlock => {
    const copyButton = document.createElement('button');
    copyButton.textContent = 'Copy';
    copyButton.className = 'copy-button';
    copyButton.style.cssText = `
        position: absolute;
        top: 10px;
        right: 10px;
        padding: 5px 10px;
        background: var(--color-primary);
        color: white;
        border: none;
        border-radius: var(--radius-sm);
        font-size: var(--font-size-sm);
        cursor: pointer;
        opacity: 0;
        transition: opacity var(--transition-fast);
    `;
    
    codeBlock.style.position = 'relative';
    codeBlock.appendChild(copyButton);
    
    codeBlock.addEventListener('mouseenter', () => {
        copyButton.style.opacity = '1';
    });
    
    codeBlock.addEventListener('mouseleave', () => {
        copyButton.style.opacity = '0';
    });
    
    copyButton.addEventListener('click', async () => {
        const code = codeBlock.querySelector('code').textContent;
        try {
            await navigator.clipboard.writeText(code);
            copyButton.textContent = 'Copied!';
            setTimeout(() => {
                copyButton.textContent = 'Copy';
            }, 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    });
});

// Lazy loading for images
const lazyImages = document.querySelectorAll('img[data-src]');
const imageOptions = {
    threshold: 0,
    rootMargin: '0px 0px 300px 0px'
};

const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.add('loaded');
            imageObserver.unobserve(img);
        }
    });
}, imageOptions);

lazyImages.forEach(img => imageObserver.observe(img));

// Performance monitoring
if ('PerformanceObserver' in window) {
    const perfObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
            console.log(`${entry.name}: ${entry.duration}ms`);
        }
    });
    
    perfObserver.observe({ entryTypes: ['measure'] });
}

// Initialize tooltips
function initTooltips() {
    const tooltips = document.querySelectorAll('[data-tooltip]');
    
    tooltips.forEach(element => {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = element.getAttribute('data-tooltip');
        tooltip.style.cssText = `
            position: absolute;
            background: var(--color-gray-900);
            color: white;
            padding: 5px 10px;
            border-radius: var(--radius-sm);
            font-size: var(--font-size-sm);
            white-space: nowrap;
            opacity: 0;
            pointer-events: none;
            transition: opacity var(--transition-fast);
            z-index: var(--z-tooltip);
        `;
        
        element.addEventListener('mouseenter', (e) => {
            document.body.appendChild(tooltip);
            const rect = element.getBoundingClientRect();
            tooltip.style.left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + 'px';
            tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
            tooltip.style.opacity = '1';
        });
        
        element.addEventListener('mouseleave', () => {
            tooltip.style.opacity = '0';
            setTimeout(() => {
                if (tooltip.parentNode) {
                    tooltip.parentNode.removeChild(tooltip);
                }
            }, 200);
        });
    });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initTooltips();
    
    // Add ripple CSS
    const style = document.createElement('style');
    style.textContent = `
        .btn {
            position: relative;
            overflow: hidden;
        }
        
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.5);
            transform: scale(0);
            animation: ripple-animation 600ms ease-out;
        }
        
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        .navbar.scrolled {
            background: rgba(255, 255, 255, 0.95);
            box-shadow: var(--shadow-sm);
        }
        
        @media (prefers-color-scheme: dark) {
            .navbar.scrolled {
                background: rgba(0, 0, 0, 0.95);
            }
        }
        
        .nav-menu.active {
            display: flex;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: var(--color-background);
            flex-direction: column;
            padding: var(--spacing-xl);
            box-shadow: var(--shadow-lg);
        }
        
        .nav-toggle.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }
        
        .nav-toggle.active span:nth-child(2) {
            opacity: 0;
        }
        
        .nav-toggle.active span:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -6px);
        }
        
        .tab-content {
            display: none;
        }
        
        .tab-content.active {
            display: block;
        }
    `;
    document.head.appendChild(style);
});

// Export functions for use in other scripts
window.AppleHIG = {
    showNotification: function(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            padding: 15px 20px;
            background: var(--color-${type === 'success' ? 'success' : type === 'error' ? 'danger' : 'primary'});
            color: white;
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-lg);
            z-index: var(--z-popover);
            animation: slideIn 300ms ease-out;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 300ms ease-out';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    },
    
    initCodeEditor: function(element, options = {}) {
        // Simple code editor functionality for tutorials
        element.contentEditable = true;
        element.spellcheck = false;
        element.style.cssText = `
            font-family: 'SF Mono', Monaco, monospace;
            font-size: var(--font-size-sm);
            line-height: 1.5;
            padding: var(--spacing-lg);
            background: var(--color-gray-900);
            color: var(--color-gray-100);
            border-radius: var(--radius-lg);
            white-space: pre;
            overflow: auto;
        `;
        
        // Basic syntax highlighting
        element.addEventListener('input', () => {
            if (options.onUpdate) {
                options.onUpdate(element.textContent);
            }
        });
    }
};

// Add slide animations
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(animationStyles);

console.log('Apple HIG Tutorial initialized successfully!');