const loginF = document.querySelector('form');
loginF.addEventListener('submit', async (event) => {
    event.preventDefault();
    const username = document.querySelector('#username').value;
    const password = document.querySelector('#password').value;
    const mantenerSesion = document.querySelector('#mantenerSesion').checked;
    // Verificar si los campos están vacíos antes de enviar la solicitud
    if (!username || !password) {
        alert('Por favor ingresa ambos campos: usuario y contraseña.');
        return;
    }
    try {
        const response = await fetch(API_URL_PHP + 'login.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username, password})
        });
        // Log de la respuesta
        const result = await response.json();
        if (response.ok && result.status === 'success') {

            
            if (mantenerSesion) {
                localStorage.setItem('userLoggedIn', 'true');
                localStorage.setItem('username', username);
                localStorage.setItem('sessionPermanent', 'true');
            } else {
                sessionStorage.setItem('userLoggedIn', 'true');
                sessionStorage.setItem('username', username);
                sessionStorage.setItem('sessionPermanent', 'false');
            }
            const localURL = 'http://127.0.0.1:5501/frontend/index-admin.html';
            const fallbackURL = 'https://kreative.alphadocere.cl/frontend/index-admin.html';
            fetch(localURL, { method: 'HEAD' })
                .then(() => {
                    window.location.href = localURL;
                })
                .catch(() => {
                    window.location.href = fallbackURL;
                });
        } else {
            alert(result.message || 'Usuario o contraseña incorrectos.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Hubo un error al procesar tu solicitud. Inténtalo nuevamente.');
    }
});
