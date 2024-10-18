<?php
// Inclusion de la connexion à la base de données
include '../db/db_connect.php';

// Préparer la requête SQL pour récupérer les candidatures
$sql = "SELECT candidatures.id, entreprises.nom AS entreprise, candidatures.poste, 
        candidatures.date_de_candidature, candidatures.statut, candidatures.remarques, 
        candidatures.rappel 
        FROM candidatures 
        JOIN entreprises ON candidatures.entreprise_id = entreprises.id";

$result = $conn->query($sql);

// Vérifier si des résultats sont retournés
if ($result->num_rows > 0) {
    $candidatures = [];

    // Parcourir les résultats et ajouter chaque candidature à la liste
    while($row = $result->fetch_assoc()) {
        $candidatures[] = $row;
    }

    // Renvoyer les données sous forme de JSON
    echo json_encode($candidatures);
} else {
    // Si aucune candidature n'est trouvée, renvoyer un tableau vide
    echo json_encode([]);
}

// Fermer la connexion à la base de données
$conn->close();
?>
