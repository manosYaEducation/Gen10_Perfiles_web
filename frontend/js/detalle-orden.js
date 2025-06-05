document.addEventListener("DOMContentLoaded", () => {
  const contenedor = document.getElementById("detalleTarjeta");
  const orden = JSON.parse(localStorage.getItem("ordenSeleccionada"));

  if (!orden) {
    contenedor.innerHTML = "<p>No se encontró la orden.</p>";
    return;
  }

  // Formatear la fecha y hora del servicio
  const fechaServicio = new Date(orden.fechaServicio);
  const fechaFormateada = fechaServicio.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const horaFormateada = fechaServicio.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit'
  });

  contenedor.innerHTML = `
    <div class="detalle-orden-container">
      <h2 class="detalle-orden-titulo">${orden.tipoServicio}</h2>
      
      <div class="detalle-linea">
        <i class="fas fa-circle-user"></i>
        <strong>Nombre y Apellido:</strong>
        <span>${orden.cliente}</span>
      </div>
      
      <div class="detalle-linea">
        <i class="fas fa-phone"></i>
        <strong>Número:</strong>
        <span>${orden.numero}</span>
      </div>
      
      <div class="detalle-linea">
        <i class="fas fa-envelope"></i>
        <strong>Correo:</strong>
        <span>${orden.correo}</span>
      </div>
      
      <div class="detalle-linea">
        <i class="fas fa-calendar-alt"></i>
        <strong>Fecha de compra:</strong>
        <span>${orden.fechaCompra}</span>
      </div>
      
      <div class="detalle-linea">
        <i class="fas fa-dollar-sign"></i>
        <strong>Total pagado:</strong>
        <span>$${orden.totalPagado.toLocaleString()}</span>
      </div>

      <div class="fecha-hora-container">
        <div class="detalle-linea">
          <i class="fas fa-calendar"></i>
          <strong>Fecha de servicio:</strong>
          <span>${fechaFormateada}</span>
        </div>
        
        <div class="detalle-linea">
          <i class="fas fa-clock"></i>
          <strong>Hora de servicio:</strong>
          <span>${horaFormateada}</span>
        </div>
      </div>
    </div>
  `;
});
