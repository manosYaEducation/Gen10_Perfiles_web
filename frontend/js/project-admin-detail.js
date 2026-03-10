document.addEventListener("DOMContentLoaded", async function () {
    const idProyecto = new URL(window.location.href).searchParams.get("id");

    if (!idProyecto) {
        console.error("No se proporcionó un ID de proyecto.");
        return;
    }

    try {
        const response = await fetch(API_URL_PHP + `/project_detail.php?id=${idProyecto}`);
        const data = await response.json();

        if (!data || data.length === 0) {
            console.error("No se encontraron datos para este proyecto.");
            return;
        }

        const proyecto = data[0];
        const contenedor = document.getElementById("proyecto-container");
        contenedor.innerHTML = ""; // Limpiar contenido previo

        //Sección de información del evento
        let html = `
            <div id="evento" class="evento-info">
                <h2 id="titulo-evento">${proyecto.titulo || "Sin título"}</h2>
                <p id="descripcion-evento">${proyecto.contenido || "Sin descripción disponible."}</p>
        `;

        // Párrafos
        if (proyecto.detalles?.parrafos?.length > 0) {
            html += `
                <div class="parrafos-proyecto">        
                    ${proyecto.detalles.parrafos.map(p => `<p id="descripcion-detallada">${p}</p>`).join("")}
                </div>        
            `;
        }


        //carga Video de YouTube 
        if (proyecto.detalles?.enlaces?.length > 0) {
            html += `
                <section class="enlaces">
                    <div class="enlaces-container">
                        ${proyecto.detalles.enlaces.map(enlace => {
                            let videoHtml = '';
                            const url = enlace.url;
                            let videoId = null;
                            
                            if (url.includes('youtu.be/')) {
                                videoId = url.split('youtu.be/')[1].split('?')[0];
                            } else if (url.includes('v=')) {
                                videoId = url.split('v=')[1].split('&')[0];
                            }
                            
                            if (videoId) {
                                videoHtml = `
                                    <div class="video-item">
                                        <iframe 
                                            width="100%" 
                                            height="400" 
                                            src="https://www.youtube.com/embed/${videoId}" 
                                            title="${enlace.descripcion}" 
                                            frameborder="0" 
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                            allowfullscreen>
                                        </iframe>
                                    </div>`;
                            } else {
                                videoHtml = `<a id="enlace-proyecto" href="${url}" target="_blank">${enlace.descripcion}</a>`;
                            }
                            return videoHtml;
                        }).join("")}
                    </div>
                </section>
            `;
        }
        html += `</div>`;

        // Galería de imágenes
        if (proyecto.detalles?.imagenes?.length > 0) {
            html += `
                <section class="galeria">
                    <h2>Galería del Evento</h2>
                    <div class="galeria-container">
                        ${proyecto.detalles.imagenes.map(img => `                            
                            <div class="galeria-item">
                                <img src="${img.url}" class="imagen-galeria" alt="Imagen del proyecto">
                                <p class="descripcion-imagen">${img.descripcion || 'Sin descripción'}</p>
                            </div>                            
                        `).join("")}
                        
                    </div>
                </section>
            `;
        }

        // Testimonios
        if (proyecto.detalles?.testimonios?.length > 0) {
            html += `
                <section class="testimonios">
                    <h2>Testimonios de Asistentes</h2>
                    <div class="testimonios-container">
                        ${proyecto.detalles.testimonios.map(testimonio => `
                            <div class="testimonio">
                                <div class="testimonio-contenido">
                                    <h3>${testimonio.autor}</h3>
                                    <p class="comentario">"${testimonio.contenido}"</p>
                                </div>
                            </div>
                        `).join("")}
                    </div>
                </section>
            `;
        }

        // Participantes: Agrupar por estado
        if (proyecto.detalles?.participantes?.length > 0) {
            let activos = [], inactivos = [], legacy = [];
            
            console.log("PARTICIPANTES RECIBIDOS:", proyecto.detalles.participantes);
            
            proyecto.detalles.participantes.forEach(p => {
                const estado = p.estado || 'activo';
                console.log(`Participante: ${p.nombre}, Estado en JSON: ${p.estado}, Estado usado: ${estado}`);
                if (estado === 'activo') activos.push(p);
                else if (estado === 'inactivo') inactivos.push(p);
                else if (estado === 'legacy') legacy.push(p);
            });
            
            console.log("ARRAYS FINALES:", { activos: activos.length, inactivos: inactivos.length, legacy: legacy.length });
            
            html += `<section class="participantes">`;
            
            // EQUIPO ACTUAL (ACTIVOS)
            if (activos.length > 0) {
                html += `
                    <div class="participantes-activos">
                        <h2>Equipo Actual</h2>
                        <div class="participantes-container">
                            ${activos.map(participante => `
                                <div class="participante estado-activo">
                                    <a href="./perfiles/profile-template.php?id=${participante.id}" class="participante-enlace">
                                        <img src="${participante.imagen}" class="imagen-participante" alt="Participante">
                                        <p class="nombre-participante">${participante.nombre}</p>
                                    </a>
                                </div>
                            `).join("")}
                        </div>
                    </div>
                `;
            }
            
            // COLABORADORES HISTÓRICOS (INACTIVOS)
            if (inactivos.length > 0) {
                html += `
                    <div class="participantes-inactivos">
                        <h2>Miembros que han pasado por el proyecto</h2>
                        <div class="participantes-container">
                            ${inactivos.map(participante => `
                                <div class="participante estado-inactivo">
                                    <a href="./perfiles/profile-template.php?id=${participante.id}" class="participante-enlace">
                                        <img src="${participante.imagen}" class="imagen-participante" alt="Participante">
                                        <p class="nombre-participante">${participante.nombre}</p>
                                    </a>
                                </div>
                            `).join("")}
                        </div>
                    </div>
                `;
            }
            
            // FUNDADORES/LEGACY
            if (legacy.length > 0) {
                html += `
                    <div class="participantes-legacy">
                        <h2>Participantes Fundadores</h2>
                        <div class="participantes-container">
                            ${legacy.map(participante => `
                                <div class="participante estado-legacy">
                                    <a href="./perfiles/profile-template.php?id=${participante.id}" class="participante-enlace">
                                        <img src="${participante.imagen}" class="imagen-participante" alt="Participante">
                                        <p class="nombre-participante">${participante.nombre}</p>
                                    </a>
                                </div>
                            `).join("")}
                        </div>
                    </div>
                `;
            }
            
            html += `</section>`;
        }
        // Clientes  <a href="/Gen10_Perfiles_web/frontend/perfil.php?id=${participante.id}" class="participante-enlace">
        if (proyecto.detalles?.cliente?.length > 0) {
            html += `
                <section class="participantes">
                    <h2>Cliente del proyecto</h2>
                    <div class="participantes-container">
                        ${proyecto.detalles.cliente.map(cliente => `
                            <div class="participante">
                                <a href="./client-template-public.php?id=${cliente.id}" class="participante-enlace">
                                    <p class="nombre-participante">${cliente.name}</p>
                                </a>
                            </div>
                        `).join("")}
                    </div>
                </section>
            `;
        }    

        // Agregar todo el HTML al contenedor
        contenedor.innerHTML = html;

    } catch (error) {
        console.error("Error en la petición:", error);
    }
    
});


