<?php
$conn = new mysqli("localhost", "root", "", "ems");

if ($conn->connect_error) {
    die("DB Connection Failed");
}
?>
