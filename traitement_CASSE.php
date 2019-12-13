<?php






		if( $_SERVER['REQUEST_METHOD'] == "POST" ) {
extract($_POST);

if($qtite=="") {
?> <center><h1>Veuillez remplire La quantité</h1>Vous serez redirigé automatiquement dans 2 secondes</center>
<meta http-equiv="refresh" content="2; url=accueil.php"/> <?php
}
else{
		


try
	{
	$pdo_options[PDO::ATTR_ERRMODE] = PDO::ERRMODE_EXCEPTION;
		$bdd = new PDO('mysql:host=localhost;dbname=cession', 'root', '', $pdo_options);
	
		//$typ_op="Cession inter-magasin";
	

		$req=$bdd->prepare("INSERT INTO casse(art,qtite,user,pxvt,lib, EAN, date) VALUES( :art, :qtite, :user, :pxvt, :lib, :ean, now())") or die(print_r($bdd->errorInfo()));
		$req->execute(array('art'=>$art,  'lib'=>$lib,'pxvt'=>$pxvt, 'qtite'=>$qtite, 'user'=>$user, 'ean'=>$ean ));








}
catch(Exception $e)										
{
		die('Erreur : '.$e->getMessage());
}		
}
}									 


?> 
<meta http-equiv="refresh" content="0; url=accueil_CASSE.php"/> 
<!--header("Location:accueil.php");-->
