<?php

include 'conexion.php';   // hay que cambiar conexion.php a connections.php

$data = json_decode(file_get_contents("php://input"));

try {
    $conn->beginTransaction();

    $stmt = $conn -> prepare("INSERT INTO profile (name, location, phone, email, description) VALUES (?, ?, ?, ?, ?) RETURNING id");
    $stmt-> execute([$data->basic->name, $data->basic->location, $data->basic->phone, $data->basic->email, $data->basic->description]);
    $profileId = $stmt -> fetchColumn();

    foreach($data->experience as $exp){
        $stmt = $conn -> prepare("INSERT INTO experience (profileId, title, description, startDate, endDate) VALUES (?, ?, ?, ?, ?)");
        $stmt-> execute([$profileId, $exp->title, $exp->details[0]->description ?? null, $exp->startDate, $exp->endDate]);
    }

    foreach($data->education as $edu){
        $stmt = $conn -> prepare("INSERT INTO education (profileId, title, description, startDate, endDate) VALUES (?, ?, ?, ?, ?)");
        $stmt-> execute([$profileId, $edu->title, $edu->description, $edu->startDate, $edu->endDate]);
    }

    // foreach($data->interests as $interest){
    //     $stmt = $conn -> prepare("INSERT INTO interest (profileId, interest) VALUES (?, ?)");
    //     $stmt-> execute([$profileId, $interest]);
    // }

    // foreach($data->skills as $skill){
    //     $stmt = $conn -> prepare("INSERT INTO skill (profileId, skill) VALUES (?, ?)");
    //     $stmt-> execute([$profileId, $skill]);
    // }

    // foreach($data->social as $social){
    //     $stmt = $conn -> prepare("INSERT INTO social (profileId, platform, url) VALUES (?, ?, ?)");
    //     $stmt-> execute([$profileId, $social->platform, $social->url]);
    // }

    $conn -> commit();

    echo json_encode(['success' => true, 'message' => 'Usuario creado con éxito']);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e ->getMessage()]);
}

