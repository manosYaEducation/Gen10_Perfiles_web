<?php

//esto  carga  las  variables  de  entorno
require_once __DIR__ . '/../vendor/autoload.php';
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/..');
$dotenv->load();

$environment = $_ENV['ENVIRONMENT'] ?? 'production';

if($environment === 'production') {  
    $host = $_ENV['PROD_DB_HOST'];
    $port = $_ENV['PROD_DB_PORT'];
    $user = $_ENV['PROD_DB_USER'];
    $password = $_ENV['PROD_DB_PASSWORD'];
    $nameDb = $_ENV['PROD_DB_NAME'];
} else {
    $host = $_ENV['DEV_DB_HOST'];
    $port = $_ENV['DEV_DB_PORT'];
    $user = $_ENV['DEV_DB_USER'];
    $password = $_ENV['DEV_DB_PASSWORD'];
    $nameDb = $_ENV['DEV_DB_NAME'];
}

// Validar que las variables de entorno estén cargadas
if (!$host || !$port || !$user || !$nameDb) {
    die("Error: Variables de entorno no configuradas. Verifica tu archivo .env");
}

// DSN correcto para PDO (sin user ni password en el DSN)
$dsn = "mysql:host=$host;port=$port;dbname=$nameDb;charset=utf8mb4";

$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    // Parámetros correctos: DSN, usuario, contraseña, opciones
    $conn = new PDO($dsn, $user, $password, $options);
    
    // FORZAR UTF8MB4 EN LA SESION
    $conn->exec("SET NAMES utf8mb4");
    
} catch (\PDOException $e) {
    // Determinar si es una solicitud AJAX/API
    $isAjax = !empty($_SERVER['HTTP_X_REQUESTED_WITH']) && 
              strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest';
    
    if ($isAjax || (isset($_SERVER['CONTENT_TYPE']) && strpos($_SERVER['CONTENT_TYPE'], 'application/json') !== false)) {
        header('Content-Type: application/json');
        echo json_encode([
            'success' => false,
            'error' => 'Error de conexión a la base de datos',
            'message' => 'No se pudo conectar a la base de datos. Verifica tu archivo .env'
        ]);
    } else {
        die("❌ Error de conexión a la base de datos: " . $e->getMessage());
    }
    exit;
}