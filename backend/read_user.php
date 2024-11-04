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
    
    $stmt = $conn->prepare("SELECT name, location, phone, email, description FROM profile WHERE id = ?");
    $stmt->execute([$profileId]);
    $profile = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$profile) {
        echo json_encode(['success' => false, 'message' => 'Perfil no encontrado ']);
        exit;
    }

    $stmtExp = $conn->prepare("SELECT title, description, startDate, endDate FROM experience WHERE profileId = ?");
    $stmtExp->execute([$profileId]);
    $experience = $stmtExp->fetchAll(PDO::FETCH_ASSOC);

    $stmtEdu = $conn->prepare("SELECT title, startDate, endDate, description FROM education WHERE profileId = ?");
    $stmtEdu->execute([$profileId]);
    $education = $stmtEdu->fetchAll(PDO::FETCH_ASSOC);

    $response = [
        'success' => true,
        'data' => [
            'basic' => $profile, 
            'experience' => $experience,
            'education' => $education,
        ]
    ];

    echo json_encode($response);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}