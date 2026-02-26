<?php
session_start();
header("Content-Type: application/json");
include("../config/db.php");

if (!isset($_SESSION['admin'])) {
    http_response_code(403);
    echo json_encode([
        "success" => false,
        "message" => "Admin not logged in"
    ]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode(["success" => false, "message" => "Invalid JSON"]);
    exit;
}

$employee_id = $data['employee_id'];
$basic_salary = $data['basic_salary'];
$ot_hours = $data['ot_hours'];

$ot_rate = 100; // keep fixed for now
$ot_payment = $ot_hours * $ot_rate;
$total_salary = $basic_salary + $ot_payment;

/*
---------------------------------------------------
STEP 1: Check if salary already exists
---------------------------------------------------
*/

$check = $conn->prepare("SELECT id, status FROM salaries WHERE employee_id = ?");
$check->bind_param("i", $employee_id);
$check->execute();
$result = $check->get_result();

if ($row = $result->fetch_assoc()) {

    // 🔴 If already Paid, block editing
    if ($row['status'] === "Paid") {
        echo json_encode([
            "success" => false,
            "message" => "Paid salary cannot be edited"
        ]);
        exit;
    }

    /*
    ---------------------------------------------------
    STEP 2: Update existing salary (DO NOT touch status)
    ---------------------------------------------------
    */

    $update = $conn->prepare("
        UPDATE salaries
        SET basic_salary = ?,
            ot_hours = ?,
            ot_payment = ?,
            total_salary = ?
        WHERE employee_id = ?
    ");

    $update->bind_param(
        "iiiii",
        $basic_salary,
        $ot_hours,
        $ot_payment,
        $total_salary,
        $employee_id
    );

    $update->execute();

} else {

    /*
    ---------------------------------------------------
    STEP 3: Insert new salary (status = Draft)
    ---------------------------------------------------
    */

    $insert = $conn->prepare("
        INSERT INTO salaries 
        (employee_id, basic_salary, ot_hours, ot_payment, total_salary, status)
        VALUES (?, ?, ?, ?, ?, 'Draft')
    ");

    $insert->bind_param(
        "iiiii",
        $employee_id,
        $basic_salary,
        $ot_hours,
        $ot_payment,
        $total_salary
    );

    $insert->execute();
}

echo json_encode(["success" => true]);