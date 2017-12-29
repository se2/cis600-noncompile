<?php
  header('Access-Control-Allow-Origin: *');
  header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
  header('Access-Control-Allow-Methods: GET, POST, PUT');

  $found = false;
  $users = json_decode(file_get_contents('../data/people.json'));
  $returnUser = array();
  // get input data
  $postdata = file_get_contents("php://input");
  $request = json_decode($postdata);
  $userId = $request->userId;
  foreach ($users as $key => $user) {
    if ($user->id == $userId) {
      $found = true;
      if (!isset($user->firstlast) || $user->firstlast == NULL) {
        $user->firstlast = $user->firstname . ' ' . $user->lastname;
      }
      $returnUser = $user;
    }
  }
  echo json_encode(array('found' => $found, 'user' => $returnUser));
?>