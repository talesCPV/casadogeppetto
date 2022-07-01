<?php

  $out = 0;

  if (IsSet($_FILES["up_file"])){ 
   
    $file = $_FILES["up_file"]["tmp_name"];
    $filename = $_FILES["up_file"]["name"];
    $url = getcwd().'/pictures/'.$filename;
    $access = $_POST["hdnAccess"];
  
    if (file_exists($file) && $access==10){
      if(move_uploaded_file($file, $url)){
        $out = 1;
      }
    }
  }

  print $out;

?>