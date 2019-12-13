<?php
	if(!isset($_COOKIE["login"]))
{
    session_start();  
	if (!isset($_SESSION['login'])) { 
   header ('Location:index.php'); 
   exit();  
}

} 

$user = $_SESSION['login'];
$pass= $_SESSION['pass'];

		if( $_SERVER['REQUEST_METHOD'] == "POST" ) {
extract($_POST);
if(($old_pass=="") or ($new_pass=="") or ($renew_pass=="")){
?> <center><h1>Veuillez remplire les champs vide</h1>Vous serez redirigé automatiquement dans 5 secondes</center>
<meta http-equiv="refresh" content="5; url=accueil.php"/> <?php
}
else{
	if($new_pass==$renew_pass)
	{

	
		try
			{
		
				$bdd = new PDO('mysql:host=localhost;dbname=cession', 'root', '');
				
					if($old_pass==$pass){
					
						$req =$bdd->prepare( 'UPDATE user SET pass = :n_pass 	WHERE login = :login_En');
						$req->execute(array( 'n_pass'=>$new_pass,'login_En'=>$user));
		 
					  //affichage des résultats, pour savoir si l'insertion a marchée:
					  if($req)
					  {
					  
					  ?>
					  <center> <p style="padding-left:15px;color:#007d32;text-decoration:blink;"><strong>La modification a été correctement effectuée</strong></p></center>
						<meta http-equiv="refresh" content="5; url=accueil.php">
						<?php
						
						
					  }
					  else{
					  ?>
						<center><p style="padding-left:15px;color:#fc2100;text-decoration:blink;"><strong>La modification à échouée</strong></p></center>
						 <meta http-equiv="refresh" content="5; url=modif_pass.php">
			
	<?php
						}
					}else{
					
					?>
					<center><p style="padding-left:15px;color:#fc2100;text-decoration:blink;"><strong>Mot de passe différent </strong></p></center>
					<meta http-equiv="refresh" content="5; url=modif_pass.php">
					<?php
					}
					
			
			}
			
			catch (Exception $e)
			{
					die('Erreur : ' . $e->getMessage());
					
			}									 	
	

	}
	else{
		?>
		<center><p style="padding-left:15px;color:#fc2100;text-decoration:blink;"><strong>MOT de passe différent, veuillez recommencer s'il vous plait, redirection automatiquement dans 5 secondes</p></center>
		<meta http-equiv="refresh" content="5; url=modif_pass.php"/> 
		<?php 
		}
				
			

}
}
?> 

<!--<meta http-equiv="refresh" content="10; url=accueil.php"/> --->
<!--header("Location:accueil.php");-->
