<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once __DIR__ . '/conexion.php';

// Maneja solicitudes OPTIONS para CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {
    // Obtener el ID del usuario desde la URL
    $user_id = isset($_GET['user_id']) ? $_GET['user_id'] : null;
    
    if (!$user_id) {
        echo json_encode(["error" => "Se requiere el ID del usuario"]);
        exit();
    }

    // Consulta para obtener los proyectos donde el usuario es participante
    // Captura tanto 'participante' (datos viejos) como 'participante:estado' (datos nuevos)
    $sql = "
        SELECT DISTINCT 
            p.id_proyecto,
            p.titulo_tarjeta,
            p.descripcion_tarjeta,
            p.titulo_proyecto,
            p.fecha,
            p.ubicacion,
            p.contenido_proyecto
        FROM proyectos p
        INNER JOIN proyectos_detalles pd ON p.id_proyecto = pd.id_proyecto
        WHERE (pd.tipo = 'participante' OR pd.tipo LIKE 'participante:%') 
        AND pd.tipo NOT LIKE 'participante:eliminado'
        AND pd.detalle = ?
        ORDER BY p.fecha DESC
    ";
    
    $stmt = $conn->prepare($sql);
    $stmt->execute([$user_id]);
    $projects = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        "success" => true,
        "projects" => $projects
    ], JSON_UNESCAPED_UNICODE);
    
} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "error" => $e->getMessage()
    ]);
}
?>
