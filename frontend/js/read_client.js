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