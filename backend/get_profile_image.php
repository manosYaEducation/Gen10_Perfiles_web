<?php
// Desactivar compresión de salida antes de cualquier header (cPanel suele tenerla activa)
if (ini_get('zlib.output_compression')) {
    ini_set('zlib.output_compression', 'Off');
}

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
        // Limpiar buffers de salida para evitar corrupción de datos binarios
        while (ob_get_level()) ob_end_clean();
        header('Content-Type: ' . $imageData['tipo']);
        header('Content-Transfer-Encoding: binary');
        header('Content-Length: ' . mb_strlen($imageData['imagen'], '8bit'));
        echo $imageData['imagen'];
    } else {
        // Servir imagen por defecto
        $defaultImagePath = __DIR__ . '/../assets/img/default-profile.png';
        if (file_exists($defaultImagePath)) {
            $imageContent = file_get_contents($defaultImagePath);
            $mimeType = mime_content_type($defaultImagePath);
            while (ob_get_level()) ob_end_clean();
            header('Content-Type: ' . $mimeType);
            header('Content-Transfer-Encoding: binary');
            header('Content-Length: ' . mb_strlen($imageContent, '8bit'));
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
