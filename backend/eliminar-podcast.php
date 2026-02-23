<?php
// Evitar cualquier salida antes del JSON
ob_start();

header('Content-Type: application/json');

$input = file_get_contents('php://input');
$datos = json_decode($input, true);

// Validar que llegó el ID
if (!isset($datos['id'])) {
    echo json_encode([
        'success' => false,
        'message' => 'ID no proporcionado'
    ]);
    exit;
}

$idEliminar = $datos['id'];
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
    
    // Filtrar para eliminar el podcast
    $podcastsNuevos = [];
    $encontrado = false;
    
    foreach ($podcasts as $podcast) {
        if ($podcast['id'] != $idEliminar) {
            $podcastsNuevos[] = $podcast;
        } else {
            $encontrado = true;
        }
    }
    
    if (!$encontrado) {
        throw new Exception('Podcast no encontrado');
    }
    
    // Guardar cambios
    $resultado = file_put_contents(
        $archivoJSON,
        json_encode($podcastsNuevos, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)
    );
    
    if ($resultado === false) {
        throw new Exception('No se pudo escribir en data.json');
    }
    
    // Limpiar buffer y enviar respuesta
    ob_end_clean();
    
    echo json_encode([
        'success' => true,
        'message' => 'Podcast eliminado correctamente'
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