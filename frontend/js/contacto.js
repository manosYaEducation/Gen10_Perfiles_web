document.getElementById("contactForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Evita el envío inmediato del formulario
    
    const formData = new FormData(this); // Captura los datos del formulario

    // Muestro los datos del formulario
    // console.log(formData.get("nombre"));
    // console.log(formData.get("email"));
    // console.log(formData.get("telefono"));
    // console.log(formData.get("asunto"));
    // console.log(formData.get("mensaje"));

    // declaro variables en base a los nombres de form
    let nombre = formData.get("nombre");
    let email = formData.get("email");
    let telefono = formData.get("telefono");
    let asunto = formData.get("asunto");
    let mensaje = formData.get("mensaje");
    // Creacion Variable Validacion Email
    let correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    // console.log(correoValido);

    // Creacion Variable Validacion telefono
    let telefonoValido = /^\+?[0-9\s\-()]{7,20}$/.test(telefono);
    // console.log(telefonoValido);    

    // Funcion para mostrar al usuario que campo falta dependiendo del else if de abajo que valida si la variable es nula o incorrecta
    function mostrarfaltante(campo){
        switch (campo){
            case "nombre":
                let nombreform = document.getElementById("nombre");
                nombreform.setCustomValidity("Este Campo Es Obligatorio.");
                nombreform.reportValidity();
                break;
            case "email":
                let emailform = document.getElementById("email");
                emailform.setCustomValidity("Correo no valido.");
                emailform.reportValidity();
                break;
            case "telefono":
                let telefonoform = document.getElementById("telefono");
                telefonoform.setCustomValidity("Telefono no valido.");
                telefonoform.reportValidity();
                break;
            case "asunto":
                let asuntoform = document.getElementById("asunto");
                asuntoform.setCustomValidity("Este Campo Es Obligatorio.");
                asuntoform.reportValidity();
                break;
            case "mensaje":
                let mensajeform = document.getElementById("mensaje");
                mensajeform.setCustomValidity("Este Campo Es Obligatorio.");
                mensajeform.reportValidity();
                break;
            
        }
    }

    if (nombre && correoValido && telefonoValido && asunto && mensaje){
    console.log("Pasando el form por post")    

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
    });}
    // Si no existe o el campo no es valido enviamos a la funcion para mensaje de completar campo en form html
    else if(!nombre){mostrarfaltante("nombre")
    }
    else if(!correoValido){mostrarfaltante("email")
    }
    else if(!telefonoValido){mostrarfaltante("telefono")
    }
    else if(!asunto){mostrarfaltante("asunto")
    }
    else if(!mensaje){mostrarfaltante("mensaje")
    }
    
});

// Función para cerrar el modal
function closeModal() {
    const modal = document.getElementById('successModal');
    modal.close();
    window.location.href = "./index.html"; // Redireccionar después de cerrar el modal
}