<?php
session_start();
include("../config/db.php");

header("Content-Type: application/json");

$sql = "
SELECT 
  s.employee_id,
  e.name AS employee_name,
  e.department,
  s.basic_salary,
  s.ot_hours,
  (s.ot_hours * 100) AS ot_payment,
  (s.basic_salary + (s.ot_hours * 100)) AS total_salary
FROM salaries s
JOIN employees e ON e.id = s.employee_id
ORDER BY e.name ASC
";

$result = $conn->query($sql);

echo json_encode($result->fetch_all(MYSQLI_ASSOC));
