<?php
  header('Access-Control-Allow-Origin: *');
  header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
  header('Access-Control-Allow-Methods: GET, POST, PUT');

  // get input data
  $postdata = file_get_contents("php://input");
  $request = json_decode($postdata);

  $search =  $request->search;

  $returnUsers = array();
  $users = json_decode(file_get_contents('../data/people.json'));
  $models = array($users->graduate, $users->alumni, $users->scholar);
  foreach ($models as $i => $model) {
    foreach ($model as $j => $user) {
      if ($search == strtolower($user->firstname)
      || $search == strtolower($user->lastname)
      || $search == strtolower($user->fullname)
      || $search == strtolower($user->firstname . ' ' . $user->lastname)
      || $search == strtolower($user->email)
      || (isset($user->email2) && $search == strtolower($user->email2))) {
        $returnUsers[] = $user;
      }
    }
  }
  echo json_encode($returnUsers);
?>