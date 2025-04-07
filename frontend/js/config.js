// Detectar si estamos en entorno local
const isLocalEnvironment =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

// Configurar la URL de la API según el entorno
// Solo necesitamos una asignación, no dos
window.API_URL_PHP = isLocalEnvironment
  ? "http://localhost:3000/backend/"
  : "https://kreative.alphadocere.cl/backend/";

// Si necesitas una URL alternativa para XAMPP, puedes usar otra variable
// window.API_URL_XAMPP = isLocalEnvironment
//   ? "http://localhost/Gen10_Perfiles_web/backend/"
//   : "https://kreative.alphadocere.cl/backend/";

console.log("Entorno:", isLocalEnvironment ? "local" : "producción");
console.log("API URL:", window.API_URL_PHP);