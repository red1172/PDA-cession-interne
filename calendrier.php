<?php
/*
Pour Utilisation du calendrier il suffit de mettre dans la page concernée
include "./calendrier.php";
et mettre aux inputs consernés l'attribut onclick suivant:
    onclick="javascript:affcalendrier(this);"
*/
?>
<style>
.calendrier
{
  position: absolute;
  z-index: 20;
  width:75px;
  height:50px;
  display:none;
  background: #99FF66;
}

</style>
<?php
function moisFr($mois,$annee)
{
$affmois=date("M",mktime(0,0,0,$mois,1,$annee));
  switch($affmois)
  {
  case "Feb": return " Fev ";break;
  case "Apr": return " Avr ";break;
  case "May": return " Mai ";break;
  case "Jun": return " Juin ";break;
  case "Jul": return " Juil ";break;
  case "Aug": return " Aout ";break;
  default : return $affmois;break;
  }

}

$nbmois=12; //on ne va afficher que 12mois(periode scolaire  max
$mois=date("m");
$annee=date("Y");
echo "<script> var mois=".intval($mois).";</script>";
$lmois=array();
$lannee=array();
for($i=0;$i<$nbmois;$i++)
{
  $lmois[]=$mois + $i;
  $moisC=($mois + $i)%13;
  if($moisC==0)
  {
     $lmois[strlen($lmois) - 1]=1;
     $moisC=1;
     $annee++;
  }
  $lannee[]=$annee;
  echo "<div id='calen".$moisC."' class='calendrier' >";
  echo "<select name='lmois' onchange='javascript:changecalendrier(this);' >";
  for($s=0;$s<12;$s++)
  {
    $option=$mois + $s;
    $optionannee=$annee;
    if($option>12)
    {
        $option=$option - 12;
        $optionannee=$annee + 1;
    }
    if($option==$moisC)
    {
        echo "<option value=".$option." selected='selected'>".moisFr($option,$optionannee)."</option>";
    }
    else
    {
        echo "<option value=".$option." >".moisFr($option,$optionannee)."</option>";
    }
  }
  echo "</select>".$annee;
  ?>
  <table border='2px' >
  <tr>
  <td>Lun</td>
  <td>Mar</td>
  <td>Mer</td>
  <td>Jeu</td>
  <td>Ven</td>
  <td>Sam</td>
  <td>Dim</td>
  </tr>
  <?php
  $nbjour=date("t",mktime(0,0,0,$moisC,1,$annee));
  for($jour=1;$jour<=$nbjour;$jour++)
  {
    $statue=date("w",mktime(0,0,0,$moisC,$jour,$annee));
    if($jour==1)
    {
       $NCZ=($statue + 6)%7;//nombre de colonne zappé a partir de la gauche
       if($NCZ!=0)
        {
            echo "<tr><td>";
            for($k=0;$k<($NCZ - 1);$k++)
                echo "</td><td>";
        }
    }
    if($statue==1)
    {
    echo "<tr><td>";
    }
    else
        {
            echo "</td><td>";
        }

    $journee=date("Y-m-d",mktime(0,0,0,$moisC,$jour,$annee));
    ?>
    <a href="javascript:affecte('<?= $journee ?>');" ><?= $jour ?></a>
    <?php
        if($statue==0)
            echo "</td></tr>";

    $NCZ=(7 - $statue)%7;//nombre de colonne zappé a partir de la droite
       if($statue!=0&&$jour==$nbjour)
        {

            for($k=0;$k<$NCZ;$k++)
                echo "</td><td>";

            echo "</td></tr>";
        }
  }

echo "</table></div>";
}
?>

<script  type="text/javascript" >
var courant;
function affcalendrier(input)
{
    var Y = input.eventY;
    var X = input.eventX;
    for(var i=1;i<13;i++)
    {

        if(document.getElementById)
            document.getElementById("calen" + i).style.display="none";
        else
            document.all["calen" + i].style.display="none";
    }
        if(document.getElementById)
            var calendrierC=document.getElementById("calen" + mois);
        else
            var calendrierC=document.all["calen" + mois];
    calendrierC.style.position.left=X;
    calendrierC.style.position.top=Y;
    calendrierC.style.display="block";
    courant=input;
}
function changecalendrier(valeur)
{
   var MoisC=valeur.value;
    var Y = courant.eventY;
    var X = courant.eventX;
    for(var i=1;i<13;i++)
    {

        if(document.getElementById)
            document.getElementById("calen" + i).style.display="none";
        else
            document.all["calen" + i].style.display="none";
    }
        if(document.getElementById)
        {
            var calendrierC=document.getElementById("calen" + MoisC);
        }
        else
        {
            var calendrierC=document.all["calen" + MoisC];
        }
    calendrierC.style.position.left=X;
    calendrierC.style.position.top=Y;
    calendrierC.style.display="block";
    for(var i=0;i<12;i++)
        document.getElementsByName("lmois")[i].value=MoisC;

}
function affecte(journee)
{
        if(document.getElementsByName)
            var input=document.getElementsByName(courant.name);
        else
            var input=document.all[courant.name];

        courant.value=journee;
    for(var i=1;i<13;i++)
    {

        if(document.getElementById)
            document.getElementById("calen" + i).style.display="none";
        else
            document.all["calen" + i].style.display="none";
    }
    for(var i=0;i<12;i++)
        document.getElementsByName("lmois")[i].value=mois;
}
</script>