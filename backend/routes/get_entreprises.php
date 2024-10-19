<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
include '../db/db_connect.php';

$query = "SELECT * FROM entreprises";
$result = $conn->query($query);

$entreprises = array();
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $entreprises[] = $row;
    }
}

echo json_encode($entreprises);
$conn->close();
?>
