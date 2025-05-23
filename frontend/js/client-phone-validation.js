// Validación del teléfono para el formulario de creación de clientes

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
        
        // Agregar validación al formulario antes de enviar
        const clientForm = document.getElementById('ClientForm');
        if (clientForm) {
            const originalSubmitHandler = clientForm.onsubmit;
            
            clientForm.onsubmit = function(e) {
                // Si el teléfono no es válido, prevenir el envío del formulario
                if (!validatePhone(true)) {
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                }
                
                // Actualizar el campo oculto con el valor completo
                updatePhoneValue();
                
                // Continuar con el envío normal del formulario
                return true;
            };
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
