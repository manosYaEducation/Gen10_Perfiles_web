<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

include 'conexion.php';     

if (isset($_GET['id']) && !empty($_GET['id'])) {
    $profile_id = intval($_GET['id']);  
    if ($profile_id > 0) {     
        try {        
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