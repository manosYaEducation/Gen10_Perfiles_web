<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, PUT, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Manejo de preflight (CORS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Incluir el archivo de conexión
require_once 'conexion.php';

try {
    // Obtener datos de la solicitud
    $data = json_decode(file_get_contents("php://input"), true);

    if (!$data || !isset($data['id'])) {
        throw new Exception('El ID de usuario es obligatorio.');
    }

    $clienteId = $data['id'];
    $basic = $data['basic'];
    // Iniciar transacción
    $conn->beginTransaction();

    // Actualizar datos básicos
    $stmt = $conn->prepare("UPDATE clients SET name = ?, company = ?, email = ?, location = ?, phone = ?,  description = ?  WHERE id = ?");
    $stmt->execute([
        $basic['name'], 
        $basic['company'],
        $basic['email'], 
        $basic['location'], 
        $basic['phone'], 
        $basic['description'], 
        
        $clienteId
    ]);

    // Actualizar la imagen si se proporciona una nueva
    if (isset($data['image']) && $data['image']) {
        // Obtener el tipo de imagen y los datos base64
        if (strpos($data['image'], 'data:image/png;base64,') === 0) {
            $tipoArchivo = 'image/png';
            $base64Imagen = str_replace('data:image/png;base64,', '', $data['image']);
        } elseif (strpos($data['image'], 'data:image/jpeg;base64,') === 0) {
            $tipoArchivo = 'image/jpeg';
            $base64Imagen = str_replace('data:image/jpeg;base64,', '', $data['image']);
        } else {
            throw new Exception("Formato de imagen no soportado.");
        }

        // Decodificar la imagen
        $binariosImagen = base64_decode($base64Imagen);
        if ($binariosImagen === false) {
            throw new Exception("No se pudo decodificar la imagen Base64.");
        }

        // Crear nombre único para la imagen
        $nombreArchivo = 'imagen_' . time() . '.png';

        // Primero intentar actualizar si existe
        $stmtCheckImage = $conn->prepare("SELECT clienteid FROM imagenes_clientes WHERE clienteid = ?");
        $stmtCheckImage->execute([$clienteId]);
        
        if ($stmtCheckImage->rowCount() > 0) {
            // Actualizar imagen existente
            $stmt = $conn->prepare("UPDATE imagenes_clientes SET nombre = ?, imagen = ?, tipo = ? WHERE clienteid = ?");
            $stmt->execute([$nombreArchivo, $binariosImagen, $tipoArchivo, $clienteId]);
        } else {
            // Insertar nueva imagen
            $stmt = $conn->prepare("INSERT INTO imagenes_clientes (clienteid, nombre, imagen, tipo) VALUES (?, ?, ?, ?)");
            $stmt->execute([$clienteId, $nombreArchivo, $binariosImagen, $tipoArchivo]);
        }
    }

    // Confirmar transacción
    $conn->commit();

    echo json_encode(['success' => true, 'message' => 'Datos actualizados correctamente.']);

} catch (Exception $e) {
    $conn->rollBack();
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>