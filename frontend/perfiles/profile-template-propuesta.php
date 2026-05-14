<!DOCTYPE html>
<html lang="es">

<head>
    <?php include '../../backend/MetadataPerfiles.php'; ?>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
    <title>Perfil | Kreative</title>
    <link rel="icon" type="image/x-icon" href="../../assets/img/favicon.ico" />
    <script src="https://use.fontawesome.com/releases/v6.3.0/js/all.js" crossorigin="anonymous"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&family=Outfit:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
    <link href="../css/cliente/profile-templates-styles-propuesta.css?v=5" rel="stylesheet" />
</head>

<body id="top">
    <!-- Efectos de fondo Premium -->
    <div class="bg-glow glow-top"></div>
    <div class="bg-glow glow-bottom"></div>

    <!-- Navbar -->
    <header class="kreative-header">
        <nav class="kreative-nav">
            <div class="nav-left">
                <a href="#top" style="display:flex; align-items:center; gap: 10px; text-decoration:none;">
                    <span id="logo-initials" style="font-size: 2rem; font-weight:800; color:var(--accent-green); font-family:var(--font-display);">K</span>
                    <span class="nav-brand-text" style="color:var(--text-primary); font-family:var(--font-display); font-weight:600; font-size:1.2rem;">| Portafolio</span>
                </a>
            </div>
            <button class="menu-icon" type="button" aria-label="Toggle navigation">
                <i class="fas fa-bars"></i>
            </button>
            <div class="nav-center" id="navbarResponsive">
                <ul class="nav-links">
                    <li><a href="../../index.html" title="Volver al inicio"><i class="fas fa-home"></i> Inicio</a></li>
                    <li><a href="#about">Sobre mí</a></li>
                    <li><a href="#experience">Experiencia</a></li>
                    <li><a href="#education">Educación</a></li>
                    <li><a href="#projects">Proyectos</a></li>
                    <li><a href="#contact">Contacto</a></li>
                </ul>
            </div>
        </nav>
    </header>



    <main class="main-content">
        <!-- Hero Section -->

        <section id="about" class="hero-section" style="padding-top: 100px;">
            <div class="section-container">
                <!-- Foto de portada -->
                <div class="cover-photo-wrapper">
                    <div class="cover-photo-bg"></div>
                </div>

                <div class="hero-container" style="margin-top: -110px; align-items: start;">
                    <div class="hero-image-container" style="display: flex; flex-direction: column; align-items: center; gap: 1.5rem;">
                        <img src="<?php echo htmlspecialchars($metaImage ?? '../../assets/img/default-profile.png'); ?>"
                            id="profile_image"
                            class="profile-img"
                            alt="Imagen de perfil">

                        <div class="hero-contact-wrapper glass-card" style="width: 100%; text-align: center; padding: 1.5rem; background: rgba(22, 22, 22, 0.5);">
                            <h3 class="subsection-title" style="font-size: 1rem; color: var(--text-secondary); margin-bottom: 1.2rem;">Contacto Directo</h3>
                            <style>
                                #contact-info-section p {
                                    display: flex;
                                    flex-direction: column;
                                    align-items: center;
                                    margin-bottom: 12px;
                                    font-size: 0.9rem;
                                    line-height: 1.4;
                                }

                                #contact-info-section p strong {
                                    width: auto;
                                    margin-bottom: 4px;
                                    color: var(--text-primary);
                                }

                                #social-links {
                                    justify-content: center;
                                }
                            </style>
                            <div id="contact-info-section">
                            </div>

                            <div id="social" class="mt-4">
                                <div id="social-links" class="social-icons-wrapper">
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="hero-content" style="padding-top: 130px;">
                        <div class="hero-badge">PERFIL PROFESIONAL</div>
                        <h1 id="name-hero" class="hero-title"><?php echo htmlspecialchars($profile['name'] ?? 'Cargando...'); ?></h1>

                        <div id="personal-information-hero" class="hero-info"></div>

                        <p id="description-hero" class="hero-description"></p>

                        <div class="hero-actions">
                            <a href="#contact" class="btn btn-primary">Contactar</a>
                            <a href="#projects" class="btn btn-outline">Ver Proyectos</a>
                        </div>
                    </div>
                </div>
            </div>
        </section>



        <!-- Experience Section -->
        <section id="experience" class="content-section">
            <div class="section-container">
                <h2 class="section-title">Experiencia Laboral</h2>
                <div id="experience-section" class="cards-container">
                    <!-- Dynamic content read_user.js -->
                </div>
            </div>
        </section>

        <!-- Education & Skills Section (Grid) -->
        <section class="content-section bg-secondary">
            <div class="section-container">
                <div class="edu-skills-grid">
                    <!-- Education -->
                    <div class="grid-column" id="education">
                        <div class="column-header">
                            <i class="fas fa-graduation-cap accent-icon"></i>
                            <h2 class="section-title mb-0">Educación</h2>
                        </div>
                        <div id="timeline" class="cards-container mt-4">
                            <!-- Dynamic content read_user.js -->
                        </div>
                    </div>

                    <!-- Skills & Interests -->
                    <div class="grid-column" id="skills">
                        <div class="column-header">
                            <i class="fas fa-code accent-icon"></i>
                            <h2 class="section-title mb-0">Habilidades</h2>
                        </div>
                        <div class="skills-container mt-4">
                            <div id="p-skill-section" class="tags-container">
                                <!-- Dynamic content read_user.js -->
                            </div>
                        </div>

                        <div class="column-header mt-5" id="interests">
                            <i class="fas fa-heart accent-icon"></i>
                            <h2 class="section-title mb-0">Intereses</h2>
                        </div>
                        <div class="skills-container mt-4">
                            <div id="p-interest-section" class="tags-container">
                                <!-- Dynamic content read_user.js -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Projects Section -->
        <section id="projects" class="content-section">
            <div class="section-container">
                <h2 class="section-title text-center">Mis Proyectos Destacados</h2>
                <div id="user-projects-section" class="projects-wrapper mt-4">
                    <div class="text-center loading-spinner">
                        <div class="spinner-border text-primary" role="status"></div>
                        <p class="mt-2">Cargando proyectos...</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Reviews Section -->
        <section id="review" class="content-section bg-secondary">
            <div class="section-container">
                <h2 class="section-title text-center">Lo que dicen de mí</h2>
                <div id="p-review-section" class="reviews-grid">
                    <!-- Dynamic content resenas.js -->
                </div>
                <div class="text-center mt-5">
                    <a id="add-review-link"><button class="btn btn-primary" id="add-review-button">Agregar reseña</button></a>
                </div>
            </div>
        </section>

        <!-- Contact Section -->
        <section id="contact" class="content-section">
            <div class="section-container contact-container">
                <h2 class="section-title text-center">Déjame un mensaje</h2>

                <div class="contact-grid mt-5" style="display: block; max-width: 650px; margin: 0 auto;">
                    <div class="contact-form-wrapper">
                        <form id="contact-form" class="kreative-form">
                            <div class="form-group">
                                <input type="text" id="contact-name" placeholder="Tu nombre" required>
                            </div>
                            <div class="form-group">
                                <input type="email" id="contact-email" placeholder="Tu correo electrónico" required>
                            </div>
                            <div class="form-group">
                                <input type="tel" id="contact-tel" placeholder="Tu teléfono">
                            </div>
                            <div class="form-group">
                                <textarea id="contact-message" placeholder="¿En qué puedo ayudarte?" rows="5" required></textarea>
                            </div>
                            <button type="submit" class="btn btn-primary btn-block">Enviar Mensaje</button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    </main>

    <footer class="site-footer">
        <div class="footer-container">
            <div class="footer-copy">
                &copy; <span id="current-year"></span> Equipo Kreative. Todos los derechos reservados.
            </div>
            <div class="footer-brand">
                Kreative Portafolio
            </div>
        </div>
    </footer>

    <script src="../js/config.js"></script>
    <script src="../js/read_user.js" crossorigin="anonymous"></script>
    <script src="../js/resenas.js"></script>
    <script src="../js/user-projects.js"></script>

    <script>
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => {
                const nameEl = document.getElementById('name-hero');
                if (nameEl && nameEl.textContent && nameEl.textContent !== 'Cargando...') {
                    const nameParts = nameEl.textContent.trim().split(' ');
                    let initials = 'K'; // fallback
                    if (nameParts.length >= 2) {
                        initials = nameParts[0].charAt(0) + nameParts[1].charAt(0);
                    } else if (nameParts.length === 1) {
                        initials = nameParts[0].charAt(0);
                    }
                    document.getElementById('logo-initials').textContent = initials.toUpperCase();
                }
            }, 1000);

            // Año actual en footer
            document.getElementById('current-year').textContent = new Date().getFullYear();

            // Mobile menu toggle
            const toggler = document.querySelector('.menu-icon');
            const collapse = document.querySelector('.nav-center');
            if (toggler) {
                toggler.addEventListener('click', () => {
                    collapse.classList.toggle('show');
                });
            }
        });
    </script>
</body>

</html>