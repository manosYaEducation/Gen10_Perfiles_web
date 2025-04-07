// metadataProyecto.js
document.addEventListener("DOMContentLoaded", async function () {

    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    console.log("metadataProyecto.js: ID obtenido del query string:", id);

    if (!window.API_URL_PHP) {
        console.error("API_URL_PHP no está definida");
        return;
    }

    if (!id) {
        console.warn("metadataProyecto.js: No se proporcionó 'id' de proyecto en la URL");
        return;
    }

    try {
        const response = await fetch(`${window.API_URL_PHP}project_detail.php?id=${id}`);
        const result = await response.json();

        if (Array.isArray(result) && result.length > 0) {
            const proyecto = result[0]; 
            console.log("metadataProyecto.js: Datos del proyecto obtenidos:", proyecto);
            if (proyecto && proyecto.titulo_tarjeta) {
                const metaTitle = document.querySelector('meta[property="og:title"]');
                if (metaTitle) {
                    metaTitle.setAttribute(
                        "content", 
                        proyecto.titulo_tarjeta + " - Desarrollado por Kreative Alpha Docere"
                    );
                    console.log("metadataProyecto.js: og:title actualizado:", metaTitle.getAttribute("content"));
                }

                const metaUrl = document.querySelector('meta[property="og:url"]');
                if (metaUrl) {
                    const dynamicUrl = `https://ms.alphadocere.cl/proyecto/${encodeURIComponent(proyecto.titulo_tarjeta)}`;
                    metaUrl.setAttribute("content", dynamicUrl);
                }

                // og:description (si usa `proyecto.descripcion_tarjeta`)
                const metaDescription = document.querySelector('meta[property="og:description"]');
                if (metaDescription && proyecto.descripcion_tarjeta) {
                    metaDescription.setAttribute("content", proyecto.descripcion_tarjeta);
                    console.log("metadataProyecto.js: og:description actualizado:", metaDescription.getAttribute("content"));
                }

                // og:image (si vas a usar imagen distinta, necesitarás un campo en la BD)
                const metaImage = document.querySelector('meta[property="og:image"]');
                if (metaImage) {
                    // de momento fijo
                    metaImage.setAttribute("content", "https://kreative.alphadocere.cl/assets/img/kreative_transparent.png");
                }
            } else {
                console.warn("metadataProyecto.js: El objeto del proyecto no tiene 'titulo_tarjeta'.", proyecto);
            }
        } else {
            console.warn("metadataProyecto.js: El endpoint no devolvió un array con datos o está vacío:", result);
        }
    } catch (error) {
        console.error("metadataProyecto.js: Error al obtener los datos del proyecto:", error);
    }
});
