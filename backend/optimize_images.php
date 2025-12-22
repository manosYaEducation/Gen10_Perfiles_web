<?php
/**
 * Script para optimizar imágenes en la base de datos
 * Reduce el tamaño de las imágenes manteniendo calidad
 * 
 * Uso: Ejecutar una sola vez: php backend/optimize_images.php
 */

include 'conexion.php';

set_time_limit(300); // 5 minutos

echo "=== Optimizador de Imágenes ===\n";
echo "Este script reducirá el tamaño de las imágenes almacenadas.\n\n";

try {
    // Obtener todas las imágenes
    $stmt = $conn->query("SELECT id, profileid, tipo, imagen FROM imagenes");
    $imagenes = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    $totalSize = 0;
    $optimizedSize = 0;
    $count = 0;
    
    foreach ($imagenes as $img) {
        $originalSize = strlen($img['imagen']);
        $totalSize += $originalSize;
        
        // Solo procesar imágenes JPEG y PNG
        if (!in_array($img['tipo'], ['image/jpeg', 'image/png'])) {
            echo "[SKIP] Imagen {$img['id']}: tipo no soportado\n";
            continue;
        }
        
        // Crear imagen temporal desde binario
        $imgResource = imagecreatefromstring($img['imagen']);
        if (!$imgResource) {
            echo "[ERROR] No se pudo cargar imagen {$img['id']}\n";
            continue;
        }
        
        // Comprimir imagen
        ob_start();
        if ($img['tipo'] === 'image/jpeg') {
            // JPEG con calidad 85 (buen balance)
            imagejpeg($imgResource, null, 85);
        } else {
            // PNG con compresión
            imagepng($imgResource, null, 9);
        }
        $optimizedBinary = ob_get_clean();
        imagedestroy($imgResource);
        
        $newSize = strlen($optimizedBinary);
        $optimizedSize += $newSize;
        
        // Solo actualizar si hay mejora
        if ($newSize < $originalSize) {
            $updateStmt = $conn->prepare("UPDATE imagenes SET imagen = ? WHERE id = ?");
            $updateStmt->execute([$optimizedBinary, $img['id']]);
            
            $reduction = round(((($originalSize - $newSize) / $originalSize) * 100), 2);
            echo "[OK] Imagen {$img['id']}: {$originalSize} → {$newSize} bytes (-{$reduction}%)\n";
            $count++;
        } else {
            echo "[SKIP] Imagen {$img['id']}: ya está optimizada\n";
        }
    }
    
    $totalReduction = round(((($totalSize - $optimizedSize) / $totalSize) * 100), 2);
    echo "\n=== Resultado ===\n";
    echo "Imágenes procesadas: {$count}\n";
    echo "Tamaño original: " . formatBytes($totalSize) . "\n";
    echo "Tamaño optimizado: " . formatBytes($optimizedSize) . "\n";
    echo "Reducción total: -{$totalReduction}%\n";
    
} catch (Exception $e) {
    echo "[ERROR] {$e->getMessage()}\n";
}

function formatBytes($bytes) {
    $units = ['B', 'KB', 'MB'];
    $bytes = max($bytes, 0);
    $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
    $pow = min($pow, count($units) - 1);
    $bytes /= (1 << (10 * $pow));
    return round($bytes, 2) . ' ' . $units[$pow];
}
?>
