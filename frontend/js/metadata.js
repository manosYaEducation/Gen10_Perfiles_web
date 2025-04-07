// metadata.js
document.addEventListener("DOMContentLoaded", async function () {

    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    
    console.log("metadata.js: ID obtenido del query string:", id);

    if (!window.API_URL_PHP) {
        console.error("API_URL_PHP no está definida");
        return;
    }

    try {
        const response = await fetch(`${window.API_URL_PHP}read_user.php?id=${id}`);
        const result = await response.json();
        const profile = result.data;
        
        // Verificar que la propiedad "data" y "image" existen
        if (profile && profile.image) {

            // Cambiar Title
            const metadatatitle = document.querySelector('meta[property="og:title"]');
            const nombretitle = profile.basic.name;
            metadatatitle.setAttribute("content", "Perfil de " + nombretitle + " - Kreative Alpha Docere");
            console.log("metadata.js: og:title actualizado a:", metadatatitle.getAttribute("content"));

            // Cambiar URL
            const metadataurl = document.querySelector('meta[property="og:url"]');
            metadataurl.setAttribute("content", "http://localhost/Gen10_Perfiles_web/frontend/perfiles/profile-template.html?id=" + profile.basic.id);

            // Cambiar Imagen (asegúrate de usar "og:image")
            const metadataimg = document.querySelector('meta[property="og:image"]');
            metadataimg.setAttribute("content", profile.basic.image);
        } else {
            console.log("metadata.js: No se encontró imagen en el perfil o datos incompletos.");
        }
    } catch (error) {
        console.error("Error al obtener los datos:", error);
    }
});

