@echo off
chcp 65001 >nul
echo ================================================
echo  Gen10 - Importador de Base de Datos
echo ================================================
echo.

:: Configuracion - ajusta si tu XAMPP esta en otro disco
set MYSQL_PATH=C:\xampp\mysql\bin\mysql.exe
set DB_USER=root
set DB_PASS=
set DB_NAME=alphadocere_kreative
set SQL_FILE=%~dp0alphadocere_kreative.sql

:: Verificar que MySQL existe
if not exist "%MYSQL_PATH%" (
    echo [ERROR] No se encontro MySQL en: %MYSQL_PATH%
    echo Edita este archivo y ajusta la variable MYSQL_PATH
    pause
    exit /b 1
)

:: Verificar que el archivo SQL existe
if not exist "%SQL_FILE%" (
    echo [ERROR] No se encontro el archivo: %SQL_FILE%
    echo Asegurate de que alphadocere_kreative.sql este en la misma carpeta que este .bat
    pause
    exit /b 1
)

echo [1/3] Creando base de datos si no existe: %DB_NAME%
"%MYSQL_PATH%" -u%DB_USER% %DB_PASS% -e "CREATE DATABASE IF NOT EXISTS `%DB_NAME%` CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;"
if errorlevel 1 (
    echo [ERROR] No se pudo conectar a MySQL. Verifica que XAMPP este corriendo.
    pause
    exit /b 1
)

echo [2/3] Aumentando limite de paquetes para imagenes grandes...
"%MYSQL_PATH%" -u%DB_USER% %DB_PASS% -e "SET GLOBAL max_allowed_packet=256*1024*1024;"

echo [3/3] Importando %DB_NAME%.sql... esto puede tardar varios minutos...
"%MYSQL_PATH%" -u%DB_USER% %DB_PASS% --max_allowed_packet=256M %DB_NAME% < "%SQL_FILE%"

if errorlevel 1 (
    echo.
    echo [ERROR] Hubo un error en la importacion.
    echo.
    echo Posibles causas:
    echo  - XAMPP no esta corriendo (inicia Apache y MySQL desde XAMPP Control Panel)
    echo  - El archivo SQL esta corrupto
    echo  - La contrasena de MySQL es incorrecta (edita DB_PASS en este archivo)
    echo.
) else (
    echo.
    echo ================================================
    echo  Importacion completada exitosamente!
    echo  Base de datos: %DB_NAME%
    echo  Tablas importadas: clients, education, experience,
    echo    imagenes, imagenes_clientes, interest, profile,
    echo    proyectos, proyectos_detalles, review, skill,
    echo    social, status, users  (14 tablas)
    echo ================================================
)

echo.
pause