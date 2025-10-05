// Tutorial-specific JavaScript

// Table of Contents Navigation
const tocLinks = document.querySelectorAll('.toc-link');
const sections = document.querySelectorAll('.tutorial-section');

// Update active TOC link on scroll
function updateActiveLink() {
    const scrollPosition = window.scrollY + 150;
    
    sections.forEach((section, index) => {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            tocLinks.forEach(link => link.classList.remove('active'));
            tocLinks[index].classList.add('active');
            updateProgress(index + 1);
        }
    });
}

// Update progress bar
function updateProgress(currentSection) {
    const totalSections = sections.length;
    const progressPercentage = (currentSection / totalSections) * 100;
    
    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.progress-text');
    
    if (progressFill && progressText) {
        progressFill.style.width = `${progressPercentage}%`;
        progressText.textContent = `${Math.round(progressPercentage)}% Complete`;
    }
}

// Smooth scroll for TOC links
tocLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Copy code functionality
document.querySelectorAll('.copy-btn').forEach(button => {
    button.addEventListener('click', async function() {
        const codeBlock = this.closest('.code-example').querySelector('code');
        const code = codeBlock.textContent;
        
        try {
            await navigator.clipboard.writeText(code);
            const originalHTML = this.innerHTML;
            this.innerHTML = '<i class="fas fa-check"></i> Copied!';
            this.style.color = '#34C759';
            
            setTimeout(() => {
                this.innerHTML = originalHTML;
                this.style.color = '';
            }, 2000);
        } catch (err) {
            console.error('Failed to copy code:', err);
        }
    });
});

// Code syntax highlighting with line numbers
document.addEventListener('DOMContentLoaded', () => {
    // Add line numbers to code blocks
    document.querySelectorAll('pre code').forEach(block => {
        const lines = block.textContent.split('\n');
        if (lines.length > 1) {
            const numberedLines = lines.map((line, index) => {
                return `<span class="line-number">${index + 1}</span>${line}`;
            }).join('\n');
            
            block.innerHTML = numberedLines;
            block.parentElement.classList.add('line-numbers');
        }
    });
});

// Interactive examples
const interactiveExamples = document.querySelectorAll('.interactive-example');
interactiveExamples.forEach(example => {
    const runButton = example.querySelector('.run-example');
    const output = example.querySelector('.example-output');
    
    if (runButton && output) {
        runButton.addEventListener('click', () => {
            output.style.display = 'block';
            output.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Running...';
            
            // Simulate code execution
            setTimeout(() => {
                output.innerHTML = `<i class="fas fa-check-circle"></i> Test passed successfully!
                <pre>Page title is: Google</pre>`;
                output.classList.add('success');
            }, 1500);
        });
    }
});

// Save progress to localStorage
function saveProgress() {
    const progress = {
        section: document.querySelector('.toc-link.active')?.getAttribute('href'),
        percentage: document.querySelector('.progress-text')?.textContent,
        timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('selenium-tutorial-progress', JSON.stringify(progress));
}

// Load saved progress
function loadProgress() {
    const saved = localStorage.getItem('selenium-tutorial-progress');
    if (saved) {
        const progress = JSON.parse(saved);
        const savedSection = document.querySelector(progress.section);
        
        if (savedSection) {
            // Show a notification about saved progress
            const notification = document.createElement('div');
            notification.className = 'progress-notification';
            notification.innerHTML = `
                <i class="fas fa-info-circle"></i>
                <span>Continue where you left off? (${progress.percentage})</span>
                <button class="continue-btn">Continue</button>
                <button class="dismiss-btn">Start Fresh</button>
            `;
            
            document.body.appendChild(notification);
            
            notification.querySelector('.continue-btn').addEventListener('click', () => {
                savedSection.scrollIntoView({ behavior: 'smooth' });
                notification.remove();
            });
            
            notification.querySelector('.dismiss-btn').addEventListener('click', () => {
                notification.remove();
                localStorage.removeItem('selenium-tutorial-progress');
            });
        }
    }
}

// Event listeners
window.addEventListener('scroll', updateActiveLink);
window.addEventListener('beforeunload', saveProgress);
document.addEventListener('DOMContentLoaded', loadProgress);

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K for search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.querySelector('.nav-search input')?.focus();
    }
    
    // Arrow keys for navigation
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        const currentIndex = Array.from(tocLinks).findIndex(link => 
            link.classList.contains('active')
        );
        
        if (e.key === 'ArrowRight' && currentIndex < tocLinks.length - 1) {
            tocLinks[currentIndex + 1].click();
        } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
            tocLinks[currentIndex - 1].click();
        }
    }
});

// Add styles for progress notification
const style = document.createElement('style');
style.textContent = `
    .progress-notification {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--gray-800);
        color: white;
        padding: var(--spacing-md) var(--spacing-lg);
        border-radius: var(--radius-lg);
        display: flex;
        align-items: center;
        gap: var(--spacing-md);
        box-shadow: var(--shadow-xl);
        z-index: 1000;
        animation: slideUp 0.3s ease;
    }
    
    @keyframes slideUp {
        from {
            transform: translateX(-50%) translateY(100px);
            opacity: 0;
        }
        to {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
        }
    }
    
    .progress-notification button {
        background: var(--primary-color);
        color: white;
        border: none;
        padding: var(--spacing-xs) var(--spacing-md);
        border-radius: var(--radius-sm);
        cursor: pointer;
        font-size: var(--font-size-sm);
        transition: all 0.2s;
    }
    
    .progress-notification .dismiss-btn {
        background: transparent;
        border: 1px solid var(--gray-600);
    }
    
    .progress-notification button:hover {
        transform: translateY(-1px);
    }
    
    .line-numbers {
        position: relative;
        padding-left: 3em !important;
    }
    
    .line-number {
        position: absolute;
        left: 0;
        color: var(--gray-600);
        text-align: right;
        width: 2em;
        user-select: none;
    }
`;
document.head.appendChild(style);