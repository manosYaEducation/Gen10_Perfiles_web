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
                    reviewTable.setAttribute('data-review-id', review.id);

                    reviewTable.innerHTML = `
                        <td class="td-medium" style="cursor: pointer; font-weight: bold; color: #2e7d32;" onclick="toggleReviewDetails(${review.id})">
                            <i class="fa-solid fa-chevron-right" id="icon-review-${review.id}" style="margin-right: 8px; transition: transform 0.3s;"></i>
                            ${review.nameClient}
                        </td>
                        <td class="td-medium">${review.nombre_perfil}</td>
                        <td class="status td-small" id="actualState">${review.estado_reseña}</td>
                    `;
                    tbReviews.appendChild(reviewTable);

                    const detailRow = document.createElement('tr');
                    detailRow.classList.add('review-detail-row');
                    detailRow.id = `detail-review-${review.id}`;
                    detailRow.style.display = 'none';
                    detailRow.innerHTML = `
                        <td colspan="3" style="padding: 15px 30px; background-color: #f9f9f9; text-align: left; border-bottom: 2px solid #ddd;">
                            <div style="margin-bottom: 8px;"><strong>Empresa:</strong> ${review.company}</div>
                            <div style="margin-bottom: 8px;"><strong>Comentario:</strong> ${review.comments}</div>
                            <div style="display: flex; align-items: center; gap: 5px; margin-bottom: 8px;">
                                <strong>Valoración:</strong> 
                                <div class="imgRating-${review.id}" style="display: flex;"></div>
                            </div>
                            <div>
                                <strong>Acciones:</strong>
                                <select id="review-status-${review.id}" onchange="changeStatus(${review.id})" style="padding: 4px; margin-left: 5px;">
                                    <option>Cambiar estado</option>
                                    <option value="1" ${review.estado_reseña === 'Pendiente' ? 'selected' : ''}>Pendiente</option>
                                    <option value="2" ${review.estado_reseña === 'Aprobada' ? 'selected' : ''}>Aprobada</option>
                                    <option value="3" ${review.estado_reseña === 'Rechazada' ? 'selected' : ''}>Rechazada</option>
                                </select>
                            </div>
                        </td>
                    `;
                    tbReviews.appendChild(detailRow);

                    // Agregar estrellas en la valoración
                    const imgRatingContainer = detailRow.querySelector(`.imgRating-${review.id}`);
                    const numberRating = review.rating;
                    // Se itera sobre el valor de la valoración para agregar las estrellas
                    for (let i = 0; i < numberRating; i++) {
                        const estrella = document.createElement('img');
                        // URL de la estrella
                        estrella.src = "../assets/img/star.png";
                        estrella.alt = "Estrella";
                        estrella.classList.add('rating');
                        imgRatingContainer.appendChild(estrella);
                    }
                });

                fetch(`${window.API_URL_PHP}update_review.php`)
            }
            else {
                console.log(data)
            }
        })

        .catch(error => console.error('Error al obtener reseñas:', error.message));

});
function filterReviews() {
    const filter = document.getElementById("filter-reviews").value;  // El valor del filtro seleccionado
    const rows = document.querySelectorAll("#tbReviews tr.review-row"); // Iterar solo las principales

    rows.forEach(row => {
        const statusCell = row.querySelector(".status"); 
        const reviewId = row.getAttribute('data-review-id');
        const detailRow = document.getElementById(`detail-review-${reviewId}`);

        if (statusCell) {
            const status = statusCell.textContent.trim();  
            if (filter === "todas" || status === filter) {
                row.style.display = "";  
            } else {
                row.style.display = "none";
                if(detailRow) detailRow.style.display = "none";
                const icon = document.getElementById(`icon-review-${reviewId}`);
                if(icon) icon.style.transform = 'rotate(0deg)';
            }
        }
    });
}

window.toggleReviewDetails = function(id) {
    const detailRow = document.getElementById(`detail-review-${id}`);
    const icon = document.getElementById(`icon-review-${id}`);
    if (detailRow.style.display === 'none') {
        detailRow.style.display = 'table-row';
        icon.style.transform = 'rotate(90deg)';
    } else {
        detailRow.style.display = 'none';
        icon.style.transform = 'rotate(0deg)';
    }
};

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