// Lesson-specific JavaScript

// Track lesson progress
let lessonProgress = {
    currentSection: 0,
    totalSections: 0,
    exercisesCompleted: [],
    timeSpent: 0,
    startTime: Date.now()
};

// Initialize lesson
document.addEventListener('DOMContentLoaded', () => {
    initializeLesson();
    trackSectionProgress();
    initializeExercises();
    initializeCodeCopy();
    checkPrerequisites();
});

// Initialize lesson tracking
function initializeLesson() {
    lessonProgress.totalSections = document.querySelectorAll('.lesson-section').length;
    
    // Load saved progress
    const savedProgress = localStorage.getItem('current-lesson-progress');
    if (savedProgress) {
        lessonProgress = { ...lessonProgress, ...JSON.parse(savedProgress) };
    }
    
    // Start time tracking
    setInterval(() => {
        lessonProgress.timeSpent++;
        saveProgress();
    }, 1000);
}

// Track which sections have been viewed
function trackSectionProgress() {
    const sections = document.querySelectorAll('.lesson-section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionIndex = Array.from(sections).indexOf(entry.target);
                lessonProgress.currentSection = Math.max(lessonProgress.currentSection, sectionIndex);
                updateProgressIndicator();
            }
        });
    }, { threshold: 0.5 });
    
    sections.forEach(section => observer.observe(section));
}

// Update progress indicator
function updateProgressIndicator() {
    const progress = (lessonProgress.currentSection + 1) / lessonProgress.totalSections * 100;
    // Update any progress bars or indicators here
}

// Initialize exercises
function initializeExercises() {
    // Hint toggles
    document.querySelectorAll('.hint-toggle').forEach(button => {
        button.addEventListener('click', function() {
            const hintsContent = this.nextElementSibling;
            if (hintsContent.style.display === 'none') {
                hintsContent.style.display = 'block';
                this.textContent = 'Hide Hints';
            } else {
                hintsContent.style.display = 'none';
                this.textContent = 'Show Hints';
            }
        });
    });
    
    // Solution toggles
    document.querySelectorAll('.solution-toggle').forEach(button => {
        button.addEventListener('click', function() {
            const solutionContent = this.nextElementSibling;
            if (solutionContent.style.display === 'none') {
                solutionContent.style.display = 'block';
                this.textContent = 'Hide Solution';
                // Mark exercise as viewed
                const exerciseCard = this.closest('.exercise-card');
                const exerciseIndex = Array.from(document.querySelectorAll('.exercise-card')).indexOf(exerciseCard);
                if (!lessonProgress.exercisesCompleted.includes(exerciseIndex)) {
                    lessonProgress.exercisesCompleted.push(exerciseIndex);
                    saveProgress();
                }
            } else {
                solutionContent.style.display = 'none';
                this.textContent = 'Show Solution';
            }
        });
    });
}

// Initialize code copy functionality
function initializeCodeCopy() {
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
}

// Check prerequisites
function checkPrerequisites() {
    const checkboxes = document.querySelectorAll('.prereq-check');
    let allChecked = false;
    
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            allChecked = Array.from(checkboxes).every(cb => cb.checked);
            if (allChecked) {
                showPrerequisiteComplete();
            }
        });
    });
}

