document.addEventListener('DOMContentLoaded', function() {
    const imageInput = document.getElementById('input-image');
    const imagePreview = document.getElementById('image-preview');

    if (imageInput && imagePreview) {
        imageInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    // Limpiar el contenedor de vista previa
                    imagePreview.innerHTML = '';
                    
                    // Crear y configurar la imagen de vista previa
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    img.alt = 'Vista previa de la imagen';
                    img.style.maxWidth = '200px';
                    img.style.maxHeight = '200px';
                    img.style.objectFit = 'cover';
                    img.style.borderRadius = '50%';
                    img.style.margin = '10px 0';
                    
                    // Agregar la imagen al contenedor de vista previa
                    imagePreview.appendChild(img);
                };
                reader.readAsDataURL(file);
            }
        });
    }
}); 