<?php
  header('Access-Control-Allow-Origin: *');
  header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
  header('Access-Control-Allow-Methods: GET, POST, PUT');

  $found = false;

  $dir = "../data/users";
  $users = array();

  foreach ( glob( $dir . '/*.*' ) as $file ) {
    $user = json_decode(file_get_contents($file));
    if (!isset($user->firstlast) || $user->firstlast == NULL) {
      $user->firstlast = $user->firstname . ' ' . $user->lastname;
    }
    $users[] = $user;
  }

  echo json_encode($users);
?>