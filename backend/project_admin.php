<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

include 'conexion.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET': // Leer proyectos
        obtenerProyectos($conn);
        break;

    case 'POST': // Crear un nuevo proyecto
        crearProyecto($conn);
        break;

    case 'DELETE': // Eliminar un proyecto
        eliminarProyecto($conn);
        break;

    default:
        echo json_encode(["mensaje" => "Método no permitido"]);
        break;
}

// Función para obtener todos los proyectos
function obtenerProyectos($conn) {
    $sql = "SELECT id_proyecto, titulo_tarjeta, descripcion_tarjeta, fecha FROM proyectos";
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $proyectos = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($proyectos, JSON_UNESCAPED_UNICODE);
}

// Función para crear un nuevo proyecto
function crearProyecto($conn) {
    $data = json_decode(file_get_contents("php://input"), true);

    if (!isset($data['titulo_tarjeta']) || !isset($data['descripcion_tarjeta']) || !isset($data['fecha'])) {
        echo json_encode(["mensaje" => "Datos incompletos"]);
        return;
    }

    $sql = "INSERT INTO proyectos (titulo_tarjeta, descripcion_tarjeta, fecha) VALUES (:titulo, :descripcion, :fecha)";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':titulo', $data['titulo_tarjeta']);
    $stmt->bindParam(':descripcion', $data['descripcion_tarjeta']);
    $stmt->bindParam(':fecha', $data['fecha']);

    if ($stmt->execute()) {
        echo json_encode(["mensaje" => "Proyecto creado correctamente", "id_proyecto" => $conn->lastInsertId()]);
    } else {
        echo json_encode(["mensaje" => "Error al crear el proyecto"]);
    }
}

// Función para eliminar un proyecto
function eliminarProyecto($conn) {
    // Obtener el ID del proyecto desde la URL
    $id_proyecto = $_GET['id_proyecto'] ?? null;

    if (!$id_proyecto) {
        echo json_encode(["mensaje" => "ID del proyecto requerido"]);
        return;
    }

    $sql = "DELETE FROM proyectos WHERE id_proyecto = :id";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':id', $id_proyecto, PDO::PARAM_INT);

    if ($stmt->execute()) {
        echo json_encode(["mensaje" => "Proyecto eliminado correctamente"]);
    } else {
        echo json_encode(["mensaje" => "Error al eliminar el proyecto"]);
    }
}
?>