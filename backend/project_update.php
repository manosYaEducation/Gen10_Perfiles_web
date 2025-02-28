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
    // Modificamos para aceptar tanto JSON como form-data
    $data = $_POST;
    if (empty($_POST)) {
        $data = json_decode(file_get_contents("php://input"), true);
    }

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

    // Modificar la eliminación para excluir participantes e imágenes
    $sqlLimpiar = "DELETE FROM proyectos_detalles WHERE id_proyecto = :id_proyecto AND tipo NOT IN ('participante', 'imagen')";
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

    // Procesar imágenes existentes
    if (isset($data['imagenes_existentes'])) {
        $imagenesExistentes = json_decode($data['imagenes_existentes'], true);
        
        if (!empty($imagenesExistentes)) {
            // Primero, eliminar las imágenes que ya no están en la lista
            $urls = array_map(function($img) { return $img['url']; }, $imagenesExistentes);
            $placeholders = str_repeat('?,', count($urls) - 1) . '?';
            
            $sqlLimpiarImagenes = "DELETE FROM proyectos_detalles 
                                  WHERE id_proyecto = ? 
                                  AND tipo = 'imagen' 
                                  AND detalle NOT IN ($placeholders)";
            
            $stmtLimpiarImagenes = $conn->prepare($sqlLimpiarImagenes);
            $stmtLimpiarImagenes->execute(array_merge([$data['id_proyecto']], $urls));
            
            // Actualizar descripciones de imágenes existentes
            $sqlUpdateImagen = "UPDATE proyectos_detalles 
                               SET descripcion = :descripcion 
                               WHERE id_proyecto = :id_proyecto 
                               AND tipo = 'imagen' 
                               AND detalle = :url";
            
            $stmtUpdateImagen = $conn->prepare($sqlUpdateImagen);
            foreach ($imagenesExistentes as $imagen) {
                $stmtUpdateImagen->execute([
                    ':descripcion' => $imagen['descripcion'],
                    ':id_proyecto' => $data['id_proyecto'],
                    ':url' => $imagen['url']
                ]);
            }
        }
    }

    // Se mantienen las imagenes existentes y se agregan nuevas
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

    // Procesar imágenes nuevas
    if (!empty($_FILES['imagenes'])) {
        $carpeta_destino = dirname(__DIR__) . "/assets/proyectos-img/";
        if (!is_dir($carpeta_destino)) {
            mkdir($carpeta_destino, 0777, true);
        }

        $nombre_limpio = preg_replace('/[^a-zA-Z0-9]/', '', strtolower($data['titulo_proyecto']));
        $contador = 1;

        foreach ($_FILES['imagenes']['tmp_name'] as $key => $tmp_name) {
            if (!empty($tmp_name)) {
                $extension = pathinfo($_FILES['imagenes']['name'][$key], PATHINFO_EXTENSION);
                $nombre_archivo = "{$nombre_limpio}-" . uniqid() . ".{$extension}";
                $ruta_destino = $carpeta_destino . $nombre_archivo;

                // Obtener la descripción correspondiente
                $descripcion = !empty($data['descripciones'][$key]) ? $data['descripciones'][$key] : "Sin descripción";

                if (move_uploaded_file($tmp_name, $ruta_destino)) {
                    $ruta_relativa = "/Gen10_Perfiles_Web/assets/proyectos-img/" . $nombre_archivo;
                    
                    $stmt = $conn->prepare("
                        INSERT INTO proyectos_detalles (id_proyecto, tipo, descripcion, detalle) 
                        VALUES (:id_proyecto, 'imagen', :descripcion, :url)
                    ");
                    $stmt->execute([
                        ':id_proyecto' => $data['id_proyecto'],
                        ':descripcion' => $descripcion,
                        ':url' => $ruta_relativa
                    ]);
                }
            }
        }
    }

    // Testimonios actualizados
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

    // Enlaces actualizados
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