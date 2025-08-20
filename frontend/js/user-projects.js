// Función para cargar los proyectos del usuario
async function cargarProyectosUsuario(userId) {
    try {
        const response = await fetch(`../../backend/get_user_projects.php?user_id=${userId}`);
        const data = await response.json();
        
        if (data.success) {
            mostrarProyectosUsuario(data.projects);
        } else {
            console.error('Error al cargar proyectos:', data.error);
            document.getElementById('user-projects-section').innerHTML = '<p>No se pudieron cargar los proyectos.</p>';
        }
    } catch (error) {
        console.error('Error al cargar proyectos:', error);
        document.getElementById('user-projects-section').innerHTML = '<p>Error al cargar los proyectos.</p>';
    }
}

// Función para mostrar los proyectos del usuario
function mostrarProyectosUsuario(projects) {
    const projectsSection = document.getElementById('user-projects-section');
    
    if (!projects || projects.length === 0) {
        projectsSection.innerHTML = '<p>Este usuario no ha participado en ningún proyecto aún.</p>';
        return;
    }
    
    let projectsHTML = '';
    
    projects.forEach(project => {
        const fecha = new Date(project.fecha).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        projectsHTML += `
            <div class="project-card">
                <div class="project-header">
                    <h3 class="project-title">${escapeHtml(project.titulo_proyecto)}</h3>
                    <span class="project-date">${fecha}</span>
                </div>
                <div class="project-content">
                    <p class="project-description">${escapeHtml(project.descripcion_tarjeta)}</p>
                    ${project.ubicacion ? `<p class="project-location"><strong>Ubicación:</strong> ${escapeHtml(project.ubicacion)}</p>` : ''}
                </div>
                <div class="project-footer">
                    <a href="../proyecto-detalle.php?id=${project.id_proyecto}" class="project-link" target="_blank">
                        Ver proyecto completo <i class="fas fa-external-link-alt"></i>
                    </a>
                </div>
            </div>
        `;
    });
    
    projectsSection.innerHTML = projectsHTML;
}

// Función para escapar HTML y prevenir XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Función para inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Obtener el ID del usuario desde la URL
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('id');
    
    if (userId) {
        cargarProyectosUsuario(userId);
    }
});
