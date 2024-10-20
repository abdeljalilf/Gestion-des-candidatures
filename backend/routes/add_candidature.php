<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

include '../db/db_connect.php';
// include '../Login/session_util.php'; // Inclusion de la vérification de session

// // Vérification de session
// $session = checkSession($conn);
// if (!$session) {
//     exit;
// }

$data = json_decode(file_get_contents("php://input"));

// Récupérer les données
$entrepriseId = $data->entreprise_id;
$nomNouvelleEntreprise = $data->nom_nouvelle_entreprise;
$adresse = $data->adresse; // Récupération de l'adresse
$contact = $data->contact; // Récupération du contact
$secteur = $data->secteur; // Récupération du secteur
$poste = $data->poste;
$dateDeCandidature = $data->date_de_candidature;
$statut = $data->statut;
$remarques = $data->remarques;  // Les remarques peuvent contenir du HTML
$rappel = $data->rappel;

// Vérifier si une nouvelle entreprise est à ajouter
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
        $insertQuery = "INSERT INTO entreprises (nom, adresse, contact, secteur) VALUES (?, ?, ?, ?)";
        $insertStmt = $conn->prepare($insertQuery);
        $insertStmt->bind_param("ssss", $nomNouvelleEntreprise, $adresse, $contact, $secteur); // Ajoutez les paramètres
        if ($insertStmt->execute()) {
            $entrepriseId = $insertStmt->insert_id; // Récupérer l'ID de la nouvelle entreprise
        } else {
            echo json_encode(['error' => 'Erreur lors de l\'ajout de l\'entreprise']);
            exit;
        }
    }
}


// Préparez votre requête d'insertion
$candidatureQuery = "INSERT INTO candidatures (entreprise_id, poste, date_de_candidature, statut, remarques" . ($rappel ? ", rappel" : "") . ") VALUES (?, ?, ?, ?, ?" . ($rappel ? ", ?" : "") . ")";

$candidatureStmt = $conn->prepare($candidatureQuery);
if ($rappel) {
    $candidatureStmt->bind_param("issss" . ($rappel ? "s" : ""), $entrepriseId, $poste, $dateDeCandidature, $statut, $remarques, $rappel);
} else {
    $candidatureStmt->bind_param("issss", $entrepriseId, $poste, $dateDeCandidature, $statut, $remarques);
}

if ($candidatureStmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['error' => 'Erreur lors de l\'ajout de la candidature']);
}

$stmt->close();
$conn->close();
?>
