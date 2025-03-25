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
    const originalBtnText = submitBtn.textContent || "Iniciar sesión";
    submitBtn.textContent = "Procesando...";
    submitBtn.disabled = true;

    try {
      // Usar la URL de la API definida en config.js
      const apiUrl = window.API_URL_PHP || "http://localhost:3000/backend/";
      const loginEndpoint = apiUrl + "login.php";

      console.log("Enviando solicitud a:", loginEndpoint);

      const response = await fetch(loginEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: username,
          password: password,
        }),
        credentials: "include", // Añadir esto para mantener cookies entre solicitudes
      });

      console.log("Estado de respuesta:", response.status);

      // Verificar el Content-Type para diagnosticar problemas
      const contentType = response.headers.get("Content-Type");
      console.log("Content-Type de respuesta:", contentType);

      // Primero obtener la respuesta como texto para depuración
      const responseText = await response.text();
      console.log("Respuesta como texto:", responseText);

      let result;
      try {
        // Intentar parsear como JSON
        result = JSON.parse(responseText);
        console.log("Datos de respuesta (parseados manualmente):", result);
      } catch (parseError) {
        console.error("Error al parsear JSON:", parseError);
        alert(
          "Error: La respuesta del servidor no es JSON válido. Contacta al administrador."
        );
        return;
      }

      if (result.success) {
        // Sistema nuevo - guardar token JWT y datos del usuario
        if (mantenerSesion) {
          localStorage.setItem("jwt_token", result.token || "");
          localStorage.setItem("user_id", result.user_id || "");
          localStorage.setItem("user_email", username);
          localStorage.setItem("user_type", result.user_type || "client");
          localStorage.setItem("sessionPermanent", "true");

          // Sistema antiguo - para compatibilidad
          localStorage.setItem("userLoggedIn", "true");
          localStorage.setItem("username", username);
        } else {
          sessionStorage.setItem("jwt_token", result.token || "");
          sessionStorage.setItem("user_id", result.user_id || "");
          sessionStorage.setItem("user_email", username);
          sessionStorage.setItem("user_type", result.user_type || "client");
          sessionStorage.setItem("sessionPermanent", "false");

          // Sistema antiguo - para compatibilidad
          sessionStorage.setItem("userLoggedIn", "true");
          sessionStorage.setItem("username", username);
        }

        // Redireccionar según el tipo de usuario
        let redirectUrl;

        if (result.user_type === "admin") {
          redirectUrl = "index-admin.html";
        } else if (result.user_type === "client") {
          // Si es la primera vez que inicia sesión, enviarlo a completar perfil
          redirectUrl =
            result.profile_completed === false
              ? "client-profile.html"
              : "client-dashboard.html";
        } else {
          redirectUrl = "index-admin.html"; // Por defecto
        }

        console.log("Redirigiendo a:", redirectUrl);

        // Pequeño retraso para asegurar que los datos de la sesión se guarden antes de redirigir
        setTimeout(() => {
          window.location.href = redirectUrl;
        }, 100);
      } else {
        alert(result.error || "Usuario o contraseña incorrectos.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert(
        "Hubo un error al procesar tu solicitud. Inténtalo nuevamente. Error: " +
          error.message
      );
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

    // Lista de páginas públicas que no requieren redirección
    const publicPages = ["register.html", "login.html", "index.html", ""];

    // No redireccionar si estamos en una página pública
    if (publicPages.includes(currentPage)) {
      console.log("Página pública detectada, no se redirige");
      return;
    }

    // Verificar sistema nuevo
    const token =
      localStorage.getItem("jwt_token") || sessionStorage.getItem("jwt_token");
    // Verificar sistema antiguo
    const userLoggedIn =
      localStorage.getItem("userLoggedIn") ||
      sessionStorage.getItem("userLoggedIn");

    const userType =
      localStorage.getItem("user_type") || sessionStorage.getItem("user_type");

    if (token || userLoggedIn) {
      console.log("Sesión activa detectada para usuario tipo:", userType);
      // Ya tenemos una sesión, no necesitamos hacer nada
    } else {
      console.log("No hay sesión activa, redirigiendo a login");
      // No hay sesión, redirigir al login
      window.location.href = "login.html";
    }
  }

  // Verificar sesión al cargar la página
  checkExistingSession();
});
