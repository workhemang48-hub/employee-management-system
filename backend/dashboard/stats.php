<?php
session_start();
require "../config/db.php";
header("Content-Type: application/json");

if (!isset($_SESSION['admin'])) {
    http_response_code(401);
    echo json_encode(["authorized" => false]);
    exit;
}

/* Total Employees */
$empRes = $conn->query("SELECT COUNT(*) AS total FROM employees");
$employees = $empRes->fetch_assoc()['total'];

/* Pending Leaves */
$leaveRes = $conn->query("SELECT COUNT(*) AS total FROM leaves WHERE status = 'pending'");
$pendingLeaves = $leaveRes->fetch_assoc()['total'];

/* Monthly Salary Payout */
$salaryRes = $conn->query("
    SELECT IFNULL(SUM(total_salary), 0) AS total
    FROM salaries
    WHERE status IN ('updated', 'paid')
      AND MONTH(created_at) = MONTH(CURRENT_DATE())
      AND YEAR(created_at) = YEAR(CURRENT_DATE())
");
$monthlyPayout = $salaryRes->fetch_assoc()['total'];

echo json_encode([
    "authorized" => true,
    "totalEmployees" => $employees,
    "pendingLeaves" => $pendingLeaves,
    "monthlyPayout" => $monthlyPayout
]);
