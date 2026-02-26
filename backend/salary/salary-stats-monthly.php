<?php
require_once "../config/db.php";

$sql = "
  SELECT 
    DATE_FORMAT(created_at, '%b %Y') AS month,
    SUM(basic_salary + (ot_hours * 100)) AS total
  FROM salaries
  GROUP BY month
  ORDER BY MIN(created_at)
";

$result = $conn->query($sql);

$data = [];
while ($row = $result->fetch_assoc()) {
  $data[] = $row;
}

echo json_encode($data);
