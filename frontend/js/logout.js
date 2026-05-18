/**
 * logout.js — Manejo centralizado del cierre de sesión.
 *
 * Estrategia:
 *  1. Se enlaza primero al botón con id="logout-btn" (método directo y fiable).
 *  2. Como fallback, busca cualquier enlace cuyo texto contenga "cerrar sesión"
 *     en los selectores habituales del navbar.
 *  3. Muestra un diálogo de confirmación con SweetAlert2 (lo carga si aún no
 *     está disponible).
 *  4. Al confirmar, limpia localStorage/sessionStorage y redirige.
 */

// ─── Ejecutar logout ───────────────────────────────────────────────────────────
function ejecutarLogout() {
  console.log("[logout] Cerrando sesión...");

  const keysToRemove = [
    "token", "user", "userName", "username",
    "userLoggedIn", "userEmail", "sessionPermanent",
  ];

  keysToRemove.forEach((key) => {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  });

  // Redirigir: si estamos en una sub-ruta, volver a la raíz
  const currentPath = window.location.pathname;

  if (
    currentPath.endsWith("index.html") ||
    currentPath === "/" ||
    currentPath.endsWith("/Gen10_Perfiles_web/") ||
    currentPath === "/Gen10_Perfiles_web"
  ) {
    window.location.reload();
  } else if (currentPath.includes("/frontend/")) {
    window.location.href = "../../index.html";
  } else {
    window.location.href = "index.html";
  }
}

// ─── Diálogo de confirmación ──────────────────────────────────────────────────
function mostrarConfirmacion() {
  const isDarkMode = document.body.classList.contains("dark-mode");

  const opciones = {
    title: "¿Cerrar sesión?",
    text: "¿Estás seguro de que deseas cerrar tu sesión actual?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#4CAF50",
    cancelButtonColor: isDarkMode ? "#444" : "#d33",
    confirmButtonText: "Sí, cerrar sesión",
    cancelButtonText: "Cancelar",
    background: isDarkMode ? "#1e1e1e" : "#fff",
    color: isDarkMode ? "#e0e0e0" : "#545454",
    customClass: { popup: "kreative-swal-popup" },
  };

  Swal.fire(opciones).then((result) => {
    if (result.isConfirmed) ejecutarLogout();
  });
}

function cerrarSesion() {
  if (typeof Swal !== "undefined") {
    mostrarConfirmacion();
  } else {
    // Cargar SweetAlert2 dinámicamente y luego mostrar el modal
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/sweetalert2@11";
    script.onload = mostrarConfirmacion;
    document.head.appendChild(script);
  }
}

// ─── Inicializar botones de logout ────────────────────────────────────────────
function initLogoutButtons() {
  // 1. Enlace directo por ID (método preferido)
  const logoutById = document.getElementById("logout-btn");
  if (logoutById && !logoutById.dataset.logoutBound) {
    logoutById.dataset.logoutBound = "true";
    logoutById.addEventListener("click", (e) => {
      e.preventDefault();
      cerrarSesion();
    });
    console.log("[logout] Botón #logout-btn vinculado.");
  }

  // 2. Fallback: buscar por texto dentro del dropdown/navbar
  const candidatos = document.querySelectorAll(
    "a.button-53, .dropdown-content a, .nav-links a"
  );
  candidatos.forEach((link) => {
    if (link.dataset.logoutBound) return; // ya vinculado

    const texto = link.textContent.trim().toLowerCase();
    const esCerrarSesion =
      texto.includes("cerrar sesión") || texto.includes("cerrar sesion");

    if (esCerrarSesion) {
      link.dataset.logoutBound = "true";
      link.addEventListener("click", (e) => {
        e.preventDefault();
        cerrarSesion();
      });
      console.log("[logout] Botón fallback vinculado:", link.textContent.trim());
    }
  });
}

// ─── Arranque ─────────────────────────────────────────────────────────────────
if (
  document.readyState === "complete" ||
  document.readyState === "interactive"
) {
  initLogoutButtons();
} else {
  document.addEventListener("DOMContentLoaded", initLogoutButtons);
}

// Segundo intento retrasado para cuando el DOM cambia dinámicamente
// (p. ej. si el perfil se renderiza después del primer DOMContentLoaded)
window.addEventListener("load", () => {
  setTimeout(initLogoutButtons, 300);
});
