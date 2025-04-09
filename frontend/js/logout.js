// Función para cerrar sesión
function cerrarSesion() {
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
}

// Función para inicializar los botones de cerrar sesión
function initLogoutButtons() {
  console.log("Inicializando botones de logout");

  // 1. Buscar botones que ya tengan el atributo onclick="cerrarSesion()"

  // 2. Buscar enlaces con clase button-53 que contengan "Cerrar sesión" o "cerrar sesión"
  const logoutLinks = document.querySelectorAll(
    "a.button-53, .dropdown-content a"
  );

  logoutLinks.forEach((link) => {
    const text = link.textContent.trim();
    if (
      text.toLowerCase().includes("cerrar sesión") ||
      text.toLowerCase().includes("cerrar sesion")
    ) {
      console.log("Encontrado botón de logout:", text);

      // Si no tiene ya un atributo onclick
      if (!link.hasAttribute("onclick")) {
        link.addEventListener("click", function (e) {
          console.log("Logout link clicked");
          e.preventDefault();
          cerrarSesion();
        });
      }
    }
  });

  // 3. Buscar específicamente en el menú desplegable de index.html
  const dropdownLogoutBtn = document.querySelector(
    ".dropdown-content .button-53"
  );
  if (dropdownLogoutBtn) {
    console.log("Encontrado botón de logout en dropdown");

    if (!dropdownLogoutBtn.hasAttribute("onclick")) {
      dropdownLogoutBtn.addEventListener("click", function (e) {
        console.log("Dropdown logout button clicked");
        e.preventDefault();
        cerrarSesion();
      });
    }
  }
}

// Inicializar cuando el DOM esté cargado
if (
  document.readyState === "complete" ||
  document.readyState === "interactive"
) {
  initLogoutButtons();
} else {
  document.addEventListener("DOMContentLoaded", initLogoutButtons);
}

// Como medida adicional para asegurar que funcione con elementos cargados dinámicamente
setTimeout(initLogoutButtons, 500);
