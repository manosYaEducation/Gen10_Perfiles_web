<!DOCTYPE html>
<html lang="es">
<head>
    <?php include '../backend/MetadataProyecto.php'; ?>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Detalle del Proyecto</title>
    
    <link href="../frontend/css/admin/proyecto-detalle.css" rel="stylesheet" />    
    <link href="../frontend/css/base/index.css" rel="stylesheet" />
    <link rel="stylesheet" href="../frontend/css/footer.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link rel="icon" href="../assets/img/letra-k (1).png" type="image/x-icon">
</head>
<body>
    <header>
        <nav>
            <div class="nav-left">
                <img src="../assets/img/kreative_transparent.png" alt="Kreative Logo" class="nav-logo">
            </div>
<!--             <div class="nav-center">
                <ul class="nav-links" id="nav-links">
                    <li><a href="../index.html">Inicio</a></li>
                    <li><a href="../index.html#perfiles">Nuestro equipo</a></li>
                    <li><a href="../index.html#proyectos">Proyectos</a></li>
                    <li><a href="../index.html#contacto">Contacto</a></li>
                </ul>
            </div> -->
            <div class="nav-right">
                <a href="../index.html"  class="login-btn" id="login-btn1">Volver</a>
            </div>
        </nav>
    </header>    
    <div id="proyecto-container">
        <p>Cargando datos del proyecto...</p>
    </div>
    
    <!-- Modal para ver imágenes en grande -->
    <div id="modal-imagen" class="modal">
        <span class="cerrar-modal">&times;</span>
        <span class="flecha izquierda">&#10094;</span> <!-- Flecha izquierda -->
        <img class="modal-contenido" id="imagen-modal">
        <p id="descripcion-modal" class="descripcion-modal"></p>
        <span class="flecha derecha">&#10095;</span> <!-- Flecha derecha -->
    </div>

    <div id="footer-container"></div>
    <script>
      fetch('components/footer.html')
        .then(response => response.text())
        .then(data => {
          document.getElementById('footer-container').innerHTML = data;
        });
    </script>
    <script src="./js/project-detail.js"></script>
    <script src="./js/config.js"></script>
    <script src="../frontend/js/config.js"></script>
    <script src="../frontend/js/logout.js"></script>
</body>
</html>
