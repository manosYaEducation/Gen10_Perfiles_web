window.onload = function() {
    const userLoggedIn = sessionStorage.getItem('userLoggedIn');
    
    if (!userLoggedIn) {
      window.location.href = 'login.html'; // Redirige a login si no está logeado
    }
  }
  