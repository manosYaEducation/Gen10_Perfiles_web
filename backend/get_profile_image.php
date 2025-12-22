<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

// Cache por 7 días para imágenes
header('Cache-Control: public, max-age=604800');
header('Expires: ' . gmdate('D, d M Y H:i:s', time() + 604800) . ' GMT');

include 'conexion.php';

$profileId = isset($_GET['id']) ? intval($_GET['id']) : null;

if (!$profileId) {
    http_response_code(400);
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'message' => 'ID requerido']);
    exit;
}

try {
    $stmt = $conn->prepare("SELECT tipo, imagen FROM imagenes WHERE profileid = ? LIMIT 1");
    $stmt->execute([$profileId]);
    $imageData = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($imageData) {
        // Servir como imagen binaria, no como base64
        header('Content-Type: ' . $imageData['tipo']);
        header('Content-Length: ' . strlen($imageData['imagen']));
        echo $imageData['imagen'];
    } else {
        // Servir imagen por defecto
        $defaultImagePath = __DIR__ . '/../assets/img/default-profile.png';
        if (file_exists($defaultImagePath)) {
            $imageContent = file_get_contents($defaultImagePath);
            $mimeType = mime_content_type($defaultImagePath);
            header('Content-Type: ' . $mimeType);
            header('Content-Length: ' . strlen($imageContent));
            echo $imageContent;
        } else {
            http_response_code(404);
            exit;
        }
    }
} catch (PDOException $e) {
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'message' => 'Error en la base de datos']);
}
?>
