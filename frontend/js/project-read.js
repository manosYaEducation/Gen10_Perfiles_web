async function cargarProyectos() {
    try {
        const response = await fetch(API_URL_PHP + "/project_read.php");
        const text = await response.text(); 
        const proyectos = JSON.parse(text); // Convertir a JSON

        // Ordenar los proyectos por fecha en orden descendente
        proyectos.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

        // Tomar solo los últimos 5 proyectos
        const ultimosProyectos = proyectos.slice(0, 5);

        mostrarProyectos(ultimosProyectos);
        
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
                    <a href="./frontend/proyecto-detalle.html?id=${proyecto.id_proyecto}" class="proyecto-titulo">${proyecto.titulo_tarjeta}</a>
                    <p class="proyecto-descripcion">${proyecto.descripcion_tarjeta}</p>
                </div>
            </div>
        `;

        contenedor.appendChild(div);
    });
}

// Cargar proyectos cuando se cargue la página
document.addEventListener("DOMContentLoaded", cargarProyectos);
