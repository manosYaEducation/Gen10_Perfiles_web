document.addEventListener("DOMContentLoaded", async function () {
    const idProyecto = new URL(window.location.href).searchParams.get("id");

    if (!idProyecto) {
        console.error("No se proporcionó un ID de proyecto.");
        return;
    }

    try {
        const response = await fetch(API_URL_PHP + `/project_detail.php?id=${idProyecto}`);
        const data = await response.json();

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
                <h2 id="titulo-evento">${proyecto.titulo}</h2>
                <p id="descripcion-evento">${proyecto.contenido}</p>
        `;

        // Párrafos
        if (proyecto.detalles?.parrafos?.length > 0) {
            html += `
                <div class="parrafos-proyecto">        
                    ${proyecto.detalles.parrafos.map(p => `<p id="descripcion-detallada">${p}</p>`).join("")}
                </div>        
            `;
        }

        if (proyecto.detalles?.enlaces?.length > 0) {
            html += `
                <section class="enlaces">
                    <div class="enlaces-container">
                        ${proyecto.detalles.enlaces.map(enlace => `
                            <a id="enlace-proyecto" href="${enlace.url}" target="_blank">${enlace.descripcion}</a>
                        `).join("")}
                    </div>
                </section>
            `;
        }
        html += `</div>`;

        // Galería de imágenes
        if (proyecto.detalles?.imagenes?.length > 0) {
            html += `
                <section class="galeria">
                    <h2>Galería del Evento</h2>
                    <div class="galeria-container">
                        ${proyecto.detalles.imagenes.map(img => `                            
                            <div class="galeria-item">
                                <img src="${img.url}" class="imagen-galeria" alt="Imagen del proyecto">
                                <p class="descripcion-imagen">${img.descripcion}</p>
                            </div>                            
                        `).join("")}
                        
                    </div>
                </section>
            `;
        }

        // Testimonios
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

        // Participantes <a href="/Gen10_Perfiles_web/frontend/perfiles/profile-template.html?id=${participante.id}" class="participante-enlace">
        if (proyecto.detalles?.participantes?.length > 0) {
            html += `
                <section class="participantes">
                    <h2>Colaboradores Kreative</h2>
                    <div class="participantes-container">
                        ${proyecto.detalles.participantes.map(participante => `
                            <div class="participante">
                                <a href="./frontend/perfiles/profile-template.html?id=${participante.id}" class="participante-enlace">
                                    <img src="${participante.imagen}" class="imagen-participante" alt="Participante">
                                    <p class="nombre-participante">${participante.nombre}</p>
                                </a>
                            </div>
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


//Manejo modal para ver imágenes más grandes
const modal = document.getElementById("modal-imagen");
const modalImg = document.getElementById("imagen-modal");
const modalDescripcion = document.getElementById("descripcion-modal");
const cerrarModal = document.querySelector(".cerrar-modal");
const flechaIzquierda = document.querySelector(".izquierda");
const flechaDerecha = document.querySelector(".derecha");

let imagenes = []; 
let imagenActual = 0;

// Capturar todas las imágenes de la galería y añadir evento de click
document.addEventListener("click", function (event) {
    if (event.target.classList.contains("imagen-galeria")) {
        imagenes = [...document.querySelectorAll(".imagen-galeria")]; // Obtener todas las imágenes
        imagenActual = imagenes.indexOf(event.target); // Obtener índice de la imagen seleccionada

        abrirModal(imagenActual);
    }
});

// Abrir el modal con la imagen seleccionada
function abrirModal(indice) {
    modal.style.display = "flex";
    modalImg.src = imagenes[indice].src;
    modalDescripcion.textContent = imagenes[indice].nextElementSibling.textContent;
}

// Cerrar el modal cuando se presiona la "X"
cerrarModal.addEventListener("click", function () {
    modal.style.display = "none";
});

// Cerrar el modal si se hace click fuera de la imagen
modal.addEventListener("click", function (event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
});

// Navegar a la imagen anterior
flechaIzquierda.addEventListener("click", function () {
    if (imagenActual > 0) {
        imagenActual--;
        abrirModal(imagenActual);
    }
});

// Navegar a la siguiente imagen
flechaDerecha.addEventListener("click", function () {
    if (imagenActual < imagenes.length - 1) {
        imagenActual++;
        abrirModal(imagenActual);
    }
});

// Modal cerrado al inicio
document.addEventListener("DOMContentLoaded", function () {
    modal.style.display = "none";
});