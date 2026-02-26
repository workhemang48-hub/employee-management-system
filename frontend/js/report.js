
// ===============================
// MONTH INPUT SETUP
// ===============================

const monthInput = document.getElementById("reportMonth");

const today = new Date();
const currentMonth =
  today.getFullYear() + "-" +
  String(today.getMonth() + 1).padStart(2, '0');

monthInput.value = currentMonth;


// ===============================
// LOAD OVERVIEW (CARDS)
// ===============================

function loadOverview() {

fetch(`/ems/backend/report/get_overview.php?month=${monthInput.value}`)
.then(response => response.json())
.then(res => {

console.log("Overview API:", res);

if (!res.success) return;

const data = res.data;

// Total Employees
const emp = document.getElementById("totalEmployees");
if(emp) emp.innerText = data.totalEmployees;

// Departments
const dept = document.getElementById("totalDepartments");
if(dept) dept.innerText = data.totalDepartments;

// Leaves
const leaves = document.getElementById("totalLeaves");
if(leaves) leaves.innerText = data.totalLeaves;

// Monthly Salary
const payoutEl = document.getElementById("monthlyPayout");
if (payoutEl) {
const amount = Number(data.monthlyPayout || 0);
payoutEl.innerText = "₹ " + amount.toLocaleString("en-IN");
}

})
.catch(err => console.log("Overview Error:", err));
}



// ===============================
// LOAD DEPARTMENT CHART
// ===============================

let deptChart;

function loadDeptChart(){

fetch("/ems/backend/report/get_department_distribution.php")
.then(res => res.json())
.then(data => {

const ctx = document.getElementById('deptChart');

if(deptChart){
deptChart.destroy();
}

// =====================
// Chart
// =====================
deptChart = new Chart(ctx, {
type: 'bar',
data: {
labels: data.labels,
datasets: [{
label: "Employees",
data: data.values
}]
}
});

// =====================
// Table
// =====================
const tableBody = document.getElementById("departmentTableBody");
tableBody.innerHTML = "";

data.labels.forEach((dept, index) => {
  tableBody.innerHTML += `
    <tr class="border-b hover:bg-slate-50">
      <td class="px-4 py-2">${dept}</td>
      <td class="px-4 py-2 font-medium">${data.values[index]}</td>
    </tr>
  `;
});

})
.catch(err => console.error("Dept Chart Error:", err));
}
// ===============================
// LOAD SALARY TREND CHART
// ===============================

let salaryTrendChart;

function loadSalaryTrendChart(){

fetch(`/ems/backend/report/get_monthly_salary_trend.php?month=${monthInput.value}`)
.then(res => res.json())
.then(data => {

const ctx = document.getElementById('salaryTrendChart');

if(salaryTrendChart){
salaryTrendChart.destroy();
}

salaryTrendChart = new Chart(ctx, {
type: 'line',
data: {
labels: data.labels,
datasets: [{
label: "Monthly Salary Payout",
data: data.values,
tension: 0.4,
fill: true,
pointRadius: 5,
borderWidth: 3
}]
},
options:{
responsive:true,
plugins:{
legend:{display:true}
},
scales:{
y:{
beginAtZero:true
}
}
}
});

})
.catch(err => console.error("Salary Trend Error:", err));
}

let leaveChart;

function loadLeaveChart(){

fetch(`/ems/backend/report/get_leave_summary.php?month=${monthInput.value}`)
.then(res => res.json())
.then(res => {

const ctx = document.getElementById("leaveChart");

if(leaveChart){
leaveChart.destroy();
}

let approved = 0;
let rejected = 0;
let pending = 0;

if(res.success && res.data){
approved = Number(res.data.approved || 0);
rejected = Number(res.data.rejected || 0);
pending = Number(res.data.pending || 0);
}

// 🔥 CHECK IF TOTAL IS ZERO
const total = approved + rejected + pending;

if(total === 0){

leaveChart = new Chart(ctx, {
type: "doughnut",
data: {
labels: ["No Data"],
datasets: [{
data: [1]  // fake value
}]
},
options:{
responsive:true,
maintainAspectRatio:false,
plugins:{
legend:{ display:false }
}
}
});

return;
}

leaveChart = new Chart(ctx, {
type: "doughnut",
data: {
labels: ["Approved", "Rejected", "Pending"],
datasets: [{
data: [approved, rejected, pending]
}]
},
options:{
responsive:true,
maintainAspectRatio:false,
plugins:{
legend:{ position:"bottom" }
}
}
});

})
.catch(err => console.error("Leave Chart Error:", err));

}
// ===============================
// LOAD SALARY SUMMARY
// ===============================

