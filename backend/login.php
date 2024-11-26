<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

include 'conexion.php';

// Asegurarnos de que la conexión se ha establecido correctamente.
if (!$conn) {
    echo json_encode(['status' => 'error', 'message' => 'No se pudo conectar a la base de datos.']);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Obtener los datos JSON de la solicitud
    $data = json_decode(file_get_contents('php://input'), true);

    // Verificar que los campos no estén vacíos
    if (empty($data['username']) || empty($data['password'])) {
        echo json_encode(['status' => 'error', 'message' => 'Por favor ingresa ambos campos: usuario y contraseña.']);
        exit();
    }

    // Recibir el nombre de usuario y la contraseña del formulario
    $username = trim($data['username']);
    $password = $data['password'];

    try {
        // Consultar la base de datos para obtener el usuario
        $stmt = $conn->prepare('SELECT * FROM users WHERE username = :username');
        $stmt->bindParam(':username', $username);
        $stmt->execute();

        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        // Verificar si el usuario existe
        if (!$user) {
            echo json_encode(['status' => 'error', 'message' => 'Nombre de usuario o contraseña incorrectos.']);
            exit();
        }

        // Verificar la contraseña
        if (password_verify($password, $user['password'])) {
            // Si la contraseña es correcta, se inicia sesión
            session_start(); // Asegúrate de llamar a session_start() para poder usar sesiones
            $_SESSION['id'] = $user['id'];
            $_SESSION['username'] = $user['username'];

            // Responder con éxito
            echo json_encode(['status' => 'success', 'message' => 'Inicio de sesión exitoso.']);
            exit();
        } else {
            // Si la contraseña no coincide
            echo json_encode(['status' => 'error', 'message' => 'Nombre de usuario o contraseña incorrectos.']);
            exit();
        }
    } catch (PDOException $e) {
        // Capturar cualquier error durante la consulta
        echo json_encode(['status' => 'error', 'message' => 'Error al consultar la base de datos: ' . $e->getMessage()]);
        exit();
    }
} else {
    // Si el método de la solicitud no es POST, se devuelve un error
    echo json_encode(['status' => 'error', 'message' => 'Método de solicitud no permitido.']);
    exit();
}




// header("Access-Control-Allow-Origin: *");
// header("Access-Control-Allow-Methods: POST");
// header("Access-Control-Allow-Headers: Content-Type");
// header('Content-Type: application/json');

// include 'conexion.php';

// if ($_SERVER['REQUEST_METHOD'] === 'POST') {
//     $data = json_decode(file_get_contents('php://input'), true);

//     if (empty($data['username']) || empty($data['password'])) {
//         echo json_encode(['status' => 'error', 'message' => 'Por favor ingresa ambos campos: usuario y contraseña.']);
//         exit();
//     }

//     $username = trim($data['username']);
//     $password = $data['password'];

//     try {
//         $stmt = $conn->prepare('SELECT * FROM users WHERE username = :username');
//         $stmt->bindParam(':username', $username);
//         $stmt->execute();

//         $user = $stmt->fetch(PDO::FETCH_ASSOC);

//         if ($user && password_verify($password, $user['password'])) {
//             echo json_encode(['status' => 'success', 'message' => 'Inicio de sesión exitoso.']);
//         } else {
//             echo json_encode(['status' => 'error', 'message' => 'Nombre de usuario o contraseña incorrectos.']);
//         }
//     } catch (PDOException $e) {
//         echo json_encode(['status' => 'error', 'message' => 'Error al consultar la base de datos: ' . $e->getMessage()]);
//     }
//     exit();
// }
