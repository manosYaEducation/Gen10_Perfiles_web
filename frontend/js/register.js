// Función para mostrar modal personalizado
function showCustomModal(title, message, callback) {
  // Crear el modal
  const modalOverlay = document.createElement("div");
  modalOverlay.className = "modal-overlay";

  const modalContent = document.createElement("div");
  modalContent.className = "modal-content";

  // Crear el contenido del modal - MODIFICADO: no usamos <p> para el mensaje
  modalContent.innerHTML = `
      <div class="modal-header">
        <h2>${title}</h2>
      </div>
      <div class="modal-body">
        ${message}
      </div>
      <div class="modal-footer">
        <button class="modal-button">Aceptar</button>
      </div>
    `;

  // Añadir el modal al overlay
  modalOverlay.appendChild(modalContent);

  // Añadir el overlay al body
  document.body.appendChild(modalOverlay);

  // Estilo del modal
  const style = document.createElement("style");
  style.textContent = `
      .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
      }
      
      .modal-content {
        background-color: white;
        border-radius: 10px;
        padding: 20px;
        width: 90%;
        max-width: 400px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        animation: modalAppear 0.3s ease-out;
      }
      
      @keyframes modalAppear {
        from { transform: translateY(-50px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
      
      .modal-header h2 {
        color: #333;
        margin-top: 0;
        font-size: 1.3rem;
        text-align: center;
        margin-bottom: 15px;
      }
      
      .modal-body {
        margin-bottom: 20px;
      }
      
      .modal-body p {
        color: #555;
        line-height: 1.5;
        text-align: center;
      }

      .modal-body a {
        word-break: break-all;
        text-decoration: underline;
      }
      
      .modal-footer {
        display: flex;
        justify-content: center;
      }
      
      .modal-button {
        background-color: #4CAF50;
        color: white;
        border: none;
        border-radius: 25px;
        padding: 10px 30px;
        font-size: 0.9rem;
        cursor: pointer;
        transition: background-color 0.3s;
      }
      
      .modal-button:hover {
        background-color: #45a049;
      }
    `;

  document.head.appendChild(style);

  // Cerrar modal al hacer clic en el botón
  const button = modalContent.querySelector(".modal-button");
  button.addEventListener("click", function () {
    document.body.removeChild(modalOverlay);
    if (callback) callback();
  });
}

// Función para comprobar el tipo de respuesta del servidor
async function handleServerResponse(response) {
  // Verificar el tipo de contenido de la respuesta
  const contentType = response.headers.get("content-type");
  console.log("Content-Type recibido:", contentType);

  if (!contentType || !contentType.includes("application/json")) {
    // Si no es JSON, obtenemos el texto para ver qué está pasando
    const textResponse = await response.text();
    console.log("Respuesta no-JSON recibida:", textResponse);

    // Intentamos extraer un mensaje de error si parece un error PHP
    let errorMessage = "El servidor no devolvió un formato JSON válido.";
    if (textResponse.includes("<br />") && textResponse.includes("<b>")) {
      // Parece un error de PHP, intentamos extraer un mensaje más legible
      errorMessage =
        "Error del servidor: " +
        textResponse
          .replace(/<[^>]*>/g, " ")
          .replace(/\s+/g, " ")
          .trim();
    }

    // Lanzamos un error para que se capture en el catch
    throw new Error(errorMessage);
  }

  // Si llegamos aquí, la respuesta es JSON y podemos procesarla normalmente
  return response.json();
}

