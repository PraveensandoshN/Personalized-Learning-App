const state = {
  user: null,
  profile: {
    interests: [],
    skillLevel: 'Beginner',
    goal: ''
  },
  feedback: {},
  courses: [
    { id: 1, title: 'Python for Everybody', category: 'Programming', level: 'Beginner', rating: 4.8 },
    { id: 2, title: 'Data Science Foundations', category: 'Data Science', level: 'Beginner', rating: 4.6 },
    { id: 3, title: 'Machine Learning', category: 'Data Science', level: 'Intermediate', rating: 4.7 },
    { id: 4, title: 'Business Strategy Essentials', category: 'Business', level: 'Intermediate', rating: 4.4 },
    { id: 5, title: 'Deep Learning Specialization', category: 'AI', level: 'Advanced', rating: 4.9 },
    { id: 6, title: 'Personal Productivity', category: 'Personal Development', level: 'Beginner', rating: 4.3 },
  ],
  viewed: new Set(),
  enrolled: new Set(),
  completed: new Set()
};

const byId = (id) => document.getElementById(id);

function renderCourses(list = state.courses) {
  const ul = byId('courseList');
  ul.innerHTML = '';

  list.forEach((course) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${course.title}</strong><br/>
      <span class="badge">${course.category}</span>
      <span class="badge">${course.level}</span>
      ⭐ ${course.rating.toFixed(1)}
      <div style="margin-top: .4rem; display: flex; gap: .4rem;">
        <button data-action="view" data-id="${course.id}">Viewed</button>
        <button data-action="enroll" data-id="${course.id}">Enrolled</button>
        <button data-action="complete" data-id="${course.id}">Completed</button>
        <button class="delete" data-action="delete" data-id="${course.id}">Delete</button>
      </div>
    `;
    ul.appendChild(li);
  });
}

function courseScore(course) {
  const terms = new Set([...state.profile.interests.map(v => v.toLowerCase()), state.profile.goal.toLowerCase()]);
  let score = course.rating;

  if (terms.size > 0) {
    for (const t of terms) {
      if (!t) continue;
      if (course.title.toLowerCase().includes(t) || course.category.toLowerCase().includes(t)) score += 1.5;
    }
  }

  if (course.level === state.profile.skillLevel) score += 1;
  if (state.enrolled.has(course.id)) score += 0.5;
  if (state.completed.has(course.id)) score -= 1.5;
  if (state.feedback[course.id]) score += state.feedback[course.id] / 5;

  return score;
}

function renderRecommendations() {
  const sorted = [...state.courses]
    .sort((a, b) => courseScore(b) - courseScore(a))
    .slice(0, 5);

  const recUl = byId('recommendationList');
  const feedbackUl = byId('feedbackList');
  recUl.innerHTML = '';
  feedbackUl.innerHTML = '';

  sorted.forEach((course) => {
    const rec = document.createElement('li');
    rec.innerHTML = `<strong>${course.title}</strong> — ${course.category} (${course.level}) · Score: ${courseScore(course).toFixed(2)}`;
    recUl.appendChild(rec);

    const fb = document.createElement('li');
    fb.innerHTML = `
      <strong>${course.title}</strong>
      <input type="number" min="1" max="5" step="1" value="${state.feedback[course.id] || 5}" style="width: 72px; margin-left: .5rem;" />
      <button data-fid="${course.id}">Save Rating</button>
    `;
    feedbackUl.appendChild(fb);
  });
}

function attachEvents() {
  byId('registerBtn').addEventListener('click', () => {
    const name = byId('name').value.trim();
    const email = byId('email').value.trim();
    if (!name || !email) return;
    state.user = { name, email };
    byId('authStatus').textContent = `Registered: ${name} (${email})`;
  });

  byId('loginBtn').addEventListener('click', () => {
    if (!state.user) {
      byId('authStatus').textContent = 'No user found. Please register first.';
      return;
    }
    byId('authStatus').textContent = `Logged in as ${state.user.name}`;
  });

  byId('saveProfileBtn').addEventListener('click', () => {
    state.profile = {
      interests: byId('interests').value.split(',').map(s => s.trim()).filter(Boolean),
      skillLevel: byId('skillLevel').value,
      goal: byId('goal').value.trim()
    };
    byId('profileStatus').textContent = `Profile saved (${state.profile.skillLevel})`;
  });

  byId('applyFilterBtn').addEventListener('click', () => {
    const q = byId('search').value.toLowerCase().trim();
    const level = byId('filterLevel').value;
    const minRating = Number(byId('minRating').value || 0);

    const filtered = state.courses.filter(c => {
      const qMatch = !q || c.title.toLowerCase().includes(q) || c.category.toLowerCase().includes(q);
      const lMatch = level === 'All' || c.level === level;
      const rMatch = c.rating >= minRating;
      return qMatch && lMatch && rMatch;
    });

    renderCourses(filtered);
  });

  byId('recommendBtn').addEventListener('click', renderRecommendations);

  byId('courseList').addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;
    const id = Number(btn.dataset.id);
    const action = btn.dataset.action;

    if (action === 'view') state.viewed.add(id);
    if (action === 'enroll') state.enrolled.add(id);
    if (action === 'complete') state.completed.add(id);
    if (action === 'delete') state.courses = state.courses.filter(c => c.id !== id);

    renderCourses();
  });

  byId('feedbackList').addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-fid]');
    if (!btn) return;
    const id = Number(btn.dataset.fid);
    const ratingInput = btn.parentElement.querySelector('input');
    const rating = Number(ratingInput.value);
    if (rating >= 1 && rating <= 5) {
      state.feedback[id] = rating;
      renderRecommendations();
    }
  });

  byId('addCourseBtn').addEventListener('click', () => {
    const title = byId('adminTitle').value.trim();
    const category = byId('adminCategory').value.trim();
    const level = byId('adminLevel').value;
    const rating = Number(byId('adminRating').value || 0);

    if (!title || !category || rating <= 0 || rating > 5) return;

    state.courses.push({
      id: Date.now(),
      title,
      category,
      level,
      rating
    });

    byId('adminTitle').value = '';
    byId('adminCategory').value = '';
    renderCourses();
  });
}

attachEvents();
renderCourses();
