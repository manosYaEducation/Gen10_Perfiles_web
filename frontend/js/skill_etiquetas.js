const inputSkills = document.getElementById('input-skill');
const skillsContainer = document.getElementById('skills-container');
let skills = [];

// Agregar tags
document.getElementById('add-skill-btn').addEventListener('click', function () {
    const input = inputSkills.value.trim();
    if (input !== '' && !skills.includes(input)) {
        skills.push(input);
        renderSkills();
        inputSkills.value = '';
        updateHiddenInputSkills();
    }
});

// Mostrar tags
function renderSkills() {

    //Esto previene que se muestre una etique vacia en el formulario de actualizar cuando no hay ninguna etiqueta
    if(skills[0] == ''){
        skills = [];
        return;
    }
    skillsContainer.innerHTML = '';
    skills.forEach((skill, index) => {
        const tag = document.createElement('div');
        tag.classList.add('tag');
        tag.innerHTML = `
            ${skill} <span class="remove-tag" id="remove-tag-skill" data-index="${index}">&times;</span>
        `;
        skillsContainer.appendChild(tag);
    });

    // Agregar evento al boton de eliminar
    document.querySelectorAll('#remove-tag-skill').forEach(el => {
        el.addEventListener('click', function () {
            const index = parseInt(this.getAttribute('data-index'));
            removeSkill(index);
        });
    });
}

// Eliminar tags
function removeSkill(index) {
    skills.splice(index, 1);
    renderSkills();
    updateHiddenInputSkills();
}

// Actualizar input oculto
function updateHiddenInputSkills() {
    document.getElementById('input-skill-hidden').value = skills.join(',');
}