document.addEventListener('DOMContentLoaded', function() {
    fetch('/LINK A PHP')
        .then(response => response.json())
        .then(data => {
            const profilesColumn = document.querySelector('.profiles-column');
            profilesColumn.innerHTML = ''; 

            data.forEach(profile => {
                const profileCard = document.createElement('div');
                profileCard.classList.add('profile-card');
                
                // Check if the necessary profile properties exist before rendering
                const profileName = profile.name || 'Nombre no disponible';
                const profileDescription = profile.description || 'Descripción no disponible';
                const profileId = profile.id ? profile.id : null;

                profileCard.innerHTML = `
                    <div class="profile-content">
                        <h2>${profileName}</h2>
                        <p class="profile-paragraph">${profileDescription}</p>
                        ${profileId ? `<a href="/frontend/perfiles/profile-template.html?id=${profileId}" class="button-link">Perfil</a>` : ''}
                        ${profileId ? `<button class="button-borrar" data-id="${profileId}">Borrar</button>` : ''}
                    </div>
                `;
                
                profilesColumn.appendChild(profileCard);
            });
        })
        .catch(error => console.error('Error al obtener perfiles:', error));
});


// TODO : Agregar link de php 
// Falta la imagen 
// Falta el boton de borrar (revisar) 
// Agregar quote y position al formulario de creación 
// Falta crear nueva tabla.  <p class="profiles-paragraph">${profile.quote}</p>  - <h3 class="profile-subtitle">${profile.position}</h3>