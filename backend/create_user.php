<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

include 'conexion.php'; // Asegúrate de que el archivo de conexión esté correcto

// Decodifica la entrada JSON
$data = json_decode(file_get_contents("php://input"));

try {
    // Validaciones
    if (empty($data->basic->name) || empty($data->basic->location) || empty($data->basic->phone) || empty($data->basic->email || empty($data->basic->description ?? null))) {
        throw new Exception("Todos los campos son obligatorios.");
    }

    if (!filter_var($data->basic->email, FILTER_VALIDATE_EMAIL)) {
        throw new Exception("El formato del correo electrónico es inválido.");
    }

    $conn->beginTransaction(); // Comienza la transacción

    // Inserta en la tabla `profile`
    $stmt = $conn->prepare("INSERT INTO profile (name, location, phone, email, description) VALUES (?, ?, ?, ?, ?) RETURNING id");
    $stmt->execute([
        $data->basic->name,
        $data->basic->location,
        $data->basic->phone,
        $data->basic->email,
        $data->basic->description ?? null
    ]);
    $id = $stmt->fetchColumn();

    // Si hay experiencia, inserta en la tabla `experience`
    if (!empty($data->experience)) {
        foreach ($data->experience as $exp) {
            $stmtExp = $conn->prepare("INSERT INTO experience (profileid, title, description, startDate, endDate) VALUES (?, ?, ?, ?, ?)");
            $stmtExp->execute([$profileId, $exp->title, $exp->description ?? null, $exp->startDate, $exp->endDate]);
        }
    }

    // Si hay educación, inserta en la tabla `education`
    if (!empty($data->education)) {
        foreach ($data->education as $edu) {
            $stmtEdu = $conn->prepare("INSERT INTO education (profileid, title, description, startDate, endDate) VALUES (?, ?, ?, ?, ?)");
            $stmtEdu->execute([$profileId, $edu->title, $edu->description ?? null, $edu->startDate, $edu->endDate]);
        }
    }

    $conn->commit(); // Confirma la transacción

    echo json_encode(['success' => true, 'message' => 'Usuario creado con éxito', 'profileid' => $profileId]);
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