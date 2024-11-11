<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

include 'conexion.php';

$profileid = isset($_GET['id']) ? $_GET['id'] : null;

try {
    // Si hay un 'id', devolver un perfil específico
    if ($profileid !== null) {
        // Recupera información básica del perfil
        $stmt = $conn->prepare("SELECT name, location, phone, email, description FROM profile WHERE id = ?");
        $stmt->execute([$profileid]);
        $profile = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$profile) {
            echo json_encode(['success' => false, 'message' => 'Perfil no encontrado']);
            exit;
        }

        // Recupera la experiencia
        $stmtExp = $conn->prepare("SELECT title, startdate, enddate FROM experience WHERE profileid = ?");
        $stmtExp->execute([$profileid]);
        $experience = $stmtExp->fetchAll(PDO::FETCH_ASSOC);

        // Recupera la educación
        $stmtEdu = $conn->prepare("SELECT title, institution, startdate, enddate FROM education WHERE profileid = ?");
        $stmtEdu->execute([$profileid]);
        $education = $stmtEdu->fetchAll(PDO::FETCH_ASSOC);

        // Recupera las habilidades
        $stmtSkill = $conn->prepare("SELECT skill FROM skill WHERE profileid = ?");
        $stmtSkill->execute([$profileid]);
        $skill = $stmtSkill->fetchAll(PDO::FETCH_COLUMN);

        // Recupera los intereses
        $stmtInterest = $conn->prepare("SELECT interest FROM interest WHERE profileid = ?");
        $stmtInterest->execute([$profileid]);
        $interest = $stmtInterest->fetchAll(PDO::FETCH_COLUMN);

        // Recupera las redes sociales
        $stmtSocial = $conn->prepare("SELECT platform, url FROM social WHERE profileid = ?");
        $stmtSocial->execute([$profileid]);
        $social = $stmtSocial->fetchAll(PDO::FETCH_ASSOC);

        // Estructura la respuesta JSON para un perfil específico
        $response = [
            'success' => true,
            'data' => [
                'basic' => $profile,
                'experience' => $experience,
                'education' => $education,
                'skill' => $skill,
                'interest' => $interest,
                'social' => $social,
            ]
        ];

    } else {
        // Si no hay 'id', devuelve todos los perfiles
        $stmt = $conn->prepare("SELECT id, name, description FROM profile");
        $stmt->execute();
        $profiles = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if (!$profiles) {
            echo json_encode(['success' => false, 'message' => 'No se encontraron perfiles']);
            exit;
        }

        // Responde con todos los perfiles
        $response = [
            'success' => true,
            'profiles' => $profiles
        ];
    }

    echo json_encode($response);

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
