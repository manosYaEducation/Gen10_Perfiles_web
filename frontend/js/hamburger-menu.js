document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger');
    const navbar = document.getElementById('navbar');
    
    // Función para alternar el menú
    function toggleMenu() {
        hamburger.classList.toggle('active');
        navbar.classList.toggle('active');
    }
    
    // Event listener para el botón hamburguesa
    hamburger.addEventListener('click', toggleMenu);
    
    // Función para cerrar el menú
    function closeMenu() {
        hamburger.classList.remove('active');
        navbar.classList.remove('active');
    }
    
    // Cerrar menú al hacer clic fuera de él
    document.addEventListener('click', function(event) {
        const isClickInsideNavbar = navbar.contains(event.target);
        const isClickOnHamburger = hamburger.contains(event.target);
        
        if (!isClickInsideNavbar && !isClickOnHamburger && navbar.classList.contains('active')) {
            closeMenu();
        }
    });
    
    // Cerrar menú al presionar Escape
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && navbar.classList.contains('active')) {
            closeMenu();
        }
    });
    
    // Cerrar menú al cambiar el tamaño de la ventana (si se hace más grande)
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && navbar.classList.contains('active')) {
            closeMenu();
        }
    });
}); 