import { api, requireLogin } from './app.js';

await requireLogin();

const profile = await api('/profile');

document.getElementById('bio').value = profile.bio ?? '';

const teachContainer = document.getElementById('teach-skills-container');
const learnContainer = document.getElementById('learn-skills-container');

let teachSkills = profile.teach_skills ?? [];
let learnSkills = profile.learn_skills ?? [];

function renderTags() {
  teachContainer.innerHTML = teachSkills.map(s => `
    <span class="skill-tag skill-tag-teach">
      ${s} <button type="button" class="tag-remove" data-skill="${s}" data-type="teach">×</button>
    </span>
  `).join('');

  learnContainer.innerHTML = learnSkills.map(s => `
    <span class="skill-tag skill-tag-learn">
      ${s} <button type="button" class="tag-remove" data-skill="${s}" data-type="learn">×</button>
    </span>
  `).join('');
}

renderTags();

document.addEventListener('click', (e) => {
  if (!e.target.classList.contains('tag-remove')) return;
  const skill = e.target.dataset.skill;
  const type = e.target.dataset.type;

  if (type === 'teach') teachSkills = teachSkills.filter(s => s !== skill);
  if (type === 'learn') learnSkills = learnSkills.filter(s => s !== skill);

  renderTags();
})

document.getElementById('add-teach-btn').addEventListener('click', () => {
  const input = document.getElementById('teach-skill-input');
  const value = input.value.trim();
  if (!value) return;
  if (teachSkills.includes(value)) return;
  teachSkills.push(value);
  renderTags();
  input.value = '';
})

document.getElementById('add-learn-btn').addEventListener('click', () => {
  const input = document.getElementById('learn-skill-input');
  const value = input.value.trim();
  if (!value) return;
  if (learnSkills.includes(value)) return;
  learnSkills.push(value);
  renderTags();
  input.value = '';
})

document.getElementById('save-btn').addEventListener('click', async (e) => {
  e.preventDefault();

  const bio = document.getElementById('bio').value.trim();

  try {
    await api('/profile', 'POST', {
      bio,
      teach_skills: teachSkills,
      learn_skills: learnSkills
    });

    showAlert('Profile saved!', 'success');
    setTimeout(() => window.location.href = '/swipe', 1000);
  } catch (err) {
    showAlert(err.message, 'error');
  }
})