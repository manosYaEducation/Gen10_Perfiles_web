document.addEventListener('DOMContentLoaded', function () {
    // Verificar que la API_URL_PHP esté correctamente configurada
    if (!window.API_URL_PHP) {
        console.error('API_URL_PHP no está definida');
        return;
    }
    // Realiza una solicitud para obtener todos los perfiles desde el endpoint OPTIMIZADO
    fetch(`${window.API_URL_PHP}read_profiles_optimized.php`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const profilesColumn = document.querySelector('.profiles-column');
                profilesColumn.innerHTML = ''; // Limpiar la columna antes de agregar los perfiles
                // Mostrar todos los perfiles
                data.profiles.forEach(profile => {
                    const profileCard = document.createElement('div');
                    profileCard.classList.add('profile-card');
                    // Construir la URL de imagen correctamente usando API_URL_PHP
                    const imageUrl = `${window.API_URL_PHP}get_profile_image.php?id=${profile.id}`;
                    profileCard.innerHTML = `
                         <div class="profile-content">
                          <div class="profile-image">
                                    <img src="${imageUrl}" alt="${profile.name}" loading="lazy">
                                </div>
                            <h2>${profile.name}</h2>
                            
                            <h3 class="profile-subtitle">${profile.phrase}</h3>
                            <a href="../frontend/perfiles/profile-template.php?id=${profile.id}" class="button-link">Perfil</a>
                            <button class="buttonActualizar" data-id="${profile.id}" class="button-link" onclick="redirectToUpdate(${profile.id})">Actualizar</button>
                            <button class="buttonBorrar" data-id="${profile.id}" onclick="deleteUser(event)">Eliminar</button>
                        </div>
                    `;
                    profilesColumn.appendChild(profileCard);
                });
            } else {
                console.error('No se pudieron obtener los perfiles:', data.message);
            }
        })
        .catch(error => console.error('Error al obtener perfiles:', error));


    fetch(`${window.API_URL_PHP}read_reviews.php`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                data.data.reviews.forEach((review, index) => {
                    const reviewTable = document.createElement('tr');
                    reviewTable.classList.add('review-row');

                    // RE-06: cada fila guarda su propio estado/calificación/fecha
                    // para que la función de filtros pueda leerlos sin volver a golpear el backend.
                    reviewTable.dataset.status = review.estado_reseña || '';
                    reviewTable.dataset.rating = review.rating || 0;
                    reviewTable.dataset.date = review.date_review || '';

                    reviewTable.innerHTML = `
                        <td class="td-medium">${review.nameClient}</td>
                        <td class="td-medium">${review.nombre_perfil}</td>
                        <td class="td-medium">${review.company}</td>
                        <td class="td-large">${review.comments}</td>
                        <td class="td-small">
                            <div class="imgRating-${review.id}"></div>
                        </td>
                        <td class="status td-small" id="actualState">${review.estado_reseña}</td>
                        <td class="td-small">
                            <select id="review-status-${review.id}" onchange="changeStatus(${review.id})">
                                <option>Cambiar estado</option>
                                <option value="1" ${review.estado_reseña === 'Pendiente' ? 'selected' : ''}>Pendiente</option>
                                <option value="2" ${review.estado_reseña === 'Aprobada' ? 'selected' : ''}>Aprobada</option>
                                <option value="3" ${review.estado_reseña === 'Rechazada' ? 'selected' : ''}>Rechazada</option>
                            </select>
                        </td>
                    `;

                    // Inserta la fila en el cuerpo de la tabla
                    tbReviews.appendChild(reviewTable);

                    // Agregar estrellas en la valoración
                    const imgRatingContainer = reviewTable.querySelector(`.imgRating-${review.id}`);
                    const numberRating = review.rating;
                    // Se itera sobre el valor de la valoración para agregar las estrellas
                    for (let i = 0; i < numberRating; i++) {
                        const estrella = document.createElement('img');
                        // URL de la estrella
                        estrella.src = "../assets/img/star.png";
                        estrella.alt = "Estrella";
                        estrella.classList.add('rating')
                        imgRatingContainer.appendChild(estrella);
                    }
                });

                // RE-02 / RE-03: calcular y pintar el dashboard con los datos ya cargados
                actualizarDashboardReseñas(data.data.reviews);
            }
            else {
                console.log(data)
            }
        })

        .catch(error => console.error('Error al obtener reseñas:', error.message));

    // RE-06: engancha los controles de filtro una sola vez (no dependen del fetch)
    inicializarFiltrosReseñas();
});

