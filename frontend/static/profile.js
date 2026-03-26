import { api, requireLogin } from './app.js';

await requireLogin();

const profile = await api('/profile');

document.getElementById('avatar').textContent = profile.username.slice(0, 2);
document.getElementById('username').textContent = profile.username;
document.getElementById('email').textContent = profile.email;
document.getElementById('bio').textContent = profile.bio ?? '';

const teachContainer = document.getElementById('teach-tags-container');
const learnContainer = document.getElementById('learn-tags-container');

let teachSkills = profile.teach_skills ?? [];
let learnSkills = profile.learn_skills ?? [];

function renderTags() {
  teachContainer.innerHTML = teachSkills.map(s => `
    <span class="skill-tag skill-tag-teach"> ${s} </span>
  `).join('');

  learnContainer.innerHTML = learnSkills.map(s => `
    <span class="skill-tag skill-tag-teach"> ${s} </span>
  `).join('');
}

renderTags();