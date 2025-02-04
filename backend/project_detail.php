<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

include 'conexion.php';

// Obtener el ID del proyecto desde la URL
$id_proyecto = isset($_GET['id']) ? intval($_GET['id']) : 0;

if ($id_proyecto <= 0) {
    echo json_encode(['success' => false, 'message' => 'ID de proyecto inválido']);
    exit();
}

try {
    // Consulta del proyecto
    $stmt = $conn->prepare("SELECT id_proyecto, titulo_proyecto, fecha, ubicacion, contenido_proyecto 
                            FROM proyectos WHERE id_proyecto = ?");
    $stmt->execute([$id_proyecto]);
    $proyecto = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$proyecto) {
        echo json_encode(['success' => false, 'message' => 'Proyecto no encontrado']);
        exit();
    }

    // Obtener detalles del proyecto
    $stmt = $conn->prepare("SELECT tipo, descripcion, detalle FROM proyectos_detalles WHERE id_proyecto = ?");
    $stmt->execute([$id_proyecto]);
    $detalles = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Estructura organizada
    $resultado = [
        'titulo' => $proyecto['titulo_proyecto'],
        'fecha' => $proyecto['fecha'],
        'ubicacion' => $proyecto['ubicacion'],
        'contenido' => $proyecto['contenido_proyecto'],
        'detalles' => [
            'parrafos' => [],
            'imagenes' => [],
            'participantes' => [],
            'testimonios' => [],
            'enlaces' => []
        ]
    ];

    foreach ($detalles as $detalle) {
        switch ($detalle['tipo']) {
            case 'parrafo':
                $resultado['detalles']['parrafos'][] = $detalle['descripcion'];
                break;
            case 'imagen':
                $resultado['detalles']['imagenes'][] = $detalle['detalle']; // URL
                break;
            case 'participante':
                $resultado['detalles']['participantes'][] = [
                    'id' => $detalle['descripcion'],
                    'nombre' => $detalle['detalle']
                ];
                break;
            case 'testimonio':
                $resultado['detalles']['testimonios'][] = [
                    'autor' => $detalle['descripcion'],
                    'contenido' => $detalle['detalle']
                ];
                break;
            case 'enlace':
                $resultado['detalles']['enlaces'][] = [
                    'descripcion' => $detalle['descripcion'],
                    'url' => $detalle['detalle']
                ];
                break;
        }
    }

    echo json_encode(['success' => true, 'proyecto' => $resultado]);

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Error en la base de datos: ' . $e->getMessage()]);
}
?>
