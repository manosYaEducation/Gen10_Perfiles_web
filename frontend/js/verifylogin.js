window.onload = function() {
    const userLoggedIn = sessionStorage.getItem('userLoggedIn');
    const estaLogueadoLocal = localStorage.getItem('userLoggedIn');
    
    if (!userLoggedIn && !estaLogueadoLocal) {
      window.location.href = 'login.html'; 
    }
  }

  function obtenerUsuario() {
    return sessionStorage.getItem('username') || localStorage.getItem('username');
}


