function deleteUser(event) {
  const userId = event.target.getAttribute("data-id");

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
      <h3 style="color: #333; margin-bottom: 20px; font-size: 20px;">Eliminar Usuario</h3>
      <p style="margin-bottom: 20px; color: #666;">¿Estás seguro de eliminar este usuario?</p>
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
    fetch(`${window.API_URL_PHP}delete_user.php?id=${userId}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          // Mostrar el modal de éxito después de un breve retraso
          setTimeout(() => {
            showSuccessModal("Usuario eliminado con éxito");
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
function showSuccessModal(message = "Usuario eliminado con éxito") {
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