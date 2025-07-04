<?php
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
    $conn->beginTransaction(); // Comienza la transacción

    // Inserta en la tabla `profile`
    $stmt = $conn->prepare("INSERT INTO profile (name, location, phone, email, description,phrase) VALUES (?, ?, ?, ?, ?,?)");
    $stmt->execute([
        $data->basic->name,
        $data->basic->location,
        $data->basic->phone,
        $data->basic->email,
        $data->basic->description,
        $data->basic->phrase
    ]);
    $profileid = $conn -> lastInsertId(); // Obtiene el ID del perfil recién insertado

    // Inserta en la tabla `experience`  
    if (!empty($data->image)) {
        // Obtener la imagen en Base64 desde el JSON
        $base64Imagen = $data->image;
    
        // Validar formato de Base64 y determinar tipo de archivo
        if (strpos($base64Imagen, 'data:image/png;base64,') === 0) {
            $tipoArchivo = 'image/png';
            $base64Imagen = str_replace('data:image/png;base64,', '', $base64Imagen);
        } elseif (strpos($base64Imagen, 'data:image/jpeg;base64,') === 0) {
            $tipoArchivo = 'image/jpeg';
            $base64Imagen = str_replace('data:image/jpeg;base64,', '', $base64Imagen);
        } else {
            throw new Exception("Formato de imagen no soportado.");
        }
    
        // Decodificar la imagen de Base64 a binarios
        $binariosImagen = base64_decode($base64Imagen);
        if ($binariosImagen === false) {
            throw new Exception("No se pudo decodificar la imagen Base64.");
        }
    
        // Crear un nombre único para la imagen
        $nombreArchivo = 'imagen' . time() . '.png';
    
        // Preparar la consulta SQL para guardar la imagen
        $stmt = $conn->prepare("INSERT INTO imagenes (profileid, nombre, imagen, tipo) VALUES (:profileid, :nombre, :imagen, :tipo)");
        $stmt->bindParam(':profileid', $profileid, PDO::PARAM_INT);
        $stmt->bindParam(':nombre', $nombreArchivo, PDO::PARAM_STR);
        $stmt->bindParam(':imagen', $binariosImagen, PDO::PARAM_LOB);
        $stmt->bindParam(':tipo', $tipoArchivo, PDO::PARAM_STR);
    
        // Ejecutar la consulta
        if (!$stmt->execute()) {
            throw new Exception("Error al guardar la imagen en la base de datos.");
        }
    }else {
        // Si no se envía imagen, insertar imagen por defecto
        $rutaImagenDefecto = __DIR__ . '/../assets/img/default-profile.png';

        if (file_exists($rutaImagenDefecto)) {
            $binariosImagen = file_get_contents($rutaImagenDefecto);
            $tipoArchivo = mime_content_type($rutaImagenDefecto);
            $nombreArchivo = 'default-profile.png';

            $stmt = $conn->prepare("INSERT INTO imagenes (profileid, nombre, imagen, tipo) VALUES (:profileid, :nombre, :imagen, :tipo)");
            $stmt->bindParam(':profileid', $profileid, PDO::PARAM_INT);
            $stmt->bindParam(':nombre', $nombreArchivo, PDO::PARAM_STR);
            $stmt->bindParam(':imagen', $binariosImagen, PDO::PARAM_LOB);
            $stmt->bindParam(':tipo', $tipoArchivo, PDO::PARAM_STR);

            if (!$stmt->execute()) {
                throw new Exception("Error al guardar la imagen por defecto.");
            }
        } else {
            throw new Exception("La imagen por defecto no fue encontrada en: $rutaImagenDefecto");
        }
    }
    
foreach ($data->experience as $exp) {
    $stmtExperience = $conn->prepare("INSERT INTO experience (profileid, title, startDate, endDate) VALUES (?, ?, ?, ?)");
    $stmtExperience->execute([
        $profileid,
        $exp->experienceTitle,
        $exp->experienceStartDate,
        $exp->experienceEndDate
    ]);
}

    // Inserta en la tabla `education`
    foreach ($data->education as $edu) {
        $stmtEducation = $conn->prepare("INSERT INTO education (profileid, title, institution, startDate, endDate) VALUES (?, ?, ?, ?, ?)");
        $stmtEducation->execute([
            $profileid,
            $edu->educationTitle,
            $edu->educationInstitution,
            $edu->educationStartDate,
            $edu->educationEndDate
        ]);
    }

    // Inserta múltiples redes sociales (array)
    if (!empty($data->social) && is_array($data->social)) {
        $stmtSocial = $conn->prepare("INSERT INTO social (profileid, platform, url) VALUES (?, ?, ?)");
        foreach ($data->social as $net) {
            $stmtSocial->execute([
                $profileid,
                $net->platform,
                $net->url
            ]);
        }
    }

    // Inserta en la tabla `skill`
    $stmtSkill = $conn->prepare("INSERT INTO skill (profileid, skill) VALUES (?, ?)");
    $stmtSkill->execute([
        $profileid,
        $data->skill
    ]);

    // Inserta en la tabla `interest`
    $stmtInterest = $conn->prepare("INSERT INTO interest (profileid, interest) VALUES (?, ?)");
    $stmtInterest->execute([
        $profileid,
        $data->interest
    ]);

    $conn->commit(); // Confirma la transacción

    // Respuesta exitosa
    echo json_encode(['success' => true, 'message' => 'Usuario creado con éxito', 'profileid' => $profileid]);

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
