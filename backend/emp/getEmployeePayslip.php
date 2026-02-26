<?php
session_start();
header("Content-Type: application/json");

if (!isset($_SESSION['employee'])) {
    http_response_code(401);
    echo json_encode(["success" => false]);
    exit;
}

require_once "../config/db.php";

$employee_id = $_SESSION['employee']['id'];
$month = $_GET['month'] ?? null;

if ($month) {
    $sql = "
    SELECT e.name, e.department, e.designation,
           s.salary_month, s.basic_salary,
           s.ot_payment, s.total_salary
    FROM employees e
    JOIN salaries s ON e.id = s.employee_id
    WHERE e.id = ? AND s.salary_month = ?
    ";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("is", $employee_id, $month);
} else {
    $sql = "
    SELECT e.name, e.department, e.designation,
           s.salary_month, s.basic_salary,
           s.ot_payment, s.total_salary
    FROM employees e
    JOIN salaries s ON e.id = s.employee_id
    WHERE e.id = ?
    ORDER BY s.salary_month DESC
    LIMIT 1
    ";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $employee_id);
}

$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(["success" => false, "message" => "No salary record"]);
    exit;
}

$data = $result->fetch_assoc();

$tax = $data['total_salary'] * 0.10;
$insurance = $data['total_salary'] * 0.05;
$net_salary = $data['total_salary'] - ($tax + $insurance);

echo json_encode([
    "success" => true,
    "data" => [
        "name" => $data['name'],
        "department" => $data['department'],
        "designation" => $data['designation'],
        "salary_month" => $data['salary_month'],
        "basic_salary" => $data['basic_salary'],
        "ot_payment" => $data['ot_payment'],
        "tax" => $tax,
        "insurance" => $insurance,
        "net_salary" => $net_salary
    ]
]);