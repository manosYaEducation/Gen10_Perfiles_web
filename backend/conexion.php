<?php

$host = 'localhost';
$port = '3306';
$user = 'root';
$password = '';
$nameDb = 'cvmysql';

$dsn = "mysql:host=$host;port=$port;dbname=$nameDb;user=$user;password=$password";

$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $conn = new PDO($dsn, $user, $password, $options);
    echo "CONEXION WENA";
} catch (\PDOException $e) {
    echo "Error de conexión: " . $e->getMessage();
    
}