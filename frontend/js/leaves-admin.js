console.log("leaves-admin.js loaded");

/* ==============================
   SAFE FETCH JSON FUNCTION
================================ */
async function fetchJSON(url, options = {}) {
  let res = await fetch(url, options);

  let text = await res.text();

  try {
    return JSON.parse(text);
  } catch (err) {
    console.error("Invalid JSON from:", url);
    console.error("Raw Response:", text);
    throw new Error("Server returned invalid JSON");
  }
}

/* ==============================
   AUTH CHECK (ADMIN ONLY)
================================ */
async function checkAdminAuth() {
  try {
    const auth = await fetchJSON("/ems/backend/middleware/auth-check.php");

    if (!auth.authorized || auth.role !== "admin") {
      window.location.href = "login.html";
      return false;
    }

    return true;
  } catch (err) {
    console.error("Auth failed:", err);
    window.location.href = "login.html";
    return false;
  }
}

/* ==============================
   STATE
================================ */
let allLeaves = [];
let currentFilter = "all";

/* ==============================
   TOAST
================================ */
function showToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.className = `
    fixed bottom-6 right-6 px-6 py-3 rounded-xl text-white shadow-lg z-50
    ${type === "success" ? "bg-green-600" : "bg-red-600"}
  `;
  toast.innerText = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

/* ==============================
   LOAD LEAVES
================================ */
async function loadLeaves() {
  try {
    const data = await fetchJSON("/ems/backend/leaves/list.php");

    allLeaves = Array.isArray(data) ? data : [];
    renderLeaves();

  } catch (err) {
    console.error("Load leaves error:", err);
    showToast("Failed to load leaves", "error");
  }
}

/* ==============================
   RENDER TABLE
================================ */
function renderLeaves() {
  const tbody = document.getElementById("leavesTableBody");
  tbody.innerHTML = "";

  let rows = allLeaves;

  if (currentFilter !== "all") {
    rows = allLeaves.filter(
      l => l.status.toLowerCase() === currentFilter
    );
  }

  if (!rows.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" class="text-center py-6 text-slate-400">
          No leave requests found
        </td>
      </tr>`;
    return;
  }

  rows.forEach(l => {
    const status = l.status.toLowerCase();

    tbody.innerHTML += `
      <tr class="border-b">

        <!-- Employee -->
        <td class="px-6 py-4 font-medium">${l.name}</td>

        <!-- Dates -->
        <td class="px-6 py-4">${l.start_date} → ${l.end_date}</td>

        <!-- Reason -->
        <td class="px-6 py-4">${l.reason}</td>

        <!-- Status -->
        <td class="px-6 py-4">
          <span class="px-3 py-1 rounded-full text-sm
            ${status === "pending" ? "bg-yellow-100 text-yellow-700" :
              status === "approved" ? "bg-green-100 text-green-700" :
              "bg-red-100 text-red-700"}">
            ${status}
          </span>
        </td>

        <!-- Actions -->
        <td class="px-6 py-4 flex gap-2">
          ${
            status === "pending"
              ? `
              <button onclick="updateLeave(${l.id}, 'approved')"
                class="bg-green-600 text-white px-3 py-1 rounded text-sm">
                Approve
              </button>

              <button onclick="updateLeave(${l.id}, 'rejected')"
                class="bg-red-600 text-white px-3 py-1 rounded text-sm">
                Reject
              </button>
              `
              : `<span class="text-slate-400 text-sm">No actions</span>`
          }
        </td>

      </tr>
    `;
  });
}

/* ==============================
   FILTER BUTTONS
================================ */
function filterLeaves(status) {
  currentFilter = status;

  ["All", "Pending", "Approved", "Rejected"].forEach(s => {
    document.getElementById("filter" + s).className =
      "px-6 py-2 rounded-full bg-slate-100 text-slate-600 font-medium text-sm";
  });

  document.getElementById(
    "filter" + status.charAt(0).toUpperCase() + status.slice(1)
  ).className =
    "px-6 py-2 rounded-full bg-primary text-white font-medium text-sm";

  renderLeaves();
}

/* ==============================
   UPDATE STATUS
================================ */
async function updateLeave(id, status) {
  try {
    const res = await fetchJSON("/ems/backend/leaves/update-status.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status })
    });

    if (res.success) {
      showToast(`Leave ${status} successfully`);
      loadLeaves();
    } else {
      showToast(res.message || "Update failed", "error");
    }

  } catch (err) {
    console.error("Update error:", err);
    showToast("Server error", "error");
  }
}

/* ==============================
   INIT (AUTH FIRST)
================================ */
(async function init() {
  const ok = await checkAdminAuth();
  if (ok) loadLeaves();
})();

/* ==============================
   EXPORT GLOBALS
================================ */
window.filterLeaves = filterLeaves;
window.updateLeave = updateLeave;
function exportLeaveExcel() {

    showLoading();   // 👈 show loader

    setTimeout(() => {

        const table = document.querySelector("table");
        const rows = table.querySelectorAll("tr");

        let data = [];

        rows.forEach((row) => {

            let rowData = [];
            const cells = row.querySelectorAll("th, td");

            cells.forEach((cell, index) => {

                // Skip last column (Actions)
                if (index !== cells.length - 1) {
                    rowData.push(cell.innerText);
                }

            });

            data.push(rowData);
        });

        const worksheet = XLSX.utils.aoa_to_sheet(data);
        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(workbook, worksheet, "Leaves");

        XLSX.writeFile(workbook, "leave_report.xlsx");

        hideLoading();   // 👈 hide loader

    }, 500);
}