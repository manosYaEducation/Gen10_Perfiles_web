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
        const response = await fetch(`${window.API_URL_PHP}read_user.php?id=${id}`);
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

        const profile = result.data;

        // Pre-llenar el formulario con los datos existentes del perfil
        document.getElementById('input-name').value = profile.basic.name || '';
        document.getElementById('input-location').value = profile.basic.location || '';
        document.getElementById('input-phone').value = profile.basic.phone || '';
        document.getElementById('input-phrase').value = profile.basic.phrase || '';
        document.getElementById('input-email').value = profile.basic.email || '';
        document.getElementById('input-description').value = profile.basic.description || '';
        document.getElementById('input-social-platform').value = profile.social ? profile.social[0]?.platform || '' : '';
        document.getElementById('input-social-url').value = profile.social ? profile.social[0]?.url || '' : '';
        
        // Cargar Habilidades e Intereses
        document.getElementById('input-skill').value = profile.skill || ''; // Si hay habilidades
        document.getElementById('input-interest').value = profile.interest || ''; // Si hay intereses

        // Agregar experiencia y educación al formulario si aplica
    
        const experienceContainer = document.getElementById('experience-container');
        experienceContainer.innerHTML = ''; 
        if (profile.experience) {
            profile.experience.forEach(exp => {
                const experienceItem = document.createElement('div');
                experienceItem.classList.add('experience-item');
                experienceItem.innerHTML = `
                    <label>Título de la experiencia:</label>
                    <input type="text" class="input-experience-title" value="${exp.title || ''}" placeholder="Título">
                    <label>Fecha de inicio:</label>
                    <input type="date" class="input-experience-startDate" value="${exp.startdate || ''}">
                    <label>Fecha de finalización:</label>
                    <input type="date" class="input-experience-endDate" value="${exp.enddate || ''}">
                    <button type="button" class="remove-btn">Eliminar</button>
                `;
                experienceContainer.appendChild(experienceItem);

                experienceItem.querySelector('.remove-btn').addEventListener('click', () => {
                    experienceContainer.removeChild(experienceItem);
                });
            });
        }
        //agraga nueva experiencia si es el usuario quiere 
        document.getElementById('addExperience').addEventListener('click', () => {
            const container = document.getElementById('experience-container');
            const experienceItem = document.createElement('div');
            experienceItem.classList.add('experience-item');
            experienceItem.innerHTML = `
                <label>Título de la experiencia:</label>
                <input type="text" class="input-experience-title" placeholder="Título">
                <label>Fecha de inicio:</label>
                <input type="date" class="input-experience-startDate">
                <label>Fecha de finalización:</label>
                <input type="date" class="input-experience-endDate">
                <button type="button" class="remove-btn">Eliminar</button>
            `;
            container.appendChild(experienceItem);
        
            experienceItem.querySelector('.remove-btn').addEventListener('click', () => {
                container.removeChild(experienceItem);
            });
        });
    //Agrega nueva experiencia si es nesecario
    document.getElementById('addEducation').addEventListener('click', () => {
        const container = document.getElementById('education-container');
        const educationItem = document.createElement('div');
        educationItem.classList.add('education-item');
        educationItem.innerHTML = `
            <label>Título:</label>
            <input type="text" class="input-education-title" placeholder="Título">
            <label>Fecha de inicio:</label>
            <input type="date" class="input-education-startDate">
            <label>Fecha de finalización:</label>
            <input type="date" class="input-education-endDate">
            <label>Institución:</label>
            <input type="text" class="input-education-institution" placeholder="Institución">
            <button type="button" class="remove-btn">Eliminar</button>
        `;
        container.appendChild(educationItem);
    
        educationItem.querySelector('.remove-btn').addEventListener('click', () => {
            container.removeChild(educationItem);
        });
    });
    // LLna el formulario de educacion si existe informacion previa
        const educationContainer = document.getElementById('education-container');
         educationContainer.innerHTML = ''; 
        if (profile.education) {
            profile.education.forEach(edu => {
                const educationItem = document.createElement('div');
                educationItem.classList.add('education-item');
                educationItem.innerHTML = `
                    <label>Título:</label>
                    <input type="text" class="input-education-title" value="${edu.title || ''}" placeholder="Título">
                    <label>Fecha de inicio:</label>
                    <input type="date" class="input-education-startDate" value="${edu.startdate || ''}">
                    <label>Fecha de finalización:</label>
                    <input type="date" class="input-education-endDate" value="${edu.enddate || ''}">
                    <label>Institución:</label>
                    <input type="text" class="input-education-institution" value="${edu.institution || ''}" placeholder="Institución">
                    <button type="button" class="remove-btn">Eliminar</button>
                `;
                educationContainer.appendChild(educationItem);

                educationItem.querySelector('.remove-btn').addEventListener('click', () => {
                    educationContainer.removeChild(educationItem);
                });
            });
        }
    
        // Mostrar la imagen actual si existe
        if (profile.image) {
            imagePreview.innerHTML = `<img src="${profile.image}" alt="Foto de perfil actual" style="max-width: 200px;">`;
            base64Image = profile.image;
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
                location: document.getElementById('input-location').value.trim(),
                phone: document.getElementById('input-phone').value.trim(),
                email: document.getElementById('input-email').value.trim(),
                description: document.getElementById('input-description').value.trim(),
                phrase: document.getElementById('input-phrase').value.trim(),
            },
            social: [{
                platform: document.getElementById('input-social-platform').value.trim(),
                url: document.getElementById('input-social-url').value.trim(),
            }],
            skills: document.getElementById('input-skill').value.trim(),
            interests: document.getElementById('input-interest').value.trim(),
            experience: Array.from(document.querySelectorAll('.experience-item')).map(item => ({
                title: item.querySelector('.input-experience-title').value.trim(),
                startDate: item.querySelector('.input-experience-startDate').value.trim(),
                endDate: item.querySelector('.input-experience-endDate').value.trim(),
            })),
            education: Array.from(document.querySelectorAll('.education-item')).map(item => ({
                title: item.querySelector('.input-education-title').value.trim(),
                startDate: item.querySelector('.input-education-startDate').value.trim(),
                endDate: item.querySelector('.input-education-endDate').value.trim(),
                institution: item.querySelector('.input-education-institution').value.trim(),
            })),
            image: base64Image // Agregar la imagen al objeto
        };

        try {
            const response = await fetch(`${window.API_URL_PHP}update_users.php`, {
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
