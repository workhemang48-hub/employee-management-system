<?php
session_start();
include("../config/db.php");

header("Content-Type: application/json");

if (!isset($_SESSION['admin'])) {
    http_response_code(403);
    echo json_encode([
        "success" => false,
        "message" => "Admin not logged in"
    ]);
    exit;
}


$data = json_decode(file_get_contents("php://input"), true);

$id = $data['id'] ?? null;
$name = $data['name'] ?? null;
$email = $data['email'] ?? null;
$department = $data['department'] ?? null;
$designation = $data['designation'] ?? null;
$phone = $data['phone'] ?? null;
$join_date = $data['join_date'] ?? null;

$stmt = $conn->prepare(
  "UPDATE employees SET
    name = ?,
    email = ?,
    department = ?,
    designation = ?,
    phone = ?,
    join_date = ?
   WHERE id = ?"
);

$stmt->bind_param(
  "ssssssi",
  $name,
  $email,
  $department,
  $designation,
  $phone,
  $join_date,
  $id
);

$stmt->execute();

echo json_encode(["success" => true]);
