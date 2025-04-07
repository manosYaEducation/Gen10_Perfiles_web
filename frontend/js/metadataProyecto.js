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
                // 1) Título completo tal cual (sin recortes)
                const metaTitle = document.querySelector('meta[property="og:title"]');
                if (metaTitle) {
                    metaTitle.setAttribute(
                        "content", 
                        proyecto.titulo_tarjeta + " - Desarrollado por Kreative Alpha Docere"
                    );
                    console.log("metadataProyecto.js: og:title actualizado:", metaTitle.getAttribute("content"));
                }

                // 2) URL dinámica (con encodeURIComponent)
                const metaUrl = document.querySelector('meta[property="og:url"]');
                if (metaUrl) {
                    const dynamicUrl = `https://kreative.alphadocere.cl/frontend/proyecto-detalle.html?id=${encodeURIComponent(id)}`;
                    metaUrl.setAttribute("content", dynamicUrl);
                }

                // 3) Descripción — aquí aplicamos la función shortenText (hasta 200 caracteres)
                const metaDescription = document.querySelector('meta[property="og:description"]');
                if (metaDescription && proyecto.descripcion_tarjeta) {
                    const shortenedDescription = shortenText(proyecto.descripcion_tarjeta, 200);
                    metaDescription.setAttribute("content", shortenedDescription);
                    console.log("metadataProyecto.js: og:description actualizado:", metaDescription.getAttribute("content"));
                }

                // 4) Imagen
                const metaImage = document.querySelector('meta[property="og:image"]');
                if (metaImage) {
                    // De momento se deja un valor fijo
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

/**
 * Función para acortar un texto a la longitud indicada (maxLength) 
 * sin cortar una palabra a medias. Añade "..." si es truncado.
 * @param {string} text - Texto original.
 * @param {number} maxLength - Longitud máxima.
 * @returns {string} - Texto acortado (o el original si no excede la longitud).
 */
function shortenText(text, maxLength = 200) {
    if (!text) return "";
    // Si no sobrepasa el límite, se deja tal cual.
    if (text.length <= maxLength) {
        return text;
    }
    // Buscar el último espacio antes (o en) maxLength
    let endIndex = text.lastIndexOf(" ", maxLength);
    // Si no encuentra espacio, corta en maxLength.
    if (endIndex === -1) {
        endIndex = maxLength;
    }
    return text.slice(0, endIndex) + "...";
}
