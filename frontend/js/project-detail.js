document.addEventListener("DOMContentLoaded", function () {
    const idProyecto = new URL(window.location.href).searchParams.get("id");
    cargarDetalleProyecto(idProyecto);
});

async function cargarDetalleProyecto(idProyecto) {
    const contenedor = document.getElementById("proyecto-container");

    if (!idProyecto) {
        renderizarMensajeErrorStandalone("404", contenedor);
        return;
    }

    if (contenedor) {
        contenedor.innerHTML = `
            <div class="skeleton-container" style="max-width: 900px; margin: 2rem auto; padding: 0 1.5rem;">
                <div class="skeleton-header">
                    <div class="skeleton-box skeleton-title"></div>
                    <div class="skeleton-box skeleton-pill"></div>
                </div>
                <div class="skeleton-box skeleton-text"></div>
                <div class="skeleton-box skeleton-text"></div>
                <div class="skeleton-box skeleton-text short"></div>
                <div class="skeleton-grid">
                    <div class="skeleton-box skeleton-card"></div>
                    <div class="skeleton-box skeleton-card"></div>
                </div>
            </div>
        `;
    }

    if (!navigator.onLine) {
        renderizarMensajeErrorStandalone("offline", contenedor, idProyecto);
        return;
    }

    try {
        const response = await fetch(API_URL_PHP + `/project_detail.php?id=${idProyecto}`);

        if (!response.ok) {
            if (response.status === 404) {
                renderizarMensajeErrorStandalone("404", contenedor, idProyecto);
            } else {
                renderizarMensajeErrorStandalone("500", contenedor, idProyecto);
            }
            return;
        }

        const data = await response.json();

        if (!data || data.length === 0 || data.error) {
            renderizarMensajeErrorStandalone("404", contenedor, idProyecto);
            return;
        }

        const proyecto = data[0];
        renderizarVistaStandalone(proyecto, contenedor);

    } catch (error) {
        console.error("Error al obtener detalle del proyecto:", error);
        if (!navigator.onLine || error.name === 'TypeError') {
            renderizarMensajeErrorStandalone("offline", contenedor, idProyecto);
        } else {
            renderizarMensajeErrorStandalone("server_error", contenedor, idProyecto);
        }
    }
}

function renderizarMensajeErrorStandalone(tipoError, contenedor, idProyecto) {
    let titulo = "Error al cargar proyecto";
    let mensaje = "Ocurrió un problema inesperado al obtener los detalles del proyecto.";
    let iconClass = "fas fa-exclamation-triangle";
    let colorClass = "orange";
    let mostrarReintentar = true;

    if (tipoError === "offline" || !navigator.onLine) {
        titulo = "Sin conexión a Internet";
        mensaje = "No se pudo conectar con el servidor. Revisa tu conexión de red e inténtalo de nuevo.";
        iconClass = "fas fa-wifi";
        colorClass = "red";
    } else if (tipoError === "404" || tipoError === "not_found") {
        titulo = "Proyecto no encontrado";
        mensaje = "El proyecto solicitado no existe, fue removido o no se encuentra disponible actualmente.";
        iconClass = "fas fa-folder-open";
        colorClass = "blue";
        mostrarReintentar = false;
    } else if (tipoError === "500" || tipoError === "server_error") {
        titulo = "Error en el Servidor";
        mensaje = "El servidor experimentó un problema interno procesando la información del proyecto.";
        iconClass = "fas fa-server";
        colorClass = "red";
    }

    if (!contenedor) return;

    contenedor.innerHTML = `
        <div class="modal-proyecto-error-card" style="margin: 4rem auto; min-height: 50vh;">
            <div class="error-icon-box ${colorClass}">
                <i class="${iconClass}"></i>
            </div>
            <h3>${titulo}</h3>
            <p>${mensaje}</p>
            <div style="display: flex; gap: 1rem; margin-top: 1rem; justify-content: center; flex-wrap: wrap;">
                ${mostrarReintentar && idProyecto ? `
                    <button type="button" class="btn-reintentar-error" id="btn-reintentar-standalone">
                        <i class="fas fa-sync-alt"></i> Reintentar
                    </button>
                ` : ''}
                <a href="../index.html" class="btn-reintentar-error btn-secundario-error" style="text-decoration: none;">
                    Volver al inicio
                </a>
            </div>
        </div>
    `;

    const btnRetry = contenedor.querySelector('#btn-reintentar-standalone');
    if (btnRetry && idProyecto) {
        btnRetry.onclick = () => {
            cargarDetalleProyecto(idProyecto);
        };
    }
}

