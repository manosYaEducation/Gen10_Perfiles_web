document.addEventListener("DOMContentLoaded", function () {
  // Seleccionar el formulario por su clase
  const loginForm = document.querySelector(".login-form");

  // Verificar si el formulario existe
  if (!loginForm) {
    console.error("Error: Formulario de login no encontrado");
    return;
  }

  // Añadir el event listener al formulario
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    console.log("Formulario enviado");

    const username = document.querySelector("#username").value;
    const password = document.querySelector("#password").value;
    const mantenerSesion = document.querySelector("#mantenerSesion").checked;

    // Debug - para ver los valores en la consola
    console.log("Usuario:", username);
    console.log("Contraseña:", password);
    console.log("Recordarme:", mantenerSesion);

    if (!username || !password) {
      alert("Por favor ingresa ambos campos: usuario y contraseña.");
      return;
    }

    // Mostrar indicador de carga
    const submitBtn = loginForm.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.textContent;
    submitBtn.textContent = "Procesando...";
    submitBtn.disabled = true;

    try {
      // URL directa de producción
      const response = await fetch(
        "https://systemauth.alphadocere.cl/login.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: username, // Usamos el campo de username como email
            password: password,
          }),
        }
      );

      console.log("Estado de respuesta:", response.status);

      const result = await response.json();
      console.log("Datos de respuesta:", result);

      if (result.success) {
        // Guardar token JWT y datos del usuario
        if (mantenerSesion) {
          localStorage.setItem("jwt_token", result.token);
          localStorage.setItem("user_id", result.user_id);
          localStorage.setItem("user_email", username);
          localStorage.setItem("user_type", result.user_type);
          localStorage.setItem("sessionPermanent", "true");
        } else {
          sessionStorage.setItem("jwt_token", result.token);
          sessionStorage.setItem("user_id", result.user_id);
          sessionStorage.setItem("user_email", username);
          sessionStorage.setItem("user_type", result.user_type);
          sessionStorage.setItem("sessionPermanent", "false");
        }

        // Redireccionar según el tipo de usuario
        if (result.user_type === "admin") {
          window.location.href = "dashboard.html"; // Panel de administrador
        } else if (result.user_type === "client") {
          // Si es la primera vez que inicia sesión, enviarlo a completar perfil
          if (result.profile_completed === false) {
            window.location.href = "client-profile.html";
          } else {
            window.location.href = "client-dashboard.html"; // Dashboard de cliente
          }
        } else {
          window.location.href = "dashboard.html"; // Por defecto
        }
      } else {
        alert(result.error || "Usuario o contraseña incorrectos.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Hubo un error al procesar tu solicitud. Inténtalo nuevamente.");
    } finally {
      // Restaurar el botón
      submitBtn.textContent = originalBtnText;
      submitBtn.disabled = false;
    }
  });

  // Verificar si hay una sesión activa al cargar la página
  function checkExistingSession() {
    // Obtener la página actual
    const currentPage = window.location.pathname.split("/").pop();

    // No redireccionar si estamos en register.html
    if (currentPage === "register.html") {
      return;
    }

    const token =
      localStorage.getItem("jwt_token") || sessionStorage.getItem("jwt_token");
    const userType =
      localStorage.getItem("user_type") || sessionStorage.getItem("user_type");

    if (token) {
      // Redireccionar según el tipo de usuario
      if (userType === "admin") {
        window.location.href = "dashboard.html";
      } else if (userType === "client") {
        window.location.href = "client-dashboard.html";
      } else {
        window.location.href = "dashboard.html";
      }
    }
  }

  // Verificar sesión al cargar la página
  checkExistingSession();
});
