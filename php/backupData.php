<?php
  header('Access-Control-Allow-Origin: *');
  header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
  header('Access-Control-Allow-Methods: GET, POST, PUT');

  $dir = '../data/backup/';
  $backup = false;

  // get input data
  $postdata = file_get_contents("php://input");
  $request = json_decode($postdata);

  $fileName = $request->file;

  unlink($dir . $fileName . '.bak.json');
  if (copy('../data/' . $fileName . '.json', $dir . $fileName . '.bak.json')) {
    $backup = true;
  }

  echo json_encode(array('backup' => $backup));
?>