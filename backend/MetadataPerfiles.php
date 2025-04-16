<?php
// Habilitar la visualización de errores (opcional para desarrollo)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Incluir la conexión a la base de datos
include 'conexion.php';

// Recuperar el ID del perfil
$id = isset($_GET['id']) ? $_GET['id'] : null;
if (!$id) {
    die("No se proporcionó un ID de perfil.");
}

// 1) Consulta a la tabla 'profile' para obtener los datos básicos
$sqlProfile = "SELECT id, name FROM profile WHERE id = ?";
$stmt = $conn->prepare($sqlProfile);
$stmt->execute([$id]);
$profile = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$profile) {
    die("Perfil no encontrado.");
}

// 2) Consulta a la tabla 'imagenes' para obtener la imagen asociada (si existe)
$sqlImage = "SELECT nombre, tipo, imagen FROM imagenes WHERE profileid = ? LIMIT 1";
$stmt2 = $conn->prepare($sqlImage);
$stmt2->execute([$id]);
$imageRow = $stmt2->fetch(PDO::FETCH_ASSOC);

// 3) Definir la imagen para las meta etiquetas (valor por defecto si no se encuentra)
$metaImage = "https://kreative.alphadocere.cl/assets/img/perfil.jpg"; 
if ($imageRow) {
    $metaImage = 'data:' . $imageRow['tipo'] . ';base64,' . base64_encode($imageRow['imagen']);
}

// 4) Definir las demás variables para las meta etiquetas
$metaTitle       = "Perfil de " . $profile['name'] . " - Kreative Alpha Docere";
$metaUrl         = "https://ms.alphadocere.cl/perfil/profile-template.php?id=" . urlencode($id);
$metaDescription = "Innovación y creatividad al servicio de nuevas ideas.";

// Imprimir las meta etiquetas
?>
<meta property="og:type" content="profile" />
<meta property="og:url" content="<?php echo htmlspecialchars($metaUrl); ?>" />
<meta property="og:title" content="<?php echo htmlspecialchars($metaTitle); ?>" />
<meta property="og:description" content="<?php echo htmlspecialchars($metaDescription); ?>" />
<meta property="og:image" content="<?php echo htmlspecialchars($metaImage); ?>" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="fb:app_id" content="TU_APP_ID_AQUI" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="keywords" content="Innovación profesional, talento joven, soluciones creativas" />
