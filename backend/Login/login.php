<?php
session_start(); // Démarrez la session

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

include '../db/db_connect.php'; // Assurez-vous que le chemin est correct

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    $email = $data->email;
    $password = $data->password;

    // Vérifiez si l'utilisateur existe
    $query = "SELECT * FROM users WHERE email = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        // Vérifiez le mot de passe
        if (password_verify($password, $user['password'])) {
            // Créez une session
            $session_id = session_id(); // Récupérez l'ID de session

            // Enregistrez la session dans la base de données
            $insert_query = "INSERT INTO sessions (session_id, user_id) VALUES (?, ?)";
            $insert_stmt = $conn->prepare($insert_query);
            $insert_stmt->bind_param("si", $session_id, $user['id']);
            $insert_stmt->execute();

            echo json_encode(['success' => true, 'session_id' => $session_id]); // Retournez l'ID de session si besoin
        } else {
            echo json_encode(['success' => false, 'message' => 'Mot de passe incorrect.']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Aucun utilisateur trouvé avec cet e-mail.']);
    }

    $stmt->close();
    $conn->close();
}
?>
