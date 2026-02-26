console.log("leaves-employee.js loaded");

/* ===============================
   LOAD EMPLOYEE NAME
================================ */
function loadEmployeeName() {
  fetch("/ems/backend/auth/me.php")
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        document.getElementById("employeeName").innerText = data.name;
      }
    })
    .catch(err => console.error("Name load error:", err));
}
async function loadLeaveBalance() {
  try {
    const res = await fetch("/ems/backend/leaves/leave-balance.php");
    const data = await res.json();

    if (data.success) {
      document.getElementById("leaveBalance").innerText =
        data.remaining_leaves;
    }
  } catch (err) {
    console.error("Leave balance error:", err);
  }
}

/* ===============================
   INIT DASHBOARD
================================ */
document.addEventListener("DOMContentLoaded", () => {
  loadEmployeeName();
  loadLeaveBalance();
});

/* ===============================
   TOAST SYSTEM
================================ */
function showToast(msg, type = "success") {
  const t = document.createElement("div");

  t.className = `
    fixed top-6 right-6 px-6 py-3 rounded-xl text-white shadow-lg z-50
    ${type === "success" ? "bg-green-600" : "bg-red-600"}
  `;

  t.innerText = msg;
  document.body.appendChild(t);

  setTimeout(() => t.remove(), 3000);
}

/* ===============================
   SAFE FETCH JSON
================================ */
async function fetchJSON(url, options = {}) {
  const res = await fetch(url, options);

  // Session expired
  if (res.status === 401 || res.status === 403) {
    showToast("Session expired. Login again.", "error");
    window.location.href = "/ems/login.html";
    return null;
  }

  const text = await res.text();

  try {
    return JSON.parse(text);
  } catch (err) {
    console.error("Invalid JSON:", text);
    showToast("Server error response", "error");
    return null;
  }
}

/* ===============================
   LOAD MY LEAVES
================================ */
async function loadMyLeaves() {
  const data = await fetchJSON("/ems/backend/leaves/my-leaves.php");
  if (!data) return;

  const tbody = document.getElementById("employeeLeavesTableBody");
  tbody.innerHTML = "";

  if (!Array.isArray(data) || data.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="4" class="text-center py-6 text-slate-400">
          No leave requests yet.
        </td>
      </tr>`;
    return;
  }

  data.forEach(l => {
    const status = l.status.toLowerCase();

    tbody.innerHTML += `
      <tr class="border-b hover:bg-slate-50">
        <td class="px-6 py-4 font-medium">${l.leave_type}</td>

        <td class="px-6 py-4 text-slate-600">
          ${l.start_date} → ${l.end_date}
        </td>

        <td class="px-6 py-4">${l.reason}</td>

        <td class="px-6 py-4">
          <span class="px-3 py-1 rounded-full text-sm font-medium
            ${
              status === "pending"
                ? "bg-yellow-100 text-yellow-700"
                : status === "approved"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }">
            ${status}
          </span>
        </td>
      </tr>
    `;
  });
}

/* ===============================
   APPLY LEAVE REQUEST
================================ */
document
  .getElementById("leaveApplicationForm")
  ?.addEventListener("submit", async e => {
    e.preventDefault();

    // ✅ Correct element fetching
    const payload = {
      leave_type: document.getElementById("leaveType").value,
      start_date: document.getElementById("startDate").value,
      end_date: document.getElementById("endDate").value,
      reason: document.getElementById("leaveReason").value
    };

    const d = await fetchJSON("/ems/backend/leaves/apply.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!d) return;

    if (d.success) {
      showToast("Leave request applied successfully!");
      e.target.reset();
      loadMyLeaves();
    } else {
      showToast(d.message || "Failed to apply leave", "error");
    }
  });

/* ===============================
   INIT
================================ */
loadMyLeaves();
loadEmployeeName();
