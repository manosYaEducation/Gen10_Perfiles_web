async function createUser(event) {
    event.preventDefault();
    
    // Capturar datos de la información personal
    const name = document.getElementById('input-name').value;
    const location = document.getElementById('input-location').value;
    const phone = document.getElementById('input-phone').value;
    const email = document.getElementById('input-email').value;
    const description = document.getElementById('input-description').value;
    const phrase = document.getElementById('input-phrase').value;
    
    const socialPlatform = document.getElementById('input-social-platform').value;
    const socialUrl = document.getElementById('input-social-url').value;
    const skill = document.getElementById('input-skill').value;
    const interest = document.getElementById('input-interest').value;

    const experienceItems = document.querySelectorAll('.experience-item');
    const experiences = Array.from(experienceItems).map(item => ({
        experienceTitle: item.querySelector('.input-experience-title').value,
        experienceStartDate: item.querySelector('.input-experience-startDate').value,
        experienceEndDate: item.querySelector('.input-experience-endDate').value
    }));

    const educationItems = document.querySelectorAll('.education-item');
    const educations = Array.from(educationItems).map(item => ({
        educationTitle: item.querySelector('.input-education-title').value,
        educationStartDate: item.querySelector('.input-education-startDate').value,
        educationEndDate: item.querySelector('.input-education-endDate').value,
        educationInstitution: item.querySelector('.input-education-institution').value
    }));

    const imageInput = document.getElementById('input-image');
    const imageFile = imageInput.files[0];

    let imageBase64 = "";
    if (imageFile) {
        // Convertir la imagen a base64
        const reader = new FileReader();
        reader.onloadend = function () {
            imageBase64 = reader.result; 
            sendUserData(imageBase64); 
        };
        reader.readAsDataURL(imageFile); 
    } else {
        sendUserData(null); 
    }

    function sendUserData(imageBase64) {
        const newUser = {
            basic: {
                name,
                location,
                phone,
                email,
                description,
                phrase
            },
            experience: experiences, 
            education: educations,   
            skill,
            social: {
                socialPlatform,
                socialUrl
            },
            interest,
            image: imageBase64 
        };

        // Enviar los datos al servidor
        fetch(API_URL_PHP + 'create_user.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newUser)
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                document.getElementById('userForm').reset();
                document.getElementById("message").textContent = "Usuario agregado con éxito";
                document.getElementById("message").style.color = "green";
                Swal.fire({
                    icon: 'success',
                    title: 'Usuario agregado con éxito',
                    confirmButtonText: 'Aceptar',
                    showConfirmButton: false,
                    timer: 1500
                });
            } else {
                console.error("Error creating user", result.message);
            }
        })
        .catch(error => {
            console.error("Error:", error);
            Swal.fire({
                title: 'Error',
                text: 'Hubo un error al procesar la solicitud',
                icon: 'error',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#d33'
            });
        });
    }
}

document.getElementById('userForm').addEventListener('submit', createUser);

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
