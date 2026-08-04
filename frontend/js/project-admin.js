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
        // Nota: Se eliminó cargarTabla('tablaProyectos', proyectos) porque ese elemento no existe en el HTML
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
                window.location.href = `proyecto-admin-detalle.html?id=${proyecto.id_proyecto}`;
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

});
