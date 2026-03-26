/* =============================================
   SKILLSWAP - Shared JavaScript (app.js)
   Included on every page before page-specific JS
   ============================================= */

import { supabase } from './supabase.js'

// --- API Base URL ---
const API_BASE = "http://localhost:8000/api";

async function isLoggedIn() {
  const { data: { session } } = await supabase.auth.getSession();
  return session !== null;
}

function logout() {
  supabase.auth.signOut();
  setTimeout(() => window.location.href = '/', 1000);
}

async function requireLogin() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) window.location.href = '/login';
}

async function redirectIfLoggedIn() {
  const { data: { session } } = await supabase.auth.getSession();
  if (session) window.location.href = '/swipe';
}


// --- API Helper Function ---

async function api(endpoint, method = "GET", body = null) {
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    window.location.href = '/login';
    return;
  }

  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${session.access_token}`
    }
  }

  if (body) options.body = JSON.stringify(body);

  try {
    const response = await fetch(API_BASE + endpoint, options);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || data.message || "Something went wrong");
    }

    return data
  } catch (error) {
    console.error(`API Error [${method} ${endpoint}]:`, error);
    throw error;
  }
}

// --- UI Helper Functions ---

// Form error handling
function showError(fieldId, message) {
  const errorEl = document.getElementById(`${fieldId}-error`);
  const inputEl = document.getElementById(fieldId);
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.classList.add("show");
  }
  if (inputEl) {
    inputEl.classList.add("error");
  }
}

function clearError(fieldId) {
  const errorEl = document.getElementById(`${fieldId}-error`);
  const inputEl = document.getElementById(fieldId);
  if (errorEl) {
    errorEl.textContent = "";
    errorEl.classList.remove("show");
  }
  if (inputEl) {
    inputEl.classList.remove("error");
  }
}

function clearAllErrors() {
  document.querySelectorAll(".form-error").forEach((el) => {
    el.textContent = "";
    el.classList.remove("show");
  });
  document.querySelectorAll(".form-input.error").forEach((el) => {
    el.classList.remove("error");
  });
}

// Alert toast
function showAlert(message, type = "info") {
  // Remove any existing toast
  const existing = document.querySelector(".alert-toast");
  if (existing) existing.remove();

  const alert = document.createElement("div");
  alert.className = `alert alert-${type} alert-toast`;
  alert.textContent = message;
  document.body.appendChild(alert);

  setTimeout(() => {
    alert.classList.add("fade-out");
    alert.addEventListener("animationend", () => alert.remove());
  }, 3000);
}

// --- Avatar & Skill Tag Generators ---

function getInitials(name) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function createAvatar(name, size = "") {
  const initials = getInitials(name);
  const sizeClass = size ? ` avatar-${size}` : "";
  return `<div class="avatar${sizeClass}">${initials}</div>`;
}

function createSkillTag(skillName, isTeaching = true) {
  const typeClass = isTeaching ? "skill-tag-teach" : "skill-tag-learn";
  return `<span class="skill-tag ${typeClass}">${skillName}</span>`;
}

// --- Navbar Helpers ---

function setActiveNavLink() {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".navbar-links a").forEach((link) => {
    const href = link.getAttribute("href");
    if (href === currentPage) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

function toggleMobileNav() {
  const navLinks = document.querySelector(".navbar-links");
  if (navLinks) {
    navLinks.classList.toggle("show");
  }
}

// --- Validation Helpers ---

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPassword(password) {
  return password && password.length >= 6;
}

// --- Auto-initialisation ---

setActiveNavLink()

const hamburgerBtn = document.querySelector(".hamburger")
if (hamburgerBtn) {
  hamburgerBtn.addEventListener("click", toggleMobileNav)
}

const logoutBtn = document.getElementById("logout-btn")
if (logoutBtn) {
  logoutBtn.addEventListener("click", async (e) => {
    e.preventDefault()
    await logout()
  })
}

window.showError = showError;
window.clearError = clearError;
window.clearAllErrors = clearAllErrors;
window.showAlert = showAlert;
window.createSkillTag = createSkillTag;
window.createAvatar = createAvatar;
window.getInitials = getInitials;
window.requireLogin = requireLogin;
window.redirectIfLoggedIn = redirectIfLoggedIn;
window.logout = logout;
window.toggleMobileNav = toggleMobileNav;

export { api, requireLogin };