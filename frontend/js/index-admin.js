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


        // fetch(`${window.API_URL_PHP}read_reviews.php`)
        // .then(response => response.json())
        // .then(data => {
        //     if (data.success) {
        //         const tbReviews = document.getElementById('tbReviews');
        //         tbReviews.innerHTML = ''; 

        //         data.reviews.forEach(review => {
        //             const row = document.createElement('tr');
        //             row.innerHTML = `
        //             <tr>
        //                 <td>pa él</td>
        //                 <td>${review.nameClient}</td>
        //                 <td>${review.position}</td>
        //                 <td>${review.company}</td>
        //                 <td>${review.rating}</td>
        //                 <td>${review.comment}</td>
        //                 <td>vio</td>
        //             </tr>`;
        //             tbReviews.appendChild(row);
        //         });
        //     } else {
        //         console.error('No se pudieron obtener las reseñas:', data.message);
        //     }
        // })
        // .catch(error => console.error('Error al obtener reseñas:', error));
});

function redirectToUpdate(profileId) {
    window.location.href = `/frontend/actualizar-perfil.html?id=${profileId}`;
} 