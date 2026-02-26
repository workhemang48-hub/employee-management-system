<?php
session_start();
include("../config/db.php");

header("Content-Type: application/json");

if (!isset($_SESSION['admin'])) {
    http_response_code(403);
    echo json_encode([
        "success" => false,
        "message" => "Admin not logged in"
    ]);
    exit;
}


$result = $conn->query("
  SELECT 
    leaves.id,
    employees.name,
    leaves.leave_type,
    leaves.start_date,
    leaves.end_date,
    leaves.reason,
    leaves.status,
    leaves.created_at
  FROM leaves
  JOIN employees ON leaves.employee_id = employees.id
  ORDER BY leaves.id DESC
");

echo json_encode($result->fetch_all(MYSQLI_ASSOC));
?>
