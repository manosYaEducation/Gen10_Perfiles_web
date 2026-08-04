async function cargarProyectos() {
    try {
        const response = await fetch(API_URL_PHP + "project_read.php");
        const json = await response.json();

        let proyectos = [];

        if (Array.isArray(json)) {
            proyectos = json;
        } else if (json && Array.isArray(json.data)) {
            proyectos = json.data;
        } else {
            console.error("Respuesta inesperada al obtener proyectos:", json);
            throw new Error("Formato de respuesta inválido");
        }

        proyectos.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
        const ultimosProyectos = proyectos.slice(0, 5);

        mostrarProyectos(ultimosProyectos);
        inicializarEventosModalProyecto();
    } catch (error) {
        console.error("Error al obtener proyectos:", error);

        const contenedor = document.getElementById("contenedor-proyecto");

        if (contenedor) {
            contenedor.innerHTML = `
                <p style="color: red;">
                    Error al cargar los proyectos.
                </p>
            `;
        }
    }
}

function mostrarProyectos(proyectos) {
    const contenedor = document.getElementById("contenedor-proyecto");

    if (!contenedor) return;

    contenedor.innerHTML = "";

    proyectos.forEach(proyecto => {
        const div = document.createElement("div");
        div.classList.add("proyecto");

        div.innerHTML = `
            <div class="proyecto-timeline">
                <div class="proyecto-fecha">
                    ${proyecto.fecha}
                </div>

                <div class="proyecto-linea"></div>

                <div class="proyecto-tarjeta" style="cursor: pointer;">
                    <a
                        href="javascript:void(0);"
                        class="proyecto-titulo"
                        data-id="${proyecto.id_proyecto}"
                    >
                        ${proyecto.titulo_tarjeta}
                    </a>
                </div>
            </div>
        `;
        const tituloBtn = div.querySelector(".proyecto-titulo");
        const tarjeta = div.querySelector(".proyecto-tarjeta");

        const abrirHandler = event => {
            event.preventDefault();
            abrirModalDetalleProyecto(proyecto.id_proyecto);
        };

        if (tituloBtn) {
            tituloBtn.addEventListener("click", abrirHandler);
        }

        if (tarjeta) {
            tarjeta.addEventListener("click", event => {
                if (event.target !== tituloBtn) {
                    abrirHandler(event);
                }
            });
        }

        contenedor.appendChild(div);
    });
}

// ==========================================
// Lógica de Modal de Detalle de Proyecto
// ==========================================

function obtenerOCrearModalOverlay() {
    let modalOverlay = document.getElementById("modal-detalle-proyecto");
    let modalContenido = document.getElementById("modal-proyecto-contenido");

    if (!modalOverlay) {
        modalOverlay = document.createElement("div");
        modalOverlay.id = "modal-detalle-proyecto";
        modalOverlay.className = "modal-proyecto-overlay";
        modalOverlay.setAttribute("aria-hidden", "true");

        modalOverlay.innerHTML = `
            <div class="modal-proyecto-container">
                <button
                    class="modal-proyecto-cerrar"
                    id="cerrar-modal-proyecto"
                    aria-label="Cerrar modal"
                >
                    &times;
                </button>

                <div id="modal-proyecto-contenido"></div>
            </div>
        `;

        document.body.appendChild(modalOverlay);
        inicializarEventosModalProyecto();
    }

    modalContenido = document.getElementById("modal-proyecto-contenido");

    return {
        modalOverlay,
        modalContenido
    };
}

async function abrirModalDetalleProyecto(idProyecto) {
    const {
        modalOverlay,
        modalContenido
    } = obtenerOCrearModalOverlay();

    if (!modalOverlay || !modalContenido) return;

    // Mostrar Skeleton Screen mientras se obtienen los datos
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

    if (!navigator.onLine) {
        renderizarMensajeError(
            "offline",
            modalContenido,
            idProyecto
        );

        return;
    }

    try {
        const url =
            API_URL_PHP +
            (API_URL_PHP.endsWith("/") ? "" : "/") +
            `project_detail.php?id=${idProyecto}`;

        const response = await fetch(url);

        if (!response.ok) {
            if (response.status === 404) {
                renderizarMensajeError(
                    "404",
                    modalContenido,
                    idProyecto
                );
            } else {
                renderizarMensajeError(
                    "500",
                    modalContenido,
                    idProyecto
                );
            }

            return;
        }

        const data = await response.json();

        if (!data || data.length === 0 || data.error) {
            renderizarMensajeError(
                "404",
                modalContenido,
                idProyecto
            );

            return;
        }

        const proyecto = data[0];
        renderizarDetalleEnModal(proyecto, modalContenido);

    } catch (error) {
        console.error("Error al cargar detalle del proyecto:", error);

        if (!navigator.onLine || error.name === "TypeError") {
            renderizarMensajeError(
                "offline",
                modalContenido,
                idProyecto
            );
        } else {
            renderizarMensajeError(
                "server_error",
                modalContenido,
                idProyecto
            );
        }
    }
}

