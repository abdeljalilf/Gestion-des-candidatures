<?php
// Inclusion de la connexion à la base de données
include '../db/db_connect.php';

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Préparer la requête SQL pour récupérer les candidatures
$sql = "SELECT candidatures.id, entreprises.nom AS entreprise, candidatures.poste, 
        candidatures.date_de_candidature, candidatures.statut, candidatures.remarques, 
        candidatures.rappel 
        FROM candidatures 
        JOIN entreprises ON candidatures.entreprise_id = entreprises.id";

// Exécuter la requête
$result = $conn->query($sql);

$candidatures = []; // Initialiser le tableau de candidatures

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        // Créer une structure pour chaque candidature
        $candidatures[] = [
            'id' => $row['id'],
            'entreprise' => $row['entreprise'],
            'poste' => $row['poste'],
            'date_de_candidature' => $row['date_de_candidature'],
            'statut' => $row['statut'],
            'remarques' => $row['remarques'],
            'rappel' => $row['rappel']
        ];
    }
}

// Renvoyer les candidatures sous forme de JSON
echo json_encode($candidatures);

$conn->close();
?>
