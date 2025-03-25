document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('ClientForm');
    const imageInput = document.getElementById('input-image');
    const imagePreview = document.getElementById('image-preview');
    
    
    imageInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            if (!file.type.match('image.*')) {
                Swal.fire({
                    title: 'Error',
                    text: 'Por favor, selecciona un archivo de imagen válido',
                    icon: 'error'
                });
                return;
            }

            const reader = new FileReader();
            
            reader.onload = function(e) {
                
                let previewImg = imagePreview.querySelector('img');
                if (!previewImg) {
                    previewImg = document.createElement('img');
                    imagePreview.appendChild(previewImg);
                }
                previewImg.src = e.target.result;
                
                // Cambiar estilos para mostrar la imagen
                imagePreview.classList.add('has-image');
            };
            
            reader.onerror = function() {
                Swal.fire({
                    title: 'Error',
                    text: 'Ocurrió un error al leer la imagen',
                    icon: 'error'
                });
            };
            
            reader.readAsDataURL(file);
        }
    });
    
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        registerClient(event);
    });
});

async function registerClient(event) {
    try {
        // Validación básica
        const name = document.getElementById('input-name').value.trim();
        const company = document.getElementById('input-company').value.trim();
        const email = document.getElementById('input-email').value.trim();
        const phone = document.getElementById('input-phone').value.trim();
        
        if (!name || !company || !email || !phone) {
            Swal.fire({
                title: 'Campos requeridos',
                text: 'Por favor completa todos los campos obligatorios',
                icon: 'warning'
            });
            return;
        }

        const location = document.getElementById('input-location').value.trim();
        const description = document.getElementById('input-description').value.trim();
        
        const imageInput = document.getElementById('input-image');
        const imageFile = imageInput.files[0];

        if (imageFile) {
            const reader = new FileReader();
            reader.onloadend = function() {
                const newClient = {
                    basic: {
                        name,
                        company,
                        email,
                        location,
                        phone,
                        description
                    },
                    image: reader.result
                };
                sendClientData(newClient);
            };
            reader.readAsDataURL(imageFile);
        } else {
            const newClient = {
                basic: {
                    name,
                    company,
                    email,
                    location,
                    phone,
                    description
                }
            };
            sendClientData(newClient);
        }
    } catch (error) {
        console.error("Error in registerClient:", error);
        Swal.fire({
            title: 'Error',
            text: 'Ocurrió un error al procesar el formulario',
            icon: 'error'
        });
    }
}

function sendClientData(clientData) {
    
    Swal.fire({
        title: 'Creando cliente...',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    fetch(API_URL_PHP + 'create-client.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(clientData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en la respuesta del servidor');
        }
        return response.json();
    })
    .then(result => {
        Swal.close();
        if (result.success) {
            document.getElementById('ClientForm').reset();
            // Limpiar previsualización de imagen
            const imagePreview = document.getElementById('image-preview');
            imagePreview.classList.remove('has-image');
            imagePreview.innerHTML = '<i class="fas fa-camera"></i><span>Subir foto</span>';
            
            Swal.fire({
                icon: 'success',
                title: 'Cliente creado con éxito',
                showConfirmButton: true,
                confirmButtonText: 'Aceptar'
            }).then(() => {
                window.location.href = 'index-admin.html';
            });
        } else {
            throw new Error(result.message || 'Error al crear cliente');
        }
    })
    .catch(error => {
        Swal.fire({
            title: 'Error',
            text: error.message || 'Error de conexión',
            icon: 'error'
        });
    });
}