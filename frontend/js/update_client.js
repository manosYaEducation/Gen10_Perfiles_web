document.addEventListener("DOMContentLoaded", async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    
    // Verificar si el ID está presente en la URL
    if (!id) {
        console.error('ID no proporcionado en la URL');
        Swal.fire({
            title: 'Error',
            text: 'No se proporcionó el ID del perfil en la URL.',
            icon: 'error',
            confirmButtonText: 'Aceptar',
        });
        return;
    }

    const form = document.getElementById('userForm');

    // Agregar el manejo de la imagen
    const imageInput = document.getElementById('input-image');
    const imagePreview = document.getElementById('image-preview');
    let base64Image = null;

    imageInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                base64Image = e.target.result;
                imagePreview.innerHTML = `<img src="${base64Image}" alt="Vista previa" style="max-width: 200px;">`;
            };
            reader.readAsDataURL(file);
        }
    });

    // Cargar los datos actuales del usuario en el formulario
    try {
        const response = await fetch(`${window.API_URL_PHP}read_client_update.php?id=${id}`);
        const result = await response.json();

        if (!result || !result.data) {
            console.error('Datos no encontrados');
            Swal.fire({
                title: 'Error',
                text: 'No se encontraron datos para este perfil.',
                icon: 'error',
                confirmButtonText: 'Aceptar',
            });
            return;
        }

        const client = result.data;

        // Pre-llenar el formulario con los datos existentes del perfil
        document.getElementById('input-name').value = client.basic.name || '';
        document.getElementById('input-company').value = client.basic.company || '';
        document.getElementById('input-email').value = client.basic.email || '';
        document.getElementById('input-location').value = client.basic.location || '';
        document.getElementById('input-phone').value = client.basic.phone || '';
        document.getElementById('input-description').value = client.basic.description || '';
    
        // Mostrar la imagen actual si existe
        if (client.image) {
            imagePreview.innerHTML = `<img src="${client.image}" alt="Foto de perfil actual" style="max-width: 200px;">`;
            base64Image = client.image;
        }

    } catch (error) {
        console.error("Error al obtener los datos del usuario:", error);
        Swal.fire({
            title: 'Error',
            text: 'Hubo un error al obtener los datos del perfil.',
            icon: 'error',
            confirmButtonText: 'Aceptar',
        });
    }

    // Función para actualizar los datos cuando el formulario se envíe
    form.addEventListener('submit', async function(event) {
        event.preventDefault();

        // Obtener los datos del formulario
        const updatedUser = {
            id: id,  // Incluir el ID recuperado de la URL
            basic: {
                name: document.getElementById('input-name').value.trim(),
                company: document.getElementById('input-company').value.trim(),
                email: document.getElementById('input-email').value.trim(),
                location: document.getElementById('input-location').value.trim(),
                phone: document.getElementById('input-phone').value.trim(),
                description: document.getElementById('input-description').value.trim(),
            },
            image: base64Image // Agregar la imagen al objeto
        };

        try {
            const response = await fetch(`${window.API_URL_PHP}update_clients.php`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedUser),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Error del servidor:", errorText);
                throw new Error(`Error HTTP ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();
            if (result.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Perfil actualizado con éxito',
                    showConfirmButton: false,
                    timer: 1500, 
                    willClose: () => {history.back();}
            });

            } else {
                console.error("Error al actualizar perfil:", result.message);
                Swal.fire({
                    icon: 'error',
                    title: 'Error al actualizar perfil',
                    text: result.message || 'Ocurrió un error desconocido',
                    confirmButtonText: 'Aceptar',
                });
            }

        } catch (error) {
            console.error("Error al enviar la solicitud de actualización:", error);
            Swal.fire({
                title: 'Error',
                text: error.message || 'Hubo un error al procesar la solicitud',
                icon: 'error',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#d33',
            });
        }
    });
});