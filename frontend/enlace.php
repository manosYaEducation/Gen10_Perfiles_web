<?php

//Definimos nombres a los URL
$destinos = [
    'discord' => 'https://discord.gg/qfVaduqDcT',
    'dashboard' => 'https://docs.google.com/spreadsheets/d/1kP0UVn1fCObJBQ8DkieJU2WV5xrRUbGXSPRXGwBQE9c/edit?usp=sharing',
    'trello' => 'https://trello.com/b/H83CEBss/gen-13y-14-alpha-docere',
    'whatsapp' => 'https://chat.whatsapp.com/JDS26LKdnPqIPsfHCCoug6',
    'wordpress' => 'https://blog.alphadocere.cl/wp-admin/',
    'tienda' => 'https://tienda.alphadocere.cl/wp-admin/'
];

//Tomamos el parámetro de "destino" de la URL, sino existe se le asigna "null"
$clave = $_GET['destino'] ?? null;

//Se chequea que existe el parámetro y si está dentro del arreglo, sino envía un error
if ($clave && isset($destinos[$clave])) {
    header("Location: " . $destinos[$clave]);
    exit;
} else {
    http_response_code(404);
    echo "Enlace no válido.";
}

?> 