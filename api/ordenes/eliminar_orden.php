<?php
header('Content-Type: application/json');

// Configuración de la base de datos
$servername = "localhost";
$username = "alphadocere_modulo_3_pasos"; // Ajusta si tu usuario es diferente
$password = "pLYm6&6Z=O*V"; // Ajusta si tienes contraseña
$dbname = "alphadocere_modulo_3_pasos";

// Crear conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar conexión
if ($conn->connect_error) {
    // Enviar error como JSON y terminar
    echo json_encode(['success' => false, 'message' => 'Error de conexión: ' . $conn->connect_error]);
    die();
}

$response = ['success' => false, 'message' => 'Solicitud inválida.'];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $ordenId = isset($data['id']) ? $data['id'] : null;

    if ($ordenId) {
        // No es necesario verificar $conn aquí porque ya lo hicimos arriba y el script moriría si falla.
        $stmt = $conn->prepare("DELETE FROM modulo_3_pasos.ordenes WHERE id = ?");
        if ($stmt) {
            $stmt->bind_param("s", $ordenId); // Asumiendo que el ID es una cadena (ej: ORD-001)

            if ($stmt->execute()) {
                if ($stmt->affected_rows > 0) {
                    $response['success'] = true;
                    $response['message'] = 'Orden eliminada exitosamente.';
                } else {
                    $response['message'] = 'No se encontró la orden o ya fue eliminada.';
                }
            } else {
                $response['message'] = 'Error al ejecutar la eliminación: ' . $stmt->error;
            }
            $stmt->close();
        } else {
            $response['message'] = 'Error al preparar la consulta: ' . $conn->error;
        }
    } else {
        $response['message'] = 'ID de orden no proporcionado.';
    }
} else {
    $response['message'] = 'Método no permitido.';
}

$conn->close();
echo json_encode($response);
?>
