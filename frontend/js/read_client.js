document.addEventListener("DOMContentLoaded", async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    if (!window.API_URL_PHP) {
        console.error('API_URL_PHP no está definida');
        return;
    }

    // Si hay ID → mostrar perfil individual
    if (id) {
        try {
            const response = await fetch(`${window.API_URL_PHP}read_client.php?id=${id}`);
            const result = await response.json();

            if (!result.success) {
                console.error('Error al obtener el cliente:', result.message);
                return;
            }

            const client = result.data;

            if (client.image) {
                const imageElement = document.getElementById('profile_image');
                if (imageElement) imageElement.src = client.image;
            }

            const nameElement = document.getElementById('name-hero');
            if (nameElement) nameElement.textContent = client.basic.name;

            // Información personal
            // const infoElement = document.getElementById('personal-information-hero');
            // if (infoElement) {
            //     infoElement.innerHTML = `
            //         <p><strong>Empresa:</strong> ${client.basic.company || 'No disponible'}</p>
            //         <p><strong>Email:</strong> ${client.basic.email || 'No disponible'}</p>
            //         <p><strong>Teléfono:</strong> ${client.basic.phone || 'No disponible'}</p>
            //         <p><strong>Ubicación:</strong> ${client.basic.location || 'No disponible'}</p>
            //     `;
            // }

            // Descripción
            const descElement = document.getElementById('description-hero');
            if (descElement) descElement.textContent = client.basic.description || '';

            // Empresa
            const expSection = document.getElementById('experience-section');
            if (expSection) {
                expSection.innerHTML = `
                    <div class="experience-sub-section">
                        <h3 class="experience-sub-title">${client.basic.company || 'Empresa no disponible'}</h3>
                    </div>
                `;
            }

            // Correo
            const correoElement = document.getElementById('p-interest-section');
            if (correoElement) correoElement.textContent = client.basic.email || 'Correo no disponible';

            // Ubicación
            const ubicacionElement = document.getElementById('p-skill-section');
            if (ubicacionElement) ubicacionElement.textContent = client.basic.location || 'Ubicación no disponible';

            // Teléfono
            const telefonoElement = document.getElementById('social-links');
            if (telefonoElement) telefonoElement.textContent = client.basic.phone || 'Teléfono no disponible';

        } catch (error) {
            console.error("Error al obtener los datos del cliente:", error);
        }
        return;
    }
    // Si no hay ID → mostrar lista de clientes  
fetch(`${window.API_URL_PHP}read_client.php`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const clientContent = document.querySelector('.client-content');
                // Limpiar solo los clientes, manteniendo el botón "Agregar cliente"
                const addButton = clientContent.querySelector('.create-profile');
                clientContent.innerHTML = '';
                if (addButton) {
                    clientContent.appendChild(addButton);
                }

                // Crear contenedor para las tarjetas de clientes
                const clientsContainer = document.createElement('div');
                clientsContainer.className = 'clients-container';

                // Mostrar todos los clientes
                data.clients.forEach(client => {
                    const clientCard = document.createElement('div');
                    clientCard.classList.add('client-card');
                    clientCard.innerHTML = `
                        <div class="client-info">
                            <div class="client-image">
                                <img src="${client.image || 'data:image/png;base64,DEFAULT_BASE64_IMAGE'}" alt="${client.name}">
                            </div>
                            <h2>${client.name}</h2>
                            <h3 class="client-company">${client.company}</h3>
                            <div class="client-actions">
                                <a href="./clientes/client-template.html?id=${client.id}" class="button-link">Ver</a>
                                <button class="buttonActualizar" data-id="${client.id}" onclick="redirectToUpdateClient(${client.id})">Actualizar</button>
                                <button class="buttonBorrar" data-id="${client.id}" onclick="deleteClient(event)">Borrar</button>
                            </div>
                        </div>
                    `;
                    clientsContainer.appendChild(clientCard);
                });

                clientContent.appendChild(clientsContainer);
            } else {
                console.error('No se pudieron obtener los clientes:', data.message);
            }
        })
        .catch(error => console.error('Error al obtener clientes:', error));
});

// Funciones auxiliares (similares a las de perfiles)
function redirectToUpdateClient(id) {
    window.location.href = `update-client.html?id=${id}`;
}

function deleteClient(event) {
    const clientId = event.target.getAttribute('data-id');
    if (confirm('¿Estás seguro de eliminar este cliente?')) {
        fetch(`${window.API_URL_PHP}delete_client.php?id=${clientId}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                // Recargar la lista de clientes
                    window.location.reload();
                } else {
                    console.error('Error al eliminar:', data.message);
                }
            })
            .catch(error => console.error('Error:', error));
    }
}