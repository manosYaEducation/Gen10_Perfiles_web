<?php

define('environment', 'local'); // NOTA IMPORTANTE: SE DEBE CAMBIAR LA VARIABLE "environment" local a production cuando el proyecto esté en producción.


if(environment === 'production') {  
    $host = 'localhost';
    $port = '3306';
    $user = 'alphadoc';
    $password = 'No.Olvidemos.Que.Un.Trigger.Es.Un.diparador.22';
    $nameDb = 'alphadoc_kreative';

}else{
    $host = 'localhost';
    $port = '3306';
    $user = 'root';
    $password = '';
    $nameDb = 'alphadoc_kreative';
}


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