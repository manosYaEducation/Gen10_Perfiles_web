<?php
/**
 * @OA\Get(
 *     path="/delete_user.php",
 *     summary="Eliminar perfil de usuario",
 *     description="Elimina un perfil de usuario y sus imágenes asociadas",
 *     tags={"Perfiles"},
 *     @OA\Parameter(
 *         name="id",
 *         in="query",
 *         description="ID del perfil a eliminar",
 *         required=true,
 *         @OA\Schema(type="integer")
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Usuario eliminado exitosamente",
 *         @OA\JsonContent(
 *             @OA\Property(property="status", type="string"),
 *             @OA\Property(property="message", type="string")
 *         )
 *     ),
 *     @OA\Response(response=400, description="ID no válido o no proporcionado"),
 *     @OA\Response(response=500, description="Error al eliminar el usuario")
 * )
 */
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

include 'conexion.php';     

if (isset($_GET['id']) && !empty($_GET['id'])) {
    $profile_id = intval($_GET['id']);  
    if ($profile_id > 0) {     
        try {        
            $sqlDeleteImages = "DELETE FROM imagenes WHERE profileid = :id";
            $stmtImages = $conn->prepare($sqlDeleteImages);
            $stmtImages->bindParam(':id', $profile_id, PDO::PARAM_INT);
            $stmtImages->execute();
            
            $sql = "DELETE FROM profile WHERE id = :id";
            $stmt = $conn->prepare($sql);  
            $stmt->bindParam(':id', $profile_id, PDO::PARAM_INT);
            $stmt->execute();
            if ($stmt->rowCount() > 0) {
                echo json_encode([
                    'status' => 'success',
                    'message' => 'Usuario eliminado con éxito.'
                ]);
            } else {
                echo json_encode([
                    'status' => 'error',
                    'message' => 'No se encontró el usuario con ese ID.'
                ]);
            }
        } catch (Exception $e) {
            echo json_encode([
                'status' => 'error',
                'message' => 'Error al eliminar el usuario: ' . $e->getMessage()
            ]);
        }
    } else {
        echo json_encode([
            'status' => 'error',
            'message' => 'ID no válido.'
        ]);
    }
} else {
    echo json_encode([
        'status' => 'error',
        'message' => 'No se ha proporcionado un ID de usuario.'
    ]);
}