// Función para cerrar sesión
function cerrarSesion(forzar = false) {
  if (!forzar) {
    if (!confirm("¿Estás seguro de que deseas cerrar sesión?")) {
      return; // El cuadro nativo se cierra solo al hacer Cancel
    }
  }

  // Limpiar localStorage y sessionStorage
  const keys = ["token", "user", "userName", "username", "userLoggedIn"];
  keys.forEach((k) => {
    localStorage.removeItem(k);
    sessionStorage.removeItem(k);
  });

  // Redirigir según la página actual
  const currentPath = window.location.pathname;

  if (
    currentPath.endsWith("index.html") ||
    currentPath === "/" ||
    currentPath.endsWith("/")
  ) {
    // Forzar recarga limpia evitando caché del navegador
    window.location.replace(window.location.origin + window.location.pathname);
  } else if (currentPath.includes("/frontend/")) {
    window.location.replace("../index.html");
  } else {
    window.location.replace("index.html");
  }
}

// Función para inicializar los botones de cerrar sesión
// Usa data-logout-bound para evitar registrar el listener más de una vez,
// aunque esta función se llame varias veces.
function initLogoutButtons() {
  const logoutLinks = document.querySelectorAll(
    "a.button-53, .dropdown-content a"
  );

  logoutLinks.forEach((link) => {
    const text = link.textContent.trim().toLowerCase();
    if (
      text.includes("cerrar sesión") ||
      text.includes("cerrar sesion")
    ) {
      if (!link.dataset.logoutBound) {
        link.dataset.logoutBound = "true";
        link.addEventListener("click", function (e) {
          e.preventDefault();
          cerrarSesion();
        });
      }
    }
  });

  // Asegurar también el botón específico del dropdown en index.html
  const dropdownLogoutBtn = document.querySelector(
    ".dropdown-content .button-53"
  );
  if (dropdownLogoutBtn && !dropdownLogoutBtn.dataset.logoutBound) {
    dropdownLogoutBtn.dataset.logoutBound = "true";
    dropdownLogoutBtn.addEventListener("click", function (e) {
      e.preventDefault();
      cerrarSesion();
    });
  }
}

// Inicializar una sola vez cuando el DOM esté listo
if (
  document.readyState === "complete" ||
  document.readyState === "interactive"
) {
  initLogoutButtons();
} else {
  document.addEventListener("DOMContentLoaded", initLogoutButtons);
}
