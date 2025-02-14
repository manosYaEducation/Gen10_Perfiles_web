/* -------------------------
 * Variables globales
 * ------------------------- */
let selectedImages = []; // Archivos de imágenes seleccionados
let listaGlobalParticipantes = [];
let participantesSeleccionados = [];

/* -------------------------
 * Manejo de Párrafos
 * ------------------------- */
function agregarCampoParrafo() {
    const contenedor = document.getElementById("contenedor-parrafos");
    const divParrafo = document.createElement("div");
    divParrafo.className = "parrafo-container";
    
    const nuevoParrafo = document.createElement("textarea");
    nuevoParrafo.name = "parrafos[]";
    nuevoParrafo.required = true;
    nuevoParrafo.className = "campo";
    
    const btnEliminar = document.createElement("button");
    btnEliminar.type = "button";
    btnEliminar.textContent = "Eliminar";
    btnEliminar.className = "btn-delete";
    btnEliminar.onclick = () => {
        divParrafo.remove();
    };

    divParrafo.appendChild(nuevoParrafo);
    divParrafo.appendChild(btnEliminar);
    contenedor.appendChild(divParrafo);
}

/* -------------------------
 * Manejo de Testimonios
 * ------------------------- */
function agregarCampoTestimonio() {
    const contenedor = document.getElementById("contenedor-testimonios");
    const divTestimonio = document.createElement("div");
    divTestimonio.className = "campo";

    const nuevoAutor = document.createElement("input");
    nuevoAutor.name = "autores_testimonios[]";
    nuevoAutor.type = "text";
    nuevoAutor.placeholder = "Autor del testimonio";
    nuevoAutor.required = true;

    const nuevoTestimonio = document.createElement("textarea");
    nuevoTestimonio.name = "testimonios[]";
    nuevoTestimonio.placeholder = "Escribe el testimonio";
    nuevoTestimonio.required = true;

    const btnEliminar = document.createElement("button");
    btnEliminar.type = "button";
    btnEliminar.textContent = "Eliminar";
    btnEliminar.className = "btn-delete";
    btnEliminar.onclick = () => {
        divTestimonio.remove();
    };

    divTestimonio.appendChild(nuevoAutor);
    divTestimonio.appendChild(nuevoTestimonio);
    divTestimonio.appendChild(btnEliminar);
    contenedor.appendChild(divTestimonio);
}

/* -------------------------
 * Manejo de Enlaces
 * ------------------------- */
function agregarCampoEnlace() {
    const contenedor = document.getElementById("contenedor-enlaces");
    const divEnlace = document.createElement("div");
    divEnlace.className = "campo";

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

    const btnEliminar = document.createElement("button");
    btnEliminar.type = "button";
    btnEliminar.textContent = "Eliminar";
    btnEliminar.className = "btn-delete";
    btnEliminar.onclick = () => {
        divEnlace.remove();
    };

    divEnlace.appendChild(nuevaDescripcion);
    divEnlace.appendChild(nuevoEnlace);
    divEnlace.appendChild(btnEliminar);
    contenedor.appendChild(divEnlace);
}


document.getElementById("input-imagenes").addEventListener("change", function(event) {
    const files = Array.from(event.target.files);
    
    files.forEach(file => {
        selectedImages.push({ file: file, descripcion: "" });
    });

    // Limpiar el input para poder volver a seleccionar
    event.target.value = "";
    renderizarImagenes();
});

function renderizarImagenes() {
    const preview = document.getElementById("preview-imagenes");
    preview.innerHTML = "";

    selectedImages.forEach((item, index) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const divImagen = document.createElement("div");
            divImagen.className = "imagen-preview";

            const img = document.createElement("img");
            img.src = e.target.result;
            img.style.maxWidth = "150px";

            // Campo de texto para la descripción
            const inputDescripcion = document.createElement("input");
            inputDescripcion.type = "text";
            inputDescripcion.placeholder = "Descripción de la imagen";
            inputDescripcion.className = "input-descripcion";
            inputDescripcion.value = item.descripcion;
            inputDescripcion.oninput = function() {
                selectedImages[index].descripcion = inputDescripcion.value;
            };

            // Botón para eliminar la imagen
            const btnEliminar = document.createElement("button");
            btnEliminar.type = "button";
            btnEliminar.textContent = "Eliminar";
            btnEliminar.className = "btn-delete";
            btnEliminar.onclick = () => {
                selectedImages.splice(index, 1);
                renderizarImagenes();
            };

            divImagen.appendChild(img);
            divImagen.appendChild(inputDescripcion);
            divImagen.appendChild(btnEliminar);
            preview.appendChild(divImagen);
        };
        reader.readAsDataURL(item.file);
    });
}



/* -------------------------
 * Manejo de Participantes: Búsqueda y selección
 * ------------------------- */
