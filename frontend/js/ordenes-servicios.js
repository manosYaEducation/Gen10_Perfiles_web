// Datos mock que simulan lo que llegará desde el backend
// const mockOrdenes = [
//   {
//     id: "ORD-001",
//     cliente: "Empresa Alpha",
//     fechaCompra: "2025-06-02",
//     totalPagado: 150000,
//     tipoServicio: "Campañas RRSS Premium",
//     fechaServicio: "2025-06-12 11:00",
//     estado: "Pendiente"
//   },
//   {
//     id: "ORD-002",
//     cliente: "Cliente Beta",
//     fechaCompra: "2025-06-01",
//     totalPagado: 100000,
//     tipoServicio: "Landing Page",
//     fechaServicio: "2025-06-15 15:00",
//     estado: "Completado"
//   },
//   {
//     id: "ORD-003",
//     cliente: "Negocio Gamma",
//     fechaCompra: "2025-05-28",
//     totalPagado: 250000,
//     tipoServicio: "Desarrollo E-Commerce",
//     fechaServicio: "2025-06-20 09:30",
//     estado: "En Progreso"
//   }
// ];

// DOM Elements
const cardsViewBtn = document.getElementById("cardsViewBtn");
const cardsContainer = document.getElementById("contenedor-ordenes"); 
const tableViewBtn = document.getElementById("tableViewBtn");
const tablaOrdenesContainer = document.getElementById("tabla-ordenes");
const tablaOrdenesBody = document.getElementById("tabla-ordenes-body");
const adminTableViewBtn = document.getElementById("adminTableViewBtn");
const adminTablaOrdenesContainer = document.getElementById("admin-tabla-ordenes-container");
const adminTablaOrdenesBody = document.getElementById("admin-tabla-ordenes-body");
const inputFecha = document.getElementById("buscadorFecha");
const filtroEstado = document.getElementById("filtroEstado");

let ordenesOriginales = []; // Para almacenar todas las órdenes de la API
let ordenesFiltradas = []; // Para almacenar las órdenes filtradas por fecha

// Original mockOrdenes for reference if needed, but we'll use the new one above.
/*
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
*/

//fetch("https://tu-backend.com/api/ordenes")
//  .then(res => res.json())
//  .then(data => renderizarOrdenes(data));



// Función para renderizar la vista de TARJETAS
function renderizarTarjetasView(ordenes) {
  // const contenedor = document.getElementById("contenedor-ordenes"); // Now using global cardsContainer
  cardsContainer.innerHTML = ""; // Limpiar

  if (ordenes.length === 0) {
    cardsContainer.innerHTML = "<p>No se encontraron órdenes para esa fecha.</p>";
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

    cardsContainer.appendChild(tarjeta);
  });
}

// Función para renderizar la vista de TABLA SIMPLE
function renderizarTablaSimpleView(ordenes) {
  tablaOrdenesBody.innerHTML = ""; // Limpiar

  if (ordenes.length === 0) {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td colspan="6" style="text-align:center;">No se encontraron órdenes.</td>`;
    tablaOrdenesBody.appendChild(tr);
    return;
  }

  ordenes.forEach(orden => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td style="padding: 10px 12px; border-bottom: 1px solid #eee;">${orden.id || 'N/A'}</td>
      <td style="padding: 10px 12px; border-bottom: 1px solid #eee;">${orden.cliente || 'N/A'}</td>
      <td style="padding: 10px 12px; border-bottom: 1px solid #eee;">${orden.tipoServicio}</td>
      <td style="padding: 10px 12px; border-bottom: 1px solid #eee;">${orden.fechaCompra}</td>
      <td style="padding: 10px 12px; border-bottom: 1px solid #eee;">${orden.estado || 'N/A'}</td>
      <td style="padding: 10px 12px; border-bottom: 1px solid #eee; text-align: right;">
        <button class="btn-ver-tabla" onclick='verDetalle(${JSON.stringify(orden)})' style="padding: 6px 10px; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">Ver</button>
      </td>
    `;
    tablaOrdenesBody.appendChild(tr);
  });
}

