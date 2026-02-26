<?php
session_start();
include("../config/db.php");

// admin check
if (!isset($_SESSION['admin'])) {
    http_response_code(403);
    echo json_encode([
        "success" => false,
        "message" => "Admin not logged in"
    ]);
    exit;
}


$data = json_decode(file_get_contents("php://input"), true);

$name        = $data['name'];
$email       = $data['email'];
$department  = $data['department'];
$designation = $data['designation'];
$phone       = $data['phone'];
$join_date   = $data['join_date'];

$defaultPassword = "emp@123"; //  auto password
$role   = "employee";
$status = "active";

$stmt = $conn->prepare("
    INSERT INTO employees 
    (name, email, department, designation, phone, join_date, password, role, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
");

$stmt->bind_param(
    "sssssssss",
    $name,
    $email,
    $department,
    $designation,
    $phone,
    $join_date,
    $defaultPassword,
    $role,
    $status
);

$stmt->execute();

echo json_encode([
    "success" => true,
    "defaultPassword" => $defaultPassword
]);
