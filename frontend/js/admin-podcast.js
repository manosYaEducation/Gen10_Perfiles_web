// Abrir modal
function abrirModal() {
    document.getElementById('adminPodcastModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Restaurar formulario a modo crear
function restaurarFormulario() {
    console.log('Restaurando formulario');
    document.querySelector('.modal-admin-content h2').textContent = 'Agregar Nuevo Podcast';
    document.getElementById('formPodcast').onsubmit = guardarPodcast;
}

// Cerrar modal
function cerrarModal() {
    document.getElementById('adminPodcastModal').style.display = 'none';
    document.body.style.overflow = 'auto';
    document.getElementById('formPodcast').reset();
    document.getElementById('mensajeResultado').style.display = 'none';
    
    // Restaurar a modo crear
    restaurarFormulario();
}

// Cerrar con ESC
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') cerrarModal();
});

// Cerrar al hacer click fuera
window.onclick = function(e) {
    const modal = document.getElementById('adminPodcastModal');
    if (e.target === modal) cerrarModal();
}

// Guardar podcast
async function guardarPodcast(event) {
    event.preventDefault();
    
    // Obtener datos del formulario
    const nuevoPodcast = {
        id: Date.now(),
        titulo: document.getElementById('titulo').value.trim(),
        descripcion: document.getElementById('descripcion').value.trim(),
        url_youtube: document.getElementById('url_youtube').value.trim(),
        fecha: document.getElementById('fecha').value,
        estado: 'programado'
    };
    
    try {
        // Enviar datos al servidor PHP
        const response = await fetch('../backend/guardar-podcast.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(nuevoPodcast)
        });
        
        const resultado = await response.json();
        
        if (resultado.success) {
            mostrarMensaje('✓ Podcast guardado exitosamente', 'exito');
            setTimeout(() => {
                cerrarModal();
                cargarPodcasts(); // Recargar la lista
            }, 2000);
        } else {
            mostrarMensaje('✗ Error: ' + resultado.message, 'error');
        }
        
    } catch (error) {
        mostrarMensaje('✗ Error al guardar: ' + error.message, 'error');
    }
}

// Mostrar mensaje
function mostrarMensaje(texto, tipo) {
    const mensaje = document.getElementById('mensajeResultado');
    mensaje.textContent = texto;
    mensaje.className = tipo;
    mensaje.style.display = 'block';
}

// ========== EDITAR PODCAST ==========
function editarPodcast(id) {
    const podcast = todosLosPodcasts.find(p => p.id === id);
    if (!podcast) return alert('Podcast no encontrado');
    
    // Llenar formulario
    document.getElementById('titulo').value = podcast.titulo;
    document.getElementById('descripcion').value = podcast.descripcion;
    document.getElementById('url_youtube').value = podcast.url_youtube;
    document.getElementById('fecha').value = podcast.fecha;
    // Cambiar a modo edición
    document.querySelector('.modal-admin-content h2').textContent = 'Editar Podcast';
    document.getElementById('formPodcast').onsubmit = (e) => actualizarPodcast(e, id);
    
    abrirModal();
}

// Actualizar podcast
async function actualizarPodcast(e, id) {
    e.preventDefault();
    
    console.log('Actualizando podcast con ID:', id);
    
    const podcastActualizado = {
        id: id,
        titulo: document.getElementById('titulo').value.trim(),
        descripcion: document.getElementById('descripcion').value.trim(),
        url_youtube: document.getElementById('url_youtube').value.trim(),
        fecha: document.getElementById('fecha').value,
    };
    
    console.log('Datos a enviar:', podcastActualizado);
    
    try {
        const response = await fetch('../backend/actualizar-podcast.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(podcastActualizado)
        });
        
        const texto = await response.text();
        console.log('Respuesta del servidor:', texto);
        
        try {
            const resultado = JSON.parse(texto);
            
            if (resultado.success) {
                mostrarMensaje('✓ Podcast actualizado exitosamente', 'exito');
                setTimeout(() => {
                    cerrarModal();
                    location.reload();
                }, 1500);
            } else {
                mostrarMensaje('✗ Error: ' + resultado.message, 'error');
            }
        } catch (parseError) {
            console.error('Error al parsear JSON:', parseError);
            console.error('Texto recibido:', texto);
            mostrarMensaje('✗ Error: Respuesta inválida del servidor', 'error');
        }
        
    } catch (error) {
        console.error('Error completo:', error);
        mostrarMensaje('✗ Error de conexión: ' + error.message, 'error');
    }
}

// ========== ELIMINAR PODCAST ==========
async function eliminarPodcast(id) {
    console.log('Eliminando podcast ID:', id);
    
    const podcast = todosLosPodcasts.find(p => p.id == id);
    
    if (!podcast) {
        alert('Podcast no encontrado');
        return;
    }
    
    if (!confirm(`¿Eliminar "${podcast.titulo}"?`)) {
        return;
    }
    
    try {
        const response = await fetch('../backend/eliminar-podcast.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: id })
        });
        
        const texto = await response.text();
        console.log('Respuesta:', texto);
        
        try {
            const resultado = JSON.parse(texto);
            
            if (resultado.success) {
                alert('✓ Podcast eliminado');
                location.reload();
            } else {
                alert('✗ Error: ' + resultado.message);
            }
        } catch (parseError) {
            console.error('Error al parsear JSON:', parseError);
            console.error('Texto recibido:', texto);
            alert('✗ Error: Respuesta inválida del servidor');
        }
        
    } catch (error) {
        console.error('Error:', error);
        alert('✗ Error de conexión: ' + error.message);
    }
}