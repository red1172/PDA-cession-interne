<?php 
$date_j=date('jmYHi');
	if(isset($_POST['submit']) )
	extract($_POST);
	{
		include("connectpdo.php");
		$rep=$bdd->query('SELECT COUNT(*)AS nb from ces_int WHERE date >= "'.$_GET['date1'].'"  AND date <= "'.$_GET['date2'].'"  ORDER BY date DESC ');
		$donnees=$rep->fetch();	
		$nb_news=$donnees['nb'];
		if ($nb_news==0)
		{
		 echo '<h1 style="text-align:center;color:red;"><strong>Aucune produit n\'est disponible pour ces dates.</strong></h1>';  
		 ?> <meta http-equiv="refresh" content="5; url=consultation.php"/> <?php
		}
		else{
		
		$date_d=$_GET['date1'];
		$date_f=$_GET['date2'];
		
		$conn=mysql_connect("localhost","root",""); 
		mysql_select_db("cession",$conn);
		$filename='extraction/'.$date_j.'.csv';		

		
		$sql = mysql_query('SELECT article, design, qtite, vendeur, achteur, typop, user, DATE_FORMAT(date, \'%d/%m/%Y \') AS date_fr FROM ces_int WHERE date >= "'.$date_d.'"  AND date <= "'.$date_f.'"  ORDER BY date DESC ');
		
		$row=mysql_fetch_assoc($sql);
		$fp=fopen($filename, "w");
		$separator="";
			$comma="";
		
		foreach($row as $data => $value)
			{
				$separator .= $comma . '' .str_replace('','""',$data);
				$comma=";";
			}
		
			$separator .= "\n";
				
		fputs($fp,$separator);		
		mysql_data_seek($sql, 0);
				
		while($row=mysql_fetch_assoc($sql))
		{	
			$separator="";
			$comma="";
					
			foreach($row as $data => $value)
			{
				$separator .= $comma . '' .str_replace('','""',$value);
				$comma=";";
			}
		
			$separator .= "\n";
			
		
		fputs($fp,$separator);
		}
		
$full_path = 'extraction/'.$date_j.'.csv';	// chemin système (local) vers le fichier
$file_name = basename($full_path);
 
ini_set('zlib.output_compression', 0);
$date = gmdate(DATE_RFC1123);
 
header('Pragma: public');
header('Cache-Control: must-revalidate, pre-check=0, post-check=0, max-age=0');
 
header('Content-Tranfer-Encoding: none');
header('Content-Length: '.filesize($full_path));
header('Content-MD5: '.base64_encode(md5_file($full_path)));
header('Content-Type: application/octetstream; name="'.$file_name.'"');
header('Content-Disposition: attachment; filename="'.$file_name.'"');
 
header('Date: '.$date);
header('Expires: '.gmdate(DATE_RFC1123, time()+1));
header('Last-Modified: '.gmdate(DATE_RFC1123, filemtime($full_path)));
 
readfile($full_path);
exit; // nécessaire pour être certain de ne pas envoyer de fichier corrompu


		fclose($fp);
		?>	<center><p style="color:green;font-size:20px;">Le fichier Excel a été généré avec succès</p></center>
			<meta http-equiv="refresh" content="5; url=consultation.php"/> 
		<?php
	}


}
?>

































