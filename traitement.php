<?php






		if( $_SERVER['REQUEST_METHOD'] == "POST" ) {
extract($_POST);

if(($qtite=="") or ($qtite=="0") or ($desig=="") or ($r_acht=="") or ($r_vd=="") or ($nom_r_acht=="") or ($n_vd=="") or ($typ_op=="")){
?> <center><h1>Veuillez remplire les champs vide</h1>Vous serez redirigé automatiquement dans 2 secondes</center>
<meta http-equiv="refresh" content="2; url=accueil.php"/> <?php
}
else{
$typ_op="";

if($r_vd==$r_acht)
{
	$typ_op="Impossible";	
}

elseif ((($r_vd==14) or ($r_vd==15) or ($r_vd==22) or ($r_vd==24) or ($r_vd==21)) and ($r_acht< 90) )
{
	$typ_op="Cession interne";
}


else
{
	$typ_op="Auto-consommation";
}
include('connect.php'); 
$req1=mysql_query('SELECT * FROM rayon WHERE num_r="'.$r_acht.'" ');
while($data1=mysql_fetch_assoc($req1)){$nom_r_acht=$data1['libelle_r'];

}

try
	{
	$pdo_options[PDO::ATTR_ERRMODE] = PDO::ERRMODE_EXCEPTION;
		$bdd = new PDO('mysql:host=localhost;dbname=cession', 'root', '', $pdo_options);
	

 

$req=$bdd->prepare("INSERT INTO ces_int(Article, Design, Qtite, Vendeur,R_vendeur, Acheteur,R_acheteur, Type_Op, Utilisateur, Date) VALUES(:art, :des, :qtite, :n_vd, :r_vd, :n_acht, :r_acht,  :typ_op, :user, now())") or die(print_r($bdd->errorInfo()));
$req->execute(array('art'=>$article,  'des'=>$desig,'n_vd'=>$n_vd, 'r_vd'=>$r_vd, 'n_acht'=>$nom_r_acht, 'r_acht'=>$r_acht,  'qtite'=>$qtite,'typ_op'=>$typ_op, 'user'=>$user ));








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
