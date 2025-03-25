// Script para verificar si el usuario ha iniciado sesión correctamente
window.onload = function () {
  console.log("Verificando sesión...");

  // Verificar si existe un token JWT (usado en tu nuevo sistema de login)
  const jwtToken =
    sessionStorage.getItem("jwt_token") || localStorage.getItem("jwt_token");

  // Verificar también el sistema anterior (userLoggedIn)
  const userLoggedIn =
    sessionStorage.getItem("userLoggedIn") ||
    localStorage.getItem("userLoggedIn");

  // Obtener la página actual
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  console.log("Página actual:", currentPage);

  // Lista de páginas públicas que no requieren autenticación
  const publicPages = ["login.html", "register.html", "index.html", ""];

  // Si estamos en una página pública, no redirigir aunque no haya sesión
  if (publicPages.includes(currentPage)) {
    console.log("Página pública, no se requiere verificación de sesión");
    return;
  }

  // Si no hay token JWT ni userLoggedIn, redirigir al login
  if (!jwtToken && !userLoggedIn) {
    console.log("No se detectó sesión activa, redirigiendo a login");
    window.location.href = "../frontend/login.html";
  } else {
    console.log("Sesión activa detectada");

    // Si estamos en login.html pero ya hay sesión, redirigir a la página adecuada
    if (currentPage === "login.html") {
      // Determinar a dónde redirigir según el tipo de usuario
      const userType =
        sessionStorage.getItem("user_type") ||
        localStorage.getItem("user_type");

      if (userType === "admin") {
        window.location.href = "../frontend/index-admin.html";
      } else if (userType === "client") {
        window.location.href = "../frontend/client-dashboard.html";
      } else {
        // Si no hay tipo definido, usar página por defecto
        window.location.href = "../frontend/index-admin.html";
      }
    }
  }
};

// Función para obtener el nombre de usuario (mantener compatibilidad)
function obtenerUsuario() {
  // Intentar primero con el nuevo sistema
  const userEmail =
    sessionStorage.getItem("user_email") || localStorage.getItem("user_email");

  // Si no está disponible, usar el sistema anterior
  const username =
    sessionStorage.getItem("username") || localStorage.getItem("username");

  return userEmail || username || "Usuario";
}
