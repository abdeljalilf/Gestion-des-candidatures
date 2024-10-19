<?php
// register.php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

include '../db/db_connect.php'; // Assurez-vous que le chemin est correct

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    $email = $data->email;
    $password = password_hash($data->password, PASSWORD_BCRYPT); // Hash du mot de passe

    // Vérifier si l'email est déjà utilisé
    $query = "SELECT * FROM users WHERE email = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        echo json_encode(['success' => false, 'message' => 'L\'email est déjà utilisé.']);
    } else {
        // Insérer le nouvel utilisateur
        $queryInsert = "INSERT INTO users (email, password) VALUES (?, ?)";
        $stmtInsert = $conn->prepare($queryInsert);
        $stmtInsert->bind_param("ss", $email, $password);

        if ($stmtInsert->execute()) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Erreur lors de l\'inscription.']);
        }
        $stmtInsert->close();
    }

    $stmt->close();
    $conn->close();
}
?>
