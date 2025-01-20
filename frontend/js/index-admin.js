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
    /* .then(response => console.log(response)) */
    .then(response => response.json())
    /* .then(data => console.log(data))  */
    .then(data => {
        if (data.success){
    /*      const profilesColumn = document.querySelector('.profiles-column');
            profilesColumn.innerHTML = ''; // Limpiar la columna antes de agregar los perfiles
            // Mostrar todos los perfiles
            data.review.forEach(review => {
                const profileCard = document.createElement('div');
                profileCard.classList.add('review-card');
                profileCard.innerHTML = `
                     <div class="review-content">
                        <h2>${review.nameClient}</h2>
            
                    </div>
                `;
                profilesColumn.appendChild(profileCard);
            });      */
    
            
        const reviewsColumn = document.querySelector('.reviews-column');
        reviewsColumn.innerHTML = ''; // Limpiar la columna antes de agregar los perfiles
 
        data.data.reviews.forEach(review => {
            const reviewCard = document.createElement('div');
            reviewCard.classList.add('review-card');
            const numberRating = review.rating;
            reviewCard.innerHTML = `
            <div class="review-content">
        <div>
            <h2>${review.nameClient}
            <span class="company">${review.company}</span></h2>
            <h3>Para: ${review.nombre_perfil}</h3>
            <h2 id="numberRating">${review.rating}</h2>
            <div id="imgRating"></div>
            <br>
        </div>
        <div>
            <h3 class="review-comments">${review.comments}</h3>
        </div>
        <div class="review-status">
            <h4>Estado de la reseña</h4>
            <select id="review-status-${review.id}" onchange="updateReview(${review.id})">
                <option value="1" ${review.estado_reseña === 'pendiente' ? 'selected' : ''}>Pendiente</option>
                <option value="2" ${review.estado_reseña === 'aprobada' ? 'selected' : ''}>Aprobada</option>
                <option value="3" ${review.estado_reseña === 'rechazada' ? 'selected' : ''}>Rechazada</option>
            </select>
        <h4>${review.estado_reseña}</h4>
        </div>
    </div>
       `;

        const imgRatingContainer = reviewCard.querySelector('#imgRating');

  for (let i = 0; i < numberRating; i++) {
    const estrella = document.createElement('img');
    estrella.src = "../assets/img/star.png"; // URL de la estrella
    estrella.alt = "Estrella";
    imgRatingContainer.appendChild(estrella); // Añadir cada estrella al contenedor
  }

  // Finalmente, agregar el reviewCard al contenedor principal (app)
  document.getElementById('app').appendChild(reviewCard);

        })
        console.log(data)
/*         console.error('No se pudieron obtener los perfiles:'); */

    fetch(`${window.API_URL_PHP}update_review.php`)
    }
    else {
        /* console.error('No se pudieron obtener los perfiles:'); */
        console.log(data)
    }    
}) 

/*.then(data => {
    if (data.success) {
         const profilesColumn = document.querySelector('.review-column');
        profilesColumn.innerHTML = ''; // Limpiar la columna antes de agregar los perfiles
        // Mostrar todos los perfiles
        data.profiles.forEach(profile => {
            const reviewCard = document.createElement('div');
            reviewCard.classList.add('review-card');
            reviewCard.innerHTML = `
                 <div class="review-content">
                    <h2>${profile.name}</h2>
                    
                    <h3 class="profile-subtitle">${profile.phrase}</h3>

                </div>
            `;
            reviewColumn.appendChild(reviewCard);
        });
    console.log(data)
    } 
    else {
        console.error('No se pudieron obtener los perfiles:', data.message);
    }
}) */
.catch(error => console.error('Error al obtener reseñas:', error.message));

});

function redirectToUpdate(profileId) {
    window.location.href = `/frontend/actualizar-perfil.html?id=${profileId}`;
}

function updateReview(reviewId) {
    const selectElement = document.getElementById(`review-status-${reviewId}`);
    console.log('el id de la review es:'+reviewId)
    const selectedStatus = selectElement.value;
    console.log('el estado seleccionado es:'+selectedStatus)

    fetch(`${window.API_URL_PHP}update_review.php`, {
        method: 'PUT',
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

/* botones crud van en la linea 61 debajo del h3 */
/* <a href="/frontend/perfiles/profile-template.html?id=${profile.id}" class="button-link">Perfil</a>
<button class="buttonActualizar" data-id="${profile.id}" class="button-link" onclick="redirectToUpdate(${profile.id})">Actualizar</button>
<button class="buttonBorrar" data-id="${profile.id}" onclick="deleteUser(event)">Borrar</button> */


/* const reviewsSection = document.getElementById('p-adminReview-section'); 
const reviewsData = profile.review || [];
    reviewsSection.innerHTML = reviewsData.map(review => `
        <div class="review-card">
            <div class="review-header">
                <h3 class="review-name">${review.nameClient || 'Nombre no disponible'}</h3>
                <div class="review-company-info">
                    <p class="review-company">${review.company || 'Compañía no disponible'}</p>
                </div>
            </div>
            <div class="review-rating">
                <span class="rating">${review.rating || 'Rating no disponible'}</span> 
            </div>
            <div class="review-comments">
                <p>${review.comments || 'Comentarios no disponibles'}</p>
            </div>
       </div>
    `).join(''); */



/* fetch(`${window.API_URL_PHP}read_reviews.php`)
.then(response => response.json())
.then(data => {
    if (data.success) {
        const tbReviews = document.getElementById('tbReviews');
        tbReviews.innerHTML = ''; 

        data.reviews.forEach(review => {
            const row = document.createElement('tr');
            row.innerHTML = `
            <tr>
                <td>pa él</td>
                <td>${review.nameClient}</td>
                <td>${review.position}</td>
                <td>${review.company}</td>
                <td>${review.rating}</td>
                <td>${review.comment}</td>
                <td>vio</td>
            </tr>`;
            tbReviews.appendChild(row);
        });
    } else {
        console.error('No se pudieron obtener las reseñas:', data.message);
    }
}); */
/* .catch(error => console.error('Error al obtener reseñas:', error)); */
