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

    //Peso máximo de las imágenes
    $peso_maximo = 2 * 1024 * 1024;

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
        // Definir la carpeta de destino al mismo nivel que el backend
        $carpeta_destino = dirname(__DIR__) . "/assets/proyectos-img/";

        // Verificar si la carpeta existe, si no, crearla
        if (!is_dir($carpeta_destino)) {
            mkdir($carpeta_destino, 0777, true);
        }

        // Limpiar el nombre del proyecto para usarlo en los nombres de archivo
        $nombre_limpio = preg_replace('/[^a-zA-Z0-9]/', '', strtolower($titulo_proyecto));
        $contador = 1; // Inicia el contador para enumerar las imágenes

        foreach ($_FILES['imagenes']['tmp_name'] as $key => $tmp_name) {
            if (!empty($tmp_name)) {
                // Obtener la extensión del archivo (ej: .jpg, .png)
                $extension = pathinfo($_FILES['imagenes']['name'][$key], PATHINFO_EXTENSION);

                // Validar el tamaño del archivo
                if ($peso_archivo > $peso_maximo) {
                    if (ob_get_length()) { ob_clean(); }
                    echo json_encode([
                        'success' => false, 
                        'message' => "La imagen '{$$_FILES['imagenes']['name'][$key]}' supera el tamaño máximo permitido de 2 MB."
                    ]);
                    exit();
                }

                // Generar el nuevo nombre de archivo con numeración
                $nombre_archivo = "{$nombre_limpio}-" . str_pad($contador, 2, "0", STR_PAD_LEFT) . ".{$extension}";
                $ruta_destino = $carpeta_destino . $nombre_archivo;

                // Obtener la descripción de la imagen (si existe en el formulario)
                $descripcion = !empty($_POST['descripciones'][$key]) ? $_POST['descripciones'][$key] : "Sin descripción";

                // Mover el archivo a la carpeta destino
                if (move_uploaded_file($tmp_name, $ruta_destino)) {
                    // Guardar la ruta relativa en la base de datos
                    $ruta_relativa = "../assets/proyectos-img/" . $nombre_archivo; /* Gen10 */

                    // Insertar en la base de datos
                    $stmt = $conn->prepare("
                        INSERT INTO proyectos_detalles (tipo, descripcion, detalle, id_proyecto) 
                        VALUES ('imagen', ?, ?, ?)
                    ");
                    $stmt->execute([$descripcion, $ruta_relativa, $id_proyecto]);

                    $contador++; // Incrementar el número de la imagen
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
            $stmt->execute([$nombre_participante, $id_participante, $id_proyecto]);
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
