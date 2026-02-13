<?php
// podcasts.php
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Podcasts de los Viernes | Kreative</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #f5f5f5 0%, #e8f5e9 100%);
            color: #333;
            min-height: 100vh;
        }

        /* Header */
        .header {
            background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
            color: white;
            padding: 80px 20px 60px;
            text-align: center;
            box-shadow: 0 4px 20px rgba(76, 175, 80, 0.3);
            position: relative;
            overflow: hidden;
        }

        .header::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
            animation: pulse 15s ease-in-out infinite;
        }

        @keyframes pulse {
            0%, 100% { transform: translate(0, 0) scale(1); }
            50% { transform: translate(-10%, -10%) scale(1.1); }
        }

        .header-content {
            position: relative;
            z-index: 1;
            max-width: 800px;
            margin: 0 auto;
        }

        .header h1 {
            font-size: 3.5em;
            margin-bottom: 15px;
            font-weight: 700;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
            animation: slideDown 0.8s ease;
        }

        @keyframes slideDown {
            from {
                opacity: 0;
                transform: translateY(-30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .header-icon {
            font-size: 4em;
            margin-bottom: 20px;
            animation: bounce 2s ease infinite;
        }

        @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
        }

        .header p {
            font-size: 1.3em;
            opacity: 0.95;
            line-height: 1.6;
            animation: fadeIn 1s ease 0.3s both;
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        .header-subtitle {
            display: inline-block;
            background: rgba(255, 255, 255, 0.2);
            padding: 12px 30px;
            border-radius: 30px;
            margin-top: 20px;
            font-weight: 600;
            backdrop-filter: blur(10px);
        }

        /* Container */
        .container {
            max-width: 1400px;
            margin: -40px auto 0;
            padding: 0 20px 80px;
            position: relative;
            z-index: 2;
        }

        /* Filtros */
        .filters {
            background: white;
            padding: 25px;
            border-radius: 15px;
            box-shadow: 0 5px 25px rgba(76, 175, 80, 0.15);
            margin-bottom: 40px;
            display: flex;
            gap: 15px;
            flex-wrap: wrap;
            align-items: center;
            justify-content: center;
        }

        .filter-label {
            font-weight: 600;
            color: #4CAF50;
            font-size: 1.1em;
        }

        .filter-select {
            padding: 12px 20px;
            border: 2px solid #4CAF50;
            border-radius: 25px;
            background: white;
            color: #333;
            font-size: 1em;
            cursor: pointer;
            transition: all 0.3s ease;
            outline: none;
        }

        .filter-select:hover {
            background: #4CAF50;
            color: white;
        }

        .search-box {
            flex: 1;
            min-width: 250px;
            max-width: 400px;
            position: relative;
        }

        .search-input {
            width: 100%;
            padding: 12px 45px 12px 20px;
            border: 2px solid #4CAF50;
            border-radius: 25px;
            font-size: 1em;
            outline: none;
            transition: all 0.3s ease;
        }

        .search-input:focus {
            box-shadow: 0 0 0 4px rgba(76, 175, 80, 0.2);
        }

        .search-icon {
            position: absolute;
            right: 20px;
            top: 50%;
            transform: translateY(-50%);
            color: #4CAF50;
            font-size: 1.2em;
        }

        /* Grid de Podcasts */
        .podcasts-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
            gap: 35px;
            margin-top: 40px;
        }

        .podcast-card {
            background: white;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            border: 3px solid transparent;
            animation: cardAppear 0.6s ease both;
        }

        @keyframes cardAppear {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .podcast-card:nth-child(1) { animation-delay: 0.1s; }
        .podcast-card:nth-child(2) { animation-delay: 0.2s; }
        .podcast-card:nth-child(3) { animation-delay: 0.3s; }
        .podcast-card:nth-child(4) { animation-delay: 0.4s; }
        .podcast-card:nth-child(5) { animation-delay: 0.5s; }
        .podcast-card:nth-child(6) { animation-delay: 0.6s; }

        .podcast-card:hover {
            transform: translateY(-15px) scale(1.02);
            box-shadow: 0 20px 50px rgba(76, 175, 80, 0.3);
            border-color: #4CAF50;
        }

        .podcast-thumbnail {
            position: relative;
            width: 100%;
            padding-bottom: 56.25%;
            background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
            overflow: hidden;
            cursor: pointer;
        }

        .podcast-thumbnail img {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.5s ease;
        }

        .podcast-card:hover .podcast-thumbnail img {
            transform: scale(1.1);
        }

        .play-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, rgba(76, 175, 80, 0.7) 0%, rgba(69, 160, 73, 0.9) 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.4s ease;
        }

        .podcast-thumbnail:hover .play-overlay {
            opacity: 1;
        }

        .play-btn {
            background: white;
            border: none;
            border-radius: 50%;
            width: 80px;
            height: 80px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
        }

        .play-btn:hover {
            transform: scale(1.2) rotate(360deg);
        }

        .play-btn i {
            color: #4CAF50;
            font-size: 32px;
            margin-left: 5px;
        }

        .live-badge {
            position: absolute;
            top: 15px;
            right: 15px;
            background: #ff4444;
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-weight: 600;
            font-size: 0.85em;
            display: flex;
            align-items: center;
            gap: 6px;
            animation: livePulse 1.5s ease infinite;
            z-index: 10;
        }

        @keyframes livePulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
        }

        .live-dot {
            width: 8px;
            height: 8px;
            background: white;
            border-radius: 50%;
            animation: dotPulse 1.5s ease infinite;
        }

        @keyframes dotPulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.3); }
        }

        .podcast-info {
            padding: 28px;
        }

        .podcast-episode {
            display: inline-block;
            background: #e8f5e9;
            color: #4CAF50;
            padding: 6px 14px;
            border-radius: 15px;
            font-size: 0.85em;
            font-weight: 700;
            margin-bottom: 12px;
        }

        .podcast-info h3 {
            font-size: 1.5em;
            margin-bottom: 12px;
            color: #333;
            font-weight: 700;
            line-height: 1.3;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }

        .podcast-date {
            color: #4CAF50;
            font-weight: 600;
            margin-bottom: 15px;
            font-size: 0.95em;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .podcast-description {
            color: #666;
            line-height: 1.7;
            margin-bottom: 25px;
            font-size: 0.95em;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }

        .podcast-actions {
            display: flex;
            gap: 12px;
        }

        .btn-watch, .btn-youtube {
            flex: 1;
            padding: 14px 20px;
            border: none;
            border-radius: 25px;
            cursor: pointer;
            font-size: 0.95em;
            font-weight: 600;
            text-decoration: none;
            text-align: center;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }

        .btn-watch {
            background: #4CAF50;
            color: white;
            box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
        }

        .btn-watch:hover {
            background: #45a049;
            transform: translateY(-3px);
            box-shadow: 0 6px 20px rgba(76, 175, 80, 0.4);
        }

        .btn-youtube {
            background: white;
            color: #4CAF50;
            border: 2px solid #4CAF50;
        }

        .btn-youtube:hover {
            background: #4CAF50;
            color: white;
            transform: translateY(-3px);
        }

        /* Modal de Video */
        .modal-video {
            display: none;
            position: fixed;
            z-index: 10000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.95);
            animation: modalFadeIn 0.3s ease;
        }

        @keyframes modalFadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        .modal-video-content {
            position: relative;
            margin: 5% auto;
            width: 90%;
            max-width: 1100px;
            animation: modalSlideDown 0.5s ease;
        }

        @keyframes modalSlideDown {
            from {
                transform: translateY(-100px);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }

        .close-video {
            position: absolute;
            top: -50px;
            right: 0;
            color: white;
            background: #4CAF50;
            width: 45px;
            height: 45px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
            z-index: 10001;
        }

        .close-video:hover {
            background: #45a049;
            transform: rotate(90deg) scale(1.1);
        }

        #videoContainer {
            position: relative;
            padding-bottom: 56.25%;
            height: 0;
            overflow: hidden;
            border-radius: 15px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
            border: 5px solid #4CAF50;
        }

        #videoContainer iframe {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border: none;
        }

        /* Estado vacío */
        .podcasts-empty {
            text-align: center;
            padding: 80px 20px;
            color: #666;
            grid-column: 1 / -1;
        }

        .podcasts-empty i {
            font-size: 100px;
            color: #4CAF50;
            margin-bottom: 25px;
            animation: bounce 2s ease infinite;
        }

        .podcasts-empty h3 {
            font-size: 2em;
            margin-bottom: 15px;
            color: #333;
        }

        .podcasts-empty p {
            font-size: 1.2em;
            color: #666;
        }

        /* Loading Spinner */
        .loading {
            text-align: center;
            padding: 60px 20px;
            grid-column: 1 / -1;
        }

        .spinner {
            border: 5px solid #e8f5e9;
            border-top: 5px solid #4CAF50;
            border-radius: 50%;
            width: 60px;
            height: 60px;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        /* Stats Bar */
        .stats-bar {
            background: white;
            padding: 25px;
            border-radius: 15px;
            box-shadow: 0 5px 25px rgba(76, 175, 80, 0.15);
            margin-bottom: 40px;
            display: flex;
            justify-content: space-around;
            flex-wrap: wrap;
            gap: 30px;
        }

        .stat-item {
            text-align: center;
            flex: 1;
            min-width: 150px;
        }

        .stat-number {
            font-size: 2.5em;
            font-weight: 700;
            color: #4CAF50;
            margin-bottom: 5px;
        }

        .stat-label {
            color: #666;
            font-size: 0.95em;
        }

        /* Responsive */
        @media (max-width: 1200px) {
            .podcasts-grid {
                grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
                gap: 25px;
            }
        }

        @media (max-width: 768px) {
            .header h1 {
                font-size: 2.5em;
            }

            .header p {
                font-size: 1.1em;
            }

            .podcasts-grid {
                grid-template-columns: 1fr;
                gap: 20px;
            }

            .filters {
                flex-direction: column;
            }

            .search-box {
                max-width: 100%;
            }

            .podcast-actions {
                flex-direction: column;
            }

            .modal-video-content {
                width: 95%;
                margin: 15% auto;
            }

            .close-video {
                top: -45px;
                width: 40px;
                height: 40px;
                font-size: 20px;
            }

            .stats-bar {
                flex-direction: column;
                gap: 20px;
            }
        }

        @media (max-width: 480px) {
            .header h1 {
                font-size: 2em;
            }

            .header-icon {
                font-size: 3em;
            }

            .podcast-info h3 {
                font-size: 1.3em;
            }

            .play-btn {
                width: 65px;
                height: 65px;
            }

            .play-btn i {
                font-size: 26px;
            }
        }

        /* Scroll to Top Button */
        .scroll-top {
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: #4CAF50;
            color: white;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            border: none;
            cursor: pointer;
            display: none;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            box-shadow: 0 4px 15px rgba(76, 175, 80, 0.4);
            transition: all 0.3s ease;
            z-index: 1000;
        }

        .scroll-top:hover {
            background: #45a049;
            transform: translateY(-5px);
        }

        .scroll-top.show {
            display: flex;
        }
    </style>
</head>
<body>
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
                <option value="2025">2026</option>
                <option value="2024">2025</option>
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

        // ========================================
        // DATOS DE EJEMPLO (SIN BASE DE DATOS)
        // ========================================
        const podcastsEjemplo = [
            {
                id: 1,
                titulo: 'Podcast Kreative Cap 01 : En vivo en Viaje 4 Estaciones.',
                descripcion: 'Un encuentro para inspirar, conectar, profundizar y resonar con la IA.',
                url_youtube: 'https://www.youtube.com/watch?v=xSduoyedi68',
                fecha: '2025-11-27',
                estado: 'finalizado'
            },
            {
                id: 2,
                titulo: 'Podcast Kreative Cap 02 / ¿que es la blockchain ?',
                descripcion: 'Juan desde argentina y Camilo desde chile nos cuentan sobre como funciona la blockchain y como la aplicaran en sus proyectos.',
                url_youtube: 'https://www.youtube.com/watch?v=Gd-wJkdBBAg',
                fecha: '2025-12-04',
                estado: 'finalizado'
            },
            {
                id: 3,
                titulo: 'Podcast Kreative Cap 03: IA y Web 3.0 - En vivo desde AIDAY - Los Reyunos 2025',
                descripcion: '¿Cómo conviven la humanidad y la Inteligencia Artificial? ¿Hacia dónde va la economía con la Web 3.0? Sumate a este episodio especial desde AIDAY - Los Reyunos 2025. Analizamos estos temas junto a Pablo Paredes y Camilo Yonhson para entender el futuro que ya está aquí.',
                url_youtube: 'https://www.youtube.com/watch?v=geY6TAhdfsI',
                fecha: '2025-12-12',
                estado: 'finalizado'
            },
            {
                id: 4,
                titulo: 'Capitulo 5 AD Kreative Podcast desde UTN Polo IT San rafael y Polo Tic Mendoza',
                descripcion: '',
                url_youtube: 'https://www.youtube.com/watch?v=aZtOy6K29CQ',
                fecha: '2025-12-18',
                estado: 'finalizado'
            },
            {
                id: 5,
                titulo: 'Podcast Kreative Cap 06: Humanidad en tiempos de IA Cuidadoras y Hackdash',
                descripcion: 'Acompáñanos a conversar sobre dos proyectos:'+
                            '- Cuidadoras de Calbuco: Web para apoyar una agrupación de cuidadoras.'+
                            '- Hackdash: Plataforma que nuclea proyectos IT y eventos.',
                url_youtube: 'https://www.youtube.com/watch?v=qTL5vHhf4hA',
                fecha: '2025-12-26',
                estado: 'finalizado'
            },
            {
                id: 6,
                titulo: 'Podcast Kreative Cap 7 la Incertidumbre de pasar a la acción',
                descripcion: 'Mauricio Caceres y Gabriel Calcagni nos hablan sobre sus proyectos para el 2026 y sobre como pasar a la acción en este mundo tecnologico.',
                url_youtube: 'https://www.youtube.com/watch?v=aF8S8Kx2Os4',
                fecha: '2026-01-02',
                estado: 'finalizado'
            },
            {
                id: 7,
                titulo: 'Podcast Kreative Cap 8',
                descripcion: '',
                url_youtube: 'https://www.youtube.com/watch?v=HcB0J4ntxM4',
                fecha: '2026-01-09',
                estado: 'finalizado'
            },
             {
                id: 8,
                titulo: 'Podcast Kreative - Cap 9 - Humanidad en tiempos de tecnología: Una charla con Mizu Chin',
                descripcion: 'En este noveno episodio de Podcast Kreative, nos alejamos de los tecnicismos para poner en el centro a las personas que construyen el futuro de la tecnología. Bajo el título "Humanidad en tiempos de tecnología", exploramos la industria de los videojuegos desde una mirada profundamente humana y honesta. Contamos con la presencia de Mizu Chin, CEO y Productora de Dreams of Heaven Games, speaker internacional y referente clave de la industria en Chile. Más allá de sus títulos profesionales, Mizu nos comparte su historia, sus procesos y la importancia de los vínculos en un entorno altamente digital.',
                url_youtube: 'https://www.youtube.com/watch?v=3Q4b84dSVl4',
                fecha: '2026-01-16',
                estado: 'finalizado'
            },
            {
                id: 9,
                titulo: 'Podcast Kreative Cap 10 - Proyecto social Con Tribu Ir',
                descripcion: 'Acompáñanos a descubrir la ONG CON TRIBU IR, un equipo multidisciplinario apasionado por la educación, la salud mental, la inclusión y el bienestar integral.'+
                            'Su propósito es generar experiencias formativas e innovadoras que impacten la vida de las personas y fortalezcan desde lo individual a lo colectivo a diversos profesionales y organismos, utilizando la colaboración, la creatividad y el aprendizaje como motores de transformación social.'+
                            'En este episodio, reflexionaremos sobre cómo la pasión por el bienestar humano y la educación puede estructurarse en proyectos concretos que fortalecen el tejido social.',
                url_youtube: 'https://www.youtube.com/watch?v=QaVz_Sos6No&t=2567s',
                fecha: '2026-01-23',
                estado: 'finalizado'
            },
            {
                id: 10,
                titulo: 'Podcast Kreative Cap 11 - Global Game Jam',
                descripcion: '',
                url_youtube: 'https://www.youtube.com/watch?v=OwY1aAuv8nI',
                fecha: '2026-01-30',
                estado: 'finalizado'
            },
            {
                id: 11,
                titulo: 'Podcast Kreative Cap 12 - Global Game Jam Recap',
                descripcion: 'Conoce más sobre la experiencia de la participación en la Global Game Jam, el evento anual de creación de videojuegos más grande del mundo! 🕹️',
                url_youtube: 'https://www.youtube.com/watch?v=A-Qi2SZUuBQ&t=5s',
                fecha: '2026-02-06',
                estado: 'finalizado'
            }
        ];

        // Cargar podcasts (desde datos de ejemplo)
        async function cargarPodcasts() {
            try {
                // Simular carga asíncrona
                await new Promise(resolve => setTimeout(resolve, 500));
                
                // Usar datos de ejemplo
                todosLosPodcasts = podcastsEjemplo;
                podcastsFiltrados = podcastsEjemplo;
                
                actualizarEstadisticas();
                renderizarPodcasts(podcastsEjemplo);
                
            } catch (error) {
                console.error('Error al cargar podcasts:', error);
                mostrarError();
            }
        }

        /* ================================================
           VERSIÓN PARA USAR CON BASE DE DATOS 
           (Descomenta esta función y comenta la de arriba cuando tengas la BD lista)
           ================================================
        
        async function cargarPodcasts() {
            try {
                const response = await fetch('./backend/get-podcasts.php');
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
        */

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
                            <img src="https://img.youtube.com/vi/${extraerIdYoutube(podcast.url_youtube)}/maxresdefault.jpg" 
                                 alt="${escapeHtml(podcast.titulo)}"
                                 onerror="this.src='https://img.youtube.com/vi/${extraerIdYoutube(podcast.url_youtube)}/hqdefault.jpg'">
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
        window.onclick = function(event) {
            const modal = document.getElementById('videoModal');
            if (event.target === modal) {
                cerrarVideoModal();
            }
        }

        document.addEventListener('keydown', function(event) {
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
        window.addEventListener('scroll', function() {
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
</body>
</html>