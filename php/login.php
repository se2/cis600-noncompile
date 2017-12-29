<?php
  header('Access-Control-Allow-Origin: *');
  header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
  header('Access-Control-Allow-Methods: GET, POST, PUT');

  // JSON libraries for PHP 5.1.5
  require('php-lib/HASH.php');

  $found = false;
  $dir = '../data/users';

  // get input data
  $postdata = file_get_contents("php://input");
  $request = json_decode($postdata);

  // extract login data
  $inputUsername = $request->username;
  $inputPassword = $request->password;

  $accounts = json_decode(file_get_contents('../data/accounts.json'));
  $users = array(
    'graduate' => array(),
    'alumni' => array(),
    'scholar' => array()
  );
  foreach ($accounts as $key => $account) {
    if (hash_equals(crypt($inputUsername.$inputPassword, $account->hashed), $account->hashed)) {
      $found = true;
      $common = array();
      if ($account->role == 'admin') {
        $users = json_decode(file_get_contents('../data/people.json'));
        foreach ($accounts as $key => $acc) {
          if ($acc->role == 'common') {
            $common = array(
              'id' => $acc->id,
              'username' => $acc->username
            );
            break;
          }
        }
      }
      echo json_encode(
        array(
          'found' => $found,
          'account' => array(
            'id' => $account->id,
            'username' => $account->username,
            'email' => $account->email,
            'role' => $account->role
          ),
          'common' => $common,
          'users' => $users
        )
      );
      break;
    }
  }
?>