// Show prerequisite completion message
function showPrerequisiteComplete() {
    const message = document.createElement('div');
    message.className = 'prereq-complete-message';
    message.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <p>Great! You're ready to start learning.</p>
    `;
    document.querySelector('.checklist').appendChild(message);
    
    setTimeout(() => {
        message.style.opacity = '0';
        setTimeout(() => message.remove(), 300);
    }, 3000);
}

// Complete lesson
function completeLesson() {
    const lessonNumber = getCurrentLessonNumber();
    
    // Update main progress
    const mainProgress = JSON.parse(localStorage.getItem('selenium-learning-progress') || '{}');
    if (!mainProgress.completedLessons) mainProgress.completedLessons = [];
    
    if (!mainProgress.completedLessons.includes(lessonNumber)) {
        mainProgress.completedLessons.push(lessonNumber);
        mainProgress.currentLesson = Math.min(lessonNumber + 1, 6);
        mainProgress.exercises.completed += lessonProgress.exercisesCompleted.length;
        localStorage.setItem('selenium-learning-progress', JSON.stringify(mainProgress));
    }
    
    // Show completion animation
    showLessonComplete();
    
    // Enable next lesson button
    setTimeout(() => {
        const nextBtn = document.getElementById('nextLessonBtn');
        if (nextBtn) {
            nextBtn.classList.add('pulse');
        }
    }, 1000);
}

// Get current lesson number from URL
function getCurrentLessonNumber() {
    const match = window.location.pathname.match(/lesson(\d+)/);
    return match ? parseInt(match[1]) : 1;
}

// Show lesson completion animation
function showLessonComplete() {
    const overlay = document.createElement('div');
    overlay.className = 'completion-overlay';
    overlay.innerHTML = `
        <div class="completion-modal">
            <div class="completion-icon">
                <i class="fas fa-trophy"></i>
            </div>
            <h2>Lesson Complete!</h2>
            <p>Excellent work! You've mastered the basics of Selenium.</p>
            <div class="completion-stats">
                <div class="stat">
                    <i class="fas fa-clock"></i>
                    <span>Time: ${Math.floor(lessonProgress.timeSpent / 60)} mins</span>
                </div>
                <div class="stat">
                    <i class="fas fa-tasks"></i>
                    <span>Exercises: ${lessonProgress.exercisesCompleted.length}/2</span>
                </div>
            </div>
            <button onclick="this.closest('.completion-overlay').remove()">Continue</button>
        </div>
    `;
    document.body.appendChild(overlay);
}

// Save progress
function saveProgress() {
    localStorage.setItem('current-lesson-progress', JSON.stringify(lessonProgress));
}

// Add completion styles
const completionStyles = document.createElement('style');
completionStyles.textContent = `
    .prereq-complete-message {
        background: var(--success-color);
        color: white;
        padding: var(--spacing-md);
        border-radius: var(--radius-md);
        margin-top: var(--spacing-md);
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
        animation: slideIn 0.3s ease;
        transition: opacity 0.3s;
    }
    
    .completion-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
        animation: fadeIn 0.3s ease;
    }
    
    .completion-modal {
        background: white;
        padding: var(--spacing-3xl);
        border-radius: var(--radius-xl);
        text-align: center;
        max-width: 500px;
        animation: bounceIn 0.6s ease;
    }
    
    .completion-icon {
        font-size: 80px;
        color: #FFD700;
        margin-bottom: var(--spacing-lg);
        animation: rotate 1s ease;
    }
    
    .completion-modal h2 {
        font-size: var(--font-size-3xl);
        margin-bottom: var(--spacing-md);
    }
    
    .completion-modal p {
        color: var(--gray-600);
        margin-bottom: var(--spacing-xl);
    }
    
    .completion-stats {
        display: flex;
        justify-content: center;
        gap: var(--spacing-2xl);
        margin-bottom: var(--spacing-xl);
    }
    
    .completion-stats .stat {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
        color: var(--gray-700);
    }
    
    .completion-modal button {
        background: var(--primary-color);
        color: white;
        border: none;
        padding: var(--spacing-md) var(--spacing-2xl);
        border-radius: var(--radius-full);
        font-size: var(--font-size-lg);
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
    }
    
    .completion-modal button:hover {
        background: #0051D5;
        transform: translateY(-2px);
    }
    
    .pulse {
        animation: pulse 1s infinite;
    }
    
    @keyframes slideIn {
        from {
            transform: translateY(-20px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes bounceIn {
        0% {
            transform: scale(0.5);
            opacity: 0;
        }
        60% {
            transform: scale(1.1);
        }
        100% {
            transform: scale(1);
            opacity: 1;
        }
    }
    
    @keyframes rotate {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    
    @keyframes pulse {
        0% {
            box-shadow: 0 0 0 0 rgba(0, 122, 255, 0.4);
        }
        70% {
            box-shadow: 0 0 0 10px rgba(0, 122, 255, 0);
        }
        100% {
            box-shadow: 0 0 0 0 rgba(0, 122, 255, 0);
        }
    }
`;
document.head.appendChild(completionStyles);