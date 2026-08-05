async function cargarProyectosUsuario(userId) {
    const projectsSection = document.getElementById('user-projects-section');

    try {
        const response = await fetch(`../../backend/get_user_projects.php?user_id=${encodeURIComponent(userId)}`);
        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.error || 'No se pudieron cargar los proyectos.');
        }

        mostrarProyectosUsuario(data.projects || []);
    } catch (error) {
        console.error('Error al cargar proyectos:', error);
        mostrarEstadoProyectos(projectsSection, 'No se pudieron cargar los proyectos.');
    }
}

function mostrarProyectosUsuario(projects) {
    const projectsSection = document.getElementById('user-projects-section');
    if (!projectsSection) return;

    projectsSection.replaceChildren();

    if (!projects.length) {
        mostrarEstadoProyectos(projectsSection, 'Este usuario no ha participado en ningún proyecto aún.');
        return;
    }

    const carousel = document.createElement('div');
    const track = document.createElement('div');
    const previousButton = crearBotonCarrusel('previous', 'Proyecto anterior', 'fa-chevron-left');
    const nextButton = crearBotonCarrusel('next', 'Proyecto siguiente', 'fa-chevron-right');

    carousel.className = 'projects-carousel';
    track.className = 'projects-carousel-track';
    track.tabIndex = 0;
    track.setAttribute('aria-label', 'Proyectos del perfil');

    projects.forEach((project) => {
        track.appendChild(crearTarjetaProyecto(project));
    });

    carousel.append(previousButton, track, nextButton);
    projectsSection.appendChild(carousel);

    const moverCarrusel = (direction) => {
        const card = track.querySelector('.project-card');
        const gap = parseFloat(getComputedStyle(track).gap) || 16;
        const distance = card ? card.getBoundingClientRect().width + gap : track.clientWidth * 0.8;
        track.scrollBy({ left: direction * distance, behavior: 'smooth' });
    };

    previousButton.addEventListener('click', () => moverCarrusel(-1));
    nextButton.addEventListener('click', () => moverCarrusel(1));
    track.addEventListener('scroll', () => actualizarBotonesCarrusel(track, previousButton, nextButton));
    track.addEventListener('keydown', (event) => {
        if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;

        event.preventDefault();
        moverCarrusel(event.key === 'ArrowLeft' ? -1 : 1);
    });

    requestAnimationFrame(() => actualizarBotonesCarrusel(track, previousButton, nextButton));
}

function crearTarjetaProyecto(project) {
    const card = document.createElement('article');
    const header = document.createElement('div');
    const title = document.createElement('h3');
    const date = document.createElement('time');
    const description = document.createElement('p');
    const openButton = document.createElement('button');

    card.className = 'project-card';
    header.className = 'project-card-header';
    title.className = 'project-title';
    date.className = 'project-date';
    description.className = 'project-description';
    openButton.className = 'project-open-button';
    openButton.type = 'button';

    title.textContent = project.titulo_proyecto || 'Proyecto sin título';
    date.textContent = formatearFechaProyecto(project.fecha);
    date.dateTime = project.fecha || '';
    description.textContent = project.descripcion_tarjeta || 'Sin descripción disponible.';
    openButton.innerHTML = 'Abrir proyecto <i class="fas fa-arrow-right" aria-hidden="true"></i>';
    openButton.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        abrirProyecto(project.id_proyecto);
    });

    header.append(title, date);
    card.append(header, description, openButton);

    return card;
}

function abrirProyecto(projectId) {
    if (!projectId || typeof window.abrirModalDetalleProyectoAdmin !== 'function') {
        console.error('No se pudo abrir el detalle del proyecto.');
        return;
    }

    window.abrirModalDetalleProyectoAdmin(projectId);
}

function configurarRutasImagenesDelModal() {
    const modalContent = document.getElementById('modal-proyecto-contenido');
    if (!modalContent) return;

    const normalizarImagenes = () => {
        modalContent.querySelectorAll('img[src^="../assets/"]').forEach((image) => {
            image.setAttribute('src', `../${image.getAttribute('src')}`);
        });
    };

    const observer = new MutationObserver(normalizarImagenes);
    observer.observe(modalContent, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['src']
    });
}

function crearBotonCarrusel(direction, label, icon) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `projects-carousel-button projects-carousel-button--${direction}`;
    button.setAttribute('aria-label', label);
    button.innerHTML = `<i class="fas ${icon}" aria-hidden="true"></i>`;
    return button;
}

function actualizarBotonesCarrusel(track, previousButton, nextButton) {
    const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
    previousButton.disabled = track.scrollLeft <= 2;
    nextButton.disabled = track.scrollLeft >= maxScroll - 2;
}

function mostrarEstadoProyectos(container, message) {
    if (!container) return;

    const state = document.createElement('p');
    state.className = 'projects-empty-state';
    state.textContent = message;
    container.replaceChildren(state);
}

function formatearFechaProyecto(dateValue) {
    if (!dateValue) return 'Fecha no informada';

    const date = new Date(`${dateValue}T00:00:00`);
    if (Number.isNaN(date.getTime())) return dateValue;

    return new Intl.DateTimeFormat('es-CL', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    }).format(date).replace('.', '');
}

document.addEventListener('DOMContentLoaded', () => {
    configurarRutasImagenesDelModal();

    const userId = new URLSearchParams(window.location.search).get('id');
    if (userId) cargarProyectosUsuario(userId);
});
