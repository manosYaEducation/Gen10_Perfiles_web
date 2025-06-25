<?php
// Función para enviar respuestas JSON consistentes
function enviarJSON($data, $statusCode = 200)
{
   http_response_code($statusCode);
   header('Content-Type: application/json');
   echo json_encode($data);
   exit;
}

// Encabezados CORS configurados para el dominio específico
header("Access-Control-Allow-Origin: https://kreative.alphadocere.cl");
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
       'error' => 'Error al decodificar JSON: ' . json_last_error_msg()
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

// Iniciar sesión en el servidor
session_start();

// Inicio conteo de intentos fallidos
$max_intentos = 5;
$tiempo_bloqueo = 120; // Segundos

if (isset($_SESSION['bloqueado_hasta']) && time() < $_SESSION['bloqueado_hasta']) {
   $tiempo_restante = $_SESSION['bloqueado_hasta'] - time();
   enviarJSON([
       'success' => false,
       'error' => 'Demasiados intentos fallidos. Intenta nuevamente en ' . $tiempo_restante . ' segundos.'
   ], 403);
}

try {
   // Hacer petición a la API externa para validar credenciales
   // Aquí iría el código para comunicarse con la API externa
   
   // Suponemos que las credenciales son válidas para este ejemplo
   $validCredentials = true;
   
   if ($validCredentials) {
       // Reset de intentos y timer de bloqueo
       $_SESSION['intentos'] = 0;
       unset($_SESSION['bloqueado_hasta']);

       $_SESSION['user_id'] = 1;
       $_SESSION['username'] = $username;
       $_SESSION['user_type'] = 'admin';

       // Configurar cookie de sesión con duración razonable
       $sessionLifetime = 24 * 60 * 60; // 1 día en segundos
       session_set_cookie_params($sessionLifetime);
       setcookie(session_name(), session_id(), time() + $sessionLifetime, "/", "", true, true);

       // Generar token
       $token = bin2hex(random_bytes(32));

       // Almacenar token en la sesión
       $_SESSION['token'] = $token;
       $_SESSION['token_expiry'] = time() + $sessionLifetime;

       // Enviar respuesta exitosa
       enviarJSON([
           'success' => true,
           'token' => $token,
           'user_id' => 1,
           'user_type' => 'admin',
           'user_email' => $username,
           'profile_completed' => true,
           'token_expires' => $_SESSION['token_expiry']
       ]);

    } else {
        // Credenciales incorrectas
        $_SESSION['intentos'] = ($_SESSION['intentos'] ?? 0) + 1;
        if ($_SESSION['intentos'] >= $max_intentos) {
        $_SESSION['bloqueado_hasta'] = time() + $tiempo_bloqueo;
        enviarJSON([
            'success' => false,
            'error' => 'Demasiados intentos fallidos. Intenta nuevamente en ' . $tiempo_bloqueo . ' segundos.'
        ], 403);
        } else {
            enviarJSON([
               'success' => false,
               'error' => 'Usuario o contraseña incorrectos.'
            ], 401);
        }
    }
} catch (Exception $e) {
   // Error general - mensaje genérico
   enviarJSON([
       'success' => false,
       'error' => 'Error en el servidor. Por favor, intente más tarde.'
   ], 500);
}