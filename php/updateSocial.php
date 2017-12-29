<?php
  header('Access-Control-Allow-Origin: *');
  header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
  header('Access-Control-Allow-Methods: GET, POST, PUT');

  $found = false;

  // get input data
  $postdata = file_get_contents("php://input");
  $request = json_decode($postdata);

  // extract data
  $userId = $request->userId;
  $homepage = $request->homepage;
  $facebook = $request->facebook;
  $linkedin = $request->linkedin;

  $users = json_decode(file_get_contents('../data/people.json'));
  $models = array($users->graduate, $users->alumni, $users->scholar);
  foreach ($models as $i => $model) {
    if (!$found) {
      foreach ($model as $j => $user) {
        if ($user->id == $userId) {
          $found = true;
          $user->homepage = $homepage;
          $user->facebook = $facebook;
          $user->linkedin = $linkedin;
        }
      }
    }
  }
  if ($found) {
    unlink('../data/people.json');
    file_put_contents('../data/people.json', json_encode($users, JSON_PRETTY_PRINT));
  }
  echo json_encode(array('updated' => $found));
?>