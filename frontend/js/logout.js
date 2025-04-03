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
  sessionStorage.clear();
  localStorage.clear();

  window.location.href = "./index.html";
}