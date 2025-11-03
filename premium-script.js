// Simple Question Modal for Version 2.0
document.addEventListener('DOMContentLoaded', function() {
    const creatorRequestBtn = document.getElementById('creatorRequestBtn');
    const questionModal = document.getElementById('questionModal');
    const modalClose = document.querySelector('.modal-close');
    const submitBtn = document.getElementById('submitAnswer');
    const answerInput = document.getElementById('answerInput');
    
    // The correct answer (case-insensitive)
    const correctAnswer = 'muthu mani maalai';
    
    // Open modal when creator request button is clicked
    if (creatorRequestBtn) {
        creatorRequestBtn.addEventListener('click', function() {
            if (questionModal) {
                questionModal.setAttribute('aria-hidden', 'false');
                document.body.style.overflow = 'hidden';
                // Focus on input
                setTimeout(() => answerInput.focus(), 300);
            }
        });
    }
    
    // Close modal function
    function closeModal() {
        if (questionModal) {
            questionModal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            answerInput.value = '';
        }
    }
    
    // Close button
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
    
    // Close on backdrop click
    if (questionModal) {
        questionModal.addEventListener('click', function(e) {
            if (e.target === questionModal) {
                closeModal();
            }
        });
    }
    
    // Close on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && questionModal && questionModal.getAttribute('aria-hidden') === 'false') {
            closeModal();
        }
    });
    
    // Submit answer on Enter key
    if (answerInput) {
        answerInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                checkAnswer();
            }
        });
    }
    
    // Submit button click
    if (submitBtn) {
        submitBtn.addEventListener('click', checkAnswer);
    }
    
    // Check answer function
    function checkAnswer() {
        const userAnswer = answerInput.value.trim().toLowerCase();
        
        if (!userAnswer) {
            answerInput.style.borderColor = '#ef4444';
            answerInput.placeholder = 'Please type your answer...';
            setTimeout(() => {
                answerInput.style.borderColor = '#bfdbfe';
            }, 2000);
            return;
        }
        
        if (userAnswer === correctAnswer.toLowerCase()) {
            // Correct answer!
            answerInput.style.borderColor = '#10b981';
            answerInput.value = '✓ Correct!';
            answerInput.disabled = true;
            
            // Store access in localStorage
            localStorage.setItem('version2Access', 'granted');
            
            // Redirect to birthday page after short delay
            setTimeout(() => {
                window.location.href = 'birthday.html';
            }, 800);
            
        } else {
            // Wrong answer
            answerInput.style.borderColor = '#ef4444';
            answerInput.value = '';
            answerInput.placeholder = '❌ Try again...';
            
            // Shake animation
            questionModal.querySelector('.question-modal-content').style.animation = 'shake 0.5s';
            setTimeout(() => {
                questionModal.querySelector('.question-modal-content').style.animation = '';
                answerInput.style.borderColor = '#bfdbfe';
                answerInput.placeholder = 'Type your answer...';
            }, 500);
        }
    }
    
    // Check if user already has access
    function checkExistingAccess() {
        const hasAccess = localStorage.getItem('version2Access');
        if (hasAccess === 'granted') {
            // User already answered correctly
            console.log('User has Version 2.0 access');
            // You could auto-redirect or show version 2 content
            // showVersion2Content();
        }
    }
    
    checkExistingAccess();
});

// Add shake animation to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
        20%, 40%, 60%, 80% { transform: translateX(10px); }
    }
`;
document.head.appendChild(style);

// Function to show Version 2.0 content (customize as needed)
function showVersion2Content() {
    // Example: Hide the version 2 section and redirect
    // window.location.href = 'version2.html';
    
    // Or show hidden content on the same page
    // const version2Section = document.querySelector('.version-two-section');
    // if (version2Section) {
    //     version2Section.innerHTML = '<h2>Welcome to Version 2.0!</h2>';
    // }
}

// Optional: Reset access (for testing)
function resetAccess() {
    localStorage.removeItem('version2Access');
    location.reload();
}
