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

const SUBJECTS = [
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Computer Science',
  'Data Science',
  'Business Studies',
  'Economics',
  'Communication Skills',
  'English'
];

const RECOMMENDATION_MAP = {
  Mathematics: ['Data Science', 'Physics', 'Economics'],
  Physics: ['Mathematics', 'Computer Science', 'Data Science'],
  Chemistry: ['Biology', 'Physics', 'Mathematics'],
  Biology: ['Chemistry', 'Communication Skills', 'Data Science'],
  'Computer Science': ['Data Science', 'Mathematics', 'Communication Skills'],
  'Data Science': ['Mathematics', 'Computer Science', 'Economics'],
  'Business Studies': ['Economics', 'Communication Skills', 'Data Science'],
  Economics: ['Business Studies', 'Mathematics', 'Data Science'],
  'Communication Skills': ['English', 'Business Studies', 'Computer Science'],
  English: ['Communication Skills', 'Business Studies', 'Economics']
};

const selectedSubjects = new Set();
const subjectsList = document.getElementById('subjectsList');
const recommendationsList = document.getElementById('recommendationsList');

function renderSubjects() {
  subjectsList.innerHTML = '';

  SUBJECTS.forEach((subject) => {
    const item = document.createElement('li');
    item.className = 'choice-item';

    item.innerHTML = `
      <label>
        <input type="checkbox" value="${subject}" />
        <span>${subject}</span>
      </label>
    `;

    const checkbox = item.querySelector('input');
    checkbox.checked = selectedSubjects.has(subject);
    checkbox.addEventListener('change', () => {
      if (checkbox.checked) {
        selectedSubjects.add(subject);
      } else {
        selectedSubjects.delete(subject);
      }
      renderRecommendations();
    });

    subjectsList.appendChild(item);
  });
}

function buildRecommendations() {
  if (selectedSubjects.size === 0) {
    return ['Select at least one subject from the left to get recommendations.'];
  }

  const scoreMap = new Map();

  selectedSubjects.forEach((subject) => {
    const related = RECOMMENDATION_MAP[subject] || [];
    related.forEach((item) => {
      if (selectedSubjects.has(item)) return;
      scoreMap.set(item, (scoreMap.get(item) || 0) + 1);
    });
  });

  const sorted = [...scoreMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([name]) => name)
    .slice(0, 6);

  if (sorted.length === 0) {
    return ['Great choices! Try selecting more subjects to get broader recommendations.'];
  }

  return sorted;
}

function renderRecommendations() {
  const recommendations = buildRecommendations();
  recommendationsList.innerHTML = '';

  recommendations.forEach((subject) => {
    const item = document.createElement('li');
    item.textContent = subject;
    recommendationsList.appendChild(item);
  });
}

const logoutBtn = document.getElementById('logoutBtn');
logoutBtn.addEventListener('click', () => {
  sessionStorage.removeItem(SESSION_KEY);
  window.location.href = 'index.html';
});

renderSubjects();
renderRecommendations();
