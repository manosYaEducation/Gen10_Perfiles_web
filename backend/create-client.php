<?php
/**
 * @OA\Post(
 *     path="/create-client.php",
 *     summary="Crear nuevo cliente",
 *     description="Crea un nuevo cliente con información básica e imagen",
 *     tags={"Clientes"},
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             required={"basic"},
 *             @OA\Property(
 *                 property="basic",
 *                 type="object",
 *                 required={"name","company","email","location","phone","description"},
 *                 @OA\Property(property="name", type="string"),
 *                 @OA\Property(property="company", type="string"),
 *                 @OA\Property(property="email", type="string", format="email"),
 *                 @OA\Property(property="location", type="string"),
 *                 @OA\Property(property="phone", type="string"),
 *                 @OA\Property(property="description", type="string")
 *             ),
 *             @OA\Property(property="image", type="string", description="Imagen en formato base64 (opcional)")
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Cliente creado exitosamente",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean"),
 *             @OA\Property(property="message", type="string"),
 *             @OA\Property(property="clienteid", type="integer")
 *         )
 *     ),
 *     @OA\Response(response=400, description="Error en los datos enviados"),
 *     @OA\Response(response=500, description="Error del servidor")
 * )
 */
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

include 'conexion.php';

// Maneja las solicitudes OPTIONS para CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Decodifica la entrada JSON
$data = json_decode(file_get_contents("php://input"));

try {
    $conn->beginTransaction(); 

    
    $stmt = $conn->prepare("INSERT INTO clients (name, company, email, location, phone, description) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->execute([
        $data->basic->name,
        $data->basic->company,
        $data->basic->email,
        $data->basic->location,
        $data->basic->phone,
        $data->basic->description
    ]);
    $clienteid = $conn->lastInsertId(); 
    if (!empty($data->image)) {
        $base64Imagen = $data->image;
    
        
        if (strpos($base64Imagen, 'data:image/png;base64,') === 0) {
            $tipoArchivo = 'image/png';
            $base64Imagen = str_replace('data:image/png;base64,', '', $base64Imagen);
        } elseif (strpos($base64Imagen, 'data:image/jpeg;base64,') === 0) {
            $tipoArchivo = 'image/jpeg';
            $base64Imagen = str_replace('data:image/jpeg;base64,', '', $base64Imagen);
        } else {
            throw new Exception("Formato de imagen no soportado.");
        }
    
        $binariosImagen = base64_decode($base64Imagen);
        if ($binariosImagen === false) {
            throw new Exception("No se pudo decodificar la imagen Base64.");
        }
    
        
        $nombreArchivo = 'imagen' . time() . '.png';
    
        
        $stmt = $conn->prepare("INSERT INTO imagenes_clientes (clienteid, nombre, imagen, tipo) VALUES (:clienteid, :nombre, :imagen, :tipo)");
        $stmt->bindParam(':clienteid', $clienteid, PDO::PARAM_INT);
        $stmt->bindParam(':nombre', $nombreArchivo, PDO::PARAM_STR);
        $stmt->bindParam(':imagen', $binariosImagen, PDO::PARAM_STR);
        $stmt->bindParam(':tipo', $tipoArchivo, PDO::PARAM_STR);
    
        // Ejecutar la consulta
        if (!$stmt->execute()) {
            throw new Exception("Error al guardar la imagen en la base de datos.");
        }
    }

    $conn->commit(); // Confirma la transacción

    // Respuesta exitosa
    echo json_encode(['success' => true, 'message' => 'Usuario creado con éxito', 'clienteid' => $clienteid]);

} catch (Exception $e) {
    if ($conn->inTransaction()) {
        $conn->rollBack(); // Revierte la transacción en caso de error
    }
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
} catch (PDOException $e) {
    if ($conn->inTransaction()) {
        $conn->rollBack(); // Revierte la transacción en caso de error en la base de datos
    }
    echo json_encode(['success' => false, 'message' => 'Error en la base de datos: ' . $e->getMessage()]);
}