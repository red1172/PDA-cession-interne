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
		<link rel="stylesheet" type="text/css" href="../css/main.css"/>
		<link rel="stylesheet" type="text/css" href="../css/style_pagination.css"/>
		<link rel="shortcut icon" href="images/animated_favicon.gif">
			<!--[if lt IE 8]><link rel="stylesheet" type="text/css" href="../css/ie.css" /><![endif]-->
		<script type ="text/javascript" src="js/jquery.js"></script> 
		<script type ="text/javascript" src="js/search.js"></script> 
</head>
<body>
	
<div id="header">
	  
</div>

	<div id="nav">
		<ul>
		<li><a href="accueil.php" >Accueil</a></li>	
		<li><a class="current" href="#" >Employer</a>
			<ul>
				<li><a class="current" href="#">Visualiser</a></li>
				<li><a href="ajout_user.php">Ajouter</a></li>
			</ul>
		</li>
		<li><a href="../index.php">Cession</a></li>
		</ul>
	</div>	
	<div id="logo">	
		<a href="index.php"></a>	  
	</div>	
	<div id="contner">			
			
		<h2>Liste des utilisateurs</h2>

<?php
	
		
	
	mysql_connect('localhost','root','')or die(mysql_error());
	mysql_select_db('cession') or die(mysql_error());	// include your code to connect to DB.
	
	$sql = "SELECT COUNT(*) as num FROM user";
	$req = mysql_query($sql) or die (mysql_error());
	$data = mysql_fetch_assoc($req);
	if (isset($_GET['p'])){
		$cpage=$_GET['p'];
	}
	else{
		$cpage=1;
	}
	
	$nbuser=$data['num'];
	$perpage=50;
	$nbpage=ceil($nbuser/$perpage);
	if (isset($_GET['p']) && $_GET['p']>0 && $_GET['p'] <=$nbpage){
		$cpage=$_GET['p'];
	}
	else{
		$cpage=1;
	}
	$sql = "SELECT * FROM user LIMIT ".(($cpage-1)*$perpage).", $perpage";
	$req = mysql_query($sql) or die (mysql_error());
	
	
	
	
	


		?>
		<table>
			<tr><th>Nom</th><th>Prénom</th><th>Fonction</th></tr>
			
		
		
		<?php
		while($data = mysql_fetch_assoc($req))
		

		{
		?>
		<tr><td><?php echo $data['login'] ?></td><td><?php echo $data['prenom'] ?></td><td><?php echo $data['fonction'] ?></td>
		
		<?php
		}
	?>
	</table>
<?php 
	for($i=1;$i<=$nbpage;$i++){
     //On va faire notre condition
     if($i==$cpage) //Si il s'agit de la page actuelle...
     {
          echo '<color="red"><ins> ' .$i. ' </ins></color> '; 
     }	
     else //Sinon...
     {
          echo ' <a href="user.php?p='.$i.'"> ' .$i. ' </a> ';
     }
}
?>
	</div>
</body>
</html>