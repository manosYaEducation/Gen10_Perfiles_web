<?php

$host = 'gen10.alphadocere.cl';
$port = '3306';
$user = 'alpha_kreative';
$password = 'No.Olvidemos.Que.Un.Trigger.Es.Un.diparador.22';
$nameDb = 'alpha_kreative';

$dsn = "mysql:host=$host;port=$port;dbname=$nameDb;user=$user;password=$password";

$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $conn = new PDO($dsn, $user, $password, $options);
} catch (\PDOException $e) {
    echo "Error de conexión: " . $e->getMessage();
    
}