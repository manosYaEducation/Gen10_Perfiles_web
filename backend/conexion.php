<?php
// Activar la visualización de errores para depuración
ini_set('display_errors', 1);
error_reporting(E_ALL);

try {
    //esto carga las variables de entorno
    if (!file_exists(__DIR__ . '/../vendor/autoload.php')) {
        throw new Exception('Archivo autoload.php no encontrado. ¿Has ejecutado composer install?');
    }

    require_once __DIR__ . '/../vendor/autoload.php';

    if (!class_exists('Dotenv\Dotenv')) {
        throw new Exception('La clase Dotenv no está disponible. Verifica la instalación de vlucas/phpdotenv');
    }

    if (!file_exists(__DIR__ . '/../.env')) {
        throw new Exception('Archivo .env no encontrado');
    }

    $dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/..');
    $dotenv->load();

    $environment = $_ENV['ENVIRONMENT'] ?? 'production';

    if ($environment === 'production') {
        $host = $_ENV['PROD_DB_HOST'] ?? '';
        $port = $_ENV['PROD_DB_PORT'] ?? '';
        $user = $_ENV['PROD_DB_USER'] ?? '';
        $password = $_ENV['PROD_DB_PASSWORD'] ?? '';
        $nameDb = $_ENV['PROD_DB_NAME'] ?? '';
    } else {
        $host = $_ENV['DEV_DB_HOST'] ?? '';
        $port = $_ENV['DEV_DB_PORT'] ?? '';
        $user = $_ENV['DEV_DB_USER'] ?? '';
        $password = $_ENV['DEV_DB_PASSWORD'] ?? '';
        $nameDb = $_ENV['DEV_DB_NAME'] ?? '';
    }

    // Verificar que todas las variables de entorno estén definidas
    if (empty($host) || empty($user) || empty($nameDb)) {
        throw new Exception('Variables de entorno de base de datos incompletas');
    }

    // Corregir la cadena DSN (sin incluir user y password ahí)
    $dsn = "mysql:host=$host;port=$port;dbname=$nameDb";

    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ];

    $conn = new PDO($dsn, $user, $password, $options);
} catch (Exception $e) {
    // Si estamos en un contexto donde se espera JSON (como en una API)
    if (
        isset($_SERVER['HTTP_ACCEPT']) && strpos($_SERVER['HTTP_ACCEPT'], 'application/json') !== false ||
        isset($_SERVER['CONTENT_TYPE']) && strpos($_SERVER['CONTENT_TYPE'], 'application/json') !== false
    ) {

        header('Content-Type: application/json');
        echo json_encode(['success' => false, 'error' => 'Error de conexión a la base de datos: ' . $e->getMessage()]);
    } else {
        // Si no, mostrar error normal (para depuración)
        echo "Error: " . $e->getMessage();
    }
    exit;
}
