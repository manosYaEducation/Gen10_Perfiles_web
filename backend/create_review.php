<?php
/**
 * @OA\Post(
 *     path="/create_review.php",
 *     summary="Crear nueva reseña",
 *     description="Crea una nueva reseña para un perfil profesional",
 *     tags={"Reseñas"},
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             required={"statusid","profileid","nameClient","company","comments","rating","date_review"},
 *             @OA\Property(property="statusid", type="integer"),
 *             @OA\Property(property="profileid", type="integer"),
 *             @OA\Property(property="nameClient", type="string"),
 *             @OA\Property(property="company", type="string"),
 *             @OA\Property(property="comments", type="string"),
 *             @OA\Property(property="rating", type="integer", minimum=1, maximum=5),
 *             @OA\Property(property="date_review", type="string", format="date")
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Reseña creada exitosamente",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean"),
 *             @OA\Property(property="message", type="string")
 *         )
 *     ),
 *     @OA\Response(response=400, description="Datos JSON inválidos"),
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
$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode(['success' => false, 'message' => 'Datos JSON inválidos']);
    exit();
}

try {
    $conn->beginTransaction();
    $stmt = $conn->prepare("INSERT INTO review (statusid, profileid, nameClient, company, comments, rating, date_review) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([
        $data['statusid'],
        $data['profileid'],
        $data['nameClient'],
        $data['company'],
        $data['comments'],
        $data['rating'],
        $data['date_review']
    ]);
    $conn->commit();
    echo json_encode(['success' => true, 'message' => 'Reseña creada con éxito']);
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
