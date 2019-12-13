<?php
session_start();
//check to see if they're logged in

include("verif_ses_res.php");
$login=$_SESSION['login'];


?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>::ARDIS PDA RESERVE::</title>
<link rel="stylesheet" type="text/css" href="../css/default.css" />
</style>
<script language="JavaScript">
<!--
function donner_focus(chp)
{
document.getElementById(chp).focus();
}
</script>

</head>

<body onload="donner_focus('ean')">
<?php
include ("../../includes/connexion.php"); 

?>

<div id="main">
    <?php include("menu_res_haut.html"); ?>
	<form id="f1" name="f1" action="etat_article.php" method="post">
        <p align="center">EAN :<input type="text" name="ean" id="ean" value=""  maxlength="14" size="14"/>
        <input type="submit" name="valider" id="valider" value="Ok!" /></p>
    </form>
    
<?php
if(isset($_POST["ean"]) && !empty($_POST["ean"]))
{
//============================//
	if(isset($_POST["ean"]) && !empty($_POST["ean"]))
	{	  
		  $ean=$_POST["ean"];
		  $sql = "select a.id_article,nom_article,quantite_rayon,quantite_reserve,nom_rayon, qte from articles a ";
		  $sql .= " INNER JOIN article_ean n On n.id_article=a.id_article  ";
		  $sql .= " INNER JOIN famille f On f.id_famille=a.id_famille  ";
		  $sql .= "  INNER JOIN  rayons r On r.id_rayon=f.id_rayon ";
		  $sql .= "  LEFT JOIN  vente_tmp v On v.id_article=a.id_article ";
		  $sql .= "  where  n.ean='$ean' " ;
		  
		//echo $sql."<br>";
	  	$req = mysql_query($sql) or die('Erreur SQL !'.$sql.''.mysql_error());

				
if($data = mysql_fetch_array($req))
{ 
	$qte_rayon=$data[2]-$data[5];
?>
	
    <p><?php echo "qte_rayon/ ".$qte_rayon." |";  echo "Rayon/ ". substr($data[4],1,10).".."; ?></p>
    <p><?php echo "qte reserve/ ". $data[3]; ?></p>
	<p><?php echo "Ean/ ".$ean; ?></p>
     <p><?php echo "num article/ ". $data[0]; ?></p>
    <p><?php echo "Nom/ ".substr($data[1],1,20).".." ?></p>

<?php }
	}}
?>


<?php include("menu_res_bas.html"); ?>
</div>

</body>
</html>
