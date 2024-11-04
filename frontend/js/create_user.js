// FALTAN VALIDACIONES DE CAMPOS

async function createUser() {
    const name = document.getElementById('input-name').value;
    const location = document.getElementById('input-location').value;
    const phone = document.getElementById('input-phone').value;
    const email = document.getElementById('input-email').value;
    const description = document.getElementById('input-description').value;
    const interests = document.getElementById('input-interests').value;
    const experience = [
        {
            title: document.getElementById('input-experience-title').value,
            startDate: document.getElementById('input-experience-start-date').value,
            endDate: document.getElementById('input-experience-end-date').value,
            subtitle: document.getElementById('input-experience-detail-subtitle').value,
            description: document.getElementById('input-experience-detail-desc').value
        }
    ];
    
    const education = [
        {
            title: document.getElementById('input-education-title').value,
            startDate: document.getElementById('input-education-start-date').value,
            endDate: document.getElementById('input-education-end-date').value,
            institution: document.getElementById('input-education-institution').value
        }
    ];
    
    const newUser = {
        basic: {
            name,
            location,
            phone,
            email,
            description
        },
        experience,
        education,
        interests
    };

    try {
        const response = await fetch('/backend/create_user.php', {
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
        } else {
            console.error("Error creating user", result.message);
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

document.getElementById('userForm').addEventListener('submit', createUser);