import { supabase } from "./supabase.js";

const form = document.getElementById("login-form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  clearAllErrors();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  let hasError = false;

  if (!email) {
    showError("email", "Please enter your email");
    hasError = true;
  }

  if (!password) {
    showError("password", "Please enter your password");
    hasError = true;
  }

  if (hasError) return;

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    showAlert(error.message, 'error');
    return;
  }

  showAlert("Login successful!", "success");
  setTimeout(() => {
    window.location.href = "/swipe";
  }, 1000);
});