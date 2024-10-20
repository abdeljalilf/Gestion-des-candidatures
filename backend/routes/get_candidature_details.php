<?php
// En-têtes pour autoriser les requêtes depuis d'autres domaines (CORS)
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Gestion des requêtes OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit; // Arrête l'exécution pour les requêtes OPTIONS
}

// Connexion à la base de données
include '../db/db_connect.php';
// include '../Login/session_util.php'; // Inclusion de la vérification de session

// // Vérification de session
// $session = checkSession($conn);
// if (!$session) {
//     http_response_code(401); // Non autorisé si la session est invalide
//     exit;
// }

// Vérification de l'ID de la candidature dans la requête
if (isset($_GET['id']) && !empty($_GET['id'])) {
    $candidature_id = $_GET['id'];

    // Préparation de la requête SQL pour récupérer les détails de la candidature et de l'entreprise associée
    $query = "
        SELECT 
            c.id AS candidature_id,
            c.poste,
            c.date_de_candidature,
            c.statut,
            c.remarques,
            c.rappel,
            e.nom AS entreprise,
            e.adresse,
            e.contact,
            e.secteur
        FROM candidatures c
        LEFT JOIN entreprises e ON c.entreprise_id = e.id
        WHERE c.id = ?
    ";

    // Préparation de la requête avec mysqli
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $candidature_id); // Lier l'ID de la candidature comme un entier

    // Exécution de la requête
    if ($stmt->execute()) {
        // Récupérer le résultat
        $result = $stmt->get_result();

        // Vérifier si des résultats ont été trouvés
        if ($result->num_rows > 0) {
            $candidature_details = $result->fetch_assoc();
            echo json_encode($candidature_details);
        } else {
            // Aucun résultat trouvé pour l'ID de la candidature
            echo json_encode(['message' => 'Candidature non trouvée.']);
        }
    } else {
        // En cas d'erreur lors de l'exécution de la requête
        echo json_encode(['message' => 'Erreur lors de la récupération des détails de la candidature.']);
    }
} else {
    // Si l'ID de la candidature n'est pas fourni
    echo json_encode(['message' => 'ID de la candidature non fourni.']);
}

$conn->close();

?>