function renderizarVistaStandalone(proyecto, contenedor) {

        //Sección de información del evento
        let html = `
            <div id="evento" class="evento-info">
                <h2 id="titulo-evento">${proyecto.titulo}</h2>
                <p id="descripcion-evento">${proyecto.contenido}</p>
        `;

        // Párrafos
        if (proyecto.detalles?.parrafos?.length > 0) {
            html += `
                <div class="parrafos-proyecto">        
                    ${proyecto.detalles.parrafos.map(p => `<p id="descripcion-detallada">${p}</p>`).join("")}
                </div>        
            `;
        }

        if (proyecto.detalles?.enlaces?.length > 0) {
            html += `
                <section class="enlaces">
                    <div class="enlaces-container">
                        ${proyecto.detalles.enlaces.map(enlace => `
                            <a id="enlace-proyecto" href="${enlace.url}" target="_blank">${enlace.descripcion}</a>
                        `).join("")}
                    </div>
                </section>
            `;
        }
        html += `</div>`;

        // Tecnologías
        if (proyecto.detalles?.tecnologias?.length > 0) {
            html += `
                <section class="tecnologias">
                    <h2>Tecnologías</h2>
                    <div class="tecnologias-container">
                        ${proyecto.detalles.tecnologias.map(tec => `
                            <span class="tecnologia-item">${tec}</span>
                        `).join("")}
                    </div>
                </section>
            `;
        }

        // Galería de imágenes (con fallback de imagen por defecto)
        if (proyecto.detalles?.imagenes?.length > 0) {
            html += `
                <section class="galeria">
                    <h2>Galería del Evento</h2>
                    <div class="galeria-container">
                        ${proyecto.detalles.imagenes.map(img => `                            
                            <div class="galeria-item">
                                <img src="${img.url}" class="imagen-galeria" alt="Imagen del proyecto" onerror="this.onerror=null; this.src='../assets/img/proyecto-default.svg';">
                                <p class="descripcion-imagen">${img.descripcion}</p>
                            </div>                            
                        `).join("")}
                        
                    </div>
                </section>
            `;
        } else {
            // Imagen por defecto cuando no hay recursos visuales
            html += `
                <section class="galeria">
                    <h2>Vista Previa del Proyecto</h2>
                    <div class="galeria-container" style="grid-template-columns: 1fr; justify-content: center;">
                        <div class="galeria-item" style="max-width: 600px; width: 100%; margin: 0 auto;">
                            <img src="../assets/img/proyecto-default.svg" class="imagen-galeria" alt="Proyecto sin imagen específica" style="height: 280px; object-fit: cover;">
                            <p class="descripcion-imagen">Recursos visuales en actualización para este proyecto.</p>
                        </div>
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

        // Participantes: Agrupar por estado (activos, históricos, legacy)
        if (proyecto.detalles?.participantes?.length > 0) {
            let activos = [], inactivos = [], legacy = [];
            
            // Deduplicar participantes por ID
            const seen = new Set();
            const participantesUnicos = proyecto.detalles.participantes.filter(p => {
                if (seen.has(p.id)) return false;
                seen.add(p.id);
                return true;
            });

            participantesUnicos.forEach(p => {
                const estado = p.estado || 'activo';
                if (estado === 'activo') activos.push(p);
                else if (estado === 'inactivo') inactivos.push(p);
                else if (estado === 'legacy') legacy.push(p);
            });
            
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

    ${participante.rol
        ? `<p class="rol-participante">${participante.rol}</p>`
        : ''
    }
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

    ${participante.rol
        ? `<p class="rol-participante">${participante.rol}</p>`
        : ''
    }
</a>
                                </div>
                            `).join("")}
                        </div>
                    </div>
                `;
            }
            
            // PARTICIPANTES FUNDADORES (LEGACY)
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

    ${participante.rol
        ? `<p class="rol-participante">${participante.rol}</p>`
        : ''
    }
</a>
                                </div>
                            `).join("")}
                        </div>
                    </div>
                `;
            }
            
            html += `</section>`;
        }
        
        // Clientes
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
const flechaIzquierda = document.querySelector(".izquierda")
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
    modalDescripcion.textContent = imagenes[indice].nextElementSibling.textContent;
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