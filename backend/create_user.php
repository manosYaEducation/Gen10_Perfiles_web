<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

include 'conexion.php';

// Maneja las solicitudes OPTIONS para CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Decodifica la entrada JSON
$data = json_decode(file_get_contents("php://input"));

try {
    $conn->beginTransaction(); // Comienza la transacción

    // Inserta en la tabla `profile`
    $stmt = $conn->prepare("INSERT INTO profile (name, location, phone, email, description) VALUES (?, ?, ?, ?, ?) RETURNING id");
    $stmt->execute([
        $data->basic->name,
        $data->basic->location,
        $data->basic->phone,
        $data->basic->email,
        $data->basic->description
    ]);
    $profileid = $stmt->fetchColumn(); // Obtiene el ID del perfil recién insertado

    // Inserta en la tabla `experience`
    $stmtExperience = $conn->prepare("INSERT INTO experience (profileid, title, startDate, endDate) VALUES (?, ?, ?, ?)");
    $stmtExperience->execute([
        $profileid,
        $data->experience->experienceTitle,
        $data->experience->experienceStartDate,
        $data->experience->experienceEndDate
    ]);

    // Inserta en la tabla `education`
    $stmtEducation = $conn->prepare("INSERT INTO education (profileid, title, institution, startDate, endDate) VALUES (?, ?, ?, ?, ?)");
    $stmtEducation->execute([
        $profileid,
        $data->education->educationTitle,
        $data->education->educationInstitution,
        $data->education->educationStartDate,
        $data->education->educationEndDate
    ]);

    // Inserta en la tabla `social`
    $stmtSocial = $conn->prepare("INSERT INTO social (profileid, platform, url) VALUES (?, ?, ?)");
    $stmtSocial->execute([
        $profileid,
        $data->social->socialPlatform,
        $data->social->socialUrl
    ]);

    // Inserta en la tabla `skill`
    $stmtSkill = $conn->prepare("INSERT INTO skill (profileid, skill) VALUES (?, ?)");
    $stmtSkill->execute([
        $profileid,
        $data->skill
    ]);

    // Inserta en la tabla `interest`
    $stmtInterest = $conn->prepare("INSERT INTO interests (profileid, interest) VALUES (?, ?)");
    $stmtInterest->execute([
        $profileid,
        $data->interest
    ]);

    $conn->commit(); // Confirma la transacción

    // Respuesta exitosa
    echo json_encode(['success' => true, 'message' => 'Usuario creado con éxito', 'profileid' => $profileid]);

} catch (Exception $e) {
    if ($conn->inTransaction()) {
        $conn->rollBack(); // Revierte la transacción en caso de error
    }
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
} catch (PDOException $e) {
    if ($conn->inTransaction()) {
        $conn->rollBack(); // Revierte la transacción en caso de error en la base de datos
    }
    echo json_encode(['success' => false, 'message' => 'Error en la base de datos: ' . $e->getMessage()]);
}
