<?php
require_once "../config/db.php";
header("Content-Type: application/json");

$OT_RATE = 100;

$sql = "
  SELECT 
    e.name,
    (s.basic_salary + (s.ot_hours * $OT_RATE)) AS total_salary
  FROM salaries s
  JOIN employees e ON e.id = s.employee_id
";

$result = mysqli_query($conn, $sql);

$data = [];

while ($row = mysqli_fetch_assoc($result)) {
  $data[] = [
    "name" => $row["name"],
    "total_salary" => (int)$row["total_salary"]
  ];
}

echo json_encode($data);
