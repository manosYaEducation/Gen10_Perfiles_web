// Datos mock que simulan lo que llegará desde el backend
const mockOrdenes = [
  {
    fechaCompra: "2025-06-02",
    totalPagado: 150000,
    tipoServicio: "Campañas RRSS Premium",
    fechaServicio: "2025-06-12 11:00"
  },
  {
    fechaCompra: "2025-06-01",
    totalPagado: 100000,
    tipoServicio: "Landing Page",
    fechaServicio: "2025-06-15 15:00"
  },
  {
    fechaCompra: "2025-05-28",
    totalPagado: 250000,
    tipoServicio: "Desarrollo E-Commerce",
    fechaServicio: "2025-06-20 09:30"
  }
];

//fetch("https://tu-backend.com/api/ordenes")
//  .then(res => res.json())
//  .then(data => renderizarOrdenes(data));

// Función para renderizar las tarjetas en el DOM
function renderizarOrdenes(ordenes) {
  const contenedor = document.getElementById("contenedor-ordenes");
  contenedor.innerHTML = ""; // Limpiar

  if (ordenes.length === 0) {
    contenedor.innerHTML = "<p>No se encontraron órdenes para esa fecha.</p>";
    return;
  }

  ordenes.forEach((orden) => {
    const tarjeta = document.createElement("div");
    tarjeta.classList.add("orden-tarjeta");

    tarjeta.innerHTML = `
      <div class="orden-detalles">
        <p><span>Fecha de compra:</span> ${orden.fechaCompra}</p>
        <p><span>Total pagado:</span> $${orden.totalPagado.toLocaleString()}</p>
        <p><span>Tipo de servicio:</span> ${orden.tipoServicio}</p>
        <p><span>Fecha y hora del servicio:</span> ${orden.fechaServicio}</p>
      </div>
      <button class="btn-ver" onclick='verDetalle(${JSON.stringify(orden)})'>Ver</button>
    `;

    contenedor.appendChild(tarjeta);
  });
}

// Filtro por fecha de compra
document.addEventListener("DOMContentLoaded", () => {
  renderizarOrdenes(mockOrdenes); // Cargar todas al inicio

  const inputFecha = document.getElementById("buscadorFecha");

  inputFecha.addEventListener("input", () => {
    const valor = inputFecha.value.trim(); // formato yyyy-mm-dd

    if (valor === "") {
      renderizarOrdenes(mockOrdenes);
      return;
    }

    const filtradas = mockOrdenes.filter((orden) =>
      orden.fechaCompra.includes(valor)
    );

    renderizarOrdenes(filtradas);
  });
});

function verDetalle(orden) {
  localStorage.setItem("ordenSeleccionada", JSON.stringify(orden));
  window.location.href = "detalle-orden.html";
}
