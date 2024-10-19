<?php
// session_check.php
session_start();
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Ajoutez cette ligne
header("Access-Control-Allow-Methods: GET, POST"); // Assurez-vous d'ajouter les méthodes que vous utilisez

require_once '../db/db_connect.php';

$headers = getallheaders();
$session_id = isset($headers['Authorization']) ? $headers['Authorization'] : '';

if ($session_id) {
    $sql = "SELECT * FROM sessions WHERE session_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('s', $session_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 1) {
        // Session active
        echo json_encode(['logged_in' => true]);
    } else {
        // Session inactive
        echo json_encode(['logged_in' => false]);
    }
} else {
    echo json_encode(['logged_in' => false]);
}

?>