function renderizarMensajeError(tipoError, contenedor, idProyecto) {
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
            "El proyecto solicitado no existe, fue removido o no se encuentra disponible en este momento.";
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
        <div class="modal-proyecto-error-card">
            <div class="error-icon-box ${colorClass}">
                <i class="${iconClass}"></i>
            </div>

            <h3>${titulo}</h3>
            <p>${mensaje}</p>

            <div
                style="
                    display: flex;
                    gap: 1rem;
                    margin-top: 0.5rem;
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
                                id="btn-reintentar-proyecto"
                            >
                                <i class="fas fa-sync-alt"></i>
                                Reintentar
                            </button>
                        `
                        : ""
                }

                <button
                    type="button"
                    class="btn-reintentar-error btn-secundario-error"
                    id="btn-cerrar-error-proyecto"
                >
                    Cerrar
                </button>
            </div>
        </div>
    `;

    const btnRetry = contenedor.querySelector(
        "#btn-reintentar-proyecto"
    );

    if (btnRetry && idProyecto) {
        btnRetry.addEventListener("click", () => {
            abrirModalDetalleProyecto(idProyecto);
        });
    }

    const btnCerrar = contenedor.querySelector(
        "#btn-cerrar-error-proyecto"
    );

    if (btnCerrar) {
        btnCerrar.addEventListener(
            "click",
            cerrarModalDetalleProyecto
        );
    }
}

