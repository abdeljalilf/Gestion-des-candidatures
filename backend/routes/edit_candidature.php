<?php
// edit_candidature.php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // Handle preflight request
    exit(0);
}

include '../db/db_connect.php'; // Assurez-vous que ce fichier contient votre connexion à la base de données.

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $data = json_decode(file_get_contents("php://input"));
    
    // Récupération des données de la candidature à mettre à jour
    $id = $data->id;
    $entreprise = $data->entreprise;
    $poste = $data->poste;
    $date_de_candidature = $data->date_de_candidature;
    $statut = $data->statut;
    $remarques = $data->remarques;
    $rappel = $data->rappel;

    // Requête pour mettre à jour la candidature
    $query = "UPDATE candidatures SET entreprise = ?, poste = ?, date_de_candidature = ?, statut = ?, remarques = ?, rappel = ? WHERE id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("ssssssi", $entreprise, $poste, $date_de_candidature, $statut, $remarques, $rappel, $id);

    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['error' => 'Erreur lors de la mise à jour de la candidature.']);
    }

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(['error' => 'Méthode non autorisée.']);
}
?>
