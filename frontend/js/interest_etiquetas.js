const inputInterest = document.getElementById('input-interest');
const interestsContainer = document.getElementById('interests-container');
let interests = [];


// Agregar tags
document.getElementById('add-interest-btn').addEventListener('click', function () {
    const input = inputInterest.value.trim();
    if (input !== '' && !interests.includes(input)) {
        interests.push(input);
        renderInterests();
        inputInterest.value = '';
        updateHiddenInputInterest();
    }
});

// Mostrar tags
function renderInterests() {

    //Esto previene que se muestre una etique vacia en el formulario de actualizar cuando no hay ninguna etiqueta
    if(interests[0] == ''){
        interests = [];
        return;
    }
    interestsContainer.innerHTML = '';
    interests.forEach((interest, index) => {
        const tag = document.createElement('div');
        tag.classList.add('tag');
        tag.innerHTML = `
            ${interest} <span class="remove-tag" id="remove-tag-interest" data-index="${index}">&times;</span>
        `;
        interestsContainer.appendChild(tag);
    });

    // Agregar evento al boton de eliminar
    document.querySelectorAll('#remove-tag-interest').forEach(el => {
        el.addEventListener('click', function () {
            const index = parseInt(this.getAttribute('data-index'));
            removeInterest(index);
        });
    });
}

// Eliminar tags
function removeInterest(index) {
    interests.splice(index, 1);
    renderInterests();
    updateHiddenInputInterest();
}

// Actualizar input oculto
function updateHiddenInputInterest() {
    document.getElementById('input-interest-hidden').value = interests.join(',');
}