document.addEventListener('DOMContentLoaded', function() {
    console.log('Inicializando carrusel de clientes con datos estáticos...');
    
    // Obtener el contenedor donde se mostrarán los clientes
    const clientsCarousel = document.getElementById('clientsCarousel');
    
    if (!clientsCarousel) {
        console.error('No se encontró el carrusel de clientes');
        return;
    }
    
    // Datos de clientes de ejemplo
    const exampleClients = [
        {
            id: 1,
            name: 'Empresa ABC',
            company: 'Tecnología y Desarrollo',
            description: 'Desarrollo de aplicación web para gestión de inventario',
            image: './assets/img/default-profile.png'
        },
        {
            id: 2,
            name: 'Consultora XYZ',
            company: 'Consultoría Empresarial',
            description: 'Implementación de sistema de gestión de clientes',
            image: './assets/img/default-profile.png'
        },
        {
            id: 3,
            name: 'Tienda Online Shop',
            company: 'E-commerce',
            description: 'Desarrollo de tienda online con pasarela de pagos',
            image: './assets/img/default-profile.png'
        }
    ];
    
    // Limpiar el contenedor
    clientsCarousel.innerHTML = '';
    
    // Mostrar los clientes de ejemplo
    exampleClients.forEach(client => {
        const clientCard = document.createElement('div');
        clientCard.classList.add('profile-card');
        clientCard.innerHTML = `
            <div class="profile-content">
                <div class="profile-image">
                    <img src="${client.image}" alt="${client.name}">
                </div>
                <h2 style="color: #000;">${client.name}</h2>
                <h3 class="profile-subtitle" style="color: #000;">${client.company}</h3>
                <p class="profile-description">${client.description}</p>
            </div>
        `;
        clientsCarousel.appendChild(clientCard);
    });
    
    // Inicializar el carrusel
    initializeClientsCarousel();
    
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
