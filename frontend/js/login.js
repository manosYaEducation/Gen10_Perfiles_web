const loginF = document.querySelector("form");

// Configuración bloqueo login por intentos fallidos
const loginBtn = document.querySelector(".login-button");
let intentosFallidos = parseInt(localStorage.getItem("intentosFallidos")) || 0;
const maxIntentos = 5;
const bloqueoTiempo = 120; //Segundos

// Verificación de bloqueo activo
window.addEventListener("load", verificarBloqueo);

function verificarBloqueo() {
  const bloqueoHasta = parseInt(localStorage.getItem("bloqueoLoginHasta"));
  const ahora = Date.now();
  if (bloqueoHasta && bloqueoHasta > ahora) {
    loginBtn.disabled = true;
    actualizarMensajeBloqueo();
  } else {
    localStorage.removeItem("bloqueoLoginHasta");
    loginBtn.disabled = false;
    intentosFallidos = 0;
    localStorage.setItem("intentosFallidos", "0");
  }
}

// Timer bloqueo
function actualizarMensajeBloqueo() {
  const bloqueoHasta = parseInt(localStorage.getItem("bloqueoLoginHasta"));
  const ahora = Date.now();
  if (bloqueoHasta > ahora) {
    const segundosRestantes = Math.ceil((bloqueoHasta - ahora) / 1000);
    loginBtn.textContent = `Bloqueado (${segundosRestantes}s)`;
    setTimeout(actualizarMensajeBloqueo, 1000);
  } else {
    loginBtn.disabled = false;
    loginBtn.textContent = "Iniciar sesión";
    localStorage.removeItem("bloqueoLoginHasta");
    localStorage.setItem("intentosFallidos", "0");
    intentosFallidos = 0;
  }
}

async function obtenerClavePublica() {
  const res = await fetch('../assets/a9f87e6df4b_secret/f4e2b1c7_keys/public.pem'); // Ruta hacia la clave pública
  return await res.text();
}

async function cifrarConClavePublica(textoPlano) {
  const clavePublica = await obtenerClavePublica();
  console.log('Clave pública cargada:\n', clavePublica);

  const encryptor = new JSEncrypt();
  encryptor.setPublicKey(clavePublica);

  const test = encryptor.encrypt('test');
  if (!test) {
    console.error("FALLÓ el cifrado simple con 'test'");
  }

  const cifrado = encryptor.encrypt(textoPlano);
  if (!cifrado) {
    console.error('FALLÓ el cifrado de:', textoPlano);
    throw new Error('Error al cifrar con clave pública.');
  }

  return cifrado;
}

loginF.addEventListener("submit", async (event) => {
  event.preventDefault();
  const username = document.querySelector("#username").value;
  const password = document.querySelector("#password").value;
  const mantenerSesion = document.querySelector("#mantenerSesion").checked;

  if (!username || !password) {
    mostrarErrorLogin("Por favor ingresa ambos campos: usuario y contraseña.");
    return;
  }

  try {
    // Aquí cambiamos la URL del endpoint a la nueva dirección
    const emailCifrado = await cifrarConClavePublica(username);
    const passwordCifrado = await cifrarConClavePublica(password);
    // Antes de subir a producción https://systemauth.alphadocere.cl/login.php o a https://test-systemauth.alphadocere.cl/login.php
    const response = await fetch('https://systemauth.alphadocere.cl/login.php', {  // endpoint local
      method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: emailCifrado,
          password: passwordCifrado,
        }),
      }
    );

    const result = await response.json();
    console.log("Respuesta del servidor:", result);
    

    if (result.success === true) {
      // Reset de intentos fallidos
      intentosFallidos = 0;
      localStorage.setItem("intentosFallidos", "0");
      localStorage.removeItem("bloqueoLoginHasta");
      console.log("Login exitoso");

      // Almacenar información del login
      if (mantenerSesion) {
        localStorage.setItem("userLoggedIn", "true");
        localStorage.setItem("username", username);
        localStorage.setItem("sessionPermanent", "true");
        localStorage.setItem("proyectoActual", 1);
        
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
        
        // Guardar los roles asociados al usuario si están disponibles
        if (Array.isArray(result.roles)) {
          localStorage.setItem("roles", JSON.stringify(result.roles));
        }
      }

      // Redirigir al usuario
      window.location.href = "../index.html";
    } else {
      mostrarErrorLogin(result.error || "Usuario o contraseña incorrectos.");

      // Agrega intento fallido y si es igual o supera los intentos empieza el timer
      intentosFallidos++;
      localStorage.setItem("intentosFallidos", intentosFallidos);
      if (intentosFallidos >= maxIntentos) {
        const bloqueoHasta = Date.now() + bloqueoTiempo * 1000;
        localStorage.setItem("bloqueoLoginHasta", bloqueoHasta);
        loginBtn.disabled = true;
        actualizarMensajeBloqueo();
      }
    }
  } catch (error) {
    console.error("Error completo:", error);
    mostrarErrorLogin('Hubo un error al procesar tu solicitud. Inténtalo nuevamente.\n' + error.message);
  }
});

// Ver/Ocultar contraseña
const togglePassword = document.querySelector("#togglePassword");
const password = document.querySelector("#password");

togglePassword.addEventListener("click", () => {
  const esPassword = password.getAttribute("type") === "password";
  password.setAttribute("type", esPassword ? "text" : "password");

  togglePassword.classList.toggle("bi-eye");
  togglePassword.classList.toggle("bi-eye-slash");
});


// === Ventna modal para error en el login ===
function mostrarErrorLogin(mensaje) {
    const modal = document.getElementById("modalError-Login");
    const mensajeError = document.getElementById("mensajeError");

    mensajeError.textContent = mensaje;
    modal.style.display = "block";

    document.getElementById("cerrarModal").onclick = () => {
        modal.style.display = "none";
    };

    window.onclick = (e) => {
        if (e.target === modal) modal.style.display = "none";
    };
}