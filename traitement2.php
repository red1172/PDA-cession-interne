<?php






		if( $_SERVER['REQUEST_METHOD'] == "POST" ) {
extract($_POST);

if(($qtite=="") or ($desig=="") ){
?> <center><h1>Veuillez remplire les champs vide</h1>Vous serez redirigé automatiquement dans 2 secondes</center>
<meta http-equiv="refresh" content="2; url=accueil.php"/> <?php
}
else{
		


try
	{
	$pdo_options[PDO::ATTR_ERRMODE] = PDO::ERRMODE_EXCEPTION;
		$bdd = new PDO('mysql:host=localhost;dbname=cession', 'root', '', $pdo_options);
	
		if($nom_r_acht=="MOYENS GENERAUX ALGER"){$r_acht="99";}
		elseif($nom_r_acht=="CHARCUTERIE TRAITEUR"){$r_acht="20";}
		elseif($nom_r_acht=="POISSONERIE"){$r_acht="21";}
		elseif($nom_r_acht=="FRUITS ET LEGUMES"){$r_acht="22";}
		elseif($nom_r_acht=="BOULANGERIE"){$r_acht="23";}
		elseif($nom_r_acht=="BOUCHERIE VOLLAILLE"){$r_acht="24";}
		elseif($nom_r_acht=="MOYENS GENERAUX ORAN"){$r_acht="98";}
		
		if ($r_acht=="99"){$typ_op="Auto-consommation";}
		elseif($r_acht=="98"){$typ_op="Auto-consommation inter-magasin";}
		else {$typ_op="Cession interne";}

		$req=$bdd->prepare("INSERT INTO ces_int(Article, Design, Qtite, Vendeur,R_vendeur, Acheteur,R_acheteur, Etat, Type_Op, Utilisateur, EAN,  Date) VALUES(:art, :des, :qtite, :n_vd, :r_vd, :n_acht, :r_acht, :etat, :typ_op, :user, :ean, now())") or die(print_r($bdd->errorInfo()));
		$req->execute(array('art'=>$article,  'des'=>$desig,'n_vd'=>$n_vd, 'r_vd'=>$r_vd, 'n_acht'=>$nom_r_acht, 'r_acht'=>$r_acht,  'qtite'=>$qtite, 'etat'=>$etat, 'typ_op'=>$typ_op, 'user'=>$user, 'ean'=>$ean ));








}
catch(Exception $e)										
{
		die('Erreur : '.$e->getMessage());
}		
}
}									 


?> 
<meta http-equiv="refresh" content="0; url=accueil.php"/> 
<!--header("Location:accueil.php");-->
