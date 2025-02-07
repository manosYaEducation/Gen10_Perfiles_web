document.addEventListener("DOMContentLoaded", async function () {
    const idProyecto = new URL(window.location.href).searchParams.get("id");
    console.log("ID del proyecto:", idProyecto);

    if (!idProyecto) {
        console.error("No se proporcionó un ID de proyecto.");
        return;
    }

    try {
        const response = await fetch(`http://localhost/Gen10_Perfiles_web/backend/project_detail.php?id=${idProyecto}`);
        const data = await response.json();
        console.log("Datos recibidos:", data);

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
                    ${proyecto.detalles.parrafos.map(p => `<p id="descripcion-detallada">${p}</p>`).join("")}
            `;
        }
        html += `</div>`;

        // 🔹 Galería de imágenes
        if (proyecto.detalles?.imagenes?.length > 0) {
            html += `
                <section class="testimonios-galeria">
                    <h2>Galería del Evento</h2>
                    <div class="galeria-container">
                        ${proyecto.detalles.imagenes.map(img => `<img src="${img}" class="imagen-galeria" alt="Imagen del proyecto">`).join("")}
                    </div>
                </section>
            `;
        }

        // 🔹 Testimonios
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

        // 🔹 Participantes
        if (proyecto.detalles?.participantes?.length > 0) {
            html += `
                <section class="participantes">
                    <h2>Participantes</h2>
                    <div class="logos-container">
                        ${proyecto.detalles.participantes.map(participante => `
                            <div class="participante">
                                <h3>${participante.nombre}</h3>
                                <img src="${participante.imagen}" class="imagen-participante" alt="Participante">
                            </div>
                        `).join("")}
                    </div>
                </section>
            `;
        }

        // 🔹 Enlaces Relacionados
        if (proyecto.detalles?.enlaces?.length > 0) {
            html += `
                <section class="enlaces">
                    <h2>Enlaces Relacionados</h2>
                    <div class="enlaces-container">
                        ${proyecto.detalles.enlaces.map(enlace => `
                            <p><a href="${enlace.url}" target="_blank">${enlace.descripcion}</a></p>
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
