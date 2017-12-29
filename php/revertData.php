<?php
  header('Access-Control-Allow-Origin: *');
  header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
  header('Access-Control-Allow-Methods: GET, POST, PUT');

  $dir = '../data/backup/';
  $revert = false;

  // get input data
  $postdata = file_get_contents("php://input");
  $request = json_decode($postdata);

  $fileName = $request->file;

  unlink('../data/' . $fileName . '.json');
  if (copy($dir . $fileName . '.bak.json', '../data/' . $fileName . '.json')) {
    $revert = true;
  }

  echo json_encode(array('revert' => $revert));
?>