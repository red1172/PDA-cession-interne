

<?php
//les fonctions mysql_ ne sont plus à utiliser (on dit qu'elles sont obsolètes)
//PDO car c'est cette méthode d'accès aux bases de données qui va devenir la plus utilisée dans les prochaines versions de PHP
//L'extension PDO : c'est un outil complet qui permet d'accéder à n'importe quel type de base de données MySQL que PostgreSQL ou Oracle.
//connectpdo
		
		
		include("config.php");
		//PHP exécute les instructions à l'intérieur du bloc try{ } . Si une erreur se produit, il s'arrête et "saute" directement au niveau du catch{ }
		try
{
	$bdd=new PDO("mysql:host=$host;dbname=$dbname", $user_db, $pass_db);/*crée ce qu'on appelle un objet $bdd et PDO est le nom de la classe sur laquelle est basé l'objet
																		c'est un objet qui représente la connexion à la base de données*/
	
}
	catch(Exception $error)
{
        die('Erreur : '.$error->getMessage());//die Affiche un message et termine le script courant
}
/*PDO est ce qu'on appelle une extension orientée objet de PHP.
 la programmation orientée objet en PHP
 utilisez ce modèle de blocs try/catch pour récupérer les erreurs relatives à la base de données, renvoyées par PDO */
?>
