// Función para cerrar sesión (solo se ejecuta cuando el usuario hace clic)
function cerrarSesion() {
  console.log("Cerrando sesión manualmente...");

  // Limpiar localStorage
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("userName");
  localStorage.removeItem("username");
  localStorage.removeItem("userLoggedIn");
  // NO usar localStorage.clear() ya que podría eliminar otras configuraciones importantes

  // También limpiar sessionStorage para mayor seguridad
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("user");
  sessionStorage.removeItem("userName");
  sessionStorage.removeItem("username");
  sessionStorage.removeItem("userLoggedIn");

  // Redirigir a la página principal
  const currentPath = window.location.pathname;
  console.log("Ruta actual:", currentPath);

  if (currentPath.includes("/frontend/")) {
    window.location.href = "../index.html";
  } else {
    window.location.href = "index.html";
  }
}

// NO añadir eventos automáticamente - confiar en el atributo onclick del HTML
