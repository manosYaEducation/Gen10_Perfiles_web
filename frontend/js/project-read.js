async function cargarProyectos() {
    try {
        const response = await fetch("http://localhost/Gen10_Perfiles_web/backend/project_read.php");
        const text = await response.text(); 
        const proyectos = JSON.parse(text); // Convertir a JSON

        mostrarProyectos(proyectos);
    } catch (error) {
        console.error("Error al obtener proyectos:", error);
        document.getElementById("contenedor-proyecto").innerHTML = `<p style="color: red;">Error al cargar los proyectos.</p>`;
    }
}

function mostrarProyectos(proyectos) {
    const contenedor = document.getElementById("contenedor-proyecto");
    contenedor.innerHTML = ""; // Limpiar el contenedor antes de agregar nuevos proyectos

    proyectos.forEach(proyecto => {
        const div = document.createElement("div");
        div.classList.add("proyecto");

        div.innerHTML = `
            <div class="proyecto-timeline">
                <div class="proyecto-fecha">${proyecto.fecha}</div>
                <div class="proyecto-linea"></div>
                <div class="proyecto-tarjeta">
                    <a href="proyecto-detalle.html?id=${proyecto.id_proyecto}" class="proyecto-titulo">${proyecto.titulo_tarjeta}</a>
                    <p class="proyecto-descripcion">${proyecto.descripcion_tarjeta}</p>
                </div>
            </div>
        `;

        contenedor.appendChild(div);
    });
}

// Cargar proyectos cuando se cargue la página
document.addEventListener("DOMContentLoaded", cargarProyectos);
