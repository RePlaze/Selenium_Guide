// Learning Path JavaScript

// Track user progress
const userProgress = {
    currentLesson: 1,
    completedLessons: [],
    totalLessons: 6,
    exercises: {
        completed: 0,
        total: 12
    }
};

// Load progress from localStorage
function loadProgress() {
    const saved = localStorage.getItem('selenium-learning-progress');
    if (saved) {
        const data = JSON.parse(saved);
        Object.assign(userProgress, data);
        updateUI();
    }
}

// Save progress to localStorage
function saveProgress() {
    localStorage.setItem('selenium-learning-progress', JSON.stringify(userProgress));
}

// Update UI based on progress
function updateUI() {
    const lessonCards = document.querySelectorAll('.lesson-card');
    
    lessonCards.forEach((card, index) => {
        const lessonNum = index + 1;
        const startBtn = card.querySelector('.lesson-start-btn');
        const statusIcon = card.querySelector('.status-icon i');
        
        // Reset classes
        card.classList.remove('completed', 'active', 'locked');
        
        if (userProgress.completedLessons.includes(lessonNum)) {
            // Completed lesson
            card.classList.add('completed');
            statusIcon.className = 'fas fa-check-circle';
            startBtn.innerHTML = 'Review <i class="fas fa-redo"></i>';
            startBtn.classList.remove('disabled');
            startBtn.href = `lesson${lessonNum}/index.html`;
        } else if (lessonNum === userProgress.currentLesson) {
            // Active lesson
            card.classList.add('active');
            statusIcon.className = 'fas fa-play-circle';
            startBtn.innerHTML = 'Continue <i class="fas fa-arrow-right"></i>';
            startBtn.classList.remove('disabled');
            startBtn.href = `lesson${lessonNum}/index.html`;
        } else if (lessonNum < userProgress.currentLesson || 
                   (lessonNum === userProgress.currentLesson + 1 && 
                    userProgress.completedLessons.includes(userProgress.currentLesson))) {
            // Available lesson
            statusIcon.className = 'fas fa-unlock';
            startBtn.innerHTML = 'Start Lesson <i class="fas fa-arrow-right"></i>';
            startBtn.classList.remove('disabled');
            startBtn.href = `lesson${lessonNum}/index.html`;
        } else {
            // Locked lesson
            card.classList.add('locked');
            statusIcon.className = 'fas fa-lock';
            startBtn.innerHTML = '<i class="fas fa-lock"></i> Locked';
            startBtn.classList.add('disabled');
            startBtn.href = '#';
        }
    });
    
    updateProgressTracker();
}

// Update progress tracker
function updateProgressTracker() {
    const progressPercent = (userProgress.completedLessons.length / userProgress.totalLessons) * 100;
    
    // Create floating progress tracker if it doesn't exist
    if (!document.querySelector('.progress-tracker-floating')) {
        const tracker = document.createElement('div');
        tracker.className = 'progress-tracker-floating';
        tracker.innerHTML = `
            <h4>Your Progress</h4>
            <div class="overall-progress">
                <span class="lessons-count">${userProgress.completedLessons.length}/${userProgress.totalLessons} Lessons</span>
                <span class="progress-percent">${Math.round(progressPercent)}%</span>
            </div>
            <div class="progress-bar-overall">
                <div class="progress-fill-overall" style="width: ${progressPercent}%"></div>
            </div>
            <div class="exercises-progress">
                <i class="fas fa-code"></i>
                <span>${userProgress.exercises.completed}/${userProgress.exercises.total} Exercises</span>
            </div>
        `;
        document.body.appendChild(tracker);
    } else {
        // Update existing tracker
        const tracker = document.querySelector('.progress-tracker-floating');
        tracker.querySelector('.lessons-count').textContent = 
            `${userProgress.completedLessons.length}/${userProgress.totalLessons} Lessons`;
        tracker.querySelector('.progress-percent').textContent = 
            `${Math.round(progressPercent)}%`;
        tracker.querySelector('.progress-fill-overall').style.width = 
            `${progressPercent}%`;
        tracker.querySelector('.exercises-progress span').textContent = 
            `${userProgress.exercises.completed}/${userProgress.exercises.total} Exercises`;
    }
}

