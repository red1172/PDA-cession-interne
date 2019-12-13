<!doctype html>
<html lang="fr">
<head>
		
        <meta charset="UTF-8" />
        <title>Cession interne</title>
		<link rel="stylesheet" type="text/css" href="../css/main.css"/>
		<link rel="stylesheet" type="text/css" href="style.css"/>
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
    // Imports des fichiers de pagination/DB
    include_once('paginate.php');
 
    // Connexion à la BDD (à vous de configurer les paramètres de connexion à la base)
   mysql_connect('localhost','root','')or die(mysql_error());
	mysql_select_db('cession') or die(mysql_error());	// include your code to connect to DB.
	$sql = "SELECT COUNT(*) as num FROM user";
	$req = mysql_query($sql) or die (mysql_error());
	$data = mysql_fetch_assoc($req);
	$nbuser=$data['num'];
 
    // Libération de la mémoire associée au résultat
    mysql_free_result($res);
 
    $epp = 20; // nombre d'entrées à afficher par page (entries per page)
    $nbPages = ceil($total/$nbuser); // calcul du nombre de pages $nbPages (on arrondit à l'entier supérieur avec la fonction ceil())
 
    // Récupération du numéro de la page courante depuis l'URL avec la méthode GET
    // S'il s'agit d'un nombre on traite, sinon on garde la valeur par défaut : 1
    $current = 1;
    if (isset($_GET['p']) && is_numeric($_GET['p'])) {
        $page = intval($_GET['p']);
        if ($page >= 1 && $page <= $nbPages) {
            // cas normal
            $current=$page;
        } else if ($page < 1) {
            // cas où le numéro de page est inférieure 1 : on affecte 1 à la page courante
            $current=1;
        } else {
            //cas où le numéro de page est supérieur au nombre total de pages : on affecte le numéro de la dernière page à la page courante
            $current = $nbPages;
        }
    }
 
    // $start est la valeur de départ du LIMIT dans notre requête SQL (dépend de la page courante)
   $start = ($current * $epp - $epp);
 
    // Récupération des données à afficher pour la page courante
    $sql = "SELECT * FROM user LIMIT $start, $epp";
	$req = mysql_query($sql) or die (mysql_error());
	
	
    
        	?>
		<table>
			<tr><th>Nom</th><th>Prénom</th><th>Fonction</th></tr>
			
		
		
		
		
		<?php
		
	
        echo "<ul id=\"results\">\n";
       while($item = mysql_fetch_assoc($req)){
		
		
         ?>
		<tr><td><?php echo $item['login'] ?></td><td><?php echo $item['prenom'] ?></td><td><?php echo $item['fonction'] ?></td>
		
		<?php
        }
       
 
 
    echo paginate('user2.php', '?p=', $nbPages, $current);
	?>
</div>
</body>
</html>