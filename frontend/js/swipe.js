const profiles = [
  {
    name: "Sarah Miller",
    initials: "SM",
    bio: "I've been playing guitar for 10 years and love teaching beginners.",
    teachSkills: ["Guitar", "Music Theory"],
    learnSkills: ["Python", "Web Design"]
  },
  {
    name: "Alex Chen",
    initials: "AC",
    bio: "Frontend developer who enjoys helping others learn JavaScript and React.",
    teachSkills: ["JavaScript", "React"],
    learnSkills: ["Photography", "Piano"]
  },
  {
    name: "Maya Patel",
    initials: "MP",
    bio: "I love cooking and can teach easy homemade recipes for busy students.",
    teachSkills: ["Cooking", "Meal Prep"],
    learnSkills: ["UI Design", "Public Speaking"]
  },
  {
    name: "Daniel Kim",
    initials: "DK",
    bio: "Chess player and Python learner looking to swap logic for creative skills.",
    teachSkills: ["Chess", "Math"],
    learnSkills: ["Python", "Graphic Design"]
  },
  {
    name: "Emma Johnson",
    initials: "EJ",
    bio: "I enjoy fitness coaching and want to improve my web development skills.",
    teachSkills: ["Fitness", "Yoga"],
    learnSkills: ["HTML", "CSS"]
  }
];

let currentProfileIndex = 0;

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

function loadProfile(index) {
  if (index >= profiles.length) {
    showNoMoreProfiles();
    return;
  }

  const profile = profiles[index];

  avatar.textContent = profile.initials;
  nameEl.textContent = profile.name;
  bioEl.textContent = profile.bio;

  teachSkillsContainer.innerHTML = "";
  learnSkillsContainer.innerHTML = "";

  profile.teachSkills.forEach((skill) => {
    teachSkillsContainer.appendChild(createSkillTag(skill, "teach"));
  });

  profile.learnSkills.forEach((skill) => {
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

function goToNextProfile() {
  currentProfileIndex++;
  loadProfile(currentProfileIndex);
}

function handlePass() {
  card.classList.add("swipe-left");

  setTimeout(() => {
    card.classList.remove("swipe-left");
    goToNextProfile();
  }, 300);
}

function handleLike() {
  card.classList.add("swipe-right");

  setTimeout(() => {
    card.classList.remove("swipe-right");

    const isMatch = Math.random() > 0.5;

    if (isMatch) {
      matchOverlay.classList.add("show");
    } else {
      goToNextProfile();
    }
  }, 300);
}

function closeMatchPopup() {
  matchOverlay.classList.remove("show");
  goToNextProfile();
}

passBtn.addEventListener("click", handlePass);
likeBtn.addEventListener("click", handleLike);
keepSwipingBtn.addEventListener("click", closeMatchPopup);

loadProfile(currentProfileIndex);