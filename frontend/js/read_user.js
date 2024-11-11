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
                <span class="text-primary">${exp.startdate || 'Fecha de inicio no disponible'} - ${exp.enddate || 'Fecha de finalización no disponible'}</span>
                <ul>
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
                    <span class="text-primary">${edc.startdate || 'Fecha de inicio no disponible'} - ${edc.enddate || 'Fecha de finalización no disponible'}</span>
                    <div class="subheading mb-3">${edc.institution || 'Institución no disponible'}</div>
                </div>
            </div>
        `).join('');

        // Intereses
        if (profile.interest && Array.isArray(profile.interest)) {
            document.getElementById('p-interest-section').innerHTML = '';
            profile.interest.forEach(function(interest) {
                document.getElementById('p-interest-section').innerHTML += `<p>${interest}</p>`;
            });
        } else {
            document.getElementById('p-interest-section').innerHTML = 'No hay intereses disponibles.';
        }

        // Habilidades
        if (profile.skill && Array.isArray(profile.skill)) {
            document.getElementById('p-skill-section').innerHTML = '';
            profile.skill.forEach(function(skill) {
                document.getElementById('p-skill-section').innerHTML += `<p>${skill}</p>`;
            });
        } else {
            document.getElementById('p-skill-section').innerHTML = 'No hay habilidades disponibles.';
        }

        // Redes sociales
        const socialLinksElement = document.getElementById('social-links');
        socialLinksElement.innerHTML = profile.social.map(social => `
            <a href="${social.url}" target="_blank">${social.platform || 'Plataforma no disponible'}</a>
        `).join(', ');

    } catch (error) {
        console.error("Error al obtener los datos:", error);
    }
});