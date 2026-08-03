async function cargarProyectos() {
    try {
        const response = await fetch(API_URL_PHP + "project_read.php");
        const json = await response.json();

        // La API puede devolver directamente un array o un objeto { success, data }
        let proyectos = [];
        if (Array.isArray(json)) {
            proyectos = json;
        } else if (json && Array.isArray(json.data)) {
            proyectos = json.data;
        } else {
            console.error('Respuesta inesperada al obtener proyectos:', json);
            throw new Error('Formato de respuesta inválido');
        }

        // Ordenar los proyectos por fecha en orden descendente
        proyectos.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

        // Tomar solo los últimos 5 proyectos
        const ultimosProyectos = proyectos.slice(0, 5);

        mostrarProyectos(ultimosProyectos);
        inicializarEventosModalProyecto();
        
    } catch (error) {
        console.error("Error al obtener proyectos:", error);
        document.getElementById("contenedor-proyecto").innerHTML = `<p style="color: red;">Error al cargar los proyectos.</p>`;
    }
}

function mostrarProyectos(proyectos) {
    const contenedor = document.getElementById("contenedor-proyecto");
    contenedor.innerHTML = ""; // Limpiar el contenedor antes de agregar nuevos proyectos

    proyectos.forEach(proyecto => {
        const div = document.createElement("div");
        div.classList.add("proyecto");

        div.innerHTML = `
            <div class="proyecto-timeline">
                <div class="proyecto-fecha">${proyecto.fecha}</div>
                <div class="proyecto-linea"></div>
                <div class="proyecto-tarjeta" style="cursor: pointer;">
                    <a href="javascript:void(0);" class="proyecto-titulo" data-id="${proyecto.id_proyecto}">${proyecto.titulo_tarjeta}</a>
                </div>
            </div>
        `;

        // Interceptar clic en la tarjeta o el título para abrir el modal
        const tituloBtn = div.querySelector('.proyecto-titulo');
        const tarjeta = div.querySelector('.proyecto-tarjeta');

        const abrirHandler = (e) => {
            e.preventDefault();
            abrirModalDetalleProyecto(proyecto.id_proyecto);
        };

        tituloBtn.addEventListener('click', abrirHandler);
        tarjeta.addEventListener('click', (e) => {
            if (e.target !== tituloBtn) {
                abrirHandler(e);
            }
        });

        contenedor.appendChild(div);
    });
}

// ==========================================
// Lógica de Modal de Detalle de Proyecto
// ==========================================

