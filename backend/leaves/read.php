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


$sql = "
SELECT 
    l.id,
    e.name AS employee_name,
    l.leave_type,
    l.start_date,
    l.end_date,
    l.reason,
    l.status
FROM leaves l
JOIN employees e ON l.employee_id = e.id
ORDER BY l.id DESC
";

$result = $conn->query($sql);

echo json_encode($result->fetch_all(MYSQLI_ASSOC));
?>
