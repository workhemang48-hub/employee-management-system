console.log("common.js loaded");

/* ===============================
   GLOBAL FOOTER
================================ */
document.addEventListener("DOMContentLoaded", () => {
  const footer = document.getElementById("appFooter");
  if (!footer) return;

  footer.innerHTML = `
    <footer class="mt-16 py-6 text-center text-sm text-slate-500 bg-white border-t">
      © ${new Date().getFullYear()} Crushi Agency EMS • Developed by Hemang Shrivastav
    </footer>
  `;
});


/* ===============================
   LOGOUT (GLOBAL)
================================ */
async function handleLogout(event) {
  if (event) event.preventDefault();

  try {
    const res = await fetch("/ems/backend/auth/logout.php");
    const data = await res.json();

    if (data.success) {
      window.location.href = "login.html";
    } else {
      alert("Logout failed");
    }
  } catch (err) {
    console.error("Logout error:", err);
    alert("Server error during logout");
  }
}

window.handleLogout = handleLogout;

function showLoading() {
    document.getElementById("loadingOverlay").classList.remove("hidden");
}

function hideLoading() {
    document.getElementById("loadingOverlay").classList.add("hidden");
}