async function abrirModalDetalleProyecto(idProyecto) {
    const modalOverlay = document.getElementById("modal-detalle-proyecto");
    const modalContenido = document.getElementById("modal-proyecto-contenido");

    if (!modalOverlay || !modalContenido) return;

    // Mostrar loader mientras se obtienen los datos
    modalContenido.innerHTML = `
        <div class="modal-proyecto-cargando">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Cargando información del proyecto...</p>
        </div>
    `;

    modalOverlay.classList.add("activo");
    modalOverlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    try {
        const url = API_URL_PHP + (API_URL_PHP.endsWith("/") ? "" : "/") + `project_detail.php?id=${idProyecto}`;
        const response = await fetch(url);
        const data = await response.json();

        if (!data || data.length === 0) {
            modalContenido.innerHTML = `
                <div style="text-align: center; padding: 2rem;">
                    <p style="color: #e53935; font-weight: 600;">No se encontró información para este proyecto.</p>
                </div>
            `;
            return;
        }

        const proyecto = data[0];
        renderizarDetalleEnModal(proyecto, modalContenido);

    } catch (error) {
        console.error("Error al cargar detalle del proyecto:", error);
        modalContenido.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <p style="color: #e53935; font-weight: 600;">Ocurrió un error al cargar la información del proyecto.</p>
            </div>
        `;
    }
}

function renderizarDetalleEnModal(proyecto, contenedor) {
    let html = `
        <div class="modal-proyecto-header">
            <h2>${proyecto.titulo || 'Proyecto sin título'}</h2>
            ${proyecto.fecha ? `<span class="modal-proyecto-fecha"><i class="far fa-calendar-alt"></i> ${proyecto.fecha}</span>` : ''}
        </div>

        <div class="modal-proyecto-body">
    `;

    // Descripción principal
    if (proyecto.contenido) {
        html += `
            <div class="modal-proyecto-descripcion">
                <p>${proyecto.contenido}</p>
            </div>
        `;
    }

    // Párrafos adicionales
    if (proyecto.detalles?.parrafos?.length > 0) {
        html += `
            <div class="modal-proyecto-parrafos">
                ${proyecto.detalles.parrafos.map(p => `<p>${p}</p>`).join("")}
            </div>
        `;
    }

    // Enlaces del proyecto
    if (proyecto.detalles?.enlaces?.length > 0) {
        html += `
            <div class="modal-proyecto-enlaces">
                ${proyecto.detalles.enlaces.map(enlace => `
                    <a href="${enlace.url}" target="_blank" class="modal-proyecto-enlace-btn">
                        <i class="fas fa-external-link-alt"></i> ${enlace.descripcion || 'Ver enlace'}
                    </a>
                `).join("")}
            </div>
        `;
    }

    // Galería de imágenes
    if (proyecto.detalles?.imagenes?.length > 0) {
        html += `
            <div>
                <h3 class="modal-proyecto-seccion-titulo"><i class="fas fa-images"></i> Galería del Proyecto</h3>
                <div class="modal-proyecto-galeria">
                    ${proyecto.detalles.imagenes.map(img => `
                        <div class="modal-proyecto-galeria-item">
                            <img src="${img.url}" alt="${img.descripcion || 'Imagen del proyecto'}">
                            ${img.descripcion ? `<p>${img.descripcion}</p>` : ''}
                        </div>
                    `).join("")}
                </div>
            </div>
        `;
    }

    // Testimonios
    if (proyecto.detalles?.testimonios?.length > 0) {
        html += `
            <div>
                <h3 class="modal-proyecto-seccion-titulo"><i class="fas fa-quote-left"></i> Testimonios</h3>
                <div class="modal-proyecto-testimonios">
                    ${proyecto.detalles.testimonios.map(t => `
                        <div class="modal-proyecto-testimonio-card">
                            <h4>${t.autor}</h4>
                            <p>"${t.contenido}"</p>
                        </div>
                    `).join("")}
                </div>
            </div>
        `;
    }

    // Participantes / Equipo
    if (proyecto.detalles?.participantes?.length > 0) {
        const seen = new Set();
        const unicos = proyecto.detalles.participantes.filter(p => {
            if (seen.has(p.id)) return false;
            seen.add(p.id);
            return true;
        });

        html += `
            <div>
                <h3 class="modal-proyecto-seccion-titulo"><i class="fas fa-users"></i> Equipo del Proyecto</h3>
                <div class="modal-proyecto-participantes-grid">
                    ${unicos.map(p => `
                        <a href="frontend/perfiles/profile-template.php?id=${p.id}" class="modal-proyecto-participante" style="text-decoration: none;">
                            <img src="${p.imagen || 'assets/img/perfil-default.png'}" alt="${p.nombre}">
                            <span>${p.nombre}</span>
                        </a>
                    `).join("")}
                </div>
            </div>
        `;
    }

    // Clientes
    if (proyecto.detalles?.cliente?.length > 0) {
        html += `
            <div>
                <h3 class="modal-proyecto-seccion-titulo"><i class="fas fa-building"></i> Cliente</h3>
                <div class="modal-proyecto-participantes-grid">
                    ${proyecto.detalles.cliente.map(c => `
                        <div class="modal-proyecto-participante">
                            <i class="fas fa-handshake" style="font-size: 2rem; color: #4CAF50; margin-bottom: 0.5rem;"></i>
                            <span>${c.name}</span>
                        </div>
                    `).join("")}
                </div>
            </div>
        `;
    }

    html += `</div>`;
    contenedor.innerHTML = html;
}

function cerrarModalDetalleProyecto() {
    const modalOverlay = document.getElementById("modal-detalle-proyecto");
    if (modalOverlay) {
        modalOverlay.classList.remove("activo");
        modalOverlay.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
    }
}

function inicializarEventosModalProyecto() {
    const cerrarBtn = document.getElementById("cerrar-modal-proyecto");
    const modalOverlay = document.getElementById("modal-detalle-proyecto");

    if (cerrarBtn) {
        cerrarBtn.onclick = cerrarModalDetalleProyecto;
    }

    if (modalOverlay) {
        modalOverlay.onclick = (e) => {
            if (e.target === modalOverlay) {
                cerrarModalDetalleProyecto();
            }
        };
    }

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modalOverlay && modalOverlay.classList.contains("activo")) {
            cerrarModalDetalleProyecto();
        }
    });
}

// Cargar proyectos cuando se cargue la página
document.addEventListener("DOMContentLoaded", cargarProyectos);

