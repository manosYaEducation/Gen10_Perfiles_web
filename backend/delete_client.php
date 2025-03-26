<?php
// Configuración de encabezados CORS y manejo de errores
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: DELETE, GET");

// Incluir archivo de conexión
require_once('conexion.php');

// Verificar si se proporcionó un ID de cliente
if (!isset($_GET['id']) || empty($_GET['id'])) {
    echo json_encode([
        'success' => false,
        'message' => 'ID de cliente no proporcionado'
    ]);
    exit;
}

$clientId = intval($_GET['id']);

try {
    // Iniciar transacción
    $conn->beginTransaction();

    // Primero, eliminar la imagen del cliente (si existe)
    $stmtImagen = $conn->prepare("DELETE FROM imagenes_clientes WHERE clienteid = :clientId");
    $stmtImagen->bindParam(':clientId', $clientId, PDO::PARAM_INT);
    $stmtImagen->execute();

    // Luego, eliminar el cliente de la tabla clients
    $stmtCliente = $conn->prepare("DELETE FROM clients WHERE id = :clientId");
    $stmtCliente->bindParam(':clientId', $clientId, PDO::PARAM_INT);
    $stmtCliente->execute();

    // Confirmar la transacción
    $conn->commit();

    // Respuesta de éxito
    echo json_encode([
        'success' => true,
        'message' => 'Cliente eliminado correctamente'
    ]);
} catch (PDOException $e) {
    // Revertir la transacción en caso de error
    $conn->rollBack();

    // Respuesta de error
    echo json_encode([
        'success' => false,
        'message' => 'Error al eliminar cliente: ' . $e->getMessage()
    ]);
    // Log del error para depuración
    error_log("Error al eliminar cliente: " . $e->getMessage());
}
