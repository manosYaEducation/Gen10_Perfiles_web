<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

include 'conexion.php';

$clientid = isset($_GET['id']) ? $_GET['id'] : null;

try {
    if ($clientid !== null) {
        // Recupera información básica del cliente
        $stmt = $conn->prepare("SELECT id, name, company, email, location, phone, description FROM clients WHERE id = ?");
        $stmt->execute([$clientid]);
        $client = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$client) {
            echo json_encode(['success' => false, 'message' => 'Cliente no encontrado']);
            exit;
        }

        // Recupera la imagen del cliente
        $stmtImage = $conn->prepare("SELECT nombre, tipo, imagen FROM imagenes_clientes WHERE clienteid = ?");
        $stmtImage->execute([$clientid]);
        $imageData = $stmtImage->fetch(PDO::FETCH_ASSOC);

        $image = null;
        if ($imageData) {
            // Convierte la imagen en base64
            $image = 'data:' . $imageData['tipo'] . ';base64,' . base64_encode($imageData['imagen']);
        }else {
            // Si no hay imagen personalizada, usar la imagen por defecto
            $rutaImagenDefecto = __DIR__ . '/../assets/img/default-profile.png';
            if (file_exists($rutaImagenDefecto)) {
                $binariosImagen = file_get_contents($rutaImagenDefecto);
                $tipoArchivo = mime_content_type($rutaImagenDefecto);
                $image = 'data:' . $tipoArchivo . ';base64,' . base64_encode($binariosImagen);
            } else {
                $image = null; // O puedes poner una URL pública si prefieres
            }
        }

        


        // Estructura la respuesta JSON para un cliente específico
        $response = [
            'success' => true,
            'data' => [
                'basic' => $client,
                'image' => $image
            ]
        ];
    } else {
        // Si no hay 'id', devuelve todos los clientes
        $stmt = $conn->prepare("SELECT id, name, company, description FROM clients");
        $stmt->execute();
        $clients = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if (!$clients) {
            echo json_encode(['success' => false, 'message' => 'No se encontraron clientes']);
            exit;
        }

        // Agrega las imágenes como base64 para cada cliente
        foreach ($clients as &$client) {
            $stmtImage = $conn->prepare("SELECT nombre, tipo, imagen FROM imagenes_clientes WHERE clienteid = ?");
            $stmtImage->execute([$client['id']]);
            $imageData = $stmtImage->fetch(PDO::FETCH_ASSOC);
            
            if ($imageData) {
                $client['image'] = 'data:' . $imageData['tipo'] . ';base64,' . base64_encode($imageData['imagen']);
            } else {
                 $rutaImagenDefecto = __DIR__ . '/../assets/img/default-profile.png';
                  if (file_exists($rutaImagenDefecto)) {
                    $binariosImagen = file_get_contents($rutaImagenDefecto);
                    $tipoArchivo = mime_content_type($rutaImagenDefecto);
                    $client['image'] = 'data:' . $tipoArchivo . ';base64,' . base64_encode($binariosImagen);
                } else {
                    $client['image'] = null;
            }
}
        }

        $response = [
            'success' => true,
            'clients' => $clients
        ];
    }

    echo json_encode($response, JSON_UNESCAPED_UNICODE);
    exit;
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Error al obtener clientes',
        'message' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
    exit;
}
?>