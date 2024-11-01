let users = [];


const userForm = document.getElementById("userForm");
const userId = document.getElementById("userId");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const rutInput = document.getElementById("rut");
const addressInput = document.getElementById("address");
const userTable = document.getElementById("userTable").getElementsByTagName("tbody")[0];

// function renderUsers() {
//     userTable.innerHTML = ""; 
//     users.forEach((user, index) => {
//         const row = userTable.insertRow();
//         row.innerHTML = `
//       <td>${user.name}</td>
//       <td>${user.email}</td>
//       <td>${user.rut}</td>
//       <td>${user.address}</td>
//       <td>
//         <button onclick="editUser(${index})">Editar</button>
//         <button onclick="deleteUser(${index})">Eliminar</button>
//       </td>`
//     ;
//     });
// }
    


// ORIGINAL
// function addOrUpdateUser(e) {
//     e.preventDefault();
//     const id = userId.value;
//     const name = nameInput.value;
//     const email = emailInput.value;
//     const rut = rutInput.value;
//     const address = addressInput.value;

//     if (id) {
//         users[id] = { name, email, rut, address };
//     } else {
//         users.push({ name, email, rut, address });
//     }


//     resetForm();
//     renderUsers();
// }


function editUser(index) {
    const user = users[index];
    userId.value = index;
    nameInput.value = user.name;
    emailInput.value = user.email;
    rutInput.value = user.rut;
    addressInput.value = user.address;
}


function deleteUser(index) {
    users.splice(index, 1);
    renderUsers();
}


function resetForm() {
    userId.value = "";
    nameInput.value = "";
    emailInput.value = "";
    rutInput.value = "";
    addressInput.value ="";
}


userForm.addEventListener("submit", addOrUpdateUser);


renderUsers();