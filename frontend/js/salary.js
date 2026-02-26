console.log("salary.js loaded");

const OT_RATE = 100;
let isEditMode = false;

/* ===============================
   TOAST
================================ */
function showToast(message, type = "success") {
  const toast = document.getElementById("toast");

  toast.textContent = message;
  toast.className = `fixed bottom-6 right-6 px-6 py-3 rounded-xl shadow-lg z-50 text-white ${
    type === "success" ? "bg-green-600" : "bg-red-600"
  }`;

  toast.classList.remove("hidden");

  setTimeout(() => {
    toast.classList.add("hidden");
  }, 2500);
}

/* ===============================
   MODAL CONTROLS
================================ */
function openAddSalaryModal() {
  isEditMode = false;
  document.getElementById("salaryForm").reset();
  document.getElementById("salaryEmployeeId").value = "";

  document.getElementById("salaryModalTitle").innerText = "Add Salary";
  document.getElementById("salaryEmployee").disabled = false;

  updatePreview(0, 0);
  openModal();
}

function openModal() {
  const modal = document.getElementById("salaryModal");
  const content = document.getElementById("salaryModalContent");
  modal.classList.remove("hidden");
  setTimeout(() => {
    content.classList.remove("scale-95", "opacity-0");
  }, 10);
}

function closeSalaryModal() {
  const modal = document.getElementById("salaryModal");
  const content = document.getElementById("salaryModalContent");
  content.classList.add("scale-95", "opacity-0");
  setTimeout(() => modal.classList.add("hidden"), 200);
}

/* ===============================
   EDIT SALARY
================================ */
function editSalary(row) {
  isEditMode = true;

  document.getElementById("salaryModalTitle").innerText = "Update Salary";
  document.getElementById("salaryEmployeeId").value = row.employee_id;
  document.getElementById("salaryEmployee").value = row.employee_id;
  document.getElementById("salaryEmployee").disabled = true;

  document.getElementById("basicSalary").value = row.basic_salary;
  document.getElementById("overtimeHours").value = row.ot_hours;

  updatePreview(Number(row.basic_salary), Number(row.ot_hours));
  openModal();
}

/* ===============================
   CALCULATIONS
================================ */
function updatePreview(basic, hours) {
  const otPay = hours * OT_RATE;
  document.getElementById("overtimePaymentPreview").innerText = `₹${otPay}`;
  document.getElementById("totalSalaryPreview").innerText = `₹${basic + otPay}`;
}

function calculateOvertimePayment() {
  const basic = Number(document.getElementById("basicSalary").value) || 0;
  const hours = Number(document.getElementById("overtimeHours").value) || 0;
  updatePreview(basic, hours);
}

/* ===============================
   LOAD EMPLOYEES (DROPDOWN)
================================ */
function loadEmployeesDropdown() {
  fetch("/ems/backend/salary/employees-list.php")
    .then(res => res.json())
    .then(data => {
      const select = document.getElementById("salaryEmployee");
      select.innerHTML = `<option value="">Select Employee</option>`;

      data.forEach(emp => {
        const opt = document.createElement("option");
        opt.value = emp.id;
        opt.textContent = `${emp.name} (${emp.department})`;
        select.appendChild(opt);
      });
    })
    .catch(err => {
      console.error(err);
      showToast("Failed to load employees", "error");
    });
}

/* ===============================
   LOAD SALARIES
================================ */
function loadSalaries() {
  fetch("/ems/backend/salary/read.php")
    .then(res => res.json())
    .then(rows => {
      const tbody = document.getElementById("salaryTableBody");
      tbody.innerHTML = "";

      if (!rows.length) {
        tbody.innerHTML = `
          <tr>
            <td colspan="8" class="text-center py-6 text-slate-400">
              No salary records found
            </td>
          </tr>`;
        return;
      }

      rows.forEach(row => {
        tbody.innerHTML += `
          <tr class="border-b hover:bg-slate-50">
            <td class="px-4 py-3">${row.employee_name}</td>
            <td class="px-4 py-3">${row.department}</td>
            <td class="px-4 py-3 text-right">₹${row.basic_salary}</td>
            <td class="px-4 py-3 text-center">${row.ot_hours}</td>
            <td class="px-4 py-3 text-right">₹${row.ot_payment}</td>
            <td class="px-4 py-3 text-right font-semibold">₹${row.total_salary}</td>
            <td class="px-4 py-3 text-center">
              <span class="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700">
                Paid
              </span>
            </td>
            <td class="px-4 py-3 text-center">
              <button
                onclick='editSalary(${JSON.stringify(row)})'
                class="text-primary hover:text-primaryHover"
                title="Edit Salary"
              >
                <i class="ph ph-pencil-simple"></i>
              </button>
            </td>
          </tr>
        `;
      });
    });
}

