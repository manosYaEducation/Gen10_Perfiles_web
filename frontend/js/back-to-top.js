document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded');
    
    // Get the button
    let backToTopBtn = document.getElementById("backToTopBtn");
    console.log('Button found:', backToTopBtn);

    // Show or hide the button based on scroll position
    window.addEventListener('scroll', function() {
        // Show button if scrolled down more than 300px
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });

    // When the user clicks on the button, scroll to the top of the document
    backToTopBtn.addEventListener("click", function(e) {
        console.log('Button clicked');
        e.preventDefault();
        
        // Smooth scroll to top
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}); 