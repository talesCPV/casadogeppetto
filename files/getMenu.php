<?php   

    $out = [];
    $access = 0;

	if (IsSet($_POST["hash"])){

        $query = "SELECT access FROM tb_usuario WHERE hash=\"".$_POST["hash"]."\"";
        include "connect.php"; 
        $result = mysqli_query($conexao, $query);
//        var_dump($result);
        $qtd_lin = $result->num_rows;

		if($qtd_lin > 0){
			$rows = array();
			while($r = mysqli_fetch_assoc($result)) {
			    $rows[] = $r;
			}
            $access = $rows[0]["access"];
        }
        $conexao->close();
    }

    $path = 'JSON/config.json';

      if (file_exists($path)) {
          $fp = fopen($path, "r");
          $resp = "";
          while (!feof ($fp)) {
              $resp = $resp . fgets($fp,4096);
          }
          fclose($fp);

          $json = json_decode($resp);

          for($i = 0; $i< count($json->menu); $i++){
            if($json->menu[$i]->access <= $access){
                $obj = new stdClass();
                $obj->text = $json->menu[$i]->text;
                $obj->id = $json->menu[$i]->id;
                $obj->class = $json->menu[$i]->class;
                $obj->index = $json->menu[$i]->index;
                $obj->template = $json->menu[$i]->template;
                $obj->window = $json->menu[$i]->window;
                $obj->title = $json->menu[$i]->title;

                array_push($out, json_encode($obj));
            }            

          }

        }
   

//    var_dump($out);
	print json_encode($out);

?>