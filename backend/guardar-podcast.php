<?php
header('Content-Type: application/json');

// Leer datos del POST
$input = file_get_contents('php://input');
$nuevoPodcast = json_decode($input, true);

// Ruta del archivo JSON
$archivoJSON = __DIR__ . '/../frontend/data_podcast/data.json';

try {
    // Leer JSON actual
    if (file_exists($archivoJSON)) {
        $contenido = file_get_contents($archivoJSON);
        $podcasts = json_decode($contenido, true);
        
        if (!is_array($podcasts)) {
            $podcasts = [];
        }
    } else {
        $podcasts = [];
    }
    
    // Agregar nuevo podcast
    $podcasts[] = $nuevoPodcast;
    
    // Guardar en JSON
    $resultado = file_put_contents(
        $archivoJSON, 
        json_encode($podcasts, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)
    );
    
    if ($resultado !== false) {
        echo json_encode([
            'success' => true,
            'message' => 'Podcast guardado correctamente'
        ]);
    } else {
        throw new Exception('No se pudo escribir en el archivo JSON');
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>