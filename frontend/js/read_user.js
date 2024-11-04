document.addEventListener("DOMContentLoaded", async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    try {
        const response = await fetch(`http://localhost:8000/read_user.php?id=${id}`);
        const result = await response.json();

        console.log('Resultados', result);

        const profile = result.data;

        // Información personal
        document.getElementById('name-hero').textContent = profile.basic.name;
        document.getElementById('personal-information-hero').innerHTML = `
            <p>Location: ${profile.basic.location}</p>
            <p>Phone: ${profile.basic.phone}</p>
            <p>Email: ${profile.basic.email}</p>
        `;
        document.getElementById('description-hero').textContent = profile.basic.description;

        // Experiencia
        const experienceSection = document.getElementById('experience-section');
        const experienceData = profile.experience || [];
        experienceSection.innerHTML = experienceData.map(exp => `
            <div class="experience-sub-section">
                <h3 class="experience-sub-title">${exp.title || 'titulo no disponible'}</h3>
                <span class="text-primary">${exp.startDate || 'Fecha de inicio no disponible'} - ${exp.endDate || 'Fecha de finalización no disponible'}</span>
                <ul>
                    ${exp.subtitle ? `<li class="subheading mb-3">${exp.subtitle}</li>` : ''}
                    ${exp.description ? `<li><p>${exp.description}</p></li>` : '<li>Nohay descripción disponible</li>'}
                </ul>
            </div>
        `).join('');

        // Educación
        const educationSection = document.getElementById('timeline');
        const educationData = profile.education || [];
        educationSection.innerHTML = educationData.map(edc => `
            <div class="timeline-item">
                <div class="timeline-content">
                    <h3 class="mb-0">${edc.title || 'titulo no disponible'}</h3>
                    <span class="text-primary">${edc.startDate || 'Fecha de inicio no disponible'} - ${edc.endDate || 'Fecha de finalización no disponible'}</span>
                    <div class="subheading mb-3">${edc.institution || 'Institución no disponible'}</div>
                </div>
            </div>
        `).join('');

        // Intereses
        document.getElementById('p-interest-section').textContent = profile.interests;

    } catch (error) {
        console.error("Error al obtener los datos:", error);
    }
});


// ////////// ICONS
// const socialIcons = document.querySelectorAll('.social-icon');

// socialIcons.forEach(icon => {
//     icon.addEventListener('Mouse', () => {
//         socialIcons.forEach(otherIcon => {
//             if (otherIcon !== icon) {
//                 otherIcon.style.margin = '0 20px'; 
//             }
//         });
//     });

//     icon.addEventListener('Mouseleaves', () => {
//         socialIcons.forEach(otherIcon => {
//             otherIcon.style.margin = '12px'; 
//         });
//     });
// });
