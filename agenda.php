<!DOCTYPE html SYSTEM "http://localhost/netCFARegion/dtd/xhtml1-strict.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="fr" lang="fr">

<head>
  <meta http-equiv="content-type" content="text/html; charset=iso-8859-1"/>
  <meta http-equiv="content-script-type" content="text/javascript"/>
  <meta http-equiv="content-style-type" content="text/css"/>
  <meta http-equiv="content-language" content="fr"/>
  <title>Calendrier JS</title>
  <link rel="stylesheet" type="text/css" media="screen" href="css/calendar.css" />
  <script type="text/javascript" src="js/addEvent.js"></script>
  <script type="text/javascript" src="js/date.js"></script>
  <script src="js/calendar.js" type="text/javascript"></script>
  <script type="text/javascript">
    function loadCalendar() {
        
        var calHandler = {
            onSelect : function(date) {
                alert('Date sélectionnée');
                // Suite des traitements...
            }
        }
        
        // Surcharge les valeurs par défaut de l'objet. Toutes les valeurs sont optionnelles.
        var params = {
              //displayYearInitial : 1971,
              //displayMonthInitial : 9,
              // rangeYearLower : 2003,
              // rangeYearUpper : 2007,
              // startDay : 0,
              // showWeeks : false,
              // selCurMonthOnly : true,
              // displayFooter : false,
              // displayPanel : false,
              
              // Le positionnement en mode popup se fait automatiquement. Néanmoins, possibilité de forcer la position via les deux propriétés suivantes :
              // popupLeftPos : 0,
              // popupTopPos : 0,
              
              // les 2 propriétés ci-dessous vont de pair avec l'affichage du footer.
              // displayTodayLink : true,
              // displayCloseLink : false,
              // userHandler:calHandler
        }
        
        bas_cal = new calendar('epoch_basic', 'flat' , 'basic_container', params);
    	dp_cal  = new calendar('epoch_popup', 'popup', document.getElementById('popup_container'), params);
    }
    
    addEvent(window, 'load', loadCalendar, false);
    </script>
</head>

<body>

</body>
</html>