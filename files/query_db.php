<?php

    $query_db = array(
         "0"  => 'CALL sp_login("x00");',
         "1"  => 'CALL sp_novoUsuario("x00","x01","x02","x03");',
         "2"  => 'SELECT * FROM tb_frames WHERE y00="x00" AND y01<="x01" ORDER BY id DESC;',         
         "3"  => 'INSERT INTO tb_frames (id, category, background, content, filename, font, text, color) VALUES ("x00", "x01", "x02", "x03", "x04", "x05", "x06", "x07")
                    ON DUPLICATE KEY UPDATE
                    category="x01", background="x02", content="x03", filename="x04", font="x05" , text="x06", color="x07";',
         "4"  => 'UPDATE tb_frames SET y00="x00", y01="x01", y02="x02", y03="x03", y04="x04", y05="x05" WHERE y06="x06";',
         "5"  => 'DELETE FROM tb_frames  WHERE y00="x00";',
         "6"  => 'SELECT id,email,access FROM tb_usuario WHERE email LIKE "%x00%";',
         

         "7"  => 'UPDATE tb_usuario SET y00="x00", y01="x01", y02="x02", y03="x03", y04="x04", y05="x05", y06="x06", y07="x07", y08="x08", y09="x09", y10="x10", y11="x11", y12="x12"  WHERE y13="x13";',
         
         "8"  => 'DELETE FROM tb_usuario WHERE y00="x00";',
         "9"  => 'INSERT INTO tb_brinquedo (y00, y01, y02, y03, y04, y05) VALUES ("x00", "x01", "x02", "x03", "x04", "x05");',
         "10" => 'SELECT * FROM tb_brinquedo WHERE y00 LIKE "%x00%" ORDER BY tamanho DESC, nome ASC',
         "11" => 'UPDATE tb_brinquedo SET y00="x00", y01="x01", y02="x02", y03="x03", y04="x04", y05="x05" WHERE y06="x06";',
         "12" => 'DELETE FROM tb_brinquedo WHERE y00="x00";',
         
         "13" => 'INSERT INTO tb_festa (id, id_user, id_kit, data, nome, local, endereco, cidade, num, estado, bairro, responsavel, cel, obs, inicio, montagem, desmontagem) VALUES ("x00", "x01", "x02", "x03", "x04", "x05", "x06", "x07", "x08", "x09", "x10", "x11", "x12", "x13", "x14", "x15", "x16")
         ON DUPLICATE KEY UPDATE 
         id_kit="x02", data="x03", nome="x04", local="x05", endereco="x06", cidade="x07", num="x08", estado="x09", bairro="x10", responsavel="x11", cel="x12", obs="x13", inicio="x14", montagem="x15", desmontagem="x16";',
         
         "14" => 'CALL sp_viewFesta ("x00");',

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
         "22" => 'SELECT * FROM tb_brinquedo WHERE y00 LIKE "%x00%" AND (y01="x02" OR y01="x03" OR y01="x04") AND ativo="1" ORDER BY tamanho DESC, nome ASC',
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
         
         "25" => 'CALL sp_delFesta("x00",x01);',         
         "26" => 'CALL sp_contrato("x00","x01","x02","x03","x04","x05","x06","x07","x08","x09");',
         "27" => 'CALL sp_sp_reopen("x00",x01);',         



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