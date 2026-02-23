<?php
// Evitar cualquier salida antes del JSON
ob_start();

header('Content-Type: application/json');

$input = file_get_contents('php://input');
$podcastActualizado = json_decode($input, true);

// Validar datos
if (!isset($podcastActualizado['id'])) {
    echo json_encode([
        'success' => false,
        'message' => 'ID no proporcionado'
    ]);
    exit;
}

$archivoJSON = __DIR__ . '/../frontend/data_podcast/data.json';

try {
    if (!file_exists($archivoJSON)) {
        throw new Exception('Archivo data.json no encontrado');
    }
    
    $contenido = file_get_contents($archivoJSON);
    $podcasts = json_decode($contenido, true);
    
    if (!is_array($podcasts)) {
        throw new Exception('Formato de JSON inválido');
    }
    
    // Buscar y actualizar el podcast
    $encontrado = false;
    foreach ($podcasts as $key => $podcast) {
        if ($podcast['id'] == $podcastActualizado['id']) {
            $podcasts[$key] = $podcastActualizado;
            $encontrado = true;
            break;
        }
    }
    
    if (!$encontrado) {
        throw new Exception('Podcast no encontrado');
    }
    
    // Guardar cambios
    $resultado = file_put_contents(
        $archivoJSON,
        json_encode($podcasts, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)
    );
    
    if ($resultado === false) {
        throw new Exception('No se pudo escribir en data.json');
    }
    
    // Limpiar buffer y enviar respuesta
    ob_end_clean();
    
    echo json_encode([
        'success' => true,
        'message' => 'Podcast actualizado correctamente'
    ]);
    
} catch (Exception $e) {
    ob_end_clean();
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}

exit;
?>