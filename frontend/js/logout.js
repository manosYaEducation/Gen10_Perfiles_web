function cerrarSesion() {
  // Limpiar tanto localStorage como sessionStorage
  localStorage.clear();
  sessionStorage.clear();
  
  // Redirigir a la página principal basándose en la ubicación actual
  // Determinar dinámicamente la ruta correcta
  const currentPath = window.location.pathname;
  
  if (currentPath.includes('/frontend/')) {
    // Si estamos en alguna página dentro de /frontend/
    window.location.href = "../index.html";
  } else {
    // Si estamos en la raíz u otra ubicación
    window.location.href = "index.html";
  }
}

document.addEventListener("DOMContentLoaded", function () {
  // Buscar todos los botones o enlaces que tengan la clase "button-53" o un atributo onclick con "cerrarSesion"
  const logoutButtons = document.querySelectorAll(".button-53, [onclick*='cerrarSesion']");
  
  if (logoutButtons.length > 0) {
    logoutButtons.forEach(button => {
      button.addEventListener("click", cerrarSesion);
    });
  } else {
    console.warn("No se encontraron botones de cierre de sesión en el DOM.");
  }
});