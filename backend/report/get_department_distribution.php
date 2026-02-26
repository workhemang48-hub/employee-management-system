<?php

header("Content-Type: application/json");
require "../config/db.php";

$query = $conn->query("
SELECT d.name AS department,
COUNT(e.id) AS total
FROM departments d
LEFT JOIN employees e
ON e.department_id = d.id
GROUP BY d.name
");

$labels = [];
$values = [];

while($row = $query->fetch_assoc()){
    $labels[] = $row['department'];
    $values[] = $row['total'];
}

echo json_encode([
    "success" => true,
    "labels" => $labels,
    "values" => $values
]);
