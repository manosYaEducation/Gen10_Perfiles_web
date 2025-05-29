document.addEventListener('DOMContentLoaded', function() {
    console.log('Inicializando carrusel de clientes...');
    
    // Verificar que la API_URL_PHP esté correctamente configurada
    if (!window.API_URL_PHP) {
        console.error('API_URL_PHP no está definida');
        return;
    }
    console.log('API_URL_PHP:', window.API_URL_PHP);

    // Obtener el contenedor donde se mostrarán los clientes
    const clientsCarousel = document.getElementById('clientsCarousel');
    
    if (!clientsCarousel) {
        console.error('No se encontró el carrusel de clientes');
        return;
    }
    console.log('Contenedor del carrusel encontrado:', clientsCarousel);

    // Realizar la solicitud para obtener los clientes
    console.log('Realizando solicitud a:', `${window.API_URL_PHP}read_client.php`);
    fetch(`${window.API_URL_PHP}read_client.php`)
        .then(response => {
            console.log('Respuesta recibida:', response);
            return response.json();
        })
        .then(data => {
            console.log('Datos recibidos:', data);
            if (data.success) {
                // Limpiar el contenedor antes de agregar los clientes
                clientsCarousel.innerHTML = '';
                
                if (!data.clients || data.clients.length === 0) {
                    console.log('No hay clientes para mostrar');
                    clientsCarousel.innerHTML = '<p class="no-clients">No hay clientes disponibles en este momento.</p>';
                    return;
                }
                
                console.log(`Mostrando ${data.clients.length} clientes`);
                
                // Mostrar los clientes
                data.clients.forEach(client => {
                    const clientCard = document.createElement('div');
                    clientCard.classList.add('profile-card');
                    clientCard.innerHTML = `
                        <div class="profile-content">
                            <div class="profile-image">
                                <img src="${client.image || 'assets/img/default-profile.png'}" alt="${client.name}">
                            </div>
                            <h2 style="color: #000;">${client.name}</h2>
                            <h3 class="profile-subtitle" style="color: #000;">${client.company || ''}</h3>
                            <p class="profile-description">${client.description || ''}</p>
                        </div>
                    `;
                    clientsCarousel.appendChild(clientCard);
                });
                
                // Inicializar el carrusel después de cargar los clientes
                initializeClientsCarousel();
            } else {
                console.error('No se pudieron obtener los clientes:', data.message);
                clientsCarousel.innerHTML = '<p class="no-clients">No hay clientes disponibles en este momento.</p>';
            }
        })
        .catch(error => {
            console.error('Error al obtener clientes:', error);
            clientsCarousel.innerHTML = '<p class="no-clients">Error al cargar los clientes. Por favor, intente más tarde.</p>';
        });
        
    // Función para inicializar el carrusel de clientes
    function initializeClientsCarousel() {
        const clientCards = document.querySelectorAll('.profile-card');
        const prevButton = document.getElementById('clientsPrevButton');
        const nextButton = document.getElementById('clientsNextButton');
        const indicators = document.getElementById('clientsCarouselIndicators');
        
        if (clientCards.length === 0) return;
        
        let currentIndex = 0;
        const maxVisibleCards = window.innerWidth < 768 ? 1 : 3;
        
        // Crear indicadores
        indicators.innerHTML = '';
        for (let i = 0; i < clientCards.length; i++) {
            const indicator = document.createElement('div');
            indicator.classList.add('carousel-indicator');
            if (i === 0) indicator.classList.add('active');
            indicator.addEventListener('click', () => goToSlide(i));
            indicators.appendChild(indicator);
        }
        
        // Mostrar las tarjetas iniciales
        updateCarousel();
        
        // Configurar botones de navegación
        prevButton.addEventListener('click', () => {
            currentIndex = Math.max(0, currentIndex - 1);
            updateCarousel();
        });
        
        nextButton.addEventListener('click', () => {
            currentIndex = Math.min(clientCards.length - maxVisibleCards, currentIndex + 1);
            updateCarousel();
        });
        
        // Función para ir a una diapositiva específica
        function goToSlide(index) {
            currentIndex = Math.min(clientCards.length - maxVisibleCards, Math.max(0, index));
            updateCarousel();
        }
        
        // Actualizar la visualización del carrusel
        function updateCarousel() {
            clientCards.forEach((card, index) => {
                if (index >= currentIndex && index < currentIndex + maxVisibleCards) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
            
            // Actualizar indicadores
            const indicatorElements = indicators.querySelectorAll('.carousel-indicator');
            indicatorElements.forEach((indicator, index) => {
                if (index === currentIndex) {
                    indicator.classList.add('active');
                } else {
                    indicator.classList.remove('active');
                }
            });
            
            // Actualizar estado de los botones
            prevButton.disabled = currentIndex === 0;
            nextButton.disabled = currentIndex >= clientCards.length - maxVisibleCards;
        }
    }
});
