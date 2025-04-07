const loginF = document.querySelector("form");
loginF.addEventListener("submit", async (event) => {
  event.preventDefault();
  const username = document.querySelector("#username").value;
  const password = document.querySelector("#password").value;
  const mantenerSesion = document.querySelector("#mantenerSesion").checked;

  if (!username || !password) {
    alert("Por favor ingresa ambos campos: usuario y contraseña.");
    return;
  }

  try {
    // Aquí cambiamos la URL del endpoint a la nueva dirección
    const response = await fetch("https://systemauth.alphadocere.cl/login.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: username,
        password: password,
      }),
    });

    const result = await response.json();
    console.log("Respuesta del servidor:", result);

    if (result.success === true) {
      console.log("Login exitoso");

      // Almacenar información del login
      if (mantenerSesion) {
        localStorage.setItem("userLoggedIn", "true");
        localStorage.setItem("username", username);
        localStorage.setItem("sessionPermanent", "true");
        
        // Almacenar datos adicionales del usuario si están disponibles
        if (result.token) {
          localStorage.setItem("token", result.token);
        }
        if (result.user) {
          localStorage.setItem("userId", result.user.id);
          localStorage.setItem("userEmail", result.user.email);
          localStorage.setItem("userName", result.user.nombre);
          localStorage.setItem("userCiudad", result.user.ciudad);
        }
      } else {
        sessionStorage.setItem("userLoggedIn", "true");
        sessionStorage.setItem("username", username);
        sessionStorage.setItem("sessionPermanent", "false");
        
        // También guardamos en localStorage como respaldo
        localStorage.setItem("userLoggedIn", "true");
        localStorage.setItem("username", username);
        localStorage.setItem("sessionPermanent", "false");
        
        // Almacenar datos adicionales del usuario si están disponibles
        if (result.token) {
          sessionStorage.setItem("token", result.token);
          localStorage.setItem("token", result.token);
        }
        if (result.user) {
          sessionStorage.setItem("userId", result.user.id);
          localStorage.setItem("userId", result.user.id);
          sessionStorage.setItem("userEmail", result.user.email);
          localStorage.setItem("userEmail", result.user.email);
          sessionStorage.setItem("userName", result.user.nombre);
          localStorage.setItem("userName", result.user.nombre);
          sessionStorage.setItem("userCiudad", result.user.ciudad);
          localStorage.setItem("userCiudad", result.user.ciudad);
        }
      }

      // Redirigir al usuario
      window.location.href = "../index.html";
    } else {
      alert(result.error || "Usuario o contraseña incorrectos.");
    }
  } catch (error) {
    console.error("Error completo:", error);
    alert("Hubo un error al procesar tu solicitud. Inténtalo nuevamente.");
  }
});