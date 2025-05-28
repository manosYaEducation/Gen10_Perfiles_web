document.addEventListener("DOMContentLoaded", function () {
  // Verificar que la API_URL_PHP esté correctamente configurada
  if (!window.API_URL_PHP) {
    console.error("API_URL_PHP no está definida");
    return;
  }

  const menuIcon = document.getElementById("menu-icon");
  const navLinks = document.getElementById("nav-links");

  menuIcon.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });

  // Check login status for profile display
  checkLoginStatus();
});

function checkLoginStatus() {
  // Primero revisa localStorage (persistente)
  const lsLoggedIn = localStorage.getItem("userLoggedIn") === "true";
  // Después revisa sessionStorage (sesión actual)
  const ssLoggedIn = sessionStorage.getItem("userLoggedIn") === "true";

  // Usuario está logueado si cualquiera de los dos almacenamientos lo considera logueado
  const isLoggedIn = lsLoggedIn || ssLoggedIn;


  const loginContainer = document.getElementById("login-container");
  const profileContainer = document.getElementById("profile-container");

  if (!loginContainer || !profileContainer) return;

  if (isLoggedIn) {
    // User is logged in, show profile dropdown
    loginContainer.style.display = "none";
    profileContainer.style.display = "block";

    // Get username (primero de localStorage, luego de sessionStorage)
    const username =
      localStorage.getItem("username") ||
      sessionStorage.getItem("username") ||
      "Usuario";

    // Update profile name
    const profileName = document.getElementById("profile-name");
    if (profileName) {
      profileName.textContent = username;
    }
  } else {
    // Not logged in, show login button
    loginContainer.style.display = "block";
    profileContainer.style.display = "none";
  }
}

function logout() {
  // Clear stored data
  localStorage.removeItem("userLoggedIn");
  localStorage.removeItem("username");
  localStorage.removeItem("sessionPermanent");
  sessionStorage.removeItem("userLoggedIn");
  sessionStorage.removeItem("username");
  sessionStorage.removeItem("sessionPermanent");

  // Redirect to home page
  window.location.href = "/index.html";
}

// Agregar manejo de clics para el menú desplegable
document.addEventListener("DOMContentLoaded", function () {
  const profileBtn = document.getElementById("profile-btn");
  const dropdownContent = document.querySelector(".dropdown-content");

  if (profileBtn && dropdownContent) {
    // Alternar menú con clic
    profileBtn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      dropdownContent.classList.toggle("show");
      // Añadir efecto brillante verde al botón cuando está activo
      profileBtn.classList.toggle("profile-btn-active");
    });

    // Cerrar menú al hacer clic fuera
    document.addEventListener("click", function (e) {
      if (
        dropdownContent.classList.contains("show") &&
        !profileBtn.contains(e.target) &&
        !dropdownContent.contains(e.target)
      ) {
        dropdownContent.classList.remove("show");
        // Quitar efecto brillante verde cuando se cierra el menú
        profileBtn.classList.remove("profile-btn-active");
      }
    });

    // Prevenir cierre al hacer clic dentro del menú
    dropdownContent.addEventListener("click", function (e) {
      // Solo prevenir para clics que no sean en enlaces
      if (e.target.tagName !== "A") {
        e.stopPropagation();
      }
    });
  }
});

// FAQ Accordion
document.addEventListener('DOMContentLoaded', function() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });
});
