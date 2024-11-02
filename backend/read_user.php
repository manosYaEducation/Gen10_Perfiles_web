<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

include 'conexion.php';

$profileId = isset($_GET['id']) ? $_GET['id'] : null;

if ($profileId === null) {
    echo json_encode(['success' => false, 'message' => 'No hay profileId ']);
    exit;
}

try {
    
    $stmt = $conn->prepare("SELECT name AS nombre, location AS ubicacion, phone AS telefono, email AS correo, description AS descripcion FROM profile WHERE id = ?");
    $stmt->execute([$profileId]);
    $profile = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$profile) {
        echo json_encode(['success' => false, 'message' => 'Perfil no encontrado ']);
        exit;
    }

    $stmtExp = $conn->prepare("SELECT title AS titulo, startDate AS fecha, description AS descripcion FROM experience WHERE profileID = ?");
    $stmtExp->execute([$profileId]);
    $experiences = $stmtExp->fetchAll(PDO::FETCH_ASSOC);

    $stmtEdu = $conn->prepare("SELECT title AS titulo, startDate AS fecha, description AS descripcion FROM experience WHERE profileId = ?");
    $stmtEdu->execute([$profileId]);
    $educations = $stmtEdu->fetchAll(PDO::FETCH_ASSOC);

    
    $response = [
        'success' => true,
        'data' => [
            'basico' => $profile, 
            'experience' => $experiences,
            'education' => $educations,
            
        ]
    ];

    echo json_encode($response);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
