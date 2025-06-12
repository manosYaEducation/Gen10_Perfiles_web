// timeout.js se encarga de cerrar la sesión del usuario debido a inactividad
// Funciona con localStorage y sessionStorage

const TIMEOUT = 30 * 60 * 1000; // ideal 20 ó 30 minutos EJ: 30 * 60 * 1000  - Testing con 10 segs
let logoutTimer;

function logoutPorInactividad() {
  alert("Sesión cerrada por inactividad.");
  cerrarSesion(); // Reutilizamos la función existente en logout.js
}

// Limpia el Timer y luego crea uno nuevo que ejecutará logoutPorInactividad cuando pase el tiempo indicado en const TIMEOUT
function resetearTemporizador() {
  clearTimeout(logoutTimer);
  logoutTimer = setTimeout(logoutPorInactividad, TIMEOUT);
}

// Se detecta la actividad del usuario al utilizar la página
// Se puede utilizar "mousemove" pero habría que utilizar un debounce para regular la frecuencia
// Un estándar mas óptimo es usar solo clic, keydown y scroll
["click", "keydown", "scroll"].forEach((evento) => {
  document.addEventListener(evento, resetearTemporizador);
});

// Se revisa si el usuario esta logeado, de no ser asi se redirige al login.html
if (localStorage.getItem("userLoggedIn") !== "true") {
  window.location.href = "../login.html";
}

resetearTemporizador();
