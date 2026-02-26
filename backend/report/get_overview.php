<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Content-Type: application/json");

require_once __DIR__ . '/../config/db.php';

$selectedMonth = $_GET['month'] ?? date('Y-m');

$year = date('Y', strtotime($selectedMonth));
$month = date('m', strtotime($selectedMonth));

$overview = [];

// ===============================
// TOTAL EMPLOYEES
// ===============================
$emp = $conn->query("SELECT COUNT(*) as total FROM employees");
$overview['totalEmployees'] = $emp->fetch_assoc()['total'] ?? 0;


// ===============================
// TOTAL DEPARTMENTS
// ===============================
$dept = $conn->query("SELECT COUNT(*) as total FROM departments");
$overview['totalDepartments'] = $dept->fetch_assoc()['total'] ?? 0;


// ===============================
// TOTAL LEAVES
// ===============================
$leave = $conn->query("SELECT COUNT(*) as total FROM leaves");
$overview['totalLeaves'] = $leave->fetch_assoc()['total'] ?? 0;


// ===============================
// MONTHLY SALARY PAYOUT
// ===============================
$salaryRes = $conn->query("
SELECT IFNULL(SUM(total_salary),0) AS total
FROM salaries
WHERE status IN ('Updated','Paid')
AND MONTH(salary_month) = $month
AND YEAR(salary_month) = $year
");
$overview['monthlyPayout'] = $salaryRes->fetch_assoc()['total'] ?? 0;

// ===============================
echo json_encode([
 "success" => true,
 "data" => $overview
]);
