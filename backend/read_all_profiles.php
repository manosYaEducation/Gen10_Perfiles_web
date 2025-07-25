<?php
require_once __DIR__ . '/conexion.php';
header('Content-Type: application/json');

try {
    $stmt = $conn->query("SELECT id, name, email FROM profile");
    $perfiles = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'perfiles' => $perfiles
    ]);
} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}