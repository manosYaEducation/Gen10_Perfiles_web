<?php
// podcasts.php
?>
<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Podcasts de los Viernes | Kreative</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link rel="stylesheet" href="../frontend/css/base/index.css">
    <link rel="stylesheet" href="./css/podcast.css">
    <style>
        /* Ajuste para que el contenido no quede debajo del navbar fijo */
        body {
            padding: 20px;
        }

        header,
        header nav,
        header nav a,
        header .nav-links li a {
            font-family: 'Poppins', sans-serif !important;
        }

        header {
            background: #fff;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        /* Dark mode toggle */
        .dark-mode-toggle {
            background: none;
            border: none;
            color: #333;
            font-size: 1.2rem;
            cursor: pointer;
            padding: 0.5rem;
            border-radius: 50%;
            width: 36px;
            height: 36px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-left: 0.5rem;
            transition: all 0.3s ease;
        }

        .dark-mode-toggle:hover {
            background-color: rgba(0, 0, 0, 0.08);
        }

        .dark-mode-toggle.dark {
            color: #ffd700;
        }

        /* Dark mode navbar */
        body.dark-mode header {
            background-color: #151515 !important;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        }

        body.dark-mode .nav-links a,
        body.dark-mode .nav-links li a {
            color: #e0e0e0;
        }

        body.dark-mode .nav-links a:hover {
            color: #4CAF50;
        }

        body.dark-mode .nav-logo {
            filter: brightness(0) invert(1);
        }

        body.dark-mode .menu-icon i {
            color: #e0e0e0;
        }

        body.dark-mode .profile-btn {
            background-color: #151515;
            color: #e0e0e0;
            border: none;
        }

        body.dark-mode .dropdown-content {
            background-color: #1e1e1e;
            border: 1px solid #333;
        }

        body.dark-mode .dropdown-content a {
            color: #e0e0e0;
            border-bottom: 1px solid #333;
        }

        body.dark-mode .dropdown-content a:hover {
            background-color: #2a2a2a;
            color: #4CAF50;
        }

        body.dark-mode .dark-mode-toggle {
            color: #ffd700;
        }



        /* Hamburguesa */
        .menu-icon {
            display: none;
            cursor: pointer;
            padding: 8px;
            border-radius: 4px;
            transition: background-color 0.3s ease;
        }

        .menu-icon i {
            font-size: 1.4rem;
            color: #314438;
        }

        .menu-icon:hover {
            background-color: rgba(76, 175, 80, 0.1);
        }

        @media (max-width: 768px) {
            .menu-icon {
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .nav-center {
                display: none;
                width: 100%;
            }

            .nav-center.active {
                display: block;
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: #fff;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                padding: 1rem;
                z-index: 1000;
            }

            .nav-center.active .nav-links {
                flex-direction: column;
                gap: 0.5rem;
            }

            nav {
                position: relative;
                flex-wrap: wrap;
            }
        }

        /* Login btn */
        .login-btn {
            background: #4CAF50;
            color: #fff !important;
            padding: 0.5rem 1.2rem;
            border-radius: 4px;
            font-weight: 600;
            text-decoration: none;
            transition: background 0.3s;
            white-space: nowrap;
        }

        .login-btn:hover {
            background: #45a049;
        }



        /* Podcast active link */
        .nav-links .nav-active>a {
            color: #4CAF50;
            font-weight: 600;
        }

        .nav-links .nav-active>a::after {
            width: 100% !important;
        }
    </style>
    <style>
        /* Ocultar admin por defecto, se muestra con JS si está logueado */
        .podcast-admin-actions,
        .btn-admin-float {
            display: none !important;
        }
    </style>
    <style id="admin-styles"></style>
</head>

<body>
    <!-- Navbar -->
    <header>
        <nav>
            <div class="nav-left">
                <a href="../index.html">
                    <img src="../assets/img/logo_kreative.svg" alt="Kreative Logo" class="nav-logo">
                </a>
            </div>
            <div class="nav-center" id="nav-center">
                <ul class="nav-links" id="nav-links">
                    <li><a href="../index.html">Inicio</a></li>
                    <li><a href="../index.html#perfiles">Nuestro equipo</a></li>
                    <li><a href="https://servicios.alphadocere.cl/index.html">Servicios</a></li>
                    <li><a href="../index.html#pro">Proyectos</a></li>
                    <li class="nav-active"><a href="Podcast.php">Podcasts</a></li>
                    <li><a href="../index.html#contacto">Contacto</a></li>

                    <!-- Login button (shows when not logged in) -->
                    <li id="login-container">
                        <a href="login.html" class="login-btn" id="login-btn">Iniciar sesión→</a>
                    </li>

                    <!-- Profile dropdown (shows when logged in) -->
                    <li id="profile-container" style="display: none;">
                        <div class="profile-dropdown">
                            <button class="profile-btn" id="profile-btn">
                                <span id="profile-icon" class="profile-icon">
                                    <i class="fas fa-user"></i>
                                </span>
                                <span id="profile-name">Usuario</span>
                            </button>
                            <div class="dropdown-content">
                                <a href="index-admin.html">Panel de administración</a>
                                <a id="perfil-link" href="#">Perfil</a>
                                <a href="#" class="button-53" id="logout-btn">Cerrar sesión</a>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>

            <div class="menu-icon" id="menu-icon">
                <i class="fas fa-bars"></i>
            </div>

            <!-- Dark Mode Toggle -->
            <button class="dark-mode-toggle" id="darkModeToggle" aria-label="Toggle dark mode">
                <i class="fas fa-moon"></i>
            </button>

        </nav>
    </header>
    <!-- Header -->
    <div class="header">
        <div class="header-content">
            <div class="header-icon">
                <i class="fas fa-podcast"></i>
            </div>
            <h1>Podcasts de los Viernes</h1>
            <p>Conocimiento, experiencias y conversaciones inspiradoras cada semana</p>
            <span class="header-subtitle">
                <i class="fas fa-clock"></i> Todos los viernes
            </span>
        </div>
    </div>

    <!-- JS del modal -->
    <script src="js/admin-podcast.js"></script>
    <script>
        // Verificar si está logueado para mostrar botones admin
        (function () {
            const userLoggedIn = sessionStorage.getItem('userLoggedIn') || localStorage.getItem('userLoggedIn');
            const token = sessionStorage.getItem('token') || localStorage.getItem('token');

            if (userLoggedIn === 'true' && token) {
                // Mostrar botones de admin
                document.getElementById('admin-styles').textContent = `
                .podcast-admin-actions,
                .btn-admin-float { display: flex !important; }
            `;
            }
        })();
    </script>

    <!-- Container Principal -->
    <div class="container">
        <!-- Estadísticas -->
        <div class="stats-bar">
            <div class="stat-item">
                <div class="stat-number" id="total-episodes">0</div>
                <div class="stat-label">Episodios</div>
            </div>
            <div class="stat-item">
                <div class="stat-number" id="total-hours">0h</div>
                <div class="stat-label">Horas de contenido</div>
            </div>
            <div class="stat-item">
                <div class="stat-number" id="total-views">0</div>
                <div class="stat-label">Visualizaciones</div>
            </div>
        </div>

        <!-- Filtros y Búsqueda -->
        <div class="filters">
            <span class="filter-label">
                <i class="fas fa-filter"></i> Filtrar:
            </span>
            <select class="filter-select" id="filter-year">
                <option value="">Todos los años</option>
                <option value="2026">2026</option>
                <option value="2025">2025</option>
            </select>
            <select class="filter-select" id="filter-month">
                <option value="">Todos los meses</option>
                <option value="01">Enero</option>
                <option value="02">Febrero</option>
                <option value="03">Marzo</option>
                <option value="04">Abril</option>
                <option value="05">Mayo</option>
                <option value="06">Junio</option>
                <option value="07">Julio</option>
                <option value="08">Agosto</option>
                <option value="09">Septiembre</option>
                <option value="10">Octubre</option>
                <option value="11">Noviembre</option>
                <option value="12">Diciembre</option>
            </select>
            <div class="search-box">
                <input type="text" class="search-input" id="search-input" placeholder="Buscar episodios...">
                <i class="fas fa-search search-icon"></i>
            </div>
        </div>

        <!-- Grid de Podcasts -->
        <div class="podcasts-grid" id="podcastsGrid">
            <!-- Loading inicial -->
            <div class="loading">
                <div class="spinner"></div>
                <p>Cargando episodios...</p>
            </div>
        </div>
    </div>

    <!-- Modal para reproducir video -->
    <div id="videoModal" class="modal-video">
        <div class="modal-video-content">
            <span class="close-video" onclick="cerrarVideoModal()">
                <i class="fas fa-times"></i>
            </span>
            <div id="videoContainer"></div>
        </div>
    </div>

    <!-- Botón Scroll to Top -->
    <button class="scroll-top" id="scrollTopBtn" onclick="scrollToTop()">
        <i class="fas fa-arrow-up"></i>
    </button>


    <script>
        // Variables globales
        let todosLosPodcasts = [];
        let podcastsFiltrados = [];

        // Cargar podcasts desde JSON
        // Cargar podcasts desde JSON
        async function cargarPodcasts() {
            try {
                // Agregar timestamp para evitar caché
                const response = await fetch('./data_podcast/data.json?t=' + new Date().getTime());

                if (!response.ok) {
                    throw new Error('Error al cargar data.json');
                }

                const podcasts = await response.json();

                todosLosPodcasts = podcasts;
                podcastsFiltrados = podcasts;

                actualizarEstadisticas();
                renderizarPodcasts(podcasts);

            } catch (error) {
                console.error('Error al cargar podcasts:', error);
                mostrarError();
            }
        }

        // Actualizar estadísticas
        function actualizarEstadisticas() {
            document.getElementById('total-episodes').textContent = todosLosPodcasts.length;

            // Calcular horas aproximadas (estimando 1 hora por episodio)
            const horas = todosLosPodcasts.length;
            document.getElementById('total-hours').textContent = horas + 'h';

            // Visualizaciones totales
            const totalVistas = todosLosPodcasts.reduce((sum, p) => sum + (p.visualizaciones || 0), 0);
            document.getElementById('total-views').textContent = totalVistas.toLocaleString();
        }

        // Renderizar podcasts
        function renderizarPodcasts(podcasts) {
            const podcastsGrid = document.getElementById('podcastsGrid');

            if (podcasts.length === 0) {
                podcastsGrid.innerHTML = `
                    <div class="podcasts-empty">
                        <i class="fas fa-podcast"></i>
                        <h3>No se encontraron episodios</h3>
                        <p>Intenta con otros filtros de búsqueda</p>
                    </div>
                `;
                return;
            }

            podcastsGrid.innerHTML = podcasts.map((podcast, index) => {
                const isLive = esEnVivo(podcast.fecha);
                return `
                    <div class="podcast-card" style="animation-delay: ${index * 0.1}s">
                        <div class="podcast-thumbnail" onclick="reproducirPodcast('${podcast.url_youtube}', '${escapeHtml(podcast.titulo)}')">
                           <img src="https://img.youtube.com/vi/${extraerIdYoutube(podcast.url_youtube)}/mqdefault.jpg"
                           alt="${escapeHtml(podcast.titulo)}">


                            ${isLive ? `
                                <span class="live-badge">
                                    <span class="live-dot"></span>
                                    EN VIVO
                                </span>
                            ` : ''}
                            <div class="play-overlay">
                                <button class="play-btn">
                                    <i class="fas fa-play"></i>
                                </button>
                            </div>
                        </div>
                        <div class="podcast-info">
                            <span class="podcast-episode">Episodio #${podcast.id}</span>
                            <h3>${escapeHtml(podcast.titulo)}</h3>
                            <p class="podcast-date">
                                <i class="fas fa-calendar-alt"></i>
                                ${formatearFecha(podcast.fecha)}
                            </p>
                            <p class="podcast-description">${escapeHtml(podcast.descripcion)}</p>
                            <div class="podcast-actions">
                                <button class="btn-watch" onclick="reproducirPodcast('${podcast.url_youtube}', '${escapeHtml(podcast.titulo)}')">
                                     <i class="fas fa-play-circle"></i>
                                            Ver ahora
                                </button>
                             <a href="${podcast.url_youtube}" target="_blank" class="btn-youtube">
                                    <i class="fab fa-youtube"></i>
                                    YouTube
                                </a>
                            </div>
                            <div class="podcast-admin-actions">
                                <button class="btn-editar" onclick="editarPodcast(${podcast.id})" title="Editar">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn-eliminar" onclick="eliminarPodcast(${podcast.id})" title="Eliminar">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
        }

        // Verificar si es en vivo (viernes de hoy)
        function esEnVivo(fecha) {
            const hoy = new Date();
            const fechaPodcast = new Date(fecha + 'T00:00:00');
            return hoy.toDateString() === fechaPodcast.toDateString() && hoy.getDay() === 5;
        }

        // Reproducir podcast en modal
        function reproducirPodcast(urlYoutube, titulo) {
            const videoId = extraerIdYoutube(urlYoutube);
            const videoContainer = document.getElementById('videoContainer');
            const modal = document.getElementById('videoModal');

            videoContainer.innerHTML = `
                <iframe 
                    src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0" 
                    title="${titulo}"
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    allowfullscreen>
                </iframe>
            `;

            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }

        // Cerrar modal
        function cerrarVideoModal() {
            const modal = document.getElementById('videoModal');
            const videoContainer = document.getElementById('videoContainer');

            modal.style.display = 'none';
            videoContainer.innerHTML = '';
            document.body.style.overflow = 'auto';
        }

        // Extraer ID de YouTube
        function extraerIdYoutube(url) {
            const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
            const match = url.match(regExp);
            return (match && match[7].length === 11) ? match[7] : '';
        }

        // Formatear fecha
        function formatearFecha(fecha) {
            const opciones = {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            };
            return new Date(fecha + 'T00:00:00').toLocaleDateString('es-ES', opciones);
        }

        // Escapar HTML
        function escapeHtml(text) {
            const map = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#039;'
            };
            return text.replace(/[&<>"']/g, m => map[m]);
        }

        // Mostrar error
        function mostrarError() {
            const podcastsGrid = document.getElementById('podcastsGrid');
            podcastsGrid.innerHTML = `
                <div class="podcasts-empty">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>Error al cargar los episodios</h3>
                    <p>Por favor, intenta recargar la página</p>
                </div>
            `;
        }

        // Filtros
        function aplicarFiltros() {
            const yearFilter = document.getElementById('filter-year').value;
            const monthFilter = document.getElementById('filter-month').value;
            const searchTerm = document.getElementById('search-input').value.toLowerCase();

            podcastsFiltrados = todosLosPodcasts.filter(podcast => {
                const fecha = new Date(podcast.fecha + 'T00:00:00');
                const year = fecha.getFullYear().toString();
                const month = (fecha.getMonth() + 1).toString().padStart(2, '0');

                const matchYear = !yearFilter || year === yearFilter;
                const matchMonth = !monthFilter || month === monthFilter;
                const matchSearch = !searchTerm ||
                    podcast.titulo.toLowerCase().includes(searchTerm) ||
                    podcast.descripcion.toLowerCase().includes(searchTerm);

                return matchYear && matchMonth && matchSearch;
            });

            renderizarPodcasts(podcastsFiltrados);
        }

        // Event listeners para filtros
        document.getElementById('filter-year').addEventListener('change', aplicarFiltros);
        document.getElementById('filter-month').addEventListener('change', aplicarFiltros);
        document.getElementById('search-input').addEventListener('input', aplicarFiltros);

        // Cerrar modal con tecla ESC o click fuera
        window.onclick = function (event) {
            const modal = document.getElementById('videoModal');
            if (event.target === modal) {
                cerrarVideoModal();
            }
        }

        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape') {
                cerrarVideoModal();
            }
        });

        // Scroll to top
        function scrollToTop() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }

        // Mostrar/ocultar botón scroll to top
        window.addEventListener('scroll', function () {
            const scrollTopBtn = document.getElementById('scrollTopBtn');
            if (window.pageYOffset > 300) {
                scrollTopBtn.classList.add('show');
            } else {
                scrollTopBtn.classList.remove('show');
            }
        });

        // Cargar podcasts al cargar la página
        document.addEventListener('DOMContentLoaded', cargarPodcasts);
    </script>

    <!-- Modal Administrar Podcast -->
    <div id="adminPodcastModal" class="modal-admin">
        <div class="modal-admin-content">
            <span class="close-admin" onclick="cerrarModal()">&times;</span>
            <h2>Agregar Nuevo Podcast</h2>


    <form id="formPodcast" onsubmit="guardarPodcast(event)">
        <label>Título *</label>
        <input type="text" id="titulo" placeholder="Ej: Episodio #12 - Desarrollo Web" required>

        <label>Descripción *</label>
        <textarea id="descripcion" rows="4" placeholder="Describe de qué trata el episodio..." required></textarea>

        <label>URL de YouTube *</label>
        <input type="url" id="url_youtube" placeholder="https://www.youtube.com/watch?v=..." required>

        <label>Fecha de publicación *</label>
        <input type="date" id="fecha" required>

        <div class="botones">
            <button type="button" onclick="cerrarModal()">Cancelar</button>
            <button type="submit">Guardar Podcast</button>
        </div>
    </form>

    <div id="mensajeResultado"></div>
    </div>
    </div>


    <!-- Botón flotante para abrir modal -->
    <button class="btn-admin-float" onclick="abrirModal()">
        <i class="fas fa-plus"></i>
    </button>

    <script>
        // ---- Navbar JS ----

        // Login state
        (function () {
            const userLoggedIn = sessionStorage.getItem('userLoggedIn') || localStorage.getItem('userLoggedIn');
            const token = sessionStorage.getItem('token') || localStorage.getItem('token');
            const userName = sessionStorage.getItem('userName') || localStorage.getItem('userName') || 'Usuario';

            if (userLoggedIn === 'true' && token) {
                document.getElementById('login-container').style.display = 'none';
                document.getElementById('profile-container').style.display = 'block';
                document.getElementById('profile-name').textContent = userName;
            }

            // Logout
            const logoutBtn = document.getElementById('logout-btn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', function (e) {
                    e.preventDefault();
                    if (confirm("¿Estás seguro de que deseas cerrar sesión?")) {
                        sessionStorage.clear();
                        localStorage.removeItem('userLoggedIn');
                        localStorage.removeItem('token');
                        localStorage.removeItem('userName');
                        window.location.href = '../index.html';
                    }
                });
            }
        })();

        // Hamburger menu toggle
        document.getElementById('menu-icon').addEventListener('click', function () {
            document.getElementById('nav-center').classList.toggle('active');
        });

        // Dark Mode Functionality
        document.addEventListener('DOMContentLoaded', function() {
            const darkModeToggle = document.getElementById('darkModeToggle');
            const darkModeIcon = darkModeToggle.querySelector('i');

            // Check for saved user preference, if any
            const savedMode = localStorage.getItem('darkMode');
            if (savedMode === 'enabled' || savedMode === 'true') {
                document.body.classList.add('dark-mode');
                darkModeIcon.className = 'fas fa-sun';
                darkModeToggle.classList.add('dark');
            }

            // Detect system color scheme preference
            const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

            // If no saved preference, use system preference
            if (!savedMode && prefersDarkScheme.matches) {
                document.body.classList.add('dark-mode');
                darkModeIcon.className = 'fas fa-sun';
                darkModeToggle.classList.add('dark');
            }

            // Toggle dark mode
            darkModeToggle.addEventListener('click', function() {
                document.body.classList.toggle('dark-mode');
                const isDark = document.body.classList.contains('dark-mode');
                darkModeIcon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
                darkModeToggle.classList.toggle('dark', isDark);

                // Save user preference
                localStorage.setItem('darkMode', isDark ? 'enabled' : 'disabled');
            });

            // Listen for changes in system color scheme
            prefersDarkScheme.addEventListener('change', e => {
                if (localStorage.getItem('darkMode')) return; // Don't override user's explicit choice

                if (e.matches) {
                    document.body.classList.add('dark-mode');
                    darkModeIcon.className = 'fas fa-sun';
                    darkModeToggle.classList.add('dark');
                } else {
                    document.body.classList.remove('dark-mode');
                    darkModeIcon.className = 'fas fa-moon';
                    darkModeToggle.classList.remove('dark');
                }
            });
        });

    </script>
</body>

</html>