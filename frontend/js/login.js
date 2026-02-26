document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  fetch("../backend/auth/login.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: document.getElementById("username").value,
      password: document.getElementById("password").value
    })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      if (data.role === "admin") {
        window.location.href = "dashboard.html";
      } else {
        window.location.href = "employee-dashboard.html";
      }
    } else {
      alert(data.message || "Invalid login credentials");
    }
  })
  .catch(err => {
    console.error(err);
    alert("Server error");
  });
});
// 🔒 TOGGLE PASSWORD VISIBILITY
const togglePassword = document.getElementById("togglePassword");
const passwordInput = document.getElementById("password");
const eyeIcon = document.getElementById("eyeIcon");

if (togglePassword) {
  togglePassword.addEventListener("click", () => {
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      eyeIcon.classList.remove("ph-eye");
      eyeIcon.classList.add("ph-eye-slash");
    } else {
      passwordInput.type = "password";
      eyeIcon.classList.remove("ph-eye-slash");
      eyeIcon.classList.add("ph-eye");
    }
  });
}
