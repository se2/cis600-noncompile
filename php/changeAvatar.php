<?php
  header('Access-Control-Allow-Origin: *');
  header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
  header('Access-Control-Allow-Methods: GET, POST, PUT');

  $userId = $_POST['userId'];
  $type = $_POST['type'];
  $model = array();
  $uploaded = false;
  $found = false;
  $imgDir = 'data/images/';

  $users = json_decode(file_get_contents('../data/people.json'));
  switch ($type) {
    case 'graduate-ms':
      $model = $users->graduate;
      break;

    case 'graduate-phd':
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
  if (isset($_FILES["file"]["name"])) {
    foreach ($model as $key => $user) {
      if ($user->id == $userId) {
        $found = true;
        $temp = explode(".", $_FILES["file"]["name"]);
        $newfilename =  str_replace(' ', '', ($user->firstname . $user->lastname)) . '-' . date('Y-m-d-h-m-s') . '.' . end($temp);
        if (move_uploaded_file($_FILES["file"]["tmp_name"], '../data/images/' . $newfilename)) {
          unlink('../' . $user->avatar);
          $uploaded = true;
          $fileName = str_replace(' ', '', ($user->firstname . $user->lastname)) . $user->year;
          $user->avatar = $imgDir . $newfilename;
          echo json_encode(array('uploaded' => $uploaded, 'user' => $user));
        } else {
          echo json_encode(array('uploaded' => $uploaded, 'user' => array()));
        }
        break;
      }
    }
    if ($found) {
      unlink('../data/people.json');
      file_put_contents('../data/people.json', json_encode($users, JSON_PRETTY_PRINT));
    }
    if (!$found) {
      echo json_encode(array('uploaded' => $uploaded, 'user' => array()));
    }
  }
?>