// Challenge JavaScript functionality

// Editor tab switching
const editorTabs = document.querySelectorAll('.editor-tab');
const codeEditors = document.querySelectorAll('.code-editor');

editorTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const targetTab = tab.getAttribute('data-tab');
        
        // Update active states
        editorTabs.forEach(t => t.classList.remove('active'));
        codeEditors.forEach(e => e.classList.remove('active'));
        
        tab.classList.add('active');
        document.getElementById(`${targetTab}-editor`).classList.add('active');
    });
});

// Device preview switching
const deviceBtns = document.querySelectorAll('.device-btn');
const previewFrame = document.getElementById('preview-frame');

deviceBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const device = btn.getAttribute('data-device');
        
        deviceBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        previewFrame.setAttribute('data-device', device);
    });
});

// Get editor values
function getEditorValues() {
    return {
        html: document.getElementById('html-input').value,
        css: document.getElementById('css-input').value,
        js: document.getElementById('js-input').value
    };
}

// Run code in preview
function runCode() {
    const { html, css, js } = getEditorValues();
    const iframe = document.getElementById('preview-iframe');
    
    // Create complete HTML document
    const fullHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../css/main.css">
    <style>
        /* Reset some styles for preview */
        body {
            margin: 0;
            padding: 0;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        /* User CSS */
        ${css}
    </style>
</head>
<body>
    ${html}
    <script>
        ${js}
    </script>
</body>
</html>`;
    
    // Update iframe content
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    iframeDoc.open();
    iframeDoc.write(fullHTML);
    iframeDoc.close();
    
    // Auto-check requirements after running
    setTimeout(checkRequirements, 500);
}

// Load starter template
function loadStarterTemplate() {
    const htmlTemplate = `<!-- Settings Page -->
<div class="settings-container">
    <h1>Settings</h1>
    
    <!-- General Settings -->
    <section class="settings-group">
        <h2 class="group-title">General</h2>
        
        <div class="setting-item">
            <div class="setting-content">
                <label for="notifications">Notifications</label>
                <p class="setting-description">Receive alerts about important updates</p>
            </div>
            <input type="checkbox" id="notifications" class="toggle-switch">
        </div>
        
        <div class="setting-item">
            <div class="setting-content">
                <label for="sound">Sound Effects</label>
                <p class="setting-description">Play sounds for actions</p>
            </div>
            <input type="checkbox" id="sound" class="toggle-switch" checked>
        </div>
    </section>
    
    <!-- Privacy Settings -->
    <section class="settings-group">
        <h2 class="group-title">Privacy</h2>
        
        <div class="setting-item">
            <div class="setting-content">
                <label for="analytics">Analytics</label>
                <p class="setting-description">Help improve our app by sharing usage data</p>
            </div>
            <input type="checkbox" id="analytics" class="toggle-switch">
        </div>
        
        <div class="setting-item">
            <div class="setting-content">
                <label for="personalization">Personalization</label>
                <p class="setting-description">Use your data to personalize your experience</p>
            </div>
            <input type="checkbox" id="personalization" class="toggle-switch" checked>
        </div>
    </section>
    
    <!-- Appearance Settings -->
    <section class="settings-group">
        <h2 class="group-title">Appearance</h2>
        
        <div class="setting-item">
            <div class="setting-content">
                <label for="dark-mode">Dark Mode</label>
                <p class="setting-description">Use dark theme throughout the app</p>
            </div>
            <input type="checkbox" id="dark-mode" class="toggle-switch">
        </div>
        
        <div class="setting-item">
            <div class="setting-content">
                <label for="reduce-motion">Reduce Motion</label>
                <p class="setting-description">Minimize animations and transitions</p>
            </div>
            <input type="checkbox" id="reduce-motion" class="toggle-switch">
        </div>
    </section>
</div>`;

    const cssTemplate = `/* Settings Page Styles */
.settings-container {
    max-width: 600px;
    margin: 0 auto;
    padding: 2rem;
    font-family: -apple-system, BlinkMacSystemFont, sans-serif;
}

h1 {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 2rem;
}

/* Settings Groups */
.settings-group {
    margin-bottom: 2.5rem;
}

.group-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1d1d1f;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #e5e5e7;
}

/* Setting Items */
.setting-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 0;
    border-bottom: 1px solid #f0f0f2;
}

