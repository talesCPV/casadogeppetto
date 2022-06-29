<?php

include "crip.php";

//	echo crip('mylast96_ctr_portal_da_mata');



//$usuario = 'mylast96_tales ';
//$senha= '';
//$servidor = '';
$usuario = decrip('LlLOgLoh7M?JfiLZP9LMRNn-jL`b0[+VaUiU`LkO^LdiLlFG');
$senha= decrip('#M#)B#J+C?8@AD#4*K#%,(0*E#9;15G0:/(#c#F)7#?z#GK2');
$servidor = decrip('DSDG_Dg%OOQ^^aDRHTDEJF0-bDWYqS"N"M."`DcGUD[/DdPO');
$banco = 'mylast96_geppetto';

/*
	$usuario = decrip('LlLOgLoh7M?JfiLZP9LMRNn-jL`b0[+VaUiU`LkO^LdiLlFG');
	$senha= decrip('#M#)B#J+C?8@AD#4*K#%,(0*E#9;15G0:/(#c#F)7#?z#GK2');
	$servidor = decrip('DSDG_Dg%OOQ^^aDRHTDEJF0-bDWYqS"N"M."`DcGUD[/DdPO');
	$banco = decrip('Ul14M19e7M7JLb1A9N127gn3P1F70=+Ng:WUX1USD1FiIRFG i');
*/

	$conexao = new mysqli($servidor, $usuario, $senha, $banco);

	if (!$conexao){
        die ("Erro de conexão com localhost, o seguinte erro ocorreu -> ".mysql_error());
    }

/*
	LlLOgLoh7M?JfiLZP9LMRNn-jL`b0[+VaUiU`LkO^LdiLlFG <- usuario
	DSDG_Dg%OOQ^^aDRHTDEJF0-bDWYqS"N"M."`DcGUD[/DdPO <- IP
	#M#)B#J+C?8@AD#4*K#%,(0*E#9;15G0:/(#c#F)7#?z#GK2 <- senha
	nlnq0n8s7M(J/2n!rLnotpn,3n)+0"+xewYUan4q%n-in5FG <- banco
*/
?>