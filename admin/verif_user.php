<?php
$erreur="";
if( $_SERVER['REQUEST_METHOD'] == "POST" ) {
	extract($_POST);
	
	if ((isset ($nom) && !empty($nom)) && (isset ($pass) &&!empty($pass)) && (isset ($prenom) && !empty($prenom)) && (isset ($fonc) && !empty($fonc)))
	{
		
		$nom=htmlspecialchars(strtoupper($nom));	
		$pass=htmlspecialchars($pass);
		$prenom=htmlspecialchars(strtoupper($prenom));
		$fonc=htmlspecialchars(strtoupper($fonc));
				
			try
			{
						$pdo_options[PDO::ATTR_ERRMODE] = PDO::ERRMODE_EXCEPTION;
				$bdd = new PDO('mysql:host=localhost;dbname=cession', 'root', '', $pdo_options);
			// on teste si une entrée de la base contient ce couple login / pass
			$req=$bdd->query('SELECT count(*) as nb from user WHERE login="'.$nom.'" ') or die(print_r($bdd->errorInfo()));
			$data=$req->fetch();	
			
			// on recherche si ce login est déjà utilisé par un autre membre
				if ($data['nb']==0){
					$req1=$bdd->prepare("INSERT INTO user (login, prenom, pass, fonction) VALUES (:login,  :prenom, :pass, :fonc)")or die(print_r($bdd->errorInfo()));
					$req1->execute(array('login'=>$nom, 'prenom'=>$prenom,'pass'=>$pass, 'fonc'=>$fonc)); 
					$req1->closeCursor();
					
								
					header('Location:ajout_user.php');
					exit(); 
					
				}
						// si on ne trouve aucune réponse, le visiteur s'est trompé soit dans son login, soit dans son mot de passe
				else{ 
					$erreur = 'Un membre possède déjà ce login.'; 
					echo ?><center><?php$erreur;?></center><?php
				}
			}  
										catch(Exception $e)
										{
											die('Erreur : '.$e->getMessage());
										}	



										  $req1->closeCursor();
										  	
				
	}	
	else { 
			$erreur = 'Au moins un des champs est vide.'; 
			echo ?><center><?php$erreur;?></center><?php
	}  
		
	
}
	
?>