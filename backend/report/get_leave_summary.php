<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Content-Type: application/json");

require_once __DIR__ . '/../config/db.php';

$selectedMonth = $_GET['month'] ?? date('Y-m');

$year = date('Y', strtotime($selectedMonth));
$month = date('m', strtotime($selectedMonth));

$data = [];

// Total Approved
$approved = $conn->query("
SELECT COUNT(*) as total 
FROM leaves
WHERE status = 'Approved'
AND MONTH(created_at) = $month
AND YEAR(created_at) = $year
");

$data['approved'] = $approved->fetch_assoc()['total'] ?? 0;


// Total Rejected
$rejected = $conn->query("
SELECT COUNT(*) as total 
FROM leaves
WHERE status = 'Rejected'
AND MONTH(created_at) = $month
AND YEAR(created_at) = $year
");

$data['rejected'] = $rejected->fetch_assoc()['total'] ?? 0;


// Total Pending
$pending = $conn->query("
SELECT COUNT(*) as total 
FROM leaves
WHERE status = 'Pending'
AND MONTH(created_at) = $month
AND YEAR(created_at) = $year
");

$data['pending'] = $pending->fetch_assoc()['total'] ?? 0;

echo json_encode([
    "success" => true,
    "data" => $data
]);