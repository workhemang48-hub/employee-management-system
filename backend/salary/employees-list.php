<?php
session_start();
include("../config/db.php");

header("Content-Type: application/json");

$result = $conn->query("
  SELECT id, name, department 
  FROM employees 
  ORDER BY name ASC
");

echo json_encode($result->fetch_all(MYSQLI_ASSOC));
