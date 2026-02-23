document.addEventListener("DOMContentLoaded", () => {

    obtenerProyectos();

    async function obtenerProyectos() {
        try {
            const response = await fetch(API_URL_PHP + "project_admin.php");

            if (!response.ok) throw new Error("Error al obtener proyectos");

            const proyectos = await response.json();

            mostrarProyectosEnTabla(proyectos);

        } catch (error) {
            console.error("Error al obtener proyectos:", error);
        }
    };

    function mostrarProyectosEnTabla(proyectos) {

        const contenedor = document.getElementById("tablaProyectos");

        if (!contenedor) {
            console.error("Contenedor no encontrado");
            return;
        }

        contenedor.innerHTML = "";

        proyectos.forEach(proyecto => {

            const card = document.createElement("div");
            card.className = "proyecto-card";

            card.innerHTML = `
                <h3>${proyecto.titulo_tarjeta}</h3>
                <p>${proyecto.descripcion_tarjeta}</p>

                <div class="card-info">
                    <strong>ID:</strong> ${proyecto.id_proyecto}
                </div>

                <div class="card-actions">
                    <button class="ver-btn">Ver</button>
                    <button class="edit-btn">Editar</button>
                    <button class="delete-btn">Eliminar</button>
                </div>
            `;

            card.querySelector(".ver-btn").addEventListener("click", () => {
                window.location.href = `proyecto-admin-detalle.html?id=${proyecto.id_proyecto}`;
            });

            card.querySelector(".edit-btn").addEventListener("click", () => {
                window.location.href = `proyecto-actualizar.html?id=${proyecto.id_proyecto}`;
            });

            card.querySelector(".delete-btn").addEventListener("click", () => {
                eliminarProyecto(proyecto.id_proyecto);
            });

            contenedor.appendChild(card);
        });
    }

    async function eliminarProyecto(id) {

        if (!confirm("¿Eliminar este proyecto?")) return;

        try {

            const response = await fetch(`${API_URL_PHP}project_admin.php?id_proyecto=${id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" }
            });

            if (!response.ok) throw new Error("Error al eliminar");

            const resultado = await response.json();

            alert(resultado.mensaje);

            obtenerProyectos();

        } catch (error) {
            console.error("Error al eliminar:", error);
        }
    }

});