// Handle lesson card clicks
document.querySelectorAll('.lesson-start-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        if (this.classList.contains('disabled')) {
            e.preventDefault();
            showLockedMessage();
        }
    });
});

// Show locked lesson message
function showLockedMessage() {
    const message = document.createElement('div');
    message.className = 'locked-message';
    message.innerHTML = `
        <i class="fas fa-lock"></i>
        <p>Complete the previous lessons to unlock this one!</p>
    `;
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.remove();
    }, 3000);
}

// Simulate lesson completion (for demo)
function completeLesson(lessonNum) {
    if (!userProgress.completedLessons.includes(lessonNum)) {
        userProgress.completedLessons.push(lessonNum);
        userProgress.currentLesson = Math.min(lessonNum + 1, userProgress.totalLessons);
        
        // Add completion animation
        const card = document.querySelector(`[data-lesson="${lessonNum}"]`);
        card.classList.add('lesson-completing');
        
        setTimeout(() => {
            card.classList.remove('lesson-completing');
            saveProgress();
            updateUI();
            showCompletionMessage(lessonNum);
        }, 600);
    }
}

// Show completion message
function showCompletionMessage(lessonNum) {
    const message = document.createElement('div');
    message.className = 'completion-message';
    message.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <h3>Lesson ${lessonNum} Complete!</h3>
        <p>Great job! You're making excellent progress.</p>
        <button onclick="this.parentElement.remove()">Continue</button>
    `;
    document.body.appendChild(message);
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    loadProgress();
    
    // Add demo completion buttons for testing
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        const demoControls = document.createElement('div');
        demoControls.className = 'demo-controls';
        demoControls.innerHTML = `
            <p>Demo Controls:</p>
            <button onclick="completeLesson(1)">Complete Lesson 1</button>
            <button onclick="localStorage.clear(); location.reload()">Reset Progress</button>
        `;
        document.body.appendChild(demoControls);
    }
});

// Add styles for messages
const messageStyles = document.createElement('style');
messageStyles.textContent = `
    .locked-message,
    .completion-message {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: var(--spacing-2xl);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-xl);
        text-align: center;
        z-index: 1000;
        animation: fadeIn 0.3s ease;
    }
    
    .locked-message {
        background: var(--gray-900);
        color: white;
    }
    
    .locked-message i,
    .completion-message i {
        font-size: var(--font-size-4xl);
        margin-bottom: var(--spacing-md);
    }
    
    .locked-message i {
        color: var(--gray-400);
    }
    
    .completion-message i {
        color: var(--success-color);
    }
    
    .completion-message h3 {
        font-size: var(--font-size-2xl);
        margin-bottom: var(--spacing-sm);
    }
    
    .completion-message button {
        margin-top: var(--spacing-lg);
        padding: var(--spacing-sm) var(--spacing-xl);
        background: var(--primary-color);
        color: white;
        border: none;
        border-radius: var(--radius-full);
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
    }
    
    .completion-message button:hover {
        background: #0051D5;
        transform: translateY(-2px);
    }
    
    .demo-controls {
        position: fixed;
        bottom: 20px;
        left: 20px;
        background: var(--gray-900);
        color: white;
        padding: var(--spacing-md);
        border-radius: var(--radius-md);
        font-size: var(--font-size-sm);
    }
    
    .demo-controls button {
        display: block;
        margin-top: var(--spacing-sm);
        padding: var(--spacing-xs) var(--spacing-sm);
        background: var(--primary-color);
        color: white;
        border: none;
        border-radius: var(--radius-sm);
        cursor: pointer;
        font-size: var(--font-size-xs);
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.9);
        }
        to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
        }
    }
`;
document.head.appendChild(messageStyles);