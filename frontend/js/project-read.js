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

    // Mostrar Skeleton Screen animado mientras se obtienen los datos
    modalContenido.innerHTML = `
        <div class="skeleton-container">
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
                <div class="skeleton-box skeleton-card"></div>
            </div>
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
    const baseUrl = window.location.origin + window.location.pathname.replace(/index\.html$/, '').replace(/\/$/, '');
    const shareUrl = `${baseUrl}/frontend/proyecto-detalle.php?id=${proyecto.id_proyecto}`;
    const shareText = `Echa un vistazo a este proyecto: ${proyecto.titulo || 'Proyecto Alpha Docere'}`;

    let html = `
        <div class="modal-proyecto-header">
            <h2>${proyecto.titulo || 'Proyecto sin título'}</h2>
            
            <div class="modal-proyecto-meta-row">
                ${proyecto.fecha ? `<span class="modal-proyecto-fecha"><i class="far fa-calendar-alt"></i> ${proyecto.fecha}</span>` : ''}

                <!-- Menú desplegable Compartir -->
                <div class="proyecto-compartir-contenedor" id="compartir-contenedor">
                    <button type="button" class="btn-compartir-main" id="btn-toggle-compartir">
                        <i class="fas fa-share-alt"></i> Compartir
                    </button>

                    <div class="compartir-menu-desplegable" id="menu-compartir">
                        <button type="button" class="compartir-item copiar" id="btn-copiar-enlace">
                            <i class="far fa-copy"></i> Copiar Enlace
                        </button>
                        <a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}" target="_blank" rel="noopener noreferrer" class="compartir-item linkedin">
                            <i class="fab fa-linkedin"></i> LinkedIn
                        </a>
                        <a href="https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + shareUrl)}" target="_blank" rel="noopener noreferrer" class="compartir-item whatsapp">
                            <i class="fab fa-whatsapp"></i> WhatsApp
                        </a>
                        <a href="https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}" target="_blank" rel="noopener noreferrer" class="compartir-item twitter">
                            <i class="fab fa-twitter"></i> X (Twitter)
                        </a>
                    </div>
                </div>
            </div>
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

    // Galería de imágenes (con fallback de imagen por defecto)
    if (proyecto.detalles?.imagenes?.length > 0) {
        html += `
            <div>
                <h3 class="modal-proyecto-seccion-titulo"><i class="fas fa-images"></i> Galería del Proyecto</h3>
                <div class="modal-proyecto-galeria">
                    ${proyecto.detalles.imagenes.map(img => `
                        <div class="modal-proyecto-galeria-item">
                            <img src="${img.url}" alt="${img.descripcion || 'Imagen del proyecto'}" onerror="this.onerror=null; this.src='assets/img/proyecto-default.svg';">
                            ${img.descripcion ? `<p>${img.descripcion}</p>` : ''}
                        </div>
                    `).join("")}
                </div>
            </div>
        `;
    } else {
        // Imagen por defecto cuando no hay recursos visuales para evitar espacios vacíos
        html += `
            <div>
                <h3 class="modal-proyecto-seccion-titulo"><i class="fas fa-image"></i> Vista Previa del Proyecto</h3>
                <div class="modal-proyecto-galeria" style="grid-template-columns: 1fr;">
                    <div class="modal-proyecto-galeria-item" style="max-width: 100%;">
                        <img src="assets/img/proyecto-default.svg" alt="Proyecto sin imagen específica" style="height: 260px; object-fit: cover;">
                        <p style="padding: 0.75rem; color: #888; font-size: 0.9rem;">Recursos visuales en actualización para este proyecto.</p>
                    </div>
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

    // Participantes / Equipo (con fallback onerror en imágenes)
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
                            <img src="${p.imagen || 'assets/img/default-profile.png'}" alt="${p.nombre}" onerror="this.onerror=null; this.src='assets/img/default-profile.png';">
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

    // Asignar listeners del botón de compartir y copiar enlace
    inicializarManejadorCompartir(shareUrl);
}

function inicializarManejadorCompartir(shareUrl) {
    const compartirContenedor = document.getElementById("compartir-contenedor");
    const toggleBtn = document.getElementById("btn-toggle-compartir");
    const copiarBtn = document.getElementById("btn-copiar-enlace");

    if (toggleBtn && compartirContenedor) {
        toggleBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            compartirContenedor.classList.toggle("open");
        });
    }

    // Cerrar menú si se hace clic fuera
    document.addEventListener("click", (e) => {
        if (compartirContenedor && !compartirContenedor.contains(e.target)) {
            compartirContenedor.classList.remove("open");
        }
    });

    if (copiarBtn) {
        copiarBtn.addEventListener("click", (e) => {
            e.preventDefault();
            copiarAlPortapapeles(shareUrl);
            if (compartirContenedor) compartirContenedor.classList.remove("open");
        });
    }
}

function copiarAlPortapapeles(texto) {
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(texto).then(() => {
            mostrarToastNotificacion("¡Enlace copiado al portapapeles!");
        }).catch(err => {
            fallbackCopiarPortapapeles(texto);
        });
    } else {
        fallbackCopiarPortapapeles(texto);
    }
}

function fallbackCopiarPortapapeles(texto) {
    const textarea = document.createElement("textarea");
    textarea.value = texto;
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    try {
        document.execCommand("copy");
        mostrarToastNotificacion("¡Enlace copiado al portapapeles!");
    } catch (err) {
        console.error("Error al copiar enlace:", err);
    }
    document.body.removeChild(textarea);
}

function mostrarToastNotificacion(mensaje) {
    let toast = document.getElementById("compartir-toast");
    if (!toast) {
        toast = document.createElement("div");
        toast.id = "compartir-toast";
        toast.className = "compartir-toast";
        toast.innerHTML = `<i class="fas fa-check-circle"></i><span>${mensaje}</span>`;
        document.body.appendChild(toast);
    } else {
        toast.querySelector("span").textContent = mensaje;
    }

    toast.classList.add("mostrar");
    setTimeout(() => {
        toast.classList.remove("mostrar");
    }, 2800);
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

