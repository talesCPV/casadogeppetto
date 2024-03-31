use d2soft98_geppeto;

show tables;

describe tb_usuario;
describe tb_frames;
describe tb_brinquedo;
describe tb_agenda;
describe tb_festa;
describe tb_kit;
describe tb_locatario;

SELECT * FROM tb_usuario;
SELECT * FROM tb_frames;
SELECT * FROM tb_festa;
SELECT * FROM tb_brinquedo;
SELECT * FROM tb_agenda;
SELECT * FROM tb_locatario;
SELECT * FROM tb_kit;

INSERT INTO tb_usuario (username, hash, access) VALUES ("michele", "i--No3<<]~!Bc''Hi--No33Tu99Z{?", 10);
INSERT INTO tb_usuario (username, hash, access) VALUES ("tales", "IFi:2r'|S*#V-%Y0(\\3+_6.b91e<4h", 10);
INSERT INTO tb_frames (category, content) VALUES ("Blog", "plus");
INSERT INTO tb_frames (category, content, background, filename) VALUES ("photo", "pic","10,167,20","wood.jpeg");
INSERT INTO tb_frames (category, content, background, justify, text) VALUES ("photo", "pic","240,100,80","center","Exemplo de texto... bem grande com várias linhas");

UPDATE tb_festa SET aberta=1 WHERE id=2;


ALTER TABLE tb_kit ADD COLUMN descricao varchar(255) DEFAULT "";
ALTER TABLE tb_kit ADD COLUMN tipo varchar(10) DEFAULT "FESTA";
ALTER TABLE tb_kit ADD COLUMN personal int(11) DEFAULT 0;


ALTER TABLE tb_usuario MODIFY cel varchar(15);
ALTER TABLE tb_brinquedo ADD COLUMN ativo BOOLEAN DEFAULT TRUE;
ALTER TABLE tb_festa ADD COLUMN local varchar(40) DEFAULT NULL;


ALTER TABLE tb_festa ADD COLUMN fat_nome varchar(50) NOT NULL DEFAULT "";
ALTER TABLE tb_festa ADD COLUMN fat_cpf varchar(14) NOT NULL DEFAULT "";
ALTER TABLE tb_festa ADD COLUMN fat_end varchar(70) NOT NULL DEFAULT "";
ALTER TABLE tb_festa ADD COLUMN fat_cidade varchar(40) NOT NULL DEFAULT "";
ALTER TABLE tb_festa ADD COLUMN fat_num varchar(5) NOT NULL DEFAULT "";
ALTER TABLE tb_festa ADD COLUMN fat_comp varchar(20) NOT NULL DEFAULT "";
ALTER TABLE tb_festa ADD COLUMN fat_estado varchar(2) NOT NULL DEFAULT "";
ALTER TABLE tb_festa ADD COLUMN fat_bairro varchar(40) NOT NULL DEFAULT "";
ALTER TABLE tb_festa ADD COLUMN fat_data varchar(10) NOT NULL DEFAULT "";

ALTER TABLE tb_festa ADD COLUMN responsavel varchar(50) DEFAULT NULL;
ALTER TABLE tb_festa ADD COLUMN cel varchar(15) DEFAULT NULL;
ALTER TABLE tb_festa ADD COLUMN obs varchar(250) DEFAULT NULL;
ALTER TABLE tb_festa ADD COLUMN inicio varchar(5) DEFAULT NULL;
ALTER TABLE tb_festa ADD COLUMN montagem varchar(5) DEFAULT NULL;
ALTER TABLE tb_festa ADD COLUMN desmontagem varchar(5) DEFAULT NULL;
ALTER TABLE tb_usuario ADD COLUMN edit varchar(1) DEFAULT 0;


INSERT INTO tb_festa 
			(id, id_user, id_kit, data, nome, local, endereco, cidade, num, estado, bairro, responsavel, cel, obs, inicio, montagem, desmontagem) 
    VALUES 	("", "3", "1", "2023-09-30", "a", "a", "a", "a", "a", "AC", "a", "a", "(12)8563-2547", "a", "12:00", "13:00", "18:00") 
    ON DUPLICATE KEY UPDATE 
    id_kit="1", data="2023-09-30", nome="a", local="a", endereco="a", cidade="a", num="a", estado="AC", bairro="a", responsavel="a", cel="(12)8563-2547", obs="a", inicio="12:00", montagem="13:00", desmontagem="18:00";


