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

        // Información personal (compatible con la vista actual y la lateral)
        const nameElement = document.getElementById('name-hero-lateral') || document.getElementById('name-hero');
        const infoDiv = document.getElementById('personal-information-hero-lateral') || document.getElementById('personal-information-hero');

        if (nameElement) nameElement.textContent = profile.basic.name;
        if (infoDiv) infoDiv.innerHTML = `
            <p class="mb-2"><i class="fas fa-map-marker-alt me-2 text-success"></i> ${profile.basic.location}</p>
            <p class="mb-2"><i class="fas fa-phone me-2 text-success"></i> ${profile.basic.phone}</p>
            <p class="mb-2"><i class="fas fa-envelope me-2 text-success"></i> ${profile.basic.email}</p>
        `;
        //funcionalidad: convertir el teléfono en enlace de Wsp
        {
            const paragraphs = infoDiv ? infoDiv.getElementsByTagName('p') : [];
            if (paragraphs.length >= 2) {
                const phoneText = paragraphs[1].textContent.trim();
                const digits = phoneText.replace(/\D/g, '');
                if (digits) {
                    paragraphs[1].innerHTML = `<a href="https://wa.me/${digits}" target="_blank">${phoneText}</a>`;
                }
            }
        }
        const descriptionElement = document.getElementById('description-hero');
        if (descriptionElement) descriptionElement.textContent = profile.basic.description;
       
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
        renderEducationTimeline(educationSection, profile.education || []);
        
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
        
        // Redes sociales de la cabecera
        renderSocialLinks(profile.social || []);

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

function renderEducationTimeline(container, educationData) {
    if (!container) return;

    container.replaceChildren();

    if (!educationData.length) {
        const emptyState = document.createElement('p');
        emptyState.className = 'education-empty';
        emptyState.textContent = 'No hay estudios registrados.';
        container.appendChild(emptyState);
        return;
    }

    educationData.forEach((education) => {
        const item = document.createElement('article');
        const content = document.createElement('div');
        const title = document.createElement('h3');
        const institution = document.createElement('p');
        const dates = document.createElement('p');

        item.className = 'education-entry';
        content.className = 'education-entry-content';
        title.className = 'education-entry-title';
        institution.className = 'education-entry-institution';
        dates.className = 'education-entry-dates';

        title.textContent = education.title || 'Estudio sin título';
        institution.textContent = education.institution || 'Institución no informada';
        dates.textContent = `${formatEducationDate(education.startdate)} – ${formatEducationDate(education.enddate, 'Actualidad')}`;

        content.append(title, institution, dates);
        item.appendChild(content);
        container.appendChild(item);
    });
}

function formatEducationDate(dateValue, fallback = 'Sin fecha') {
    if (!dateValue) return fallback;

    const parsedDate = new Date(`${dateValue}T00:00:00`);
    if (Number.isNaN(parsedDate.getTime())) return dateValue;

    const formattedDate = new Intl.DateTimeFormat('es-CL', {
        month: 'short',
        year: 'numeric'
    }).format(parsedDate).replace('.', '');

    return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
}

function renderSocialLinks(socialNetworks) {
    const container = document.getElementById('social-icons-hero');
    if (!container) return;

    const iconByPlatform = {
        facebook: ['fa-brands', 'fa-facebook-f'],
        github: ['fa-brands', 'fa-github'],
        instagram: ['fa-brands', 'fa-instagram'],
        linkedin: ['fa-brands', 'fa-linkedin-in'],
        tiktok: ['fa-brands', 'fa-tiktok'],
        twitch: ['fa-brands', 'fa-twitch'],
        twitter: ['fa-brands', 'fa-x-twitter'],
        x: ['fa-brands', 'fa-x-twitter'],
        whatsapp: ['fa-brands', 'fa-whatsapp'],
        youtube: ['fa-brands', 'fa-youtube']
    };

    container.replaceChildren();

    socialNetworks.forEach((social) => {
        const platform = String(social.platform || '').trim();
        const platformKey = platform.toLowerCase();
        const url = String(social.url || '').trim();

        if (!url || !/^https?:\/\//i.test(url)) return;

        const link = document.createElement('a');
        const icon = document.createElement('i');
        const iconClasses = iconByPlatform[platformKey] || ['fa-solid', 'fa-link'];

        link.className = `social-icon social-icon--${platformKey.replace(/[^a-z0-9-]/g, '') || 'web'}`;
        link.href = url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.setAttribute('aria-label', platform || 'Sitio web');
        link.title = platform || 'Sitio web';
        icon.classList.add(...iconClasses);
        icon.setAttribute('aria-hidden', 'true');
        link.appendChild(icon);
        container.appendChild(link);
    });

    container.hidden = container.childElementCount === 0;
}
