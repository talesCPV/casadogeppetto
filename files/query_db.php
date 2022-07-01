<?php

    $query_db = array(
         "0" => 'SELECT * FROM tb_usuario WHERE y00="x00" AND y01="x01";',
         "1" => "INSERT INTO tb_usuario VALUES ('a','b','c');",
         "2" => 'SELECT * FROM tb_frames WHERE y00="x00" AND y01<="x01" ORDER BY id DESC;',
         "3" => 'INSERT INTO tb_frames (y00, y01, y02, y03, y04, y05) VALUES ("x00", "x01", "x02", "x03", "x04", "x05");',
              
    );


    if (IsSet($_POST["cod"]) && IsSet($_POST["params"])  ){       

        $cod = $_POST["cod"];
        $params = json_decode($_POST["params"],true); 
//        $token = $_POST["token"];

        include "connect.php";        
/*
        if($cod == 0){ // login
            $mytoken = crip($params["user"].date("h:i:s"));
            $query = "UPDATE tb_user SET token = '{$mytoken}' WHERE user = '{$params['user']}' AND pass = '{$params['pass']}';";
            mysqli_query($conexao, $query);
        }
*/

//        var_dump($params);
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
//            array_push($rows,"teste");
			print json_encode($rows);



		}

	    $conexao->close();        

    }


?>