UPDATE tb_usuario SET access=10 WHERE id=1;

DELETE FROM tb_frames WHERE id=4;
UPDATE tb_frames SET category='Home' where id=6;

UPDATE tb_festa SET id_user="5" WHERE id=3;
UPDATE tb_festa SET id_user="1", id_kit="5", data="2022-07-28", nome="evento Teste", local="qqq", endereco="11", cidade="222", num="11", estado="SP", bairro="1111", responsavel="dsfsd", cel="(12)9 8563-2548", obs="blablablabla", inicio="08:30", montagem="07:00", desmontagem="13:00" WHERE id="5";

SELECT A.id, B.nome, B.tamanho, A.qtd, B.img  FROM tb_agenda as A
	INNER JOIN tb_festa as F
	INNER JOIN tb_brinquedo as B
	WHERE A.id_festa = F.id
	AND A.id_brinq = B.id
	AND A.id_festa="1";

SELECT B.tamanho as tam, COUNT(B.tamanho) as qtd FROM tb_agenda as A
	INNER JOIN tb_brinquedo as B
	WHERE A.id_brinq = B.id
	AND A.id_festa="1"
    GROUP BY B.tamanho;

SELECT B.tamanho as tam, SUM(A.qtd) as qtd FROM tb_agenda as A
	INNER JOIN tb_brinquedo as B
	WHERE A.id_brinq = B.id
	AND A.id_festa="1"
    GROUP BY B.tamanho;

SELECT * FROM tb_brinquedo 
	WHERE nome LIKE "%%" 
	AND (tamanho="P" OR tamanho="M" OR tamanho="N") 
	AND ativo="1";


/* BRINQUEDOS RESERVADOS POR DIA */
SELECT B.id, B.nome, SUM(A.qtd) AS qtd FROM tb_festa AS F
	INNER JOIN tb_agenda AS A
    INNER JOIN tb_brinquedo AS B
	WHERE A.id_festa = F.id
    AND A.id_brinq = B.id
	AND F.data = "2022-04-02"
/*    AND B.id = "7"*/
    GROUP BY B.id;

/* Primeira PARTE  */
SELECT A.id_brinq, SUM(A.qtd) AS reserva FROM tb_agenda AS A INNER JOIN tb_festa AS F WHERE F.data = "2022-04-02" AND A.id_festa = F.id GROUP BY A.id_brinq;


/* CONTANDO REGISTROS DE UM SELECT */
SELECT count(*) from (SELECT A.id_brinq, SUM(A.qtd) AS reserva FROM tb_agenda AS A INNER JOIN tb_festa AS F WHERE F.data = "2022-04-02" AND A.id_festa = F.id GROUP BY A.id_brinq) AS subQuery;

/* SELECT IF */
SELECT * FROM tb_brinquedo AS B
	INNER JOIN(SELECT count(*) AS saldo from (SELECT A.id_brinq, SUM(A.qtd) AS reserva FROM tb_agenda AS A INNER JOIN tb_festa AS F WHERE F.data = "2022-04-02" AND A.id_festa = F.id GROUP BY A.id_brinq) AS s) AS SEL_QTD
   
    ;


SELECT IF(
  (SELECT count(*) from (SELECT A.id_brinq, SUM(A.qtd) AS reserva FROM tb_agenda AS A INNER JOIN tb_festa AS F WHERE F.data = "2022-04-02" AND A.id_festa = F.id GROUP BY A.id_brinq) AS s) AS i > 0
  "EXISTE RESERVA","NÃO EXISTE RESERVA"
  );

ALTER TABLE tb_festa ADD COLUMN contrato date DEFAULT NULL;

/* Segunda PARTE*/
 
SELECT B.* FROM tb_brinquedo
 INNER JOIN COUNT(SELECT A.id_brinq, SUM(A.qtd) AS RESERVA  FROM tb_agenda AS A INNER JOIN tb_festa AS F WHERE F.data = "2022-04-02" AND A.id_festa = F.id GROUP BY A.id_brinq) AS C;




SELECT B.*, C.saldo  FROM tb_brinquedo AS B
	INNER JOIN (SELECT A.qtd FROM tb_agenda AS A INNER JOIN tb_festa AS F WHERE F.data = "2022-04-02" AND A.id_festa = F.id) AS C

    GROUP BY B.id;


/*  FESTA  */ 

