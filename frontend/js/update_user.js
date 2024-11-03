function editUser(index) {
    const user = users[index];
    userId.value = index;
    nameInput.value = user.name;
    emailInput.value = user.email;
    rutInput.value = user.rut;
    addressInput.value = user.address;
}

