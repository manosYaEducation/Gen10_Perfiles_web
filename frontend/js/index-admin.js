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
                    reviewTable.dataset.reviewId = review.id;

                    // RE-06: cada fila guarda su propio estado/calificación/fecha
                    // para que la función de filtros pueda leerlos sin volver a golpear el backend.
                    reviewTable.dataset.status = review.estado_reseña || '';
                    reviewTable.dataset.rating = review.rating || 0;
                    reviewTable.dataset.date = review.date_review || '';
                    
                    // RE-05: Guardar todos los datos de la reseña para el modal de detalles
                    reviewTable.dataset.cliente = review.nameClient || '';
                    reviewTable.dataset.empresa = review.company || '';
                    reviewTable.dataset.desarrollador = review.nombre_perfil || '';
                    reviewTable.dataset.comentario = review.comments || '';

                    // RE-04: Tabla simplificada - solo columnas esenciales
                    // RE-12: Chip de color para el estado
                    const chipClass = `chip-${(review.estado_reseña || '').toLowerCase()}`;
                    
                    // Estrellas de calificación para la tabla
                    let estrellasHTML = '';
                    for (let i = 1; i <= 5; i++) {
                        if (i <= review.rating) {
                            estrellasHTML += '<i class="fa-solid fa-star"></i>';
                        } else {
                            estrellasHTML += '<i class="fa-regular fa-star"></i>';
                        }
                    }
                    
                    // RE-11: Botones de acción según estado
                    let accionesHTML = '';
                    if (review.estado_reseña === 'Pendiente') {
                        accionesHTML = `
                            <button class="btn-accion btn-aprobar" onclick="aprobarRechazar(${review.id}, 2)" title="Aprobar">
                                <i class="fa-solid fa-check"></i>
                            </button>
                            <button class="btn-accion btn-rechazar" onclick="aprobarRechazar(${review.id}, 3)" title="Rechazar">
                                <i class="fa-solid fa-xmark"></i>
                            </button>
                        `;
                    } else if (review.estado_reseña === 'Aprobada') {
                        accionesHTML = `
                            <button class="btn-accion btn-rechazar" onclick="aprobarRechazar(${review.id}, 3)" title="Rechazar">
                                <i class="fa-solid fa-xmark"></i>
                            </button>
                        `;
                    } else if (review.estado_reseña === 'Rechazada') {
                        accionesHTML = `
                            <button class="btn-accion btn-aprobar" onclick="aprobarRechazar(${review.id}, 2)" title="Aprobar">
                                <i class="fa-solid fa-check"></i>
                            </button>
                        `;
                    }
                    
                    reviewTable.innerHTML = `
                        <td class="td-medium">${review.nameClient}</td>
                        <td class="td-medium">${review.nombre_perfil}</td>
                        <td class="td-small rating-stars">${estrellasHTML}</td>
                        <td class="td-small" id="actualState"><span class="chip ${chipClass}">${review.estado_reseña}</span></td>
                        <td class="td-small">
                            <div class="acciones-rapidas">
                                ${accionesHTML}
                                <button class="btn-accion btn-ver-detalle" onclick="verDetalle(${review.id})" title="Ver detalle">
                                    <i class="fa-solid fa-eye"></i>
                                </button>
                            </div>
                        </td>
                    `;

                    // Inserta la fila en el cuerpo de la tabla
                    tbReviews.appendChild(reviewTable);
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

