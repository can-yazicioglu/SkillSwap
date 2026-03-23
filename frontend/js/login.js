document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login-form");

  form.addEventListener("submit", (e) => {
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

    showAlert("Login successful!", "success");
    setTimeout(() => {
      window.location.href = "swipe.html";
    }, 1000);
  });
});
