<?php
session_start();
include("../config/db.php");

header("Content-Type: application/json");

if (!isset($_SESSION['employee'])) {
    http_response_code(403);
    echo json_encode([
        "success" => false,
        "message" => "Employee not logged in"
    ]);
    exit;
}

/* ✅ USE SAME SESSION KEY */
$employee_id = $_SESSION['employee']['id'];

$stmt = $conn->prepare("
    SELECT leave_type, start_date, end_date, reason, status, created_at
    FROM leaves
    WHERE employee_id = ?
    ORDER BY id DESC
");
$stmt->bind_param("i", $employee_id);
$stmt->execute();

$result = $stmt->get_result();
echo json_encode($result->fetch_all(MYSQLI_ASSOC));
