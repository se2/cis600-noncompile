<?php
  header('Access-Control-Allow-Origin: *');
  header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
  header('Access-Control-Allow-Methods: GET, POST, PUT');

  // error_reporting(E_ALL);
  // ini_set('display_errors', 1);

  $found = false;
  $users = json_decode(file_get_contents('../data/people.json'));
  $model = array();

  // get input data
  $postdata = file_get_contents("php://input");
  $request = json_decode($postdata);
  $userId = $request->userId;
  $type = $request->type;
  switch ($type) {
    case 'graduate':
      $model = $users->graduate;
      break;

    case 'alumni':
      $model = $users->alumni;
      break;

    case 'scholar':
      $model = $users->scholar;
      break;

    default:
      $model = $users->graduate;
      break;
  }
  foreach ($model as $key => $user) {
    if ($user->id == $userId) {
      $found = true;
      if ($user->avatar != 'images/noimage.png') {
        unlink('../' . $user->avatar);
      }
      array_splice($users->$type, $key, 1);
      break;
    }
  }
  if ($found) {
    unlink('../data/people.json');
    file_put_contents('../data/people.json', json_encode($users, JSON_PRETTY_PRINT));
  }
  echo json_encode(array('found' => $found));
?>