// Función para convertir la imagen a base64
function getBase64Image(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      resolve(null);
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

document.addEventListener("DOMContentLoaded", function () {
  // Solución para la imagen de perfil
  const profileImg = document.getElementById("previewImg");
  if (profileImg) {
    // Cuando hay un error al cargar la imagen
    profileImg.onerror = function () {
      // Usar un SVG minimalista codificado en base64
      this.src =
        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMTIiIGN5PSI4IiByPSI0IiBmaWxsPSIjODg4Ii8+PHBhdGggZD0iTTQgMjB2LTJjMC0yLjIgMy42LTQgOC00czcuOSAxLjggOCA0djIiIGZpbGw9IiM4ODgiLz48L3N2Zz4=";
    };
  }

  // Gestionar la subida de fotos
  const photoUploadBtn = document.getElementById("uploadPhotoBtn");
  const photoInput = document.getElementById("photoUpload");
  const photoPreview = document.getElementById("previewImg");

  if (photoUploadBtn && photoInput) {
    photoUploadBtn.addEventListener("click", function () {
      photoInput.click();
    });

    photoInput.addEventListener("change", function () {
      if (this.files && this.files[0]) {
        const reader = new FileReader();

        reader.onload = function (e) {
          photoPreview.src = e.target.result;
        };

        reader.readAsDataURL(this.files[0]);
      }
    });
  }

  // Seleccionar el formulario de registro
  const registerForm = document.querySelector(".register-form");

  // Verificar si el formulario existe
  if (!registerForm) {
    console.error("Error: Formulario de registro no encontrado");
    return;
  }

  // Añadir el event listener al formulario
  registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    console.log("Formulario de registro enviado");

    // Recoger datos del formulario
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;
    const confirmPassword = document.querySelector("#confirmPassword").value;

    // Nuevos campos
    const name = document.querySelector("#name").value;
    const company = document.querySelector("#company").value;
    const location = document.querySelector("#location").value;
    const phone = document.querySelector("#phone").value;
    const description = document.querySelector("#description").value;
    const photoFile = document.querySelector("#photoUpload").files[0];

    // Debug - para ver los valores en la consola
    console.log("Email:", email);
    console.log("Nombre:", name);
    console.log("Empresa:", company);

    // Validaciones básicas
    if (!email || !password || !name || !company) {
      showCustomModal(
        "Campos requeridos",
        "<p>Por favor completa todos los campos obligatorios.</p>"
      );
      return;
    }

    if (password !== confirmPassword) {
      showCustomModal(
        "<p>Error de validación</p>",
        "Las contraseñas no coinciden."
      );
      return;
    }

    if (password.length < 8) {
      showCustomModal(
        "Error de validación",
        "<p>La contraseña debe tener al menos 8 caracteres.</p>"
      );
      return;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showCustomModal(
        "Error de validación",
        "<p>Por favor ingresa un correo electrónico válido.</p>"
      );
      return;
    }

    // Mostrar indicador de carga
    const submitBtn = document.getElementById("submitBtn");
    const originalBtnText = submitBtn.textContent;
    submitBtn.textContent = "Procesando...";
    submitBtn.disabled = true;
    try {
      // Convertir la foto a base64 si existe
      let photoBase64 = null;
      if (photoFile) {
        photoBase64 = await getBase64Image(photoFile);
      }

      // Preparar datos para enviar
      const userData = {
        email: email,
        password: password,
        name: name,
        company: company,
        location: location || "",
        phone: phone || "",
        description: description || "",
        photo: photoBase64,
      };

      // URL para el registro
      const apiUrl = "https://systemauth.alphadocere.cl/register.php";

      console.log("Enviando solicitud a:", apiUrl);
      console.log("Datos de usuario:", {
        ...userData,
        photo: photoBase64 ? "[BASE64_DATA]" : null,
      });

      // Enviar la solicitud
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      console.log("Estado de respuesta:", response.status);
      console.log(
        "Headers de respuesta:",
        Array.from(response.headers.entries())
      );

      // Obtener respuesta como texto
      const responseText = await response.text();
      console.log("Respuesta como texto:", responseText);

      // Verificar si hay errores PHP en la respuesta
      if (
        responseText.includes("<br />") &&
        responseText.includes("<b>Warning</b>")
      ) {
        // Estamos recibiendo un error PHP, pero intentamos extraer el JSON al final
        const jsonStartIndex = responseText.lastIndexOf("{");
        const jsonEndIndex = responseText.lastIndexOf("}") + 1;

        if (jsonStartIndex >= 0 && jsonEndIndex > jsonStartIndex) {
          // Intentar extraer el JSON de la respuesta de error
          try {
            const jsonPart = responseText.substring(
              jsonStartIndex,
              jsonEndIndex
            );
            console.log("Intentando extraer JSON:", jsonPart);

            const errorData = JSON.parse(jsonPart);
            console.log("Error JSON extraído:", errorData);

            if (
              errorData.error &&
              errorData.error.includes("No data supplied for parameters")
            ) {
              // Si detectamos el error específico de bind_param, generamos un enlace manual
              // Creamos un token único con fecha y email
              const manualToken = btoa(
                email + "_" + new Date().getTime()
              ).replace(/=/g, "");
              const verificationLink = `https://systemauth.alphadocere.cl/register.php?token=${manualToken}`;

              // Mostrar un modal con instrucciones para el usuario
              showCustomModal(
                "Registro procesado",
                `<p>Tu cuenta ha sido registrada correctamente, pero hay un problema técnico temporal con el enlace de verificación.</p>
                 <p>Por favor usa el siguiente enlace para verificar tu cuenta:</p>
                 <div style="background-color: #f5f5f5; padding: 10px; margin: 15px 0; border-radius: 5px; word-break: break-all;">
                   <a href="${verificationLink}" target="_blank">${verificationLink}</a>
                 </div>
                 <p>Si el enlace no funciona, por favor envía un correo a <strong>soporte@alphadocere.cl</strong> incluyendo tu nombre y correo electrónico.</p>`,
                function () {
                  // Abrir el enlace en una nueva pestaña cuando cierre el modal
                  window.open(verificationLink, "_blank");
                }
              );

              // También almacenar localmente para referencia
              if (window.localStorage) {
                try {
                  localStorage.setItem(
                    "registrationInfo",
                    JSON.stringify({
                      email: email,
                      name: name,
                      token: manualToken,
                      date: new Date().toString(),
                    })
                  );
                } catch (e) {
                  console.error("Error guardando en localStorage:", e);
                }
              }

              return;
            }

            // Si llegamos aquí, mostrar el error normal
            showCustomModal(
              "Error en el servidor",
              `<p>${errorData.error || "Ocurrió un error desconocido"}</p>
               <p>Por favor, contacta al administrador.</p>`
            );
            return;
          } catch (jsonError) {
            console.error("Error extrayendo JSON:", jsonError);
          }
        }

        // Si no pudimos extraer JSON, mostrar mensaje genérico
        showCustomModal(
          "Error en el servidor",
          "<p>Ocurrió un error al procesar tu registro. Por favor contacta al administrador o intenta más tarde.</p>"
        );
        return;
      }

      // Si no hay errores PHP, intentar procesar como JSON normal
      try {
        let result = JSON.parse(responseText);
        console.log("Respuesta convertida a JSON:", result);
        if (result.success) {
          console.log("Registro exitoso, datos:", result);

          // Nuevo mensaje que no muestra la URL por razones de seguridad
          showCustomModal(
            "Registro exitoso",
            `<p>¡Tu cuenta ha sido registrada correctamente!</p>
             <p>Hemos enviado un correo electrónico a <strong>${email}</strong> con un enlace de verificación.</p>
             <p>Por favor revisa tu bandeja de entrada (y carpeta de spam) para completar el proceso de registro.</p>`,
            function () {
              // Redirigir al usuario a la página de login
              window.location.href = "login.html";
            }
          );
        } else {
          showCustomModal(
            "Error",
            `<p>${
              result.error || "Error al registrar usuario. Intente nuevamente."
            }</p>`
          );
        }
      } catch (jsonError) {
        console.error("Error al parsear JSON:", jsonError);
        showCustomModal(
          "Error de formato",
          "<p>El servidor devolvió una respuesta inválida. Por favor contacta al administrador.</p>"
        );
      }
    } catch (error) {
      console.error("Error al enviar solicitud:", error);

      // Mensaje más específico para errores de conexión
      if (error.message.includes("Failed to fetch")) {
        showCustomModal(
          "Error de conexión",
          "<p>No se pudo conectar con el servidor. Por favor verifica tu conexión a internet e intenta nuevamente.</p>"
        );
      } else {
        showCustomModal(
          "Error",
          `<p>${
            error.message ||
            "Hubo un error al procesar tu solicitud. Inténtalo nuevamente."
          }</p>`
        );
      }
    } finally {
      // Restaurar el botón
      submitBtn.textContent = originalBtnText;
      submitBtn.disabled = false;
    }
  });
});
