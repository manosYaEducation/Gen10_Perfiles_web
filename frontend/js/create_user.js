async function createUser(event) {
    event.preventDefault();
    // Capturar datos de la información personal
    const name = document.getElementById('input-name').value;
    const location = document.getElementById('input-location').value;
    const phone = document.getElementById('input-phone').value;
    const email = document.getElementById('input-email').value;
    const description = document.getElementById('input-description').value;
    const experienceTitle = document.getElementById('input-experience-title').value;
    const experienceStartDate = document.getElementById('input-experience-startDate').value;
    const experienceEndDate = document.getElementById('input-experience-endDate').value;
    const educationTitle = document.getElementById('input-education-title').value;
    const educationStartDate = document.getElementById('input-education-startDate').value;
    const educationEndDate = document.getElementById('input-education-endDate').value;
    const educationInstitution = document.getElementById('input-education-institution').value;
    const socialPlatform = document.getElementById('input-social-platform').value;
    const socialUrl = document.getElementById('input-social-url').value;
    const skill = document.getElementById('input-skill').value;
    const interest = document.getElementById('input-interest').value;
    const newUser = {
        basic: {
            name,
            location,
            phone,
            email,
            description
        },
        experience:{
            experienceTitle,
            experienceStartDate,
            experienceEndDate
        },
        education:{
            educationTitle,
            educationStartDate,
            educationEndDate,
            educationInstitution
        },
        skill,
        social:{
            socialPlatform,
            socialUrl
        },
        interest
    };
    // Enviar los datos al servidor
    try {
        const response = await fetch(API_URL_PHP + 'create_user.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newUser)
        });
        const result = await response.json();
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
    } catch (error) {
        console.error("Error:", error);
        Swal.fire({
            title: 'Error',
            text: 'Hubo un error al procesar la solicitud',
            icon: 'error',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#d33'
        });
    }
}
document.getElementById('userForm').addEventListener('submit', createUser);
