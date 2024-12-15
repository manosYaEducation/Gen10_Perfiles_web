let imagenes = [
  {
      "url": "../assets/image-charla/img1.jpg",
      

  },
  {
      "url": "../assets/image-charla/img2.jpg",
     

  },
  {
      "url": "../assets/image-charla/img3.jpg",
      

  },
  {
      "url": "../assets/image-charla/img4.jpg",
      

  },
  {
      "url": "../assets/image-charla/img5.jpg",
      

  },
  {
      "url": "../assets/image-charla/img6.jpg",
      
  },
  {
      "url": "../assets/image-charla/img7.jpg",
      
  },
  {
      "url": "../assets/image-charla/img8.jpg",
      

  },
  {
      "url": "../assets/image-charla/img9.jpg",
      
  },
  {
      "url": "../assets/image-charla/img10.jpg",
      

  },
  {
    "url": "../assets/image-charla/img11.jpg",
    

},
];

let atras = document.getElementById('atras');
let adelante = document.getElementById('adelante');
let imagen = document.getElementById('img');
let puntos = document.getElementById('puntos');
let actual = 0;

// Función para actualizar la imagen del carrusel
function actualizarCarrusel() {
  imagen.innerHTML = `<img class="img" src="${imagenes[actual].url}" alt="Imagen carrusel" loading="lazy"></img>`;
  posicionCarrusel();
}

// Navegación manual
atras.addEventListener('click', function() {
  actual = (actual - 1 + imagenes.length) % imagenes.length;
  actualizarCarrusel();
});

adelante.addEventListener('click', function() {
  actual = (actual + 1) % imagenes.length;
  actualizarCarrusel();
});

// Actualiza los puntos de posición
function posicionCarrusel() {
  puntos.innerHTML = "";
  for (let i = 0; i < imagenes.length; i++) {
      puntos.innerHTML += `<p class="${i === actual ? 'bold' : ''}">.</p>`;
  }
}

// Autoavance del carrusel
function iniciarAutoCarrusel() {
  setInterval(() => {
    actual = (actual + 1) % imagenes.length;
    actualizarCarrusel();
  }, 3000); // Cambia cada 3 segundos
}

// Inicialización del carrusel
actualizarCarrusel();
iniciarAutoCarrusel();
