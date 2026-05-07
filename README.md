# 🚀 Gen10 - Sistema de Gestión de Perfiles

## 📋 Instalación Rápida

1. **Clona el repositorio**
   ```bash
   git clone [URL_DEL_REPOSITORIO]
   cd Gen10_Perfiles_web
   ```

2. **Instala dependencias**
   ```bash
   composer install
   ```

3. **Configura el entorno**
   ```bash
   cp .env.ejemplo .env
   ```

4. **Edita el archivo `.env`**
   - Configura tus credenciales locales
   - Ajusta la configuración de producción según sea necesario

6. **Importa la Base de Datos**  
   > [!IMPORTANT]
   > El archivo de base de datos (`alphadocere_Kreative_red.sql`) **no está incluido en el repositorio** por seguridad. Debes solicitárselo al encargado del proyecto.

   Una vez que tengas el archivo en la raíz del proyecto, tienes dos opciones:

   **Opción A: Script Automático (Recomendado)**
   - Ejecuta el archivo `setup_database.bat` haciendo doble clic.
   - Esto importará la base de datos automáticamente usando la terminal, saltándose los límites de tamaño de PHP.

   **Opción B: phpMyAdmin (Manual)**
   Si prefieres usar phpMyAdmin, debes aumentar los límites de XAMPP:
   1. **Editar `my.ini` (MySQL):**
      - Cambia `max_allowed_packet=64M` (o más, ej. `128M`).
   2. **Editar `php.ini` (Apache):**
      - Cambia `upload_max_filesize=128M`
      - Cambia `post_max_size=128M`
      - Cambia `memory_limit=256M`
   3. **Reinicia Apache y MySQL** desde el panel de XAMPP.

7. **¡Listo para comenzar!**

## 📋 Registro

1. **Ingresa a nuestro [registro de usuario](https://systemauth.alphadocere.cl/register.html)**

2. **Completa el formulario con la información solicitada**

3. **Una vez registrado, se enviará un mensaje al correo electrónico asociado para verificar tu cuenta**  

## 🛠️ Tecnologías Utilizadas

[![PHP](https://img.shields.io/badge/PHP-7.4%2B-777BB4?logo=php)](https://www.php.net/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql&logoColor=white)](https://www.mysql.com/)
[![jQuery](https://img.shields.io/badge/jQuery-0769AD?logo=jquery&logoColor=white)](https://jquery.com/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.2-7952B3?logo=bootstrap&logoColor=white)](https://getbootstrap.com/)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Font Awesome](https://img.shields.io/badge/Font%20Awesome-528DD7?logo=font-awesome&logoColor=white)](https://fontawesome.com/)  

## 🔒 Notas Importantes
- ⚠️ **Nunca** subas el archivo `.env` al repositorio
- 🔄 Mantén actualizado el archivo `.env.ejemplo` con cualquier cambio en las variables de entorno
