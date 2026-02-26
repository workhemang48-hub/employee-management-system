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


$result = $conn->query("SELECT * FROM employees ORDER BY id ASC");
echo json_encode($result->fetch_all(MYSQLI_ASSOC));
