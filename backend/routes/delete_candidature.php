<?php
// delete_candidature.php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // Handle preflight request
    exit(0);
}

include '../db/db_connect.php'; // Assurez-vous que ce fichier contient votre connexion à la base de données.

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $data = json_decode(file_get_contents("php://input"));
    $id = $data->id;

    // Requête pour supprimer la candidature
    $query = "DELETE FROM candidatures WHERE id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['error' => 'Erreur lors de la suppression de la candidature.']);
    }

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(['error' => 'Méthode non autorisée.']);
}
?>
