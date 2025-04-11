<?php
include 'conexion.php';

$id = isset($_GET['id']) ? $_GET['id'] : null;
if (!$id) {
    die("No se proporcionó un ID.");
}

$sql = "SELECT id_proyecto, titulo_tarjeta, descripcion_tarjeta FROM proyectos WHERE id_proyecto = ?";
$stmt = $conn->prepare($sql);
$stmt->execute([$id]);
$proyecto = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$proyecto) {
    die("Proyecto no encontrado.");
}

//definir las variables para las meta etiquetas:
$metaTitle = $proyecto['titulo_tarjeta'] . " - Desarrollado por Kreative Alpha Docere";
$metaUrl = "https://ms.alphadocere.cl/frontend/proyecto-detalle.php?id=" . urlencode($id);
$metaDescription = substr($proyecto['descripcion_tarjeta'], 0, 200) . "...";
$metaImage = "https://kreative.alphadocere.cl/assets/img/proyectos.jpg";

// Imprimir meta etiquetas:
?>
<meta property="og:type" content="article" />
<meta property="og:url" content="<?php echo htmlspecialchars($metaUrl); ?>" />
<meta property="og:title" content="<?php echo htmlspecialchars($metaTitle); ?>" />
<meta property="og:description" content="<?php echo htmlspecialchars($metaDescription); ?>" />
<meta property="og:image" content="<?php echo htmlspecialchars($metaImage); ?>" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="fb:app_id" content="TU_APP_ID_AQUI" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="keywords" content="Innovación profesional, pruebas de concepto, soluciones creativas" />
