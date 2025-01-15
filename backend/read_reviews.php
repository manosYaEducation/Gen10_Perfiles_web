<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

include 'conexion.php';

/* $reviewid = isset($_GET['id']) ? $_GET['id'] : null; */
/* $reviewid = 1; */
    // Recupera información básica del perfil
    /* $stmt = $conn->prepare("SELECT statusid, profileid, nameClient, company, rating, comments, date_review FROM review WHERE id = ?"); */

/* $stmt->execute([$reviewid]); */




try {
/*     foreach */
    $stmt = $conn->prepare("SELECT statusid, profileid, nameClient, company, rating, comments, date_review FROM review");    
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
    


    
/*     $stmtReview = $conn->prepare("SELECT statusid, profileid, nameClient , company, rating, comments, date_review FROM review WHERE profileid = ?");
    $stmtReview->execute([$revieweid]);
    $review = $stmtReview->fetchAll(PDO::FETCH_ASSOC); */
/*     if (!$review) {
        echo json_encode(['success' => false, 'message' => 'Perfil no encontrado']);
        exit; */

}
catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'error de ejemplo']);
}



/*     $stmtReview = $conn->prepare("SELECT statusid, profileid, nameClient , company, rating, comments, date_review FROM review WHERE profileid = ?");
    $stmtReview->execute([$revieweid]);
    $review = $stmtReview->fetchAll(PDO::FETCH_ASSOC);
    if (!$review) {
    echo json_encode(['success' => false, 'message' => 'Perfil no encontrado']);
    exit;
    }
    $response = [
    'success' => true,
    'data' => [

        'review' => $review,
        
    ]
    ]; 

    echo json_encode($response);
 */    


?>