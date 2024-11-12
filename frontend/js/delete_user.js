async function deleteUser(event) {
    const link = event.target.parentNode.querySelector('a');
    const id = link.href.split('=')[1];
    console.log('id del usuario:', id);

    try {
        const url = `https://gen10.alphadocere.cl/backend/delete_user.php?id=${id}`;
        const response = await fetch(url, { method: 'GET' });   
        if (response.ok) {
            console.log('Usuario eliminado con éxito');
            event.preventDefault();             
        } else {
            console.error('Error al eliminar el usuario');
        }
    } catch (error) {
        console.error(error);
    }
}

document.querySelectorAll('.buttonBorrar').forEach(button => {
    button.addEventListener('click', deleteUser);
});