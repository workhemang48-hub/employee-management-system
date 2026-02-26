<?php
session_start();
header("Content-Type: application/json");

if (!isset($_SESSION["employee"])) {
    echo json_encode([
        "success" => false,
        "message" => "Unauthorized"
    ]);
    exit;
}

echo json_encode([
    "success" => true,
    "user" => $_SESSION["employee"]
]);
?>
