fetch('llamar_modulo_servicio.php', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    console.log('Órdenes recibidas:', data);
    // Aquí puedes manipular el array de órdenes recibido
  })
  .catch(error => {
    console.error('Error al consultar órdenes:', error);
  });

