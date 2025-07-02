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


$dsn = "mysql:host=$host;port=$port;dbname=$nameDb;user=$user;password=$password;charset=utf8mb4";

$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $conn = new PDO($dsn, $user, $password, $options);
    
     // FORZAR UTF8MB4 EN LA SESION
    $conn->exec("SET NAMES utf8mb4");
    
} catch (\PDOException $e) {
    echo "Error de conexión: " . $e->getMessage();
    
}