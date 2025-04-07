document.addEventListener("DOMContentLoaded", async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    if (!window.API_URL_PHP) {
        console.error('API_URL_PHP no está definida');
        return;
    }
    try {
        const response = await fetch(`${window.API_URL_PHP}read_user.php?id=${id}`);
        const result = await response.json();
        const profile = result.data;

        // Mostrar imagen de perfil si existe
        if (result.data.image) {
            var imagen = result.data.image;
            // METADATA
            // CambiarNombre
            // var metadatanombre = document.querySelector('meta[name="author"]');
            // const nombreperfil = profile.basic.name;
            // metadatanombre.setAttribute("content", nombreperfil);

                // CambiarTitle
            var metadatatitle = document.querySelector('meta[property="og:title"]');
            const nombretitle = profile.basic.name;
            metadatatitle.setAttribute("content"   , "Perfil de " + nombretitle +" - Kreative Alpha Docere");  

            // CambiarTitle
            var metadataurl = document.querySelector('meta[property="og:url"]');
            const nombreurl = profile.basic.id;
            metadataurl.setAttribute("content"   , "http://localhost/Gen10_Perfiles_web/frontend/perfiles/profile-template.html?id="+nombreurl);
              
            // CambiarImagen
             var metadataimg = document.querySelector('meta[property="og:img"]');
            const nombreimg = profile.basic.image;
            metadataimg.setAttribute("content"   , nombreimg);              
            
            
        }
    } catch (error) {
        console.error('Error al obtener los datos:', error);
    }
});