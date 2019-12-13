<?php
if(isset($_COOKIE["login"]))
{
     header('Location:accueil.php');
     exit();  
}


if( $_SERVER['REQUEST_METHOD'] == "POST" ) {
	extract($_POST);
	if ((isset ($login) AND !empty($login)) AND((isset ($pass) AND !empty($pass)))){
		$login=htmlspecialchars($login);
		$pass=htmlspecialchars($pass);
		include('connect.php'); 
		// on teste si une entrée de la base contient ce couple login / pass
		$req=$bdd->query('SELECT count(*) as nb from user WHERE login="'.$login.'" and pass="'.sha1($pass).'" ') or die (print_r($bdd->errorInfo()));
		$data=$req->fetch();	
		
		//si on obtient un resultat, alors l'utilisateur est un membre
		
			if ($data['nb']==1){
			$req=$bdd->query('SELECT * from user WHERE login="'.$login.'"') or die (print_r($bdd->errorInfo()));
			$data=$req->fetch();
						if(!empty($autoconnect)){
						setcookie('login', $login, time()+365*24*3600);
						setcookie('pass', sha1($pass), time()+365*24*3600);
						
						}
				
				session_start();
				$_SESSION['login']=$login;
				$_SESSION['pass']=sha1($pass);
				
				header("Location:etudiant/index.php");
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
	else { 
	   $erreur = 'Au moins un des champs est vide.'; 
	}  
	$req->closeCursor();		
}	

?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<title>EAD</title>
<meta http-equiv="Content-Type" content="text/html; charset=windows-1252"/>
<meta name="language" content="fr"/>
<meta http-equiv="Content-Language" content="fr"/>
<link rel="stylesheet" href="css/main.css" type="text/css" media="screen" />
<style>
form{
	margin-top:70px;
	margin-left:150px;
}
label{
	color : #0a1269;
	font-weight : bold;
	width : 200px;
	display : bolck;
	float : left;
}
</style>
</head>
<body>
		<div id="contenu">
			<div id="header" style="">		
			
			</div>
			<div id="nav">
			
				
					<li><a  href="index.php">Accueil</a></li>						
				
					<li><a  href="lescours.php">Cours</a></li>
					
					
					<li><a   href="#">Évaluation</a>
						<ul >

							<li><a href="lesevaluation.php?evaluation=<?php echo 'ACAD';?>&intitule=<?php echo "evaluation acad" ?>">Évaluation acad</a></li>
							<li><a href="lesevaluation.php?evaluationr=<?php echo 'GTR';?>&intitule=<?php echo "evaluation gtr" ?>">Évaluation gtr</a></li>
							<li><a href="lesevaluation.php?evaluation=<?php echo 'ISIL';?>&intitule=<?php echo "evaluation isil" ?>">Évaluation gtr</a></li>
							
							
							
						</ul>
					</li>
					
					
					
					<li><a  href="#">Corriger évaluation</a>
						<ul >

							<li><a href="lescorevaluation.php?corevaluation=<?php echo 'ACAD';?>&intitule=<?php echo "corriger evaluation acad" ?>">Corriger évaluation acad</a></li>
							<li><a href="lescorevaluation.php?corevaluationr=<?php echo 'GTR';?>&intitule=<?php echo "corriger evaluation gtr" ?>">Corriger  évaluation gtr</a></li>
							<li><a href="lescorevaluation.php?corevaluation=<?php echo 'ISIL';?>&intitule=<?php echo "corriger evaluation isil" ?>">Corriger évaluation gtr</a></li>
							
							
							
						</ul>
					</li>
					
					
					
					<li><a href="Service.html">Forum</a></li>
					<li><a href="Site_web.html">FAQ</a></li>
													
										
			</div>
				
			<div id="corps">
			<h1 style="margin-top:50px; color:#01437D;">Se connecter</h1>
			<p style="margin-left:20px;font-size:18px;">Cette page vous permet de vous connecter en tant que membre du Site Enseignement à distance</p>
				<form action="connexion.php" method="POST">
					<p>
					<label for="login">Login <span style="font-weight:bold;color:red;">*</span></label>
					<input type="text" name="login" id="login"><br /><br />
					<label for="pass">Mot de passe<span style="font-weight:bold;color:red;">*</span></label>
					<input type="password" name="pass" id="pass"><br /><br />		
					<label for="connect">Connexion automatique</label>	
					<input type="checkbox" name="autoconnect" id="connect"><br /><br />				
					<input class="ContactSubmitBtn" type="submit" value="Se connecter" title="cliquez ici pour vous connecter"/>&nbsp;&nbsp;
					<?php if(isset($erreur)){echo '<center>'.$erreur.'</center>';}?>
					
					</p>
				</form>	
			</div>
		
					
			
			<div id="footer" style="">
			<p>Copyright © 2011 Enseignement à distance Tous droits réservés.</p>
			</div>
		</div>
		
	</body>
</html>	