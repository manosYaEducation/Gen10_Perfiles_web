<?php
header('Content-Type: application/json');

$servername = "localhost";
$username = "root"; // Ajusta si tu usuario es diferente
$password = ""; // Ajusta si tienes contraseña
$dbname = "modulo_3_pasos";

// Crear conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar conexión
if ($conn->connect_error) {
    echo json_encode(['error' => 'Error de conexión: ' . $conn->connect_error]);
    die();
}

$sql = "SELECT id, nombre, apellido, correo, telefono, servicios_json, estado_pago, fecha_creacion FROM ordenes";
$result = $conn->query($sql);

$ordenes = [];

if ($result) {
    if ($result->num_rows > 0) {
        // Obtener datos de cada fila
        while($row = $result->fetch_assoc()) {
            $ordenes[] = $row;
        }
        echo json_encode($ordenes);
    } else {
        echo json_encode([]); // Enviar un array vacío si no hay órdenes
    }
} else {
    echo json_encode(['error' => 'Error en la consulta: ' . $conn->error]);
}

$conn->close();
?>
