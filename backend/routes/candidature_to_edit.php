<?php
header("Access-Control-Allow-Origin: http://localhost:3000"); // Remplacez par l'URL de votre application React
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

include '../db/db_connect.php'; // Assurez-vous d'inclure votre fichier de connexion à la base de données

if (isset($_GET['id'])) {
    $id = intval($_GET['id']);
    
    // Préparez la requête pour obtenir la candidature
    $query = "SELECT c.id, c.poste, c.date_de_candidature, c.statut, c.remarques, c.rappel, e.nom AS entreprise_nom, e.id AS entreprise_id
              FROM candidatures c
              JOIN entreprises e ON c.entreprise_id = e.id
              WHERE c.id = ?";
    
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $id);
    
    if ($stmt->execute()) {
        $result = $stmt->get_result();
        $candidature = $result->fetch_assoc();

        if ($candidature) {
            echo json_encode($candidature);
        } else {
            echo json_encode(["message" => "Candidature non trouvée."]);
        }
    } else {
        echo json_encode(["message" => "Erreur lors de l'exécution de la requête."]);
    }
    
    $stmt->close();
} else {
    echo json_encode(["message" => "ID de candidature non spécifié."]);
}

$conn->close();
?>
