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
        const response = await fetch(API_URL_PHP + `project_detail.php?id=${idProyecto}`);

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
    if (!contenedor) return;

    // Sección Encabezado e Info
    let html = `
        <div id="sec-encabezado" class="evento-info">
            <h2 id="titulo-evento">${proyecto.titulo || 'Proyecto sin título'}</h2>
            
            ${(proyecto.duracion || proyecto.fecha) ? `
                <div style="margin-bottom: 1rem;">
                    <span class="modal-proyecto-duracion">
                        <i class="far fa-clock"></i> <strong>Período de Ejecución:</strong> ${proyecto.duracion || proyecto.fecha}
                    </span>
                </div>
            ` : ''}

            <div id="sec-descripcion">
                <p id="descripcion-evento">${proyecto.contenido || ''}</p>
    `;

    // Párrafos adicionales
    if (proyecto.detalles?.parrafos?.length > 0) {
        html += `
            <div class="parrafos-proyecto">        
                ${proyecto.detalles.parrafos.map(p => `<p id="descripcion-detallada">${p}</p>`).join("")}
            </div>        
        `;
    }

    // Enlaces del proyecto
    if (proyecto.detalles?.enlaces?.length > 0) {
        html += `
            <section class="enlaces">
                <div class="enlaces-container">
                    ${proyecto.detalles.enlaces.map(enlace => `
                        <a id="enlace-proyecto" href="${enlace.url}" target="_blank">${enlace.descripcion || 'Ver enlace'}</a>
                    `).join("")}
                </div>
            </section>
        `;
    }
    html += `</div></div>`;

    // Galería de imágenes
    if (proyecto.detalles?.imagenes?.length > 0) {
        html += `
            <section class="galeria" id="sec-galeria">
                <h2>Galería del Evento</h2>
                <div class="galeria-container">
                    ${proyecto.detalles.imagenes.map(img => `                            
                        <div class="galeria-item">
                            <img src="${img.url}" class="imagen-galeria" alt="Imagen del proyecto" onerror="this.onerror=null; this.src='../assets/img/proyecto-default.svg';">
                            <p class="descripcion-imagen">${img.descripcion || ''}</p>
                        </div>                            
                    `).join("")}
                </div>
            </section>
        `;
    } else {
        html += `
            <section class="galeria" id="sec-galeria">
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
            <section class="testimonios" id="sec-testimonios">
                <h2>Testimonios de Asistentes</h2>
                <div class="testimonios-container">
                    ${proyecto.detalles.testimonios.map(testimonio => `
                        <div class="testimonio">
                            <p class="contenido-testimonio">"${testimonio.contenido}"</p>
                            <p class="autor-testimonio">- ${testimonio.autor}</p>
                        </div>
                    `).join("")}
                </div>
            </section>
        `;
    }

    // Participantes / Equipo
    if (proyecto.detalles?.participantes?.length > 0) {
        const seen = new Set();
        const participantesUnicos = proyecto.detalles.participantes.filter(p => {
            if (seen.has(p.id)) return false;
            seen.add(p.id);
            return true;
        });

        html += `
            <section class="participantes" id="sec-equipo">
                <h2>Equipo del Proyecto</h2>
                <div class="participantes-container">
                    ${participantesUnicos.map(p => `
                        <div class="participante">
                            <a href="./perfiles/profile-template.php?id=${p.id}" class="participante-enlace">
                                <img src="${p.imagen || '../assets/img/default-profile.png'}" class="imagen-participante" alt="${p.nombre}" onerror="this.onerror=null; this.src='../assets/img/default-profile.png';">
                                <p class="nombre-participante">${p.nombre}</p>
                            </a>
                        </div>
                    `).join("")}
                </div>
            </section>
        `;
    }

    // Clientes
    if (proyecto.detalles?.cliente?.length > 0) {
        html += `
            <section class="participantes" id="sec-cliente">
                <h2>Cliente del Proyecto</h2>
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

    contenedor.innerHTML = html;

    // Inicializar Navegación por Puntos Redondos Verticales
    inicializarNavegacionPuntosVert(contenedor);
}

function inicializarNavegacionPuntosVert(contenedorModal) {
    const seccionesDefinidas = [
        { id: "sec-encabezado", label: "Inicio" },
        { id: "sec-descripcion", label: "Descripción" },
        { id: "sec-galeria", label: "Galería" },
        { id: "sec-testimonios", label: "Testimonios" },
        { id: "sec-equipo", label: "Equipo" },
        { id: "sec-cliente", label: "Cliente" }
    ];

    const seccionesExistentes = seccionesDefinidas.filter(s => contenedorModal.querySelector(`#${s.id}`));
    if (seccionesExistentes.length < 2) return;

    const dotNavContainer = document.createElement("div");
    dotNavContainer.className = "proyecto-dot-nav";
    dotNavContainer.setAttribute("aria-label", "Navegación rápida por secciones");

    seccionesExistentes.forEach((sec, index) => {
        const itemBtn = document.createElement("button");
        itemBtn.type = "button";
        itemBtn.className = "dot-nav-item";
        itemBtn.setAttribute("data-target", sec.id);

        itemBtn.innerHTML = `
            <span class="dot-circle ${index === 0 ? 'active' : ''}"></span>
            <span class="dot-label">${sec.label}</span>
        `;

        itemBtn.addEventListener("click", () => {
            const elTarget = contenedorModal.querySelector(`#${sec.id}`);
            if (elTarget) {
                elTarget.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        });

        dotNavContainer.appendChild(itemBtn);
    });

    contenedorModal.insertBefore(dotNavContainer, contenedorModal.firstChild);

    const actualizarPuntoActivo = () => {
        let actualId = seccionesExistentes[0].id;
        const scrollPosition = window.scrollY;

        seccionesExistentes.forEach(sec => {
            const el = contenedorModal.querySelector(`#${sec.id}`);
            if (el) {
                const top = el.offsetTop - 120;
                if (scrollPosition >= top) {
                    actualId = sec.id;
                }
            }
        });

        dotNavContainer.querySelectorAll(".dot-nav-item").forEach(item => {
            const circle = item.querySelector(".dot-circle");
            if (item.getAttribute("data-target") === actualId) {
                circle.classList.add("active");
            } else {
                circle.classList.remove("active");
            }
        });
    };

    window.addEventListener("scroll", actualizarPuntoActivo);
}