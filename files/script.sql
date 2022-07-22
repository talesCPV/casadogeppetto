/* CRIAÇÃO DO BANCO DE DADOS */
CREATE DATABASE db_geppetto;

USE db_geppetto;

/* CRIAÇÃO DAS TABELAS */
CREATE TABLE tb_usuario(
    id int(11) NOT NULL AUTO_INCREMENT,
    username varchar(15) NOT NULL,
	hash varchar(30) NOT NULL,
	access int(11) DEFAULT 0,
    nome varchar(50) DEFAULT NULL,
    email varchar(70) DEFAULT NULL,
    cel varchar(15) DEFAULT NULL,
	CPF varchar(14) DEFAULT NULL,
	endereco varchar(70) DEFAULT NULL,
	cidade varchar(40) DEFAULT NULL,
	num varchar(5) DEFAULT NULL,
	estado varchar(2) DEFAULT "SP",    
	bairro varchar(40) DEFAULT NULL,  
	edit varchar(1) DEFAULT NULL,          
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

CREATE TABLE tb_kit(
    id int(11) NOT NULL AUTO_INCREMENT,
    nome varchar(50) NOT NULL,
    P int(11) DEFAULT 0,
    M int(11) DEFAULT 0,
    G int(11) DEFAULT 0,
    monitoria boolean DEFAULT TRUE,
    valor float NOT NULL DEFAULT 0.00,    
    PRIMARY KEY (id),
    FOREIGN KEY(id_festa) REFERENCES tb_festa(id),
    FOREIGN KEY(id_brinq) REFERENCES tb_brinquedo(id)    
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
	local varchar(40) DEFAULT NULL,	
	endereco varchar(70) DEFAULT NULL,	
	cidade varchar(40) DEFAULT NULL,	
	num varchar(5) DEFAULT NULL,	
	estado varchar(2) DEFAULT "SP",	
	bairro varchar(40) DEFAULT NULL,	
	responsavel varchar(50) DEFAULT NULL,	
	cel varchar(15) DEFAULT NULL,	
	obs varchar(250) DEFAULT NULL,	
	inicio varchar(5) DEFAULT NULL,	
	montagem varchar(5) DEFAULT NULL,	
	desmontagem varchar(5) DEFAULT NULL,	
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

/*
	ALTER TABLE tb_usuario MODIFY cel varchar(15);
	ALTER TABLE tb_brinquedo ADD COLUMN ativo BOOLEAN DEFAULT TRUE;
*/

/* SELECIONA BRINQUEDOS RESERVADOS POR DATA */
SELECT B.id, B.nome, SUM(A.qtd) AS reservado, F.data
		FROM tb_festa AS F
		INNER JOIN tb_agenda AS A
		INNER JOIN tb_brinquedo AS B
		WHERE A.id_festa = F.id
		AND A.id_brinq = B.id
		AND F.data = "2022-04-02"	
		GROUP BY B.id;

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
	AND ativo="1";
