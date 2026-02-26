<?php
include '../config/db.php';

header('Content-Type: application/json');

if(!isset($_GET['month'])){
    echo json_encode(["success"=>false]);
    exit;
}

$selectedMonth = $_GET['month'];

/* ===============================
   CURRENT MONTH SUMMARY
================================ */
$query = "
SELECT 
    SUM(total_salary) AS total_salary,
    SUM(ot_payment) AS total_overtime
FROM salaries
WHERE DATE_FORMAT(salary_month, '%Y-%m') = ?
";

$stmt = $conn->prepare($query);
$stmt->bind_param("s", $selectedMonth);
$stmt->execute();
$result = $stmt->get_result();
$data = $result->fetch_assoc();

$currentTotal = $data['total_salary'] ?? 0;


/* ===============================
   PREVIOUS MONTH CALCULATION
================================ */
$prevMonth = date("Y-m", strtotime($selectedMonth . "-01 -1 month"));

$prevQuery = "
SELECT SUM(total_salary) AS total_salary
FROM salaries
WHERE DATE_FORMAT(salary_month, '%Y-%m') = ?
";

$stmtPrev = $conn->prepare($prevQuery);
$stmtPrev->bind_param("s", $prevMonth);
$stmtPrev->execute();
$prevResult = $stmtPrev->get_result();
$prevData = $prevResult->fetch_assoc();

$prevTotal = $prevData['total_salary'] ?? 0;


/* ===============================
   GROWTH CALCULATION
================================ */
$growth = 0;

if($prevTotal > 0){
    $growth = (($currentTotal - $prevTotal) / $prevTotal) * 100;
}


/* ===============================
   HIGHEST PAID EMPLOYEE
================================ */
$highestQuery = "
SELECT e.name, s.total_salary
FROM salaries s
JOIN employees e ON s.employee_id = e.id
WHERE DATE_FORMAT(s.salary_month, '%Y-%m') = ?
ORDER BY s.total_salary DESC
LIMIT 1
";

$stmt2 = $conn->prepare($highestQuery);
$stmt2->bind_param("s", $selectedMonth);
$stmt2->execute();
$result2 = $stmt2->get_result();
$highestData = $result2->fetch_assoc();


echo json_encode([
    "success" => true,
    "data" => [
        "total_salary" => $currentTotal,
        "total_overtime" => $data['total_overtime'] ?? 0,
        "highest_paid" => $highestData['name'] ?? null,
        "highest_salary" => $highestData['total_salary'] ?? 0,
        "salaryGrowth" => round($growth, 1)
    ]
]);