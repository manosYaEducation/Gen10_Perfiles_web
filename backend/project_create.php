<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

include 'conexion.php';

// Maneja solicitudes OPTIONS para CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {
    $conn->beginTransaction();

    // ** Recoger datos del formulario (POST en lugar de JSON) **
    $titulo_tarjeta = $_POST['titulo_tarjeta'] ?? null;
    $descripcion_tarjeta = $_POST['descripcion_tarjeta'] ?? null;
    $titulo_proyecto = $_POST['titulo_proyecto'] ?? null;
    $fecha = $_POST['fecha'] ?? null;
    $ubicacion = $_POST['ubicacion'] ?? null;
    $contenido_proyecto = $_POST['contenido_proyecto'] ?? null;

    // ** Verificar que los datos obligatorios existen **
    if (!$titulo_tarjeta || !$descripcion_tarjeta || !$titulo_proyecto || !$fecha || !$contenido_proyecto) {
        echo json_encode(['success' => false, 'message' => 'Faltan datos obligatorios']);
        exit();
    }

    // ** Inserta el Proyecto Principal **
    $stmt = $conn->prepare("INSERT INTO proyectos (titulo_tarjeta, descripcion_tarjeta, titulo_proyecto, fecha, ubicacion, contenido_proyecto) 
                            VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->execute([$titulo_tarjeta, $descripcion_tarjeta, $titulo_proyecto, $fecha, $ubicacion, $contenido_proyecto]);

    $id_proyecto = $conn->lastInsertId(); // ID del proyecto recién insertado

    // ** Guardar Párrafos **
    if (!empty($_POST['parrafos'])) {
        foreach ($_POST['parrafos'] as $parrafo) {
            $stmt = $conn->prepare("INSERT INTO proyectos_detalles (tipo, descripcion, id_proyecto) VALUES ('parrafo', ?, ?)");
            $stmt->execute([$parrafo, $id_proyecto]);
        }
    }

    // ** Guardar Imágenes **
    if (!empty($_FILES['imagenes']['name'][0])) {
        $carpeta_destino = "../uploads/imagenes/";
        foreach ($_FILES['imagenes']['tmp_name'] as $key => $tmp_name) {
            $nombre_archivo = basename($_FILES['imagenes']['name'][$key]);
            $ruta_destino = $carpeta_destino . $nombre_archivo;
            move_uploaded_file($tmp_name, $ruta_destino);

            $stmt = $conn->prepare("INSERT INTO proyectos_detalles (tipo, descripcion, detalle, id_proyecto) VALUES ('imagen', ?, ?, ?)");
            $stmt->execute([$nombre_archivo, $ruta_destino, $id_proyecto]);
        }
    }

    // ** Guardar Participantes (corregido) **
    if (!empty($_POST['participantes'])) {
        foreach ($_POST['participantes'] as $id_participante => $nombre_participante) {
            $stmt = $conn->prepare("INSERT INTO proyectos_detalles (tipo, descripcion, detalle, id_proyecto) VALUES ('participante', ?, ?, ?)");
            $stmt->execute([$id_participante, $nombre_participante, $id_proyecto]);
        }
    }

    // ** Guardar Enlaces (corregido) **
    if (!empty($_POST['enlaces'])) {
        foreach ($_POST['enlaces'] as $descripcion_enlace => $enlace) {
            $stmt = $conn->prepare("INSERT INTO proyectos_detalles (tipo, descripcion, detalle, id_proyecto) VALUES ('enlace', ?, ?, ?)");
            $stmt->execute([$descripcion_enlace, $enlace, $id_proyecto]);
        }
    }

    // ** Guardar Testimonios (corregido) **
    if (!empty($_POST['testimonios'])) {
        foreach ($_POST['testimonios'] as $autor_testimonio => $testimonio) {
            $stmt = $conn->prepare("INSERT INTO proyectos_detalles (tipo, descripcion, detalle, id_proyecto) VALUES ('testimonio', ?, ?, ?)");
            $stmt->execute([$autor_testimonio, $testimonio, $id_proyecto]);
        }
    }

    $conn->commit();
    echo json_encode(['success' => true, 'message' => 'Proyecto creado con éxito']);

} catch (PDOException $e) {
    if ($conn->inTransaction()) {
        $conn->rollBack();
    }
    echo json_encode(['success' => false, 'message' => 'Error en la base de datos: ' . $e->getMessage()]);
} catch (Exception $e) {
    if ($conn->inTransaction()) {
        $conn->rollBack();
    }
    echo json_encode(['success' => false, 'message' => 'Error en el servidor: ' . $e->getMessage()]);
}
?>
