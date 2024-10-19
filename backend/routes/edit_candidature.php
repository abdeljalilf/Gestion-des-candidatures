<?php
// edit_candidature.php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0); // Handle preflight request
}

include '../db/db_connect.php'; // Connexion à la base de données

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $data = json_decode(file_get_contents("php://input"));

    // Récupération des données pour la mise à jour de la candidature
    $idCandidature = $data->id; // ID de la candidature à mettre à jour
    $nomEntreprise = $data->entreprise_nom; // Nom de l'entreprise
    $adresseEntreprise = $data->adresse; // Adresse de l'entreprise
    $contactEntreprise = $data->contact; // Contact de l'entreprise
    $secteurEntreprise = $data->secteur; // Secteur de l'entreprise
    $poste = $data->poste;
    $dateDeCandidature = $data->date_de_candidature;
    $statut = $data->statut;
    $remarques = $data->remarques;
    $rappel = $data->rappel;

    // Vérifier si l'entreprise existe déjà
    $queryCheckEntreprise = "SELECT id FROM entreprises WHERE nom = ?";
    $stmtCheckEntreprise = $conn->prepare($queryCheckEntreprise);
    $stmtCheckEntreprise->bind_param("s", $nomEntreprise);
    $stmtCheckEntreprise->execute();
    $result = $stmtCheckEntreprise->get_result();

    if ($result->num_rows > 0) {
        // L'entreprise existe, récupérer son ID
        $row = $result->fetch_assoc();
        $entrepriseId = $row['id'];

        // Mettre à jour les informations de l'entreprise
        $queryUpdateEntreprise = "UPDATE entreprises SET adresse = ?, contact = ?, secteur = ? WHERE id = ?";
        $stmtUpdateEntreprise = $conn->prepare($queryUpdateEntreprise);
        $stmtUpdateEntreprise->bind_param("sssi", $adresseEntreprise, $contactEntreprise, $secteurEntreprise, $entrepriseId);
        $stmtUpdateEntreprise->execute();
        $stmtUpdateEntreprise->close();
    } else {
        // L'entreprise n'existe pas, l'ajouter
        $queryInsertEntreprise = "INSERT INTO entreprises (nom, adresse, contact, secteur) VALUES (?, ?, ?, ?)";
        $stmtInsertEntreprise = $conn->prepare($queryInsertEntreprise);
        $stmtInsertEntreprise->bind_param("ssss", $nomEntreprise, $adresseEntreprise, $contactEntreprise, $secteurEntreprise);
        if ($stmtInsertEntreprise->execute()) {
            $entrepriseId = $conn->insert_id; // Récupérer l'ID de la nouvelle entreprise
        } else {
            echo json_encode(['error' => 'Erreur lors de l\'ajout de l\'entreprise.']);
            exit();
        }
        $stmtInsertEntreprise->close();
    }

    // Mise à jour des informations de la candidature dans la table 'candidatures'
    $queryCandidature = "UPDATE candidatures 
                         SET entreprise_id = ?, poste = ?, date_de_candidature = ?, statut = ?, remarques = ?, rappel = ? 
                         WHERE id = ?";
    $stmtCandidature = $conn->prepare($queryCandidature);
    $stmtCandidature->bind_param("isssssi", $entrepriseId, $poste, $dateDeCandidature, $statut, $remarques, $rappel, $idCandidature);

    // Exécuter la mise à jour de la candidature
    if ($stmtCandidature->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['error' => 'Erreur lors de la mise à jour de la candidature.']);
    }

    $stmtCandidature->close();
    $stmtCheckEntreprise->close();
    $conn->close();
} else {
    echo json_encode(['error' => 'Méthode non autorisée.']);
}
?>
