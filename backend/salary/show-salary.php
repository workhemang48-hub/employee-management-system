<?php
session_start();
header("Content-Type: application/json");

if (!isset($_SESSION['employee'])) {
    http_response_code(401);
    echo json_encode([
        "success" => false,
        "error" => "Not logged in"
    ]);
    exit;
}

require_once "../config/db.php";

$employee_id = $_SESSION['employee']['id'];

/*
  Get LATEST salary record updated by admin
*/
$sql = "
    SELECT 
        basic_salary,
        ot_hours,
        ot_rate,
        ot_payment,
        total_salary,
        status,
        created_at
    FROM salaries
    WHERE employee_id = ?
    ORDER BY created_at DESC
    LIMIT 1
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $employee_id);
$stmt->execute();

$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode([
        "success" => true,
        "has_salary" => false
    ]);
    exit;
}

$row = $result->fetch_assoc();

echo json_encode([
    "success" => true,
    "has_salary" => true,
    "basic_salary" => (float)$row['basic_salary'],
    "ot_hours" => (int)$row['ot_hours'],
    "ot_rate" => (float)$row['ot_rate'],
    "ot_payment" => (float)$row['ot_payment'],
    "total_salary" => (float)$row['total_salary'],
    "status" => $row['status'],
    "last_updated" => date("d M Y", strtotime($row['created_at']))
]);

$stmt->close();
$conn->close();
exit;
