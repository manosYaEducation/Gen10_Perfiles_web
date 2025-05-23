// Validaciones para el formulario de perfil

document.addEventListener('DOMContentLoaded', function() {
    // Obtener los elementos del teléfono
    const phonePrefix = document.getElementById('phone-prefix');
    const phoneNumber = document.getElementById('phone-number');
    const phoneInput = document.getElementById('input-phone');
    
    if (phonePrefix && phoneNumber && phoneInput) {
        // Actualizar el campo oculto cuando cambia el prefijo
        phonePrefix.addEventListener('change', function() {
            updatePhoneValue();
            // Solo validar visualmente, sin mostrar alertas
            validatePhone(false);
        });
        
        // Actualizar el campo oculto cuando cambia el número
        phoneNumber.addEventListener('input', function() {
            updatePhoneValue();
            // Solo validar visualmente, sin mostrar alertas
            validatePhone(false);
        });
        
        // Función para actualizar el valor del campo oculto
        function updatePhoneValue() {
            const prefix = phonePrefix.value;
            const number = phoneNumber.value.trim();
            phoneInput.value = prefix + number;
        }
        
        // Inicializar el campo oculto con el prefijo predeterminado
        updatePhoneValue();
    }
    
    // Añadir validación al formulario antes de enviar
    const userForm = document.getElementById('userForm');
    if (userForm) {
        // Guardar la función original de envío
        const originalSubmitHandler = userForm.onsubmit;
        
        // Reemplazar con nuestra función de validación
        userForm.onsubmit = function(e) {
            // Si el teléfono no es válido, prevenir el envío del formulario
            if (!validatePhone(true)) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
            
            // Si llegamos aquí, el teléfono es válido
            // Actualizar el campo oculto con el valor completo
            updatePhoneValue();
            
            // Llamar al handler original si existe
            if (typeof originalSubmitHandler === 'function') {
                return originalSubmitHandler.call(this, e);
            }
        };
    }
    
    // Función para actualizar el valor del campo oculto
    function updatePhoneValue() {
        if (phonePrefix && phoneNumber && phoneInput) {
            const prefix = phonePrefix.value;
            const number = phoneNumber.value.trim();
            phoneInput.value = prefix + number;
        }
    }
});

/**
 * Valida el campo de teléfono
 * @param {boolean} showError - Si se debe mostrar un mensaje de error
 * @returns {boolean} - True si el formato es válido, false en caso contrario
 */
function validatePhone(showError = false) {
    const phonePrefix = document.getElementById('phone-prefix');
    const phoneNumber = document.getElementById('phone-number');
    
    if (!phonePrefix || !phoneNumber) return false;
    
    const prefix = phonePrefix.value;
    const number = phoneNumber.value.trim();
    
    // Quitar clases de estilo anteriores
    phoneNumber.classList.remove('valid', 'invalid');
    
    // Validar el número según el prefijo seleccionado
    if (number === '') {
        if (showError) {
            Swal.fire({
                icon: 'warning',
                title: 'Campo requerido',
                text: 'El número de teléfono es obligatorio'
            });
        }
        phoneNumber.classList.add('invalid');
        return false;
    }
    
    // Validar formato según el prefijo
    if (prefix === '+569') {
        // Para Chile: exactamente 8 dígitos
        const chileNumberRegex = /^\d{8}$/;
        if (!chileNumberRegex.test(number)) {
            if (showError) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Formato incorrecto',
                    text: 'Para números de Chile (+569), debes ingresar exactamente 8 dígitos'
                });
            }
            phoneNumber.classList.add('invalid');
            return false;
        }
    } else if (prefix === '+54') {
        // Para Argentina: entre 9 y 12 dígitos
        const argentinaNumberRegex = /^\d{9,12}$/;
        if (!argentinaNumberRegex.test(number)) {
            if (showError) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Formato incorrecto',
                    text: 'Para números de Argentina (+54), debes ingresar entre 9 y 12 dígitos'
                });
            }
            phoneNumber.classList.add('invalid');
            return false;
        }
    }
    
    // Si el formato es válido
    phoneNumber.classList.add('valid');
    return true;
}

/**
 * Muestra un mensaje de error debajo del campo de entrada
 * @param {HTMLElement} input - El elemento input
 * @param {string} message - El mensaje de error a mostrar
 */
function showErrorMessage(input, message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.color = 'red';
    errorDiv.style.fontSize = '0.8rem';
    errorDiv.style.marginTop = '5px';
    
    // Insertar el mensaje después del input
    input.parentElement.insertBefore(errorDiv, input.nextSibling);
    
    // Añadir clase de estilo al input
    input.classList.add('invalid-input');
}

/**
 * Muestra un mensaje de error debajo del grupo de teléfono
 * @param {HTMLElement} phoneGroup - El elemento contenedor del grupo de teléfono
 * @param {string} message - El mensaje de error a mostrar
 */
function showPhoneErrorMessage(phoneGroup, message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'phone-error-message';
    errorDiv.textContent = message;
    
    // Insertar el mensaje después del grupo de teléfono
    phoneGroup.appendChild(errorDiv);
}

// Función para formatear automáticamente el número de teléfono
function formatPhoneNumber(input) {
    let value = input.value.replace(/\D/g, ''); // Eliminar todos los caracteres no numéricos
    
    // Si el usuario borra todo, no hacer nada
    if (value.length === 0) {
        input.value = '';
        return;
    }
    
    // Si el número comienza con 56, añadir el +
    if (value.startsWith('56')) {
        value = '+' + value;
    } 
    // Si no comienza con 56, añadir +56
    else if (!value.startsWith('+56')) {
        value = '+56' + value;
    }
    
    input.value = value;
}
