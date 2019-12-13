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
		<script type ="text/javascript" src="js/search.js"></script> 
			<!--[if lte IE8]>		
			<script src="dist/html5shiv.js"></script>						
			<link rel="stylesheet" type="text/css" href="css/ie.css" />
			<![endif]-->
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
						<li><a href="editer_profil.php">Editer profil</a></li>
						<li><a href="deconnexion.php">Déconnexion</a></li>
					</ul>
				</li>
			</ul>	
	</div>
	<div id="nav">
		<ul>
		<li><a href="accueil.php">Accueil</a></li>	
		<li><a href="" class="current">Consultation</a></li>			
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
		}else{		
			try
			{?>
	
	<table>
		<tr>
			<th>Code Article</th><th>Désignation</th><th>Quantité</th><th>Rayon vendeur</th><th>Rayon Acheteur</th><th>Type d'opération</th><th>Utilisateur</th><th>Date</th>
		</tr>
		<?php
		
				$bdd = new PDO('mysql:host=localhost;dbname=cession', 'root', '');
			

			$req = $bdd->query('SELECT article, design, qtite, vendeur, achteur, typop, user, DATE_FORMAT(date, \'%d/%m/%Y \') AS date_fr FROM ces_int WHERE date >= "'.$date_d.'"  AND date <= "'.$date_f.'"  ORDER BY date DESC ');

			while ($data = $req->fetch())

			{
			
		?>
		<tr>
			<td><?php echo $data['article']?></td><td><?php echo $data['design']?></td><td><center><?php echo $data['qtite']?></center></td><td><center><?php echo $data['vendeur']?></center></td>
			</center><td><center><?php echo $data['achteur']?></center></td><td><?php echo $data['typop']?></td><td><?php echo $data['user']?></td><td><?php echo $data['date_fr']?></td>
		</tr>
		<?php } ?>
	</table>
	<form action="convert.php?date1=<?php echo $date_d;?>&date2=<?php echo $date_f;?>" method="POST">
		
		<input type ="submit" name="submit" value="Extraction" />
	</form>
	
</div>
</body>
</html>
<?php
			}
			catch (Exception $e)
			{
					die('Erreur : ' . $e->getMessage());
			}
		$req->closeCursor();

}
}else{
echo 'Echec';

}
?>	