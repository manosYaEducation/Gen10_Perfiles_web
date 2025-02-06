document.addEventListener("DOMContentLoaded", () => {
    const API_URL = "http://localhost/Gen10_Perfiles_web/backend/project_admin.php";

    obtenerProyectos(); // Cargar proyectos al iniciar

    /* -------------------------
     * Obtener y mostrar proyectos (GET)
     * ------------------------- */
    async function obtenerProyectos() {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error("Error al obtener proyectos");
            const proyectos = await response.json();
            mostrarProyectosEnTabla(proyectos);
        } catch (error) {
            console.error("Error al obtener proyectos:", error);
        }
    }

    function mostrarProyectosEnTabla(proyectos) {
        const tabla = document.getElementById("tablaProyectos");
        if (!tabla) {
            console.error("Elemento #tablaProyectos no encontrado.");
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
                    <button class="action-btn edit-btn" data-id="${proyecto.id_proyecto}">Editar</button>
                    <button class="action-btn delete-btn" data-id="${proyecto.id_proyecto}">Eliminar</button>
                </td>
            `;
            tabla.appendChild(fila);
        });

        // Asignar eventos a los botones de eliminación
        document.querySelectorAll(".delete-btn").forEach(button => {
            button.addEventListener("click", () => {
                const idProyecto = button.getAttribute("data-id");
                eliminarProyecto(idProyecto);
            });
        });
    }

    /* -------------------------
     * Eliminar un proyecto (DELETE)
     * ------------------------- */
    async function eliminarProyecto(id) {
        if (!confirm("¿Estás seguro de eliminar este proyecto?")) return;

        try {
            const response = await fetch(API_URL, {
                method: "DELETE",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: `id_proyecto=${id}`
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
