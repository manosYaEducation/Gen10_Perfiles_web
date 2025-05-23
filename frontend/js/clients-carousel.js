document.addEventListener("DOMContentLoaded", function () {
  // Verificar que la API_URL_PHP esté correctamente configurada
  if (!window.API_URL_PHP) {
    console.error("API_URL_PHP no está definida");
    return;
  }

  // Variables de carrusel de clientes
  const carousel = document.getElementById("clientsCarousel");
  const prevButton = document.getElementById("clientsPrevButton");
  const nextButton = document.getElementById("clientsNextButton");
  const indicators = document.getElementById("clientsCarouselIndicators");
  
  // Verificar que los elementos del carrusel existan
  if (!carousel || !prevButton || !nextButton || !indicators) {
    console.error("Elementos del carrusel de clientes no encontrados");
    return;
  }

  let currentIndex = 0;
  let clients = [];
  let cardsPerView = 3; // Mostrar 3 tarjetas por vista por defecto
  let isAnimating = false;
  let touchStartX = 0;
  let touchEndX = 0;
  let isDragging = false;
  let startTranslateX = 0;
  let currentTranslate = 0;
  let animationFrameId = null;

  // Ajustar el número de tarjetas visibles según el ancho de la pantalla
  function updateCardsPerView() {
    const width = window.innerWidth;
    if (width < 768) {
      cardsPerView = 1;
    } else if (width < 1024) {
      cardsPerView = 2;
    } else if (width < 1280) {
      cardsPerView = 3;
    } else {
      cardsPerView = 3;
    }
    if (clients.length > 0) {
      updateCarousel();
    }
  }

  // Escuchar cambios en el tamaño de la ventana
  window.addEventListener('resize', updateCardsPerView);

  // Realiza una solicitud para obtener todos los clientes desde el endpoint configurado
  fetch(`${window.API_URL_PHP}read_client.php`)
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        clients = data.clients;
        renderClients();
        updateCardsPerView(); // Inicializar cardsPerView después de renderizar
        updateCarousel();
        
        // Iniciar autoplay si hay más de un cliente
        if (clients.length > cardsPerView) {
          startAutoplay();
        }
      } else {
        console.error("No se pudieron obtener los clientes:", data.message);
      }
    })
    .catch((error) => console.error("Error al obtener clientes:", error));

  function renderClients() {
    if (!carousel) return;
    carousel.innerHTML = "";
    
    clients.forEach((client) => {
      const clientCard = document.createElement("div");
      clientCard.className = "profile-card";
      clientCard.innerHTML = `
        <div class="profile-content">
          <div class="profile-image">
            <img src="${client.image || "./assets/img/default-profile.png"}" alt="${client.name}">
          </div>
          <h2>${client.name}</h2>
          <h3 class="profile-subtitle">${client.company || ''}</h3>
          <a href="./frontend/client-template.html?id=${client.id}" class="button-link">Ver Perfil</a>
        </div>
      `;
      carousel.appendChild(clientCard);
    });

    // Crear indicadores
    if (!indicators) return;
    
    indicators.innerHTML = "";
    const totalSlides = Math.ceil(clients.length / cardsPerView);
    for (let i = 0; i < totalSlides; i++) {
      const indicator = document.createElement("div");
      indicator.className = `clients-indicator ${i === 0 ? "active" : ""}`;
      indicator.addEventListener("click", () => goToSlide(i));
      indicators.appendChild(indicator);
    }
  }

  function updateCarousel() {
    if (!carousel) return;
    
    const firstCard = carousel.querySelector(".profile-card");
    if (!firstCard) return;
    
    const cardWidth = firstCard.offsetWidth;
    const gap = 30; // Gap entre tarjetas (debe coincidir con el CSS)
    // Se calcula el ancho total de las tarjetas visibles (solo se aplica gap entre ellas)
    const totalWidth = cardWidth * cardsPerView + gap * (cardsPerView - 1);
    
    // Asegurarse de que currentIndex no exceda el máximo
    const maxIndex = Math.max(0, Math.ceil(clients.length / cardsPerView) - 1);
    if (currentIndex > maxIndex) {
      currentIndex = maxIndex;
    }
    
    currentTranslate = -currentIndex * totalWidth;
    carousel.style.transform = `translateX(${currentTranslate}px)`;
    
    // Update indicators
    const indicatorElements = document.querySelectorAll(".clients-indicator");
    indicatorElements.forEach((indicator, index) => {
      indicator.classList.toggle("active", index === currentIndex);
    });
    
    // Actualizar estado de los botones
    if (prevButton && nextButton) {
      prevButton.disabled = currentIndex === 0;
      nextButton.disabled = currentIndex === maxIndex;
      
      // Aplicar estilos visuales para botones deshabilitados
      prevButton.style.opacity = currentIndex === 0 ? "0.5" : "1";
      nextButton.style.opacity = currentIndex === maxIndex ? "0.5" : "1";
    }
  }

  function goToSlide(index) {
    if (isAnimating) return;
    
    isAnimating = true;
    currentIndex = index;
    updateCarousel();
    
    // Permitir la siguiente animación después de que termine la actual
    setTimeout(() => {
      isAnimating = false;
    }, 500); // Aumentado a 500ms para coincidir con la transición CSS
  }

  // Event listeners para los botones
  prevButton.addEventListener("click", () => {
    if (isAnimating) return;
    
    isAnimating = true;
    if (currentIndex > 0) {
      currentIndex--;
      updateCarousel();
    }
    
    setTimeout(() => {
      isAnimating = false;
    }, 500);
    
    // Detener autoplay al interactuar manualmente
    stopAutoplay();
  });

  nextButton.addEventListener("click", () => {
    if (isAnimating) return;
    
    isAnimating = true;
    const maxIndex = Math.max(0, Math.ceil(clients.length / cardsPerView) - 1);
    if (currentIndex < maxIndex) {
      currentIndex++;
      updateCarousel();
    }
    
    setTimeout(() => {
      isAnimating = false;
    }, 500);
    
    // Detener autoplay al interactuar manualmente
    stopAutoplay();
  });

  // Optimización del soporte táctil
  if (carousel) {
    carousel.addEventListener("touchstart", (e) => {
      touchStartX = e.touches[0].clientX;
      isDragging = true;
      
      // Guardar la posición actual del carrusel
      const transform = window.getComputedStyle(carousel).transform;
      const matrix = new DOMMatrix(transform);
      startTranslateX = matrix.m41;
      
      // Desactivar la transición durante el arrastre
      carousel.style.transition = "none";
      
      // Cancelar cualquier animación en curso
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      
      // Detener autoplay al interactuar manualmente
      stopAutoplay();
    }, { passive: true });

    carousel.addEventListener("touchmove", (e) => {
      if (!isDragging) return;
      
      const currentX = e.touches[0].clientX;
      const diffX = currentX - touchStartX;
      currentTranslate = startTranslateX + diffX;
      
      // Limitar el arrastre para que no se pueda arrastrar más allá de los límites
      const firstCard = carousel.querySelector(".profile-card");
      if (!firstCard) return;
      
      const cardWidth = firstCard.offsetWidth;
      const gap = 30;
      const totalWidth = cardWidth * cardsPerView + gap * (cardsPerView - 1);
      const maxIndex = Math.max(0, Math.ceil(clients.length / cardsPerView) - 1);
      const minTranslate = -maxIndex * totalWidth;
      
      if (currentTranslate > 0) {
        currentTranslate = 0;
      } else if (currentTranslate < minTranslate) {
        currentTranslate = minTranslate;
      }
      
      // Aplicar la transformación
      carousel.style.transform = `translateX(${currentTranslate}px)`;
    }, { passive: true });

    carousel.addEventListener("touchend", () => {
      if (!isDragging) return;
      
      isDragging = false;
      
      // Restaurar la transición
      carousel.style.transition = "transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)";
      
      // Calcular el índice más cercano basado en la posición actual
      const firstCard = carousel.querySelector(".profile-card");
      if (!firstCard) return;
      
      const cardWidth = firstCard.offsetWidth;
      const gap = 30;
      const totalWidth = cardWidth * cardsPerView + gap * (cardsPerView - 1);
      
      // Calcular el índice más cercano
      currentIndex = Math.round(Math.abs(currentTranslate) / totalWidth);
      
      // Asegurarse de que el índice esté dentro de los límites
      const maxIndex = Math.max(0, Math.ceil(clients.length / cardsPerView) - 1);
      if (currentIndex > maxIndex) {
        currentIndex = maxIndex;
      }
      
      updateCarousel();
    });

    // Prevenir el comportamiento predeterminado de arrastre en dispositivos móviles
    carousel.addEventListener("dragstart", (e) => {
      e.preventDefault();
    });
  }

  // Autoplay
  let autoplayInterval;
  
  function startAutoplay() {
    // Iniciar el autoplay solo si hay más de una página
    const maxIndex = Math.max(0, Math.ceil(clients.length / cardsPerView) - 1);
    if (maxIndex > 0) {
      autoplayInterval = setInterval(() => {
        if (!isAnimating) {
          isAnimating = true;
          currentIndex = (currentIndex + 1) % (maxIndex + 1);
          updateCarousel();
          setTimeout(() => {
            isAnimating = false;
          }, 500);
        }
      }, 5000); // Cambiar cada 5 segundos
    }
  }
  
  function stopAutoplay() {
    if (autoplayInterval) {
      clearInterval(autoplayInterval);
      autoplayInterval = null;
    }
  }
  
  // Detener autoplay cuando el usuario hace hover sobre el carrusel
  if (carousel) {
    carousel.addEventListener("mouseenter", stopAutoplay);
    carousel.addEventListener("mouseleave", startAutoplay);
  }
});
