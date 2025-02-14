<?php
ob_start();

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'conexion.php';

try {
    $data = json_decode(file_get_contents("php://input"), true);

    if (!isset($data['id_proyecto'])) {
        throw new Exception("ID del proyecto requerido");
    }

    $conn->beginTransaction();

    $sql = "UPDATE proyectos SET 
            titulo_tarjeta = :titulo_tarjeta,
            descripcion_tarjeta = :descripcion_tarjeta,
            titulo_proyecto = :titulo_proyecto,
            fecha = :fecha,
            ubicacion = :ubicacion,
            contenido_proyecto = :contenido_proyecto
            WHERE id_proyecto = :id_proyecto";
    
    $stmt = $conn->prepare($sql);
    $stmt->execute([
        'titulo_tarjeta' => $data['titulo_tarjeta'],
        'descripcion_tarjeta' => $data['descripcion_tarjeta'],
        'titulo_proyecto' => $data['titulo_proyecto'],
        'fecha' => $data['fecha'],
        'ubicacion' => $data['ubicacion'],
        'contenido_proyecto' => $data['contenido_proyecto'],
        'id_proyecto' => $data['id_proyecto']
    ]);

    // Modificar la eliminación para excluir participantes
    $sqlLimpiar = "DELETE FROM proyectos_detalles WHERE id_proyecto = :id_proyecto AND tipo != 'participante'";
    $stmtLimpiar = $conn->prepare($sqlLimpiar);
    $stmtLimpiar->execute([':id_proyecto' => $data['id_proyecto']]);

    // Insertar párrafos actualizados
    if (!empty($data['parrafos'])) {
        $sqlParrafos = "INSERT INTO proyectos_detalles (id_proyecto, tipo, descripcion) 
                        VALUES (:id_proyecto, 'parrafo', :descripcion)";
        $stmtParrafos = $conn->prepare($sqlParrafos);
        foreach ($data['parrafos'] as $parrafo) {
            if (!empty($parrafo)) {
                $stmtParrafos->execute([
                    ':id_proyecto' => $data['id_proyecto'],
                    ':descripcion' => $parrafo
                ]);
            }
        }
    }

    // Insertar imágenes actualizadas
    if (!empty($data['imagenes_url'])) {
        $sqlImagenes = "INSERT INTO proyectos_detalles (id_proyecto, tipo, descripcion, detalle) 
                        VALUES (:id_proyecto, 'imagen', :descripcion, :url)";
        $stmtImagenes = $conn->prepare($sqlImagenes);
        
        for ($i = 0; $i < count($data['imagenes_url']); $i++) {
            if (!empty($data['imagenes_url'][$i])) {
                $stmtImagenes->execute([
                    ':id_proyecto' => $data['id_proyecto'],
                    ':descripcion' => $data['imagenes_descripcion'][$i] ?? 'Sin descripción',
                    ':url' => $data['imagenes_url'][$i]
                ]);
            }
        }
    }

    // Insertar testimonios actualizados
    if (!empty($data['testimonios_autor'])) {
        $sqlTestimonios = "INSERT INTO proyectos_detalles (id_proyecto, tipo, descripcion, detalle) 
                          VALUES (:id_proyecto, 'testimonio', :autor, :contenido)";
        $stmtTestimonios = $conn->prepare($sqlTestimonios);
        
        for ($i = 0; $i < count($data['testimonios_autor']); $i++) {
            if (!empty($data['testimonios_autor'][$i]) && !empty($data['testimonios_contenido'][$i])) {
                $stmtTestimonios->execute([
                    ':id_proyecto' => $data['id_proyecto'],
                    ':autor' => $data['testimonios_autor'][$i],
                    ':contenido' => $data['testimonios_contenido'][$i]
                ]);
            }
        }
    }

    // Insertar enlaces actualizados
    if (!empty($data['enlaces_descripcion'])) {
        $sqlEnlaces = "INSERT INTO proyectos_detalles (id_proyecto, tipo, descripcion, detalle) 
                       VALUES (:id_proyecto, 'enlace', :descripcion, :url)";
        $stmtEnlaces = $conn->prepare($sqlEnlaces);
        
        for ($i = 0; $i < count($data['enlaces_descripcion']); $i++) {
            if (!empty($data['enlaces_descripcion'][$i]) && !empty($data['enlaces_url'][$i])) {
                $stmtEnlaces->execute([
                    ':id_proyecto' => $data['id_proyecto'],
                    ':descripcion' => $data['enlaces_descripcion'][$i],
                    ':url' => $data['enlaces_url'][$i]
                ]);
            }
        }
    }

    // Actualizar participantes (primero eliminar los existentes)
    if (isset($data['participantes'])) {
        // Eliminar participantes existentes
        $sqlEliminarParticipantes = "DELETE FROM proyectos_detalles WHERE id_proyecto = :id_proyecto AND tipo = 'participante'";
        $stmtEliminarParticipantes = $conn->prepare($sqlEliminarParticipantes);
        $stmtEliminarParticipantes->execute([':id_proyecto' => $data['id_proyecto']]);

        $participantes = is_string($data['participantes']) ? json_decode($data['participantes'], true) : $data['participantes'];
        
        if (!empty($participantes)) {
            $sqlParticipantes = "INSERT INTO proyectos_detalles (id_proyecto, tipo, descripcion, detalle) 
                                VALUES (:id_proyecto, 'participante', :nombre, :id_participante)";
            $stmtParticipantes = $conn->prepare($sqlParticipantes);
            
            foreach ($participantes as $participante) {
                if (!empty($participante['id'])) {
                    $stmtParticipantes->execute([
                        ':id_proyecto' => $data['id_proyecto'],
                        ':nombre' => $participante['nombre'],
                        ':id_participante' => $participante['id']
                    ]);
                }
            }
        }
    }

    $conn->commit();

    if (ob_get_length()) ob_clean();
    echo json_encode([
        "success" => true, 
        "mensaje" => "Proyecto actualizado correctamente",
        "id" => $data['id_proyecto']
    ]);

} catch (Exception $e) {
    if ($conn->inTransaction()) {
        $conn->rollBack();
    }
    if (ob_get_length()) ob_clean();
    echo json_encode([
        "success" => false, 
        "mensaje" => "Error al actualizar el proyecto: " . $e->getMessage()
    ]);
}

ob_end_flush();
?>