use mylast96_geppetto;

show tables;

describe tb_usuario;
describe tb_frames;
describe tb_brinquedo;
describe tb_agenda;

SELECT * FROM tb_usuario;
SELECT * FROM tb_frames;

INSERT INTO tb_usuario (username, hash, access) VALUES ("michele", "i--No3<<]~!Bc''Hi--No33Tu99Z{?", 10);
INSERT INTO tb_frames (category, content) VALUES ("photo", "plus");
INSERT INTO tb_frames (category, content, background, filename) VALUES ("photo", "pic","10,167,20","wood.jpeg");
INSERT INTO tb_frames (category, content, background, justify, text) VALUES ("photo", "pic","240,100,80","center","Exemplo de texto... bem grande com várias linhas");

DELETE FROM tb_frames WHERE id=9;

CREATE TABLE tb_usuario(
    id int(11) NOT NULL AUTO_INCREMENT,
    username varchar(15) NOT NULL,
	hash varchar(30) NOT NULL,
	access int(11) DEFAULT 0,
    nome varchar(50) DEFAULT NULL,
    email varchar(70) DEFAULT NULL,
    cel varchar(14) DEFAULT NULL,
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
    category varchar(12) NOT NULL,
	nome varchar(50) NOT NULL,	
    PRIMARY KEY (id)
) ENGINE=MyISAM AUTO_INCREMENT=0 DEFAULT CHARSET=utf8;

CREATE TABLE tb_agenda(
    id int(11) NOT NULL AUTO_INCREMENT,
    id_brinq int(11) NOT NULL,
    data date NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY(id_brinq) REFERENCES tb_brinquedo(id)    
) ENGINE=MyISAM AUTO_INCREMENT=0 DEFAULT CHARSET=utf8;
