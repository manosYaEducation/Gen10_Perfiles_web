document.addEventListener("DOMContentLoaded", async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    try {
        const response = await fetch(`http://localhost:8000/read_user.php?id=${id}`);
        const resultado = await response.json();

        console.log('Resultado del servidor:', resultado);

        const perfil = resultado.data;

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
        const experienceData = perfil.experience || [];

        experienceSection.innerHTML = experienceData.map(exp => `
        <div class="experience-sub-section">
            <h3>${exp.titulo || 'Título no disponible'}</h3>
            <span class="text-primary">${exp.fechaInicio || 'Fecha de inicio no disponible'} - ${exp.fechaFin || 'Fecha de fin no disponible'}</span>
            <ul>
                ${exp.descripcion ? `<li><p>${exp.descripcion}</p></li>` : '<li>No hay descripción disponible</li>'}
            </ul>
        </div>
    `).join('');

        // Educación
        const educationSection = document.getElementById('resume-section-education');
        const educationData = perfil.education || [];
        
        educationSection.innerHTML = perfil.education.map(edc => `
            <div class="timeline-item">
                <div class="timeline-content">
                    <h3 class="mb-0">${edc.titulo || 'Título no disponible'}</h3>
                    <span class="text-primary">${edc.periodo || 'Fecha de inicio no disponible'} - ${edc.fechaFin || 'Fecha de fin no disponible'}</span>
                    <div class="subheading mb-3">${edc.descripcion || 'Descripción no disponible'}</div>
                </div>
            </div>
        `).join('');


        //Intereses
        document.getElementById('p-interest-section').textContent = perfil.intereses;

    } catch (error) {
        console.error("Error al obtener el perfil:", error);
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
