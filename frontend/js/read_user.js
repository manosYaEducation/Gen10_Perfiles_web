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

        // Mostrar imagen de perfil si existe
        if (result.data.image) {
            document.getElementById('profile_image').src = result.data.image;
        }

        // Información personal
        document.getElementById('name-hero').textContent = profile.basic.name;
        document.getElementById('personal-information-hero').innerHTML = `
            <p>${profile.basic.location}</p>
            <p>${profile.basic.phone}</p>
            <p>${profile.basic.email}</p>
        `;
        //funcionalidad: convertir el teléfono en enlace de Wsp
        {
            const infoDiv = document.getElementById('personal-information-hero');
            const paragraphs = infoDiv.getElementsByTagName('p');
            if (paragraphs.length >= 2) {
                const phoneText = paragraphs[1].textContent.trim();
                const digits = phoneText.replace(/\D/g, '');
                if (digits) {
                    paragraphs[1].innerHTML = `<a href="https://wa.me/${digits}" target="_blank">${phoneText}</a>`;
                }
            }
        }
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
        const starFilled = 'https://kreative.alphadocere.cl/assets/img/star.png';
        const starEmpty = 'https://kreative.alphadocere.cl/assets/img/star001.png';
        
        const reviewsSection = document.getElementById('p-review-section'); 
        const reviewsData = profile.review || [];
        reviewsSection.innerHTML = reviewsData.map(review => {
            const rating = review.rating || 0; // Calificación del 1 al 5
                const starImages = Array.from({ length: 5 }) // Generar 5 elementos para estrellas
                    .map((_, index) => 
                        `<img src="${index < rating ? starFilled : starEmpty}" alt="star" class="star-icon" />`
                    )
                    .join('');                
                
            return    `
                <div class="review-card">
                    <div class="review-header">
                        <h3 class="review-name">${review.nameClient || 'Nombre no disponible'}</h3>
                        <div class="review-company-info">
                            <p class="review-company">${review.company || 'Empresa no disponible'}</p>
                        </div>
                    </div>
            <div class="review-rating">
                <span class="rating">${starImages}</span> 
            </div>
                    <div class="review-comments">
                        <p>${review.comments || 'Comentarios no disponibles'}</p>
                    </div>
               </div>
            `}).join('');
    // Contacto
    const contactSection = document.getElementById('contact-info-section');
    contactSection.innerHTML = `
        <p><strong>Correo:</strong> <a href="mailto:${profile.basic.email}">${profile.basic.email}</a></p>
        <p><strong>Teléfono:</strong> <a href="https://wa.me/${profile.basic.phone.replace(/\D/g, '')}" target="_blank">${profile.basic.phone}</a></p>
    `;

    } catch (error) {
        console.error("Error al obtener los datos:", error);
    }

});