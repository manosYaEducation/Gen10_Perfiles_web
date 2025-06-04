document.addEventListener("DOMContentLoaded", function () {
    const forgotPasswordForm = document.getElementById("forgotPasswordForm");
  
    if (forgotPasswordForm) {
      forgotPasswordForm.addEventListener("submit", async function (event) {
        event.preventDefault();
  
        // Obtener el email
        const email = document.getElementById("email").value;
  
        if (!email) {
          alert("Por favor ingresa tu dirección de correo electrónico");  
          return;
        }
  
        // Mostrar indicador de carga
        const submitButton = forgotPasswordForm.querySelector(
          'button[type="submit"]'
        );
        const originalButtonText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = "Enviando...";
  
        try {
          // Crear un objeto FormData para enviar como formulario tradicional
          const formData = new FormData();
          formData.append("forgotEmail", email);
  
          // Hacer solicitud al endpoint de recuperación de contraseña usando FormData
          const response = await fetch(
            "http://localhost/jwt-mail-qr/Version%202-%20SystemAuth/forgot-password.php",
            {
              method: "POST",
              body: formData, // Enviar como FormData en lugar de JSON
            }
          );
  
          const result = await response.json();
  
          if (result.success) {
            // Mostrar mensaje de éxito
            alert(
              "Se ha enviado un correo electrónico con instrucciones para restablecer tu contraseña. Por favor, revisa tu bandeja de entrada."
            );
  
            // Redireccionar a la página de login
            window.location.href = "login.html";
          } else {
            // Mostrar mensaje de error
            alert(
              result.error ||
                "No se pudo procesar tu solicitud. Verifica que el correo sea correcto."
            );
          }
        } catch (error) {
          console.error("Error:", error);
  
          // Mostrar mensaje de error
          alert(
            "No se pudo conectar con el servidor. Por favor, intenta más tarde."
          );
        } finally {
          // Restaurar el botón
          submitButton.disabled = false;
          submitButton.textContent = originalButtonText;
        }
      });
    }
  });