async function deleteUser(event) {
    const button = event.target;    // El botón que fue clickeado
    const id = button.getAttribute('data-id');
    console.log('ID del usuario:', id);
    // Confirmación antes de eliminar
    const confirmDelete = confirm('¿Estás seguro de que deseas borrar este usuario?');
    if (!confirmDelete) return;
    try {
        // 
        const url = `${window.API_URL_PHP}delete_user.php?id=${id}`;
        const response = await fetch(url, { method: 'GET' });
        if (response.ok) {
            const result = await response.json();
            if (result.status === 'success') {
                // Eliminar el perfil de la vista (opcional)
                button.closest('.profile-content').remove();  // Eliminar el contenedor del perfil
                location.reload();
            } else {
                console.error(result.message);
            }
        } else {
            console.error('Error al eliminar el usuario');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}
document.querySelectorAll('.buttonBorrar').forEach(button => {
    button.addEventListener('click', deleteUser);
});