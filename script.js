const VALID_USERNAME = 'user';
const VALID_PASSWORD = 'passs';
const SESSION_KEY = 'pla_auth_user';

const loginForm = document.getElementById('loginForm');
const loginStatus = document.getElementById('loginStatus');

if (sessionStorage.getItem(SESSION_KEY) === VALID_USERNAME) {
  window.location.href = 'dashboard.html';
}

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  if (username === VALID_USERNAME && password === VALID_PASSWORD) {
    sessionStorage.setItem(SESSION_KEY, username);
    loginStatus.textContent = 'Login successful. Redirecting...';
    loginStatus.className = 'status ok';
    window.location.href = 'dashboard.html';
    return;
  }

  loginStatus.textContent = 'Invalid credentials. Please use user / passs.';
  loginStatus.className = 'status error';
});
