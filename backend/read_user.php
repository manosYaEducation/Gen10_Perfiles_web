<?php

include 'connection.php';

$profileId = isset($_GET['id']) ? $_GET['id'] : null;

if ($profileId === null) {
    echo json_encode (['success' => false, 'message' => 'No hay profileId ']);
    exit;
}

try {

    $stmt = $conn->prepare("SELECT name AS nombre, location AS ubicacion, phone AS telefono, email AS correo, description AS descripcion FROM profile WHERE id = ?");
    $stmt->execute([$profileId]);
    $profile = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$profile) {
        echo json_encode (['success' => false, 'message' => 'Perfil no encontrado ']);
        exit;
    }

    $stmtExp = $conn->prepare("SELECT title AS titulo, start_date AS fecha, description AS descripcion FROM experience WHERE profileID = ?");
    $stmtExp->execute([$profile["id"]]);
    $experiences = $stmtExp->fetchAll(PDO::FETCH_ASSOC);

    $stmtEdu = $conn->prepare("SELECT institution AS institucion, title AS titulo, period AS periodo FROM education WHERE profileID = ?");
    $stmtEdu->execute([$profile["id"]]);
    $educations = $stmtEdu->fetchAll(PDO::FETCH_ASSOC);

    // $stmtSkills = $conn->prepare("SELECT * FROM skill WHERE profileId = ?");
    // $stmtSkills->execute([$profile["id"]]);
    // $skills = $stmtSkills->fetchAll(PDO::FETCH_ASSOC);

    // $stmtSocial = $conn->prepare("SELECT * FROM social WHERE profileId = ?");
    // $stmtSocial->execute([$profile["id"]]);
    // $socials = $stmtSocial->fetchAll(PDO::FETCH_ASSOC);

    // $stmtInt = $conn->prepare("SELECT * FROM interests WHERE profileId = ?");
    // $stmtInt->execute([$profile["id"]]);
    // $interests = $stmtInt->fetchAll(PDO::FETCH_ASSOC);



    $profile ['experience'] = $experiences;
    $profile ['education'] = $educations;
    // $profile ['social'] = $socials;
    // $profile ['omterests'] = $interests;
    // $profile ['skills'] = $profileSkills;

    $result[] = $profile;
    
    echo json_encode(['success' => true,'data'=> $result]);
} catch (PDOException $e) {
    echo json_encode(['success'=> false, 'message' => $e->getMessage()]);
}