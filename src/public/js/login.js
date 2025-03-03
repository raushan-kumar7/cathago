document.addEventListener('DOMContentLoaded', function() {
  const toggleBtn = document.getElementById('togglePassword');
  const passwordInput = document.getElementById('password');
  
  if (toggleBtn && passwordInput) {
    toggleBtn.addEventListener('click', function() {
      if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleBtn.querySelector('i').classList.replace('bi-eye', 'bi-eye-slash');
      } else {
        passwordInput.type = 'password';
        toggleBtn.querySelector('i').classList.replace('bi-eye-slash', 'bi-eye');
      }
    });
  }

  const loginForm = document.querySelector('form');
  if (loginForm) {
    loginForm.addEventListener('submit', function() {
      this.reset();
    });
  }
});
