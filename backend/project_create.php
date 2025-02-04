<?php
ob_start(); // Inicia el buffer de salida

// (Opcional) Oculta la visualización de errores en pantalla para evitar HTML accidental
ini_set('display_errors', 0);
error_reporting(0);

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

    // Recoger datos del formulario
    $titulo_tarjeta = $_POST['titulo_tarjeta'] ?? null;
    $descripcion_tarjeta = $_POST['descripcion_tarjeta'] ?? null;
    $titulo_proyecto = $_POST['titulo_proyecto'] ?? null;
    $fecha = $_POST['fecha'] ?? null;
    $ubicacion = $_POST['ubicacion'] ?? null;
    $contenido_proyecto = $_POST['contenido_proyecto'] ?? null;

    // Verificar que los datos obligatorios existen
    if (!$titulo_tarjeta || !$descripcion_tarjeta || !$titulo_proyecto || !$fecha || !$contenido_proyecto) {
        if (ob_get_length()) { ob_clean(); } // Limpiar cualquier salida previa
        echo json_encode(['success' => false, 'message' => 'Faltan datos obligatorios']);
        exit();
    }

    // Inserta el Proyecto Principal
    $stmt = $conn->prepare("
        INSERT INTO proyectos 
        (titulo_tarjeta, descripcion_tarjeta, titulo_proyecto, fecha, ubicacion, contenido_proyecto) 
        VALUES (?, ?, ?, ?, ?, ?)
    ");
    $stmt->execute([
        $titulo_tarjeta, 
        $descripcion_tarjeta, 
        $titulo_proyecto, 
        $fecha, 
        $ubicacion, 
        $contenido_proyecto
    ]);

    $id_proyecto = $conn->lastInsertId(); // ID del proyecto recién insertado

    // Guardar Párrafos (vienen como array desde name="parrafos[]")
    if (!empty($_POST['parrafos']) && is_array($_POST['parrafos'])) {
        foreach ($_POST['parrafos'] as $parrafo) {
            $stmt = $conn->prepare("
                INSERT INTO proyectos_detalles (tipo, descripcion, id_proyecto) 
                VALUES ('parrafo', ?, ?)
            ");
            $stmt->execute([$parrafo, $id_proyecto]);
        }
    }

    // Guardar Imágenes (permitiendo subir múltiples imágenes)
    if (!empty($_FILES['imagenes']['name'][0])) {
        // Usamos ruta absoluta para la carpeta destino
        $carpeta_destino = __DIR__ . "/../assets/proyectos-img/";
        if (!is_dir($carpeta_destino)) {
            mkdir($carpeta_destino, 0777, true);
        }
        foreach ($_FILES['imagenes']['tmp_name'] as $key => $tmp_name) {
            if (!empty($tmp_name)) {
                $nombre_archivo = basename($_FILES['imagenes']['name'][$key]);
                $ruta_destino = $carpeta_destino . $nombre_archivo;
                if (move_uploaded_file($tmp_name, $ruta_destino)) {
                    $stmt = $conn->prepare("
                        INSERT INTO proyectos_detalles (tipo, descripcion, detalle, id_proyecto) 
                        VALUES ('imagen', ?, ?, ?)
                    ");
                    // Se guarda el nombre y la ruta (puedes almacenar la ruta relativa si lo prefieres)
                    $stmt->execute([$nombre_archivo, $ruta_destino, $id_proyecto]);
                }
            }
        }
    }

    // Guardar Participantes (enviados como participantes[id_participante] => nombre)
    if (!empty($_POST['participantes']) && is_array($_POST['participantes'])) {
        foreach ($_POST['participantes'] as $id_participante => $nombre_participante) {
            $stmt = $conn->prepare("
                INSERT INTO proyectos_detalles (tipo, descripcion, detalle, id_proyecto) 
                VALUES ('participante', ?, ?, ?)
            ");
            $stmt->execute([$id_participante, $nombre_participante, $id_proyecto]);
        }
    }

    // Guardar Enlaces (descripciones_enlaces[] y enlaces[])
    if (!empty($_POST['descripciones_enlaces']) && is_array($_POST['descripciones_enlaces'])
        && !empty($_POST['enlaces']) && is_array($_POST['enlaces'])) {
        
        $countEnlaces = min(count($_POST['descripciones_enlaces']), count($_POST['enlaces']));
        for ($i = 0; $i < $countEnlaces; $i++) {
            $descripcion_enlace = $_POST['descripciones_enlaces'][$i];
            $enlace = $_POST['enlaces'][$i];
            $stmt = $conn->prepare("
                INSERT INTO proyectos_detalles (tipo, descripcion, detalle, id_proyecto) 
                VALUES ('enlace', ?, ?, ?)
            ");
            $stmt->execute([$descripcion_enlace, $enlace, $id_proyecto]);
        }
    }

    // Guardar Testimonios (autores_testimonios[] y testimonios[])
    if (!empty($_POST['autores_testimonios']) && is_array($_POST['autores_testimonios'])
        && !empty($_POST['testimonios']) && is_array($_POST['testimonios'])) {
        
        // Suponemos que la cantidad de autores y testimonios son iguales o tomamos el mínimo.
        $countTestimonios = min(count($_POST['autores_testimonios']), count($_POST['testimonios']));
        for ($i = 0; $i < $countTestimonios; $i++) {
            $autor_testimonio = $_POST['autores_testimonios'][$i];
            $testimonio = $_POST['testimonios'][$i];
            $stmt = $conn->prepare("
                INSERT INTO proyectos_detalles (tipo, descripcion, detalle, id_proyecto) 
                VALUES ('testimonio', ?, ?, ?)
            ");
            $stmt->execute([$autor_testimonio, $testimonio, $id_proyecto]);
        }
    }

    $conn->commit();

    // Limpiamos cualquier salida previa y devolvemos JSON limpio
    if (ob_get_length()) { ob_clean(); }
    echo json_encode([
        'success' => true, 
        'message' => 'Proyecto creado con éxito',
        // Si quieres devolver un id para ver el proyecto: 
        'id' => $id_proyecto 
    ]);

} catch (PDOException $e) {
    if ($conn->inTransaction()) {
        $conn->rollBack();
    }
    if (ob_get_length()) { ob_clean(); }
    echo json_encode(['success' => false, 'message' => 'Error en la base de datos: ' . $e->getMessage()]);
} catch (Exception $e) {
    if ($conn->inTransaction()) {
        $conn->rollBack();
    }
    if (ob_get_length()) { ob_clean(); }
    echo json_encode(['success' => false, 'message' => 'Error en el servidor: ' . $e->getMessage()]);
}

ob_end_flush();
?>
