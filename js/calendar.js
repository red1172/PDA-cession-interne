/*****************************************************************************
 * Bas� sur le code original de Nick Baicoianu
 * http://www.javascriptkit.com/script/script2/epoch/index.shtml
 *****************************************************************************/

/**
 * Constructeur.
 * Fonctionne avec des dates au format fran�ais d/m/Y
 * 
 * 
 * Version
 *      - 1.3 : correction sur le positionnement forc� du mois : ne fonctionnait pas avec janvier (le code 0 �tait assimil� � la valeur false)
 *              correction du calcul sur le num�ro de la semaine en cours. Changement de la fonction getWeek() par getWeekIso
 *      - 1.2 : modification de l'�v�nement "click" sur triggerElt : gestion auto de l'affichage (voir/cacher) du calendrier.
 *      - 1.1 : ajout de la m�thode userHandler.beforeCall()
 *              ajout de la proprit�t� triggerElt
 * 
 * @version 1.3
 * @param string  name          nom unique utilis� pour la cr�ation de l'id du calendrier
 * @param string  mode          'flat' ou 'popup'
 * @param mixed   targetelement �l�ment cible (peut �tre soit l'objet, soit son ID)
 */
function calendar(name, mode, targetElement) {
    
    // V�rification des d�pendances
    if (typeof addEvent != "function") throw new Error('Calendar : librairie addEvent() introuvable.');
    if (!CST_YDATE_LIB)                throw new Error('Calendar : librairie date introuvable.');
    
    if (mode != 'flat' && mode != 'popup') {
        throw new Error('Calendar : propri�t� [mode] erron�e. Les valeurs possibles sont "flat" / "popup".')
    }
    
    // Les param�tres du calendrier peuvent �tre surcharg�s avec un 4�me param�tre optionnel.
    // Cf. calConfig().
    if (arguments.length == 4) {
        this.options = arguments[3];
    }
    
    // D�tection IE6 pour le bug sur les listes d�roulantes.
    re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
    
    if (re.exec(navigator.userAgent) != null) { 
      rv = parseInt( RegExp.$1 );
      
      this.isIE6 = (rv == 6) ? true : false;
    }
    else this.isIE6 = false;
                
    this.state   = 0;
    this.name    = name;
    this.mode    = mode;
    this.curDate = new Date();
    
    this.targetElement = (typeof targetElement == 'string') ? window.document.getElementById(targetElement) : this.targetElement = targetElement;
    
    if (!this.targetElement) {
        throw new Error('Calendar : propri�t� targetElement erron�e.');
    }
    
    this.selectedDates = new Array();
    this.calendar;
    
    // Les listes d�roulantes
    this.monthSelect;
    this.yearSelect;
    
    // Les principaux conteneurs
    this.caption;
    this.thead;
    this.tbody;
    this.tfooter;
    
    // Initialisations des propri�t�s
    this.mousein = false;
    this.calConfig();
    this.setDays();
    
    this.displayYear  = this.displayYearInitial;
    this.displayMonth = this.displayMonthInitial;
    userDate          = null;
    
    // En mode popup, ajout de la date de l'�l�ment cible au tableau des dates s�lectionn�es.
    if(this.mode == 'popup' && this.targetElement && this.targetElement.type == 'text' && this.targetElement.value != '') {
        
        userDate = this.getDateFrProperties(this.targetElement.value);
        
        this.selectedDates.push(new Date(userDate.year, (userDate.month-1), userDate.day));
    }
    
    // Cr�ation du calendrier DOM
    this.createCalendar();
    
    // Si la source est un champ de type "text" et le mode = popup.
    if (this.mode == 'popup' && this.targetElement && this.targetElement.type == 'text') {
        
        this.calendar.style.position = 'absolute';
        
        // positionnement du calendrier
        this.updatePos();
        
        document.body.appendChild(this.calendar);
        
        if (this.triggerElt === false) {
        
            // Ev�nements focus et blur sur le champ cible : afficher / cacher le calendrier.
            addEvent(this.targetElement, 'focus', this.show.bind(this), false);
            addEvent(this.targetElement, 'blur' , this.targetBlur.bind(this) , false);
        }
        else {
            addEvent(this.triggerElt, 'click', this.toggle.bind(this), false);
            addEvent(this.triggerElt, 'blur' , this.targetBlur.bind(this), false);
        }
        
        // Si valeur par d�faut => positionner sur le bon mois et la bonne ann�e.
        if (userDate) {
            this.goToMonth(userDate.year, (userDate.month-1));
        }
    }
    else {
        this.targetElement.appendChild(this.calendar);
    }
    
    // 0: initialisation, 1: cr�ation, 2: termin�
    this.state = 2;
    this.visible ? this.show() : this.hide();
}

