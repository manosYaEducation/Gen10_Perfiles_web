const stars = document.querySelectorAll('.star');
const ratingDisplay = document.getElementById('rating-display');
let selectedRating = 0;
stars.forEach(star => {
  star.addEventListener('click', () => {
    selectedRating = star.getAttribute('data-value');
    stars.forEach(s => s.src = '../assets/img/star001.png');
    for (let i = 0; i < selectedRating; i++) {
      stars[i].src = '../assets/img/star.png';
    }
  });
});

document.addEventListener("DOMContentLoaded", function() {
  const urlParams = new URLSearchParams(window.location.search);
  const profileId = urlParams.get('id');
  
  const profileIdInput = document.getElementById('input-profileid');
  if (profileIdInput) {
      profileIdInput.value = profileId;
  }

  const addReviewLink = document.getElementById('add-review-link');
  if (addReviewLink) {
      addReviewLink.href = `../resenas.html?id=${profileId}`;
  }
});

const registerReview = async () => {
  //Se obtienen los elementos del html mediante su ID
  //y con ello sus elementos
  const nameClient = document.getElementById("input-nameClient").value;
  const company = document.getElementById("input-company").value;
  const comments = document.getElementById("input-comments").value;
  const profileId = document.getElementById("input-profileid").value;

  //Se crea un objeto con los datos del formulario
  const review = {
    statusid: 1,
    profileid: profileId, 
    nameClient,
    company,
    comments,
    rating: selectedRating,
    date_review: new Date()
  };

  //Se envía la petición POST al servidor
  fetch(API_URL_PHP + 'create_review.php', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(review)
})
  //Se obtiene la respuesta del servidor
.then(response => response.json())
.then(() => {
    //Si la respuesta es exitosa, se muestra un mensaje para el usuario
    const modal = document.getElementById('successModal');
    modal.showModal();
})
.catch(error => {
    console.error("Error:", error);
});}

//Se obtiene el botón de cerrar del modal
function closeModal() {
    const modal = document.getElementById('successModal');
    modal.close();
    //Regresa a la página del perfil
    window.history.back();
}