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
    const response = await fetch(API_URL_PHP + "login.php", {
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
    console.log("Respuesta del servidor:", result); // Log para ver la respuesta completa

    if (result.success === true) {
      console.log("Login exitoso");

      // Store login information
      // En login.js - al iniciar sesión con éxito
      if (mantenerSesion) {
        localStorage.setItem("userLoggedIn", "true");
        localStorage.setItem("username", username);
        localStorage.setItem("sessionPermanent", "true");

        // Store additional user data if available
        if (result.user_id) {
          localStorage.setItem("userId", result.user_id);
        }
        if (result.user_type) {
          localStorage.setItem("userType", result.user_type);
        }
        if (result.token) {
          localStorage.setItem("token", result.token);
        }
      } else {
        sessionStorage.setItem("userLoggedIn", "true");
        sessionStorage.setItem("username", username);
        sessionStorage.setItem("sessionPermanent", "false");

        // También guarda lo mismo en localStorage para respaldo
        localStorage.setItem("userLoggedIn", "true");
        localStorage.setItem("username", username);
        localStorage.setItem("sessionPermanent", "false");

        // Store additional user data if available
        if (result.user_id) {
          sessionStorage.setItem("userId", result.user_id);
          localStorage.setItem("userId", result.user_id);
        }
        if (result.user_type) {
          sessionStorage.setItem("userType", result.user_type);
          localStorage.setItem("userType", result.user_type);
        }
        if (result.token) {
          sessionStorage.setItem("token", result.token);
          localStorage.setItem("token", result.token);
        }
      }

      // Redirigir primero a la página principal para mostrar el perfil
      console.log("Redirigiendo a la página principal...");
      window.location.href = "../index.html";

      // Alternativa: Si prefieres ir directamente al admin, mantén esta línea y comenta la anterior
      // window.location.href = "index-admin.html";
    } else {
      alert(result.error || "Usuario o contraseña incorrectos.");
    }
  } catch (error) {
    console.error("Error completo:", error);
    alert("Hubo un error al procesar tu solicitud. Inténtalo nuevamente.");
  }
});
