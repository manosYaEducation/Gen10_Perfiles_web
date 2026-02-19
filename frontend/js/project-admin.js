document.addEventListener("DOMContentLoaded", () => {

    obtenerProyectos(); // Cargar proyectos al iniciar

    /* -------------------------
     * Obtener y mostrar proyectos (GET)
     * ------------------------- */
    async function obtenerProyectos() {
        try {
            const response = await fetch(API_URL_PHP +  "project_admin.php");
            if (!response.ok) throw new Error("Error al obtener proyectos");
            const proyectos = await response.json();
            mostrarProyectosEnTabla(proyectos);
        } catch (error) {
            console.error("Error al obtener proyectos:", error);
        }
    }

    function mostrarProyectosEnTabla(proyectos) {
        // Separar proyectos por estado
        const proyectosActivos = [];
        const proyectosFinalizados = [];
        const proyectosStandBy = [];
        const proyectosSinClasificar = [];

        proyectos.forEach(proyecto => {
            if (proyecto.estado === 'Activo') {
                proyectosActivos.push(proyecto);
            } else if (proyecto.estado === 'Finalizado') {
                proyectosFinalizados.push(proyecto);
            } else if (proyecto.estado === 'StandBy') {
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
        cargarTabla('tablaProyectos', proyectos); // Todos los proyectos
    }

    function cargarTabla(idTabla, proyectos) {
        const tabla = document.getElementById(idTabla);
        if (!tabla) {
            console.error(`Elemento #${idTabla} no encontrado.`);
            return;
        }
        tabla.innerHTML = ""; // Limpiar la tabla antes de agregar nuevos datos
    
        proyectos.forEach(proyecto => {
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${proyecto.id_proyecto}</td>
                <td>${proyecto.titulo_tarjeta}</td>
                <td>${proyecto.descripcion_tarjeta}</td>
                <td>
                    <button class="action-btn ver-btn" data-id="${proyecto.id_proyecto}">Ver</button>                    
                    <button class="action-btn delete-btn" data-id="${proyecto.id_proyecto}">Eliminar</button>
                    <button class="action-btn edit-btn" data-id="${proyecto.id_proyecto}">Actualizar</button>
                </td>
            `;
            tabla.appendChild(fila);
        });
    
        // Asignar eventos a los botones de "Eliminar"
        document.querySelectorAll(".delete-btn").forEach(button => {
            button.addEventListener("click", () => {
                const idProyecto = button.getAttribute("data-id");
                eliminarProyecto(idProyecto);
            });
        });
    
        // Asignar eventos a los botones de "Ver"
        document.querySelectorAll(".ver-btn").forEach(button => {
            button.addEventListener("click", () => {
                const idProyecto = button.getAttribute("data-id");
    
                if (idProyecto) {
                    window.location.href = `proyecto-admin-detalle.html?id=${idProyecto}`;
                } else {
                    console.error("Error: No se encontró el ID del proyecto.");
                }
            });
        });

        // Asignar eventos a los botones de "Editar"
        document.querySelectorAll(".edit-btn").forEach(button => {
            button.addEventListener("click", () => {
                const idProyecto = button.getAttribute("data-id");

                if (idProyecto) {
                    window.location.href = `proyecto-actualizar.html?id=${idProyecto}`;
                } else {
                    console.error("Error: No se encontró el ID del proyecto.");
                }
            });
        });
    }
    

    /* -------------------------
     * Eliminar un proyecto (DELETE)
     * ------------------------- */
    async function eliminarProyecto(id) {
        if (!confirm("¿Estás seguro de eliminar este proyecto?")) return;

        try {
            const response = await fetch(`${API_URL_PHP}project_admin.php?id_proyecto=${id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" }
            });
            

            if (!response.ok) throw new Error("Error al eliminar el proyecto");
            const resultado = await response.json();
            alert(resultado.mensaje);
            obtenerProyectos(); // Recargar la lista después de eliminar
        } catch (error) {
            console.error("Error al eliminar el proyecto:", error);
        }
    }
});

//<button class="action-btn edit-btn" data-id="${proyecto.id_proyecto}">Editar</button>