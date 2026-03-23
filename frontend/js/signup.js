document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("signup-form");

  form.addEventListener("submit", (e) => {
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
      showError("password", "Password must be at least 6 characters");
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

    showAlert("Account created!", "success");
    setTimeout(() => {
      window.location.href = "profile-setup.html";
    }, 1000);
  });
});
