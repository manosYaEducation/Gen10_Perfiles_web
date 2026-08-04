document.addEventListener("DOMContentLoaded", () => {
    const idProyecto = new URL(window.location.href).searchParams.get("id");

    cargarDetalleProyecto(idProyecto);
    inicializarModalImagen();
});

async function cargarDetalleProyecto(idProyecto) {
    const contenedor = document.getElementById("proyecto-container");

    if (!contenedor) {
        console.error("No se encontró #proyecto-container.");
        return;
    }

    if (!idProyecto) {
        renderizarMensajeErrorStandalone("404", contenedor);
        return;
    }

    contenedor.innerHTML = `
        <div
            class="skeleton-container"
            style="max-width: 900px; margin: 2rem auto; padding: 0 1.5rem;"
        >
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

    if (!navigator.onLine) {
        renderizarMensajeErrorStandalone(
            "offline",
            contenedor,
            idProyecto
        );
        return;
    }

    try {
        const url =
            API_URL_PHP +
            (API_URL_PHP.endsWith("/") ? "" : "/") +
            `project_detail.php?id=${encodeURIComponent(idProyecto)}`;

        const response = await fetch(url);

        if (!response.ok) {
            renderizarMensajeErrorStandalone(
                response.status === 404 ? "404" : "500",
                contenedor,
                idProyecto
            );
            return;
        }

        const data = await response.json();

        if (
            !Array.isArray(data) ||
            data.length === 0 ||
            data.error
        ) {
            renderizarMensajeErrorStandalone(
                "404",
                contenedor,
                idProyecto
            );
            return;
        }

        renderizarVistaStandalone(data[0], contenedor);

    } catch (error) {
        console.error(
            "Error al obtener detalle del proyecto:",
            error
        );

        const tipoError =
            !navigator.onLine || error.name === "TypeError"
                ? "offline"
                : "server_error";

        renderizarMensajeErrorStandalone(
            tipoError,
            contenedor,
            idProyecto
        );
    }
}

function renderizarMensajeErrorStandalone(
    tipoError,
    contenedor,
    idProyecto
) {
    if (!contenedor) return;

    let titulo = "Error al cargar proyecto";
    let mensaje =
        "Ocurrió un problema inesperado al obtener los detalles del proyecto.";
    let iconClass = "fas fa-exclamation-triangle";
    let colorClass = "orange";
    let mostrarReintentar = true;

    if (tipoError === "offline" || !navigator.onLine) {
        titulo = "Sin conexión a Internet";
        mensaje =
            "No se pudo conectar con el servidor. Revisa tu conexión de red e inténtalo de nuevo.";
        iconClass = "fas fa-wifi";
        colorClass = "red";

    } else if (
        tipoError === "404" ||
        tipoError === "not_found"
    ) {
        titulo = "Proyecto no encontrado";
        mensaje =
            "El proyecto solicitado no existe, fue removido o no se encuentra disponible actualmente.";
        iconClass = "fas fa-folder-open";
        colorClass = "blue";
        mostrarReintentar = false;

    } else if (
        tipoError === "500" ||
        tipoError === "server_error"
    ) {
        titulo = "Error en el servidor";
        mensaje =
            "El servidor experimentó un problema interno procesando la información del proyecto.";
        iconClass = "fas fa-server";
        colorClass = "red";
    }

    contenedor.innerHTML = `
        <div
            class="modal-proyecto-error-card"
            style="margin: 4rem auto; min-height: 50vh;"
        >
            <div class="error-icon-box ${colorClass}">
                <i class="${iconClass}"></i>
            </div>

            <h3>${titulo}</h3>
            <p>${mensaje}</p>

            <div
                style="
                    display: flex;
                    gap: 1rem;
                    margin-top: 1rem;
                    justify-content: center;
                    flex-wrap: wrap;
                "
            >
                ${
                    mostrarReintentar && idProyecto
                        ? `
                            <button
                                type="button"
                                class="btn-reintentar-error"
                                id="btn-reintentar-standalone"
                            >
                                <i class="fas fa-sync-alt"></i>
                                Reintentar
                            </button>
                        `
                        : ""
                }

                <a
                    href="../index.html"
                    class="btn-reintentar-error btn-secundario-error"
                    style="text-decoration: none;"
                >
                    Volver al inicio
                </a>
            </div>
        </div>
    `;

    const btnRetry = contenedor.querySelector(
        "#btn-reintentar-standalone"
    );

    if (btnRetry && idProyecto) {
        btnRetry.addEventListener("click", () => {
            cargarDetalleProyecto(idProyecto);
        });
    }
}

function renderizarVistaStandalone(proyecto, contenedor) {
    if (!contenedor) return;

    const detalles = proyecto.detalles || {};

    let html = `
        <div id="sec-encabezado" class="evento-info">
            <h2 id="titulo-evento">
                ${proyecto.titulo || "Proyecto sin título"}
            </h2>

            ${
                proyecto.duracion || proyecto.fecha
                    ? `
                        <div style="margin-bottom: 1rem;">
                            <span class="modal-proyecto-duracion">
                                <i class="far fa-clock"></i>
                                <strong>Período de Ejecución:</strong>
                                ${proyecto.duracion || proyecto.fecha}
                            </span>
                        </div>
                    `
                    : ""
            }

            <div id="sec-descripcion">
                <p id="descripcion-evento">
                    ${proyecto.contenido || ""}
                </p>
    `;

    // Párrafos adicionales
    if (detalles.parrafos?.length > 0) {
        html += `
            <div class="parrafos-proyecto">
                ${detalles.parrafos
                    .map(
                        parrafo => `
                            <p class="descripcion-detallada">
                                ${parrafo}
                            </p>
                        `
                    )
                    .join("")}
            </div>
        `;
    }

    // Enlaces
    if (detalles.enlaces?.length > 0) {
        html += `
            <section class="enlaces">
                <div class="enlaces-container">
                    ${detalles.enlaces
                        .map(
                            enlace => `
                                <a
                                    class="enlace-proyecto"
                                    href="${enlace.url}"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    ${enlace.descripcion || "Ver enlace"}
                                </a>
                            `
                        )
                        .join("")}
                </div>
            </section>
        `;
    }

    html += `
            </div>
        </div>
    `;

    // Tecnologías
    if (detalles.tecnologias?.length > 0) {
        html += `
            <section
                class="tecnologias"
                id="sec-tecnologias"
            >
                <h2>Tecnologías</h2>

                <div class="tecnologias-container">
                    ${detalles.tecnologias
                        .map(
                            tecnologia => `
                                <span class="tecnologia-item">
                                    ${tecnologia}
                                </span>
                            `
                        )
                        .join("")}
                </div>
            </section>
        `;
    }

    // Galería
    if (detalles.imagenes?.length > 0) {
        html += `
            <section class="galeria" id="sec-galeria">
                <h2>Galería del Evento</h2>

                <div class="galeria-container">
                    ${detalles.imagenes
                        .map(
                            imagen => `
                                <div class="galeria-item">
                                    <img
                                        src="${imagen.url}"
                                        class="imagen-galeria"
                                        alt="${
                                            imagen.descripcion ||
                                            "Imagen del proyecto"
                                        }"
                                        onerror="
                                            this.onerror = null;
                                            this.src = '../assets/img/proyecto-default.svg';
                                        "
                                    >

                                    <p class="descripcion-imagen">
                                        ${imagen.descripcion || ""}
                                    </p>
                                </div>
                            `
                        )
                        .join("")}
                </div>
            </section>
        `;
    } else {
        html += `
            <section class="galeria" id="sec-galeria">
                <h2>Vista Previa del Proyecto</h2>

                <div
                    class="galeria-container"
                    style="
                        grid-template-columns: 1fr;
                        justify-content: center;
                    "
                >
                    <div
                        class="galeria-item"
                        style="
                            max-width: 600px;
                            width: 100%;
                            margin: 0 auto;
                        "
                    >
                        <img
                            src="../assets/img/proyecto-default.svg"
                            class="imagen-galeria"
                            alt="Proyecto sin imagen específica"
                            style="
                                height: 280px;
                                object-fit: cover;
                            "
                        >

                        <p class="descripcion-imagen">
                            Recursos visuales en actualización para este proyecto.
                        </p>
                    </div>
                </div>
            </section>
        `;
    }

    // Testimonios
    if (detalles.testimonios?.length > 0) {
        html += `
            <section
                class="testimonios"
                id="sec-testimonios"
            >
                <h2>Testimonios de Asistentes</h2>

                <div class="testimonios-container">
                    ${detalles.testimonios
                        .map(
                            testimonio => `
                                <div class="testimonio">
                                    <div class="testimonio-contenido">
                                        <h3>${testimonio.autor}</h3>

                                        <p class="comentario">
                                            "${testimonio.contenido}"
                                        </p>
                                    </div>
                                </div>
                            `
                        )
                        .join("")}
                </div>
            </section>
        `;
    }

    // Participantes
    if (detalles.participantes?.length > 0) {
        const vistos = new Set();

        const participantesUnicos =
            detalles.participantes.filter(participante => {
                const id = String(participante.id);

                if (vistos.has(id)) {
                    return false;
                }

                vistos.add(id);
                return true;
            });

        const activos = [];
        const inactivos = [];
        const legacy = [];

        participantesUnicos.forEach(participante => {
            const estado =
                participante.estado || "activo";

            if (estado === "inactivo") {
                inactivos.push(participante);
            } else if (estado === "legacy") {
                legacy.push(participante);
            } else {
                activos.push(participante);
            }
        });

        html += `
            <section
                class="participantes"
                id="sec-equipo"
            >
        `;

        if (activos.length > 0) {
            html += crearGrupoParticipantes(
                "Equipo Actual",
                activos,
                "estado-activo"
            );
        }

        if (inactivos.length > 0) {
            html += crearGrupoParticipantes(
                "Miembros que han pasado por el proyecto",
                inactivos,
                "estado-inactivo"
            );
        }

        if (legacy.length > 0) {
            html += crearGrupoParticipantes(
                "Participantes Fundadores",
                legacy,
                "estado-legacy"
            );
        }

        html += `</section>`;
    }

    // Clientes
    if (detalles.cliente?.length > 0) {
        html += `
            <section
                class="participantes"
                id="sec-cliente"
            >
                <h2>Cliente del Proyecto</h2>

                <div class="participantes-container">
                    ${detalles.cliente
                        .map(
                            cliente => `
                                <div class="participante">
                                    <a
                                        href="./client-template-public.php?id=${cliente.id}"
                                        class="participante-enlace"
                                    >
                                        <p class="nombre-participante">
                                            ${cliente.name}
                                        </p>
                                    </a>
                                </div>
                            `
                        )
                        .join("")}
                </div>
            </section>
        `;
    }

    contenedor.innerHTML = html;

    inicializarNavegacionPuntosVert(contenedor);
}

function crearGrupoParticipantes(
    titulo,
    participantes,
    claseEstado
) {
    return `
        <div class="${claseEstado}">
            <h2>${titulo}</h2>

            <div class="participantes-container">
                ${participantes
                    .map(
                        participante => `
                            <div class="participante ${claseEstado}">
                                <a
                                    href="./perfiles/profile-template.php?id=${participante.id}"
                                    class="participante-enlace"
                                >
                                    <img
                                        src="${
                                            participante.imagen ||
                                            "../assets/profile/default-profile.png"
                                        }"
                                        class="imagen-participante"
                                        alt="${participante.nombre || "Participante"}"
                                        onerror="
                                            this.onerror = null;
                                            this.src = '../assets/profile/default-profile.png';
                                        "
                                    >

                                    <p class="nombre-participante">
                                        ${participante.nombre || ""}
                                    </p>

                                    ${
                                        participante.rol
                                            ? `
                                                <p class="rol-participante">
                                                    ${participante.rol}
                                                </p>
                                            `
                                            : ""
                                    }
                                </a>
                            </div>
                        `
                    )
                    .join("")}
            </div>
        </div>
    `;
}

function inicializarNavegacionPuntosVert(contenedorModal) {
    const seccionesDefinidas = [
        { id: "sec-encabezado", label: "Inicio" },
        { id: "sec-descripcion", label: "Descripción" },
        { id: "sec-tecnologias", label: "Tecnologías" },
        { id: "sec-galeria", label: "Galería" },
        { id: "sec-testimonios", label: "Testimonios" },
        { id: "sec-equipo", label: "Equipo" },
        { id: "sec-cliente", label: "Cliente" }
    ];

    const seccionesExistentes =
        seccionesDefinidas.filter(seccion =>
            contenedorModal.querySelector(`#${seccion.id}`)
        );

    if (seccionesExistentes.length < 2) {
        return;
    }

    const navegacionAnterior =
        contenedorModal.querySelector(".proyecto-dot-nav");

    if (navegacionAnterior) {
        navegacionAnterior.remove();
    }

    const dotNavContainer =
        document.createElement("div");

    dotNavContainer.className = "proyecto-dot-nav";
    dotNavContainer.setAttribute(
        "aria-label",
        "Navegación rápida por secciones"
    );

    seccionesExistentes.forEach((seccion, index) => {
        const boton = document.createElement("button");

        boton.type = "button";
        boton.className = "dot-nav-item";
        boton.dataset.target = seccion.id;

        boton.innerHTML = `
            <span
                class="dot-circle ${index === 0 ? "active" : ""}"
            ></span>

            <span class="dot-label">
                ${seccion.label}
            </span>
        `;

        boton.addEventListener("click", () => {
            const destino =
                contenedorModal.querySelector(
                    `#${seccion.id}`
                );

            if (destino) {
                destino.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        });

        dotNavContainer.appendChild(boton);
    });

    contenedorModal.insertBefore(
        dotNavContainer,
        contenedorModal.firstChild
    );

    const actualizarPuntoActivo = () => {
        let idActivo = seccionesExistentes[0].id;
        const scrollPosition = window.scrollY;

        seccionesExistentes.forEach(seccion => {
            const elemento =
                contenedorModal.querySelector(
                    `#${seccion.id}`
                );

            if (
                elemento &&
                scrollPosition >= elemento.offsetTop - 150
            ) {
                idActivo = seccion.id;
            }
        });

        dotNavContainer
            .querySelectorAll(".dot-nav-item")
            .forEach(item => {
                const circulo =
                    item.querySelector(".dot-circle");

                if (!circulo) return;

                circulo.classList.toggle(
                    "active",
                    item.dataset.target === idActivo
                );
            });
    };

    window.addEventListener(
        "scroll",
        actualizarPuntoActivo
    );

    actualizarPuntoActivo();
}

