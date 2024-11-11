document.addEventListener('DOMContentLoaded', function() {
    // Realiza una solicitud para obtener todos los perfiles desde el mismo endpoint
    fetch('http://localhost:8000/read_user.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const profilesColumn = document.querySelector('.profiles-column');
                profilesColumn.innerHTML = ''; // Limpiar la columna antes de agregar los perfiles

<<<<<<< HEAD
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
=======
                // Mostrar todos los perfiles
                data.profiles.forEach(profile => {
                    const profileCard = document.createElement('div');
                    profileCard.classList.add('profile-card');
                    
                    profileCard.innerHTML = `
                        <div class="profile-content">
                            <h2>${profile.name}</h2>
                            <h3 class="profile-subtitle">${profile.description}</h3>
                            <a href="/frontend/perfiles/profile-template.html?id=${profile.id}" class="button-link">Perfil</a>
                            <button class="button-borrar" data-id="${profile.id}">Borrar</button>
                        </div>
                    `;
                    
                    profilesColumn.appendChild(profileCard);
                });
            } else {
                console.error('No se pudieron obtener los perfiles:', data.message);
            }
>>>>>>> Deploy/11-11
        })
        .catch(error => console.error('Error al obtener perfiles:', error));
});




// TODO : Agregar link de php 
// Falta la imagen 
// Falta el boton de borrar (revisar) 
// Agregar quote y position al formulario de creación 
// Falta crear nueva tabla.  