document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const successModal = document.getElementById('successModal');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Validar el formulario antes de enviar
            if (!validateForm()) {
                return false;
            }
            
            // Mostrar indicador de carga
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.innerHTML;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            submitButton.disabled = true;
            
            // Recopilar datos del formulario
            const formData = new FormData(contactForm);
            
            // Enviar datos mediante AJAX
            fetch('../backend/send_email.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                // Restaurar el botón
                submitButton.innerHTML = originalButtonText;
                submitButton.disabled = false;
                
                if (data.success) {
                    // Mostrar modal de éxito
                    showSuccessModal();
                    // Limpiar formulario
                    contactForm.reset();
                } else {
                    // Mostrar mensaje de error
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: data.message || 'Ha ocurrido un error al enviar el mensaje. Por favor, inténtelo de nuevo.'
                    });
                    
                    // Si hay errores específicos, mostrarlos
                    if (data.errors && data.errors.length > 0) {
                        console.error('Errores de validación:', data.errors);
                    }
                }
            })
            .catch(error => {
                console.error('Error:', error);
                submitButton.innerHTML = originalButtonText;
                submitButton.disabled = false;
                
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Ha ocurrido un error al procesar la solicitud. Por favor, inténtelo de nuevo más tarde.'
                });
            });
        });
    }
    
    // Función para validar el formulario
    function validateForm() {
        const nombre = document.getElementById('nombre').value.trim();
        const email = document.getElementById('email').value.trim();
        const asunto = document.getElementById('asunto').value.trim();
        const mensaje = document.getElementById('mensaje').value.trim();
        
        // Validar campos requeridos
        if (!nombre || !email || !asunto || !mensaje) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos requeridos',
                text: 'Por favor, complete todos los campos obligatorios.'
            });
            return false;
        }
        
        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Swal.fire({
                icon: 'warning',
                title: 'Email inválido',
                text: 'Por favor, ingrese un correo electrónico válido.'
            });
            return false;
        }
        
        return true;
    }
    
    // Función para mostrar el modal de éxito
    function showSuccessModal() {
        if (successModal) {
            successModal.showModal();
        } else {
            // Si no existe el modal, usar SweetAlert
            Swal.fire({
                icon: 'success',
                title: '¡Mensaje enviado!',
                text: 'Agradecemos que se haya puesto en contacto con nosotros. Revisaremos su mensaje y responderemos a la brevedad.'
            });
        }
    }
});

// Función para cerrar el modal (llamada desde el HTML)
function closeModal() {
    const successModal = document.getElementById('successModal');
    if (successModal) {
        successModal.close();
    }
}