// =====================================================
// Modal de imágenes
// =====================================================

let imagenes = [];
let imagenActual = 0;

function inicializarModalImagen() {
    const modal = document.getElementById("modal-imagen");

    if (modal) {
        modal.style.display = "none";
    }

    document.addEventListener("click", event => {
        if (
            event.target.classList.contains(
                "imagen-galeria"
            )
        ) {
            imagenes = [
                ...document.querySelectorAll(
                    ".imagen-galeria"
                )
            ];

            imagenActual =
                imagenes.indexOf(event.target);

            abrirModalImagen(imagenActual);
        }
    });

    const cerrarModal =
        document.querySelector(".cerrar-modal");

    if (cerrarModal) {
        cerrarModal.addEventListener(
            "click",
            cerrarModalImagen
        );
    }

    if (modal) {
        modal.addEventListener("click", event => {
            if (event.target === modal) {
                cerrarModalImagen();
            }
        });
    }

    const flechaIzquierda =
        document.querySelector(".izquierda");

    if (flechaIzquierda) {
        flechaIzquierda.addEventListener(
            "click",
            event => {
                event.stopPropagation();

                if (imagenActual > 0) {
                    imagenActual--;
                    abrirModalImagen(imagenActual);
                }
            }
        );
    }

    const flechaDerecha =
        document.querySelector(".derecha");

    if (flechaDerecha) {
        flechaDerecha.addEventListener(
            "click",
            event => {
                event.stopPropagation();

                if (
                    imagenActual <
                    imagenes.length - 1
                ) {
                    imagenActual++;
                    abrirModalImagen(imagenActual);
                }
            }
        );
    }

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            cerrarModalImagen();
        }
    });
}

function abrirModalImagen(indice) {
    const modal =
        document.getElementById("modal-imagen");

    const modalImg =
        document.getElementById("imagen-modal");

    const modalDescripcion =
        document.getElementById("descripcion-modal");

    const imagen = imagenes[indice];

    if (!modal || !modalImg || !imagen) {
        return;
    }

    modal.style.display = "flex";
    modalImg.src = imagen.src;

    if (modalDescripcion) {
        modalDescripcion.textContent =
            imagen.nextElementSibling?.textContent || "";
    }
}

function cerrarModalImagen() {
    const modal =
        document.getElementById("modal-imagen");

    if (modal) {
        modal.style.display = "none";
    }
}