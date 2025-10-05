// Tutorial-specific JavaScript

// Update active navigation based on scroll
const sections = document.querySelectorAll('.tutorial-section');
const navLinks = document.querySelectorAll('.tutorial-nav a');

function updateActiveSection() {
    const scrollPosition = window.scrollY + 100;
    
    sections.forEach((section, index) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            navLinks[index].classList.add('active');
            
            // Update progress bar
            updateProgress((index + 1) / sections.length * 100);
        }
    });
}

window.addEventListener('scroll', updateActiveSection);

// Progress bar
function updateProgress(percentage) {
    const progressFill = document.querySelector('.progress-fill');
    if (progressFill) {
        progressFill.style.width = `${percentage}%`;
    }
}

// Smooth scroll for navigation
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Live CSS editor for exercise
const cssInput = document.getElementById('css-input');
const previewContent = document.getElementById('preview-content');
let styleElement = null;

if (cssInput && previewContent) {
    // Create a style element for live updates
    styleElement = document.createElement('style');
    document.head.appendChild(styleElement);
    
    // Update styles on input
    cssInput.addEventListener('input', (e) => {
        updatePreviewStyles(e.target.value);
    });
    
    // Initial styles
    const initialCSS = `
.article-title {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
    letter-spacing: -0.02em;
}

.section-heading {
    font-size: 1.25rem;
    font-weight: 600;
    margin-top: 2rem;
    margin-bottom: 1rem;
}

.body-text {
    font-size: 1rem;
    line-height: 1.6;
    color: var(--color-text-secondary);
    margin-bottom: 1rem;
}

.caption {
    font-size: 0.875rem;
    color: var(--color-text-secondary);
    font-weight: 400;
    margin-top: 2rem;
}`;
    
    cssInput.value = initialCSS;
    updatePreviewStyles(initialCSS);
}

