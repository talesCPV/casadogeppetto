<?php

    $query_db = array(
         "0" => 'SELECT * FROM tb_usuario WHERE y00="x00" AND y01="x01";',
         "1" => 'INSERT INTO tb_usuario (y00, y01, y02, y03, y04, y05) VALUES ("x00", "x01", "x02", "x03", "x04", "x05");',
         "2" => 'SELECT * FROM tb_frames WHERE y00="x00" AND y01<="x01" ORDER BY id DESC;',
         "3" => 'INSERT INTO tb_frames (y00, y01, y02, y03, y04, y05) VALUES ("x00", "x01", "x02", "x03", "x04", "x05");',
         "4" => 'UPDATE tb_frames SET y00="x00", y01="x01", y02="x02", y03="x03", y04="x04", y05="x05" WHERE y06="x06";',
         "5" => 'DELETE FROM tb_frames  WHERE y00="x00";',
         "6" => 'SELECT * FROM tb_usuario as A  WHERE(SELECT B.access from tb_usuario as B WHERE hash = "x00") = 10;',
         "7" => 'UPDATE tb_usuario SET y00="x00", y01="x01", y02="x02", y03="x03", y04="x04", y05="x05" WHERE y06="x06";',
         "8" => 'DELETE FROM tb_usuario WHERE y00="x00";',
         "9" => 'INSERT INTO tb_brinquedo (y00, y01, y02, y03) VALUES ("x00", "x01", "x02", "x03");',
              
    );


    if (IsSet($_POST["cod"]) && IsSet($_POST["params"])  ){       

        $cod = $_POST["cod"];
        $params = json_decode($_POST["params"],true); 

        include "connect.php";        

        $query = $query_db[$_POST["cod"]];
        $i = 0;
        foreach($params as $key => $val ){
            $y = 'y'.str_pad(strval($i), 2, "0", STR_PAD_LEFT);
            $x = 'x'.str_pad(strval($i), 2, "0", STR_PAD_LEFT);
        
            $query = str_replace($y, $key,$query); // fields
            $query = str_replace($x, $val,$query); // values
            $i++;
        }

//        echo $query;

		$result = mysqli_query($conexao, $query);
		$qtd_lin = $result->num_rows;

		if($qtd_lin > 0){
			$rows = array();
			while($r = mysqli_fetch_assoc($result)) {
			    $rows[] = $r;
			}

			print json_encode($rows);
		}

	    $conexao->close();        

    }


?>