SELECT B.*, A.qtd FROM tb_brinquedo AS B
	INNER JOIN tb_agenda AS A
    WHERE A.id_brinq = B.id
    ;



SELECT BR.*, SEL.saldo FROM tb_brinquedo AS BR
	INNER JOIN (SELECT B.id, SUM(A.qtd) AS saldo FROM tb_festa AS F
		INNER JOIN tb_agenda AS A
		INNER JOIN tb_brinquedo AS B
		WHERE A.id_festa = F.id
		AND A.id_brinq = B.id
		AND F.data = "2022-04-02"
	
		GROUP BY B.id) AS SEL
	WHERE BR.nome LIKE "%%" 
	AND (tamanho="P" OR tamanho="M" OR tamanho="G")
/*    AND BR.id = SEL.id*/
	AND ativo="1"
/*    GROUP BY BR.id*/
    ;

/*  TESTES  */
SELECT BR.*, (
SELECT B.id, B.nome, SUM(A.qtd) AS qtd FROM tb_festa AS F
	INNER JOIN tb_agenda AS A
    INNER JOIN tb_brinquedo AS B
	WHERE A.id_festa = F.id
    AND A.id_brinq = B.id
	AND F.data = "2022-04-02"
    GROUP BY B.id;
) AS saldo FROM tb_brinquedo AS BR;



/************************************/

DELETE FROM tb_frames WHERE id=9;

DROP TABLE tb_usuario;
DROP TABLE tb_agenda;
DROP TABLE tb_brinquedo;

CREATE TABLE tb_usuario(
    id int(11) NOT NULL AUTO_INCREMENT,
    username varchar(15) NOT NULL,
	hash varchar(30) NOT NULL,
	access int(11) DEFAULT 0,
    nome varchar(50) DEFAULT NULL,
    email varchar(70) DEFAULT NULL,
    cel varchar(15) DEFAULT NULL,
    PRIMARY KEY (id)
) ENGINE=MyISAM AUTO_INCREMENT=0 DEFAULT CHARSET=utf8;

CREATE TABLE tb_frames(
    id int(11) NOT NULL AUTO_INCREMENT,
    category varchar(10) NOT NULL,
	content varchar(5) NOT NULL,
	background varchar(7) DEFAULT "#f0a70a",
    filename varchar(20) DEFAULT NULL,
    justify varchar(10) DEFAULT "center",
    font int(11) DEFAULT 15,
    text varchar(250) DEFAULT NULL,
    access int(11) DEFAULT 0,	
    PRIMARY KEY (id)
) ENGINE=MyISAM AUTO_INCREMENT=0 DEFAULT CHARSET=utf8;

CREATE TABLE tb_brinquedo(
    id int(11) NOT NULL AUTO_INCREMENT,
    tamanho varchar(1) DEFAULT "M",
	nome varchar(50) NOT NULL,
    img varchar(50) DEFAULT NULL,
    qtd int(11) DEFAULT 1,
    sobre varchar(250) DEFAULT NULL,
	ativo BOOLEAN DEFAULT TRUE,
    PRIMARY KEY (id)
) ENGINE=MyISAM AUTO_INCREMENT=0 DEFAULT CHARSET=utf8;

CREATE TABLE tb_festa(
    id int(11) NOT NULL AUTO_INCREMENT,
    id_user int(11) NOT NULL,
    data date NOT NULL,
	nome varchar(50) DEFAULT NULL,	
	aberta boolean DEFAULT TRUE,	
    PRIMARY KEY (id),
    FOREIGN KEY(id_user) REFERENCES tb_usuario(id)    
) ENGINE=MyISAM AUTO_INCREMENT=0 DEFAULT CHARSET=utf8;

CREATE TABLE tb_agenda(
    id int(11) NOT NULL AUTO_INCREMENT,
    id_brinq int(11) NOT NULL,
    id_festa int(11) NOT NULL,
    qtd int(11) NOT NULL DEFAULT 1,
    PRIMARY KEY (id),
    FOREIGN KEY(id_festa) REFERENCES tb_festa(id),
    FOREIGN KEY(id_brinq) REFERENCES tb_brinquedo(id)    
) ENGINE=MyISAM AUTO_INCREMENT=0 DEFAULT CHARSET=utf8;

SELECT * FROM tb_usuario as A  WHERE(SELECT B.access from tb_usuario as B WHERE username = "michele") = 10;