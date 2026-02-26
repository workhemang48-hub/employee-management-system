console.log("employee-dashboard.js loaded");

/* ===============================
   LOAD EMPLOYEE NAME
================================ */
function loadEmployeeName() {
  fetch("/ems/backend/auth/me.php")
    .then(res => res.json())
    .then(data => {
      console.log("Employee Data:", data);

      if (data.success) {
        document.getElementById("employeeName").innerText = data.name;
      }
    })
    .catch(err => console.error("Name load error:", err));
}
/* ===============================
   LOAD SALARY DETAILS
================================ */
async function loadSalaryDetails() {
  try {
    const res = await fetch("/ems/backend/salary/show-salary.php");
    const data = await res.json();

    const container = document.getElementById("salaryContent");
    if (!container) return;

    if (!data.success || !data.has_salary) {
      container.innerHTML = `
        <div class="bg-yellow-50 text-yellow-700 p-4 rounded-lg">
          Salary details not available yet.
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div class="bg-white p-5 rounded-xl shadow">
          <p class="text-sm text-slate-500">Basic Salary</p>
          <p class="text-2xl font-bold text-slate-800">
            ₹${Number(data.basic_salary).toLocaleString("en-IN")}
          </p>
        </div>

        <div class="bg-white p-5 rounded-xl shadow">
          <p class="text-sm text-slate-500">Overtime Hours</p>
          <p class="text-2xl font-bold text-slate-800">
            ${data.ot_hours} hrs
          </p>
          <p class="text-xs text-slate-400">
            @ ₹${data.ot_rate}/hour
          </p>
        </div>

        <div class="bg-white p-5 rounded-xl shadow">
          <p class="text-sm text-slate-500">Overtime Payment</p>
          <p class="text-2xl font-bold text-slate-800">
            ₹${Number(data.ot_payment).toLocaleString("en-IN")}
          </p>
        </div>

        <div class="bg-orange-500 p-5 rounded-xl shadow text-white">
          <p class="text-sm opacity-90">Total Salary</p>
          <p class="text-3xl font-bold">
            ₹${Number(data.total_salary).toLocaleString("en-IN")}
          </p>
          <p class="text-xs mt-2 opacity-80">
            Last updated: ${data.last_updated}
          </p>
        </div>

      </div>

      <div class="mt-4 text-sm">
        <span class="inline-block px-3 py-1 rounded-full bg-green-100 text-green-700">
          ${data.status}
        </span>
      </div>
    `;
  } catch (err) {
    console.error("Salary load error:", err);
  }
}

/* ===============================
   LOAD LEAVE BALANCE
================================ */
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
  loadSalaryDetails();
});
