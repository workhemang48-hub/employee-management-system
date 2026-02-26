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
$monthly_limit = 10;

/*
  - Calculates leave days using start_date & end_date
  - Counts ONLY Approved leaves
  - Works correctly per month
*/
$sql = "
    SELECT IFNULL(
        SUM(DATEDIFF(end_date, start_date) + 1),
        0
    ) AS used_leaves
    FROM leaves
    WHERE employee_id = ?
      AND status = 'Approved'
      AND start_date >= DATE_FORMAT(CURDATE(), '%Y-%m-01')
      AND start_date < DATE_ADD(DATE_FORMAT(CURDATE(), '%Y-%m-01'), INTERVAL 1 MONTH)
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $employee_id);
$stmt->execute();

$result = $stmt->get_result();
$row = $result->fetch_assoc();

$used = (int)$row['used_leaves'];
$remaining = max(0, $monthly_limit - $used);

echo json_encode([
    "success" => true,
    "monthly_limit" => $monthly_limit,
    "used_leaves" => $used,
    "remaining_leaves" => $remaining
]);

$stmt->close();
$conn->close();
exit;
