console.log('Cargando métricas...');

// Se pide el contenido de metrics.php
fetch('http://localhost/Gen10_Perfiles_web/backend/metrics.php') // https://kreative.alphadocere.cl/backend/metrics.php
// Toma la respuesta y la convierte en formato JSON
.then((response) => response.json())
// Llama un elemento en el HTML que tenga dicha id y luego cambia su valor al extraido en data
.then((data) => {
    document.getElementById('proyectos-count').textContent =data.total_proyectos;
    document.getElementById('profiles-count').textContent = data.total_profiles;
    document.getElementById('clients-count').textContent = data.total_clients;
  })
  .catch((error) => {
    console.error('Error al cargar las métricas:', error);
  });


  