// Función para renderizar la vista de TABLA ADMIN
function renderizarAdminTablaView(ordenes) {
  adminTablaOrdenesBody.innerHTML = ""; // Limpiar

  if (ordenes.length === 0) {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td colspan="8" style="text-align:center;">No se encontraron órdenes.</td>`;
    adminTablaOrdenesBody.appendChild(tr);
    return;
  }

  ordenes.forEach(orden => {
    const tr = document.createElement("tr");
    tr.style.borderBottom = "1px solid #e0e0e0";
    tr.innerHTML = `
      <td style="padding: 10px 15px;">${orden.id}</td>
      <td style="padding: 10px 15px;">${orden.cliente}</td>
      <td style="padding: 10px 15px;">${orden.fechaCompra}</td>
      <td style="padding: 10px 15px;">$${orden.totalPagado.toLocaleString()}</td>
      <td style="padding: 10px 15px;">${orden.tipoServicio}</td>
      <td style="padding: 10px 15px;">${orden.fechaServicio}</td>
      <td style="padding: 10px 15px;">
        <span class="status-badge status-${orden.estado ? orden.estado.toLowerCase().replace(' ', '-') : 'default'}">${orden.estado}</span>
      </td>
      <td style="padding: 10px 15px; text-align: center;">
        <button class="btn-accion-tabla" onclick='verDetalle(${JSON.stringify(orden)})' title="Ver Detalles" style="background: none; border: none; color: #007bff; cursor: pointer; margin-right: 8px;"><i class="fas fa-eye"></i></button>
        <button class="btn-accion-tabla" onclick='console.log("Editar orden:", ${JSON.stringify(orden)})' title="Editar" style="background: none; border: none; color: #ffc107; cursor: pointer; margin-right: 8px;"><i class="fas fa-edit"></i></button>
        <button class="btn-accion-tabla" onclick='console.log("Eliminar orden:", ${JSON.stringify(orden)})' title="Eliminar" style="background: none; border: none; color: #dc3545; cursor: pointer;"><i class="fas fa-trash"></i></button>
      </td>
    `;
    adminTablaOrdenesBody.appendChild(tr);
  });
}

// Helper function to manage view containers and button states
function actualizarContenedoresVista(vistaActiva) {
  cardsContainer.style.display = (vistaActiva === 'tarjetas') ? "grid" : "none";
  tablaOrdenesContainer.style.display = (vistaActiva === 'tablaSimple') ? "block" : "none";
  adminTablaOrdenesContainer.style.display = (vistaActiva === 'tablaAdmin') ? "block" : "none";

  cardsViewBtn.classList.toggle("active", vistaActiva === 'tarjetas');
  tableViewBtn.classList.toggle("active", vistaActiva === 'tablaSimple');
  adminTableViewBtn.classList.toggle("active", vistaActiva === 'tablaAdmin');
}

// Función para determinar qué renderizar basado en la vista activa y los datos
function renderizarVistaActual(datos) {
  if (cardsViewBtn.classList.contains("active")) {
    renderizarTarjetasView(datos);
  } else if (tableViewBtn.classList.contains("active")) {
    renderizarTablaSimpleView(datos);
  } else if (adminTableViewBtn.classList.contains("active")) {
    renderizarAdminTablaView(datos);
  }
}

// Función para cargar órdenes desde la API
async function cargarOrdenesDesdeAPI() {
  try {
    const response = await fetch('../pruebatraerinfodesdemoduloservicio/llamar_modulo_servicio.php', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();
    console.log('Datos recibidos de la API:', data);

    // Mapear los datos de la API a la estructura que esperan las funciones de renderizado
    ordenesOriginales = data.map(ordenAPI => {
      const clienteNombre = (ordenAPI.nombre || '') + ' ' + (ordenAPI.apellido || '');
      let fechaCompraFormateada = 'N/A';
      if (ordenAPI.fecha_creacion) {
        try {
          fechaCompraFormateada = new Date(ordenAPI.fecha_creacion).toISOString().split('T')[0];
        } catch (e) {
          console.error("Error al formatear fecha_creacion:", ordenAPI.fecha_creacion, e);
        }
      }

      let calculadoTotalPagado = 0;
      let calculadoTipoServicio = 'N/A';

      if (ordenAPI.servicios_json) {
        try {
          const servicios = JSON.parse(ordenAPI.servicios_json);
          if (Array.isArray(servicios) && servicios.length > 0) {
            // Calcular totalPagado
            servicios.forEach(servicio => {
              calculadoTotalPagado += parseFloat(servicio.precio || 0);
              // Considerar precios de opciones seleccionadas si es necesario
              if (Array.isArray(servicio.opcionesSeleccionadas)) {
                servicio.opcionesSeleccionadas.forEach(opcion => {
                  if (opcion.seleccionado && opcion.precio) { // Asumiendo que 'seleccionado' es un booleano
                    calculadoTotalPagado += parseFloat(opcion.precio);
                  }
                });
              }
            });

            // Determinar tipoServicio (nombre del primer servicio)
            calculadoTipoServicio = servicios[0].nombre || 'Servicio sin nombre';
            if (servicios.length > 1) {
              // Opcional: ajustar si hay múltiples servicios
              // calculadoTipoServicio += ' y otros'; 
            }
          }
        } catch (e) {
          console.error('Error al parsear servicios_json o procesar servicios:', ordenAPI.servicios_json, e);
          // Mantener valores por defecto si hay error
        }
      }

      const totalPagado = calculadoTotalPagado;
      const tipoServicio = calculadoTipoServicio;
      const fechaServicio = fechaCompraFormateada; // Usar la misma fecha que fechaCompra (derivada de fecha_creacion)
      const estado = ordenAPI.estado_pago || 'Pendiente';

      return {
        id: ordenAPI.id,
        cliente: clienteNombre.trim() || 'N/A',
        fechaCompra: fechaCompraFormateada,
        totalPagado: totalPagado,
        tipoServicio: tipoServicio,
        fechaServicio: fechaServicio,
        estado: estado,
        servicios_json: ordenAPI.servicios_json // Mantener para futuro uso
      };
    });

    console.log('Órdenes mapeadas:', ordenesOriginales); // Para depuración
    ordenesFiltradas = [...ordenesOriginales];
    renderizarVistaActual(ordenesFiltradas);
    actualizarContenedoresVista('tarjetas'); // Asegurar que la vista inicial se muestre

  } catch (error) {
    console.error('Error al cargar órdenes desde la API:', error);
    // Opcional: Mostrar un mensaje al usuario en la UI
    const contenedor = document.getElementById("contenedor-ordenes") || document.getElementById("tabla-ordenes-simple-body") || document.getElementById("admin-tabla-ordenes-body");
    if(contenedor) contenedor.innerHTML = "<p>Error al cargar las órdenes. Intente más tarde.</p>";
    // Fallback a mock data o dejar vacío
    // ordenesOriginales = [...mockOrdenes]; // Descomentar si se quiere usar mock data como fallback
    // ordenesFiltradas = [...ordenesOriginales];
    // renderizarVistaActual(ordenesFiltradas);
  }
}

// Event Listeners y Lógica Principal
document.addEventListener("DOMContentLoaded", () => {
  cargarOrdenesDesdeAPI(); // Cargar datos de la API al iniciar
  // La vista inicial y renderizado se manejan dentro de cargarOrdenesDesdeAPI después de obtener los datos

  cardsViewBtn.addEventListener("click", () => {
    actualizarContenedoresVista('tarjetas');
    renderizarTarjetasView(ordenesFiltradas);
  });

  tableViewBtn.addEventListener("click", () => {
    actualizarContenedoresVista('tablaSimple');
    renderizarTablaSimpleView(ordenesFiltradas);
  });

  adminTableViewBtn.addEventListener("click", () => {
    actualizarContenedoresVista('tablaAdmin');
    renderizarAdminTablaView(ordenesFiltradas);
  });

  // Función para aplicar filtros
  function aplicarFiltros() {
    const fechaValor = inputFecha.value.trim();
    const estadoValor = filtroEstado.value;

    ordenesFiltradas = mockOrdenes.filter(orden => {
      const cumpleFecha = fechaValor === "" || orden.fechaCompra.includes(fechaValor);
      const cumpleEstado = estadoValor === "" || orden.estado === estadoValor;
      return cumpleFecha && cumpleEstado;
    });

    renderizarVistaActual(ordenesFiltradas);
  }

  inputFecha.addEventListener("input", aplicarFiltros);
  filtroEstado.addEventListener("change", aplicarFiltros);
});

function verDetalle(ordenJson) {
  // Asegurarse que el objeto orden es el correcto, no el string JSON
  const orden = typeof ordenJson === 'string' ? JSON.parse(ordenJson.replace(/&quot;/g, '"')) : ordenJson;
  localStorage.setItem("ordenSeleccionada", JSON.stringify(orden));
  window.location.href = "detalle-orden.html";
}

// La función de exportar a Excel y notificaciones (previamente implementada)
// Asegúrate que esta función utiliza 'ordenesFiltradas' para exportar los datos correctos.
const exportExcelBtn = document.getElementById('export-excel');
if (exportExcelBtn) {
    exportExcelBtn.addEventListener('click', exportarOrdenesExcel);
}

function exportarOrdenesExcel() {
    // Usar 'ordenesFiltradas' para asegurar que se exportan los datos actualmente visibles/filtrados
    // Si ordenesFiltradas está vacío pero hay ordenesOriginales (ej. filtro no arroja resultados), exportar las originales o un array vacío.
    const dataToExport = ordenesFiltradas.length > 0 ? ordenesFiltradas : (inputFecha.value.trim() === '' ? ordenesOriginales : []);

    if (dataToExport.length === 0) {
        showNotification("No hay datos para exportar.", "warning");
        return;
    }

    try {
        // Crear encabezados personalizados
        const headers = [
            "ID Orden", "Cliente", "Fecha Compra", "Total Pagado", 
            "Tipo Servicio", "Fecha Servicio", "Estado"
        ];

        // Mapear los datos a un array de arrays, seleccionando y formateando los campos
        const data = dataToExport.map(orden => [
            orden.id,
            orden.cliente,
            orden.fechaCompra,
            orden.totalPagado,
            orden.tipoServicio,
            orden.fechaServicio,
            orden.estado
        ]);

        // Crear la hoja de trabajo
        const ws = XLSX.utils.aoa_to_sheet([headers, ...data]);

        // Ajustar anchos de columnas (opcional, pero mejora la presentación)
        const columnWidths = headers.map((_, i) => ({ wch: i === 1 || i === 4 ? 30 : 15 })); // Cliente y Tipo Servicio más anchos
        ws['!cols'] = columnWidths;

        // Crear el libro de trabajo
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Órdenes");

        // Generar el archivo y descargarlo
        const today = new Date().toISOString().slice(0, 10);
        XLSX.writeFile(wb, `Ordenes_Servicio_${today}.xlsx`);

        showNotification("Datos exportados a Excel exitosamente.", "success");

    } catch (error) {
        console.error("Error al exportar a Excel:", error);
        showNotification("Error al exportar los datos. Intente de nuevo.", "error");
    }
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Auto-cierre de la notificación
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// La función verDetalle original, por si se necesita restaurar o comparar.
/* function verDetalle(orden) {
  localStorage.setItem("ordenSeleccionada", JSON.stringify(orden));
  window.location.href = "detalle-orden.html";
}*/