function loadSalarySummary(){

fetch(`/ems/backend/report/get_salary_summary.php?month=${monthInput.value}`)
.then(res => res.json())
.then(res => {

if(!res.success) return;

const data = res.data;

// ===============================
// Total Salary
// ===============================
const totalSalaryEl = document.getElementById("summaryTotalSalary");
if(totalSalaryEl){
  const amount = Number(data.total_salary || 0);
  totalSalaryEl.innerText = "₹ " + amount.toLocaleString("en-IN");
}

// ===============================
// Overtime
// ===============================
const overtimeEl = document.getElementById("summaryOvertime");
if(overtimeEl){
  const overtime = Number(data.total_overtime || 0);
  overtimeEl.innerText = "₹ " + overtime.toLocaleString("en-IN");
}

// ===============================
// Highest Paid
// ===============================
const highestEl = document.getElementById("summaryHighestPaid");
if(highestEl){
  if(data.highest_paid){
    highestEl.innerText =
      data.highest_paid +
      " (₹ " +
      Number(data.highest_salary || 0).toLocaleString("en-IN") +
      ")";
  } else {
    highestEl.innerText = "N/A";
  }
}

// ===============================
// Salary Growth %
// ===============================
const growthEl = document.getElementById("salaryGrowthPercent");

if(growthEl){

  const growth = Number(data.salaryGrowth || 0);

  if(growth > 0){
    growthEl.innerText = `↑ ${growth}% Increase`;
    growthEl.className = "text-green-600 text-lg font-semibold";
  }
  else if(growth < 0){
    growthEl.innerText = `↓ ${Math.abs(growth)}% Decrease`;
    growthEl.className = "text-red-600 text-lg font-semibold";
  }
  else{
    growthEl.innerText = "No Change";
    growthEl.className = "text-slate-500 text-lg font-semibold";
  }
}

})
.catch(err => console.error("Salary Summary Error:", err));

}
// ===============================
// MONTH CHANGE LISTENER
// ===============================

monthInput.addEventListener("change", function () {
loadOverview();
loadSalaryTrendChart();
loadLeaveChart();
loadSalarySummary(); 
});



// ===============================
// INITIAL LOAD
// ===============================

loadOverview();
loadDeptChart();
loadSalaryTrendChart();
loadLeaveChart(); 
loadSalarySummary();
function showTab(type, element) {

  const overview = document.getElementById("overviewCards");
  const mainCharts = document.getElementById("mainCharts");
  const bottomReports = document.getElementById("bottomReports");

  const departmentChart = document.getElementById("departmentChartCard");
  const departmentSummary = document.getElementById("departmentSummaryCard");
  const salaryTrend = document.getElementById("salaryTrendCard");
  const salarySummary = document.getElementById("salarySummaryCard");
  const leaveCard = document.getElementById("leaveCard");

  // Hide everything first
  overview.classList.add("hidden");
  departmentChart.classList.add("hidden");
  departmentSummary.classList.add("hidden");
  salaryTrend.classList.add("hidden");
  salarySummary.classList.add("hidden");
  leaveCard.classList.add("hidden");

  // Overview → show everything
  if (type === "overview") {
    overview.classList.remove("hidden");
    departmentChart.classList.remove("hidden");
    departmentSummary.classList.remove("hidden");
    salaryTrend.classList.remove("hidden");
    salarySummary.classList.remove("hidden");
    leaveCard.classList.remove("hidden");
  }

  // Salary Reports
  if (type === "salary") {
    salaryTrend.classList.remove("hidden");
    salarySummary.classList.remove("hidden");
  }

  // Leave Reports
  if (type === "leave") {
    leaveCard.classList.remove("hidden");
  }

  // Department Reports
  if (type === "department") {
    departmentChart.classList.remove("hidden");
    departmentSummary.classList.remove("hidden");
  }

  // Tab Styling
  document.querySelectorAll(".report-tab").forEach(tab => {
    tab.classList.remove("text-primary", "border-b-2", "border-primary", "font-medium");
    tab.classList.add("text-slate-500");
  });

  element.classList.remove("text-slate-500");
  element.classList.add("text-primary", "border-b-2", "border-primary", "font-medium");
}