/**
 * RE-02 / RE-03: Calcula los indicadores del dashboard (total, promedio,
 * y conteo por estado) a partir de las reseñas ya cargadas y los pinta en
 * las tarjetas del header. Se calcula sobre el total general, no sobre el
 * resultado filtrado, para que siga funcionando como un resumen global.
 */
function actualizarDashboardReseñas(reviews) {
    const total = reviews.length;
    const promedio = total > 0
        ? (reviews.reduce((suma, r) => suma + Number(r.rating || 0), 0) / total).toFixed(1)
        : '0.0';
    const pendientes = reviews.filter(r => r.estado_reseña === 'Pendiente').length;
    const aprobadas = reviews.filter(r => r.estado_reseña === 'Aprobada').length;
    const rechazadas = reviews.filter(r => r.estado_reseña === 'Rechazada').length;

    document.getElementById('dashTotal').textContent = total;
    document.getElementById('dashPromedio').textContent = promedio;
    document.getElementById('dashPendientes').textContent = pendientes;
    document.getElementById('dashAprobadas').textContent = aprobadas;
    document.getElementById('dashRechazadas').textContent = rechazadas;
}

/**
 * RE-06: estructura base de filtros avanzados. Una sola función combina
 * estado + rango de fecha (RE-09) + calificación mínima (RE-10) sobre las
 * filas ya renderizadas en el navegador (filtrado client-side).
 *
 * Nota: si más adelante el equipo prefiere que el filtro golpee el backend
 * (ej. para no cargar miles de reseñas de una vez), esta función es el único
 * lugar que habría que cambiar por un fetch con querystring.
 */
function aplicarFiltrosReseñas() {
    const estado = document.getElementById('filter-reviews').value;
    const desde = document.getElementById('filter-fecha-desde').value; // 'YYYY-MM-DD' o ''
    const hasta = document.getElementById('filter-fecha-hasta').value;
    const calificacion = parseInt(document.getElementById('filter-rating').value, 10) || 0;

    const filas = document.querySelectorAll('#tbReviews tr');

    filas.forEach(fila => {
        const filaEstado = fila.dataset.status || '';
        const filaRating = parseInt(fila.dataset.rating, 10) || 0;
        const filaFecha = (fila.dataset.date || '').slice(0, 10); // solo YYYY-MM-DD

        let visible = true;

        if (estado !== 'todas' && filaEstado !== estado) visible = false;
        if (visible && desde && filaFecha && filaFecha < desde) visible = false;
        if (visible && hasta && filaFecha && filaFecha > hasta) visible = false;
        // RE-10: calificación EXACTA (no "mínimo"), así se puede aislar
        // solo las de 1 estrella (críticas) o solo las de 5 (destacadas).
        if (visible && calificacion !== 0 && filaRating !== calificacion) visible = false;

        fila.style.display = visible ? '' : 'none';
    });
}

/**
 * RE-03: recuenta pendientes/aprobadas/rechazadas leyendo el data-status
 * de las filas actuales del DOM (no toca total ni promedio, que no cambian
 * al aprobar/rechazar una reseña ya existente).
 */
function recalcularContadoresDashboard() {
    const filas = document.querySelectorAll('#tbReviews tr');
    let pendientes = 0, aprobadas = 0, rechazadas = 0;

    filas.forEach(fila => {
        if (fila.dataset.status === 'Pendiente') pendientes++;
        else if (fila.dataset.status === 'Aprobada') aprobadas++;
        else if (fila.dataset.status === 'Rechazada') rechazadas++;
    });

    document.getElementById('dashPendientes').textContent = pendientes;
    document.getElementById('dashAprobadas').textContent = aprobadas;
    document.getElementById('dashRechazadas').textContent = rechazadas;
}

