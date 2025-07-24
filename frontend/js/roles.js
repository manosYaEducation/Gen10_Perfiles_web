function tieneRolEnProyecto(nombreRolEsperado, proyectoId) {
  try {
    const roles = JSON.parse(localStorage.getItem("roles") || "[]");
    return roles.some(
      (r) =>
        r.proyecto_id == proyectoId &&
        r.nombre_rol?.toLowerCase() === nombreRolEsperado.toLowerCase()
    );
  } catch (e) {
    console.error("Error interpretando roles:", e);
    return false;
  }
}

 document.addEventListener("DOMContentLoaded", () => {
    const proyectoId = parseInt(localStorage.getItem("proyectoActual")) || 1;

    if (!tieneRolEnProyecto("admin_k", proyectoId)) {
      alert("No tienes permiso para acceder al panel de administración.");
      window.location.href = "index.html";
    }
  });