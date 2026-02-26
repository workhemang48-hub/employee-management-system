<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Content-Type: application/json");

require_once __DIR__ . '/../config/db.php';

$labels = [];
$values = [];

$query = "
SELECT 
DATE_FORMAT(s.salary_month,'%b') AS month,
SUM(s.total_salary) AS total
FROM salaries s
INNER JOIN (
    SELECT employee_id, salary_month, MAX(updated_at) AS latest_update
    FROM salaries
    WHERE salary_month IS NOT NULL
    GROUP BY employee_id, salary_month
) latest
ON s.employee_id = latest.employee_id
AND s.salary_month = latest.salary_month
AND s.updated_at = latest.latest_update
WHERE s.salary_month IS NOT NULL
GROUP BY s.salary_month
ORDER BY s.salary_month ASC
";

$result = $conn->query($query);

if(!$result){
    echo json_encode(["error"=>$conn->error]);
    exit;
}

while($row = $result->fetch_assoc()){
    $labels[] = $row['month'];
    $values[] = (float)$row['total'];
}

echo json_encode([
    "labels"=>$labels,
    "values"=>$values
]);
