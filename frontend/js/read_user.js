document.addEventListener("DOMContentLoaded", async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    const usersPerPage = 10;
    let currentPage = 1;
    let allUsers = [];

    if (!window.API_URL_PHP) {
        console.error('API_URL_PHP no está definida');
        return;
    }

    
    if (id) {
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
            // Convert phone to WhatsApp link
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
                const rating = review.rating || 0;
                const starImages = Array.from({ length: 5 })
                    .map((_, index) => 
                        `<img src="${index < rating ? starFilled : starEmpty}" alt="star" class="star-icon" />`
                    )
                    .join('');
                return `
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
                `;
            }).join('');

            // Contacto
            const contactSection = document.getElementById('contact-info-section');
            contactSection.innerHTML = `
                <p><strong>Correo:</strong> <a href="mailto:${profile.basic.email}">${profile.basic.email}</a></p>
                <p><strong>Teléfono:</strong> <a href="https://wa.me/${profile.basic.phone.replace(/\D/g, '')}" target="_blank">${profile.basic.phone}</a></p>
            `;
        } catch (error) {
            console.error("Error al obtener los datos:", error);
        }
        return;
    }

    // Si no hay ID → mostrar perfiles de usuario con paginación
    async function fetchUsers() {
        try {
            const response = await fetch(`${window.API_URL_PHP}read_user.php`);
            const data = await response.json();
            if (data.success) {
                allUsers = data.profiles;
                renderUsers();
                renderPagination();
            } else {
                console.error("No se pudieron obtener los usuarios:", data.message);
            }
        } catch (error) {
            console.error("Error al obtener usuarios:", error);
        }
    }

    function renderUsers() {
    const usersProfilesColumn = document.querySelector("#perfiles .profiles-column");
    usersProfilesColumn.innerHTML = "";

    const start = (currentPage - 1) * usersPerPage;
    const end = start + usersPerPage;
    const paginatedUsers = allUsers.slice(start, end);

    // Remove existing pagination
    const existingPagination = document.querySelector('#perfiles .pagination'); // Updated selector
    if (existingPagination) {
        existingPagination.remove();
    }

    paginatedUsers.forEach(user => {
        const userCard = document.createElement('div');
        userCard.classList.add('profile-card');
        userCard.innerHTML = `
            <div class="profile-content">
                <div class="profile-image">
                    <img src="${user.image || 'data:image/png;base64,DEFAULT_BASE64_IMAGE'}" alt="${user.name}">
                </div>
                <h2>${user.name}</h2>
                <h3 class="profile-subtitle">${user.phrase || ''}</h3>
                <a href="../frontend/perfiles/profile-template.php?id=${user.id}" class="button-link">Perfil</a>
                <button class="buttonActualizar" data-id="${user.id}" onclick="redirectToUpdate(${user.id})">Actualizar</button>
                <button class="buttonBorrar" data-id="${user.id}" onclick="deleteUser(event)">Borrar</button>
            </div>
        `;
        usersProfilesColumn.appendChild(userCard);
    });
}

