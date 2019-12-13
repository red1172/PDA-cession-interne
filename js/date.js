// Constante permettant de tester le chargement du fichier dans les objets dépendants.
var CST_YDATE_LIB = 'true';

/*****************************************************************************/
/********************** EXTENSION OBJET NATIF DATE    ************************/
/*****************************************************************************/

// returns the day of the year for this date
Date.prototype.getDayOfYear = function () {
    return parseInt((this.getTime() - new Date(this.getFullYear(),0,1).getTime())/86400000 + 1);
};

//-----------------------------------------------------------------------------
// returns the day of the year for this date
Date.prototype.getWeek = function () {
    return parseInt((this.getTime() - new Date(this.getFullYear(),0,1).getTime())/604800000 + 1);
};


Date.prototype.addDay = function(nbDay) {
    
    // Conversion des jours en millisecondes ajouté au timestamp actuel pour obtenir une date modifiée
    var tmp = new Date(((Date.parse(this)) + nbDay * 24 * 60 * 60 * 1000));
    
    // Dont nous nous servons pour recoder la date actuelle
    this.setDate(tmp.getDate());
    this.setFullYear(tmp.getFullYear());
    this.setHours(tmp.getHours());
    this.setMinutes(tmp.getMinutes());
    this.setMonth(tmp.getMonth());
    this.setSeconds(tmp.getSeconds());
    this.setTime(tmp.getTime());
    
    tmp = null;
}

/**
 * Adaptation de la fonction DefWeekNum() trouvée ici : http://maliphane.free.fr/Informatique/Calendrier_jour_semaine.htm
 * 
 * Première semaine de l'année commence le premier janvier
 */
Date.prototype.getWeek = function () {
    
    var numd = 0;
    var numw = 0;
    
    var tmp = new Date(Date.parse(this));
        
    // Se positionner sur le dimanche
    while (tmp.getDay() != 0) {
        tmp.addDay(1);
    }
    
    var monthDayCount = new Array(31, ((tmp.getFullYear() - 2000) % 4 ? 28 : 29), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
    
    for (i=0; i < tmp.getMonth(); i++) {
        numd += monthDayCount[i];
    }
    
    var firstDay = new Date(tmp.getFullYear(), 0, 1).getDay();
    
    numd = numd + tmp.getDate() - (9 - firstDay);
    numw = Math.floor(numd / 7) + 2;
    
    if (firstDay == 0) {
        numw++;
    }
    
    tmp = null;
    firstday = null;
    
    return numw;
}

//-----------------------------------------------------------------------------
// returns the number of DAYS since the UNIX Epoch - good for comparing the date portion
Date.prototype.getUeDay = function () {
    return parseInt(Math.floor((this.getTime() - this.getTimezoneOffset() * 60000)/86400000)); //must take into account the local timezone
};

//-----------------------------------------------------------------------------
Date.prototype.dateFormat = function(format) {
    
    // Format de date par défaut à utiliser
    if(!format) { 
        format = 'Y/m/d';
    }
    
    LZ = function(x) {return(x < 0 || x > 9 ? '' : '0') + x};
    
    var MONTH_NAMES = new Array(
        'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
        'Jan'    , 'Fév'    , 'Mar' , 'Avr'  , 'Mai', 'Juin', 'Juil'   , 'Août', 'Sept'     , 'Oct'    , 'Nov'     , 'Déc'
    );
    
    var DAY_NAMES = new Array(
        'Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi','Samedi',
        'Dim'     , 'Lun'  , 'Mar'  , 'Mer'     , 'Jeu'  , 'Ven'     ,'Sam'
    );
    
    format = format + "";
    var result   = "";
    var i_format = 0;
    var c        = "";
    var token    = "";
    
    var y = this.getFullYear().toString();
    var M = this.getMonth()+1;
    var d = this.getDate();
    var E = this.getDay();
    var H = this.getHours();
    var m = this.getMinutes();
    var s = this.getSeconds();
    
    var yyyy, yy, MMM, MM, dd, hh, h, mm, ss, ampm, HH, H, KK, K, kk, k;
    
    // Convert real this parts into formatted versions
    var value = new Object();
    
    // if (y.length < 4) {y=''+(y-0+1900);}
    value['Y'] = y.toString();
    value['y'] = y.substring(2);
    value['n'] = M;
    value['m'] = LZ(M);
    value['F'] = MONTH_NAMES[M-1];
    value['M'] = MONTH_NAMES[M+11];
    value['j'] = d;
    value['d'] = LZ(d);
    value['D'] = DAY_NAMES[E+7];
    value['l'] = DAY_NAMES[E];
    value['G'] = H;
    value['H'] = LZ(H);
    
         if (H == 0) value['g'] = 12;
    else if (H > 12) value['g'] = H-12;
    else             value['g'] = H;
    
    value['h'] = LZ(value['g']);
    
    if (H > 11) {value['a']='pm'; value['A'] = 'PM';}
    else        {value['a']='am'; value['A'] = 'AM';}
    
    value['i'] = LZ(m);
    value['s'] = LZ(s);
    
    //construct the result string
    while (i_format < format.length) {
        
        c     = format.charAt(i_format);
        token = "";
        
        while ((format.charAt(i_format)==c) && (i_format < format.length)) {
            token += format.charAt(i_format++);
        }
        
        if (value[token] != null) result = result + value[token];
        else                      result = result + token;
    }
    
    return result;
};
