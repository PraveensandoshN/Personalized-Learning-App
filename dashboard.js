const VALID_USERNAME = 'user';
const SESSION_KEY = 'pla_auth_user';

const activeUser = sessionStorage.getItem(SESSION_KEY);

if (activeUser !== VALID_USERNAME) {
  window.location.href = 'index.html';
}

const currentUser = document.getElementById('currentUser');
if (currentUser) {
  currentUser.textContent = activeUser;
}

const logoutBtn = document.getElementById('logoutBtn');
logoutBtn.addEventListener('click', () => {
  sessionStorage.removeItem(SESSION_KEY);
  window.location.href = 'index.html';
});
