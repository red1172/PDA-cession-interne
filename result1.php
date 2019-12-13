<?php

include('connect.php'); 
if(isset($_GET['motclef'])AND !empty($_GET['motclef']))
{

	$motclef = $_GET['motclef'];
	$result=mysql_query("SELECT * FROM ardis WHERE  ean LIKE '$motclef%'");
		$row=mysql_num_rows($result);
		if($row==true)
		{
			while($rows=mysql_fetch_assoc($result))
			{
			?>
			<td><input type="text" name="article" size=30 value="<?php echo $rows['article']?>"></td><td><input type="text" name="desig" size=30 value="<?php echo $rows['libelle']?>"></td>
			<td><input type="text" name="vendeur" size=6 value="<?php echo $rows['rayon']?>"></td><td><select name="acheteur" ><option value="">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Selectionner</option><option value="boulPat">Boulangerie/Patisserie</option><option value="CharTrai">Charcuterie/Traiteur</option></select></td>
			<td><input type="float" name="qtite" size=6 ></td><td><input type="text" name="oper" value=""></td><td><input type="text" name="date" ></td><td><input type="text" name="user" value="" ></td>
			<?php
			}
	
		}else {
		?>
			Aucun resultat pour :<?php echo $motclef ?></td>
		<?php	
		}
}
?>