/* -------------------------
 * Manejo de Párrafos
 * ------------------------- */
function agregarCampoParrafo() {
    const contenedor = document.getElementById("contenedor-parrafos");
    const nuevoParrafo = document.createElement("textarea");
    nuevoParrafo.name = "parrafos[]";
    nuevoParrafo.required = true;
    nuevoParrafo.className = "campo";
    contenedor.appendChild(nuevoParrafo);
}

/* -------------------------
 * Manejo de Testimonios
 * ------------------------- */
function agregarCampoTestimonio() {
    const contenedor = document.getElementById("contenedor-testimonios");
    const nuevoDiv = document.createElement("div");
    nuevoDiv.className = "campo";

    const nuevoAutor = document.createElement("input");
    nuevoAutor.name = "autores_testimonios[]";
    nuevoAutor.type = "text";
    nuevoAutor.placeholder = "Autor del testimonio";
    nuevoAutor.required = true;

    const nuevoTestimonio = document.createElement("textarea");
    nuevoTestimonio.name = "testimonios[]";
    nuevoTestimonio.placeholder = "Escribe el testimonio";
    nuevoTestimonio.required = true;

    nuevoDiv.appendChild(nuevoAutor);
    nuevoDiv.appendChild(nuevoTestimonio);
    contenedor.appendChild(nuevoDiv);
}

/* -------------------------
 * Manejo de Enlaces
 * ------------------------- */
function agregarCampoEnlace() {
    const contenedor = document.getElementById("contenedor-enlaces");
    const nuevoDiv = document.createElement("div");
    nuevoDiv.className = "campo";

    const nuevaDescripcion = document.createElement("input");
    nuevaDescripcion.name = "descripciones_enlaces[]";
    nuevaDescripcion.type = "text";
    nuevaDescripcion.placeholder = "Descripción del enlace";
    nuevaDescripcion.required = true;

    const nuevoEnlace = document.createElement("input");
    nuevoEnlace.name = "enlaces[]";
    nuevoEnlace.type = "url";
    nuevoEnlace.placeholder = "URL del enlace";
    nuevoEnlace.required = true;

    nuevoDiv.appendChild(nuevaDescripcion);
    nuevoDiv.appendChild(nuevoEnlace);
    contenedor.appendChild(nuevoDiv);
}

/* ========================================================
 * MANEJO de PARTICIPANTES: Búsqueda y selección
 * ======================================================== */

// Lista global de participantes obtenidos del servidor
let listaGlobalParticipantes = [];
let participantesSeleccionados = []; // IDs de participantes ya agregados

// Cargar participantes desde el servidor
async function cargarParticipantes() {
    try {
        const response = await fetch("http://localhost/Gen10_Perfiles_web/backend/find_participant.php");
        listaGlobalParticipantes = await response.json();
    } catch (error) {
        console.error("Error al obtener participantes:", error);
    }
}

// Filtra participantes basados en el texto ingresado
function filtrarParticipantes(texto) {
    return listaGlobalParticipantes.filter(p => p.name.toLowerCase().includes(texto.toLowerCase()));
}

// Muestra sugerencias de participantes
function mostrarSugerencias(participantesFiltrados) {
    const participantesBox = document.getElementById("listado-profile");
    participantesBox.innerHTML = "";

    if (participantesFiltrados.length === 0) {
        participantesBox.style.display = "none";
        return;
    }

    participantesFiltrados.forEach(part => {
        const item = document.createElement("div");
        item.className = "participante-item";
        item.textContent = part.name;
        item.dataset.id = part.id;

        item.addEventListener("click", () => {
            document.getElementById("input-buscar-participante").value = part.name;
            document.getElementById("input-buscar-participante").dataset.selectedId = part.id;
            document.getElementById("btn-agregar-participante").disabled = false;
            participantesBox.style.display = "none";
        });

        participantesBox.appendChild(item);
    });

    participantesBox.style.display = "block";
}

// Agregar participante a la lista
function agregarParticipanteSeleccionado() {
    const inputBuscar = document.getElementById("input-buscar-participante");
    const nombreSeleccionado = inputBuscar.value;
    const idSeleccionado = inputBuscar.dataset.selectedId;

    if (!idSeleccionado || participantesSeleccionados.includes(idSeleccionado)) {
        alert("Este participante ya fue agregado o no es válido.");
        return;
    }

    participantesSeleccionados.push(idSeleccionado);

    const divLista = document.getElementById("lista-participantes");
    const nuevoDiv = document.createElement("div");
    nuevoDiv.className = "participante-item";
    nuevoDiv.textContent = nombreSeleccionado;

    // Campo oculto para el formulario
    const hiddenInput = document.createElement("input");
    hiddenInput.type = "hidden";
    hiddenInput.name = `participantes[${idSeleccionado}]`;
    hiddenInput.value = nombreSeleccionado;

    nuevoDiv.appendChild(hiddenInput);
    divLista.appendChild(nuevoDiv);

    // Reset del input
    inputBuscar.value = "";
    inputBuscar.removeAttribute("data-selected-id");
    document.getElementById("btn-agregar-participante").disabled = true;
}

// Evento al cargar la página
window.addEventListener("DOMContentLoaded", () => {
    cargarParticipantes();

    const inputBuscar = document.getElementById("input-buscar-participante");
    const btnAgregar = document.getElementById("btn-agregar-participante");

    inputBuscar.addEventListener("focus", () => {
        if (!inputBuscar.value) {
            mostrarSugerencias(listaGlobalParticipantes);
        }
    });

    inputBuscar.addEventListener("input", () => {
        const texto = inputBuscar.value.trim();
        mostrarSugerencias(texto ? filtrarParticipantes(texto) : listaGlobalParticipantes);
        btnAgregar.disabled = true;
    });

    btnAgregar.addEventListener("click", agregarParticipanteSeleccionado);
});

/* ========================================================
 * Enviar datos correctamente al backend
 * ======================================================== */

document.querySelector("form").addEventListener("submit", function (e) {
    let participantes = {};
    document.querySelectorAll("#lista-participantes .participante-item").forEach((div) => {
        let id = div.querySelector("input").name.match(/\d+/)[0];
        let nombre = div.querySelector("input").value;
        participantes[id] = nombre;
    });

    let enlaces = {};
    document.querySelectorAll("#contenedor-enlaces .campo").forEach((div) => {
        let descripcion = div.children[0].value;
        let enlace = div.children[1].value;
        enlaces[descripcion] = enlace;
    });

    let testimonios = {};
    document.querySelectorAll("#contenedor-testimonios .campo").forEach((div) => {
        let autor = div.children[0].value;
        let testimonio = div.children[1].value;
        testimonios[autor] = testimonio;
    });

    // Crear inputs ocultos para enviar los datos correctamente
    const hiddenParticipantes = document.createElement("input");
    hiddenParticipantes.type = "hidden";
    hiddenParticipantes.name = "participantes";
    hiddenParticipantes.value = JSON.stringify(participantes);
    this.appendChild(hiddenParticipantes);

    const hiddenEnlaces = document.createElement("input");
    hiddenEnlaces.type = "hidden";
    hiddenEnlaces.name = "enlaces";
    hiddenEnlaces.value = JSON.stringify(enlaces);
    this.appendChild(hiddenEnlaces);

    const hiddenTestimonios = document.createElement("input");
    hiddenTestimonios.type = "hidden";
    hiddenTestimonios.name = "testimonios";
    hiddenTestimonios.value = JSON.stringify(testimonios);
    this.appendChild(hiddenTestimonios);
});
