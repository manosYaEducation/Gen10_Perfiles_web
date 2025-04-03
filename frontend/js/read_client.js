document.addEventListener("DOMContentLoaded", async function () {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");

  if (!window.API_URL_PHP) {
    console.error("API_URL_PHP no está definida");
    return;
  }

  // Si hay ID → mostrar perfil individual
  if (id) {
    try {
      const response = await fetch(
        `${window.API_URL_PHP}read_client.php?id=${id}`
      );
      const result = await response.json();

      if (!result.success) {
        console.error("Error al obtener el cliente:", result.message);
        return;
      }

      const client = result.data;

      if (client.image) {
        const imageElement = document.getElementById("profile_image");
        if (imageElement) imageElement.src = client.image;
      }

      const nameElement = document.getElementById("name-hero");
      if (nameElement) nameElement.textContent = client.basic.name;

      // Descripción
      const descElement = document.getElementById("description-hero");
      if (descElement) descElement.textContent = client.basic.description || "";

      // Empresa
      const expSection = document.getElementById("experience-section");
      if (expSection) {
        expSection.innerHTML = `
            <div class="experience-sub-section">
              <h3 class="experience-sub-title">${
                client.basic.company || "Empresa no disponible"
              }</h3>
            </div>
          `;
      }

      // Correo
      const correoElement = document.getElementById("p-interest-section");
      if (correoElement)
        correoElement.textContent =
          client.basic.email || "Correo no disponible";

      // Ubicación
      const ubicacionElement = document.getElementById("p-skill-section");
      if (ubicacionElement)
        ubicacionElement.textContent =
          client.basic.location || "Ubicación no disponible";

      // Teléfono
      const telefonoElement = document.getElementById("social-links");
      if (telefonoElement)
        telefonoElement.textContent =
          client.basic.phone || "Teléfono no disponible";
    } catch (error) {
      console.error("Error al obtener los datos del cliente:", error);
    }
    return;
  }

  // Si no hay ID → mostrar lista de clientes
  fetch(`${window.API_URL_PHP}read_client.php`)
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        const clientContent = document.querySelector(".client-content");
        // Limpiar solo los clientes, manteniendo el botón "Agregar cliente"
        const addButton = clientContent.querySelector(".create-profile");
        clientContent.innerHTML = "";
        if (addButton) {
          clientContent.appendChild(addButton);
        }

                // Crear contenedor para las tarjetas de clientes
                const clientsContainer = document.createElement('div');
                clientsContainer.className = 'profile-container';

                // Mostrar todos los clientes
                data.clients.forEach(client => {
                    const clientCard = document.createElement('div');
                    clientCard.classList.add('profile-card');
                    clientCard.innerHTML = `
                        <div class="client-info">
                            <div class="client-image">
                                <img src="${client.image || 'data:image/png;base64,DEFAULT_BASE64_IMAGE'}" alt="${client.name}">
                            </div>
                            <h2>${client.name}</h2>
                            <h3 class="client-company">${client.company}</h3>
                            <div class="profile-actions">
                                <a href="./clientes/client-template.html?id=${client.id}" class="button-link">Ver</a>
                                <button class="buttonActualizar" data-id="${client.id}" onclick="redirectToUpdateClient(${client.id})">Actualizar</button>
                                <button class="buttonBorrar" data-id="${client.id}" onclick="deleteClient(event)">Borrar</button>
                            </div>
                        </div>
                    `;
                    clientsContainer.appendChild(clientCard);
                });

        clientContent.appendChild(clientsContainer);
      } else {
        console.error("No se pudieron obtener los clientes:", data.message);
      }
    })
    .catch((error) => console.error("Error al obtener clientes:", error));
});

// Funciones auxiliares
function redirectToUpdateClient(id) {
  window.location.href = `update-client.html?id=${id}`;
}

