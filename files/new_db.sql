/* TABLES */
DROP table tb_usuario;
CREATE TABLE tb_usuario(
    id int(11) NOT NULL AUTO_INCREMENT,
	hash varchar(77) NOT NULL,
	access int(11) DEFAULT 1,
    email varchar(70) DEFAULT NULL,
    UNIQUE (email, hash),
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

DROP TABLE tb_festa;
CREATE TABLE tb_festa(
    id int(11) NOT NULL AUTO_INCREMENT,
    id_user int(11) NOT NULL,
    id_kit int(11) NOT NULL,
    data date NOT NULL,
	nome varchar(50) DEFAULT NULL,	
	aberta boolean DEFAULT TRUE,	
	local varchar(40) DEFAULT NULL,	
	endereco varchar(70) DEFAULT NULL,	
	cidade varchar(40) DEFAULT NULL,	
	num varchar(5) DEFAULT NULL,
	estado varchar(2) DEFAULT NULL,	
	bairro varchar(40) DEFAULT NULL,	
	responsavel varchar(50) DEFAULT NULL,	
	cel varchar(15) DEFAULT NULL,	
	obs varchar(250) DEFAULT NULL,	
	inicio varchar(5) DEFAULT NULL,	
	montagem varchar(5) DEFAULT NULL,	
	desmontagem varchar(5) DEFAULT NULL,
	fat_nome varchar(50) NOT NULL DEFAULT "",
	fat_cpf varchar(14) NOT NULL DEFAULT "",
	fat_end varchar(70) NOT NULL DEFAULT "",
	fat_cidade varchar(40) NOT NULL DEFAULT "",
	fat_num varchar(5) NOT NULL DEFAULT "",
    fat_comp varchar(20) NOT NULL DEFAULT "",
	fat_estado varchar(2) NOT NULL DEFAULT "",
	fat_bairro varchar(40) NOT NULL DEFAULT "",
	fat_data varchar(10) NOT NULL DEFAULT "",
    PRIMARY KEY (id),
    FOREIGN KEY(id_user) REFERENCES tb_usuario(id),
    FOREIGN KEY(id_kit) REFERENCES tb_kit(id)    
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


/* VIEWS */

-- DROP VIEW vw_festa;
 CREATE VIEW vw_festa AS
   SELECT F.*,U.email as cliente,K.nome as kit,
		K.P, K.M, K.G, K.valor, K.monitoria 
		FROM tb_festa as F 
		INNER JOIN tb_usuario as U 
		INNER JOIN tb_kit as K 
		ON F.id_user = U.id 
		AND F.id_kit = K.id;
        
/* PROCEDURES */

-- DROP PROCEDURE sp_novoUsuario;
DELIMITER $$
	CREATE PROCEDURE sp_novoUsuario(
		IN Icallhash varchar(77),
		IN Ihash varchar(77),
		IN Iemail varchar(70),
		IN Iaccess int(4)
    )
	BEGIN		
		SET @call_access = (SELECT access FROM tb_usuario WHERE hash COLLATE utf8_general_ci = Icallhash COLLATE utf8_general_ci LIMIT 1);
        SET @already_mail = (SELECT COUNT(*) FROM tb_usuario WHERE email COLLATE utf8_general_ci =Iemail COLLATE utf8_general_ci);
        SET @exist = (SELECT COUNT(*) FROM tb_usuario);
		IF(@call_access!=10) THEN
			SET Iaccess = 1;
        END IF;
        SET @success = FALSE;
        SET @motivo = "Email já cadastrado.";
        IF(@already_mail=0)THEN
			SET @motivo = "";
			INSERT INTO tb_usuario (id,hash,access,email) VALUES (DEFAULT,Ihash,Iaccess,Iemail);
			IF((SELECT COUNT(*) FROM tb_usuario)>@exist) THEN
				SET @success = TRUE;
			END IF;			
        END IF;
        SELECT @success AS SUCCESS, @motivo AS MOTIVO;

	END $$
DELIMITER ;

-- DROP PROCEDURE sp_login;
DELIMITER $$
	CREATE PROCEDURE sp_login(
		IN Ihash varchar(77)
    )
	BEGIN		
		SET @access = 0;
        SET @login = (SELECT COUNT(*) FROM tb_usuario WHERE hash COLLATE utf8_general_ci = Ihash COLLATE utf8_general_ci);
		IF(@login =1) THEN
			SELECT * FROM tb_usuario WHERE hash COLLATE utf8_general_ci = Ihash COLLATE utf8_general_ci;
		ELSE 
			SELECT 0 AS id, "" AS hash, 0 AS access, "" AS email;
        END IF;
        
	END $$
DELIMITER ;

-- DROP PROCEDURE sp_viewFesta;
DELIMITER $$
	CREATE PROCEDURE sp_viewFesta(
		IN Ihash varchar(77)
    )
	BEGIN
		SET @access = (SELECT access FROM tb_usuario WHERE hash COLLATE utf8_general_ci = Ihash COLLATE utf8_general_ci);
        SET @id = (SELECT id FROM tb_usuario WHERE hash COLLATE utf8_general_ci = Ihash COLLATE utf8_general_ci);
		IF(@access = 10) THEN
			SELECT * FROM vw_festa;
		ELSE 
			SELECT * FROM vw_festa WHERE id_user = @id;
        END IF;
        
	END $$
DELIMITER ;

-- DROP PROCEDURE sp_delFesta;
DELIMITER $$
	CREATE PROCEDURE sp_delFesta(
		IN Ihash varchar(77),
        IN Iid int(11)        
    )
	BEGIN        
		SET @access = (SELECT access FROM tb_usuario WHERE hash COLLATE utf8_general_ci = Ihash COLLATE utf8_general_ci);
		IF(@access = 10) THEN
			DELETE FROM tb_festa WHERE id=Iid;
			SELECT * FROM vw_festa;
		ELSE
			SET @id = (SELECT id FROM tb_usuario WHERE hash COLLATE utf8_general_ci = Ihash COLLATE utf8_general_ci);			
            DELETE FROM tb_festa WHERE id=Iid AND id_user=@id;        
			SELECT * FROM vw_festa WHERE id_user = @id;
        END IF;
        
	END $$
DELIMITER ;

-- DROP PROCEDURE sp_contrato;
DELIMITER $$
	CREATE PROCEDURE sp_contrato(
		IN Ihash varchar(77),
        IN IidFesta int(11),
        IN Inome varchar(50),
		IN Icpf varchar(14),
		IN Iendereco varchar(70),
		IN Inum varchar(5),
		IN Icomp varchar(20),
		IN Ibairro varchar(40),
		IN Icidade varchar(40),
		IN Iestado varchar(2),
        IN Idata varchar(10)
    )
	BEGIN        
		SET @access = (SELECT access FROM tb_usuario WHERE hash COLLATE utf8_general_ci = Ihash COLLATE utf8_general_ci);
        SET @idCall = (SELECT id FROM tb_usuario WHERE hash COLLATE utf8_general_ci = Ihash COLLATE utf8_general_ci);
        SET @idOwner = (SELECT id_user FROM tb_festa WHERE id=IidFesta);        		
		IF(@access = 10 OR @idCall = @idOwner) THEN
			UPDATE tb_festa SET fat_nome=Inome, fat_cpf=Icpf, fat_end=Iendereco, fat_cidade=Icidade, fat_num=Inum, fat_comp=Icomp, fat_estado=Iestado, fat_bairro=Ibairro, fat_data=Idata, aberta=FALSE WHERE id=IidFesta;
        END IF;
 		SELECT * FROM vw_festa WHERE id = IidFesta;        
	END $$
DELIMITER ;

-- DROP PROCEDURE sp_reopen;
DELIMITER $$
	CREATE PROCEDURE sp_reopen(
		IN Ihash varchar(77),
        IN IidFesta int(11)
    )
	BEGIN        
		SET @access = (SELECT access FROM tb_usuario WHERE hash COLLATE utf8_general_ci = Ihash COLLATE utf8_general_ci);        		
		IF(@access = 10) THEN
			UPDATE tb_festa SET aberta=TRUE WHERE id=IidFesta;
        END IF;
 		SELECT * FROM vw_festa WHERE id = IidFesta;
	END $$
DELIMITER ;