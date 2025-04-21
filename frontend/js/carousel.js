document.addEventListener("DOMContentLoaded", function () {
  // Verificar que la API_URL_PHP esté correctamente configurada
  if (!window.API_URL_PHP) {
    console.error("API_URL_PHP no está definida");
    return;
  }

  // Variables de carrusel
  const carousel = document.getElementById("profilesCarousel");
  const prevButton = document.getElementById("prevButton");
  const nextButton = document.getElementById("nextButton");
  const indicators = document.getElementById("carouselIndicators");
  
  // Verificar que los elementos del carrusel existan
  if (!carousel || !prevButton || !nextButton || !indicators) {
    console.error("Elementos del carrusel no encontrados");
    return;
  }

  let currentIndex = 0;
  let profiles = [];
  let cardsPerView = 4; // Mostrar 4 tarjetas por vista por defecto
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
      cardsPerView = 4;
    }
    if (profiles.length > 0) {
      updateCarousel();
    }
  }

  // Escuchar cambios en el tamaño de la ventana
  window.addEventListener('resize', updateCardsPerView);

  // Realiza una solicitud para obtener todos los perfiles desde el endpoint configurado
  fetch(`${window.API_URL_PHP}read_user.php`)
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        profiles = data.profiles;
        renderProfiles();
        updateCardsPerView(); // Inicializar cardsPerView después de renderizar
        updateCarousel();
      } else {
        console.error("No se pudieron obtener los perfiles:", data.message);
      }
    })
    .catch((error) => console.error("Error al obtener perfiles:", error));

  function renderProfiles() {
    if (!carousel) return;
    
    carousel.innerHTML = "";
    profiles.forEach((profile) => {
      const profileCard = document.createElement("div");
      profileCard.className = "profile-card";
      profileCard.innerHTML = `
        <div class="profile-image-container">
          <img src="${profile.image || "./assets/img/default-profile.png"}" alt="${profile.name}">
        </div>
        <div class="profile-text-container">
          <h2>${profile.name}</h2>
          <p>${profile.phrase}</p>
          <p>${profile.description}</p>
          <a href="./frontend/perfiles/profile-template.php?id=${profile.id}" class="perfil">Ver Perfil</a>
        </div>
      `;
      carousel.appendChild(profileCard);
    });

    // Crear indicadores
    if (!indicators) return;
    
    indicators.innerHTML = "";
    const totalSlides = Math.ceil(profiles.length / cardsPerView);
    for (let i = 0; i < totalSlides; i++) {
      const indicator = document.createElement("div");
      indicator.className = `indicator ${i === 0 ? "active" : ""}`;
      indicator.addEventListener("click", () => goToSlide(i));
      indicators.appendChild(indicator);
    }
  }

  function updateCarousel() {
    if (!carousel) return;
    
    const firstCard = carousel.querySelector(".profile-card");
    if (!firstCard) return;
    
    const cardWidth = firstCard.offsetWidth;
    const gap = 20; // Gap entre tarjetas
    const totalWidth = (cardWidth + gap) * cardsPerView;
    
    // Asegurarse de que currentIndex no exceda el máximo
    const maxIndex = Math.ceil(profiles.length / cardsPerView) - 1;
    if (currentIndex > maxIndex) {
      currentIndex = maxIndex;
    }
    
    currentTranslate = -currentIndex * totalWidth;
    carousel.style.transform = `translateX(${currentTranslate}px)`;
    
    // Update indicators
    const indicatorElements = document.querySelectorAll(".indicator");
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
    }, 300);
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
    }, 300);
  });

  nextButton.addEventListener("click", () => {
    if (isAnimating) return;
    
    isAnimating = true;
    const maxIndex = Math.ceil(profiles.length / cardsPerView) - 1;
    if (currentIndex < maxIndex) {
      currentIndex++;
      updateCarousel();
    }
    
    setTimeout(() => {
      isAnimating = false;
    }, 300);
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
    }, { passive: true });

    carousel.addEventListener("touchmove", (e) => {
      if (!isDragging) return;
      
      const currentX = e.touches[0].clientX;
      const diff = currentX - touchStartX;
      
      // Calcular la nueva posición del carrusel
      const firstCard = carousel.querySelector(".profile-card");
      if (!firstCard) return;
      
      const cardWidth = firstCard.offsetWidth;
      const gap = 20;
      const totalWidth = (cardWidth + gap) * cardsPerView;
      const baseTranslate = -currentIndex * totalWidth;
      
      // Aplicar la transformación con el arrastre usando requestAnimationFrame
      animationFrameId = requestAnimationFrame(() => {
        carousel.style.transform = `translateX(${baseTranslate + diff}px)`;
      });
    }, { passive: true });

    carousel.addEventListener("touchend", (e) => {
      if (!isDragging) return;
      
      isDragging = false;
      touchEndX = e.changedTouches[0].clientX;
      
      // Restaurar la transición
      carousel.style.transition = "transform 0.3s ease-out";
      
      handleSwipe();
    }, { passive: true });
  }

  function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // Swipe left
        const maxIndex = Math.ceil(profiles.length / cardsPerView) - 1;
        if (currentIndex < maxIndex) {
          currentIndex++;
          updateCarousel();
        }
      } else {
        // Swipe right
        if (currentIndex > 0) {
          currentIndex--;
          updateCarousel();
        }
      }
    } else {
      // Si el swipe no fue suficiente, volver a la posición actual
      updateCarousel();
    }
  }
}); 