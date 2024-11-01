<?php

$host = 'localhost';
$port ='5432';
$user ='user';
$password = 'password';
$nameDb ='bd';  

$info = "host=$host port=$port dbname=$nameDb user=$user password=$password";
$conn = pg_connect($info);



if (!$conn){
    echo "Conexión fallida".pg_last_error();
} else {
    echo "Conexión exitosa";
}


pg_close($conn);