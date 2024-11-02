

// include 'connection.php';

// $data = json_decode(file_get_contents("php://input"));

// try{
//     $conn -> beginTransaction();

//     $stmt = $conn->prepare("UPDATE profile SET name = ?, location = ?, phone = ?, email = ?, description = ? WHERE id = ?");
//     $stmt -> execute([$data->basic->name, $data->basic->location, $data->basic->phone, $data->basic->email, $data->basic->description, $data->basic->id]); 
    

//     foreach($data -> experience as $exp) {
//         if(isset($exp->id)) {
//             $stmt = $conn -> prepare("UPDATE experience SET title = ?, description = ?, startDate = ?, endDate = ? WHERE id = ?");
//             $stmt -> execute([$exp->title, $exp->details[0]->description ?? null, $exp->startDate, $exp->endDate, $exp->id]);
//         } else {
//             $stmt = $conn -> prepare("INSERT INTO experience ();
//         }