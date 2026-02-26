console.log("dashboard.js loaded");

document.addEventListener("DOMContentLoaded", () => {
  loadStats();
  loadRecentActivity();
});

/* =========================
   DASHBOARD STATS
========================= */
async function loadStats() {
  try {
    const res = await fetch("/ems/backend/dashboard/stats.php");
    const text = await res.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      console.error("Stats not JSON:", text);
      return;
    }

    if (!data.authorized) {
      window.location.href = "login.html";
      return;
    }

    updateText("totalEmployees", data.totalEmployees ?? 0);
    updateText("totalLeaves", data.pendingLeaves ?? 0);

    const payoutEl = document.getElementById("monthlyPayout");
    if (payoutEl) {
      const amount = Number(data.monthlyPayout || 0);
      payoutEl.innerText = "₹" + amount.toLocaleString("en-IN");
    }

  } catch (err) {
    console.error("Dashboard stats error:", err);
  }
}

/* =========================
   RECENT ACTIVITY
========================= */
async function loadRecentActivity() {
  try {
    const res = await fetch("/ems/backend/dashboard/recent-activity.php");
    const data = await res.json();

    const container = document.getElementById("recentActivity");
    if (!container || !Array.isArray(data)) return;

    container.innerHTML = "";

    if (data.length === 0) {
      container.innerHTML =
        `<p class="text-slate-400 text-sm">No recent activity</p>`;
      return;
    }

    data.forEach(item => {
      container.innerHTML += `
        <div class="flex items-start gap-4 pb-4 border-b border-slate-100 last:border-0">
          <div class="w-2 h-2 bg-primary rounded-full mt-2"></div>
          <div>
            <p class="text-slate-800 font-medium text-sm">${item.text}</p>
            <p class="text-slate-500 text-xs mt-1">${timeAgo(item.time)}</p>
          </div>
        </div>
      `;
    });

  } catch (err) {
    console.error("Recent activity error:", err);
  }
}

/* =========================
   HELPERS
========================= */
function updateText(id, value) {
  const el = document.getElementById(id);
  if (el) el.innerText = value;
}

function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 3600) return Math.floor(diff / 60) + " minutes ago";
  if (diff < 86400) return Math.floor(diff / 3600) + " hours ago";
  return Math.floor(diff / 86400) + " days ago";
}

/* =========================
   LOGOUT
========================= */
async function handleLogout() {
  try {
    const res = await fetch("/ems/backend/auth/logout.php");
    const data = await res.json();
    if (data.success) window.location.href = "login.html";
  } catch (err) {
    console.error("Logout error:", err);
  }
}

window.handleLogout = handleLogout;
