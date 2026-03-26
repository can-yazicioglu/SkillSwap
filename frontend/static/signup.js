import { supabase } from "./supabase.js";

const form = document.getElementById("signup-form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  clearAllErrors();

  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const confirmPassword = document.getElementById("confirm-password").value.trim();
  let hasError = false;

  if (!username) {
    showError("username", "Please enter a username");
    hasError = true;
  } else if (username.length < 3) {
    showError("password", "Username must be at least 3 characters long");
  }

  if (!email) {
    showError("email", "Please enter your email");
    hasError = true;
  } else if (!email.includes("@")) {
    showError("email", "Please enter a valid email");
    hasError = true;
  }

  if (!password) {
    showError("password", "Please enter a password");
    hasError = true;
  } else if (password.length < 6) {
    showError("password", "Password must be at least 6 characters long");
    hasError = true;
  }

  if (!confirmPassword) {
    showError("confirm-password", "Please confirm your password");
    hasError = true;
  } else if (password !== confirmPassword) {
    showError("confirm-password", "Passwords do not match");
    hasError = true;
  }

  if (hasError) return;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username: username.toLowerCase() }
    }
  })

  if (error) {
    showAlert(error.message, 'error');
    return;
  }

  showAlert("Account created!", "success");
  setTimeout(() => {
    window.location.href = "/profile-setup";
  }, 1000);
});
