<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');
header('Cache-Control: public, max-age=3600'); // Cache por 1 hora

include 'conexion.php';

try {
    // Obtener todos los perfiles SIN las imágenes base64 en la consulta
    // Esto reduce significativamente el tamaño de la respuesta
    $stmt = $conn->prepare("
        SELECT 
            p.id, 
            p.name, 
            p.description, 
            p.phrase, 
            p.phone,
            CASE WHEN i.profileid IS NOT NULL THEN 1 ELSE 0 END as has_image
        FROM profile p
        LEFT JOIN imagenes i ON p.id = i.profileid
        ORDER BY p.actividad DESC
    ");
    $stmt->execute();
    $profiles = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Procesar URLs de WhatsApp
    foreach ($profiles as &$profile) {
        if (strpos($profile['phone'], '+56') === 0) {
            $newNum = str_replace(' ', '', $profile['phone']);
            $newNum = substr($newNum, 3);
            $profile['whatsapp'] = "https://wa.me/$newNum";
        } else {
            $newNum = str_replace(' ', '', $profile['phone']);
            $profile['whatsapp'] = "https://wa.me/$newNum";
        }
        // Crear URL para cargar la imagen de forma separada (lazy loading)
        $profile['image_url'] = './backend/get_profile_image.php?id=' . $profile['id'];
        unset($profile['phone']); // No necesitamos el teléfono en el carrusel
    }

    if (empty($profiles)) {
        echo json_encode(['success' => false, 'message' => 'No se encontraron perfiles']);
        exit;
    }

    $response = [
        'success' => true,
        'profiles' => $profiles,
        'count' => count($profiles),
        'cached' => true
    ];

    echo json_encode($response, JSON_UNESCAPED_UNICODE);
    exit;
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Error al obtener perfiles',
        'message' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
    exit;
}
?>
