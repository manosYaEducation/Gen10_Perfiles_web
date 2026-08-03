document.addEventListener("DOMContentLoaded", () => {

    obtenerProyectos();
    inicializarEventosModalProyecto();

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
        // Separar proyectos por estado
        const proyectosActivos = [];
        const proyectosFinalizados = [];
        const proyectosStandBy = [];
        const proyectosSinClasificar = [];

        proyectos.forEach(proyecto => {
            // Normalizar estado: trim y comparación exacta
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

        // Mostrar u ocultar secciones según si tienen proyectos
        document.getElementById('seccion-activos').style.display = proyectosActivos.length > 0 ? 'block' : 'none';
        document.getElementById('seccion-finalizados').style.display = proyectosFinalizados.length > 0 ? 'block' : 'none';
        document.getElementById('seccion-standby').style.display = proyectosStandBy.length > 0 ? 'block' : 'none';
        document.getElementById('seccion-sin-clasificar').style.display = proyectosSinClasificar.length > 0 ? 'block' : 'none';

        // Cargar proyectos en cada tabla
        cargarTabla('tablaProyectosActivos', proyectosActivos);
        cargarTabla('tablaProyectosFinalizados', proyectosFinalizados);
        cargarTabla('tablaProyectosStandBy', proyectosStandBy);
        cargarTabla('tablaProyectosSinClasificar', proyectosSinClasificar);
    }

    function cargarTabla(idTabla, proyectos) {
        const contenedor = document.getElementById(idTabla);
        if (!contenedor) {
            console.error(`Elemento #${idTabla} no encontrado.`);
            return;
        }

        contenedor.innerHTML = "";

        proyectos.forEach(proyecto => {
            const card = document.createElement("div");
            card.className = "proyecto-card";

            card.innerHTML = `
                <h3>${proyecto.titulo_tarjeta}</h3>
                <p>${proyecto.descripcion_tarjeta}</p>

                <div class="card-info">
                    <strong>ID:</strong> ${proyecto.id_proyecto}
                </div>

                <div class="card-actions">
                    <button class="ver-btn">Ver</button>
                    <button class="edit-btn">Editar</button>
                    <button class="delete-btn">Eliminar</button>
                </div>
            `;

            card.querySelector(".ver-btn").addEventListener("click", () => {
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

    // ==========================================
    // Lógica del Modal en Administración
    // ==========================================

    async function abrirModalDetalleProyecto(idProyecto) {
        const modalOverlay = document.getElementById("modal-detalle-proyecto");
        const modalContenido = document.getElementById("modal-proyecto-contenido");

        if (!modalOverlay || !modalContenido) return;

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
        const baseUrl = window.location.origin + window.location.pathname.replace(/frontend\/proyectos-admin\.html$/, '').replace(/\/$/, '');
        const shareUrl = `${baseUrl}/frontend/proyecto-detalle.php?id=${proyecto.id_proyecto}`;
        const shareText = `Echa un vistazo a este proyecto: ${proyecto.titulo || 'Proyecto Alpha Docere'}`;

        let html = `
            <div class="modal-proyecto-header">
                <h2>${proyecto.titulo || 'Proyecto sin título'}</h2>

                <div class="modal-proyecto-meta-row">
                    ${proyecto.fecha ? `<span class="modal-proyecto-fecha"><i class="far fa-calendar-alt"></i> ${proyecto.fecha}</span>` : ''}

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
                            <a href="../frontend/perfiles/profile-template.php?id=${p.id}" class="modal-proyecto-participante" style="text-decoration: none;">
                                <img src="${p.imagen || '../assets/img/perfil-default.png'}" alt="${p.nombre}">
                                <span>${p.nombre}</span>
                            </a>
                        `).join("")}
                    </div>
                </div>
            `;
        }

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

});

