<?php
  header('Access-Control-Allow-Origin: *');
  header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
  header('Access-Control-Allow-Methods: GET, POST, PUT');

  // get input data
  $postdata = file_get_contents("php://input");
  $request = json_decode($postdata);

  $file = $request->file;

  // get data
  if (file_exists('../data/' . $file . '.json')) {
    $data = file_get_contents('../data/' . $file . '.json');
    echo json_encode($data);
  } else {
    echo json_encode(array());
  }
?>