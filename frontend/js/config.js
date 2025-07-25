window.API_URL = (window.location.hostname === 'localhost' || 
  window.location.hostname === '127.0.0.1')
? 'http://localhost/Gen10_Perfiles_web/'
: 'https://kreative.alphadocere.cl';



window.API_URL_PHP = (window.location.hostname === 'localhost' || 
  window.location.hostname === '127.0.0.1')
? 'http://localhost/Gen10_Perfiles_web/backend/'
: 'https://kreative.alphadocere.cl/backend/';

document.addEventListener("DOMContentLoaded", async () => {
  const perfilLink = document.getElementById("perfil-link");

  if (!perfilLink) return; // Si el botón no existe, salir

  perfilLink.style.display = "none"; // Ocultar por defecto

  const email = localStorage.getItem("userEmail") || sessionStorage.getItem("userEmail");
  if (!email) return; // No hay sesión iniciada

  try {
    const apiUrl = window.API_URL_PHP || "http://localhost/Gen10_Perfiles_web/backend/";
    const response = await fetch(`${apiUrl}read_profile_by_email.php?email=${encodeURIComponent(email)}`);
    const result = await response.json();

    if (result.success && result.profile) {
      perfilLink.href = `frontend/perfiles/profile-template.php?id=${result.profile.id}`;
      perfilLink.style.display = "block"; // Mostrar si todo está correcto
    }
  } catch (error) {
    console.error("Error al buscar perfil:", error);
  }
});
