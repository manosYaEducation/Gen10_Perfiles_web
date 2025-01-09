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

    console.log("En la consola, mi calificacion es: ", selectedRating)
    
  });
});