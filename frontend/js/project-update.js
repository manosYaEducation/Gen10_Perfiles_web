document.addEventListener("DOMContentLoaded", async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const idProyecto = urlParams.get('id');

    const form = document.getElementById('form-proyecto');

    // Cargar los datos actuales del proyecto
    try {
        const response = await fetch(`${window.API_URL_PHP}project_detail.php?id=${idProyecto}`);
        if (!response.ok) throw new Error('Error en la respuesta del servidor');
        
        const result = await response.json();
        if (!result || !result[0]) throw new Error('No se encontraron datos del proyecto');

        const project = result[0];

        // Llenar campos 
        document.getElementById('titulo_tarjeta').value = project.titulo_tarjeta || '';
        document.getElementById('descripcion_tarjeta').value = project.descripcion_tarjeta || '';
        document.getElementById('titulo_proyecto').value = project.titulo || '';
        document.getElementById('fecha').value = project.fecha || '';
        document.getElementById('ubicacion').value = project.ubicacion || '';
        document.getElementById('contenido_proyecto').value = project.contenido || '';

        // Cargar párrafos
        const contenedorParrafos = document.getElementById('contenedor-parrafos');
        contenedorParrafos.innerHTML = '';
        project.detalles.parrafos.forEach(parrafo => {
            agregarCampoParrafo(parrafo);
        });

        // Cargar imágenes
        cargarImagenes(project.detalles.imagenes);

        // Cargar participantes
        cargarParticipantesExistentes(project.detalles.participantes);

        // Cargar testimonios
        cargarTestimonios(project.detalles.testimonios);

        // Cargar enlaces
        cargarEnlaces(project.detalles.enlaces);

        // Configurar el formulario para actualización
        configurarFormulario(idProyecto);

    } catch (error) {
        console.error("Error al cargar el proyecto:", error);
    }

    const formData = nuevosDatos();
    console.log(Object.fromEntries(formData));
    // Manejar el envío del formulario
    form.addEventListener('submit', async function(event) {
        event.preventDefault(); 
        try {
            const formData = nuevosDatos();
            // Convertir FormData a un objeto
            const data = {};
            for (let [key, value] of formData.entries()) {

                if (key.endsWith('[]')) {
                    const cleanKey = key.slice(0, -2);
                    if (!data[cleanKey]) {
                        data[cleanKey] = [];
                    }
                    data[cleanKey].push(value);
                } else {
                    data[key] = value;
                }
            }
            
            const response = await fetch(`${window.API_URL_PHP}project_update.php`, {
                method: 'PUT',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.mensaje || 'Error en la respuesta del servidor');
            }
            
            const result = await response.json();
            if (result.success) {
                alert('Proyecto actualizado correctamente');
                window.location.href = 'proyectos-admin.html';
            } else {
                throw new Error(result.mensaje || 'Error al actualizar el proyecto');
            }
        } catch (error) {
            alert(error.message || 'Error al actualizar el proyecto');
            console.error("Error:", error);
        }
    });

    await cargarParticipantes();
});

function cargarImagenes(imagenes) {
    const previewImagenes = document.getElementById('preview-imagenes');
    previewImagenes.innerHTML = '';
    imagenes.forEach(imagen => {
        const imgContainer = document.createElement('div');
        imgContainer.className = 'imagen-preview';
        imgContainer.innerHTML = `
            <img src="${imagen.url}" alt="${imagen.descripcion}">
            <input type="text" value="${imagen.descripcion}" name="imagenes_descripcion[]">
            <input type="hidden" value="${imagen.url}" name="imagenes_url[]">
            <button type="button" onclick="eliminarImagen(this)">Eliminar</button>
        `;
        previewImagenes.appendChild(imgContainer);
    });
}

function cargarParticipantesExistentes(participantes) {
    participantes.forEach(participante => {
        participantesSeleccionados.add(participante.id);
        const divParticipante = document.createElement("div");
        divParticipante.className = "participante-item";
        divParticipante.innerHTML = `
            <span>${participante.nombre}</span>
            <input type="hidden" name="participantes[]" value="${participante.id}">
            <button type="button" class="btn-delete" onclick="eliminarParticipante(this, '${participante.id}')">Eliminar</button>
        `;
        document.getElementById("lista-participantes").appendChild(divParticipante);
    });
}

