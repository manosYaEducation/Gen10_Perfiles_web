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
$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode(['success' => false, 'message' => 'Datos JSON inválidos']);
    exit();
}

try {
    $conn->beginTransaction();
    $stmt = $conn->prepare("INSERT INTO review (statusid, profileid, nameClient, company, comments, rating, date_review) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([
        $data['statusid'],
        $data['profileid'],
        $data['nameClient'],
        $data['company'],
        $data['comments'],
        $data['rating'],
        $data['date_review']
    ]);
    $conn->commit();
    echo json_encode(['success' => true, 'message' => 'Reseña creada con éxito']);
} catch (PDOException $e) {
    if ($conn->inTransaction()) {
        $conn->rollBack();
    }
    echo json_encode(['success' => false, 'message' => 'Error en la base de datos: ' . $e->getMessage()]);
} catch (Exception $e) {
    if ($conn->inTransaction()) {
        $conn->rollBack();
    }
    echo json_encode(['success' => false, 'message' => 'Error en el servidor: ' . $e->getMessage()]);
}
?>