function deleteClient(event) {
  const clientId = event.target.getAttribute("data-id");

  // Crear el contenedor del diálogo
  const dialogOverlay = document.createElement("div");
  dialogOverlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    `;

  // Crear el diálogo
  const dialog = document.createElement("div");
  dialog.style.cssText = `
      background-color: white;
      border-radius: 12px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      padding: 30px;
      width: 350px;
      text-align: center;
    `;

  // Contenido del diálogo
  dialog.innerHTML = `
      <h3 style="color: #333; margin-bottom: 20px; font-size: 20px;">Eliminar Cliente</h3>
      <p style="margin-bottom: 20px; color: #666;">¿Estás seguro de eliminar este cliente?</p>
      <div style="
        display: flex;
        justify-content: center;
        gap: 15px;
      ">
        <button id="btnAceptar" style="
          background-color: #8B6E3F;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 6px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        ">Aceptar</button>
        <button id="btnCancelar" style="
          background-color: #f0f0f5;
          color: #8B6E3F;
          border: 1px solid #e0e0e8;
          padding: 10px 20px;
          border-radius: 6px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        ">Cancelar</button>
      </div>
    `;

  // Añadir eventos a los botones
  dialogOverlay.appendChild(dialog);
  document.body.appendChild(dialogOverlay);

  const btnAceptar = dialog.querySelector("#btnAceptar");
  const btnCancelar = dialog.querySelector("#btnCancelar");

  btnAceptar.addEventListener("click", () => {
    fetch(`${window.API_URL_PHP}delete_client.php?id=${clientId}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          // Mostrar el modal de éxito después de un breve retraso
          setTimeout(() => {
            showSuccessModal("Cliente eliminado con éxito");
          }, 500); // 500 milisegundos (medio segundo)

          // Recargar la página después de un poco más de tiempo
          setTimeout(() => {
            window.location.reload();
          }, 1500); // 1.5 segundos para dar tiempo a ver el modal
        } else {
          console.error("Error al eliminar:", data.message);
        }
      })
      .catch((error) => console.error("Error:", error));

    document.body.removeChild(dialogOverlay);
  });

  btnCancelar.addEventListener("click", () => {
    document.body.removeChild(dialogOverlay);
  });

  // Añadir hover effects con JavaScript
  btnAceptar.addEventListener("mouseover", () => {
    btnAceptar.style.backgroundColor = "#6B5A3A";
  });
  btnAceptar.addEventListener("mouseout", () => {
    btnAceptar.style.backgroundColor = "#8B6E3F";
  });

  btnCancelar.addEventListener("mouseover", () => {
    btnCancelar.style.backgroundColor = "#f4f4f8";
  });
  btnCancelar.addEventListener("mouseout", () => {
    btnCancelar.style.backgroundColor = "#f0f0f5";
  });
}
function showSuccessModal(message = "Cliente eliminado con éxito") {
  // Crear el contenedor del diálogo
  const dialogOverlay = document.createElement("div");
  dialogOverlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    `;

  // Crear el diálogo
  const dialog = document.createElement("div");
  dialog.style.cssText = `
      background-color: white;
      border-radius: 12px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      padding: 30px;
      width: 350px;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
    `;

  // Ícono de check
  const checkIcon = document.createElement("div");
  checkIcon.style.cssText = `
      width: 70px;
      height: 70px;
      border: 4px solid #4CAF50;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 20px;
      position: relative;
      animation: pulse 0.5s ease-in-out;
    `;

  const checkMark = document.createElement("div");
  checkMark.style.cssText = `
      position: absolute;
      width: 25px;
      height: 12px;
      border-left: 4px solid #4CAF50;
      border-bottom: 4px solid #4CAF50;
      transform: rotate(-45deg);
      top: 50%;
      left: 50%;
      margin-left: -10px;
      margin-top: -6px;
    `;
  checkIcon.appendChild(checkMark);

  // Texto
  const messageElement = document.createElement("h3");
  messageElement.textContent = message;
  messageElement.style.cssText = `
      color: #333; 
      margin-bottom: 10px; 
      font-size: 18px;
    `;

  // Añadir estilos de animación
  const styleSheet = document.createElement("style");
  styleSheet.textContent = `
      @keyframes pulse {
        0% { transform: scale(0.8); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
      }
    `;
  document.head.appendChild(styleSheet);

  // Ensamblar el diálogo
  dialog.appendChild(checkIcon);
  dialog.appendChild(messageElement);
  dialogOverlay.appendChild(dialog);
  document.body.appendChild(dialogOverlay);

  // Desaparecer después de 2 segundos
  setTimeout(() => {
    document.body.removeChild(dialogOverlay);
  }, 2000);
}