function cargarTestimonios(testimonios) {
    const contenedorTestimonios = document.getElementById('contenedor-testimonios');
    contenedorTestimonios.innerHTML = '';
    testimonios.forEach(testimonio => {
        agregarCampoTestimonio(testimonio.autor, testimonio.contenido);
    });
}

function cargarEnlaces(enlaces) {
    const contenedorEnlaces = document.getElementById('contenedor-enlaces');
    contenedorEnlaces.innerHTML = '';
    enlaces.forEach(enlace => {
        agregarCampoEnlace(enlace.descripcion, enlace.url);
    });
}

function configurarFormulario(idProyecto) {
    const form = document.getElementById('form-proyecto');
    form.action = `${window.API_URL_PHP}project_update.php`;
    
    const inputId = document.createElement('input');
    inputId.type = 'hidden';
    inputId.name = 'id_proyecto';
    inputId.value = idProyecto;
    form.appendChild(inputId);
    
    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.textContent = 'Actualizar Proyecto';
}

function agregarCampoParrafo(contenido = '') {
    const div = document.createElement('div');
    div.className = 'campo-parrafo';
    div.innerHTML = `
        <textarea name="parrafos[]" required class="campo">${contenido}</textarea>
        <button type="button" onclick="eliminarCampo(this)">Eliminar</button>
    `;
    document.getElementById('contenedor-parrafos').appendChild(div);
}

function agregarCampoTestimonio(autor = '', contenido = '') {
    const div = document.createElement('div');
    div.className = 'campo-testimonio';
    div.innerHTML = `
        <input type="text" name="testimonios_autor[]" placeholder="Autor" required class="campo" value="${autor}">
        <textarea name="testimonios_contenido[]" placeholder="Contenido" required class="campo">${contenido}</textarea>
        <button type="button" onclick="eliminarCampo(this)">Eliminar</button>
    `;
    document.getElementById('contenedor-testimonios').appendChild(div);
}

function agregarCampoEnlace(descripcion = '', url = '') {
    const div = document.createElement('div');
    div.className = 'campo-enlace';
    div.innerHTML = `
        <input type="text" name="enlaces_descripcion[]" placeholder="Descripción" required class="campo" value="${descripcion}">
        <input type="url" name="enlaces_url[]" placeholder="URL" required class="campo" value="${url}">
        <button type="button" onclick="eliminarCampo(this)">Eliminar</button>
    `;
    document.getElementById('contenedor-enlaces').appendChild(div);
}

function eliminarCampo(boton) {
    boton.parentElement.remove();
}

function eliminarImagen(boton) {
    boton.parentElement.remove();
}

function eliminarParticipante(boton, id) {
    participantesSeleccionados.delete(id);
    boton.closest('.participante-item').remove();
}

function nuevosDatos() {
    const formData = new FormData();
    const idProyecto = new URLSearchParams(window.location.search).get('id');

    // Agregar datos al formData
    formData.append('id_proyecto', idProyecto);
    formData.append('titulo_tarjeta', document.getElementById('titulo_tarjeta').value);
    formData.append('descripcion_tarjeta', document.getElementById('descripcion_tarjeta').value);
    formData.append('titulo_proyecto', document.getElementById('titulo_proyecto').value);
    formData.append('fecha', document.getElementById('fecha').value);
    formData.append('ubicacion', document.getElementById('ubicacion').value);
    formData.append('contenido_proyecto', document.getElementById('contenido_proyecto').value);

    // Recuperar párrafos
    document.querySelectorAll('textarea[name="parrafos[]"]').forEach(parrafo => {
        formData.append('parrafos[]', parrafo.value);
    });

    // Recuperar imágenes (URLs y descripciones)
    const imagenesUrl = document.querySelectorAll('input[name="imagenes_url[]"]');
    const imagenesDesc = document.querySelectorAll('input[name="imagenes_descripcion[]"]');
    for (let i = 0; i < imagenesUrl.length; i++) {
        formData.append('imagenes_url[]', imagenesUrl[i].value);
        formData.append('imagenes_descripcion[]', imagenesDesc[i].value);
    }

    // Recuperar participantes
    const participantes = [];
    document.querySelectorAll('input[name="participantes[]"]').forEach(input => {
        const participanteDiv = input.closest('.participante-item');
        participantes.push({
            id: input.value,
            nombre: participanteDiv.querySelector('span').textContent
        });
    });
    formData.append('participantes', JSON.stringify(participantes));

    // Recuperar testimonios
    const testimoniosAutor = document.querySelectorAll('input[name="testimonios_autor[]"]');
    const testimoniosContenido = document.querySelectorAll('textarea[name="testimonios_contenido[]"]');
    for (let i = 0; i < testimoniosAutor.length; i++) {
        formData.append('testimonios_autor[]', testimoniosAutor[i].value);
        formData.append('testimonios_contenido[]', testimoniosContenido[i].value);
    }

    // Recuperar enlaces
    const enlacesDesc = document.querySelectorAll('input[name="enlaces_descripcion[]"]');
    const enlacesUrl = document.querySelectorAll('input[name="enlaces_url[]"]');
    for (let i = 0; i < enlacesDesc.length; i++) {
        formData.append('enlaces_descripcion[]', enlacesDesc[i].value);
        formData.append('enlaces_url[]', enlacesUrl[i].value);
    }
    
    return formData;
}

