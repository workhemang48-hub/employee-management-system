console.log("employees.js loaded");

/* ==============================
   GLOBAL STATE
================================ */
let EMPLOYEES = [];

/* ==============================
   TOAST
================================ */
function showToast(message, type = "success") {
  const toast = document.getElementById("toast");

  toast.textContent = message;
  toast.className = `
    fixed bottom-6 right-6 px-6 py-3 rounded-xl shadow-lg z-50 text-white
    ${type === "success" ? "bg-green-600" : "bg-red-600"}
  `;

  toast.classList.remove("hidden");

  setTimeout(() => {
    toast.classList.add("hidden");
  }, 2500);
}

/* ==============================
   AUTH CHECK (ADMIN)
================================ */
async function checkAdminAuth() {
  const res = await fetch("/ems/backend/middleware/auth-check.php");
  const data = await res.json();

  if (!data.authorized || data.role !== "admin") {
    window.location.href = "login.html";
    return false;
  }
  return true;
}

/* ==============================
   LOAD EMPLOYEES
================================ */
async function loadEmployees() {
  const res = await fetch("/ems/backend/employees/read.php");
  EMPLOYEES = await res.json();
  renderEmployees(EMPLOYEES);
}

/* ==============================
   RENDER TABLE
================================ */
function renderEmployees(list) {
  const tbody = document.getElementById("employeesTableBody");
  tbody.innerHTML = "";

  if (!list.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" class="text-center py-6 text-slate-400">
          No employees found
        </td>
      </tr>`;
    return;
  }

  list.forEach((emp, i) => {
    tbody.innerHTML += `
      <tr class="border-b hover:bg-slate-50">
        <td class="px-6 py-4">${i + 1}</td>
        <td class="px-6 py-4 font-medium">${emp.name}</td>
        <td class="px-6 py-4">${emp.email}</td>
        <td class="px-6 py-4">${emp.department}</td>
        <td class="px-6 py-4">${emp.designation}</td>
        <td class="px-6 py-4">${emp.phone}</td>
        <td class="px-6 py-4">${emp.join_date}</td>
        <td class="px-6 py-4">
          <div class="flex gap-3">
            <button onclick="editEmployee(${emp.id})" class="text-blue-600">
              <i class="ph ph-pencil-simple"></i>
            </button>
            <button onclick="deleteEmployee(${emp.id})" class="text-red-600">
              <i class="ph ph-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  });
}
/* ==============================
   SEARCH + FILTER
================================ */
function applyFilters() {
  const search = document.getElementById("searchEmployee").value.toLowerCase();
  const dept = document.getElementById("filterDepartment").value;

  const filtered = EMPLOYEES.filter(emp => {
    const matchesSearch =
      emp.name.toLowerCase().includes(search) ||
      emp.email.toLowerCase().includes(search);

    const matchesDept = !dept || emp.department === dept;

    return matchesSearch && matchesDept;
  });

  renderEmployees(filtered);
}

document.getElementById("searchEmployee")
  .addEventListener("input", applyFilters);

document.getElementById("filterDepartment")
  .addEventListener("change", applyFilters);

/* ==============================
   MODAL CONTROLS
================================ */
function openAddEmployeeModal() {
  document.getElementById("employeeForm").reset();
  document.getElementById("employeeId").value = "";
  document.getElementById("modalTitle").innerText = "Add Employee";
  document.getElementById("employeeModal").classList.remove("hidden");
}

function closeEmployeeModal() {
  document.getElementById("employeeModal").classList.add("hidden");
}

window.openAddEmployeeModal = openAddEmployeeModal;
window.closeEmployeeModal = closeEmployeeModal;

/* ==============================
   EDIT EMPLOYEE
================================ */
function editEmployee(id) {
  const emp = EMPLOYEES.find(e => e.id == id);
  if (!emp) return;

  employeeId.value = emp.id;
  employeeName.value = emp.name;
  employeeEmail.value = emp.email;
  employeeDepartment.value = emp.department;
  employeeDesignation.value = emp.designation;
  employeePhone.value = emp.phone;
  employeeJoinDate.value = emp.join_date;

  document.getElementById("modalTitle").innerText = "Edit Employee";
  document.getElementById("employeeModal").classList.remove("hidden");
}

window.editEmployee = editEmployee;

/* ==============================
   SAVE (ADD / UPDATE)
================================ */
document.getElementById("employeeForm").addEventListener("submit", async e => {
  e.preventDefault();

  const payload = {
    id: employeeId.value,
    name: employeeName.value,
    email: employeeEmail.value,
    department: employeeDepartment.value,
    designation: employeeDesignation.value,
    phone: employeePhone.value,
    join_date: employeeJoinDate.value
  };

  const url = payload.id
    ? "/ems/backend/employees/update.php"
    : "/ems/backend/employees/create.php";

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  const data = await res.json();

  if (data.success) {
    showToast(payload.id ? "Employee updated" : "Employee added");
    closeEmployeeModal();
    loadEmployees();
  } else {
    showToast(data.message || "Save failed", "error");
  }
});

/* ==============================
   DELETE
================================ */
async function deleteEmployee(id) {
  if (!confirm("Delete this employee?")) return;

  await fetch("/ems/backend/employees/delete.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id })
  });

  showToast("Employee deleted");
  loadEmployees();
}

window.deleteEmployee = deleteEmployee;

/* ==============================
   INIT
================================ */
(async function () {
  const ok = await checkAdminAuth();
  if (ok) loadEmployees();
})();
function exportEmployeesExcel() {

    showLoading();

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

        XLSX.utils.book_append_sheet(workbook, worksheet, "Employees");

        XLSX.writeFile(workbook, "employees_report.xlsx");

        hideLoading();

    }, 500);
}