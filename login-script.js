// Login Page Script

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const answerInput = document.getElementById('answer');
  const errorMessage = document.getElementById('error-message');
  const loginBox = document.querySelector('.login-box');
  
  // The correct answer (case-insensitive)
  const correctAnswer = '04/11/2006'; // Change this to your desired answer
  
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const userAnswer = answerInput.value.trim().toLowerCase();
    
    if (userAnswer === correctAnswer) {
      // Correct answer - show success and redirect
      loginBox.classList.add('success');
      answerInput.style.borderColor = '#10b981';
      errorMessage.classList.remove('show');
      
      // Redirect after a short delay
      setTimeout(() => {
        window.location.href = 'home.html';
      }, 500);
      
    } else {
      // Wrong answer - show error
      answerInput.classList.add('error');
      errorMessage.textContent = 'Incorrect answer. Please try again.';
      errorMessage.classList.add('show');
      
      // Remove error styling after animation
      setTimeout(() => {
        answerInput.classList.remove('error');
      }, 500);
      
      // Clear input
      answerInput.value = '';
      answerInput.focus();
    }
  });
  
  // Remove error message when user starts typing
  answerInput.addEventListener('input', () => {
    errorMessage.classList.remove('show');
    answerInput.style.borderColor = '';
  });
});
