$(document).ready(function(){
	$("#recherche").keyup(function(){
	var recherche = $(this).val();
	var data='motclef=' + recherche;
	if(recherche.length>=1){
	$('#annulBtn').hide();
		$.ajax({
			url:"result.php",
			type : "GET",						
			data: data,
			success : function(server_response){
				$("#resultat ul").html(server_response).show();
		}
		});	
	
	}
});
});
