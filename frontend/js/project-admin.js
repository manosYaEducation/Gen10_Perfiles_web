document.addEventListener("DOMContentLoaded", () => {

    obtenerProyectos();

    async function obtenerProyectos() {
        try {
            const response = await fetch(API_URL_PHP + "project_admin.php");

            if (!response.ok) throw new Error("Error al obtener proyectos");

            const proyectos = await response.json();

            mostrarProyectosEnTabla(proyectos);

        } catch (error) {
            console.error("Error al obtener proyectos:", error);
        }
    };

    function mostrarProyectosEnTabla(proyectos) {
        const proyectosActivos = [];
        const proyectosFinalizados = [];
        const proyectosStandBy = [];
        const proyectosSinClasificar = [];

        proyectos.forEach(proyecto => {
            const estado = (proyecto.estado || '').trim();
            
            if (estado === 'Activo') {
                proyectosActivos.push(proyecto);
            } else if (estado === 'Finalizado') {
                proyectosFinalizados.push(proyecto);
            } else if (estado === 'StandBy') {
                proyectosStandBy.push(proyecto);
            } else {
                proyectosSinClasificar.push(proyecto);
            }
        });

        document.getElementById('seccion-activos').style.display = proyectosActivos.length > 0 ? 'block' : 'none';
        document.getElementById('seccion-finalizados').style.display = proyectosFinalizados.length > 0 ? 'block' : 'none';
        document.getElementById('seccion-standby').style.display = proyectosStandBy.length > 0 ? 'block' : 'none';
        document.getElementById('seccion-sin-clasificar').style.display = proyectosSinClasificar.length > 0 ? 'block' : 'none';

        cargarTabla('tablaProyectosActivos', proyectosActivos);
        cargarTabla('tablaProyectosFinalizados', proyectosFinalizados);
        cargarTabla('tablaProyectosStandBy', proyectosStandBy);
        cargarTabla('tablaProyectosSinClasificar', proyectosSinClasificar);
    }

    function cargarTabla(idTabla, proyectos) {
        const contenedor = document.getElementById(idTabla);
        if (!contenedor) return;

        contenedor.innerHTML = "";

        proyectos.forEach(proyecto => {
            const card = document.createElement("div");
            card.className = "proyecto-card";

            card.innerHTML = `
                <h3>${proyecto.titulo_tarjeta}</h3>
                <p>${proyecto.descripcion_tarjeta}</p>

                <div class="card-info">
                    <strong>ID:</strong> ${proyecto.id_proyecto}
                    ${proyecto.fecha ? ` | <strong>Período:</strong> ${proyecto.fecha}` : ''}
                </div>

                <div class="card-actions">
                    <button class="ver-btn">Ver</button>
                    <button class="edit-btn">Editar</button>
                    <button class="delete-btn">Eliminar</button>
                </div>
            `;

            card.querySelector(".ver-btn").addEventListener("click", (e) => {
                e.preventDefault();
                abrirModalDetalleProyecto(proyecto.id_proyecto);
            });

            card.querySelector(".edit-btn").addEventListener("click", () => {
                window.location.href = `proyecto-actualizar.html?id=${proyecto.id_proyecto}`;
            });

            card.querySelector(".delete-btn").addEventListener("click", () => {
                eliminarProyecto(proyecto.id_proyecto);
            });

            contenedor.appendChild(card);
        });
    }

    async function abrirModalDetalleProyecto(idProyecto) {
        const modalOverlay = document.getElementById("modal-detalle-proyecto");
        const modalContenido = document.getElementById("modal-proyecto-contenido");

        if (!modalOverlay || !modalContenido) return;

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
                </div>
            </div>
        `;

        modalOverlay.classList.add("activo");
        modalOverlay.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";

        if (!navigator.onLine) {
            renderizarMensajeError("offline", modalContenido, idProyecto);
            return;
        }

        try {
            const url = API_URL_PHP + (API_URL_PHP.endsWith("/") ? "" : "/") + `project_detail.php?id=${idProyecto}`;
            const response = await fetch(url);

            if (!response.ok) {
                if (response.status === 404) {
                    renderizarMensajeError("404", modalContenido, idProyecto);
                } else {
                    renderizarMensajeError("500", modalContenido, idProyecto);
                }
                return;
            }

            const data = await response.json();

            if (!data || data.length === 0 || data.error) {
                renderizarMensajeError("404", modalContenido, idProyecto);
                return;
            }

            const proyecto = data[0];
            renderizarDetalleEnModal(proyecto, modalContenido);

        } catch (error) {
            console.error("Error al cargar detalle del proyecto:", error);
            if (!navigator.onLine || error.name === 'TypeError') {
                renderizarMensajeError("offline", modalContenido, idProyecto);
            } else {
                renderizarMensajeError("server_error", modalContenido, idProyecto);
            }
        }
    }

    function renderizarMensajeError(tipoError, contenedor, idProyecto) {
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
            mensaje = "El proyecto solicitado no existe, fue removido o no se encuentra disponible en este momento.";
            iconClass = "fas fa-folder-open";
            colorClass = "blue";
            mostrarReintentar = false;
        } else if (tipoError === "500" || tipoError === "server_error") {
            titulo = "Error en el Servidor";
            mensaje = "El servidor experimentó un problema interno procesando la información del proyecto.";
            iconClass = "fas fa-server";
            colorClass = "red";
        }

        contenedor.innerHTML = `
            <div class="modal-proyecto-error-card">
                <div class="error-icon-box ${colorClass}">
                    <i class="${iconClass}"></i>
                </div>
                <h3>${titulo}</h3>
                <p>${mensaje}</p>
                <div style="display: flex; gap: 1rem; margin-top: 0.5rem; justify-content: center; flex-wrap: wrap;">
                    ${mostrarReintentar && idProyecto ? `
                        <button type="button" class="btn-reintentar-error" id="btn-reintentar-proyecto-admin">
                            <i class="fas fa-sync-alt"></i> Reintentar
                        </button>
                    ` : ''}
                    <button type="button" class="btn-reintentar-error btn-secundario-error" onclick="cerrarModalDetalleProyecto()">
                        Cerrar
                    </button>
                </div>
            </div>
        `;

        const btnRetry = contenedor.querySelector('#btn-reintentar-proyecto-admin');
        if (btnRetry && idProyecto) {
            btnRetry.onclick = () => {
                abrirModalDetalleProyecto(idProyecto);
            };
        }
    }

    function renderizarDetalleEnModal(proyecto, contenedor) {
        const baseUrl = window.location.origin + window.location.pathname.replace(/proyectos-admin\.html$/, '').replace(/\/$/, '');
        const shareUrl = `${baseUrl}/frontend/proyecto-detalle.php?id=${proyecto.id_proyecto}`;
        const shareText = `Echa un vistazo a este proyecto: ${proyecto.titulo || 'Proyecto Alpha Docere'}`;

        let html = `
            <div class="modal-proyecto-header" id="sec-encabezado">
                <h2>${proyecto.titulo || 'Proyecto sin título'}</h2>
                
                <div class="modal-proyecto-meta-row">
                    ${proyecto.fecha ? `<span class="modal-proyecto-fecha"><i class="far fa-calendar-alt"></i> ${proyecto.fecha}</span>` : ''}
                    
                    ${(proyecto.duracion || proyecto.fecha) ? `
                        <span class="modal-proyecto-duracion">
                            <i class="far fa-clock"></i> <strong>Período:</strong> ${proyecto.duracion || proyecto.fecha}
                        </span>
                    ` : ''}

                    <!-- Menú desplegable Compartir -->
                    <div class="proyecto-compartir-contenedor" id="compartir-contenedor-admin">
                        <button type="button" class="btn-compartir-main" id="btn-toggle-compartir-admin">
                            <i class="fas fa-share-alt"></i> Compartir
                        </button>

                        <div class="compartir-menu-desplegable" id="menu-compartir-admin">
                            <button type="button" class="compartir-item copiar" id="btn-copiar-enlace-admin">
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

        if (proyecto.contenido || proyecto.detalles?.parrafos?.length > 0) {
            html += `<div id="sec-descripcion">`;
            if (proyecto.contenido) {
                html += `
                    <div class="modal-proyecto-descripcion">
                        <p>${proyecto.contenido}</p>
                    </div>
                `;
            }

            if (proyecto.detalles?.parrafos?.length > 0) {
                html += `
                    <div class="modal-proyecto-parrafos">
                        ${proyecto.detalles.parrafos.map(p => `<p>${p}</p>`).join("")}
                    </div>
                `;
            }
            html += `</div>`;
        }

        if (proyecto.detalles?.imagenes?.length > 0) {
            html += `
                <div id="sec-galeria">
                    <h3 class="modal-proyecto-seccion-titulo"><i class="fas fa-images"></i> Galería del Proyecto</h3>
                    <div class="modal-proyecto-galeria">
                        ${proyecto.detalles.imagenes.map(img => `
                            <div class="modal-proyecto-galeria-item">
                                <img src="${img.url}" alt="${img.descripcion || 'Imagen del proyecto'}" onerror="this.onerror=null; this.src='../assets/img/proyecto-default.svg';">
                                ${img.descripcion ? `<p>${img.descripcion}</p>` : ''}
                            </div>
                        `).join("")}
                    </div>
                </div>
            `;
        } else {
            html += `
                <div id="sec-galeria">
                    <h3 class="modal-proyecto-seccion-titulo"><i class="fas fa-image"></i> Vista Previa del Proyecto</h3>
                    <div class="modal-proyecto-galeria" style="grid-template-columns: 1fr;">
                        <div class="modal-proyecto-galeria-item" style="max-width: 100%;">
                            <img src="../assets/img/proyecto-default.svg" alt="Proyecto sin imagen específica" style="height: 260px; object-fit: cover;">
                            <p style="padding: 0.75rem; color: #888; font-size: 0.9rem;">Recursos visuales en actualización para este proyecto.</p>
                        </div>
                    </div>
                </div>
            `;
        }

        html += `</div>`;
        contenedor.innerHTML = html;

        inicializarNavegacionPuntosVert(contenedor);
    }

    function inicializarNavegacionPuntosVert(contenedorModal) {
        const seccionesDefinidas = [
            { id: "sec-encabezado", label: "Inicio" },
            { id: "sec-descripcion", label: "Descripción" },
            { id: "sec-galeria", label: "Galería" }
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

        const modalScrollParent = contenedorModal.closest('.modal-proyecto-container') || window;

        const actualizarPuntoActivo = () => {
            let actualId = seccionesExistentes[0].id;
            const scrollPosition = modalScrollParent.scrollTop || window.scrollY;

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

        if (modalScrollParent === window) {
            window.addEventListener("scroll", actualizarPuntoActivo);
        } else {
            modalScrollParent.addEventListener("scroll", actualizarPuntoActivo);
        }
    }

    async function eliminarProyecto(id) {
        if (!confirm("¿Eliminar este proyecto?")) return;

        try {
            const response = await fetch(`${API_URL_PHP}project_admin.php?id_proyecto=${id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" }
            });

            if (!response.ok) throw new Error("Error al eliminar");

            const resultado = await response.json();
            alert(resultado.mensaje);
            obtenerProyectos();

        } catch (error) {
            console.error("Error al eliminar:", error);
        }
    }

});

