<?php

if( $_SERVER['REQUEST_METHOD'] == "POST" ) {
	extract($_POST);
	if ((isset ($login) AND !empty($login)) AND((isset ($pass) AND !empty($pass)))){
	
		
		try
			{
						$pdo_options[PDO::ATTR_ERRMODE] = PDO::ERRMODE_EXCEPTION;
				$bdd = new PDO('mysql:host=localhost;dbname=cession', 'root', '', $pdo_options);
		// on teste si une entrée de la base contient ce couple login / pass
		$req=$bdd->query('SELECT count(*) as nb from tb_admin WHERE login="'.$login.'" and pass="'.$pass.'" ') or die (print_r($bdd->errorInfo()));
		$data=$req->fetch();	
		
		//si on obtient un resultat, alors l'utilisateur est un membre
		
			if ($data['nb']==1){
			$req=$bdd->query('SELECT * from tb_admin WHERE login="'.$login.'"') or die (print_r($bdd->errorInfo()));
			$data=$req->fetch();
						
				
				session_start();
				$_SESSION['login']=$login;
				$_SESSION['pass']=$pass;
				
				header("Location:accueil.php");
				exit(); 
				}
				// si on ne trouve aucune réponse, le visiteur s'est trompé soit dans son login, soit dans son mot de passe
		
			elseif ($data['nb'] == 0) { 
				$erreur = 'Compte non reconnu.'; 
			}		
			else { 
				$erreur = 'Identifiant de connexion déjà utilisé, veuillez choisir un autre.'; 
			} 
				}  
										catch(Exception $e)
										{
											die('Erreur : '.$e->getMessage());
										}	

	}	
	else { 
	   $erreur = 'Au moins un des champs est vide.'; 
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



