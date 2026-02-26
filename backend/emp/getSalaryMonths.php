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

$sql = "
SELECT salary_month 
FROM salaries
WHERE employee_id = ?
ORDER BY salary_month DESC
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $employee_id);
$stmt->execute();
$result = $stmt->get_result();

$months = [];

while ($row = $result->fetch_assoc()) {
    $months[] = $row['salary_month'];
}

echo json_encode([
    "success" => true,
    "months" => $months
]);