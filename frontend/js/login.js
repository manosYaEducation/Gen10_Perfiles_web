const loginF = document.querySelector('form');

loginF.addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = document.querySelector('#username').value;
    const password = document.querySelector('#password').value;

    // Verificar si los campos están vacíos antes de enviar la solicitud
    if (!username || !password) {
        alert('Por favor ingresa ambos campos: usuario y contraseña.');
        return;
    }

    console.log('Enviando datos:', { username, password }); // Verifica los valores enviados

    try {
        const response = await fetch(API_URL + 'login.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username, password})
        });

        // Log de la respuesta
        console.log('URL de la respuesta:', response.url);

        const result = await response.json();

        console.log(result); // Verifica los valores enviados

        if (response.ok && result.status === 'success') {
            window.location.href = 'http://127.0.0.1:5501/frontend/index-admin.html';
        } else {
            alert(result.message || 'Usuario o contraseña incorrectos.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Hubo un error al procesar tu solicitud. Inténtalo nuevamente.');
    }
});
