<?php
header("Access-Control-Allow-Origin: *"); 
header('Content-Type: application/json');

include 'conexion.php';

try {
    // Hacer un COUNT(*) de PROYECTOS ---
    $sqlProyectos = "SELECT COUNT(*) AS total_proyectos FROM proyectos";
    $stmtProyectos = $conn->prepare($sqlProyectos);
    $stmtProyectos->execute();
    $resultProyectos = $stmtProyectos->fetch(PDO::FETCH_ASSOC);

    // Hacer un COUNT(*) de PERFILES ---
    $sqlProfiles = "SELECT COUNT(*) AS total_profiles FROM profile";
    $stmtProfiles = $conn->prepare($sqlProfiles);
    $stmtProfiles->execute();
    $resultProfiles = $stmtProfiles->fetch(PDO::FETCH_ASSOC);

    // Hacer un COUNT(*) de CLIENTES ---
    $sqlClients = "SELECT COUNT(*) AS total_clients FROM clients";
    $stmtClients = $conn->prepare($sqlClients);
    $stmtClients->execute();
    $resultClients = $stmtClients->fetch(PDO::FETCH_ASSOC);

    // Se arma un arreglo asociativo con los resultados de cada consulta SQL
    $metrics = [
        'success' => true,
        'total_proyectos' => $resultProyectos['total_proyectos'] ?? 0,
        'total_profiles' => $resultProfiles['total_profiles'] ?? 0,
        'total_clients' => $resultClients['total_clients'] ?? 0
    ];
    
    echo json_encode($metrics, JSON_UNESCAPED_UNICODE);
    exit;
    
} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Error al obtener métricas',
        'message' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
    exit;
}
?>
