<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

include 'conexion.php';

$profileId = isset($_GET['id']) ? $_GET['id'] : null;

if ($profileId === null) {
    echo json_encode(['success' => false, 'message' => 'No hay profileId']);
    exit;
}

try {
    // Recupera información básica del perfil
    $stmt = $conn->prepare("SELECT name, location, phone, email, description FROM profile WHERE id = ?");
    $stmt->execute([$profileId]);
    $profile = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$profile) {
        echo json_encode(['success' => false, 'message' => 'Perfil no encontrado']);
        exit;
    }

    // Recupera la experiencia
    $stmtExp = $conn->prepare("SELECT title, description, startDate, endDate FROM experience WHERE profileid = ?");
    $stmtExp->execute([$profileId]);
    $experience = $stmtExp->fetchAll(PDO::FETCH_ASSOC);

    // Recupera la educación
    $stmtEdu = $conn->prepare("SELECT title, institution, startDate, endDate FROM education WHERE profileid = ?");
    $stmtEdu->execute([$profileId]);
    $education = $stmtEdu->fetchAll(PDO::FETCH_ASSOC);

    // Recupera las habilidades
    $stmtSkill = $conn->prepare("SELECT skill FROM skill WHERE profileid = ?");
    $stmtSkill->execute([$profileId]);
    $skills = $stmtSkill->fetchAll(PDO::FETCH_COLUMN);

    // Recupera los intereses
    $stmtInterest = $conn->prepare("SELECT interest FROM interests WHERE profileid = ?");
    $stmtInterest->execute([$profileId]);
    $interests = $stmtInterest->fetchAll(PDO::FETCH_COLUMN);

    // Recupera las redes sociales
    $stmtSocial = $conn->prepare("SELECT platform, url FROM social WHERE profileid = ?");
    $stmtSocial->execute([$profileId]);
    $social = $stmtSocial->fetchAll(PDO::FETCH_ASSOC);

    // Estructura la respuesta JSON
    $response = [
        'success' => true,
        'data' => [
            'basic' => $profile,
            'experience' => $experience,
            'education' => $education,
            'skill' => $skills,
            'interest' => $interests,
            'social' => $social,
        ]
    ];

    echo json_encode($response);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
