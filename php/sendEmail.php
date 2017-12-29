<?php
  header('Access-Control-Allow-Origin: *');
  header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization");
  header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, OPTIONS');

  // PHP libraries for PHP 5.1.5
  require('php-lib/HASH.php');
  require('php-lib/LIB.php');

  $sent = false;

  // get input data
  $postdata = file_get_contents("php://input");
  $request = json_decode($postdata);

  // extract data
  $account = $request->account;
  $receivingEmail = $request->receivingEmail;
  $selected = $request->selected;
  $from = $request->from;
  $cc = $request->cc;
  $test = $request->test;
  $subject = $request->subject;
  $body = $request->body;

  $message = $body;
  $headers = 'From: ' . $from . ' <' . $receivingEmail . '>' . PHP_EOL . 'X-Mailer: PHP/' . phpversion();
  $headers .= "Reply-To: ". strip_tags($receivingEmail) . "\r\n";
  if (isset($request->cc) && !empty($cc)) {
    $headers .= 'CC: '. $cc . "\r\n";
  }
  $headers .= "MIME-Version: 1.0\r\n";
  $headers .= "Content-Type: text/html; charset=ISO-8859-1\r\n";

  if (empty($test)) {
    // send emails
    $find = array('[*FIRST-NAME*]', '[*LAST-NAME*]');
    foreach ($selected as $key => $user) {
      $replace = array($user->firstname, $user->lastname);
      $message = str_replace($find, $replace, $body);
      if (isset($user->email) && $user->email !== NULL && !empty($user->email)) {
        mail($user->email, $subject, $message, $headers);
      }
      if (isset($user->email2) && $user->email2 !== NULL && !empty($user->email2)) {
        mail($user->email2, $subject, $message, $headers);
      }
    }
  } else {
    mail($test, $subject, $message, $headers);
  }

  // update receiving email for account
  $accounts = json_decode(file_get_contents('../data/accounts.json'));
  foreach ($accounts as $key => $acc) {
    if ($account->id == $acc->id && $account->role == 'admin') {
      $acc->email = $receivingEmail;
    }
  }

  unlink('../data/accounts.json');
  file_put_contents('../data/accounts.json', json_encode($accounts, JSON_PRETTY_PRINT));
  $sent = true;

  echo json_encode(array('sent' => $sent, 'email' => $receivingEmail));

?>