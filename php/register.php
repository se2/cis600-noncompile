<?php
  header('Access-Control-Allow-Origin: *');
  header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
  header('Access-Control-Allow-Methods: GET, POST, PUT');

  require('php-lib/LIB.php');

  $dup = false;
  $users = array();
  $types = array('graduate', 'alumni', 'scholar');

  // get input data
  $postdata = file_get_contents("php://input");
  $request = json_decode($postdata);

  // unique id
  $id = randomString(10);

  // to save data
  $newUser = $request->data;
  $users = json_decode(file_get_contents('../data/people.json'));
  // check email duplicate
  foreach ($types as $i => $type) {
    foreach ($users->$type as $j => $user) {
      if ($newUser->email == $user->email
        || (isset($user->email2) && !empty($user->email2) && $user->email2 == $newUser->email)) {
        $dup = true;
        break;
      }
      if (isset($newUser->email2) && !empty($newUser->email2)) {
        if ($newUser->email2 == $user->email || (isset($user->email2) && !empty($user->email2) && $newUser->email2 == $user->email2)) {
          $dup = true;
          break;
        }
      }
    }
  }

  if ($dup) {
    echo json_encode(array());
  } else {
    if ($newUser != NULL) {
      if (isset($newUser->searchInput)) {
        unset($newUser->searchInput);
      }
      $type = $newUser->type;
      if ($newUser->type == 'graduate-ms' || $newUser->type == 'graduate-phd') {
        $type = 'graduate';
      }
      $newUser->id = $id;
      array_push($users->$type, $newUser);
      unlink('../data/people.json');
      file_put_contents('../data/people.json', json_encode($users, JSON_PRETTY_PRINT));
      echo json_encode($newUser);
    } else {
      echo json_encode(array());
    }
  }
?>