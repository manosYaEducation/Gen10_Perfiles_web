<?php
include("conexion.php");

if (isset($_POST["id"]) && !empty($_POST['id'])) {
    $profile_id = intval($_POST['id']);

    $conexion -> beginTransaction();

    try {
        $sql = "DELETE FROM profile WHERE id = :id";
        $stmt = $conexion->prepare($sql);
        $stmt->bindParam("id", $profile_id, PDO::PARAM_INT);
        $stmt->execute();

        $conexion -> commit();
        echo json_encode(['status' => 'success', 'message' => 'Perfil y registros relacionados eliminados correctamente.']);
    } catch (Exception $e) {
        
        $conexion->rollBack();
        echo json_encode(['status' => 'error', 'message' => 'Error al eliminar el perfil: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'ID de perfil no válido.']);
}
