<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Considera restringir esto en producción
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Para manejar la solicitud OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}

// Configuración de la base de datos (igual que en eliminar_orden.php)
$servername = "localhost";
$username = "alphadocere_modulo_3_pasos"; // Ajusta si tu usuario es diferente
$password = "pLYm6&6Z=O*V"; // Ajusta si tienes contraseña
$dbname = "alphadocere_modulo_3_pasos";

// Crear conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar conexión
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Error de conexión a la base de datos: ' . $conn->connect_error]);
    exit;
}

// Obtener los datos del cuerpo de la solicitud (JSON)
$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    echo json_encode(['success' => false, 'message' => 'No se recibieron datos o el formato es incorrecto.']);
    exit;
}

// Validar que los datos necesarios estén presentes
$id = $data['id'] ?? null;
$nombre = $data['nombre'] ?? null;
$apellido = $data['apellido'] ?? ''; // Apellido puede ser opcional o venir vacío
$correo = $data['correo'] ?? null;
$telefono = $data['telefono'] ?? null;
$estado = $data['estado'] ?? null; // Este es el 'estado_pago' o 'estado de la orden'

if (!$id || !$nombre || !$correo || !$estado) {
    echo json_encode(['success' => false, 'message' => 'Faltan datos requeridos (ID, nombre, correo, estado).']);
    exit;
}

// Preparar la consulta SQL para actualizar la orden
// Asegúrate que los nombres de las columnas coincidan con tu tabla 'ordenes'
// 'estado_pago' se usa aquí como ejemplo para el campo 'estado' del modal. Ajusta si es diferente.
$sql = "UPDATE ordenes SET nombre = ?, apellido = ?, correo = ?, telefono = ?, estado_pago = ? WHERE id = ?";

$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode(['success' => false, 'message' => 'Error al preparar la consulta: ' . $conn->error]);
    exit;
}

// Vincular parámetros: s = string, i = integer
// Ajusta los tipos si es necesario (ej. si id es string, usa 's' en lugar de 'i' al final)
$stmt->bind_param("sssssi", $nombre, $apellido, $correo, $telefono, $estado, $id);

if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
        echo json_encode(['success' => true, 'message' => 'Orden actualizada exitosamente.']);
    } else {
        // Esto puede ocurrir si no se encontró el ID o si los datos enviados son idénticos a los existentes
        echo json_encode(['success' => true, 'message' => 'La orden no fue modificada (puede que no exista o los datos sean iguales).']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Error al actualizar la orden: ' . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
