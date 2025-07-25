<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once __DIR__ . '/conexion.php'; // o config/database.php

header('Content-Type: application/json');

if (!isset($_GET['email'])) {
    echo json_encode([
        'success' => false,
        'error' => 'Falta el parámetro email'
    ]);
    exit;
}

$email = $_GET['email'];

try {
    $stmt = $conn->prepare("SELECT id, name FROM profile WHERE LOWER(TRIM(email)) = LOWER(TRIM(?))");
    $stmt->execute([$email]);
    $profile = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($profile) {
        echo json_encode([
            'success' => true,
            'profile' => $profile
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'error' => 'Perfil no encontrado'
        ]);
    }

} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'error' => 'Error en la base de datos: ' . $e->getMessage()
    ]);
}
