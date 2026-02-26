<?php
session_start();
header("Content-Type: application/json");

/* ===============================
   CHECK ADMIN SESSION FIRST
================================ */
if (isset($_SESSION["admin"])) {
    echo json_encode([
        "authorized" => true,
        "role" => "admin",
        "name" => $_SESSION["admin"]["name"]
    ]);
    exit;
}

/* ===============================
   CHECK EMPLOYEE SESSION SECOND
================================ */
if (isset($_SESSION["employee"])) {
    echo json_encode([
        "authorized" => true,
        "role" => "employee",
        "name" => $_SESSION["employee"]["name"]
    ]);
    exit;
}

/* ===============================
   NOT LOGGED IN
================================ */
echo json_encode([
    "authorized" => false
]);
exit;
?>
