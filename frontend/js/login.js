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
    console.log("Respuesta del servidor:", result); // Añade este log para ver la respuesta completa

    if (result.success === true) {
      if (mantenerSesion) {
        localStorage.setItem("userLoggedIn", "true");
        localStorage.setItem("username", username);
        localStorage.setItem("sessionPermanent", "true");
      } else {
        sessionStorage.setItem("userLoggedIn", "true");
        sessionStorage.setItem("username", username);
        sessionStorage.setItem("sessionPermanent", "false");
      }

      // Modificación para depuración
      console.log("Intentando redirigir...");
      window.location.href = "index-admin.html"; // Ruta relativa
    } else {
      alert(result.error || "Usuario o contraseña incorrectos.");
    }
  } catch (error) {
    console.error("Error completo:", error);
    alert("Hubo un error al procesar tu solicitud. Inténtalo nuevamente.");
  }
});