/* -------------------------
 * Variables globales
 * ------------------------- */
let listaGlobalParticipantes = [];
let participantesSeleccionados = new Set();

/* -------------------------
 * Manejo de Participantes
 * ------------------------- */
async function cargarParticipantes() {
    try {
        const response = await fetch(`${window.API_URL_PHP}project_participant.php`);
        if (!response.ok) throw new Error('Error al obtener participantes');
        listaGlobalParticipantes = await response.json();
        
        // Configurar el buscador de participantes
        configurarBuscadorParticipantes();
    } catch (error) {
        console.error("Error al cargar participantes:", error);
    }
}

function configurarBuscadorParticipantes() {
    const inputBuscar = document.getElementById("input-buscar-participante");
    const listadoProfile = document.getElementById("listado-profile");
    const btnAgregar = document.getElementById("btn-agregar-participante");

    inputBuscar.addEventListener("input", () => {
        const texto = inputBuscar.value.trim();
        if (texto) {
            const filtrados = listaGlobalParticipantes.filter(p => 
                p.name.toLowerCase().includes(texto.toLowerCase())
            );
            mostrarSugerencias(filtrados);
        } else {
            listadoProfile.style.display = "none";
        }
        btnAgregar.disabled = true;
    });

    btnAgregar.addEventListener("click", agregarParticipanteSeleccionado);
}

function mostrarSugerencias(participantesFiltrados) {
    const listadoProfile = document.getElementById("listado-profile");
    listadoProfile.innerHTML = "";

    if (participantesFiltrados.length === 0) {
        listadoProfile.style.display = "none";
        return;
    }

    participantesFiltrados.forEach(part => {
        if (!participantesSeleccionados.has(part.id.toString())) {
            const item = document.createElement("div");
            item.className = "participante-item";
            item.innerHTML = `
                <span>${part.name}</span>
            `;
            item.dataset.id = part.id;
            item.dataset.name = part.name;

            item.addEventListener("click", () => seleccionarParticipante(part));
            listadoProfile.appendChild(item);
        }
    });

    listadoProfile.style.display = participantesFiltrados.length ? "block" : "none";
}

function seleccionarParticipante(participante) {
    const inputBuscar = document.getElementById("input-buscar-participante");
    inputBuscar.value = participante.name;
    inputBuscar.dataset.selectedId = participante.id;
    inputBuscar.dataset.selectedName = participante.name;
    document.getElementById("btn-agregar-participante").disabled = false;
    document.getElementById("listado-profile").style.display = "none";
}

function agregarParticipanteSeleccionado() {
    const inputBuscar = document.getElementById("input-buscar-participante");
    const id = inputBuscar.dataset.selectedId;
    const nombre = inputBuscar.dataset.selectedName;

    if (!id || participantesSeleccionados.has(id)) {
        alert("Este participante ya fue agregado o no es válido.");
        return;
    }

    participantesSeleccionados.add(id);

    const listaParticipantes = document.getElementById("lista-participantes");
    const divParticipante = document.createElement("div");
    divParticipante.className = "participante-item";
    divParticipante.innerHTML = `
        <span>${nombre}</span>
        <input type="hidden" name="participantes[]" value="${id}">
        <button type="button" class="btn-delete" onclick="eliminarParticipante(this, '${id}')">Eliminar</button>
    `;

    listaParticipantes.appendChild(divParticipante);

    // Limpiar el input y deshabilitar el botón
    inputBuscar.value = "";
    delete inputBuscar.dataset.selectedId;
    delete inputBuscar.dataset.selectedName;
    document.getElementById("btn-agregar-participante").disabled = true;
}
