<?php
session_start();
header("Content-Type: application/json");

if (isset($_SESSION['employee'])) {
    echo json_encode([
        "success" => true,
        "name" => $_SESSION['employee']['name'],
        "role" => "employee"
    ]);
    exit;
}

if (isset($_SESSION['admin'])) {
    echo json_encode([
        "success" => true,
        "name" => $_SESSION['admin']['name'],
        "role" => "admin"
    ]);
    exit;
}

echo json_encode(["success" => false]);
