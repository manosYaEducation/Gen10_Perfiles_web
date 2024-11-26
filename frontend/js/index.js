document.addEventListener('DOMContentLoaded', function() {
    // Realiza una solicitud para obtener todos los perfiles desde el mismo endpoint
    fetch('http://localhost:8000/read_user.php')
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
                            <h2>${profile.name}</h2>
                            <h3 class="profile-subtitle">${profile.description}</h3>
                            <a href="/frontend/perfiles/profile-template.html?id=${profile.id}" class="button-link">Perfil</a>
                        </div>
                    `;
                    
                    profilesColumn.appendChild(profileCard);
                });
            } else {
                console.error('No se pudieron obtener los perfiles:', data.message);
            }
        })
        .catch(error => console.error('Error al obtener perfiles:', error));
});

// document.getElementById("inicio").addEventListener("click", function(event) {
//     event.preventDefault(); 
//     location.reload(); 
//   });


// TODO : Agregar link de php 
// Falta la imagen 
// Falta el boton de borrar (revisar) 
// Agregar quote y position al formulario de creación 
// Falta crear nueva tabla.  