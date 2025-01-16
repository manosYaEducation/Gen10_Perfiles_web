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
    console.log("En la consola, mi calificacion es: ", selectedRating);
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
  console.log("Botón de enviar clickeado"); 
  const nameClient = document.getElementById("input-nameClient").value;
  const company = document.getElementById("input-company").value;
  const comments = document.getElementById("input-comments").value;
  const profileId = document.getElementById("input-profileid").value;
  console.log({ nameClient, company, comments, selectedRating,}); 

  const review = {
    statusid: 1,
    profileid: profileId, 
    nameClient,
    company,
    comments,
    rating: selectedRating,
    date_review: new Date()
  };

  fetch(API_URL_PHP + 'create_review.php', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(review)
})
.then(response => response.json())
.then(() => {
  window.history.back()
})
.catch(error => {
    console.error("Error:", error);
});
}