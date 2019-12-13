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
        <title>::ARDIS::CESSION INTERNE</title>
		<link rel="stylesheet" type="text/css" href="css/main.css"/>
		<link rel="stylesheet" type="text/css" media="print" href="css/print.css" />
		<link rel="shortcut icon" href="images/animated_favicon.gif">
		<script type ="text/javascript" src="js/jquery.js"></script> 
		<script type ="text/javascript" src="js/search.js"></script> 
		<!--[if lt IE 8]><link rel="stylesheet" type="text/css" href="css/ie.css" /><![endif]-->
		
		<script language="Javascript">
function imprimer(){window.print();}
</script>
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
						<li><a href="profil.php?user=<?php echo $user ?>">Profil</a></li>
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
	if( $_SERVER['REQUEST_METHOD'] == "POST" ) {
		extract($_POST);
		if ($date_f < $date_d)
		{
			?>
			<center><h1 style="color:red;">Votre date de fin et inférieure à votre date de début, veuillez entrer des dates valides</h1></center>;
			<meta http-equiv="refresh" content="5; url=consultation.php"/> 
			<?php 
		}
		$personne = array('BENDJARAR', 'KOUIDER', 'BOUDJOUADI', 'BOUAIT' , 'LEBBI', 'BOUZELHA', 'ADMIN');
			try
			{		
							$bdd = new PDO('mysql:host=localhost;dbname=cession', 'root', '');
					if (in_array($user, $personne))//vérifier si les utilisateur existe dans l'array 
					{
				
			
			?>
	
				
					<?php
					
							$bdd = new PDO('mysql:host=localhost;dbname=cession', 'root', '');
						

						$req = $bdd->query('SELECT Article, Design, Qtite, Vendeur,R_vendeur, Acheteur,R_acheteur, Type_Op, Utilisateur, DATE_FORMAT(Date, \'%d/%m/%Y \') AS date_fr FROM ces_int WHERE Date >= "'.$date_d.'"  AND Date <= "'.$date_f.'"  ORDER BY Date DESC ')or die(print_r($bdd->errorInfo()));
					}else{
						
						$req = $bdd->query('SELECT Article, Design, Qtite, Vendeur,R_vendeur, Acheteur,R_acheteur, Type_Op, Utilisateur, DATE_FORMAT(Date, \'%d/%m/%Y \') AS date_fr FROM ces_int WHERE Date >= "'.$date_d.'"  AND Date <= "'.$date_f.'"  AND Utilisateur="'.$user.'" ORDER BY Date DESC ')or die(print_r($bdd->errorInfo()));
						
						}
			?>
			<table>
					<tr>
						<th>Code Article</th><th>Désignation</th><th>Quantité</th><th>Vendeur</th><th>R_vendeur</th><th>Acheteur</th><th>R_Acheteur</th><th>Type d'opération</th><th>Utilisateur</th><th>Date</th>
					</tr>
			<?PHP 	
			while ($data = $req->fetch())

			{
			
		?>
		<tr>
			<td><?php echo $data['Article']?></td><td><?php echo $data['Design']?></td><td><center><?php echo $data['Qtite']?></center></td><td><center><?php echo $data['Vendeur']?></center></td>
			<td><center><?php echo $data['R_vendeur']?></center></td></center><td><center><?php echo $data['Acheteur']?></center></td><td><center><?php echo $data['R_acheteur']?></center></td><td><?php echo $data['Type_Op']?></td><td><?php echo $data['Utilisateur']?></td><td><?php echo $data['date_fr']?></td>
		</tr>
		<?php } ?>
	</table>
	<form action="convert.php?date1=<?php echo $date_d;?>&date2=<?php echo $date_f;?>&user=<?php echo $user;?>" method="POST">
		
		<input type ="submit" name="submit" value="Extraction" /><input name="B1" onclick="imprimer()" type="button" value="Imprimer">
	</form>
	<?php
			}
			catch (Exception $e)
			{
					die('Erreur : ' . $e->getMessage());
			}
		$req->closeCursor();



}
	
	?>
				
				
		