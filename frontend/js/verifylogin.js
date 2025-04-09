window.onload = function() {
  const userLoggedIn = sessionStorage.getItem('userLoggedIn');
  const estaLogueadoLocal = localStorage.getItem('userLoggedIn');
  const token = sessionStorage.getItem('token') || localStorage.getItem('token');
  
  if (!userLoggedIn && !estaLogueadoLocal || !token) {
    window.location.href = 'login.html'; 
    // console.log('me de volvio')
  }
}

function obtenerUsuario() {
  return sessionStorage.getItem('userName') || localStorage.getItem('userName') || 
         sessionStorage.getItem('username') || localStorage.getItem('username');
}

function obtenerToken() {
  return sessionStorage.getItem('token') || localStorage.getItem('token');
}