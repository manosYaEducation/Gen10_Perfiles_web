const isLocalEnvironment =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

// OPCIÓN 1: Si tus archivos PHP están en XAMPP
// Estás configurando API_URL_PHP dos veces con valores diferentes
window.API_URL_PHP = isLocalEnvironment
  ? "http://localhost/Gen10_Perfiles_web/backend/"
  : "https://kreative.alphadocere.cl/backend/";

window.API_URL_PHP = isLocalEnvironment
  ? "http://localhost:3000/backend/"
  : "https://kreative.alphadocere.cl/backend/";

console.log("Entorno:", isLocalEnvironment ? "local" : "producción");
console.log("API URL:", window.API_URL_PHP);
