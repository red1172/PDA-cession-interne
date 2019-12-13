<?php
	if(!isset($_COOKIE["login"]))
{
    session_start();  
	if (!isset($_SESSION['login'])) { 
   header ('Location:index.php'); 
   exit();  
}

} 



?>
<!doctype html>
<html lang="fr">
<head>
        <meta charset="UTF-8" />
        <title>Cession interne</title>
		<link rel="stylesheet" type="text/css" href="css/main.css"/>
		<link rel="stylesheet" type="text/css" media="print" href="css/print.css" />
		<link rel="shortcut icon" href="images/animated_favicon.gif">
		<script type ="text/javascript" src="js/jquery.js"></script> 
		<!--[if lt IE 8]><link rel="stylesheet" type="text/css" href="css/ie.css" /><![endif]-->
</head>
<body>

	
<div id="header">
	  
</div>
	<div id="nav_profil">
				<?php
			if(isset($_COOKIE["login"])){
				$user = $_COOKIE["login"];
			}
			else{
				$user = $_SESSION['login']; 
			}	
			
			 ?>
			 <ul>
				<li><a class="current" href="#"><?php echo $user ?><img src="images/fleche_bas.png" alt="fleche_bas" border="0"/></a>
					<ul>
						<li><a href="profil.php">Profil</a></li>
						<li><a href="modif_pass.php">Mot de passe</a></li>
						<li><a href="deconnexion.php">Déconnexion</a></li>
					</ul>
				</li>
			</ul>	
	</div>
	<div id="nav">
		<ul>
		<li><a href="accueil.php">Accueil</a></li>	
		<li><a href="consultation.php" >Consultation</a></li>			
		</ul>
	</div>	
	<div id="logo">	
		<a href="index.php"></a>	  
	</div>	
<div id="contner">	
	<?php	
	
		try
			{
		
				$bdd = new PDO('mysql:host=localhost;dbname=cession', 'root', '');
			

			$req = $bdd->query('SELECT * FROM user WHERE login = "'.$user.'"' );
		?>
		<form>
		
		<?php
			while ($data = $req->fetch())

			{
			
		?>
			
			
			<label>Nom : </label><input type="text" name="nom" value="<?php echo strtoupper($data['login'])?>" readonly="readonly" /><br />
			<label>Prénom : </label><input type="text" name="nom" value="<?php echo strtoupper($data['prenom'])?>" readonly="readonly" /><br />
			<label>Prénom : </label><input type="text" name="nom" value="<?php echo strtoupper($data['fonction'])?>" readonly="readonly" /><br />			
			<a href="modif_pass.php">Cliquez ici pour modifier votre mot de passe</a>
		<?php } ?>
		</form>
	
	

<?php
			}
			catch (Exception $e)
			{
					die('Erreur : ' . $e->getMessage());
			}
		$req->closeCursor();



?>
</div>
</body>
</html>	