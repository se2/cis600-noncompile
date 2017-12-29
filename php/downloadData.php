<?php
  header('Access-Control-Allow-Origin: *');
  header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
  header('Access-Control-Allow-Methods: GET, POST, PUT');

  // PHP libraries for PHP 5.1.5
  // include_once('php-lib/pclzip/pclzip.lib.php');

  $download = false;
  $filename = '../data/data-' . date('Y-m-d') . '.zip';
  // $files = array('../data');

  // Get real path for our folder
  $rootPath = realpath('../data');

  // Initialize archive object
  $zip = new ZipArchive();
  $zip->open($filename, ZipArchive::CREATE | ZipArchive::OVERWRITE);

  // Create recursive directory iterator
  /** @var SplFileInfo[] $files */
  $files = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($rootPath), RecursiveIteratorIterator::LEAVES_ONLY);

  if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // get input data
    $postdata = file_get_contents("php://input");
    $request = json_decode($postdata);
    $account = $request->account;
    $accounts = json_decode(file_get_contents('../data/accounts.json'));
    foreach ($accounts as $key => $acc) {
      if ($account->id == $acc->id && $account->role == 'admin') {
        array_map('unlink', glob("../data/*.zip"));
        foreach ($files as $name => $file) {
          // Skip directories
          if (!$file->isDir()) {
            // Get real and relative path for current file
            $filePath = $file->getRealPath();
            $relativePath = substr($filePath, strlen($rootPath) + 1);
            // Add current file to archive
            $zip->addFile($filePath, $relativePath);
          }
        }
        // Zip archive will be created only after closing object
        $zip->close();
        // $archive = new PclZip($filename);
        // $list = $archive->create($files);
        // if ($list == 0) {
        //   die("Error: ".$archive->errorInfo(true));
        // } else {
        //   $download = true;
        // }
        $download = true;
      }
    }
    if ($download) {
      echo json_encode(array('download' => $download, 'file' => 'data/data-' . date('Y-m-d') . '.zip'));
    } else {
      echo json_encode(array('download' => $download, 'error' => 'permission denied'));
    }
  } else {
    echo 'Permission denied';
  }

?>