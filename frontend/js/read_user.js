document.addEventListener("DOMContentLoaded", async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    if (!window.API_URL_PHP) {
        console.error('API_URL_PHP no está definida');
        return;
    }
    try {
        const response = await fetch(`${window.API_URL_PHP}read_user.php?id=${id}`);
        const result = await response.json();
        const profile = result.data;

        // Información personal
        document.getElementById('name-hero').textContent = profile.basic.name;
        document.getElementById('personal-information-hero').innerHTML = `
            <p>${profile.basic.location}</p>
            <p>${profile.basic.phone}</p>
            <p>${profile.basic.email}</p>
        `;
        document.getElementById('description-hero').textContent = profile.basic.description;
       
        // Experiencia
        const experienceSection = document.getElementById('experience-section');
        const experienceData = profile.experience || [];
        experienceSection.innerHTML = experienceData.map(exp => `
            <div class="experience-sub-section">
                <h3 class="experience-sub-title">${exp.title || 'titulo no disponible'}</h3>
                <span class="text-primary">${exp.startdate || 'Fecha de inicio no disponible'} - ${exp.enddate || 'Fecha de finalización no disponible'}</span>
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
        document.getElementById('p-interest-section').innerHTML = `<p>${profile.interest}</p>`;
        
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
        
        // Reviews
        const reviewsSection = document.getElementById('p-review-section'); 
        const reviewsData = profile.review || [];
            reviewsSection.innerHTML = reviewsData.map(review => `
                <div class="review-card">
                    <div class="review-header">
                        <h3 class="review-name">${review.nameClient || 'Nombre no disponible'}</h3>
                        <div class="review-company-info">
                            <p class="review-position">${review.position || 'Cargo no disponible'}</p>
                            <p class="review-company">${review.company || 'Compañía no disponible'}</p>
                        </div>
                    </div>
                    <div class="review-rating">
                        <span class="rating">${review.rating || 'Rating no disponible'}</span> 
                    </div>
                    <div class="review-comments">
                        <p>${review.comments || 'Comentarios no disponibles'}</p>
                    </div>
               </div>
            `).join('');
        
    } catch (error) {
        console.error("Error al obtener los datos:", error);
    }
    
});