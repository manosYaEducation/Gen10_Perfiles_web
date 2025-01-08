<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

include 'conexion.php';

$profileid = isset($_GET['id']) ? $_GET['id'] : null;

try {
    if ($profileid !== null) {
        // Recupera información básica del perfil
        $stmt = $conn->prepare("SELECT name, location, phone, email, description, phrase FROM profile WHERE id = ?");
        $stmt->execute([$profileid]);
        $profile = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$profile) {
            echo json_encode(['success' => false, 'message' => 'Perfil no encontrado']);
            exit;
        }

        // Recupera la experiencia
        $stmtExp = $conn->prepare("SELECT title, startdate, enddate FROM experience WHERE profileid = ?");
        $stmtExp->execute([$profileid]);
        $experience = $stmtExp->fetchAll(PDO::FETCH_ASSOC);

        // Recupera la educación
        $stmtEdu = $conn->prepare("SELECT title, institution, startdate, enddate FROM education WHERE profileid = ?");
        $stmtEdu->execute([$profileid]);
        $education = $stmtEdu->fetchAll(PDO::FETCH_ASSOC);

        // Recupera las habilidades
        $stmtSkill = $conn->prepare("SELECT skill FROM skill WHERE profileid = ?");
        $stmtSkill->execute([$profileid]);
        $skill = $stmtSkill->fetchAll(PDO::FETCH_COLUMN);

        // Recupera los intereses
        $stmtInterest = $conn->prepare("SELECT interest FROM interest WHERE profileid = ?");
        $stmtInterest->execute([$profileid]);
        $interest = $stmtInterest->fetchAll(PDO::FETCH_COLUMN);

        // Recupera las redes sociales
        $stmtSocial = $conn->prepare("SELECT platform, url FROM social WHERE profileid = ?");
        $stmtSocial->execute([$profileid]);
        $social = $stmtSocial->fetchAll(PDO::FETCH_ASSOC);

        // Recupera la imagen del perfil
        $stmtImage = $conn->prepare("SELECT  nombre, tipo, imagen FROM imagenes WHERE profileid = ?");
        $stmtImage->execute([$profileid]);
        $imageData = $stmtImage->fetch(PDO::FETCH_ASSOC);

        // Recupera las reseñas
        $stmtReview = $conn->prepare("SELECT  nameClient , position, company, rating, comments FROM review WHERE profileid = ?");
        $stmtReview->execute([$profileid]);
        $review = $stmtReview->fetchAll(PDO::FETCH_ASSOC);

        $image = null;
        if ($imageData) {
            // Convierte la imagen en base64
            $image = 'data:' . $imageData['tipo'] . ';base64,' . base64_encode($imageData['imagen']);
        }

        // Estructura la respuesta JSON para un perfil específico
        $response = [
            'success' => true,
            'data' => [
                'basic' => $profile,
                'experience' => $experience,
                'education' => $education,
                'skill' => $skill,
                'interest' => $interest,
                'social' => $social,
                'review' => $review,
                
            ]
        ];
    } else {
        // Si no hay 'id', devuelve todos los perfiles
        $stmt = $conn->prepare("SELECT id, name, description, phrase FROM profile");
        $stmt->execute();
        $profiles = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if (!$profiles) {
            echo json_encode(['success' => false, 'message' => 'No se encontraron perfiles']);
            exit;
        }

        // Agrega las imágenes como base64 para cada perfil
        
        foreach ($profiles as &$profile) {
            $stmtImage = $conn->prepare("SELECT profileid ,tipo, imagen FROM imagenes WHERE profileid = ?");
            $stmtImage->execute([$profile['id']]);
            $imageData = $stmtImage->fetch(PDO::FETCH_ASSOC);

            $profile['image'] = $imageData 
                ? 'data:' . $imageData['tipo'] . ';base64,' . base64_encode($imageData['imagen'])
                : null; // Si no hay imagen, establece null
        }

        $response = [
            'success' => true,
            'profiles' => $profiles
        ];
    }

    echo json_encode($response);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
