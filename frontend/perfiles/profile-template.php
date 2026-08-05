<!DOCTYPE html>
<html lang="en">
    <head>
        <?php include '../../backend/MetadataPerfiles.php';?>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <meta name="description" content="" />
        <meta name="author" content="" />
        <title>Resume</title>
        <link rel="icon" type="image/x-icon" href="../../assets/img/favicon.ico" />
        <script src="https://use.fontawesome.com/releases/v6.3.0/js/all.js" crossorigin="anonymous"></script>
        <link href="https://fonts.googleapis.com/css?family=Saira+Extra+Condensed:500,700" rel="stylesheet" type="text/css" />
        <link href="https://fonts.googleapis.com/css?family=Muli:400,400i,800,800i" rel="stylesheet" type="text/css" />   
        <link href="../css/cliente/profile-templates-styles.css" rel="stylesheet" />
        <link href="../css/cliente/user-projects.css" rel="stylesheet" />
    </head>
    <body id="top">
        <nav class="navbar" id="sideNav">
            <a class="navbar-brand" href="#top"></a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation"><span class="navbar-toggler-icon"></span></button>
            <div class="collapse navbar-collapse" id="navbarResponsive">
                <ul class="navbar-nav">
                    <li class="nav-volver">
                    <a class="volver-link" href="../../index.html">
                        <img src="../../assets/img/letra-k.png" alt="Inicio" class="icon">
                    </a>
                    </li>
                    <li class="nav-item"><a class="nav-link" href="#about" onclick="DestacarNavbar('about')">Sobre mi</a></li>
                    <li class="nav-item"><a class="nav-link" href="#experience" onclick="DestacarNavbar('experience')">Experiencia</a></li>
                    <li class="nav-item"><a class="nav-link" href="#education" onclick="DestacarNavbar('education')">Educación</a></li>
                    <li class="nav-item"><a class="nav-link" href="#skills" onclick="DestacarNavbar('skills')">Habilidades</a></li>
                    <li class="nav-item"><a class="nav-link" href="#interests" onclick="DestacarNavbar('interests')">Intereses</a></li>
                    <li class="nav-item"><a class="nav-link" href="#projects" onclick="DestacarNavbar('projects')">Proyectos</a></li>
                    <li class="nav-item"><a class="nav-link" href="#contact" onclick="DestacarNavbar('contact')">Contacto</a></li>
                </ul>
            </div>
        </nav>
        
        <div class="container-fluid p-0">
            <section id="about">
                <div id="resume-section-hero">
                    <div class="profile-cover" role="img" aria-label="Banner del perfil">
                        <span class="profile-cover-brand" aria-hidden="true">K</span>
                    </div>
                    <div class="profile-identity-row">
                        <img src="<?php echo htmlspecialchars($metaImage); ?>"
                         id="profile_image"
                         class="imagen-participante"
                         alt="Imagen de <?php echo htmlspecialchars($profile['name']); ?>">
                        <div id="social-icons-hero" class="social-icons-hero" aria-label="Redes sociales" hidden></div>
                    </div>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; width: 100%; padding: 20px 30px 20px 30px; box-sizing: border-box;">
                    <div style="display: flex; flex-direction: column; align-items: flex-start; text-align: left; padding-right: 20px;">
                        <h1 id="name-hero" style="margin-top: 0; margin-bottom: 15px; text-align: left; font-size: 42px; display: block !important; width: 100% !important;" class="mb-0"><?php echo htmlspecialchars($profile['name']); ?></h1>
                        <p id="location-text" style="margin: 0 0 8px 0; font-size: 16px; font-weight: 500; color: #333;">
                            <i class="fas fa-map-marker-alt" style="color: #4caf4f; margin-right: 8px;"></i> Cargando ubicación...
                        </p>
                        
                        <hr style="border: 0; border-top: 1px solid rgba(0,0,0,0.08); width: 100%; margin: 0 0 8px 0;">
                        
                        <p id="career-text" style="margin: 0 0 15px 0; font-size: 16px; font-weight: 500; color: #333;">
                            <i class="fas fa-graduation-cap" style="color: #4caf4f; margin-right: 8px;"></i> Cargando carrera...
                        </p>
                        <div style="width: 100%;">
                            <hr style="border: 0; border-top: 1px solid rgba(0,0,0,0.08); width: 100%; margin: 0 0 10px 0;">
                            <h4 style="font-size: 16px; font-weight: bold; margin: 0 0 8px 0; color: #333;">CONTACTO:</h4>
                            <div id="personal-information-hero" style="font-size: 15px; display: flex; flex-direction: column; align-items: flex-start; gap: 4px;"></div>
                        </div>
                        
                    </div>
                    <div style="display: flex; flex-direction: column; justify-content: flex-start; padding-left: 20px;">
                        <p id="description-hero" style="font-size: 16px; line-height: 1.7; text-align: justify; margin: 0; color: #444;"></p>
                    </div>

                </div>
            </section>
            <hr class="m-0" />
            <section class="resume-section" id="experience">
                <div class="skill-section"> <!-- Se esta reutilizando la misma tarjeta visual de skill-section -->
                    <h2 class="mb-5" id="experience-title">Experiencia</h2>
                    <div id="experience-section">
                    </div>
                </div>
            </section>
            <hr class="m-0" />
            <section class="resume-section profile-education-section" id="education" aria-labelledby="title-education">
                <div class="profile-education-card">
                    <h2 id="title-education">Estudios</h2>
                    <div id="timeline" class="education-timeline" aria-live="polite"></div>
                </div>
            </section>
            <hr class="m-0" />
            <section class="resume-section" id="skills">
                <div class="skill-section">
                    <h2 class="mb-5">Habilidades</h2>
                    <p id="p-skill-section"></p>
                </div>
            </section>
            <hr class="m-0" />
                        <section class="resume-section" id="interests">
                <div class="interest-section">
                    <h2 class="mb-5">Intereses</h2>
                    <p id="p-interest-section"></p>
                </div>
            </section>
            <hr class="m-0" />
            <section class="resume-section" id="projects">
                <div class="user-projects-section">
                    <h2 class="mb-5">Proyectos</h2>
                    <div id="user-projects-section">
                        <div class="text-center">
                            <div class="spinner-border text-primary" role="status">
                                <span class="visually-hidden">Cargando proyectos...</span>
                            </div>
                            <p class="mt-2">Cargando proyectos...</p>
                        </div>
                    </div>
                </div>
            </section>
            <hr class="m-0" />
            <section class="resume-section" id="contact">
                <div class="contact-section">
                    <h2 class="mb-5">Contacto</h2>
                    <p id="contact-info-section"></p>
                </div>
            </section>
            <hr class="m-0" />
            <section class="resume-section" id="review">
                <div class="review-section">
                    <h2 class="mb-5">Los clientes dicen de mí</h2>
                    <p class="reviews-column" id="p-review-section"></p>
                </div>

                <a id="add-review-link"><button class="add-review-button" id="add-review-button">Agregar reseña</button></a>
            </section>
                
        </div>        
        </div> 
        <script src="../js/config.js"></script>
        <script src="../js/read_user.js" crossorigin="anonymous"></script>
        <script src="../js/resenas.js"></script>
        <script src="../js/user-projects.js"></script>
    </body>
</html>
