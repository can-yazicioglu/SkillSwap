import { api, requireLogin } from './app.js';

await requireLogin();

let currentId, currentUsername, matchRequest;

const card = document.getElementById("swipe-card");
const avatar = document.getElementById("profile-avatar");
const nameEl = document.getElementById("profile-name");
const bioEl = document.getElementById("profile-bio");
const teachSkillsContainer = document.getElementById("teach-skills");
const learnSkillsContainer = document.getElementById("learn-skills");
const passBtn = document.getElementById("btn-pass");
const likeBtn = document.getElementById("btn-like");
const matchOverlay = document.getElementById("match-overlay");
const keepSwipingBtn = document.getElementById("btn-keep-swiping");

function createSkillTag(skill, type) {
  const span = document.createElement("span");
  span.textContent = skill;
  span.className = type === "teach"
    ? "skill-tag skill-tag-teach"
    : "skill-tag skill-tag-learn";
  return span;
}

async function loadProfile() {
  avatar.textContent = "";
  nameEl.textContent = "Loading...";
  bioEl.textContent = "";
  teachSkillsContainer.innerHTML = "";
  learnSkillsContainer.innerHTML = "";

  const profile = await api('/swipe');

  if (!profile) {
    showNoMoreProfiles();
    return;
  }

  currentId = profile.id;
  currentUsername = profile.username;
  matchRequest = profile.is_match;
  avatar.textContent = profile.username.slice(0, 2);
  nameEl.textContent = profile.username;
  bioEl.textContent = profile.bio;

  profile.teach_skills.forEach((skill) => {
    teachSkillsContainer.appendChild(createSkillTag(skill, "teach"));
  });

  profile.learn_skills.forEach((skill) => {
    learnSkillsContainer.appendChild(createSkillTag(skill, "learn"));
  });
}

function showNoMoreProfiles() {
  card.innerHTML = `
    <div style="text-align: center;">
      <h2>No more profiles for now</h2>
      <p>Check back later!</p>
    </div>
  `;
  passBtn.disabled = true;
  likeBtn.disabled = true;
}

async function goToNextProfile(swiped_id, direction) {
  console.log(swiped_id, direction);
  try {
    await api('/swipe', 'POST', {
      swiped_id,
      direction
    });
  } catch (err) {
    showAlert(err.message, 'error');
  }
  await loadProfile();
}

function handlePass() {
  card.classList.add("swipe-left");

  setTimeout(() => {
    card.classList.remove("swipe-left");
    goToNextProfile(currentId, "pass");
  }, 300);
}

function handleLike() {
  card.classList.add("swipe-right");

  setTimeout(() => {
    card.classList.remove("swipe-right");

    if (matchRequest) {
      const matchDesc = document.getElementById("match-desc");
      matchDesc.textContent = `You and ${currentUsername} can now message each other`;
      matchOverlay.classList.add("show");
    }

    goToNextProfile(currentId, "like");
  }, 300);
}

function closeMatchPopup() {
  matchOverlay.classList.remove("show");
  goToNextProfile();
}

passBtn.addEventListener("click", handlePass);
likeBtn.addEventListener("click", handleLike);
keepSwipingBtn.addEventListener("click", closeMatchPopup);

await loadProfile();