function renderizarDetalleEnModal(proyecto, contenedor) {
    const baseUrl =
        window.location.origin +
        window.location.pathname
            .replace(/index\.html$/, "")
            .replace(/\/$/, "");

    const shareUrl =
        `${baseUrl}/frontend/proyecto-detalle.php?id=${proyecto.id_proyecto}`;

    const shareText =
        `Echa un vistazo a este proyecto: ${
            proyecto.titulo || "Proyecto Alpha Docere"
        }`;

    let html = `
        <div class="modal-proyecto-header" id="sec-encabezado">
            <h2>
                ${proyecto.titulo || "Proyecto sin título"}
            </h2>

            <div class="modal-proyecto-meta-row">
                ${
                    proyecto.fecha
                        ? `
                            <span class="modal-proyecto-fecha">
                                <i class="far fa-calendar-alt"></i>
                                ${proyecto.fecha}
                            </span>
                        `
                        : ""
                }

                ${
                    proyecto.duracion || proyecto.fecha
                        ? `
                            <span class="modal-proyecto-duracion">
                                <i class="far fa-clock"></i>
                                <strong>Período:</strong>
                                ${proyecto.duracion || proyecto.fecha}
                            </span>
                        `
                        : ""
                }

                <div
                    class="proyecto-compartir-contenedor"
                    id="compartir-contenedor"
                >
                    <button
                        type="button"
                        class="btn-compartir-main"
                        id="btn-toggle-compartir"
                    >
                        <i class="fas fa-share-alt"></i>
                        Compartir
                    </button>

                    <div
                        class="compartir-menu-desplegable"
                        id="menu-compartir"
                    >
                        <button
                            type="button"
                            class="compartir-item copiar"
                            id="btn-copiar-enlace"
                        >
                            <i class="far fa-copy"></i>
                            Copiar Enlace
                        </button>

                        <a
                            href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="compartir-item linkedin"
                        >
                            <i class="fab fa-linkedin"></i>
                            LinkedIn
                        </a>

                        <a
                            href="https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + " " + shareUrl)}"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="compartir-item whatsapp"
                        >
                            <i class="fab fa-whatsapp"></i>
                            WhatsApp
                        </a>

                        <a
                            href="https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="compartir-item twitter"
                        >
                            <i class="fab fa-twitter"></i>
                            X (Twitter)
                        </a>
                    </div>
                </div>
            </div>
        </div>

        <div class="modal-proyecto-body">
    `;

        // Descripción principal y párrafos
    if (
        proyecto.contenido ||
        proyecto.detalles?.parrafos?.length > 0
    ) {
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
                    ${proyecto.detalles.parrafos
                        .map(parrafo => `<p>${parrafo}</p>`)
                        .join("")}
                </div>
            `;
        }

        html += `</div>`;
    }

    // Tecnologías
    if (proyecto.detalles?.tecnologias?.length > 0) {
        html += `
            <div>
                <h3 class="modal-proyecto-seccion-titulo">
                    <i class="fas fa-code"></i>
                    Tecnologías Utilizadas
                </h3>

                <div class="modal-proyecto-tecnologias">
                    ${proyecto.detalles.tecnologias
                        .map(
                            tecnologia => `
                                <span class="modal-proyecto-tecnologia">
                                    ${tecnologia}
                                </span>
                            `
                        )
                        .join("")}
                </div>
            </div>
        `;
    }

    // Enlaces del proyecto
    if (proyecto.detalles?.enlaces?.length > 0) {
        html += `
            <div class="modal-proyecto-enlaces">
                ${proyecto.detalles.enlaces
                    .map(
                        enlace => `
                            <a
                                href="${enlace.url}"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="modal-proyecto-enlace-btn"
                            >
                                <i class="fas fa-external-link-alt"></i>
                                ${enlace.descripcion || "Ver enlace"}
                            </a>
                        `
                    )
                    .join("")}
            </div>
        `;
    }

    // Galería de imágenes con fallback
    if (proyecto.detalles?.imagenes?.length > 0) {
        html += `
            <div id="sec-galeria">
                <h3 class="modal-proyecto-seccion-titulo">
                    <i class="fas fa-images"></i>
                    Galería del Proyecto
                </h3>

                <div class="modal-proyecto-galeria">
                    ${proyecto.detalles.imagenes
                        .map(
                            imagen => `
                                <div class="modal-proyecto-galeria-item">
                                    <img
                                        src="${imagen.url}"
                                        alt="${
                                            imagen.descripcion ||
                                            "Imagen del proyecto"
                                        }"
                                        onerror="
                                            this.onerror = null;
                                            this.src = 'assets/img/proyecto-default.svg';
                                        "
                                    >

                                    ${
                                        imagen.descripcion
                                            ? `<p>${imagen.descripcion}</p>`
                                            : ""
                                    }
                                </div>
                            `
                        )
                        .join("")}
                </div>
            </div>
        `;
    } else {
        html += `
            <div id="sec-galeria">
                <h3 class="modal-proyecto-seccion-titulo">
                    <i class="fas fa-image"></i>
                    Vista Previa del Proyecto
                </h3>

                <div
                    class="modal-proyecto-galeria"
                    style="grid-template-columns: 1fr;"
                >
                    <div
                        class="modal-proyecto-galeria-item"
                        style="max-width: 100%;"
                    >
                        <img
                            src="assets/img/proyecto-default.svg"
                            alt="Proyecto sin imagen específica"
                            style="
                                height: 260px;
                                object-fit: cover;
                            "
                        >

                        <p
                            style="
                                padding: 0.75rem;
                                color: #888;
                                font-size: 0.9rem;
                            "
                        >
                            Recursos visuales en actualización para este proyecto.
                        </p>
                    </div>
                </div>
            </div>
        `;
    }

    // Testimonios
    if (proyecto.detalles?.testimonios?.length > 0) {
        html += `
            <div id="sec-testimonios">
                <h3 class="modal-proyecto-seccion-titulo">
                    <i class="fas fa-quote-left"></i>
                    Testimonios
                </h3>

                <div class="modal-proyecto-testimonios">
                    ${proyecto.detalles.testimonios
                        .map(
                            testimonio => `
                                <div class="modal-proyecto-testimonio-card">
                                    <h4>${testimonio.autor}</h4>
                                    <p>"${testimonio.contenido}"</p>
                                </div>
                            `
                        )
                        .join("")}
                </div>
            </div>
        `;
    }

    // Participantes / Equipo
    if (proyecto.detalles?.participantes?.length > 0) {
        const participantesVistos = new Set();

        const participantesUnicos =
            proyecto.detalles.participantes.filter(participante => {
                if (participantesVistos.has(participante.id)) {
                    return false;
                }

                participantesVistos.add(participante.id);
                return true;
            });

        html += `
            <div id="sec-equipo">
                <h3 class="modal-proyecto-seccion-titulo">
                    <i class="fas fa-users"></i>
                    Equipo del Proyecto
                </h3>

                <div class="modal-proyecto-participantes-grid">
                    ${participantesUnicos
                        .map(
                            participante => `
                                <a
                                    href="frontend/perfiles/profile-template.php?id=${participante.id}"
                                    class="modal-proyecto-participante"
                                    style="text-decoration: none;"
                                >
                                    <img
                                        src="${
                                            participante.imagen ||
                                            "assets/img/default-profile.png"
                                        }"
                                        alt="${participante.nombre}"
                                        onerror="
                                            this.onerror = null;
                                            this.src = 'assets/img/default-profile.png';
                                        "
                                    >

                                    <span>${participante.nombre}</span>

                                    ${
                                        participante.rol
                                            ? `
                                                <small class="modal-proyecto-participante-rol">
                                                    ${participante.rol}
                                                </small>
                                            `
                                            : ""
                                    }
                                </a>
                            `
                        )
                        .join("")}
                </div>
            </div>
        `;
    }

    // Clientes
    if (proyecto.detalles?.cliente?.length > 0) {
        html += `
            <div id="sec-cliente">
                <h3 class="modal-proyecto-seccion-titulo">
                    <i class="fas fa-building"></i>
                    Cliente
                </h3>

                <div class="modal-proyecto-participantes-grid">
                    ${proyecto.detalles.cliente
                        .map(
                            cliente => `
                                <div class="modal-proyecto-participante">
                                    <i
                                        class="fas fa-handshake"
                                        style="
                                            font-size: 2rem;
                                            color: #4CAF50;
                                            margin-bottom: 0.5rem;
                                        "
                                    ></i>

                                    <span>${cliente.name}</span>
                                </div>
                            `
                        )
                        .join("")}
                </div>
            </div>
        `;
    }

    html += `</div>`;

    contenedor.innerHTML = html;

    // Navegación vertical por secciones
    inicializarNavegacionPuntosVert(contenedor);

    // Menú para compartir
    inicializarManejadorCompartir(shareUrl);
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

    const seccionesExistentes = seccionesDefinidas.filter(seccion =>
        contenedorModal.querySelector(`#${seccion.id}`)
    );

    if (seccionesExistentes.length < 2) {
        return;
    }

    // Eliminar una navegación anterior, si existe
    const navegacionAnterior =
        contenedorModal.querySelector(".proyecto-dot-nav");

    if (navegacionAnterior) {
        navegacionAnterior.remove();
    }

    const dotNavContainer = document.createElement("div");
    dotNavContainer.className = "proyecto-dot-nav";
    dotNavContainer.setAttribute(
        "aria-label",
        "Navegación rápida por secciones"
    );

    seccionesExistentes.forEach((seccion, index) => {
        const itemBtn = document.createElement("button");

        itemBtn.type = "button";
        itemBtn.className = "dot-nav-item";
        itemBtn.setAttribute("data-target", seccion.id);

        itemBtn.innerHTML = `
            <span class="dot-circle ${index === 0 ? "active" : ""}"></span>
            <span class="dot-label">${seccion.label}</span>
        `;

        itemBtn.addEventListener("click", () => {
            const destino =
                contenedorModal.querySelector(`#${seccion.id}`);

            if (destino) {
                destino.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        });

        dotNavContainer.appendChild(itemBtn);
    });

    contenedorModal.insertBefore(
        dotNavContainer,
        contenedorModal.firstChild
    );

    const modalScrollParent =
        contenedorModal.closest(".modal-proyecto-container") ||
        window;

    const actualizarPuntoActivo = () => {
        const scrollPos =
            modalScrollParent === window
                ? window.scrollY
                : modalScrollParent.scrollTop;

        const containerHeight =
            modalScrollParent === window
                ? window.innerHeight
                : modalScrollParent.clientHeight;

        const totalHeight =
            modalScrollParent === window
                ? document.documentElement.scrollHeight
                : modalScrollParent.scrollHeight;

        let actualId = seccionesExistentes[0].id;

        // Si llega al fondo, activar el último punto
        if (
            scrollPos + containerHeight >=
            totalHeight - 35
        ) {
            actualId =
                seccionesExistentes[
                    seccionesExistentes.length - 1
                ].id;
        } else {
            seccionesExistentes.forEach(seccion => {
                const elemento =
                    contenedorModal.querySelector(`#${seccion.id}`);

                if (
                    elemento &&
                    scrollPos >= elemento.offsetTop - 150
                ) {
                    actualId = seccion.id;
                }
            });
        }

        dotNavContainer
            .querySelectorAll(".dot-nav-item")
            .forEach(item => {
                const circle =
                    item.querySelector(".dot-circle");

                if (!circle) {
                    return;
                }

                circle.classList.toggle(
                    "active",
                    item.getAttribute("data-target") === actualId
                );
            });
    };

    modalScrollParent.addEventListener(
        "scroll",
        actualizarPuntoActivo
    );

    actualizarPuntoActivo();
}

function inicializarManejadorCompartir(shareUrl) {
    const compartirContenedor =
        document.getElementById("compartir-contenedor");

    const toggleBtn =
        document.getElementById("btn-toggle-compartir");

    const copiarBtn =
        document.getElementById("btn-copiar-enlace");

    if (toggleBtn && compartirContenedor) {
        toggleBtn.addEventListener("click", event => {
            event.stopPropagation();
            compartirContenedor.classList.toggle("open");
        });
    }

    document.addEventListener("click", event => {
        if (
            compartirContenedor &&
            !compartirContenedor.contains(event.target)
        ) {
            compartirContenedor.classList.remove("open");
        }
    });

    if (copiarBtn) {
        copiarBtn.addEventListener("click", event => {
            event.preventDefault();

            copiarAlPortapapeles(shareUrl);

            if (compartirContenedor) {
                compartirContenedor.classList.remove("open");
            }
        });
    }
}

function copiarAlPortapapeles(texto) {
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard
            .writeText(texto)
            .then(() => {
                mostrarToastNotificacion(
                    "¡Enlace copiado al portapapeles!"
                );
            })
            .catch(() => {
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

        mostrarToastNotificacion(
            "¡Enlace copiado al portapapeles!"
        );
    } catch (error) {
        console.error("Error al copiar enlace:", error);
    }

    document.body.removeChild(textarea);
}

function mostrarToastNotificacion(mensaje) {
    let toast = document.getElementById("compartir-toast");

    if (!toast) {
        toast = document.createElement("div");
        toast.id = "compartir-toast";
        toast.className = "compartir-toast";

        toast.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${mensaje}</span>
        `;

        document.body.appendChild(toast);
    } else {
        const textoToast = toast.querySelector("span");

        if (textoToast) {
            textoToast.textContent = mensaje;
        }
    }

    toast.classList.add("mostrar");

    setTimeout(() => {
        toast.classList.remove("mostrar");
    }, 2800);
}

function cerrarModalDetalleProyecto() {
    const modalOverlay =
        document.getElementById("modal-detalle-proyecto");

    if (modalOverlay) {
        modalOverlay.classList.remove("activo");
        modalOverlay.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
    }
}

function inicializarEventosModalProyecto() {
    const cerrarBtn =
        document.getElementById("cerrar-modal-proyecto");

    const modalOverlay =
        document.getElementById("modal-detalle-proyecto");

    if (cerrarBtn) {
        cerrarBtn.onclick = cerrarModalDetalleProyecto;
    }

    if (modalOverlay) {
        modalOverlay.onclick = event => {
            if (event.target === modalOverlay) {
                cerrarModalDetalleProyecto();
            }
        };
    }

    document.addEventListener("keydown", event => {
        if (
            event.key === "Escape" &&
            modalOverlay &&
            modalOverlay.classList.contains("activo")
        ) {
            cerrarModalDetalleProyecto();
        }
    });
}

document.addEventListener("DOMContentLoaded", cargarProyectos);