document.addEventListener("DOMContentLoaded", async function () {
    const params = new URLSearchParams(window.location.search);
    const idProyecto = params.get("id");

    if (!idProyecto) {
        document.getElementById("proyecto-container").innerHTML = "<p>Error: No se proporcionó un ID de proyecto.</p>";
        return;
    }

    try {
        const response = await fetch(`http://localhost/Gen10_Perfiles_web/backend/project_detail.php?id=${idProyecto}`);
        const data = await response.json();

        if (!data || data.length === 0) {
            document.getElementById("proyecto-container").innerHTML = `<p>Error: No se encontraron datos para este proyecto.</p>`;
            return;
        }
        
        const proyecto = data[0];

        let contenidoHTML = `
            <h2>${proyecto.titulo}</h2>
            <p><strong>Fecha:</strong> ${proyecto.fecha}</p>
            <p><strong>Ubicación:</strong> ${proyecto.ubicacion}</p>
            <p><strong>Descripción:</strong> ${proyecto.contenido}</p>
        `;

        // Párrafos
        if (proyecto.detalles.parrafos.length > 0) {
            contenidoHTML += `<h3>Párrafos</h3><ul>`;
            proyecto.detalles.parrafos.forEach(parrafo => {
                contenidoHTML += `<li>${parrafo}</li>`;
            });
            contenidoHTML += `</ul>`;
        }

        // Imágenes
        if (proyecto.detalles.imagenes.length > 0) {
            contenidoHTML += `<h3>Imágenes</h3>`;
            proyecto.detalles.imagenes.forEach(img => {
                contenidoHTML += `<img src="${img}" class="imagen" alt="Imagen del proyecto">`;
            });
        }

        // Participantes
        if (proyecto.detalles.participantes.length > 0) {
            contenidoHTML += `<h3>Participantes</h3><ul>`;
            proyecto.detalles.participantes.forEach(participante => {
                contenidoHTML += `<li>${participante.nombre} (ID: ${participante.id})</li>`;
            });
            contenidoHTML += `</ul>`;
        }

        // Testimonios
        if (proyecto.detalles.testimonios.length > 0) {
            contenidoHTML += `<h3>Testimonios</h3>`;
            proyecto.detalles.testimonios.forEach(testimonio => {
                contenidoHTML += `<blockquote>
                                    <p>${testimonio.contenido}</p>
                                    <footer><strong>- ${testimonio.autor}</strong></footer>
                                  </blockquote>`;
            });
        }

        // Enlaces
        if (proyecto.detalles.enlaces.length > 0) {
            contenidoHTML += `<h3>Enlaces</h3><ul>`;
            proyecto.detalles.enlaces.forEach(enlace => {
                contenidoHTML += `<li><a href="${enlace.url}" target="_blank">${enlace.descripcion}</a></li>`;
            });
            contenidoHTML += `</ul>`;
        }

        document.getElementById("proyecto-container").innerHTML = contenidoHTML;
    } catch (error) {
        document.getElementById("proyecto-container").innerHTML = `<p>Error al obtener el proyecto.</p>`;
    }
});
