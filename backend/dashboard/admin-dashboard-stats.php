<?php
session_start();
header("Content-Type: application/json");
require "../config/db.php";

if (!isset($_SESSION['admin'])) {
    echo json_encode(["success" => false]);
    exit;
}

$totalEmployees = $conn->query("SELECT COUNT(*) FROM employees")->fetch_row()[0];
$pendingLeaves = $conn->query("SELECT COUNT(*) FROM leaves WHERE status='pending'")->fetch_row()[0];

echo json_encode([
    "success" => true,
    "totalEmployees" => $totalEmployees,
    "pendingLeaves" => $pendingLeaves
]);
