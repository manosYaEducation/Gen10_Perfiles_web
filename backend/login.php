<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

echo "Inicio del script";

include 'conexion.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Verificar que los campos no estén vacíos
    if (empty($_POST['username']) || empty($_POST['password'])) {
        echo "Por favor ingresa ambos campos: usuario y contraseña.";
        exit();
    }

    // Recibir el nombre de usuario y la contraseña del formulario
    $username = trim($_POST['username']);
    $password = $_POST['password'];


    try {
        // Consultar la base de datos para obtener el usuario
        $stmt = $conn->prepare('SELECT * FROM users WHERE username = :username');
        $stmt->bindParam(':username', $username);
        $stmt->execute();
        
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user && password_verify($password, $user['password'])) {
            // Si la contraseña es correcta, se inicia sesión
            $_SESSION['id'] = $user['id'];
            $_SESSION['username'] = $user['username'];

            // Redirigir a la página de administración o panel de control
            header('https://gen10.alphadocere.cl/frontend/index-admin.html');
            exit();
        } else {
            echo "Nombre de usuario o contraseña incorrectos.";
        }
    } catch (PDOException $e) {
        echo "Error al consultar la base de datos: " . $e->getMessage();
    }
}