function renderPagination() {
    const totalPages = Math.ceil(allUsers.length / usersPerPage);
    const paginationContainer = document.createElement('div');
    paginationContainer.classList.add('pagination');
    paginationContainer.style.cssText = `
        display: flex;
        justify-content: center;
        gap: 10px;
        margin-top: 20px;
    `;

    // Previous Button
    const prevButton = document.createElement('button');
    prevButton.textContent = 'Anterior';
    prevButton.disabled = currentPage === 1;
    prevButton.style.cssText = `
        padding: 10px 20px;
        background-color: ${currentPage === 1 ? '#ccc' : '#8B6E3F'};
        color: white;
        border: none;
        border-radius: 6px;
        cursor: ${currentPage === 1 ? 'not-allowed' : 'pointer'};
    `;
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderUsers();
            renderPagination();
        }
    });

    // Next Button
    const nextButton = document.createElement('button');
    nextButton.textContent = 'Siguiente';
    nextButton.disabled = currentPage === totalPages;
    nextButton.style.cssText = `
        padding: 10px 20px;
        background-color: ${currentPage === totalPages ? '#ccc' : '#8B6E3F'};
        color: white;
        border: none;
        border-radius: 6px;
        cursor: ${currentPage === totalPages ? 'not-allowed' : 'pointer'};
    `;
    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            renderUsers();
            renderPagination();
        }
    });

    // Page Numbers
    const pageNumbers = document.createElement('div');
    pageNumbers.style.cssText = `
        display: flex;
        gap: 5px;
    `;
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.style.cssText = `
            padding: 10px;
            background-color: ${i === currentPage ? '#6B5A3A' : '#f0f0f5'};
            color: ${i === currentPage ? 'white' : '#8B6E3F'};
            border: 1px solid #e0e0e8;
            border-radius: 6px;
            cursor: pointer;
        `;
        pageButton.addEventListener('click', () => {
            currentPage = i;
            renderUsers();
            renderPagination();
        });
        pageNumbers.appendChild(pageButton);
    }

    paginationContainer.appendChild(prevButton);
    paginationContainer.appendChild(pageNumbers);
    paginationContainer.appendChild(nextButton);

    const usersProfilesColumn = document.querySelector("#perfiles .profiles-column");
    usersProfilesColumn.insertAdjacentElement('afterend', paginationContainer);
}

    function renderPagination() {
        const totalPages = Math.ceil(allUsers.length / usersPerPage);
        const paginationContainer = document.createElement('div');
        paginationContainer.classList.add('pagination');
        paginationContainer.style.cssText = `
            display: flex;
            justify-content: center;
            gap: 10px;
            margin-top: 20px;
        `;

        // Previous Button
        const prevButton = document.createElement('button');
        prevButton.textContent = 'Anterior';
        prevButton.disabled = currentPage === 1;
        prevButton.style.cssText = `
            padding: 10px 20px;
            background-color: ${currentPage === 1 ? '#ccc' : '#8B6E3F'};
            color: white;
            border: none;
            border-radius: 6px;
            cursor: ${currentPage === 1 ? 'not-allowed' : 'pointer'};
        `;
        prevButton.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderUsers();
                renderPagination();
            }
        });

        // Next Button
        const nextButton = document.createElement('button');
        nextButton.textContent = 'Siguiente';
        nextButton.disabled = currentPage === totalPages;
        nextButton.style.cssText = `
            padding: 10px 20px;
            background-color: ${currentPage === totalPages ? '#ccc' : '#8B6E3F'};
            color: white;
            border: none;
            border-radius: 6px;
            cursor: ${currentPage === totalPages ? 'not-allowed' : 'pointer'};
        `;
        nextButton.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                renderUsers();
                renderPagination();
            }
        });

        // Page Numbers
        const pageNumbers = document.createElement('div');
        pageNumbers.style.cssText = `
            display: flex;
            gap: 5px;
        `;
        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement('button');
            pageButton.textContent = i;
            pageButton.style.cssText = `
                padding: 10px;
                background-color: ${i === currentPage ? '#6B5A3A' : '#f0f0f5'};
                color: ${i === currentPage ? 'white' : '#8B6E3F'};
                border: 1px solid #e0e0e8;
                border-radius: 6px;
                cursor: pointer;
            `;
            pageButton.addEventListener('click', () => {
                currentPage = i;
                renderUsers();
                renderPagination();
            });
            pageNumbers.appendChild(pageButton);
        }

        paginationContainer.appendChild(prevButton);
        paginationContainer.appendChild(pageNumbers);
        paginationContainer.appendChild(nextButton);

        const usersProfilesColumn = document.querySelector("#perfiles .profiles-column");
        usersProfilesColumn.insertAdjacentElement('afterend', paginationContainer);
    }

    // Start fetching users
    fetchUsers();
});

function redirectToUpdate(profileId) {
    window.location.href = `./actualizar-perfil.html?id=${profileId}`;
}

