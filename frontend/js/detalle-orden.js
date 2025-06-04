document.addEventListener("DOMContentLoaded", () => {
  const contenedor = document.getElementById("detalleTarjeta");
  const orden = JSON.parse(localStorage.getItem("ordenSeleccionada"));

  if (!orden) {
    contenedor.innerHTML = "<p>No se encontró la orden.</p>";
    return;
  }

  contenedor.innerHTML = `
    <h2>${orden.tipoServicio}</h2>
    <div class="detalle-linea"><i class="fas fa-calendar-alt"></i> <strong>Fecha de compra:</strong> ${orden.fechaCompra}</div>
    <div class="detalle-linea"><i class="fas fa-dollar-sign"></i> <strong>Total pagado:</strong> $${orden.totalPagado.toLocaleString()}</div>
    <div class="detalle-linea"><i class="fas fa-clock"></i> <strong>Fecha y hora del servicio:</strong> ${orden.fechaServicio}</div>
  `;
});
