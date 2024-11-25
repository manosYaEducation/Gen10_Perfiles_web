const loginF = document.querySelector('form');

loginF.addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = document.querySelector('#username').value;
    const password = document.querySelector('#password').value;

    try {
        const response = await fetch('https://gen10.alphadocere.cl/backend/login.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const result = await response.json();

        if (response.ok && result.status === 'success') {
            window.location.href = 'https://gen10.alphadocere.cl/frontend/index-admin.html';
        } else {
            alert(result.message || 'Usuario o contraseña incorrectos.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Hubo un error al procesar tu solicitud. Inténtalo nuevamente.');
    }
});