calendar.prototype = {
    
    monthUp           : null,
    monthDn           : null,
    todaySelected     : null,
    calCells          : null,
    rows              : null,
    cols              : null,
    cells             : [],
    close             : null,
    options           : {},
    IE6SelectElement  : [], // Tableaux d'identifiant des �l�ments SELECT posant probl�me avec IE6 (pour pr�venir ce bug � la con : http://blogs.msdn.com/ie/archive/2006/01/17/514076.aspx)
    userHandler       : null,
    
    // Initialisation des variables du calendrier, g�re les param�tres par d�faut.
    calConfig : function () {
        
        // Ann�e initiale � prendre en compte au chargement.
        if (this.options.displayYearInitial) this.displayYearInitial = this.options.displayYearInitial;
        else                                 this.displayYearInitial = this.curDate.getFullYear();
        
        // Mois initial � prendre en compte au chargement (0-11)
        if (this.options.displayMonthInitial >= 0 && this.options.displayMonthInitial <12) this.displayMonthInitial = this.options.displayMonthInitial;
        else                                                                               this.displayMonthInitial = this.curDate.getMonth();
        
        // Ann�e Min.
        if (this.options.rangeYearLower) this.rangeYearLower = this.options.rangeYearLower;
        else                             this.rangeYearLower = this.displayYearInitial - 5;
        
        // Ann�e Max.
        if (this.options.rangeYearUpper) this.rangeYearUpper = this.options.rangeYearUpper;
        else                             this.rangeYearUpper = this.displayYearInitial + 5;
        
        // Cas particulier : le couple ann�e/mois initial n'est pas dans le rang pr�vu.
        if (this.displayYearInitial > this.rangeYearUpper || this.displayYearInitial < this.rangeYearLower) {
            this.displayYearInitial = this.rangeYearLower;
        }
        
        // Jour pris en compte comme le premier de la semaine : 0 (Dim) � 6 (Sam)
        if (this.options.startDay >= 0) this.startDay = this.options.startDay;
        else                            this.startDay = 1;
        
        // Afficher ou nom le num�ro de la semaine dans le calendrier
        this.showWeeks = !(this.options.showWeeks === false);
        
        // Restreint l'utilisateur � s�lectionner une date seulement dans le mois affich�
        this.selCurMonthOnly = !(this.options.selCurMonthOnly === false);
                
        // Affichage du footer
        this.displayFooter = !(this.options.displayFooter === false);
        
        // Affichage du caption
        this.displayPanel = !(this.options.displayPanel === false);
        
        // Lien du footer positionnant sur la date du jour
        this.displayTodayLink = (this.options.displayTodayLink === true);
        
        // Lien du footer permettant de fermer le calendrier
        this.displayCloseLink = !(this.options.displayCloseLink === false);
        
        // Force la position du calendrier en mode popup
        if (typeof this.options.popupLeftPos != 'undefined') this.popupLeftPos = parseInt(this.options.popupLeftPos);
        else                                                 this.popupLeftPos = -1;
        
        // El�ment d�clencheur diff�rent de l'�l�ment source.
        if (typeof this.options.triggerElt != 'undefined') this.triggerElt = this.options.triggerElt;
        else                                               this.triggerElt = false;
        
        if (typeof this.options.popupTopPos !== 'undefined') this.popupTopPos = parseInt(this.options.popupTopPos);
        else                                                 this.popupTopPos = -1;
        
        this.minDate = new Date(this.rangeYearLower, 0, 1);
        this.maxDate = new Date(this.rangeYearUpper, 0, 1);
        
        this.visible = (this.mode == 'flat');
            
        this.setLang();
    },
    
    
    // Positionne le calendrier � date pass�e en param�tre.
    // Permet �galement de faire un reset sur la propri�t� selectedDates si le param�tre est vide.
    setSelectedDate : function(date) {
        
        if (date == '') {
            this.selectedDates = new Array();
            this.reDraw();
            return false;
        }
        
        var userDate = this.getDateFrProperties(date);
        
        this.selectedDates[0] = new Date(userDate.year, (userDate.month-1), userDate.day);
        
        if (this.dateInRange(this.selectedDates[0])) {
            this.goToMonth(userDate.year, (userDate.month-1));
        }
        
        this.reDraw();
        
        userDate = null;
    },
    
    
    /**
     * Retourne [true] si la date pass�e en param�tre est contenue entre les ann�es min/max
     * sp�cifi� en param�tres � la classe.
     * Retourne [false] sinon.
     * 
     * @param  date object jsDateObj
     * @return boolean
     */
    dateInRange : function(jsDateObj) {
        
        var dateMin = new Date(this.rangeYearLower,  0, 1);
        var dateMax = new Date(this.rangeYearUpper, 11, 31);
        var compare = true;
        
        if ((jsDateObj < dateMin) || (jsDateObj > dateMax)) {
            compare = false;
        }
        
        dateMin = dateMax = null;
        
        return compare;
    },
    
    
    // D�coupe une date au format fran�ais d/m/Y au format JSON {day, month, year}.
    getDateFrProperties : function (dateFrValue) {
        var dateRE = new RegExp("([0-9]{1,2})\/([0-9]{1,2})\/([0-9]{4})");
        
        if (!dateRE.test(dateFrValue)) {
            throw new Error('Calendar : valeur date incorrecte [' + dateFrValue + ']');
        }
        
        match = dateRE.exec(dateFrValue);
        
        return  {
            day   : match[1],
            month : match[2],
            year  : match[3]
        }
    },
    
    
    // D�finition des param�tres pour la langue fran�aise.
    setLang : function() {
    
        this.daylist          = new Array('D', 'L', 'M', 'M', 'J', 'V', 'S', 'D', 'L', 'M', 'M', 'J', 'V', 'S');
        this.months_sh        = new Array('Janvier', 'F�vrier', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Ao�t', 'Septembre', 'Octobre', 'Novembre', 'D�cembre');
        this.monthup_title    = 'Mois suivant';
        this.monthdn_title    = 'Mois pr�c�dent';
        this.today_caption    = 'Aujourd\'hui';
        this.today_title      = '';
        this.close_caption    = 'Fermer';
        this.close_title      = 'Fermeture du calendrier';
        this.maxrange_caption = 'Valeur maximum atteinte.';
        this.minrange_caption = 'Valeur minimum atteinte.';
    },
   
    
    
    /** 
     * Retourne le fameux computedStyle 
     * 
     * @param   string  mixed       Objet html directement ou identifiant de l'�l�ment html
     * @param   string  sProperty   Propri�t� CSS dont on souhaite conna�tre la valeur
     * @return  mixed
     */
    getCSSProperty : function(mixed, sProperty) {
    
        var oNode = (typeof mixed == "object") ?  mixed : document.getElementById(mixed);
    
        if (document.defaultView) {
            return document.defaultView.getComputedStyle(oNode, null).getPropertyValue(sProperty);
        }
        else if (oNode.currentStyle) {
            sProperty = sProperty.replace(/\-(\w)/g, function(m,c){return c.toUpperCase();});
            return oNode.currentStyle[sProperty];
        }
        else {
            return null;
        }
    },
         
    
    
    /**
     * Retourne les coordonn�es d'un �l�ment pour Internet Explorer.
     * 
     * @param   object elt
     * @return  json   coords = {left:x, top:x}
     */
    ieGetCoords : function(elt) {
        var coords = {y:0,x:0};
        
        coords.y = elt.getBoundingClientRect().top;
        coords.x = elt.getBoundingClientRect().left;
        
        var border = this.getCSSProperty(document.getElementsByTagName('HTML')[0], 'border-width');
        var border = (border == 'medium') ? 2 : parseInt(border);
        
        if (isNaN(border)) {
            border = 0;
        }
        
        coords.x += Math.max(elt.ownerDocument.documentElement.scrollLeft, elt.ownerDocument.body.scrollLeft) - border;
        coords.y += Math.max(elt.ownerDocument.documentElement.scrollTop, elt.ownerDocument.body.scrollTop) - border;
        
        return coords;
    },
    
    
    
    
    /** 
     * Retourne les coordonn�es d'un �l�ment sur une page en fonction de tous ses �l�ments parents
     * 
     * @param objet element
     */
    getElementCoords : function(element) {
        
        var coords = {x: 0, y: 0};
    
        // IE pour r�soudre le probl�me des marges (IE comptabilise dans offsetLeft la propri�t� marginLeft).
        if (element.getBoundingClientRect) {
            coords = this.ieGetCoords(element);
        }
        // Les autres : r�cursivit� sur offsetParent.
        else {
            
            while (element) {
                
                if (/^table$/i.test(element.tagName) && element.getElementsByTagName('CAPTION').length == 1 && getCSSProperty(element, 'position').toLowerCase() == 'relative') {
                    coords.y += element.getElementsByTagName('CAPTION')[0].offsetHeight;
                }
                
                coords.x += element.offsetLeft;
                coords.y  += element.offsetTop;
                element      = element.offsetParent;
            }
        }
        
        return coords;
    },
    
    
    // Ev�nement "blur" de la cible.
    targetBlur : function() {
        
        if (!this.mousein) {
            this.hide();
        }
    },
    
    
    // Affiche le calendrier
    show : function () {
        
        if ((this.options.userHandler != null) && (typeof this.options.userHandler.beforeCall == "function")) {
            if (this.options.userHandler.beforeCall(this) === false) {
                return false;
            }
        }
        
        this.ieSelectEltHandler('hidden');
        
        // Valeur 'table' non interpr�t�e par IE.
        try {
            this.calendar.style.display = 'table';
        } catch (e) {
            this.calendar.style.display = 'block';
        }
        
        this.visible = true;
    },
    
    
    // Cache le calendrier
    hide : function () {
        this.ieSelectEltHandler('visible');
        this.calendar.style.display = 'none';
        this.visible = false;
    },
    
    
    // Bascule montrer/cacher suivant la propri�t� bool�enne 'visible'.
    toggle : function () {
        if (this.visible) this.hide();
        else              this.show();
    },
    
    
    // Initialisation des param�tres du calendrier suivant le standard Gregorien
    setDays : function () {
    
        this.daynames = new Array();
        var j = 0;
        
        for(var i=this.startDay; i< this.startDay + 7;i++) {
            this.daynames[j++] = this.daylist[i];
        }
            
        this.monthDayCount = new Array(31, ((this.curDate.getFullYear() - 2000) % 4 ? 28 : 29), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
    },
    
    
    // Permet d'annuler un �v�nement. Cf. librairie addEvent().
    cancelTextSelection : function (e) {
        stopEvent(e);
    },
    
    
    // Cr�ation DOM du calendrier
    createCalendar : function () {
    
        this.calendar = document.createElement('table');
        this.calendar.setAttribute('cellspacing', 0);
        this.calendar.setAttribute('cellpadding', 0);
        this.calendar.setAttribute('id', this.getBaseId());
        
        this.calendar.className = 'calendar';
        
        // Annule la s�lection de texte lors d'un click sur une date
        addEvent(this.calendar, 'selectstart', this.cancelTextSelection, false);
        addEvent(this.calendar, 'drag'       , this.cancelTextSelection, false);
                
        // Cr�ation de la barre de titre
        if (this.displayPanel) {
            this.caption    = document.createElement('caption');
            this.caption.id = this.setId('caption');
            this.createMainHeading();
        }
            
        // Cr�ation de l'ent�te (nom des jours forme abreg�e)
        this.thead    = document.createElement('thead');
        this.thead.id = this.setId('thead');
        this.createDayHeading();
        
        // Cr�ation des cellules des jours
        this.tbody    = document.createElement('tbody');
        this.tbody.id = this.setId('body');
        this.createCalCells();
        
        // Cr�ation du footer
        if (this.displayFooter) {
            this.tfooter    = document.createElement('tfoot');
            this.tfooter.id = this.setId('footer');
            this.createFooter();
        }
        
        // Assemble tous les �l�ments dans le tableau principal
        if (this.displayPanel) {
            this.calendar.appendChild(this.caption);
        }
        
        this.calendar.appendChild(this.thead);
        this.calendar.appendChild(this.tbody);
        
        if (this.displayFooter) {
            this.calendar.appendChild(this.tfooter);
        }
    
        // Gestion des �v�nements li�s � la souris
        addEvent(this.calendar, 'mouseover', this.mouseOver.bind(this), false);
        addEvent(this.calendar, 'mouseout' , this.mouseOut.bind(this) , false);
    },
    
    
    // Gestion de la propri�t� mousein sur �v�nement onMouseOver
    mouseOver : function() {
        this.mousein = true;
    },
    
    
    // Gestion de la propri�t� mousein sur �v�nement onMouseOut
    mouseOut : function(e) {
        this.mousein = false;
    },
    
    
    // Retourne l'identifiant unique du calendrier
    getBaseId : function() {
        return this.name + '_calendar';
    },
    
    
    // M�thode facilitant la cr�ation d'un identifiant unique pour un �l�ment du calendrier.
    setId : function(complement) {
        return this.getBaseId() + '_' + complement;
    },
    
    
    // Cr�ation du caption du tableau (s�lection mois & ann�e)
    createMainHeading : function () {
    
        // Cr�ation d'un �l�ment conteneur pour un placement ais� dans le caption via les CSS
        divContainer = document.createElement('div');
        
        // Cr�ation des �l�ments fils
        this.monthSelect = document.createElement('select');
        this.yearSelect  = document.createElement('select');
        this.monthDn     = document.createElement('a');
        this.monthUp     = document.createElement('a');
        
        var opt, i;
        
        // Alimentation de la liste des mois
        for(i=0; i<12; i++) {
            opt = document.createElement('option');
            opt.setAttribute('value', i);
            
            if(this.state == 0 && this.displayMonth == i) {
                opt.setAttribute('selected','selected');
            }
            
            opt.appendChild(document.createTextNode(this.months_sh[i]));
            this.monthSelect.appendChild(opt);
        }
        
        // Alimentation de la liste des ann�es
        for(i=this.rangeYearLower; i<=this.rangeYearUpper; i++) {
            
            opt = document.createElement('option');
            opt.setAttribute('value',i);
            
            if(this.state == 0 && this.displayYear == i) {
                opt.setAttribute('selected','selected');
            }
            
            opt.appendChild(document.createTextNode(i));
            this.yearSelect.appendChild(opt);        
        }
        
        this.monthSelect.className = 'monthSelect';
        this.yearSelect.className  = 'yearSelect';
        
        // Boutons mois suivant / pr�c�dent
        this.monthUp.setAttribute('href' , 'javascript:void(0)');
        this.monthUp.setAttribute('title', this.monthup_title);
        this.monthUp.className = 'monthUp';
        
        this.monthDn.setAttribute('href' , 'javascript:void(0)');
        this.monthDn.setAttribute('title', this.monthdn_title);
        this.monthDn.className = 'monthDn';
        
        // Ev�nements sur les contr�leurs
        addEvent(this.monthUp    , 'click' , this.nextMonth.bind(this)     , false);
        addEvent(this.monthDn    , 'click' , this.prevMonth.bind(this)     , false);
        addEvent(this.monthSelect, 'change', this.controlsChange.bind(this), false);
        addEvent(this.yearSelect , 'change', this.controlsChange.bind(this), false);
        
        // Ajout des �l�ments � la balise caption
        divContainer.appendChild(this.monthDn);
        divContainer.appendChild(this.monthUp);
        divContainer.appendChild(this.monthSelect);
        divContainer.appendChild(this.yearSelect);
        
        this.caption.appendChild(divContainer);
    },
    
    
    // Gestion de l'�v�nement onchange des listes d�roulantes mois/ann�e.
    controlsChange : function() {
        this.displayMonth = this.monthSelect.value;
        this.displayYear  = this.yearSelect.value; 
        
        this.goToMonth(this.displayYear, this.displayMonth);
    },
    
    
    // Alimente le contenu de l'�l�ment tfoot du calendrier
    createFooter : function () {
    
        tr         = document.createElement('tr');
        td         = document.createElement('td');
        td.colSpan = this.thead.getElementsByTagName('th').length;
        
        // Lien "aujourd'hui"
        if (this.displayTodayLink) {
            this.todaySelected = document.createElement('a');
            this.todaySelected.href = 'javascript:void(0)';
            this.todaySelected.appendChild(document.createTextNode(this.today_caption));
            this.todaySelected.setAttribute('title', this.today_title);
            addEvent(this.todaySelected, 'click', this.goToday.bind(this), false);
            td.appendChild(this.todaySelected);
        }
        
        // Lien "fermer"
        if (this.displayCloseLink) {
            this.close = document.createElement('a');
            this.close.href = 'javascript:void(0)';
            this.close.appendChild(document.createTextNode(this.close_caption));
            this.close.setAttribute('title', this.close_title);
            addEvent(this.close, 'click', this.hide.bind(this), false);
            td.appendChild(this.close);
        }
        
        if (!this.displayCloseLink && !this.displayTodayLink) {
            td.innerHTML = '&nbsp;';
        }
        
        tr.appendChild(td);
        this.tfooter.appendChild(tr);
    },
    
    
    // Reset du calendrier aux valeurs par d�faut
    goToday : function () {
        this.selectedDates[0] = this.curDate;
        
        this.goToMonth(this.displayYearInitial, this.displayMonthInitial);
        this.reDraw();
    },
    
    
    // Cr�ation de l'ent�te contenant le nom des jours
    createDayHeading : function () {
    
        tr        = document.createElement('tr');
        this.cols = new Array(false, false, false, false, false, false, false);
        
        // Si le num�ro de semaine est souhait�, cr�ation d'une cellule vide dans l'ent�te pour compenser
        // le nombre de cellules pr�sente dans le tbody.
        if(this.showWeeks) {
            td           = document.createElement('th');
            td.className = 'wkhead';
            td.innerHTML = '&nbsp;';
            tr.appendChild(td);
        }
        
        // Cr�ation des cellules.
        for(var dow=0; dow<7; dow++) {
            
            th = document.createElement('th');
            th.appendChild(document.createTextNode(this.daynames[dow]));
            tr.appendChild(th);
        }
        
        this.thead.appendChild(tr);
    },
    
    
    // Cr�ation des cellules du tbody
    createCalCells : function () {
    
        this.rows  = new Array(false, false, false, false, false, false);
        this.cells = new Array();
        
        var row        = -1;
        var totalCells = (this.showWeeks ? 48 : 42);
        var beginDate  = new Date(this.displayYear, this.displayMonth, 1);
        var endDate    = new Date(this.displayYear, this.displayMonth, this.monthDayCount[this.displayMonth]);
        var sdt        = new Date(beginDate);
        
        sdt.setDate(sdt.getDate() + (this.startDay - beginDate.getDay()) - (this.startDay - beginDate.getDay() > 0 ? 7 : 0) );
        
        this.calCells = document.createElement('tr');
        
        for (var i=0;i<totalCells;i++) {
            
            // Avec les num�ros de semaines
            if (this.showWeeks) {
                
                if (i % 8 == 0) {
                    
                    row++;
                    
                    tr = document.createElement('tr');
                    td = document.createElement('th');
                    td.className = 'wkhead';
                    td.appendChild(document.createTextNode(sdt.getWeek()));
                    
                    tr.appendChild(td);
                    i++;
                }
            }
            // sinon, nouvelle ligne toute les 7 cellules
            else if(i % 7 == 0) {
                row++;
                tr = document.createElement('tr');
            }
            
            // Cr�ation des cellules "jours"
            td = document.createElement('td');
            td.appendChild(document.createTextNode(sdt.getDate()));
            
            this.cells.push(
                new CalCell(this, td, sdt, row)
            );
            
            td.cellObj = this.cells[this.cells.length-1];
            
            // Incr�mente la date
            sdt.setDate(sdt.getDate() + 1);
            tr.appendChild(td);
            this.tbody.appendChild(tr);
        }
        
        this.reDraw();
    },
    
    
    // Applique les classes CSS aux cellules du calendrier suivant leur �tat.
    reDraw : function () {
        
        this.state = 1;
        var i, j;
        
        for (i=0; i<this.cells.length; i++) {
            
            this.cells[i].selected = false;
            
            // Si la date en cours est pr�sente dans le tableau "selectedDates", sa propri�t� "selected" est positionn� � true.
            for(j=0; j<this.selectedDates.length; j++) {
                
                if(this.cells[i].date.getUeDay() == this.selectedDates[j].getUeDay() ) {
                    this.cells[i].selected = true;
                }
            }
    
            this.cells[i].setClass();
        }
        
        this.state = 2;
    },
    
    
    // Supprime toutes les lignes contenu dans l'�l�ment tbody
    deleteCells : function () {
        
        var nbRow = this.tbody.rows.length;
        
        for (i=0; i<nbRow; i++) {
            this.tbody.deleteRow(0);
        }
        
        this.cells = new Array();
    },
    
    
    // Positionne le calendrier suivant le mois et l'ann�e pass�e en param�tre.
    goToMonth : function (year,month) {
        this.displayMonth = month;
        this.displayYear  = year;
        
        // N'existe que si la propri�t� displayPanel = true.
        if (this.monthSelect && this.yearSelect) {
            this.yearSelect.value  = year;
            this.monthSelect.value = month;
        }
        
        this.refresh();
    },
    
    
    // Va au mois suivant. Si le mois est d�cembre, va au mois de janvier de l'ann�e suivante
    nextMonth : function (){
    
        // Incr�mente les valeurs mois/ann�e, en v�rifiant qu'elles soient comprises dans le rang min/max
        if(this.monthSelect.value < 11) {
            this.monthSelect.value++;
        }
        else {
            
            if(this.yearSelect.value < this.rangeYearUpper) {
                this.monthSelect.value = 0;
                this.yearSelect.value++;
            }
            else {
                alert(this.maxrange_caption);
            }
        }
        
        // Assigne les valeurs d'affichage mois/ann�e
        this.displayMonth = this.monthSelect.value;
        this.displayYear  = this.yearSelect.value;
        
        this.refresh();
    },
    
    
    // Va au mois pr�c�dent. Si le mois est janvier, va au mois de d�cembre de l'ann�e pr�c�dente december of the previous year
    prevMonth : function () {
    
        //increment the month/year values, provided they're within the min/max ranges
        if(this.monthSelect.value > 0) {
            this.monthSelect.value--;
        }
        else {
            
            if(this.yearSelect.value > this.rangeYearLower) {
                this.monthSelect.value = 11;
                this.yearSelect.value--;
            }
            else {
                alert(this.minrange_caption);
            }
        }
        
        this.displayMonth = this.monthSelect.value;
        this.displayYear  = this.yearSelect.value;
        
        this.refresh();
    },
    
    
    // Recharge les jours du calendrier
    refresh : function() {
        this.deleteCells();
        this.createCalCells();
    },
    
    
    // Formate vNumber pour toujours obtenir 2 chiffres en ajoutant un z�ro non significatif.
    addZero : function (vNumber) {
        return ((vNumber < 10) ? '0' : '') + vNumber;
    },
    
    
    // Positionne le calendrier en dessous de la cible source (mode popup seulement).
    updatePos : function () {
        
        coords = this.getElementCoords(this.targetElement);
        
        if (this.popupLeftPos != -1) this.calendar.style.left = this.popupLeftPos + 'px';
        else                             this.calendar.style.left = (coords.x) + 'px';
        
        if (this.popupTopPos != -1) this.calendar.style.top = this.popupTopPos + 'px';
        else                        this.calendar.style.top = (coords.y + this.targetElement.offsetHeight)  + 'px';
        
        coords = null;
    },
    
    
    /**
     * Un putain de sale bug avec les versions IE6 font que les listes d�roulantes
     * <SELECT> sont affich�es par dessus les suggestions, et ce quelle que soit
     * la valeur de la propri�t� CSS z-index.
     * Apr�s avoir essay� de nombreuses m�thodes (notamment celle avec les iframes), 
     * la solution la plus efficace et la plus rapide reste de demander � l'utilisateur 
     * de sp�cifier via la propri�t� [IE6SelectElement] la liste des identifiants des 
     * balises afin de les cacher/montrer si le navigateur utilis� est IE6.
     * 
     * @param string visibleProp "hidden"||"visible"
     * @see show(), hide()
     */
    ieSelectEltHandler : function(visibleProp) {
        
        if (!this.isIE6)
            return false;
        
        for (i = 0; i<this.IE6SelectElement.length; i++) {
            if (elt = window.document.getElementById(this.IE6SelectElement[i]))
                elt.style.visibility = visibleProp;
        }
        
    }
}



/**
 * Constructeur
 * 
 * @param owner     object calendar
 * @param tableCell object TD       R�f�r�nce � la cellule du tableau du calendrier
 * @param dateObj  
 * @param row
 */
function CalCell(owner, tableCell, dateObj, row) {
    
    this.owner     = owner;
    this.tableCell = tableCell;
    this.cellClass; // Classe CSS de la cellule
   
    this.selected  = false; // Est-ce que la cellule est s�lectionn�e (l'utilisateur a cliqu� sur une cellule ou date s�lectionn�e par d�faut)
    this.date      = new Date(dateObj);
    this.dayOfWeek = this.date.getDay();
    this.week      = this.date.getWeek();
    this.tableRow  = row;
    
    // Assignation des gestionnaires d'�v�nements d'une cellule
    this.tableCell.onclick     = this.onclick;
    this.tableCell.onmouseover = this.onmouseover;
    this.tableCell.onmouseout  = this.onmouseout;
    
    // Affecte la classe CSS d'une cellule suivant son �tat
    this.setClass();
}

CalCell.prototype = {
    
    // Effet CSS :hover
    onmouseover : function () {
        this.className = this.cellClass + ' hover'
    },
    
    
    // Effet CSS :out
    onmouseout : function () {
        this.cellObj.setClass();
    },
    
    
    onclick : function () {
    
        var cell  = this.cellObj;
        var owner = cell.owner;
        
        if (!owner.selCurMonthOnly || cell.date.getMonth() == owner.displayMonth && cell.date.getFullYear() == owner.displayYear) {
            
            owner.selectedDates = new Array(cell.date);
            
            // Si une cible existe, un click ram�ne la valeur et cache le calendrier
            if (owner.targetElement) {
                
                owner.targetElement.value = owner.selectedDates[0].dateFormat();
                
                if (owner.mode == 'popup') {
                    owner.hide();
                }
                
                // Lance la fonction de l'utilisateur userHandler.onSelect() avec la date s�lectionn�e en param�tre.
                if ((owner.options.userHandler != null) && (typeof owner.options.userHandler.onSelect == "function")) {
                    owner.options.userHandler.onSelect(owner.targetElement.value);
                }
            }
            
            // Applique les changements.
            owner.reDraw();
        }
    },
    
    
    // Affecte la classe CSS � la cellule suivant le crit�re sp�cifi�.
    setClass : function () {
    
             if (this.selected)                                    this.cellClass = 'cell_selected';
        else if (this.owner.displayMonth != this.date.getMonth() ) this.cellClass = 'notmnth';
        else if (this.date.getDay() > 0 && this.date.getDay() < 6) this.cellClass = 'wkday';
        else                                                       this.cellClass = 'wkend';
        
        if(this.date.getFullYear() == this.owner.curDate.getFullYear() && this.date.getMonth() == this.owner.curDate.getMonth() && this.date.getDate() == this.owner.curDate.getDate()) {
            this.cellClass = this.cellClass + ' curdate';
        }
    
        this.tableCell.className = this.cellClass;
    }
}