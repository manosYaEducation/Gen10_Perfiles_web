// // Array de opciones para habilidades y redes sociales
// const skills = ["JavaScript", "Python", "Java", "C++", "React", "SQL", "Photoshop", "Figma"];
// const socialPlatforms = ["Github", "Instagram", "LinkedIn", "Twitter"];

// // Genera las opciones del select dinámicamente
// function populateSelect(selectElem, options) {
//     selectElem.innerHTML = "";  // Limpiar opciones anteriores
//     options.forEach(optionText => {
//         const option = document.createElement("option");
//         option.value = optionText;
//         option.textContent = optionText;
//         selectElem.appendChild(option);
//     });
// }

// // Función modular para abrir el modal y personalizar el formulario según el tipo
// function openModal(type) {
//     const modal = document.getElementById("dynamicModal");
//     const modalTitle = document.getElementById("modalTitle");
//     const modalForm = document.getElementById("modalForm");
//     modalForm.innerHTML = '';  // Limpiar formulario antes de añadir nuevos campos

//     modalTitle.textContent = type.charAt(0).toUpperCase() + type.slice(1);

//     // Generar campos según el tipo de entrada (experience, education, skill, social)
//     switch (type) {
//         case 'experience':
//             addInputField(modalForm, "Título", "title");
//             addDateRangeFields(modalForm, "startDate", "endDate");
//             addInputField(modalForm, "Descripción", "description");
//             break;
//         case 'education':
//             addInputField(modalForm, "Título", "title");
//             addInputField(modalForm, "Institución", "institution");
//             addDateRangeFields(modalForm, "startDate", "endDate");
//             addInputField(modalForm, "Descripción", "description");
//             break;
//         case 'skill':
//             const skillSelect = addSelectField(modalForm, "Habilidad", "skill");
//             populateSelect(skillSelect, skills);
//             break;
//         case 'social':
//             const socialSelect = addSelectField(modalForm, "Plataforma", "platform");
//             populateSelect(socialSelect, socialPlatforms);
//             addInputField(modalForm, "URL", "url");
//             break;
//     }

//     // Guardar el tipo en el formulario para la función addItem
//     modalForm.setAttribute('data-type', type);
//     modal.style.display = "flex";
// }

// // Función para agregar un campo de texto al formulario
// function addInputField(form, label, id) {
//     const labelElem = document.createElement("label");
//     labelElem.textContent = label;
//     const inputElem = document.createElement("input");
//     inputElem.type = "text";
//     inputElem.id = id;
//     form.appendChild(labelElem);
//     form.appendChild(inputElem);
// }

// // Función para agregar campos de fecha de inicio y fin
// function addDateRangeFields(form, startId, endId) {
//     const dateContainer = document.createElement("div");
//     dateContainer.style.display = "flex";
//     dateContainer.style.gap = "10px";

//     addDateField(dateContainer, "Fecha inicio", startId);
//     addDateField(dateContainer, "Fecha finalización", endId);

//     form.appendChild(dateContainer);
// }

// // Función para agregar un campo de fecha
// function addDateField(container, label, id) {
//     const labelElem = document.createElement("label");
//     labelElem.textContent = label;
//     const inputElem = document.createElement("input");
//     inputElem.type = "date";
//     inputElem.id = id;
//     container.appendChild(labelElem);
//     container.appendChild(inputElem);
// }

// // Función para agregar un campo select al formulario y retornarlo para que se le puedan agregar opciones
// function addSelectField(form, label, id) {
//     const labelElem = document.createElement("label");
//     labelElem.textContent = label;
//     const selectElem = document.createElement("select");
//     selectElem.id = id;
//     form.appendChild(labelElem);
//     form.appendChild(selectElem);
//     return selectElem;  // Retornar el elemento select para poder poblarlo
// }

// // Función para cerrar el modal
// function closeModal() {
//     document.getElementById("dynamicModal").style.display = "none";
// }

// // Función para agregar el elemento al contenedor correspondiente según el tipo
// function addItem() {
//     const form = document.getElementById("modalForm");
//     const type = form.getAttribute('data-type');
//     const container = document.getElementById(`${type}List`);

//     let itemContent;
//     if (type === 'experience' || type === 'education') {
//         const title = document.getElementById("title").value;
//         const startDate = document.getElementById("startDate").value;
//         const endDate = document.getElementById("endDate").value;
//         const description = document.getElementById("description").value || "";
//         itemContent = `${title} (${startDate} - ${endDate})${description ? ": " + description : ""}`;
//     } else if (type === 'skill') {
//         const skill = document.getElementById("skill").value;
//         itemContent = skill;
//     } else if (type === 'social') {
//         const platform = document.getElementById("platform").value;
//         const url = document.getElementById("url").value;
//         itemContent = `${platform}: ${url}`;
//     }

//     // Crear y agregar el elemento a la lista
//     const newItem = document.createElement("li");
//     newItem.textContent = itemContent;
//     const deleteButton = document.createElement("span");
//     deleteButton.textContent = " (x)";
//     deleteButton.onclick = function() {
//         container.removeChild(newItem);
//     };
//     newItem.appendChild(deleteButton);
//     container.appendChild(newItem);

//     closeModal();
// }
