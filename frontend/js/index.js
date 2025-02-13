    document.addEventListener('DOMContentLoaded', function () {
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
                    profilesColumn.innerHTML = '';

                    data.profiles.forEach((profile, index) => {
                        const isEven = index % 2 === 0;
                        const profileSection = document.createElement('div');
                        profileSection.className = 'profile-section';
                        
                        profileSection.innerHTML = `
                            ${isEven ? `
                                <div class="profile-image-container">
                                    <img src="${profile.imagen}" alt="${profile.name}">
                                </div>
                                <div class="profile-text-container">
                                    <h2>${profile.name}</h2>
                                    <p>${profile.phrase}</p>
                                    <p>${profile.description}</p>
                                    <a href="/Gen10_Perfiles_web/frontend/perfiles/profile-template.html?id=${profile.id}" class="perfil">Ver Perfil</a>
                                </div>
                            ` : `
                                <div class="profile-text-container">
                                    <h2>${profile.name}</h2>
                                    <p>${profile.phrase}</p>
                                    <p>${profile.description}</p>
                                    <a href="/frontend/perfiles/profile-template.html?id=${profile.id}" class="perfil">Ver Perfil</a>
                                </div>
                                <div class="profile-image-container">
                                    <img src="${profile.image || './assets/img/default-profile.png'}" alt="${profile.name}">
                                </div>
                            `}
                        `;
                        
                        profilesColumn.appendChild(profileSection);
                    });
                } else {
                    console.error('No se pudieron obtener los perfiles:', data.message);
                }
            })
            .catch(error => console.error('Error al obtener perfiles:', error));
    });