function updatePreviewStyles(css) {
    if (styleElement) {
        // Scope the CSS to the preview area
        const scopedCSS = css.replace(/([^{]+){/g, '#preview-content $1{');
        styleElement.textContent = scopedCSS;
    }
}

// Exercise functions
function resetExercise() {
    if (cssInput) {
        cssInput.value = `/* Add your styles here */
.article-title {
    /* Your styles */
}

.section-heading {
    /* Your styles */
}

.body-text {
    /* Your styles */
}

.caption {
    /* Your styles */
}`;
        updatePreviewStyles(cssInput.value);
    }
}

function checkSolution() {
    const styles = window.getComputedStyle(document.querySelector('#preview-content .article-title'));
    const fontSize = parseFloat(styles.fontSize);
    const fontWeight = styles.fontWeight;
    
    let score = 0;
    let feedback = [];
    
    // Check title styling
    if (fontSize >= 32) {
        score += 25;
        feedback.push('✓ Title size is appropriately large');
    } else {
        feedback.push('✗ Title could be larger for better hierarchy');
    }
    
    if (fontWeight >= 600) {
        score += 25;
        feedback.push('✓ Title has good font weight');
    } else {
        feedback.push('✗ Title should be bolder');
    }
    
    // Check section headings
    const sectionStyles = window.getComputedStyle(document.querySelector('#preview-content .section-heading'));
    if (parseFloat(sectionStyles.fontSize) > 16 && parseFloat(sectionStyles.fontSize) < fontSize) {
        score += 25;
        feedback.push('✓ Section headings create good hierarchy');
    } else {
        feedback.push('✗ Section headings need better sizing');
    }
    
    // Check readability
    const bodyStyles = window.getComputedStyle(document.querySelector('#preview-content .body-text'));
    if (parseFloat(bodyStyles.lineHeight) >= 1.5) {
        score += 25;
        feedback.push('✓ Body text has good line height for readability');
    } else {
        feedback.push('✗ Body text needs more line height');
    }
    
    // Show feedback
    showFeedback(score, feedback);
}

function showFeedback(score, feedback) {
    const modal = document.createElement('div');
    modal.className = 'feedback-modal';
    modal.innerHTML = `
        <div class="feedback-content">
            <h3>Your Score: ${score}%</h3>
            <div class="feedback-list">
                ${feedback.map(item => `<p class="${item.startsWith('✓') ? 'success' : 'error'}">${item}</p>`).join('')}
            </div>
            ${score === 100 ? '<p class="congratulations">🎉 Perfect! You\'ve mastered typography hierarchy!</p>' : '<p class="encouragement">Keep practicing! Try adjusting your styles based on the feedback.</p>'}
            <button class="btn btn-primary" onclick="this.closest('.feedback-modal').remove()">Close</button>
        </div>
    `;
    
    // Add styles for the modal
    const modalStyles = `
        .feedback-modal {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            animation: fadeIn 200ms ease-out;
        }
        
        .feedback-content {
            background: var(--color-background);
            padding: 2rem;
            border-radius: 1rem;
            max-width: 500px;
            width: 90%;
            box-shadow: 0 20px 25px rgba(0, 0, 0, 0.2);
        }
        
        .feedback-content h3 {
            margin-bottom: 1.5rem;
            text-align: center;
        }
        
        .feedback-list p {
            margin-bottom: 0.5rem;
        }
        
        .feedback-list .success {
            color: var(--color-success);
        }
        
        .feedback-list .error {
            color: var(--color-danger);
        }
        
        .congratulations {
            text-align: center;
            font-size: 1.125rem;
            margin: 1.5rem 0;
            color: var(--color-success);
        }
        
        .encouragement {
            text-align: center;
            margin: 1.5rem 0;
            color: var(--color-text-secondary);
        }
        
        .feedback-content .btn {
            display: block;
            margin: 0 auto;
        }
    `;
    
    // Add modal styles if not already added
    if (!document.getElementById('modal-styles')) {
        const styleEl = document.createElement('style');
        styleEl.id = 'modal-styles';
        styleEl.textContent = modalStyles;
        document.head.appendChild(styleEl);
    }
    
    document.body.appendChild(modal);
}

// Make editable areas more interactive
document.querySelectorAll('.editable-area').forEach(area => {
    area.addEventListener('focus', () => {
        area.classList.add('focused');
    });
    
    area.addEventListener('blur', () => {
        area.classList.remove('focused');
    });
});

// Add syntax highlighting for code blocks
function highlightCode() {
    document.querySelectorAll('pre code').forEach(block => {
        // Simple syntax highlighting
        let html = block.innerHTML;
        
        // Highlight comments
        html = html.replace(/(\/\*[\s\S]*?\*\/|\/\/.*$)/gm, '<span class="comment">$1</span>');
        
        // Highlight strings
        html = html.replace(/('.*?'|".*?")/g, '<span class="string">$1</span>');
        
        // Highlight properties
        html = html.replace(/([a-zA-Z-]+):/g, '<span class="property">$1</span>:');
        
        // Highlight values
        html = html.replace(/:\s*([0-9]+[a-zA-Z%]*)/g, ': <span class="number">$1</span>');
        
        // Highlight important keywords
        html = html.replace(/\b(font-family|font-size|font-weight|line-height|color|margin|padding)\b/g, '<span class="keyword">$1</span>');
        
        block.innerHTML = html;
    });
}

// Add highlighting styles
const highlightStyles = `
    .comment { color: #6a737d; font-style: italic; }
    .string { color: #032f62; }
    .property { color: #6f42c1; }
    .number { color: #005cc5; }
    .keyword { color: #d73a49; }
`;

const highlightStyleEl = document.createElement('style');
highlightStyleEl.textContent = highlightStyles;
document.head.appendChild(highlightStyleEl);

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    highlightCode();
    updateActiveSection();
});

// Save progress to localStorage
function saveProgress() {
    const progress = {
        currentSection: document.querySelector('.tutorial-nav a.active')?.getAttribute('href'),
        scrollPosition: window.scrollY,
        exerciseCode: cssInput?.value
    };
    
    localStorage.setItem('typography-tutorial-progress', JSON.stringify(progress));
}

// Restore progress
function restoreProgress() {
    const saved = localStorage.getItem('typography-tutorial-progress');
    if (saved) {
        const progress = JSON.parse(saved);
        
        // Restore scroll position
        if (progress.scrollPosition) {
            window.scrollTo(0, progress.scrollPosition);
        }
        
        // Restore exercise code
        if (progress.exerciseCode && cssInput) {
            cssInput.value = progress.exerciseCode;
            updatePreviewStyles(progress.exerciseCode);
        }
    }
}

// Auto-save progress
setInterval(saveProgress, 5000);

// Restore on load
window.addEventListener('load', restoreProgress);

console.log('Typography tutorial initialized!');