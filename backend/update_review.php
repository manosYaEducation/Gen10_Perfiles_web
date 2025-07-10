<?php
/**
 * @OA\Post(
 *     path="/update_review.php",
 *     summary="Actualizar estado de reseña",
 *     description="Actualiza el estado de una reseña (aprobación/rechazo)",
 *     tags={"Reseñas"},
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             required={"id","statusid"},
 *             @OA\Property(property="id", type="integer"),
 *             @OA\Property(property="statusid", type="integer")
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Reseña actualizada exitosamente",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean"),
 *             @OA\Property(property="message", type="string")
 *         )
 *     ),
 *     @OA\Response(response=400, description="ID de reseña obligatorio"),
 *     @OA\Response(response=500, description="Error del servidor")
 * )
 */

// Se incluye método PATCH para actualizar parcialmente la reseña
// de esta manera nos aseguramos que solo se cambie el estado y no el contenido que corresponde al cliente

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, PATCH, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

//Manejo de la conexión
require_once 'conexion.php';

try {
    //Se obtienen los datos de la solicitud
    $data = json_decode(file_get_contents("php://input"), true);

    //Se comprueba que el id de la reseña no esté vacío para evitar modificar todas las reseñas
    if (!$data || !isset($data['id'])) {
        throw new Exception('El ID de la reseña es obligatorio.');
    }

    //Se obtiene el id de la reseña y el estado de la reseña
    $reviewId = $data['id'];
    $statusId = $data['statusid'];

    //Iniciar transacción
    $conn->beginTransaction();

    //Se envia la consulta para actualizar el estado de la reseña
    $stmt = $conn->prepare("UPDATE review SET statusid = ? WHERE id = ?");

    //Se ejecuta la consulta
    $stmt->execute([$statusId, $reviewId]);

    //Se confirma la transacción
    $conn->commit();

    //Se envía mensaje de éxito
    echo json_encode(['success' => true, 'message' => 'Reseña actualizada correctamente']);

}catch (PDOException $e) {
    //En caso de error se envía mensaje de error
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}

?>