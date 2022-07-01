<?php   

  $out = [];


	if (IsSet($_POST["path"])){
	  $path = getcwd().$_POST["path"];
	  $access = $_POST["access"];
	  $category = $_POST["category"];
echo getcwd()."<br>";
echo $path."<br>" ;
      if (file_exists($path)) {
echo"1";
          $fp = fopen($path, "r");
          $resp = "";
          while (!feof ($fp)) {
              $resp = $resp . fgets($fp,4096);
          }
          fclose($fp);

          $json = json_decode($resp);

          for($i = 0; $i< count($json->frame); $i++){
            if($json->frame[$i]->category <= $category){
                $obj = new stdClass();
                $obj->content = $json->frame[$i]->content;
                $obj->filename = $json->frame[$i]->filename;
                $obj->background = $json->frame[$i]->background;
                $obj->justify = $json->frame[$i]->justify;
                $obj->font = $json->frame[$i]->font;
                $obj->text = $json->frame[$i]->text;
                array_push($out, json_encode($obj));
            }            

          }

        }
    }

//    var_dump($out);
	print json_encode($out);

?>