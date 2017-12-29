<?php
  header('Access-Control-Allow-Origin: *');
  header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
  header('Access-Control-Allow-Methods: GET, POST, PUT');

  // PHP libraries for PHP 5.1.5
  require('php-lib/HASH.php');

  $found = false;
  $errorMsg = '';

  // get input data
  $postdata = file_get_contents("php://input");
  $request = json_decode($postdata);

  // extract data
  $id = $request->account->id;
  $username = $request->account->username;
  $current = $request->account->currentPassword;
  $new = $request->account->newPassword;

  $newAccount = array();
  $accounts = json_decode(file_get_contents('../data/accounts.json'));

  foreach ($accounts as $key => $account) {
    if ($account->id == $id && hash_equals($account->hashed, crypt($account->username.$current, $account->hashed))) {
      $found = true;
      $newHashed = crypt($username.$new);
      $account->username = $username;
      $account->hashed = $newHashed;
      $accounts[$key] = $account;
      $newAccount = $account;
      unlink("../data/accounts.json");
      file_put_contents('../data/accounts.json', json_encode($accounts, JSON_PRETTY_PRINT));
      break;
    } else {
      $errorMsg = 'Incorrect Password!';
    }
  }
  echo json_encode(array('updated' => $found, 'account' => $newAccount, 'error' => $errorMsg));
?>