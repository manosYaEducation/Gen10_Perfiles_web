<!DOCTYPE html>
<html lang="es">
<head>
    <?php include '../backend/MetadataProyecto.php'; ?>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Detalle del Proyecto</title>
    
    <link href="../frontend/css/admin/proyecto-detalle.css" rel="stylesheet" />    
    <link href="../frontend/css/base/index.css" rel="stylesheet" />
    <link href="../frontend/css/participantes-estados.css" rel="stylesheet" />
    <link rel="stylesheet" href="../frontend/css/footer.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link rel="icon" href="../assets/img/letra-k.png" type="image/x-icon">
</head>
<body>
    <header>
        <nav style="display: flex; justify-content: space-between; align-items: center; padding: 0rem 2rem; width: 100%; max-width: 100%; box-sizing: border-box;">
            <div class="nav-left" style="flex: 1; display: flex; justify-content: flex-start;">
                <a href="../index.html" class="btn-volver-atras" style="display: flex; align-items: center; gap: 8px; text-decoration: none; color: #314438; font-weight: 500; font-family: 'Poppins', sans-serif;"><i class="fas fa-arrow-left"></i> Volver</a>
            </div>
            
            <div class="nav-center" style="flex: 1; display: flex; justify-content: center;">
                <img src="../assets/img/kreative_transparent.png" alt="Kreative Logo" class="nav-logo" style="width: 150px; height: auto;">
            </div>

            <div class="nav-right" style="flex: 1; display: flex; justify-content: flex-end;">
                <button class="dark-mode-toggle" id="darkModeToggle" aria-label="Toggle dark mode" style="background: none; border: none; cursor: pointer; font-size: 1.2rem; display: flex; align-items: center; justify-content: center; width: 36px; height: 36px; border-radius: 50%; transition: background-color 0.3s ease; color: #333;">
                    <i class="fas fa-moon"></i>
                </button>
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
      fetch('../frontend/components/footer.html')
        .then(response => response.text())
        .then(data => {
          document.getElementById('footer-container').innerHTML = data;
        });
    </script>
    
    <link rel="stylesheet" href="../frontend/css/base/footer.css">



    <script src="./js/project-detail.js"></script>
    <script src="./js/config.js"></script>
    <script src="../frontend/js/config.js"></script>
    <script src="../frontend/js/logout.js"></script>

    <!-- Dark Mode Script -->
    <script>
      document.addEventListener('DOMContentLoaded', function () {
        const darkModeToggle = document.getElementById('darkModeToggle');
        if (!darkModeToggle) return;
        
        const darkModeIcon = darkModeToggle.querySelector('i');

        // Check for saved user preference
        const savedMode = localStorage.getItem('darkMode');
        if (savedMode === 'enabled') {
          document.body.classList.add('dark-mode');
          darkModeIcon.classList.remove('fa-moon');
          darkModeIcon.classList.add('fa-sun');
          darkModeToggle.style.color = '#ffd700';
        }

        // Toggle dark mode
        darkModeToggle.addEventListener('click', function () {
          document.body.classList.toggle('dark-mode');
          const isDark = document.body.classList.contains('dark-mode');
          
          if (isDark) {
              darkModeIcon.classList.remove('fa-moon');
              darkModeIcon.classList.add('fa-sun');
              darkModeToggle.style.color = '#ffd700';
          } else {
              darkModeIcon.classList.remove('fa-sun');
              darkModeIcon.classList.add('fa-moon');
              darkModeToggle.style.color = '#333';
          }

          localStorage.setItem('darkMode', isDark ? 'enabled' : 'disabled');
        });

        // Detect system color scheme preference
        const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
        if (!savedMode && prefersDarkScheme.matches) {
          document.body.classList.add('dark-mode');
          darkModeIcon.classList.remove('fa-moon');
          darkModeIcon.classList.add('fa-sun');
          darkModeToggle.style.color = '#ffd700';
        }
      });
    </script>
</body>
</html>
