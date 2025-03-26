<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

include 'conexion.php';

$clientid = isset($_GET['id']) ? $_GET['id'] : null;

try {
    if ($clientid !== null) {
        // Recupera información básica del cliente
        $stmt = $conn->prepare("SELECT id, name, company, email, location, phone, description FROM clients WHERE id = ?");
        $stmt->execute([$clientid]);
        $client = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$client) {
            echo json_encode(['success' => false, 'message' => 'Cliente no encontrado']);
            exit;
        }

        // Recupera la imagen del cliente
        $stmtImage = $conn->prepare("SELECT nombre, tipo, imagen FROM imagenes_clientes WHERE clienteid = ?");
        $stmtImage->execute([$clientid]);
        $imageData = $stmtImage->fetch(PDO::FETCH_ASSOC);

        $image = null;
        if ($imageData) {
            // Convierte la imagen en base64
            $image = 'data:' . $imageData['tipo'] . ';base64,' . base64_encode($imageData['imagen']);
        }

        // Estructura la respuesta JSON para un perfil específico
        $response = [
            'success' => true,
            'data' => [
                'basic' => $client,
                'image' => $image,  // Ahora la imagen está en `data`
            ]
        ];
    } else {
        echo json_encode(['success' => false, 'message' => 'No se encontraron perfiles']);
        exit;
    }

    echo json_encode($response);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
