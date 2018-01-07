<?php
  header('Access-Control-Allow-Origin: *');
  header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
  header('Access-Control-Allow-Methods: GET, POST, PUT');

  $found = false;

  // get input data
  $postdata = file_get_contents("php://input");
  $request = json_decode($postdata);

  // extract data
  $inputUser = $request->data;
  $users = json_decode(file_get_contents('../data/people.json'));
  $models = array($users->graduate, $users->alumni, $users->scholar);
  $types = array('graduate', 'alumni', 'scholar');
  $type = $inputUser->type;
  switch ($type) {
    case 'graduate-ms':
      $type = 'graduate';
      break;

    case 'graduate-phd':
      $type = 'graduate';
      break;

    case 'alumni':
      $type = 'alumni';
      break;

    case 'scholar':
      $type = 'scholar';
      break;
  }
  foreach ($models as $i => $model) {
    if (!$found) {
      foreach ($model as $j => $user) {
        if ($user->id == $inputUser->id) {
          $found = true;
          array_splice($users->$types[$i], $j, 1);
        }
      }
    }
  }
  if ($found && $inputUser != NULL) {
    if (isset($inputUser->searchInput)) {
      unset($inputUser->searchInput);
    }
    array_push($users->$type, $inputUser);
    unlink('../data/people.json');
    file_put_contents('../data/people.json', json_encode($users, JSON_PRETTY_PRINT));
  }
  echo json_encode(array('updated' => $found));
?>