.setting-item:last-child {
    border-bottom: none;
}

.setting-content {
    flex: 1;
    margin-right: 1rem;
}

.setting-content label {
    font-size: 1rem;
    font-weight: 500;
    color: #1d1d1f;
    display: block;
    margin-bottom: 0.25rem;
    cursor: pointer;
}

.setting-description {
    font-size: 0.875rem;
    color: #86868b;
    margin: 0;
}

/* Toggle Switch */
.toggle-switch {
    position: relative;
    width: 51px;
    height: 31px;
    appearance: none;
    background-color: #c8c8cc;
    border-radius: 31px;
    outline: none;
    cursor: pointer;
    transition: background-color 0.3s;
    flex-shrink: 0;
}

.toggle-switch:checked {
    background-color: #34c759;
}

.toggle-switch::before {
    content: '';
    position: absolute;
    width: 27px;
    height: 27px;
    border-radius: 50%;
    background-color: white;
    top: 2px;
    left: 2px;
    transition: transform 0.3s;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.toggle-switch:checked::before {
    transform: translateX(20px);
}

/* Hover Effects */
.setting-item:hover {
    background-color: #f9f9f9;
    margin: 0 -1rem;
    padding-left: 1rem;
    padding-right: 1rem;
    border-radius: 0.5rem;
}

/* Focus States */
.toggle-switch:focus {
    box-shadow: 0 0 0 4px rgba(0, 122, 255, 0.3);
}

/* Dark Mode Support */
@media (prefers-color-scheme: dark) {
    .settings-container {
        color: #f5f5f7;
    }
    
    h1, .group-title, .setting-content label {
        color: #f5f5f7;
    }
    
    .group-title {
        border-bottom-color: #38383a;
    }
    
    .setting-item {
        border-bottom-color: #2d2d2f;
    }
    
    .setting-item:hover {
        background-color: #1c1c1e;
    }
    
    .setting-description {
        color: #98989d;
    }
    
    .toggle-switch {
        background-color: #48484a;
    }
}

/* Responsive */
@media (max-width: 640px) {
    .settings-container {
        padding: 1rem;
    }
    
    h1 {
        font-size: 2rem;
    }
    
    .setting-item {
        flex-direction: column;
        align-items: flex-start;
    }
    
    .toggle-switch {
        margin-top: 1rem;
    }
}`;

    const jsTemplate = `// Settings Page Interactivity

// Add smooth transitions to toggles
document.querySelectorAll('.toggle-switch').forEach(toggle => {
    toggle.addEventListener('change', function() {
        // Visual feedback
        const settingItem = this.closest('.setting-item');
        settingItem.style.backgroundColor = this.checked ? 'rgba(52, 199, 89, 0.1)' : 'rgba(200, 200, 204, 0.1)';
        
        setTimeout(() => {
            settingItem.style.backgroundColor = '';
        }, 300);
        
        // Log the change (in a real app, this would save to storage)
        console.log(\`\${this.id}: \${this.checked ? 'enabled' : 'disabled'}\`);
    });
});

// Add keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        // Add focus styles dynamically
        document.activeElement.style.outline = '2px solid #007AFF';
        document.activeElement.style.outlineOffset = '2px';
    }
});

// Dark mode toggle functionality
const darkModeToggle = document.getElementById('dark-mode');
if (darkModeToggle) {
    darkModeToggle.addEventListener('change', function() {
        document.body.classList.toggle('dark-mode', this.checked);
    });
}

// Reduce motion functionality
const reduceMotionToggle = document.getElementById('reduce-motion');
if (reduceMotionToggle) {
    reduceMotionToggle.addEventListener('change', function() {
        document.documentElement.style.setProperty('--transition-duration', this.checked ? '0ms' : '300ms');
    });
}

console.log('Settings page initialized!');`;

    // Set the templates
    document.getElementById('html-input').value = htmlTemplate;
    document.getElementById('css-input').value = cssTemplate;
    document.getElementById('js-input').value = jsTemplate;
    
    // Run the code
    runCode();
}

// Check requirements
function checkRequirements() {
    const iframe = document.getElementById('preview-iframe');
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    
    const requirements = {
        toggle: false,
        groups: false,
        hierarchy: false,
        spacing: false,
        interactive: false
    };
    
    try {
        // Check for toggle switches
        const toggles = iframeDoc.querySelectorAll('input[type="checkbox"]');
        requirements.toggle = toggles.length > 0 && Array.from(toggles).some(t => 
            t.className.includes('toggle') || t.className.includes('switch')
        );
        
        // Check for groups
        const groups = iframeDoc.querySelectorAll('section, .group, .settings-group');
        requirements.groups = groups.length >= 2;
        
        // Check for hierarchy (different heading levels)
        const h1 = iframeDoc.querySelector('h1');
        const h2orh3 = iframeDoc.querySelectorAll('h2, h3');
        requirements.hierarchy = h1 && h2orh3.length > 0;
        
        // Check for spacing (padding/margin in CSS)
        const styles = iframeDoc.styleSheets;
        let hasSpacing = false;
        for (let sheet of styles) {
            try {
                const rules = sheet.cssRules || sheet.rules;
                for (let rule of rules) {
                    if (rule.style && (rule.style.padding || rule.style.margin)) {
                        hasSpacing = true;
                        break;
                    }
                }
            } catch (e) {
                // Handle cross-origin issues
            }
        }
        requirements.spacing = hasSpacing;
        
        // Check for interactivity
        const scripts = iframeDoc.scripts;
        requirements.interactive = scripts.length > 0 && scripts[scripts.length - 1].textContent.trim().length > 10;
        
    } catch (error) {
        console.error('Error checking requirements:', error);
    }
    
    // Update UI
    Object.entries(requirements).forEach(([req, completed]) => {
        const element = document.querySelector(`.requirement[data-id="${req}"]`);
        if (element) {
            if (completed) {
                element.classList.add('completed');
                element.querySelector('.check-icon').textContent = '✓';
            } else {
                element.classList.remove('completed');
                element.querySelector('.check-icon').textContent = '○';
            }
        }
    });
    
    // Check if all requirements are met
    const allCompleted = Object.values(requirements).every(r => r);
    if (allCompleted) {
        showSuccessNotification();
    }
    
    return requirements;
}

// Show success notification
function showSuccessNotification() {
    const notification = document.createElement('div');
    notification.className = 'success-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <h3>🎉 Excellent Work!</h3>
            <p>You've successfully completed all requirements for this challenge.</p>
        </div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: var(--color-success);
        color: white;
        padding: 1.5rem;
        border-radius: 0.75rem;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Reset challenge
function resetChallenge() {
    if (confirm('Are you sure you want to reset your code?')) {
        document.getElementById('html-input').value = `<!-- Settings Page HTML -->
<div class="settings-container">
    <h1>Settings</h1>
    
    <!-- Add your settings groups here -->
    
</div>`;
        
        document.getElementById('css-input').value = `/* Settings Page Styles */
.settings-container {
    max-width: 600px;
    margin: 0 auto;
    padding: 2rem;
}

/* Add your styles here */
`;
        
        document.getElementById('js-input').value = `// Settings Page JavaScript

// Add your interactive functionality here
`;
        
        // Clear preview
        const iframe = document.getElementById('preview-iframe');
        iframe.src = 'about:blank';
        
        // Reset requirements
        document.querySelectorAll('.requirement').forEach(req => {
            req.classList.remove('completed');
            req.querySelector('.check-icon').textContent = '○';
        });
    }
}

// Submit solution
function submitSolution() {
    const requirements = checkRequirements();
    const completedCount = Object.values(requirements).filter(r => r).length;
    const totalCount = Object.values(requirements).length;
    
    if (completedCount === totalCount) {
        // Save solution
        const solution = {
            challenge: 'settings-page',
            code: getEditorValues(),
            completedAt: new Date().toISOString()
        };
        
        localStorage.setItem('challenge-settings-solution', JSON.stringify(solution));
        
        // Show success modal
        const modal = document.createElement('div');
        modal.className = 'success-modal';
        modal.innerHTML = `
            <div class="modal-overlay" onclick="this.parentElement.remove()"></div>
            <div class="modal-content">
                <h2>🎉 Challenge Complete!</h2>
                <p>Congratulations! You've successfully designed a settings page following Apple's HIG principles.</p>
                
                <div class="score-display">
                    <div class="score-circle">
                        <span class="score-number">100%</span>
                    </div>
                </div>
                
                <div class="achievement">
                    <h3>Achievement Unlocked</h3>
                    <p>Settings Master - Created an intuitive settings interface</p>
                </div>
                
                <div class="next-steps">
                    <h3>What's Next?</h3>
                    <p>Try the next challenge to continue improving your design skills!</p>
                </div>
                
                <div class="modal-actions">
                    <button class="btn btn-outline" onclick="this.closest('.success-modal').remove()">Close</button>
                    <button class="btn btn-primary" onclick="window.location.href='card.html'">Next Challenge</button>
                </div>
            </div>
        `;
        
        // Add modal styles
        const modalStyles = `
            .success-modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                z-index: 2000;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .modal-overlay {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                backdrop-filter: blur(10px);
            }
            
            .success-modal .modal-content {
                position: relative;
                background: var(--color-background);
                padding: 3rem;
                border-radius: 1rem;
                max-width: 500px;
                width: 90%;
                text-align: center;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
                animation: bounceIn 0.5s ease-out;
            }
            
            .score-display {
                margin: 2rem 0;
            }
            
            .score-circle {
                width: 120px;
                height: 120px;
                margin: 0 auto;
                border-radius: 50%;
                background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 10px 30px rgba(0, 122, 255, 0.3);
            }
            
            .score-number {
                font-size: 2rem;
                font-weight: 700;
                color: white;
            }
            
            .achievement {
                background: var(--color-surface);
                padding: 1.5rem;
                border-radius: 0.75rem;
                margin: 2rem 0;
            }
            
            .achievement h3 {
                font-size: 1rem;
                margin-bottom: 0.5rem;
                color: var(--color-primary);
            }
            
            .achievement p {
                margin: 0;
                color: var(--color-text-secondary);
            }
            
            .next-steps {
                margin: 2rem 0;
            }
            
            .next-steps h3 {
                font-size: 1.125rem;
                margin-bottom: 0.5rem;
            }
            
            .modal-actions {
                display: flex;
                gap: 1rem;
                justify-content: center;
                margin-top: 2rem;
            }
            
            @keyframes bounceIn {
                0% {
                    opacity: 0;
                    transform: scale(0.8);
                }
                50% {
                    transform: scale(1.05);
                }
                100% {
                    opacity: 1;
                    transform: scale(1);
                }
            }
        `;
        
        if (!document.getElementById('modal-styles')) {
            const styleEl = document.createElement('style');
            styleEl.id = 'modal-styles';
            styleEl.textContent = modalStyles;
            document.head.appendChild(styleEl);
        }
        
        document.body.appendChild(modal);
    } else {
        // Show incomplete message
        alert(`You've completed ${completedCount} out of ${totalCount} requirements. Keep going!`);
    }
}

// Close solution modal
function closeSolution() {
    document.getElementById('solution-modal').classList.add('hidden');
}

// Auto-save progress
let saveTimeout;
function autoSave() {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
        const progress = {
            code: getEditorValues(),
            timestamp: new Date().toISOString()
        };
        localStorage.setItem('challenge-settings-progress', JSON.stringify(progress));
    }, 1000);
}

// Add auto-save listeners
document.querySelectorAll('textarea').forEach(textarea => {
    textarea.addEventListener('input', autoSave);
});

// Restore progress on load
function restoreProgress() {
    const saved = localStorage.getItem('challenge-settings-progress');
    if (saved) {
        const progress = JSON.parse(saved);
        document.getElementById('html-input').value = progress.code.html || '';
        document.getElementById('css-input').value = progress.code.css || '';
        document.getElementById('js-input').value = progress.code.js || '';
    }
}

// Add animation styles
const animationStyles = `
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

const animStyleEl = document.createElement('style');
animStyleEl.textContent = animationStyles;
document.head.appendChild(animStyleEl);

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    restoreProgress();
    
    // Run code if there's saved progress
    const { html, css, js } = getEditorValues();
    if (html.trim() || css.trim() || js.trim()) {
        runCode();
    }
});

console.log('Challenge system initialized!');