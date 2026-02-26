console.log("employee-payslip.js loaded");

/* ===============================
   LOAD AVAILABLE MONTHS
================================ */
async function loadMonths() {
  try {
    const res = await fetch("/ems/backend/emp/getSalaryMonths.php");

    if (!res.ok) {
      throw new Error("HTTP error " + res.status);
    }

    const data = await res.json();

    if (!data.success) return;

    const select = document.getElementById("monthSelect");
    select.innerHTML = "";

    data.months.forEach(month => {
      const option = document.createElement("option");
      option.value = month;
      option.textContent = month;
      select.appendChild(option);
    });

    if (data.months.length > 0) {
      loadPayslip(data.months[0]);
    }

  } catch (err) {
    console.error("Month load error:", err);
  }
}

/* ===============================
   LOAD PAYSLIP
================================ */
async function loadPayslip(month = null) {
  try {
    let url = "/ems/backend/emp/getEmployeePayslip.php";

    if (month) {
      url += "?month=" + month;
    }

    const res = await fetch(url);

    if (!res.ok) {
      throw new Error("HTTP error " + res.status);
    }

    const data = await res.json();

    if (!data.success) {
      alert(data.message || "Failed to load payslip");
      return;
    }

    const d = data.data;

    document.getElementById("empName").innerText = d.name;
    document.getElementById("empDept").innerText = d.department;
    document.getElementById("empDesig").innerText = d.designation;
    document.getElementById("salaryMonth").innerText = d.salary_month;

    document.getElementById("basicSalary").innerText = d.basic_salary;
    document.getElementById("otPayment").innerText = d.ot_payment;
    document.getElementById("tax").innerText = Number(d.tax).toFixed(2);
    document.getElementById("insurance").innerText = Number(d.insurance).toFixed(2);
    document.getElementById("netSalary").innerText = Number(d.net_salary).toFixed(2);

    document.getElementById("generatedDate").innerText =
      new Date().toLocaleDateString();

  } catch (err) {
    console.error("Payslip error:", err);
    alert("Server error loading payslip");
  }
}

/* ===============================
   EVENT LISTENER
================================ */
document.addEventListener("DOMContentLoaded", () => {
  loadMonths();

  const select = document.getElementById("monthSelect");

  if (select) {
    select.addEventListener("change", function () {
      loadPayslip(this.value);
    });
  }
});