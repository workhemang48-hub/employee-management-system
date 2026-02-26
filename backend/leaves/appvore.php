<?php
session_start();
include("../config/db.php");

header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

$id = $data["id"];
$status = $data["status"];

$conn->query("UPDATE leaves SET status='$status' WHERE id=$id");

echo json_encode(["success" => true]);
?>
