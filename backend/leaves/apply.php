<?php
session_start();
include("../config/db.php");

header("Content-Type: application/json");

/* ✅ Disable warnings in output */
error_reporting(0);
ini_set("display_errors", 0);

/* ✅ AUTH CHECK */
if (!isset($_SESSION['employee'])) {
    http_response_code(403);
    echo json_encode([
        "success" => false,
        "message" => "Employee not logged in"
    ]);
    exit;
}


$employee_id = $_SESSION["employee"]["id"];

/* ✅ Read JSON */
$data = json_decode(file_get_contents("php://input"), true);

$leave_type = trim($data["leave_type"] ?? "");
$start_date = trim($data["start_date"] ?? "");
$end_date   = trim($data["end_date"] ?? "");
$reason     = trim($data["reason"] ?? "");

/* ✅ Validate */
if ($leave_type === "" || $start_date === "" || $end_date === "" || $reason === "") {
    echo json_encode(["success" => false, "message" => "Missing fields"]);
    exit;
}

/* ✅ Insert */
$stmt = $conn->prepare("
    INSERT INTO leaves (employee_id, leave_type, start_date, end_date, reason, status)
    VALUES (?, ?, ?, ?, ?, 'pending')
");

$stmt->bind_param("issss", $employee_id, $leave_type, $start_date, $end_date, $reason);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Leave applied successfully"]);
} else {
    echo json_encode(["success" => false, "message" => "DB Error"]);
}
?>
