<?php

    $query_db = array(
         "0"  => 'SELECT * FROM tb_usuario WHERE y00="x00" AND y01="x01";',
         "1"  => 'INSERT INTO tb_usuario (y00, y01, y02, y03, y04, y05) VALUES ("x00", "x01", "x02", "x03", "x04", "x05");',
         "2"  => 'SELECT * FROM tb_frames WHERE y00="x00" AND y01<="x01" ORDER BY id DESC;',
         "3"  => 'INSERT INTO tb_frames (y00, y01, y02, y03, y04, y05) VALUES ("x00", "x01", "x02", "x03", "x04", "x05");',
         "4"  => 'UPDATE tb_frames SET y00="x00", y01="x01", y02="x02", y03="x03", y04="x04", y05="x05" WHERE y06="x06";',
         "5"  => 'DELETE FROM tb_frames  WHERE y00="x00";',
         "6"  => 'SELECT * FROM tb_usuario as A  WHERE(SELECT B.access from tb_usuario as B WHERE hash = "x00") = 10 AND A.y01 LIKE "%x01%";',
         "7"  => 'UPDATE tb_usuario SET y00="x00", y01="x01", y02="x02", y03="x03", y04="x04", y05="x05" WHERE y06="x06";',
         "8"  => 'DELETE FROM tb_usuario WHERE y00="x00";',
         "9"  => 'INSERT INTO tb_brinquedo (y00, y01, y02, y03, y04, y05) VALUES ("x00", "x01", "x02", "x03", "x04", "x05");',
         "10" => 'SELECT * FROM tb_brinquedo WHERE y00 LIKE "%x00%"',
         "11" => 'UPDATE tb_brinquedo SET y00="x00", y01="x01", y02="x02", y03="x03", y04="x04", y05="x05" WHERE y06="x06";',
         "12" => 'DELETE FROM tb_brinquedo WHERE y00="x00";',
         "13" => 'INSERT INTO tb_festa (y00, y01, y02, y03) VALUES ("x00", "x01", "x02", "x03");',
         "14" => 'SELECT F.*,U.nome as cliente, K.nome as kit, K.P, K.M, K.G, K.valor, K.monitoria FROM tb_festa as F 
                    INNER JOIN tb_usuario as U 
                    INNER JOIN tb_kit as K 
                    WHERE F.y00="x00" 
                    AND F.id_user = U.id
                    AND F.id_kit = K.id;',
         "15" => 'SELECT * FROM tb_kit WHERE y00 LIKE "%x00%"',
         "16" => 'INSERT INTO tb_kit (y00, y01, y02, y03, y04, y05) VALUES ("x00", "x01", "x02", "x03", "x04", "x05");',
         "17" => 'UPDATE tb_kit SET y00="x00", y01="x01", y02="x02", y03="x03", y04="x04", y05="x05" WHERE y06="x06";',
         "18" => 'DELETE FROM tb_kit WHERE y00="x00";',
         "19" => 'INSERT INTO tb_agenda (y00, y01, y02) VALUES ("x00", "x01", "x02");',
         "20" => 'SELECT A.id, B.nome, B.tamanho, A.qtd, B.img, B.sobre  FROM tb_agenda as A
                    INNER JOIN tb_festa as F
                    INNER JOIN tb_brinquedo as B
                    WHERE A.id_festa = F.id
                    AND A.id_brinq = B.id
                    AND A.y00="x00";',
         "21" => 'DELETE FROM tb_agenda WHERE y00="x00";',
         "22" => 'SELECT * FROM tb_brinquedo WHERE y00 LIKE "%x00%" AND (y01="x02" OR y01="x03" OR y01="x04") AND ativo="1";',
         "23" => 'SELECT B.tamanho AS tam, SUM(A.qtd) AS qtd FROM tb_agenda as A
                    INNER JOIN tb_brinquedo as B
                    WHERE A.id_brinq = B.id
                    AND A.y00="x00"
                    GROUP BY B.tamanho;',
         "24" => 'SELECT B.id, B.nome, SUM(A.qtd) AS qtd FROM tb_festa AS F
	                INNER JOIN tb_agenda AS A
                    INNER JOIN tb_brinquedo AS B
	                WHERE A.id_festa = F.id
                    AND A.id_brinq = B.id
	                AND F.data = "x00"
                    GROUP BY B.id;',



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