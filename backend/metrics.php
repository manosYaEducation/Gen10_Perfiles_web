<?php
header("Access-Control-Allow-Origin: *"); 

include 'conexion.php';

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
    'total_proyectos' => $resultProyectos['total_proyectos'],
    'total_profiles' => $resultProfiles['total_profiles'],
    'total_clients' => $resultClients['total_clients']
];
// Indica que la respuesta es en formato JSON
header('Content-Type: application/json');
// Convierte $metrics en JSON
echo json_encode($metrics, JSON_UNESCAPED_UNICODE);
exit;
?>