/* ===============================
   SAVE SALARY
================================ */
document.getElementById("salaryForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const employeeId = isEditMode
    ? document.getElementById("salaryEmployeeId").value
    : document.getElementById("salaryEmployee").value;

  if (!employeeId) {
    showToast("Please select employee", "error");
    return;
  }

  const payload = {
    employee_id: employeeId,
    basic_salary: Number(document.getElementById("basicSalary").value),
    ot_hours: Number(document.getElementById("overtimeHours").value)
  };

  fetch("/ems/backend/salary/create-update.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        closeSalaryModal();
        loadSalaries();
        showToast(isEditMode ? "Salary updated successfully" : "Salary added successfully");
      } else {
        showToast("Save failed", "error");
      }
    })
    .catch(err => {
      console.error(err);
      showToast("Save failed", "error");
    });
});
/* ===============================
   EMPLOYEE SALARY DISTRIBUTION
================================ */
let salaryBarChart;

function loadEmployeeSalaryChart() {
  fetch("/ems/backend/salary/salary-stats-employees.php")
    .then(res => res.json())
    .then(data => {
      const labels = data.map(item => item.name);
      const salaries = data.map(item => item.total_salary);

      const ctx = document
        .getElementById("salaryDistributionChart")
        .getContext("2d");

      if (salaryBarChart) {
        salaryBarChart.destroy();
      }

      salaryBarChart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Total Salary (₹)",
              data: salaries,
              borderWidth: 2
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: false }
          },
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    })
    .catch(err => {
      console.error("Salary chart error:", err);
    });
}
/* ===============================
   MONTHLY SALARY EXPENSE
================================ */
let monthlySalaryChart;

function loadMonthlySalaryChart() {
  fetch("/ems/backend/salary/salary-stats-monthly.php")
    .then(res => res.json())
    .then(data => {
      const labels = data.map(item => item.month);
      const totals = data.map(item => item.total);

      const ctx = document
        .getElementById("monthlySalaryChart")
        .getContext("2d");

      if (monthlySalaryChart) {
        monthlySalaryChart.destroy();
      }

      monthlySalaryChart = new Chart(ctx, {
        type: "line",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Monthly Salary Expense (₹)",
              data: totals,
              tension: 0.4,
              fill: false,
              borderWidth: 3
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: false }
          },
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    })
    .catch(err => {
      console.error("Monthly chart error:", err);
    });
}
/* ===============================
   DEPARTMENT SALARY PIE
================================ */
let departmentSalaryChart;

function loadDepartmentSalaryChart() {
  fetch("/ems/backend/salary/salary-stats-department.php")
    .then(res => res.json())
    .then(data => {
      const labels = data.map(item => item.department);
      const totals = data.map(item => item.total);

      const ctx = document
        .getElementById("departmentSalaryChart")
        .getContext("2d");

      if (departmentSalaryChart) {
        departmentSalaryChart.destroy();
      }

      departmentSalaryChart = new Chart(ctx, {
        type: "pie",
        data: {
          labels: labels,
          datasets: [
            {
              data: totals
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: "bottom"
            }
          }
        }
      });
    })
    .catch(err => {
      console.error("Department pie error:", err);
    });
}
function exportSalaryExcel() {

    showLoading();

    setTimeout(() => {

        const table = document.getElementById("salaryTable");
        const rows = table.querySelectorAll("tr");

        let data = [];

        rows.forEach((row) => {
            let rowData = [];
            const cells = row.querySelectorAll("th, td");

            cells.forEach((cell, index) => {
                if (index !== cells.length - 1) {
                    rowData.push(cell.innerText);
                }
            });

            data.push(rowData);
        });

        const worksheet = XLSX.utils.aoa_to_sheet(data);
        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(workbook, worksheet, "Salary");

        XLSX.writeFile(workbook, "salary_report.xlsx");

        hideLoading();

    }, 500);
}
/* ===============================
   INIT
================================ */
loadEmployeesDropdown();
loadSalaries();
loadEmployeeSalaryChart();
loadMonthlySalaryChart();
loadDepartmentSalaryChart();


/* ===============================
   GLOBAL EXPORTS
================================ */
window.openAddSalaryModal = openAddSalaryModal;
window.closeSalaryModal = closeSalaryModal;
window.editSalary = editSalary;
window.calculateOvertimePayment = calculateOvertimePayment;
