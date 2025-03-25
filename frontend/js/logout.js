document.addEventListener("DOMContentLoaded", function () {
  const logoutButton = document.querySelector(".button-53");
  // Verifica si el botón existe en el DOM antes de intentar agregar el eventListener
  if (logoutButton) {
    logoutButton.addEventListener("click", cerrarSesion);
  } else {
    console.warn("El botón de cerrar sesión no se encontró en el DOM.");
  }
});

function cerrarSesion() {
  console.log("Cerrando sesión...");

  try {
    // Limpiar variables específicas antes de limpiar todo
    // Sistema nuevo (login.js)
    const storageTypes = [sessionStorage, localStorage];

    storageTypes.forEach((storage) => {
      storage.removeItem("jwt_token");
      storage.removeItem("user_id");
      storage.removeItem("user_email");
      storage.removeItem("user_type");
      storage.removeItem("sessionPermanent");

      // Sistema antiguo
      storage.removeItem("userLoggedIn");
      storage.removeItem("username");
    });

    // Ahora limpiar todo el resto
    sessionStorage.clear();
    localStorage.clear();

    console.log("Sesión cerrada correctamente");
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
  }

  // Redirigir a la página principal
  window.location.href = "../index.html";
}
