<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

include '../db/db_connect.php';

$data = json_decode(file_get_contents("php://input"));

// Récupérer les données
$entrepriseId = $data->entreprise_id;
$nomNouvelleEntreprise = $data->nom_nouvelle_entreprise;
$poste = $data->poste;
$dateDeCandidature = $data->date_de_candidature;
$statut = $data->statut;
$remarques = $data->remarques;
$rappel = $data->rappel;

if (empty($entrepriseId) && !empty($nomNouvelleEntreprise)) {
    // Vérifier si l'entreprise existe déjà
    $query = "SELECT id FROM entreprises WHERE nom = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("s", $nomNouvelleEntreprise);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        // L'entreprise existe déjà
        $row = $result->fetch_assoc();
        $entrepriseId = $row['id'];
    } else {
        // Ajouter la nouvelle entreprise
        $insertQuery = "INSERT INTO entreprises (nom) VALUES (?)";
        $insertStmt = $conn->prepare($insertQuery);
        $insertStmt->bind_param("s", $nomNouvelleEntreprise);
        if ($insertStmt->execute()) {
            $entrepriseId = $insertStmt->insert_id; // Récupérer l'ID de la nouvelle entreprise
        } else {
            echo json_encode(['error' => 'Erreur lors de l\'ajout de l\'entreprise']);
            exit;
        }
    }
}

// Ajouter la candidature
$candidatureQuery = "INSERT INTO candidatures (entreprise_id, poste, date_de_candidature, statut, remarques, rappel) VALUES (?, ?, ?, ?, ?, ?)";
$candidatureStmt = $conn->prepare($candidatureQuery);
$candidatureStmt->bind_param("isssss", $entrepriseId, $poste, $dateDeCandidature, $statut, $remarques, $rappel);
if ($candidatureStmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['error' => 'Erreur lors de l\'ajout de la candidature']);
}

$stmt->close();
$conn->close();
?>