function inicializarFiltrosReseñas() {
    const filtroEstado = document.getElementById('filter-reviews');
    const filtroDesde = document.getElementById('filter-fecha-desde');
    const filtroHasta = document.getElementById('filter-fecha-hasta');
    const filtroRating = document.getElementById('filter-rating');
    const btnLimpiar = document.getElementById('btnLimpiarFiltrosReseñas');

    if (!filtroEstado || !filtroDesde || !filtroHasta || !filtroRating) return;

    [filtroEstado, filtroDesde, filtroHasta, filtroRating].forEach(control => {
        control.addEventListener('change', aplicarFiltrosReseñas);
    });

    if (btnLimpiar) {
        btnLimpiar.addEventListener('click', () => {
            filtroEstado.value = 'todas';
            filtroDesde.value = '';
            filtroHasta.value = '';
            filtroRating.value = '0';
            aplicarFiltrosReseñas();
        });
    }
}

function redirectToUpdate(profileId) {
    window.location.href = `./actualizar-perfil.html?id=${profileId}`;
}

function changeStatus(reviewId) {
    const selectElement = document.getElementById(`review-status-${reviewId}`);
    const originalStatus = selectElement.getAttribute('data-original-status');
    const selectedStatus = selectElement.value;

    // Si el estado ha cambiado, abre la modal
    if (originalStatus !== selectedStatus) {
        const modal = document.getElementById('confirmationDialog');
        modal.showModal();

        // Guarda el ID y el nuevo estado en atributos del modal para usarlos en la confirmación
        modal.setAttribute('data-review-id', reviewId);
        modal.setAttribute('data-new-status', selectedStatus);
    }
}

function confirmAction() {
    const modal = document.getElementById('confirmationDialog');
    const reviewId = modal.getAttribute('data-review-id');
    const newStatus = modal.getAttribute('data-new-status');

    fetch(`${window.API_URL_PHP}update_review.php`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: reviewId,
            statusid: newStatus
        })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Obtiene la celda del estado de la reseña
                const statusCell = document.querySelector(`#review-status-${reviewId}`).closest('tr').querySelector('#actualState');
                //Se crea un mapa con los posibles estados de la reseña
                const statusMap = {
                    '1': 'Pendiente',
                    '2': 'Aprobada',
                    '3': 'Rechazada',
                };

                // Obtiene el texto del nuevo estado
                const newStateText = statusMap[newStatus]

                // Actualiza el texto del estado en la tabla
                statusCell.textContent = newStateText;

                // RE-06: mantiene sincronizado el data-status de la fila
                // para que el filtro de estado siga siendo correcto.
                statusCell.closest('tr').dataset.status = newStateText;

                // RE-03: recalcula los contadores del dashboard (no hace falta
                // volver a pedir todas las reseñas, se cuenta desde las filas).
                recalcularContadoresDashboard();

                // También puedes actualizar el atributo de estado original del selector
                const selectElement = document.getElementById(`review-status-${reviewId}`);
                // Guarda el nuevo estado como el estado original
                selectElement.setAttribute('data-original-status', newStatus);
            } else {
                console.error('Error al actualizar la reseña:', data.message);
            }
        })
        .catch(error => console.error('Error:', error));
    modal.close();
}

function closeDialog() {
    const modal = document.getElementById('confirmationDialog');
    modal.close();
}



document.getElementById('searchInput').addEventListener('input', function () {

 // Función para normalizar texto:
    // 1. Separa los caracteres con tilde de las letras
    // 2. Elimina los caracteres diacríticos
    // 3. Convierte todo el texto a minúsculas
    const normalizeText = text => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    
    const searchTerm = normalizeText(this.value);
    const cards = document.querySelectorAll('.profile-card'); // Ajusta al selector real si es distinto

    cards.forEach(card => {
        const nameElement = card.querySelector('h2');
        const name = nameElement ? normalizeText(nameElement.textContent) : '';

        if (name.includes(searchTerm)) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });
});


// document.addEventListener("DOMContentLoaded", function () {
//     const logoutButton = document.querySelector(".button-53");
//     // Verifica si el botón existe en el DOM antes de intentar agregar el eventListener
//     if (logoutButton) {
//       logoutButton.addEventListener("click", cerrarSesion);
//     } else {
//       console.warn("El botón de cerrar sesión no se encontró en el DOM.");
//     }
//   });
//   function cerrarSesion() {
//     sessionStorage.clear();
//     localStorage.clear();

//     window.location.href = "../index.html";
//   }