async function cargarParticipantes() {
    try {
        const response = await fetch(API_URL_PHP +  "project_participant.php");
        listaGlobalParticipantes = await response.json();
    } catch (error) {
        console.error("Error al obtener participantes:", error);
    }
}

function filtrarParticipantes(texto) {
    return listaGlobalParticipantes.filter(p => p.name.toLowerCase().includes(texto.toLowerCase()));
}

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
    
    // Input oculto para enviar el dato
    const hiddenInput = document.createElement("input");
    hiddenInput.type = "hidden";
    // Se envía como participantes[id] => nombre
    hiddenInput.name = `participantes[${idSeleccionado}]`;
    hiddenInput.value = nombreSeleccionado;
    nuevoDiv.appendChild(hiddenInput);

    // Botón para eliminar el participante
    const btnEliminar = document.createElement("button");
    btnEliminar.type = "button";
    btnEliminar.textContent = "Eliminar";
    btnEliminar.className = "btn-delete";
    btnEliminar.onclick = () => {
        nuevoDiv.remove();
        participantesSeleccionados = participantesSeleccionados.filter(id => id !== idSeleccionado);
    };
    nuevoDiv.appendChild(btnEliminar);

    divLista.appendChild(nuevoDiv);

    // Resetea el input de búsqueda
    inputBuscar.value = "";
    delete inputBuscar.dataset.selectedId;
    document.getElementById("btn-agregar-participante").disabled = true;
}

/* Ocultar sugerencias si se hace clic fuera */
document.addEventListener("click", function(event) {
    const inputBuscar = document.getElementById("input-buscar-participante");
    const listado = document.getElementById("listado-profile");
    if (!inputBuscar.contains(event.target) && !listado.contains(event.target)) {
        listado.style.display = "none";
    }
});

document.getElementById("input-buscar-participante").addEventListener("input", () => {
    const texto = document.getElementById("input-buscar-participante").value.trim();
    if (texto) {
        mostrarSugerencias(filtrarParticipantes(texto));
    } else {
        document.getElementById("listado-profile").style.display = "none";
    }
    document.getElementById("btn-agregar-participante").disabled = true;
});

document.getElementById("btn-agregar-participante").addEventListener("click", agregarParticipanteSeleccionado);

/* -------------------------
 * Envío del formulario y manejo del modal
 * ------------------------- */
document.getElementById("form-proyecto").addEventListener("submit", async function(e) {
    e.preventDefault();
    const form = this;
    const formData = new FormData(form);

    // Agregar imágenes seleccionadas manualmente
    selectedImages.forEach((item, index) => {
        formData.append("imagenes[]", item.file);
        formData.append(`descripciones[]`, item.descripcion);
    });

    try {
        const response = await fetch(form.action, {
            method: 'POST',
            body: formData
        });
        
        // Verifica el Content-Type para asegurarse de que es JSON
        const contentType = response.headers.get("content-type");
        let result;
        if (contentType && contentType.indexOf("application/json") !== -1) {
            result = await response.json();
        } else {
            // Si no es JSON, lee el texto para depuración y lanza un error controlado
            const text = await response.text();
            console.error("Respuesta no JSON recibida:", text);
            throw new Error("La respuesta del servidor no es JSON. Revise los errores en el backend.");
        }
        
        mostrarModal(result);
    } catch (error) {
        console.error("Error al enviar el formulario:", error);
        mostrarModal({ success: false, message: "Error al enviar el formulario: " + error.message });
    }
});


/* Función para mostrar el modal de respuesta */
function mostrarModal(data) {
    const modal = document.getElementById("modal");
    const modalMessage = document.getElementById("modal-message");
    modalMessage.textContent = data.message || "Respuesta del servidor";
    modal.classList.remove("hidden");

    // Botón: Crear otro proyecto (resetea el formulario)
    document.getElementById("modal-crear-otro").onclick = () => {
        document.getElementById("form-proyecto").reset();
        selectedImages = [];
        renderizarImagenes();
        document.getElementById("contenedor-parrafos").innerHTML = "";
        document.getElementById("contenedor-testimonios").innerHTML = "";
        document.getElementById("contenedor-enlaces").innerHTML = "";
        document.getElementById("lista-participantes").innerHTML = "";
        participantesSeleccionados = [];
        modal.classList.add("hidden");
    };

    // Botón: Ver proyecto creado (redirige si hay ID del proyecto)
    document.getElementById("modal-ver-proyecto").onclick = () => {
        if(data.success && data.id) {
            window.location.href = API_URL +`/frontend/proyecto-admin-detalle.html?id=${data.id}`;
        } else {
            alert("No hay proyecto para ver.");
        }
    };
}

/* -------------------------
 * Inicialización
 * ------------------------- */
document.addEventListener("DOMContentLoaded", function () {
    cargarParticipantes();
});
