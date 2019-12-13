<?php   
   header("Content-disposition: filename=listing.csv");
    header("Content-type: application/octetstream");
    header("Pragma: no-cache");
    header("Expires: 0");
	include('connectpdo.php'); 
	// on teste si une entrée de la base contient ce couple login / pass
	$req=$bdd->query('SELECT * from ardis WHERE article="63000476"') or die (print_r($bdd->errorInfo()));
	$data=$req->fetch();	
	$req=
    $client = getenv("HTTP_USER_AGENT");
    if(ereg('[^(]*\((.*)\)[^)]*',$client,$regs)) {
       $os = $regs[1];
       // this looks better under WinX
       if (eregi("Win",$os))
          $crlf="\r\n";
       else
          $crlf="\n";
    }


    while ($enr = $req) {
       print $enr["champ1"] . ";" . $enr["champ2"] . $crlf;
    }   
    exit();
	
?>	