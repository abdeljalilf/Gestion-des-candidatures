<?php
// backend/Login/session_util.php
require_once '../db/db_connect.php';

function checkSession($conn) {
    // Obtenez tous les en-têtes de la requête
    $headers = getallheaders();
    // Récupérez l'ID de session depuis l'en-tête Authorization
    $session_id = isset($headers['Authorization']) ? $headers['Authorization'] : '';

    // Vérifiez si un ID de session a été fourni
    if ($session_id) {
        // Requête pour vérifier la session
        $sql = "SELECT sessions.session_id, sessions.login_time, users.email
                FROM sessions
                JOIN users ON sessions.user_id = users.id
                WHERE sessions.session_id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('s', $session_id);
        $stmt->execute();
        $result = $stmt->get_result();

        // Vérifiez si la session est active
        if ($result->num_rows === 1) {
            $session = $result->fetch_assoc();
            $login_time = strtotime($session['login_time']);
            $current_time = time();

            // Vérifiez si la session a expiré (8 heures)
            if (($current_time - $login_time) > 28800) {
                // Supprimez la session expirée
                $sql = "DELETE FROM sessions WHERE session_id = ?";
                $stmt = $conn->prepare($sql);
                $stmt->bind_param('s', $session_id);
                $stmt->execute();
                $stmt->close();

                http_response_code(401);
                echo json_encode(array('logged_in' => false, 'message' => 'Session expired'));
                exit;
            } else {
                // Mise à jour de login_time pour prolonger la session
                $sql = "UPDATE sessions SET login_time = CURRENT_TIMESTAMP WHERE session_id = ?";
                $stmt = $conn->prepare($sql);
                $stmt->bind_param('s', $session_id);
                $stmt->execute();
                $stmt->close();

                return $session;  // Retourne la session active
            }
        } else {
            http_response_code(401);
            echo json_encode(array('logged_in' => false, 'message' => 'No active session'));
            exit;
        }
    } else {
        http_response_code(401);
        echo json_encode(array('logged_in' => false, 'message' => 'No session ID provided'));
        exit;
    }
}
?>