// RE-11: Esta función se implementará con los botones de aprobar/rechazar
// function changeStatus(reviewId) { ... }

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
                // RE-04: Buscar la fila por reviewId y actualizar el estado
                const fila = document.querySelector(`tr[data-review-id="${reviewId}"]`);
                if (fila) {
                    const statusCell = fila.querySelector('#actualState');
                    const statusMap = {
                        '1': 'Pendiente',
                        '2': 'Aprobada',
                        '3': 'Rechazada',
                    };
                    const newStateText = statusMap[newStatus];
                    // RE-12: Actualizar chip con nuevo estado y color
                    const chipClass = `chip-${newStateText.toLowerCase()}`;
                    statusCell.innerHTML = `<span class="chip ${chipClass}">${newStateText}</span>`;
                    fila.dataset.status = newStateText;
                    
                    // RE-11: Actualizar botones de acción según nuevo estado
                    const accionesContainer = fila.querySelector('.acciones-rapidas');
                    if (accionesContainer) {
                        let accionesHTML = '';
                        if (newStateText === 'Pendiente') {
                            accionesHTML = `
                                <button class="btn-accion btn-aprobar" onclick="aprobarRechazar(${reviewId}, 2)" title="Aprobar">
                                    <i class="fa-solid fa-check"></i>
                                </button>
                                <button class="btn-accion btn-rechazar" onclick="aprobarRechazar(${reviewId}, 3)" title="Rechazar">
                                    <i class="fa-solid fa-xmark"></i>
                                </button>
                            `;
                        } else if (newStateText === 'Aprobada') {
                            accionesHTML = `
                                <button class="btn-accion btn-rechazar" onclick="aprobarRechazar(${reviewId}, 3)" title="Rechazar">
                                    <i class="fa-solid fa-xmark"></i>
                                </button>
                            `;
                        } else if (newStateText === 'Rechazada') {
                            accionesHTML = `
                                <button class="btn-accion btn-aprobar" onclick="aprobarRechazar(${reviewId}, 2)" title="Aprobar">
                                    <i class="fa-solid fa-check"></i>
                                </button>
                            `;
                        }
                        accionesContainer.innerHTML = `
                            ${accionesHTML}
                            <button class="btn-accion btn-ver-detalle" onclick="verDetalle(${reviewId})" title="Ver detalle">
                                <i class="fa-solid fa-eye"></i>
                            </button>
                        `;
                    }
                }

                // RE-03: recalcula los contadores del dashboard
                recalcularContadoresDashboard();
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

// RE-11: Función para aprobar o rechazar reseña directamente
function aprobarRechazar(reviewId, newStatusId) {
    const modal = document.getElementById('confirmationDialog');
    modal.setAttribute('data-review-id', reviewId);
    modal.setAttribute('data-new-status', newStatusId);
    modal.showModal();
}

// RE-05: Función para abrir modal de detalles
function verDetalle(reviewId) {
    const fila = document.querySelector(`tr[data-review-id="${reviewId}"]`);
    if (!fila) return;
    
    // Obtener datos de la fila
    const cliente = fila.dataset.cliente;
    const empresa = fila.dataset.empresa;
    const desarrollador = fila.dataset.desarrollador;
    const comentario = fila.dataset.comentario;
    const rating = fila.dataset.rating;
    const estado = fila.dataset.status;
    const fecha = fila.dataset.date;
    
    // Llenar el modal con los datos
    document.getElementById('detalleCliente').textContent = cliente;
    document.getElementById('detalleEmpresa').textContent = empresa;
    document.getElementById('detalleDesarrollador').textContent = desarrollador;
    document.getElementById('detalleFecha').textContent = fecha ? new Date(fecha).toLocaleDateString('es-ES') : 'No especificada';
    document.getElementById('detalleEstado').innerHTML = `<span class="chip chip-${estado.toLowerCase()}">${estado}</span>`;
    
    // Calificación con estrellas
    let estrellasHTML = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            estrellasHTML += '<i class="fa-solid fa-star" style="color: #ffc107;"></i>';
        } else {
            estrellasHTML += '<i class="fa-regular fa-star" style="color: #ffc107;"></i>';
        }
    }
    document.getElementById('detalleCalificacion').innerHTML = estrellasHTML;
    
    // Comentario
    document.getElementById('detalleComentario').textContent = comentario || 'Sin comentario';
    
    // Abrir modal
    document.getElementById('detalleModal').showModal();
}

// RE-05: Cerrar modal de detalles
function cerrarDetalle() {
    document.getElementById('detalleModal').close();
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