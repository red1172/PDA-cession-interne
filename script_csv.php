<?php
header("Content-type: application/vnd.ms-excel");
header("Content-disposition: csv" . date("Y-m-d") . ".csv");
header( "Content-disposition: filename=NOMQUE VOUS SOUHAITEZ DONNER.csv ou .xls");</pre>
include "config.php"; // gere les login et pass de la BDD
include "data_fn.php";
 
$link=database_connect($db); // on se connecte à la base de donnée grâce à data_fn.php
 
$table = 'users'; /* Remplacez par le nom de votre table à exporter ! */
$file = 'export';
$result = mysql_query("SHOW COLUMNS FROM ".$table."");
$i = 0;
if (mysql_num_rows($result) > 0)
{
while ($row = mysql_fetch_assoc($result))
{
$csv_output .= $row['Field']."; ";
$i++;
}
}
 
$csv_output .= "\n";
 
$values = mysql_query("SELECT * FROM ".$table."");
while ($rowr = mysql_fetch_row($values))
{
for ($j=0;$j<$i;$j++)
{
$csv_output .= $rowr[$j]."; ";
}
$csv_output .= "\n";
}
 
$filename = $file."_".date("Y-m-d_H-i",time());
 
print $csv_output;
exit;
?>