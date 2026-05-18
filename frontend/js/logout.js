// Función para cerrar sesión
<<<<<<< HEAD
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
=======
function cerrarSesion() {
  const ejecutarLogout = () => {
    console.log("Cerrando sesión...");

    // Limpiar localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userName");
    localStorage.removeItem("username");
    localStorage.removeItem("userLoggedIn");

    // También limpiar sessionStorage para mayor seguridad
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("userName");
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("userLoggedIn");

    // Redirigir dependiendo de la página actual
    const currentPath = window.location.pathname;
    console.log("Ruta actual:", currentPath);

    // Si estamos en index.html (página principal), solo recargar la página
    if (
      currentPath.endsWith("index.html") ||
      currentPath === "/" ||
      currentPath.endsWith("/")
    ) {
      window.location.reload();
    }
    // Si estamos en alguna subpágina dentro de frontend
    else if (currentPath.includes("/frontend/")) {
      window.location.href = "../index.html";
    }
    // Cualquier otro caso
    else {
      window.location.href = "index.html";
    }
  };

  const mostrarModal = () => {
    const isDarkMode = document.body.classList.contains('dark-mode');

    Swal.fire({
      title: '¿Cerrar sesión?',
      text: '¿Estás seguro de que deseas cerrar tu sesión actual?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4CAF50',
      cancelButtonColor: isDarkMode ? '#444' : '#d33',
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar',
      background: isDarkMode ? '#1e1e1e' : '#fff',
      color: isDarkMode ? '#e0e0e0' : '#545454',
      customClass: {
        popup: 'kreative-swal-popup'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        ejecutarLogout();
      }
    });
  };

  if (typeof Swal !== 'undefined') {
    mostrarModal();
  }
  else {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/sweetalert2@11';
    script.onload = mostrarModal;
    document.head.appendChild(script);
>>>>>>> Fix/Mnavarro/2026-05-14-confirmacion-logout
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
