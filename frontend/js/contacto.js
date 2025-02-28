document.getElementById("contactForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Evita el envío inmediato del formulario
    
    const formData = new FormData(this); // Captura los datos del formulario
    
    fetch("https://formsubmit.co/kreativegen10@gmail.com", {
        method: "POST",
        body: formData
    })
    .then(response => {
        if (response.ok) {
            // Si la respuesta es exitosa, se muestra un mensaje para el usuario
            const modal = document.getElementById('successModal');
            modal.showModal();

            // Limpiar el formulario después de enviarlo
            document.getElementById("contactForm").reset();
        } else {
            throw new Error("Error al enviar el formulario");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Hubo un error al enviar el mensaje. Inténtelo nuevamente.");
    });
});

// Función para cerrar el modal
function closeModal() {
    const modal = document.getElementById('successModal');
    modal.close();
    window.location.href = "./index.html"; // Redireccionar después de cerrar el modal
}