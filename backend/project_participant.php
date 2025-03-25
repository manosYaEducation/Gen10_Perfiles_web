<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

require_once __DIR__ . '/conexion.php';

try {
    $sql = "SELECT id, name FROM profile";
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($rows, JSON_UNESCAPED_UNICODE);
} catch (Exception $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
