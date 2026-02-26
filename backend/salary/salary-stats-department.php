<?php
require_once "../config/db.php";

$sql = "
  SELECT 
    e.department,
    SUM(s.basic_salary + (s.ot_hours * 100)) AS total
  FROM salaries s
  JOIN employees e ON e.id = s.employee_id
  GROUP BY e.department
";

$result = $conn->query($sql);

$data = [];
while ($row = $result->fetch_assoc()) {
  $data[] = $row;
}

echo json_encode($data);
