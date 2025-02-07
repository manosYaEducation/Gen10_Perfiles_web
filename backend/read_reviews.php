<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

include 'conexion.php';

try {
/*     foreach */
    $stmt = $conn->prepare("SELECT R.id,
R.statusid, 
R.profileid, 
R.nameClient, 
R.company, 
R.rating, 
R.comments, 
R.date_review, 
B.name AS nombre_perfil, 
C.status AS estado_reseña
FROM review R LEFT JOIN profile B ON R.profileid = B.id LEFT JOIN status C ON R.statusid = C.id_status;");    
    $stmt->execute();
    $reviews = $stmt->fetchAll(PDO::FETCH_ASSOC);
    if (!$reviews){ 
        echo json_encode(['success' => false, 'message' => 'Mensaje de error, no hay reseñas' ]);
        exit;
    }
    $response = [
    'success' => true,
    'data' => [

        'reviews' => $reviews]]; 
    echo json_encode($response);

}
catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'error de ejemplo']);
}
?>