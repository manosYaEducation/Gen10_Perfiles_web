@echo off
set DB_NAME=alphadocere_kreative
set SQL_FILE=alphadocere_Kreative_red.sql

echo 🚀 Gen10 - Importador Automatico de Base de Datos
echo --------------------------------------------------

:: Intentar encontrar mysql en la ruta de XAMPP
set MYSQL_PATH=C:\xampp\mysql\bin\mysql.exe

if not exist "%MYSQL_PATH%" (
    echo ❌ No se encontro MySQL en %MYSQL_PATH%
    set /p MYSQL_PATH="Por favor, ingresa la ruta completa a mysql.exe: "
)

:: Verificar si el archivo SQL existe
if not exist "%SQL_FILE%" (
    echo ❌ ERROR: No se encontro el archivo %SQL_FILE%
    echo ℹ️  Debes solicitar la base de datos actualizada al encargado del proyecto, 
    echo    ya que por seguridad no se incluye en el repositorio de Git.
    pause
    exit /b
)

echo 📦 Creando base de datos si no existe: %DB_NAME%
"%MYSQL_PATH%" -u root -e "CREATE DATABASE IF NOT EXISTS %DB_NAME%;"

echo ⏳ Importando %SQL_FILE%... esto puede tardar un minuto...
"%MYSQL_PATH%" -u root %DB_NAME% < %SQL_FILE%

if %ERRORLEVEL% equ 0 (
    echo ✅ Importacion completada con exito!
) else (
    echo ❌ Hubo un error en la importacion.
)

pause
