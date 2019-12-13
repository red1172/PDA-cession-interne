<?php

	try {
	
		$cnx= new PDO('mysql:host=localhost;dbname=cession', 'root', '');
			
	}
	catch(PDOExeption $e)
	{
		echo $e->getMessage();
	}
?>