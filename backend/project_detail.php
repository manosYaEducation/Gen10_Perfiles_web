<?php
header("Access-Control-Allow-Origin: *"); // Permite solicitudes desde cualquier origen
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
include 'conexion.php';

// Verificar si se proporciona un ID de proyecto en la URL
if (!isset($_GET['id']) || empty($_GET['id'])) {
    echo json_encode(["error" => "ID de proyecto no proporcionado"]);
    exit;
}

$id_proyecto = intval($_GET['id']); // Convertir a entero para evitar inyección SQL

// Consulta para obtener el proyecto con el ID proporcionado
$sql = "SELECT p.id_proyecto,p.titulo_tarjeta, p.titulo_proyecto, p.descripcion_tarjeta, p.fecha, p.ubicacion, p.contenido_proyecto, 
               d.tipo, d.descripcion, d.detalle 
        FROM proyectos p
        LEFT JOIN proyectos_detalles d ON p.id_proyecto = d.id_proyecto
        WHERE p.id_proyecto = :id
        ORDER BY FIELD(
        d.tipo,
        'estado',
        'parrafo',
        'imagen',
        'participante',
        'participante_rol',
        'cliente',
        'testimonio',
        'enlace'
)";

$stmt = $conn->prepare($sql);
$stmt->bindParam(':id', $id_proyecto, PDO::PARAM_INT);
$stmt->execute();
$datos = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Reunir los roles de cada participante usando su ID
$rolesParticipantes = [];

foreach ($datos as $fila) {
    if ($fila['tipo'] === 'participante_rol') {
        $rolesParticipantes[$fila['detalle']] = $fila['descripcion'];
    }
}

// Agrupar los datos por proyecto
$proyectos = [];

foreach ($datos as $fila) {
    $id_proyecto = $fila['id_proyecto'];
    
    if (!isset($proyectos[$id_proyecto])) {
        $proyectos[$id_proyecto] = [
            'id_proyecto' => $fila['id_proyecto'],
            'titulo' => $fila['titulo_proyecto'],
            'titulo_tarjeta' => $fila['titulo_tarjeta'],
            'descripcion_tarjeta' => $fila['descripcion_tarjeta'],
            'fecha' => $fila['fecha'],
            'ubicacion' => $fila['ubicacion'],
            'contenido' => $fila['contenido_proyecto'],
            'detalles' => [
                'parrafos' => [],
                'imagenes' => [],
                'participantes' => [],
                'cliente' => [],
                'testimonios' => [],
                'enlaces' => [],
                'estado' => []
            ]
        ];
    }

    // Clasificar detalles por tipo
    // Extraer tipo base (antes del ':') para compatibilidad con 'participante:estado'
    $tipoBase = explode(':', $fila['tipo'])[0];
    
    switch ($tipoBase) {
        case 'parrafo':
            $proyectos[$id_proyecto]['detalles']['parrafos'][] = $fila['descripcion'];
            break;
        case 'imagen':
            $proyectos[$id_proyecto]['detalles']['imagenes'][] = [
                'descripcion' => $fila['descripcion'],
                'url' => $fila['detalle']
            ];
            break;
        case 'participante':
            // Capturar participantes (tanto 'participante' como 'participante:estado')
            $id_participante = $fila['detalle'];
            
            // Extraer estado del tipo (participante:a, participante:i, participante:l)
            // Si solo dice 'participante', usar fallback 'activo'
            $partes = explode(':', $fila['tipo']);
            $codigo_estado = isset($partes[1]) ? $partes[1] : 'a'; // Fallback a 'a' (activo) si no existe
            
            // Convertir código a estado completo
            $estado_map = ['a' => 'activo', 'i' => 'inactivo', 'l' => 'legacy', 'eliminado' => 'eliminado'];
            $estado = isset($estado_map[$codigo_estado]) ? $estado_map[$codigo_estado] : 'activo';
            
            // Saltar participantes eliminados
            if ($estado === 'eliminado') {
                break;
            }
            
            // **Consulta para obtener la imagen desde la base de datos**
            $sqlImg = "SELECT imagen FROM imagenes WHERE profileid = :profileid LIMIT 1";
            $stmtImg = $conn->prepare($sqlImg);
            $stmtImg->bindParam(':profileid', $id_participante, PDO::PARAM_INT);
            $stmtImg->execute();
            $imagen = $stmtImg->fetch(PDO::FETCH_ASSOC);
            
            // **Convertir BLOB a Base64**
            $imagen_base64 = "../assets/profile/default-profile.png"; // Imagen por defecto /* Gen10 */
            if ($imagen && !empty($imagen['imagen'])) {
                $imagen_base64 = "data:image/jpeg;base64," . base64_encode($imagen['imagen']);
            }
            
            $proyectos[$id_proyecto]['detalles']['participantes'][] = [
            'id' => $id_participante,
            'nombre' => $fila['descripcion'],
            'imagen' => $imagen_base64,
            'estado' => $estado,
            'rol' => $rolesParticipantes[$id_participante] ?? ''
];
            break;
        case 'cliente':
            $proyectos[$id_proyecto]['detalles']['cliente'][] = [
                'id' => $fila['detalle'],
                'name' => $fila['descripcion']
            ];
            break;
                        
        case 'testimonio':
            $proyectos[$id_proyecto]['detalles']['testimonios'][] = [
                'autor' => $fila['descripcion'],
                'contenido' => $fila['detalle']
            ];
            break;
        case 'enlace':
            $proyectos[$id_proyecto]['detalles']['enlaces'][] = [
                'descripcion' => $fila['descripcion'],
                'url' => $fila['detalle']
            ];
            break;
        case 'estado':
            $proyectos[$id_proyecto]['detalles']['estado'][] = $fila['descripcion'];
            break;
    }
}

header('Content-Type: application/json');
echo json_encode(array_values($proyectos), JSON_UNESCAPED_UNICODE);
exit;

?>

