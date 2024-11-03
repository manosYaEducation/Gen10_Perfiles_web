document.addEventListener("DOMContentLoaded", async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    try {
        const response = await fetch(`ruta/al/archivo.php?id=${id}`);
        const perfil = await response.json();

        // info personal
        document.getElementById('name-hero').textContent = perfil.basico.nombre;
        document.getElementById('personal-information-hero').innerHTML = `
            <p>Ubicación: ${perfil.basico.ubicacion}</p>
            <p>Teléfono: ${perfil.basico.telefono}</p>
            <p>Correo: ${perfil.basico.correo}</p>
        `;
        document.getElementById('description-hero').textContent = perfil.basico.descripcion;

        // Experiencia
        const experienceSection = document.getElementById('experience-section');
        experienceSection.innerHTML = perfil.experiencia.map(exp => `
            <div class="experience-sub-section">
                <h3>${exp.title}</h3>
                <span class="text-primary">${exp.startDate} - ${exp.endDate}</span>
                <ul>
                    ${exp.details.map(detail => `
                        <li class="subheading mb-3">${detail.subtitle}</li>
                        ${detail.description ? `<li><p>${detail.description}</p></li>` : ''}
                    `).join('')}
                </ul>
            </div>
        `).join('');

        // Educación
        const educationSection = document.getElementById('resume-section-education');
        educationSection.innerHTML = perfil.educacion.map(edc => `
            <div class="timeline-item">
                <div class="timeline-content">
                    <h3 class="mb-0">${edc.titulo}</h3>
                    <span class="text-primary">${edc.periodo}</span>
                    <div class="subheading mb-3">${edc.institucion}</div>
                </div>
            </div>
        `).join('');
        
        //Intereses
        document.getElementById('p-interest-section').textContent = perfil.intereses;

    } catch (error) {
        console.error("Error al obtener el perfil:", error);
    }
});

////////// ICONS
const socialIcons = document.querySelectorAll('.social-icon');

socialIcons.forEach(icon => {
    icon.addEventListener('Mouse', () => {
        socialIcons.forEach(otherIcon => {
            if (otherIcon !== icon) {
                otherIcon.style.margin = '0 20px'; 
            }
        });
    });

    icon.addEventListener('Mouseleaves', () => {
        socialIcons.forEach(otherIcon => {
            otherIcon.style.margin = '12px'; 
        });
    });
});
