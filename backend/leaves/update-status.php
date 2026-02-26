<?php
session_start();
include("../config/db.php");

header("Content-Type: application/json");

/* AUTH CHECK */
if (!isset($_SESSION['admin'])) {
    http_response_code(403);
    echo json_encode([
        "success" => false,
        "message" => "Admin not logged in"
    ]);
    exit;
}


/* READ JSON */
$data = json_decode(file_get_contents("php://input"), true);

$id     = $data['id'] ?? null;
$status = $data['status'] ?? null;

/* VALIDATE */
if (!$id || !in_array($status, ['approved', 'rejected'])) {
    echo json_encode(["success" => false, "message" => "Invalid data"]);
    exit;
}

/* UPDATE */
$stmt = $conn->prepare("
    UPDATE leaves 
    SET status = ? 
    WHERE id = ?
");

$stmt->bind_param("si", $status, $id);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "message" => "DB error"]);
}
