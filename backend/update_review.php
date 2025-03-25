<?php

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