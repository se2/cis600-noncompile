<?php
  header('Access-Control-Allow-Origin: *');
  header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
  header('Access-Control-Allow-Methods: GET, POST, PUT');

  $updated = false;

  // get input data
  $postdata = file_get_contents("php://input");
  $request = json_decode($postdata);

  $data = $request->data;
  $fileName = $request->file;

  // update new data
  unlink('../data/' . $fileName . '.json');
  if (!empty($data)) {
    file_put_contents('../data/' . $fileName . '.json', json_encode($data, JSON_PRETTY_PRINT));
  }
  $updated = true;

  echo json_encode(array('updated' => $updated));
?>