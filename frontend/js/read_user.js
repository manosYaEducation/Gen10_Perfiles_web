// const perfiles = [
//     {
//         "nombre": "Sebastián Santana",
//         "ubicacion": "Punta Arenas, Magallanes, 6200000",
//         "telefono": "(569) 63952221",
//         "correo": "sebastian.santanacardenas@hotmail.com",
//         "descripcion": "Un placer, aquí Sebastián. Oriundo de Punta Arenas y con 28 años, me considero una persona motivada por mis pasiones, curiosa por lo desconocido y ambiciosa en cuanto a mis aspiraciones. Siempre he sido de bajo perfil, pero muy sociable. Por eso, actualmente aspiro a tener un canal de YouTube estilo Cozy vlogs - Lofi - Study With Me!, donde podré compartir mi perspectiva sobre la vida.",
//         "experiencia": [
//             {
//                 "titulo": "Diseño gráfico",
//                 "fecha": "Enero 2023 - junio 2023",
//                 "detalles": [
//                     {
//                         "subtitulo": "Emprendimiento",
//                         "descripcion": "Emprendimiento propio de una empresa que realizaba identidades visuales y consultorías de UX/UI - Diseño gráfico."
//                     }
//                 ]
//             },
//             {
//                 "titulo": "Trabajos no relacionados a informática",
//                 "fecha": "Marzo 2012 - Diciembre 2022",
//                 "detalles": [
//                     {
//                         "subtitulo": "Ripley"
//                     },
//                     {
//                         "subtitulo": "Trabajos Freelance Traducción e interpretación"
//                     },
//                     {
//                         "subtitulo": "Cafeterías - Barista"
//                     },
//                     {
//                         "subtitulo": "Trabajos Freelance Fotografía"
//                     },
//                     {
//                         "subtitulo": "Operador Papa Johns"
//                     }
//                 ]
//             }
//         ],
//         "educacion":[
//             {
//                 "institucion": "Universidad de Playa Ancha, Valparaíso",
//                 "titulo": "Traductor e intérprete",
//                 "periodo": "Marzo 2015 - Diciembre 2019"
//             },
//             {
//                 "institucion": "ESCALAB",
//                 "titulo": "Bootcamp Front-end",
//                 "periodo": "Junio 2020 - Diciembre 2020"
//             },
//             {
//                 "institucion": "CODERHOUSE",
//                 "titulo": "Bootcamp UX-UI",
//                 "periodo": "Marzo 2021 - Junio 2022"
//             },
//             {
//                 "institucion": "Coursera - Google",
//                 "titulo": "Introducción a la ciberseguridad",
//                 "periodo": "Marzo 2024 - Mayo 2024"
//             },
//             {
//                 "institucion": "INACAP",
//                 "titulo": "Analista programador",
//                 "periodo": "Marzo 2023 - Diciembre 2024"
//             }
//         ]
//     }
//     ,
//     {
//         "nombre": "Erick Caicheo",
//         "ubicacion": "Punta Arenas, Magallanes, 6200000",
//         "telefono": "(569) 32456532",
//         "correo": "erickaljndrr@gmail.com",
//         "descripcion": "Encontré mi interés en el mundo IT, a los 27 años, con una sólida motivación para forjar un futuro exitoso en el rubro. Aunque inicialmente me aventuré por la Ingeniería Civil Mecánica, mi curiosidad por la tecnología y el funcionamiento de los procesos me llevaron por estos nuevos rumbos. A lo largo de mi trayectoria como estudiante de Analista Programador, he adquirido nociones valiosas que me han permitido abordar distintos desafíos. Soy constante y estoy dispuesto a enfrentar nuevos retos de forma continua.",
//         "experiencia": [
//             {
//                 "titulo": "Analista Programador",
//                 "fecha": "Marzo 2023 - Actualidad",
//                 "detalles": [
//                     {
//                         "subtitulo": "Analista Programador",
//                         "descripcion": "Programación orientada a objetos, Bases de Datos, Desarrollo Web, Análisis y Diseño de Sistemas."
//                     }
//                 ]
//             }
//         ]
//     }
// ];
    
document.addEventListener("DOMContentLoaded", async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    try {
        const response = await fetch(`http://localhost:8000/read_user.php?id=${id}`);
        const resultado = await response.json();

        console.log('Resultado del servidor:', resultado);

        const perfil = resultado.data;

        // info personal
        document.getElementById('name-hero').textContent = perfil.basico.nombre;
        document.getElementById('personal-information-hero').innerHTML = `
            <p>Ubicación: ${perfil.basico.ubicacion}</p>
            <p>Teléfono: ${perfil.basico.telefono}</p>
            <p>Correo: ${perfil.basico.correo}</p>
        `;
        document.getElementById('description-hero').textContent = perfil.basico.descripcion;

        // Experiencia
        const experienceSection = document.getElementById('experience-section');
        const experienceData = perfil.experience || [];
        experienceSection.innerHTML = perfil.experience.map(exp => `
            <div class="experience-sub-section">
                <h3>${exp.titulo || 'Título no disponible'}</h3>
                <span class="text-primary">${exp.startDate || 'Fecha de inicio no disponible'} - ${exp.endDate || 'Fecha de fin no disponible'}</span>
                <ul>
                    ${exp.descripcion ? `<li><p>${exp.descripcion}</p></li>` : '<li>No hay descripción disponible</li>'}
                </ul>
            </div>
        `).join('');

        // Educación
        const educationSection = document.getElementById('resume-section-education');
        const educationData = perfil.education || [];
        
        educationSection.innerHTML = perfil.education.map(edc => `
            <div class="timeline-item">
                <div class="timeline-content">
                    <h3 class="mb-0">${edc.titulo || 'Título no disponible'}</h3>
                    <span class="text-primary">${edc.periodo || 'Fecha de inicio no disponible'} - ${edc.fechaFin || 'Fecha de fin no disponible'}</span>
                    <div class="subheading mb-3">${edc.descripcion || 'Descripción no disponible'}</div>
                </div>
            </div>
        `).join('');


        //Intereses
        document.getElementById('p-interest-section').textContent = perfil.intereses;

    } catch (error) {
        console.error("Error al obtener el perfil:", error);
    }
});

// ////////// ICONS
// const socialIcons = document.querySelectorAll('.social-icon');

// socialIcons.forEach(icon => {
//     icon.addEventListener('Mouse', () => {
//         socialIcons.forEach(otherIcon => {
//             if (otherIcon !== icon) {
//                 otherIcon.style.margin = '0 20px'; 
//             }
//         });
//     });

//     icon.addEventListener('Mouseleaves', () => {
//         socialIcons.forEach(otherIcon => {
//             otherIcon.style.margin = '12px'; 
//         });
//     });
// });
