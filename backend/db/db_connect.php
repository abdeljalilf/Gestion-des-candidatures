<?php
// Paramètres de connexion à la base de données
$host = 'localhost';  // L'adresse du serveur MySQL (localhost si le serveur est local)
$dbname = 'candidatures_db';  // Le nom de la base de données
$username = 'root';  // Le nom d'utilisateur MySQL (modifier si nécessaire)
$password = 'Af1802Ie';  // Le mot de passe MySQL (modifier si nécessaire)

// Connexion à la base de données avec mysqli
$conn = new mysqli($host, $username, $password, $dbname);

// Vérifier si la connexion a réussi
if ($conn->connect_error) {
    die("Échec de la connexion à la base de données : " . $conn->connect_error);
}

// Si la connexion est réussie
echo "Connexion réussie à la base de données";
?>
