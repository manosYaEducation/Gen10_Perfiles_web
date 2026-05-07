<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header('Content-Type: application/json');

include 'conexion.php';

try {
    // Consulta para obtener todos los proyectos y sus detalles
    $sql = "SELECT p.id_proyecto, p.titulo_tarjeta, p.descripcion_tarjeta, p.fecha
            FROM proyectos p";

    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $datos = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Agrupar los datos por proyecto
    $proyectos = [];
    foreach ($datos as $fila) {
        $id_proyecto = $fila['id_proyecto'];
        
        if (!isset($proyectos[$id_proyecto])) {
            $proyectos[$id_proyecto] = [
                'id_proyecto' => $fila['id_proyecto'],
                'titulo_tarjeta' => $fila['titulo_tarjeta'],
                'descripcion_tarjeta' => $fila['descripcion_tarjeta'],
                'fecha' => $fila['fecha'],
            ];
        }
    }

    echo json_encode([
        'success' => true,
        'data' => array_values($proyectos)
    ], JSON_UNESCAPED_UNICODE);
    exit;
    
} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Error al obtener proyectos',
        'message' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
    exit;
}
?>

