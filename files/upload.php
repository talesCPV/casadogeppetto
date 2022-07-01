<?php

  function frames($filename){

   
    $color = $_POST["hdnColor"];
    $category = $_POST["hdnCategory"];

    $query = "INSERT INTO tb_frames (category, content, background, filename) VALUES ('{$category}','pic','{$color}','{$filename}');";

//    print($query);

    include "connect.php"; 
		
    mysqli_query($conexao, $query);

    $conexao->close();

  }

  if (IsSet($_FILES["up_file"])){ 
   
    $file = $_FILES["up_file"]["tmp_name"];
    $filename = $_FILES["up_file"]["name"];
    $url = getcwd().'/pictures/'.$filename;
    $access = $_POST["hdnAccess"];


//    echo $access."<br>";

    if (file_exists($file) && $access==10){
      echo "existe<br>";
      if(move_uploaded_file($file, $url)){
        print "SUCESSO!!!<br>";
        frames($filename);
      }else{
        print"FUDEU<br>";
      }
    }else{
      echo "não existe<br>";
    }
    return true;
  }else{
    return false;
  }

?>