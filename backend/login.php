<?php
// Activar modo de depuración para ver errores (quitar en producción)
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Función para enviar respuestas JSON consistentes
function enviarJSON($data, $statusCode = 200)
{
    http_response_code($statusCode);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}

// Encabezados CORS básicos
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Manejar solicitudes preflight OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Verificar método de solicitud
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    enviarJSON([
        'success' => false,
        'error' => 'Método no permitido. Solo se acepta POST.'
    ], 405);
}

// Obtener datos JSON del cuerpo de la solicitud
$inputData = file_get_contents('php://input');
$data = json_decode($inputData, true);

// Verificar si los datos JSON son válidos
if (json_last_error() !== JSON_ERROR_NONE) {
    enviarJSON([
        'success' => false,
        'error' => 'Error al decodificar JSON: ' . json_last_error_msg(),
        'input' => substr($inputData, 0, 100) . (strlen($inputData) > 100 ? '...' : '')
    ], 400);
}

// Verificar si contiene los campos requeridos
if (!isset($data['email']) || !isset($data['password'])) {
    enviarJSON([
        'success' => false,
        'error' => 'Datos incompletos. Se requiere email y password.'
    ], 400);
}

// Obtener valores de los campos
$username = $data['email']; // Email se usa como username
$password = $data['password'];

// SOLUCIÓN TEMPORAL: Permitir login con admin/admin directamente
// Quitar esta sección cuando la base de datos esté configurada correctamente
if ($username === 'admin' && $password === 'admin') {
    session_start();
    $_SESSION['user_id'] = 1;
    $_SESSION['username'] = $username;
    $_SESSION['user_type'] = 'admin';

    $token = bin2hex(random_bytes(16));
    $_SESSION['token'] = $token;

    enviarJSON([
        'success' => true,
        'token' => $token,
        'user_id' => 1,
        'user_type' => 'admin',
        'user_email' => $username,
        'profile_completed' => true,
        'note' => 'Acceso directo activado - quita esta sección cuando la BD esté configurada'
    ]);
}

try {
    // Incluir archivo de conexión a la base de datos
    require_once('conexion.php');

    // Verificar que la conexión está establecida
    if (!isset($conn) || !($conn instanceof PDO)) {
        throw new Exception("Error en la conexión a la base de datos");
    }

    // Depuración - guardar información en un log
    error_log("Intentando autenticar usuario: $username");

    // Consulta a la base de datos - Buscar usuario por username
    $stmt = $conn->prepare("SELECT id, password, type FROM users WHERE username = :username");
    $stmt->bindParam(':username', $username, PDO::PARAM_STR);
    $stmt->execute();

    error_log("Filas encontradas: " . $stmt->rowCount());

    // Añadir esto para depuración
    $debug_info = [
        'rows_found' => $stmt->rowCount(),
        'query' => "SELECT id, password, type FROM users WHERE username = '$username'"
    ];

    // Verificar si se encontró un usuario
    if ($stmt->rowCount() > 0) {
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        error_log("Password en BD: " . $user['password'] . " - Password proporcionado: " . $password);

        // Verificar contraseña
        // En producción: if (password_verify($password, $user['password'])) {
        if ($password === $user['password']) {
            // Iniciar sesión en el servidor
            session_start();
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['username'] = $username;
            $_SESSION['user_type'] = $user['type'];

            // Configurar cookie de sesión para que dure más
            $sessionLifetime = 30 * 24 * 60 * 60; // 30 días en segundos
            session_set_cookie_params($sessionLifetime);
            setcookie(session_name(), session_id(), time() + $sessionLifetime, "/");

            // Generar token (en producción usar JWT adecuado)
            $token = bin2hex(random_bytes(16));

            // Almacenar token en la sesión
            $_SESSION['token'] = $token;

            // Para simplificar, asumimos que el perfil está completo
            $profileExists = true;

            // Enviar respuesta exitosa
            enviarJSON([
                'success' => true,
                'token' => $token,
                'user_id' => $user['id'],
                'user_type' => $user['type'],
                'user_email' => $username,
                'profile_completed' => $profileExists
            ]);
        } else {
            // Contraseña incorrecta
            enviarJSON([
                'success' => false,
                'error' => 'Usuario o contraseña incorrectos.',
                'debug' => $debug_info  // Solo en desarrollo, quitar en producción
            ], 401);
        }
    } else {
        // Usuario no encontrado
        enviarJSON([
            'success' => false,
            'error' => 'Usuario o contraseña incorrectos.',
            'debug' => $debug_info  // Solo en desarrollo, quitar en producción
        ], 401);
    }
} catch (PDOException $e) {
    // Error de base de datos
    enviarJSON([
        'success' => false,
        'error' => 'Error en el servidor: ' . $e->getMessage(),
        'trace' => $e->getTraceAsString()  // Solo en desarrollo, quitar en producción
    ], 500);
} catch (Exception $e) {
    // Otros errores
    enviarJSON([
        'success' => false,
        'error' => 'Error: ' . $e->getMessage(),
        'trace' => $e->getTraceAsString()  // Solo en desarrollo, quitar en producción
    ], 500);
}
