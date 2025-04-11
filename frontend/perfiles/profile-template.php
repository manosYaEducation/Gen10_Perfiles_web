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
        <link href="../css/profile-templates-styles.css" rel="stylesheet" />
    </head>
    <body id="top">
        <nav class="navbar" id="sideNav">
            <a class="navbar-brand" href="#top"></a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation"><span class="navbar-toggler-icon"></span></button>
            <div class="collapse navbar-collapse" id="navbarResponsive">
                <ul class="navbar-nav">
                    <li class="nav-item"><a class="nav-link" href="#about">Sobre mi</a></li>
                    <li class="nav-item"><a class="nav-link" href="#experience">Experiencia</a></li>
                    <li class="nav-item"><a class="nav-link" href="#education">Educación</a></li>
                    <li class="nav-item"><a class="nav-link" href="#skills">Habilidades</a></li>
                    <li class="nav-item"><a class="nav-link" href="#interests">Intereses</a></li>
                    <li class="nav-item"><a class="nav-link" href="#contact">Contacto</a></li>
                    <li class="nav-volver"><a class="volver-link" href="../../index.html">Volver al Inicio</a></li>
                </ul>
            </div>
        </nav>
        
        <div class="container-fluid p-0">
            <section id="about">
                <div id="resume-section-hero">
                    <img src="<?php echo htmlspecialchars($metaImage); ?>"
                     id="profile_image"
                     class="imagen-participante" 
                     alt="Imagen de <?php echo htmlspecialchars($profile['name']); ?>">
                    <h1 id="name-hero" class="mb-0"><?php echo htmlspecialchars($profile['name']); ?></h1>
                    <div id="personal-information-hero"></div>
                    <p id="description-hero"></p>
                    <!-- <div id="social-icons-hero">
                        <a class="social-icon" href="#" target="_blank"><i class="fab fa-linkedin-in"></i></a>
                        <a class="social-icon" href="#" target="_blank"><i class="fab fa-github"></i></a>
                        <a class="social-icon" href="#" target="_blank"><i class="fab fa-instagram"></i></a>
                        <a class="social-icon" href="#" target="_blank"><i class="fab fa-twitch"></i></a>
                        <a class="social-icon" href="#" target="_blank"><i class="fab fa-youtube"></i></a>
                    </div> -->
                </div>
            </section>
            <hr class="m-0" />
            <section class="resume-section" id="experience">
                <h2 class="mb-5" id="experience-title">Experiencia</h2>
                <div id="experience-section">
                </div>
            </section>
            <hr class="m-0" />
            <section class="resume-section" id="education">
                <div class="resume-section-content" id="resume-section-education">
                    <h2 id="title-education" class="mb-5">Educación</h2>
                    <div id="timeline">
                    </div>
                </div>
            </section>
            <hr class="m-0" />
            <section class="resume-section" id="interest">
                <div class="interest-section">
                    <h2 class="mb-5">Intereses</h2>
                    <p id="p-interest-section"></p>
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
            <section class="resume-section" id="social" >
                <div class="social-section">
                    <h2 class="mb-5">Redes Sociales</h2>
                    <p id="social-links"></p>
                </div>

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
    </body>
</html>