<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, PUT, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Manejo de preflight (CORS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Incluir el archivo de conexión
require_once 'conexion.php';

try {
    // Obtener datos de la solicitud
    $data = json_decode(file_get_contents("php://input"), true);

    if (!$data || !isset($data['id'])) {
        throw new Exception('El ID de usuario es obligatorio.');
    }

    $userId = $data['id'];
    $basic = $data['basic'];
    $social = $data['social'];
    $skills = $data['skills'];
    $interests = $data['interests'];
    $experience = $data['experience'];
    $education = $data['education'];

    // Iniciar transacción
    $conn->beginTransaction();

    // Actualizar datos básicos
    $stmt = $conn->prepare("UPDATE profile SET name = ?, location = ?, phone = ?, email = ?, description = ? WHERE id = ?");
    $stmt->execute([
        $basic['name'], 
        $basic['location'], 
        $basic['phone'], 
        $basic['email'], 
        $basic['description'], 
        $userId
    ]);

    // Actualizar redes sociales
    $conn->prepare("DELETE FROM social WHERE profileid = ?")->execute([$userId]);
    $stmt = $conn->prepare("INSERT INTO social (profileid, platform, url) VALUES (?, ?, ?)");
    foreach ($social as $socialData) {
        $stmt->execute([$userId, $socialData['platform'], $socialData['url']]);
    }

    // // Actualizar habilidades e intereses
    $stmt = $conn->prepare("UPDATE skill SET skill = ? WHERE profileid = ?");
    $stmt->execute([$skills,$userId]);

    $stmt = $conn->prepare("UPDATE interest SET interest = ? WHERE profileid = ?");
    $stmt->execute([$interests,$userId]);

    // // Actualizar experiencia
    $conn->prepare("DELETE FROM experience WHERE profileid = ?")->execute([$userId]);
    $stmt = $conn->prepare("INSERT INTO experience (profileid, title, startdate, enddate) VALUES (?, ?, ?, ?)");
    foreach ($experience as $exp) {
        $stmt->execute([$userId, $exp['title'], $exp['startDate'], $exp['endDate']]);
    }

    // // Actualizar educación
    $conn->prepare("DELETE FROM education WHERE profileid = ?")->execute([$userId]);
    $stmt = $conn->prepare("INSERT INTO education (profileid, title, startdate, enddate, institution) VALUES (?, ?, ?, ?, ?)");
    foreach ($education as $edu) {
        $stmt->execute([$userId, $edu['title'], $edu['startDate'], $edu['endDate'], $edu['institution']]);
    }

    // Confirmar transacción
    $conn->commit();

    echo json_encode(['success' => true, 'message' => 'Datos actualizados correctamente.']);

} catch (Exception $e) {
    $conn->rollBack();
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
