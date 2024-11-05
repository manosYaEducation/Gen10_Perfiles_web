async function deleteUser(id) {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    try {
        const response = await fetch(`http://localhost:8000/delete_user.php?id=${id}`, {
            method: 'DELETE',
        });
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error(error);
    }
}

document.getElementById('buttonBorrar').addEventListener('click', deleteUser);