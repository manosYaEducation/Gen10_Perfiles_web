// logout.js
document.addEventListener('DOMContentLoaded', function() {
    const logoutButton = document.querySelector('.button-53'); // O el selector correcto de tu botón de logout
    
    // Verifica si el botón existe en el DOM antes de intentar agregar el eventListener
    if (logoutButton) {
      logoutButton.addEventListener('click', logout);
    } else {
      console.warn('El botón de cerrar sesión no se encontró en el DOM.');
    }
  });
  
  function logout() {
    // Eliminar el estado de sesión
    sessionStorage.removeItem('userLoggedIn'); // o sessionStorage.setItem('userLoggedIn', false);
    
    // Redirigir al login
    window.location.href = 'login.html';
  }
  