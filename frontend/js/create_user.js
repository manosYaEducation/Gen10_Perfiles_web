// Faltan validaciones de campos

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


    
    

    // // Capturar los datos de las experiencias (si existen)
    // const experienceList = [];
    // const experienceTitles = document.querySelectorAll('.experience-title');
    // const experienceStartDates = document.querySelectorAll('.experience-start-date');
    // const experienceEndDates = document.querySelectorAll('.experience-end-date');
    // const experienceDescriptions = document.querySelectorAll('.experience-description');
    
    // for (let i = 0; i < experienceTitles.length; i++) {
    //     experienceList.push({
    //         title: experienceTitles[i].value,
    //         startDate: experienceStartDates[i].value,
    //         endDate: experienceEndDates[i].value,
    //         description: experienceDescriptions[i].value
    //     });
    // }

    // // Capturar los datos de la educación (si existen)
    // const educationList = [];
    // const educationTitles = document.querySelectorAll('.education-title');
    // const educationStartDates = document.querySelectorAll('.education-start-date');
    // const educationEndDates = document.querySelectorAll('.education-end-date');
    // const educationInstitutions = document.querySelectorAll('.education-institution');
    
    // for (let i = 0; i < educationTitles.length; i++) {
    //     educationList.push({
    //         title: educationTitles[i].value,
    //         startDate: educationStartDates[i].value,
    //         endDate: educationEndDates[i].value,
    //         institution: educationInstitutions[i].value
    //     });
    // }

    // Preparar el objeto del nuevo usuario
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

    console.log("User data to send:", JSON.stringify(newUser, null, 2));

    // Enviar los datos al servidor
    try {
        const response = await fetch('https://gen10.alphadocere.cl/backend/create_user.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newUser)
        });

        const result = await response.json();
        if (result.success) {
            console.log("Success:", result);
            document.getElementById('userForm').reset();
            document.getElementById("message").textContent = "Usuario agregado con éxito";
            document.getElementById("message").style.color = "green";
        } else {
            console.error("Error creating user", result.message);
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

// Agregar el evento de submit para llamar la función
document.getElementById('userForm').addEventListener('submit', createUser);
