<?php
	if(!isset($_COOKIE["login"]))
{
    session_start();  
	if (!isset($_SESSION['login'])) { 
   header ('Location:index.php'); 
   exit();  
}

} 

include('connect.php'); 
if(isset($_GET['motclef'])AND !empty($_GET['motclef']))
{
	if(isset($_COOKIE["login"])){
				$user = $_COOKIE["login"];
			}
			else{
				$user = $_SESSION['login']; 
			}	
	$motclef = $_GET['motclef'];
	

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

$link1 = mysql_connect($host,$user1,$pass1)
  or die("Connection impossible user ou mot de passe incorecte");
mysql_select_db("$bdd", $link1)
  or die("Connection impossible a la base de données");
	
	
	 $order = "select   article_ean.id_article , article_ean.ean  , articles.nom_article, famille.id_rayon
					from  article_ean
					inner join articles on article_ean.id_article=articles.id_article
					inner join famille on  articles.id_famille=famille.id_famille
					where ean = '$motclef'";

		  
		  
	
	
	$result = mysql_query($order);  
	
	
	
		//$sql="select  article_ean.id_article , article_ean.ean  , articles.id_article from  article_ean";
		//$sql.="inner join articles on article_ean.id_article=articles.id_article";
		//$sql.="where ean LIKE'$motclef%'";
		
		//$result = mysql_query($sql) or die('Erreur SQL !'.$sql.''.mysql_error());
		//if($row = mysql_fetch_array($result))
		if ($result==true){
					if($donnee = mysql_fetch_row($result)){
			?>
			
			<li><label>Article : </label><input type="text" name="article" size="10" style="width:60px"  value="<?php echo $donnee[0]?>" readonly="readonly"></li>
			<li><label>Designation :  </label><input type="text" name="desig" style="width:225px" size="30" value="<?php echo $donnee[2]?>"  readonly="readonly"></li>
			<li><label>Vendeur :  </label><input type="text" name="r_vd" style="width:30px" size="5" value="<?php echo $donnee[3]?>"  readonly="readonly"></li>
			<li><label>Acheteur :  </label><select name="r_acht"  style="width:100px" required><option value="">Selectionner</option><?php while($data=mysql_fetch_assoc($req))
			{?><option value="<?php echo $data['num_r']?>"><?php echo $data['libelle_r'];}?></option></select></li>
		
			<li><label>Quantité :  </label><input type="float" name="qtite" style="width:50px" size="7" required></li>					
			
			
			<li><label>Utilisateur :  </label><input type="text" name="user"  style="width:100px" size="50" value="<?php echo strtoupper($user) ?>"   readonly="readonly"></li><br />
			<tr><td style="border:0px;">
			<input type="submit" value="OK" id="OkBtn" title="enregistrer"/>
			<td style="border:0px;">
			<input type="button" value="ANNULER" id="OkBtn" title="Annuler" onclick="location.href='accueil.php'"  /></td>
		
		</tr>
			<?php
			
		}
		}else{
		?>
			<li>Aucun article pour : <span style="font-weight:bold;color:red;text-decoration:blink" ><?php echo $motclef ?></span></li>
		<?php
		}
	}
?>