function deleteUser(event) {
    const userId = event.target.getAttribute("data-id");

    const dialogOverlay = document.createElement("div");
    dialogOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    `;

    const dialog = document.createElement("div");
    dialog.style.cssText = `
        background-color: white;
        border-radius: 12px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        padding: 30px;
        width: 350px;
        text-align: center;
    `;

    dialog.innerHTML = `
        <h3 style="color: #333; margin-bottom: 20px; font-size: 20px;">Eliminar Usuario</h3>
        <p style="margin-bottom: 20px; color: #666;">¿Estás seguro de eliminar este usuario?</p>
        <div style="display: flex; justify-content: center; gap: 15px;">
            <button id="btnAceptar" style="background-color: #8B6E3F; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; transition: background-color 0.3s ease;">Aceptar</button>
            <button id="btnCancelar" style="background-color: #f0f0f5; color: #8B6E3F; border: 1px solid #e0e0e8; padding: 10px 20px; border-radius: 6px; cursor: pointer; transition: background-color 0.3s ease;">Cancelar</button>
        </div>
    `;

    dialogOverlay.appendChild(dialog);
    document.body.appendChild(dialogOverlay);

    const btnAceptar = dialog.querySelector("#btnAceptar");
    const btnCancelar = dialog.querySelector("#btnCancelar");

    btnAceptar.addEventListener("click", () => {
        fetch(`${window.API_URL_PHP}delete_user.php?id=${userId}`)
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    setTimeout(() => {
                        showSuccessModal("Usuario eliminado con éxito");
                    }, 500);
                    setTimeout(() => {
                        window.location.reload();
                    }, 1500);
                } else {
                    console.error("Error al eliminar:", data.message);
                }
            })
            .catch((error) => console.error("Error:", error));
        document.body.removeChild(dialogOverlay);
    });

    btnCancelar.addEventListener("click", () => {
        document.body.removeChild(dialogOverlay);
    });

    btnAceptar.addEventListener("mouseover", () => {
        btnAceptar.style.backgroundColor = "#6B5A3A";
    });
    btnAceptar.addEventListener("mouseout", () => {
        btnAceptar.style.backgroundColor = "#8B6E3F";
    });
    btnCancelar.addEventListener("mouseover", () => {
        btnCancelar.style.backgroundColor = "#f4f4f8";
    });
    btnCancelar.addEventListener("mouseout", () => {
        btnCancelar.style.backgroundColor = "#f0f0f5";
    });
}

function showSuccessModal(message = "Usuario eliminado con éxito") {
    const dialogOverlay = document.createElement("div");
    dialogOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    `;

    const dialog = document.createElement("div");
    dialog.style.cssText = `
        background-color: white;
        border-radius: 12px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        padding: 30px;
        width: 350px;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
    `;

    const checkIcon = document.createElement("div");
    checkIcon.style.cssText = `
        width: 70px;
        height: 70px;
        border: 4px solid #4CAF50;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 20px;
        position: relative;
        animation: pulse 0.5s ease-in-out;
    `;

    const checkMark = document.createElement("div");
    checkMark.style.cssText = `
        position: absolute;
        width: 25px;
        height: 12px;
        border-left: 4px solid #4CAF50;
        border-bottom: 4px solid #4CAF50;
        transform: rotate(-45deg);
        top: 50%;
        left: 50%;
        margin-left: -10px;
        margin-top: -6px;
    `;
    checkIcon.appendChild(checkMark);

    const messageElement = document.createElement("h3");
    messageElement.textContent = message;
    messageElement.style.cssText = `
        color: #333;
        margin-bottom: 10px;
        font-size: 18px;
    `;

    const styleSheet = document.createElement("style");
    styleSheet.textContent = `
        @keyframes pulse {
            0% { transform: scale(0.8); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }
    `;
    document.head.appendChild(styleSheet);

    dialog.appendChild(checkIcon);
    dialog.appendChild(messageElement);
    dialogOverlay.appendChild(dialog);
    document.body.appendChild(dialogOverlay);

    setTimeout(() => {
        document.body.removeChild(dialogOverlay);
    }, 2000);
}