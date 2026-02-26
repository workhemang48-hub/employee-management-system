<?php
session_start();
include("../config/db.php");

header("Content-Type: application/json");

// Clear old session completely (🔥 IMPORTANT)
session_unset();

// Read JSON
$data = json_decode(file_get_contents("php://input"), true);
$username = $data['username'] ?? '';
$password = $data['password'] ?? '';

// Fetch user
$stmt = $conn->prepare("SELECT * FROM employees WHERE email = ? AND password = ?");
$stmt->bind_param("ss", $username, $password);
$stmt->execute();

$user = $stmt->get_result()->fetch_assoc();

if (!$user) {
    echo json_encode([
        "success" => false,
        "message" => "Invalid credentials"
    ]);
    exit;
}

/* ✅ ROLE-BASED SESSION */
if ($user['role'] === 'admin') {
    $_SESSION['admin'] = [
        "id" => $user['id'],
        "name" => $user['name'],
        "email" => $user['email'],
        "role" => "admin"
    ];
} else {
    $_SESSION['employee'] = [
        "id" => $user['id'],
        "name" => $user['name'],
        "email" => $user['email'],
        "role" => "employee"
    ];
}

echo json_encode([
    "success" => true,
    "role" => $user['role']
]);
