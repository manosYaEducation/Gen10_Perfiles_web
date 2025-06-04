<?php
$url = 'http://localhost/modulo-de-servicios/back/api/json_ordenes.php';

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);

if(curl_errno($ch)) {
    echo 'Error en cURL: ' . curl_error($ch);
} else {
    echo json_encode($response);
}

curl_close($ch);
?>
