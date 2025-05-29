<?php
// Configuración de encabezados para respuesta JSON
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Función para limpiar datos de entrada
function sanitizeInput($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

// Verificar que sea una solicitud POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Obtener y sanitizar los datos del formulario
    $nombre = isset($_POST['nombre']) ? sanitizeInput($_POST['nombre']) : '';
    $email = isset($_POST['email']) ? sanitizeInput($_POST['email']) : '';
    $telefono = isset($_POST['telefono']) ? sanitizeInput($_POST['telefono']) : '';
    $asunto = isset($_POST['asunto']) ? sanitizeInput($_POST['asunto']) : '';
    $mensaje = isset($_POST['mensaje']) ? sanitizeInput($_POST['mensaje']) : '';
    
    // Validar datos
    $errors = [];
    
    if (empty($nombre)) {
        $errors[] = "El nombre es obligatorio";
    }
    
    if (empty($email)) {
        $errors[] = "El correo electrónico es obligatorio";
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = "El formato del correo electrónico no es válido";
    }
    
    if (empty($asunto)) {
        $errors[] = "El asunto es obligatorio";
    }
    
    if (empty($mensaje)) {
        $errors[] = "El mensaje es obligatorio";
    }
    
    // Si hay errores, devolver respuesta de error
    if (!empty($errors)) {
        echo json_encode([
            'success' => false,
            'message' => 'Error en la validación del formulario',
            'errors' => $errors
        ]);
        exit;
    }
    
    // Configurar destinatario y asunto
    $to = "kreativegen10@gmail.com"; // Correo de destino
    $subject = "Nuevo mensaje de contacto: " . $asunto;
    
    // Construir el cuerpo del correo
    $email_body = "Has recibido un nuevo mensaje desde el formulario de contacto.\n\n".
                  "Detalles:\n\n".
                  "Nombre: $nombre\n".
                  "Email: $email\n".
                  "Teléfono: $telefono\n".
                  "Asunto: $asunto\n".
                  "Mensaje:\n$mensaje\n";
    
    // Configurar cabeceras del correo
    $headers = "From: $email\r\n";
    $headers .= "Reply-To: $email\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();
    
    // Intentar enviar el correo
    if (mail($to, $subject, $email_body, $headers)) {
        // Éxito al enviar el correo
        echo json_encode([
            'success' => true,
            'message' => 'Mensaje enviado correctamente'
        ]);
    } else {
        // Error al enviar el correo
        echo json_encode([
            'success' => false,
            'message' => 'Error al enviar el mensaje. Por favor, inténtelo de nuevo más tarde.'
        ]);
    }
} else {
    // No es una solicitud POST
    echo json_encode([
        'success' => false,
        'message' => 'Método de solicitud no válido'
    ]);
}
?>