//Manejo modal para ver imágenes más grandes
const modal = document.getElementById("modal-imagen");
const modalImg = document.getElementById("imagen-modal");
const modalDescripcion = document.getElementById("descripcion-modal");
const cerrarModal = document.querySelector(".cerrar-modal");
const flechaIzquierda = document.querySelector(".izquierda");
const flechaDerecha = document.querySelector(".derecha");

let imagenes = []; 
let imagenActual = 0;

// Capturar todas las imágenes de la galería y añadir evento de click
document.addEventListener("click", function (event) {
    if (event.target.classList.contains("imagen-galeria")) {
        imagenes = [...document.querySelectorAll(".imagen-galeria")]; // Obtener todas las imágenes
        imagenActual = imagenes.indexOf(event.target); // Obtener índice de la imagen seleccionada

        abrirModal(imagenActual);
    }
});

// Abrir el modal con la imagen seleccionada
function abrirModal(indice) {
    modal.style.display = "flex";
    modalImg.src = imagenes[indice].src;
    modalDescripcion.textContent = imagenes[indice].nextElementSibling.textContent || "Sin descripción";
}

// Cerrar el modal cuando se presiona la "X"
cerrarModal.addEventListener("click", function () {
    modal.style.display = "none";
});

// Cerrar el modal si se hace click fuera de la imagen
modal.addEventListener("click", function (event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
});

// Navegar a la imagen anterior
flechaIzquierda.addEventListener("click", function () {
    if (imagenActual > 0) {
        imagenActual--;
        abrirModal(imagenActual);
    }
});

// Navegar a la siguiente imagen
flechaDerecha.addEventListener("click", function () {
    if (imagenActual < imagenes.length - 1) {
        imagenActual++;
        abrirModal(imagenActual);
    }
});

// Modal cerrado al inicio
modal.style.display = "none";
