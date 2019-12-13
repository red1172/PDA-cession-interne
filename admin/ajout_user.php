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
		<link rel="stylesheet" type="text/css" href="../css/main.css"/>
		<link rel="shortcut icon" href="../images/animated_favicon.gif">
		<script type ="text/javascript" src="../js/jquery.js"></script> 
		<script type ="text/javascript" src="../js/search.js"></script> 
<style>
label{
	color : #0a1269;
	font-weight : bold;
	width : 300px;
	display : bolck;
	float : left;
	margin-left:20px;
}
h1{
color:#007d32;
}
</style>
</head>
<body>

	
<div id="header">
	  
</div>

	<div id="nav">
		<ul>
		<li><a href="index.php" >Accueil</a></li>	
		<li><a href="#" class="current">Employer</a>
			<ul>
				<li><a href="user.php">Visualiser</a></li>
				<li><a href="ajout_user.php">Ajouter</a></li>
			</ul>
		</li>
		<li><a href="cession.php">Cession</a></li>
		</ul>
	</div>	
	<div id="logo">	
		<a href="index.php"></a>	  
	</div>	
<div id="contner">	
	<form method="POST" action="verif_user.php">
		<h1>Ajouter un utilisateur</h1>
		
		<label >Nom :</label><input type="text" name="nom" size="14" maxlength="14" ><br /><br />
		<label >Prenom :</label><input type="text" name="prenom" size="14" maxlength="50" ><br /><br />
		<label >Mot de passe :</label><input type="password" name="pass" size="14" maxlength="50" ><br /><br />	
		<label >Fonction :</label><input type="text" name="fonc" size="30" maxlength="50" ><br /><br />	
		
		<input type="submit" value="OK" id="OkBtn" title="enregistrer"/>
			<td style="border:0px;">
			<input type="button" value="ANNULER" id="OkBtn" title="Annuler" onclick="location.href='accueil.php'"  /></td>
	</form>
		<?php echo $erreur; ?>					

</body>
</html>	