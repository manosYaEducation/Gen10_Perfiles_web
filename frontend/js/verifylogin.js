window.onload = function() {
    const userLoggedIn = sessionStorage.getItem('userLoggedIn');
    
    if (!userLoggedIn) {
      window.location.href = `${window.API_URL}login.php`; // Redirige a login si no está logeado
    }
  }
  