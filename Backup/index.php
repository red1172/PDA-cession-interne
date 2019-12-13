<?php

if( $_SERVER['REQUEST_METHOD'] == "POST" ) {
	extract($_POST);
	if ((isset ($login) AND !empty($login)) AND((isset ($pass) AND !empty($pass)))){
		$login=strtoupper(htmlspecialchars($login));
		$pass=htmlspecialchars($pass);
		
		
		if(($login=="ADMIN") AND ($pass=="Am2902@By"))
		{
			header('Location:accueil.html');
		
		}
		else
		{
		
		$erreur="login ou mot de passe non valide";
		
		}
	}
	}
?>


<!doctype html>
<html lang="fr">
<head>
		
        <meta charset="UTF-8" />
        <title>Cession interne</title>
		<link rel="stylesheet" type="text/css" href="../css/main.css"/>
		<link rel="shortcut icon" href="images/animated_favicon.gif">
			<!--[if lt IE 8]><link rel="stylesheet" type="text/css" href="../css/ie.css" /><![endif]-->
		<script type ="text/javascript" src="js/jquery.js"></script> 
		<script type ="text/javascript" src="js/search.js"></script> 
		
			
			
	<script language="JavaScript">
<!--
function donner_focus(chp)
{
document.getElementById(chp).focus();
}
</script>
		
</head>
<body onload="donner_focus('name_u')">
	
<div id="header">
	  
</div>

	<div id="nav">
		<ul>
		<li><a href="" class="current">Connexion</a></li>					
		</ul>
	</div>	
	
	<div id="logo">	
		
	</div>	
	<div id="contner">	
		<div id="connexion">
			<form method="POST" action="index.php">
				<h2>PANEL D'ADMINISTRATION</h2>
				<ul>
					<li ><label  for="name_u">Username :</label><input type="text" name="login" size="50" maxlength="50" id="name_u" required /></li>
					<li ><label  for="mp_u">passeword :</label><input type="password" name="pass" size="50" maxlength="50" id="mp_u" required /></li>					
					<li><input type="submit" value="Enregistrer" id="connectBtn" title="Connexion"/></li>
					<?php if(isset($erreur)){echo '<center>'.$erreur.'</center>';}?>
				
				</ul>
			</form>
		</div>
	</div>		
		
	
	
	
							
</div>
</body>
</html>



