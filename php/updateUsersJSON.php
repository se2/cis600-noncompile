<?php
  header('Access-Control-Allow-Origin: *');
  header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
  header('Access-Control-Allow-Methods: GET, POST, PUT');

  $dir = "../data/users/";
  $users = array();

  unlink('../data/people.json');
  foreach ( glob( $dir . '*.*' ) as $file ) {
    $user = json_decode(file_get_contents($file));
    $users[] = $user;
  }
  file_put_contents('../data/people.json', json_encode($users, JSON_PRETTY_PRINT));
  echo json_encode(array('updated' => true));
?>