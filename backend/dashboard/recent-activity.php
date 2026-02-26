<?php
session_start();
require "../config/db.php";
header("Content-Type: application/json");

if (!isset($_SESSION['admin'])) {
    http_response_code(401);
    echo json_encode([]);
    exit;
}

$activity = [];

/* Latest employee */
$emp = $conn->query("
  SELECT name, created_at
  FROM employees
  ORDER BY created_at DESC
  LIMIT 1
")->fetch_assoc();

if ($emp) {
  $activity[] = [
    "text" => "New employee added: " . $emp['name'],
    "time" => $emp['created_at']
  ];
}

/* Latest leave action */
$leave = $conn->query("
  SELECT status, created_at
  FROM leaves
  WHERE status IN ('approved','rejected')
  ORDER BY created_at DESC
  LIMIT 1
")->fetch_assoc();

if ($leave) {
  $activity[] = [
    "text" => "Leave request " . ucfirst($leave['status']),
    "time" => $leave['created_at']
  ];
}

/* Latest salary update */
$salary = $conn->query("
  SELECT e.name, s.total_salary, s.updated_at
  FROM salaries s
  JOIN employees e ON e.id = s.employee_id
  ORDER BY s.updated_at DESC
  LIMIT 1
")->fetch_assoc();

if ($salary) {
  $activity[] = [
    "text" => "Salary updated for " . $salary['name'],
    "time" => $salary['updated_at']
  ];
}


echo json_encode($activity);
