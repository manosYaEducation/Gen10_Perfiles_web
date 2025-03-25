// Archivo: js/qr-scanner.js

document.addEventListener("DOMContentLoaded", function () {
  // Referencias a elementos del DOM
  const emailTab = document.getElementById("email-tab");
  const qrTab = document.getElementById("qr-tab");
  const emailContent = document.getElementById("email-content");
  const qrContent = document.getElementById("qr-content");

  // Control de pestañas
  emailTab.addEventListener("click", function () {
    emailTab.classList.add("active");
    qrTab.classList.remove("active");
    emailContent.classList.add("active");
    qrContent.classList.remove("active");

    // Detener el escáner QR si está activo
    stopQRScanner();
  });

  qrTab.addEventListener("click", function () {
    qrTab.classList.add("active");
    emailTab.classList.remove("active");
    qrContent.classList.add("active");
    emailContent.classList.remove("active");

    // Iniciar el escáner QR
    startQRScanner();
  });

  // Variables para el escáner QR
  let video = null;
  let canvasElement = null;
  let canvas = null;
  let scanning = false;
  let stream = null;

  // Función para iniciar el escáner QR
  function startQRScanner() {
    if (scanning) return;

    const qrScannerArea = document.getElementById("qr-scanner-area");
    qrScannerArea.innerHTML = ""; // Limpiar el área

    // Crear elementos de video y canvas
    video = document.createElement("video");
    canvasElement = document.createElement("canvas");
    canvas = canvasElement.getContext("2d");

    // Configurar el canvas (oculto pero necesario para el procesamiento)
    canvasElement.style.display = "none";
    canvasElement.width = 300;
    canvasElement.height = 300;

    // Configurar el video
    video.style.width = "100%";
    video.style.height = "100%";
    video.style.objectFit = "cover";
    video.playsInline = true;

    // Agregar elementos al DOM
    qrScannerArea.appendChild(video);
    qrScannerArea.appendChild(canvasElement);

    // Solicitar acceso a la cámara
    navigator.mediaDevices
      .getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
      })
      .then(function (streamObj) {
        stream = streamObj;
        video.srcObject = stream;
        video.setAttribute("playsinline", true); // Requerido para iOS
        video.play();
        scanning = true;

        // Empezar el bucle de escaneo
        requestAnimationFrame(tick);
      })
      .catch(function (error) {
        console.error("Error al acceder a la cámara: ", error);
        qrScannerArea.innerHTML = `
                <div style="text-align: center; color: red;">
                    <p>No se pudo acceder a la cámara.</p>
                    <p>Error: ${error.message}</p>
                </div>
            `;
      });
  }

  // Función para detener el escáner QR
  function stopQRScanner() {
    if (!scanning) return;

    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      stream = null;
    }

    if (video) {
      video.pause();
      video.srcObject = null;
    }

    scanning = false;
  }

  // Función para procesar cada frame de video
  function tick() {
    if (!scanning) return;

    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvasElement.height = video.videoHeight;
      canvasElement.width = video.videoWidth;
      canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);

      const imageData = canvas.getImageData(
        0,
        0,
        canvasElement.width,
        canvasElement.height
      );

      // Aquí iría el código para procesar la imagen y detectar códigos QR
      // Por ejemplo, usando jsQR:
      if (window.jsQR) {
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "dontInvert",
        });

        if (code) {
          // QR Code detectado
          console.log("¡Código QR detectado!", code.data);

          // Detener el escáner
          stopQRScanner();

          // Procesar el código QR
          processQRCode(code.data);
          return;
        }
      } else {
        // jsQR no está disponible, mostrar mensaje
        console.log(
          "Biblioteca jsQR no disponible. Por favor, incluya la biblioteca en su HTML."
        );
      }
    }

    // Continuar escaneando
    requestAnimationFrame(tick);
  }

  // Función para procesar el código QR una vez detectado
  function processQRCode(qrData) {
    try {
      // Intenta analizar el QR como JSON
      const qrInfo = JSON.parse(qrData);

      // Aquí procesarías la información del QR y realizarías la autenticación
      // Por ejemplo, enviando una solicitud al servidor

      // Ejemplo simplificado:
      if (qrInfo.token) {
        authenticateWithQR(qrInfo.token);
      } else {
        showQRError("Formato de QR inválido");
      }
    } catch (e) {
      // Si no es JSON válido, puede ser otro formato o simplemente un token
      authenticateWithQR(qrData);
    }
  }

  // Función para autenticar con el servidor usando el token del QR
  function authenticateWithQR(token) {
    // Mostrar indicador de carga
    const qrScannerArea = document.getElementById("qr-scanner-area");
    qrScannerArea.innerHTML = `
            <div style="text-align: center;">
                <p>Autenticando...</p>
                <div class="spinner"></div>
            </div>
        `;

    // Ejemplo de petición al servidor (deberás implementar esto según tu backend)
    // fetch('/api/auth/qr', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify({ token: token })
    // })
    // .then(response => response.json())
    // .then(data => {
    //     if (data.success) {
    //         // Autenticación exitosa, redirigir al usuario
    //         window.location.href = data.redirectUrl || '/dashboard';
    //     } else {
    //         // Mostrar error
    //         showQRError(data.message || 'Error de autenticación');
    //     }
    // })
    // .catch(error => {
    //     showQRError('Error de conexión');
    //     console.error('Error:', error);
    // });

    // Simulación de éxito (reemplazar con código real)
    setTimeout(() => {
      // Éxito simulado - Eliminar en producción
      qrScannerArea.innerHTML = `
                <div style="text-align: center; color: green;">
                    <p>¡Autenticación exitosa!</p>
                    <p>Redirigiendo...</p>
                </div>
            `;

      // Redirigir después de un breve retraso
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1500);
    }, 2000);
  }

  // Función para mostrar errores
  function showQRError(message) {
    const qrScannerArea = document.getElementById("qr-scanner-area");
    qrScannerArea.innerHTML = `
            <div style="text-align: center; color: red;">
                <p>Error: ${message}</p>
                <button id="retry-scan" class="btn">Intentar de nuevo</button>
            </div>
        `;

    // Agregar evento para reintentar
    document
      .getElementById("retry-scan")
      .addEventListener("click", function () {
        startQRScanner();
      });
  }
});
