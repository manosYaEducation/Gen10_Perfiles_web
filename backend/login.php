<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

include('conexion.php');

session_start();

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['username']) || !isset($data['password'])) {
    echo json_encode(['status' => 'error', 'message' => 'Faltan datos del formulario.']);
    exit;
}

$username = $data['username'];
$password = $data['password'];

try {
    $stmt = $conn->prepare("SELECT * FROM users WHERE username = :username");
    $stmt->bindParam(':username', $username, PDO::PARAM_STR);
    $stmt->execute();

    // Verificar si se encontró un usuario con ese nombre de usuario
    if ($stmt->rowCount() > 0) {
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if (password_verify($password, $user['password'])) {
            $_SESSION['username'] = $user['username'];

            echo json_encode(['status' => 'success', 'message' => 'Inicio de sesión exitoso']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Contraseña incorrecta']);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Usuario no encontrado']);
    }
} catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => 'Error al procesar la solicitud: ' . $e->getMessage()]);
}
