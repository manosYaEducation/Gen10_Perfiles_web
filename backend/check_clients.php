<?php
/**
 * @OA\Get(
 *     path="/check_clients.php",
 *     summary="Verificar clientes",
 *     description="Obtiene información básica de clientes para verificación",
 *     tags={"Clientes"},
 *     @OA\Response(
 *         response=200,
 *         description="Información de clientes"
 *     ),
 *     @OA\Response(response=500, description="Error del servidor")
 * )
 */
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

include 'conexion.php';

try {
    // Consulta para contar clientes
    $stmt = $conn->prepare("SELECT COUNT(*) as total FROM clients");
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    
    // Consulta para obtener los primeros 5 clientes (para verificación)
    $stmtClients = $conn->prepare("SELECT id, name, company FROM clients LIMIT 5");
    $stmtClients->execute();
    $clients = $stmtClients->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'success' => true,
        'total_clients' => $result['total'],
        'sample_clients' => $clients
    ]);
} catch (PDOException $e) {
    echo json_encode([
        'success' => false, 
        'message' => 'Error en la base de datos: ' . $e->getMessage()
    ]);
}
?>
