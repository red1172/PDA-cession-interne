<?php 
$host = "10.20.3.179";
$user1 = "root";
$pass1 = "";
$bdd = "ardis_meti";
$cpt=0;

$link1 = mysql_connect($host,$user1,$pass1)
  or die("Connection impossible user ou mot de passe incorecte");
mysql_select_db("$bdd", $link1)
  or die("Connection impossible a la base de donnÃ©es");

?>