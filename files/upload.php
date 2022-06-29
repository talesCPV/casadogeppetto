<?php

  if (IsSet($_POST["file"]) && IsSet($_POST["filename"])){  

    $file = $_POST["file"];
    $filename = '../fotos/'.$_POST["filename"];
    $data = base64_decode($file);

    file_put_contents($filename, $data);
    return true;

  }else{

    return false;
    
  }

?>