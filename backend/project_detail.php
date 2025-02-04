<?php
include 'conexion.php';

// Consulta para obtener todos los proyectos y sus detalles
$sql = "SELECT p.id_proyecto, p.titulo_proyecto, p.fecha, p.ubicacion, p.contenido_proyecto, 
               d.tipo, d.descripcion, d.detalle 
        FROM proyectos p
        LEFT JOIN proyectos_detalles d ON p.id_proyecto = d.id_proyecto
        ORDER BY p.id_proyecto, 
                 FIELD(d.tipo, 'parrafo', 'imagen', 'participante', 'testimonio', 'enlace')";

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
            'titulo' => $fila['titulo_proyecto'],
            'fecha' => $fila['fecha'],
            'ubicacion' => $fila['ubicacion'],
            'contenido' => $fila['contenido_proyecto'],
            'detalles' => [
                'parrafos' => [],
                'imagenes' => [],
                'participantes' => [],
                'testimonios' => [],
                'enlaces' => []
            ]
        ];
    }

    // Clasificar detalles por tipo
    switch ($fila['tipo']) {
        case 'parrafo':
            $proyectos[$id_proyecto]['detalles']['parrafos'][] = $fila['descripcion'];
            break;
        case 'imagen':
            $proyectos[$id_proyecto]['detalles']['imagenes'][] = $fila['detalle']; // URL de la imagen
            break;
        case 'participante':
            $proyectos[$id_proyecto]['detalles']['participantes'][] = [
                'id' => $fila['descripcion'],
                'nombre' => $fila['detalle']
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
    }
}

header('Content-Type: application/json');
echo json_encode(array_values($proyectos), JSON_UNESCAPED_UNICODE);
exit;

?>

