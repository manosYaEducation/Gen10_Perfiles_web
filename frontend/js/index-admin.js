document.addEventListener('DOMContentLoaded', function() {
    // Verificar que la API_URL_PHP esté correctamente configurada
    if (!window.API_URL_PHP) {
        console.error('API_URL_PHP no está definida');
        return;
    }
    // Realiza una solicitud para obtener todos los perfiles desde el endpoint configurado
    fetch(`${window.API_URL_PHP}read_user.php`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const profilesColumn = document.querySelector('.profiles-column');
                profilesColumn.innerHTML = ''; // Limpiar la columna antes de agregar los perfiles
                // Mostrar todos los perfiles
                data.profiles.forEach(profile => {
                    const profileCard = document.createElement('div');
                    profileCard.classList.add('profile-card');
                    profileCard.innerHTML = `
                         <div class="profile-content">
                          <div class="profile-image">
                                    <img src="${profile.image || 'data:image/png;base64,DEFAULT_BASE64_IMAGE'}" alt="${profile.name}">
                                </div>
                            <h2>${profile.name}</h2>
                            
                            <h3 class="profile-subtitle">${profile.phrase}</h3>
                            <a href="/frontend/perfiles/profile-template.html?id=${profile.id}" class="button-link">Perfil</a>
                            <button class="buttonActualizar" data-id="${profile.id}" class="button-link" onclick="redirectToUpdate(${profile.id})">Actualizar</button>
                            <button class="buttonBorrar" data-id="${profile.id}" onclick="deleteUser(event)">Borrar</button>
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
        if (data.success){

            data.data.reviews.forEach(review => {
                const reviewTable = document.createElement('tr');
                reviewTable.innerHTML = `
                    <td>${review.nameClient}</td>
                    <td>${review.nombre_perfil}</td>
                    <td>${review.company}</td>
                    <td>${review.comments}</td>
                    <td>
                        <div class="imgRating-${review.id}"></div>
                    </td>
                    <td>${review.estado_reseña}</td>
                    <td>
                        <select id="review-status-${review.id}" onchange="updateReview(${review.id})">
                            <option>Cambiar estado</option>
                            <option value="1" ${review.estado_reseña === 'pendiente' ? 'selected' : ''}>Pendiente</option>
                            <option value="2" ${review.estado_reseña === 'aprobada' ? 'selected' : ''}>Aprobada</option>
                            <option value="3" ${review.estado_reseña === 'rechazada' ? 'selected' : ''}>Rechazada</option>
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

    fetch(`${window.API_URL_PHP}update_review.php`)
    }
    else {
        console.log(data)
    }    
}) 

.catch(error => console.error('Error al obtener reseñas:', error.message));

});

function redirectToUpdate(profileId) {
    window.location.href = `/frontend/actualizar-perfil.html?id=${profileId}`;
}

function updateReview(reviewId) {
    const selectElement = document.getElementById(`review-status-${reviewId}`);
    const selectedStatus = selectElement.value;

    fetch(`${window.API_URL_PHP}update_review.php`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: reviewId,
            statusid: selectedStatus
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data)
        if (data.success) {
            console.log('Reseña actualizada correctamente');
        } else {
            console.error('Error al actualizar la reseña:', data.message);
        }
    })
    .catch(error => console.error('Error :', error));
}
