﻿<?php
	if(!isset($_COOKIE["login"]))
{
    session_start();  
	if (!isset($_SESSION['login']) AND ((!isset($_SESSION['flag']) && $_SESSION['flag']!="CASSE"  )) ) { 
   header ('Location:index.php'); 
   exit();  
}

}

 

if ((isset($_SESSION['flag']) && ($_SESSION['flag']=="CASSE" )) )
{ 



?> 
<!doctype html>
<html lang="fr">
<head>
        <meta charset="UTF-8" />
        <title>::ARDIS::CESSION INTERNE MAGASIN</title>
		<link rel="stylesheet" type="text/css" href="css/main.css"/>
		<!--[if lt IE 8]><link rel="stylesheet" type="text/css" href="css/ie.css" /><![endif]-->
		<link rel="shortcut icon" href="images/animated_favicon.gif">
		<script type ="text/javascript" src="js/jquery.js"></script> 
		<script type ="text/javascript" src="js/search.js"></script> 		
		<script type ="text/javascript" src="js/jquery.js"></script> 
	<script language="JavaScript">
<!--
function donner_focus(chp)
{
document.getElementById(chp).focus();
}
</script>
		
</head>
<body onload="donner_focus('recher')">

	
<div id="header">
	  
</div>
	<div id="nav_profil">
				<?php
			if(isset($_COOKIE["login"])){
				$user = $_COOKIE["login"];
			}
			else{
				$user = $_SESSION['login']; 
			}	
			
			 ?>
			 <ul>
				<li><a class="current" href="#"><?php echo strtoupper($user) ?><img src="images/fleche_bas.png" alt="fleche_bas" border="0" class="image_ie" /></a>
					<ul>
						<li><a href="profil.php">Profil</a></li>
						<li><a href="modif_pass.php">Mot de passe</a></li>
						<li><a href="deconnexion.php">Déconnexion</a></li>
					</ul>
				</li>
			</ul>	
	</div>
	<div id="nav">
		<ul>
		<li><a href="" class="current">Accueil</a></li>
		<li id="menu_ie"><a href="consultation.php" >Consultation</a></li>
		<li><a href="accueil.php" >Retour</a></li>		
		</ul>
	</div>	
	<div id="logo">	
		<a href="index.php"></a>	  
	</div>	
<div id="contner">	

<?php
								 

	
if( $_SERVER['REQUEST_METHOD'] == "POST" ) {
	
include('connect.php'); 
if(isset($_POST['motclef'])AND !empty($_POST['motclef']))
{
	
	$motclef = $_POST['motclef'];
	

	$numm="";
		if(($motclef >= 2900000000000)and( $motclef <= 2999999999999)){
		$numm=substr($motclef,0,7);
		$motclef= $numm."000000";
		
		}
	
	
	
	$req=mysql_query("SELECT * FROM rayon ");
	$host = "10.20.3.179";
$user1 = "root";
$pass1 = "";
$bdd = "ardis_meti";
$cpt=0;

// $link1 = mysql_connect($host,$user1,$pass1)
  // or die("Connection impossible user ou mot de passe incorecte");
// mysql_select_db("$bdd", $link1)
  // or die("Connection impossible a la base de données");
	
	
	 // $order = "select   article_ean.id_article , article_ean.ean  , articles.nom_article,rayons.id_rayon,rayons.nom_rayon
					// from  article_ean
					// inner join articles on article_ean.id_article=articles.id_article
					// inner join famille on  articles.id_famille=famille.id_famille
					// inner join rayons on  famille.id_rayon=rayons.id_rayon
					
					// where ean = '$motclef'";

		  
		  
	
	
	// $result = mysql_query($order);  
	
	
	
		//$sql="select  article_ean.id_article , article_ean.ean  , articles.id_article from  article_ean";
		//$sql.="inner join articles on article_ean.id_article=articles.id_article";
		//$sql.="where ean LIKE'$motclef%'";
		//
		//$result = mysql_query($sql) or die('Erreur SQL !'.$sql.''.mysql_error());
		//if($row = mysql_fetch_array($result))
		// if ($result){
					// if($donnee = mysql_fetch_row($result))
				// {
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
$un='hyp010';
$pw='ATTENT1';



$conn = oci_connect($un, $pw, '(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=10.20.3.41)(PORT=1521)) (CONNECT_DATA=(SERVER=DEDICATED) (SERVICE_NAME = ME01)))');
if (!$conn) {
    $e = oci_error();
    trigger_error(htmlentities($e['message'], ENT_QUOTES), E_USER_ERROR);
}

$STID = OCI_PARSE($conn,"SELECT   MGEAN.EAN_CD AS 
 EAN, MGART.ART_NOART AS ARTICLE, MGART.ART_LBCAISSE AS LIBELLE,  MGART.ART_PXVENTCAI AS PXVT, ART_CDF AS FAM, ART_CDS AS SSFAM

 FROM  MGEAN

 INNER JOIN MGART ON EAN_NOART=ART_NOART

 INNER JOIN MGPVM ON  EAN_NOART=PVM_NOART
 
 
 WHERE EAN_CD='$motclef' ");
 
   OCI_EXECUTE($STID);

   $ROW = OCI_FETCH_ARRAY($STID, OCI_ASSOC+OCI_RETURN_NULLS);
   
   
   $ean=$ROW['EAN'];
   $article=$ROW['ARTICLE'];
   $LIB=$ROW['LIBELLE'];
   $PXVT=$ROW['PXVT'];
   $ray=SUBSTR($article,0,2);  
  
   $STID2= oci_parse($conn,"select RAY_LB from MGRAY where RAY_CDR= '$ray' ");
 
 
 
 
   oci_execute($STID2);

   $ROW2 = oci_fetch_array($STID2, OCI_ASSOC+OCI_RETURN_NULLS);
   $nomray=$ROW2['RAY_LB'];
	
	
	
		if ($ROW){					
				?>
	<div id="recherche">
				<form method ="post" action="traitement_CASSE.php">
				<ul>
				<li><label>Quantité :  </label><input type="float" name="qtite" style="width:50px" size="7" id="recher" required></li>	
				<li><label>EAN :  </label><input type="text" name="ean" size="20" style="width:95px"  value="<?php echo $ean?>" readonly="readonly"></li>
				<li><label>Code Article :  </label><input type="text" name="art" size="10" style="width:60px"  value="<?php echo $article?>" readonly="readonly"></li>
				<li><label>Designation :  </label><input type="text" name="lib" style="width:200px" size="30" value="<?php echo $LIB?>"  readonly="readonly"></li>
				<li><label>Prix VT :  </label><input type="text" name="pxvt" style="width:100px" size="30" value="<?php echo $PXVT?>"  readonly="readonly"></li>
				<li><input type="hidden" name="user"  style="width:100px" size="50" value="<?php echo strtoupper($user) ?>"         readonly="readonly"></li><br />
				</ul>
				<tr><td style="border:0px;">
				<input type="submit" value="OK" id="OkBtn" title="enregistrer"/>
				<td style="border:0px;">
				
		
		</tr>
		</form>
		
			<?php
			
			
			}else{
		?>
		<ul>	<li>Aucun article pour le code-barres : <span style="font-weight:bold;color:red;text-decoration:blink" ><?php echo $motclef ?></span></li>
		<?php
		}
		}else{
		?>
			<li>Aucun article pour : <span style="font-weight:bold;color:red;text-decoration:blink" ><?php echo $motclef ?></span></li>
		<?php
		}
	
	}

?>
	</ul>
	</div>		
			
	
	</div>
							
</div>
</body>
</html>
<?php
}else { ?>
	  
		  <script Language="javascript">
document.location.href = "index.php";
//alert("redirecte");
</script>	  
	  
	  
	  
<?php }
	  ?>