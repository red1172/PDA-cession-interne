/*****************************************************************************
 * Basé sur le code original de Nick Baicoianu
 * http://www.javascriptkit.com/script/script2/epoch/index.shtml
 *****************************************************************************/

/**
 * Constructeur.
 * Fonctionne avec des dates au format français d/m/Y
 * 
 * 
 * Version
 *      - 1.3 : correction sur le positionnement forcé du mois : ne fonctionnait pas avec janvier (le code 0 était assimilé à la valeur false)
 *              correction du calcul sur le numéro de la semaine en cours. Changement de la fonction getWeek() par getWeekIso
 *      - 1.2 : modification de l'évènement "click" sur triggerElt : gestion auto de l'affichage (voir/cacher) du calendrier.
 *      - 1.1 : ajout de la méthode userHandler.beforeCall()
 *              ajout de la propritété triggerElt
 * 
 * @version 1.3
 * @param string  name          nom unique utilisé pour la création de l'id du calendrier
 * @param string  mode          'flat' ou 'popup'
 * @param mixed   targetelement élément cible (peut être soit l'objet, soit son ID)
 */
function calendar(name, mode, targetElement) {
    
    // Vérification des dépendances
    if (typeof addEvent != "function") throw new Error('Calendar : librairie addEvent() introuvable.');
    if (!CST_YDATE_LIB)                throw new Error('Calendar : librairie date introuvable.');
    
    if (mode != 'flat' && mode != 'popup') {
        throw new Error('Calendar : propriété [mode] erronée. Les valeurs possibles sont "flat" / "popup".')
    }
    
    // Les paramètres du calendrier peuvent être surchargés avec un 4ème paramètre optionnel.
    // Cf. calConfig().
    if (arguments.length == 4) {
        this.options = arguments[3];
    }
    
    // Détection IE6 pour le bug sur les listes déroulantes.
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
        throw new Error('Calendar : propriété targetElement erronée.');
    }
    
    this.selectedDates = new Array();
    this.calendar;
    
    // Les listes déroulantes
    this.monthSelect;
    this.yearSelect;
    
    // Les principaux conteneurs
    this.caption;
    this.thead;
    this.tbody;
    this.tfooter;
    
    // Initialisations des propriétés
    this.mousein = false;
    this.calConfig();
    this.setDays();
    
    this.displayYear  = this.displayYearInitial;
    this.displayMonth = this.displayMonthInitial;
    userDate          = null;
    
    // En mode popup, ajout de la date de l'élément cible au tableau des dates sélectionnées.
    if(this.mode == 'popup' && this.targetElement && this.targetElement.type == 'text' && this.targetElement.value != '') {
        
        userDate = this.getDateFrProperties(this.targetElement.value);
        
        this.selectedDates.push(new Date(userDate.year, (userDate.month-1), userDate.day));
    }
    
    // Création du calendrier DOM
    this.createCalendar();
    
    // Si la source est un champ de type "text" et le mode = popup.
    if (this.mode == 'popup' && this.targetElement && this.targetElement.type == 'text') {
        
        this.calendar.style.position = 'absolute';
        
        // positionnement du calendrier
        this.updatePos();
        
        document.body.appendChild(this.calendar);
        
        if (this.triggerElt === false) {
        
            // Evènements focus et blur sur le champ cible : afficher / cacher le calendrier.
            addEvent(this.targetElement, 'focus', this.show.bind(this), false);
            addEvent(this.targetElement, 'blur' , this.targetBlur.bind(this) , false);
        }
        else {
            addEvent(this.triggerElt, 'click', this.toggle.bind(this), false);
            addEvent(this.triggerElt, 'blur' , this.targetBlur.bind(this), false);
        }
        
        // Si valeur par défaut => positionner sur le bon mois et la bonne année.
        if (userDate) {
            this.goToMonth(userDate.year, (userDate.month-1));
        }
    }
    else {
        this.targetElement.appendChild(this.calendar);
    }
    
    // 0: initialisation, 1: création, 2: terminé
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
    IE6SelectElement  : [], // Tableaux d'identifiant des éléments SELECT posant problème avec IE6 (pour prévenir ce bug à la con : http://blogs.msdn.com/ie/archive/2006/01/17/514076.aspx)
    userHandler       : null,
    
    // Initialisation des variables du calendrier, gère les paramètres par défaut.
    calConfig : function () {
        
        // Année initiale à prendre en compte au chargement.
        if (this.options.displayYearInitial) this.displayYearInitial = this.options.displayYearInitial;
        else                                 this.displayYearInitial = this.curDate.getFullYear();
        
        // Mois initial à prendre en compte au chargement (0-11)
        if (this.options.displayMonthInitial >= 0 && this.options.displayMonthInitial <12) this.displayMonthInitial = this.options.displayMonthInitial;
        else                                                                               this.displayMonthInitial = this.curDate.getMonth();
        
        // Année Min.
        if (this.options.rangeYearLower) this.rangeYearLower = this.options.rangeYearLower;
        else                             this.rangeYearLower = this.displayYearInitial - 5;
        
        // Année Max.
        if (this.options.rangeYearUpper) this.rangeYearUpper = this.options.rangeYearUpper;
        else                             this.rangeYearUpper = this.displayYearInitial + 5;
        
        // Cas particulier : le couple année/mois initial n'est pas dans le rang prévu.
        if (this.displayYearInitial > this.rangeYearUpper || this.displayYearInitial < this.rangeYearLower) {
            this.displayYearInitial = this.rangeYearLower;
        }
        
        // Jour pris en compte comme le premier de la semaine : 0 (Dim) à 6 (Sam)
        if (this.options.startDay >= 0) this.startDay = this.options.startDay;
        else                            this.startDay = 1;
        
        // Afficher ou nom le numéro de la semaine dans le calendrier
        this.showWeeks = !(this.options.showWeeks === false);
        
        // Restreint l'utilisateur à sélectionner une date seulement dans le mois affiché
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
        
        // Elément déclencheur différent de l'élément source.
        if (typeof this.options.triggerElt != 'undefined') this.triggerElt = this.options.triggerElt;
        else                                               this.triggerElt = false;
        
        if (typeof this.options.popupTopPos !== 'undefined') this.popupTopPos = parseInt(this.options.popupTopPos);
        else                                                 this.popupTopPos = -1;
        
        this.minDate = new Date(this.rangeYearLower, 0, 1);
        this.maxDate = new Date(this.rangeYearUpper, 0, 1);
        
        this.visible = (this.mode == 'flat');
            
        this.setLang();
    },
    
    
    // Positionne le calendrier à date passée en paramètre.
    // Permet également de faire un reset sur la propriété selectedDates si le paramètre est vide.
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
     * Retourne [true] si la date passée en paramètre est contenue entre les années min/max
     * spécifié en paramètres à la classe.
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
    
    
    // Découpe une date au format français d/m/Y au format JSON {day, month, year}.
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
    
    
    // Définition des paramètres pour la langue française.
    setLang : function() {
    
        this.daylist          = new Array('D', 'L', 'M', 'M', 'J', 'V', 'S', 'D', 'L', 'M', 'M', 'J', 'V', 'S');
        this.months_sh        = new Array('Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre');
        this.monthup_title    = 'Mois suivant';
        this.monthdn_title    = 'Mois précédent';
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
     * @param   string  mixed       Objet html directement ou identifiant de l'élément html
     * @param   string  sProperty   Propriété CSS dont on souhaite connaître la valeur
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
     * Retourne les coordonnées d'un élément pour Internet Explorer.
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
     * Retourne les coordonnées d'un élément sur une page en fonction de tous ses éléments parents
     * 
     * @param objet element
     */
    getElementCoords : function(element) {
        
        var coords = {x: 0, y: 0};
    
        // IE pour résoudre le problème des marges (IE comptabilise dans offsetLeft la propriété marginLeft).
        if (element.getBoundingClientRect) {
            coords = this.ieGetCoords(element);
        }
        // Les autres : récursivité sur offsetParent.
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
    
    
    // Evènement "blur" de la cible.
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
        
        // Valeur 'table' non interprétée par IE.
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
    
    
    // Bascule montrer/cacher suivant la propriété booléenne 'visible'.
    toggle : function () {
        if (this.visible) this.hide();
        else              this.show();
    },
    
    
    // Initialisation des paramètres du calendrier suivant le standard Gregorien
    setDays : function () {
    
        this.daynames = new Array();
        var j = 0;
        
        for(var i=this.startDay; i< this.startDay + 7;i++) {
            this.daynames[j++] = this.daylist[i];
        }
            
        this.monthDayCount = new Array(31, ((this.curDate.getFullYear() - 2000) % 4 ? 28 : 29), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
    },
    
    
    // Permet d'annuler un évènement. Cf. librairie addEvent().
    cancelTextSelection : function (e) {
        stopEvent(e);
    },
    
    
    // Création DOM du calendrier
    createCalendar : function () {
    
        this.calendar = document.createElement('table');
        this.calendar.setAttribute('cellspacing', 0);
        this.calendar.setAttribute('cellpadding', 0);
        this.calendar.setAttribute('id', this.getBaseId());
        
        this.calendar.className = 'calendar';
        
        // Annule la sélection de texte lors d'un click sur une date
        addEvent(this.calendar, 'selectstart', this.cancelTextSelection, false);
        addEvent(this.calendar, 'drag'       , this.cancelTextSelection, false);
                
        // Création de la barre de titre
        if (this.displayPanel) {
            this.caption    = document.createElement('caption');
            this.caption.id = this.setId('caption');
            this.createMainHeading();
        }
            
        // Création de l'entête (nom des jours forme abregée)
        this.thead    = document.createElement('thead');
        this.thead.id = this.setId('thead');
        this.createDayHeading();
        
        // Création des cellules des jours
        this.tbody    = document.createElement('tbody');
        this.tbody.id = this.setId('body');
        this.createCalCells();
        
        // Création du footer
        if (this.displayFooter) {
            this.tfooter    = document.createElement('tfoot');
            this.tfooter.id = this.setId('footer');
            this.createFooter();
        }
        
        // Assemble tous les éléments dans le tableau principal
        if (this.displayPanel) {
            this.calendar.appendChild(this.caption);
        }
        
        this.calendar.appendChild(this.thead);
        this.calendar.appendChild(this.tbody);
        
        if (this.displayFooter) {
            this.calendar.appendChild(this.tfooter);
        }
    
        // Gestion des évènements liés à la souris
        addEvent(this.calendar, 'mouseover', this.mouseOver.bind(this), false);
        addEvent(this.calendar, 'mouseout' , this.mouseOut.bind(this) , false);
    },
    
    
    // Gestion de la propriété mousein sur évènement onMouseOver
    mouseOver : function() {
        this.mousein = true;
    },
    
    
    // Gestion de la propriété mousein sur évènement onMouseOut
    mouseOut : function(e) {
        this.mousein = false;
    },
    
    
    // Retourne l'identifiant unique du calendrier
    getBaseId : function() {
        return this.name + '_calendar';
    },
    
    
    // Méthode facilitant la création d'un identifiant unique pour un élément du calendrier.
    setId : function(complement) {
        return this.getBaseId() + '_' + complement;
    },
    
    
    // Création du caption du tableau (sélection mois & année)
    createMainHeading : function () {
    
        // Création d'un élément conteneur pour un placement aisé dans le caption via les CSS
        divContainer = document.createElement('div');
        
        // Création des éléments fils
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
        
        // Alimentation de la liste des années
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
        
        // Boutons mois suivant / précédent
        this.monthUp.setAttribute('href' , 'javascript:void(0)');
        this.monthUp.setAttribute('title', this.monthup_title);
        this.monthUp.className = 'monthUp';
        
        this.monthDn.setAttribute('href' , 'javascript:void(0)');
        this.monthDn.setAttribute('title', this.monthdn_title);
        this.monthDn.className = 'monthDn';
        
        // Evènements sur les contrôleurs
        addEvent(this.monthUp    , 'click' , this.nextMonth.bind(this)     , false);
        addEvent(this.monthDn    , 'click' , this.prevMonth.bind(this)     , false);
        addEvent(this.monthSelect, 'change', this.controlsChange.bind(this), false);
        addEvent(this.yearSelect , 'change', this.controlsChange.bind(this), false);
        
        // Ajout des éléments à la balise caption
        divContainer.appendChild(this.monthDn);
        divContainer.appendChild(this.monthUp);
        divContainer.appendChild(this.monthSelect);
        divContainer.appendChild(this.yearSelect);
        
        this.caption.appendChild(divContainer);
    },
    
    
    // Gestion de l'évènement onchange des listes déroulantes mois/année.
    controlsChange : function() {
        this.displayMonth = this.monthSelect.value;
        this.displayYear  = this.yearSelect.value; 
        
        this.goToMonth(this.displayYear, this.displayMonth);
    },
    
    
    // Alimente le contenu de l'élément tfoot du calendrier
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
    
    
    // Reset du calendrier aux valeurs par défaut
    goToday : function () {
        this.selectedDates[0] = this.curDate;
        
        this.goToMonth(this.displayYearInitial, this.displayMonthInitial);
        this.reDraw();
    },
    
    
    // Création de l'entête contenant le nom des jours
    createDayHeading : function () {
    
        tr        = document.createElement('tr');
        this.cols = new Array(false, false, false, false, false, false, false);
        
        // Si le numéro de semaine est souhaité, création d'une cellule vide dans l'entête pour compenser
        // le nombre de cellules présente dans le tbody.
        if(this.showWeeks) {
            td           = document.createElement('th');
            td.className = 'wkhead';
            td.innerHTML = '&nbsp;';
            tr.appendChild(td);
        }
        
        // Création des cellules.
        for(var dow=0; dow<7; dow++) {
            
            th = document.createElement('th');
            th.appendChild(document.createTextNode(this.daynames[dow]));
            tr.appendChild(th);
        }
        
        this.thead.appendChild(tr);
    },
    
    
    // Création des cellules du tbody
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
            
            // Avec les numéros de semaines
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
            
            // Création des cellules "jours"
            td = document.createElement('td');
            td.appendChild(document.createTextNode(sdt.getDate()));
            
            this.cells.push(
                new CalCell(this, td, sdt, row)
            );
            
            td.cellObj = this.cells[this.cells.length-1];
            
            // Incrémente la date
            sdt.setDate(sdt.getDate() + 1);
            tr.appendChild(td);
            this.tbody.appendChild(tr);
        }
        
        this.reDraw();
    },
    
    
    // Applique les classes CSS aux cellules du calendrier suivant leur état.
    reDraw : function () {
        
        this.state = 1;
        var i, j;
        
        for (i=0; i<this.cells.length; i++) {
            
            this.cells[i].selected = false;
            
            // Si la date en cours est présente dans le tableau "selectedDates", sa propriété "selected" est positionné à true.
            for(j=0; j<this.selectedDates.length; j++) {
                
                if(this.cells[i].date.getUeDay() == this.selectedDates[j].getUeDay() ) {
                    this.cells[i].selected = true;
                }
            }
    
            this.cells[i].setClass();
        }
        
        this.state = 2;
    },
    
    
    // Supprime toutes les lignes contenu dans l'élément tbody
    deleteCells : function () {
        
        var nbRow = this.tbody.rows.length;
        
        for (i=0; i<nbRow; i++) {
            this.tbody.deleteRow(0);
        }
        
        this.cells = new Array();
    },
    
    
    // Positionne le calendrier suivant le mois et l'année passée en paramètre.
    goToMonth : function (year,month) {
        this.displayMonth = month;
        this.displayYear  = year;
        
        // N'existe que si la propriété displayPanel = true.
        if (this.monthSelect && this.yearSelect) {
            this.yearSelect.value  = year;
            this.monthSelect.value = month;
        }
        
        this.refresh();
    },
    
    
    // Va au mois suivant. Si le mois est décembre, va au mois de janvier de l'année suivante
    nextMonth : function (){
    
        // Incrémente les valeurs mois/année, en vérifiant qu'elles soient comprises dans le rang min/max
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
        
        // Assigne les valeurs d'affichage mois/année
        this.displayMonth = this.monthSelect.value;
        this.displayYear  = this.yearSelect.value;
        
        this.refresh();
    },
    
    
    // Va au mois précédent. Si le mois est janvier, va au mois de décembre de l'année précédente december of the previous year
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
    
    
    // Formate vNumber pour toujours obtenir 2 chiffres en ajoutant un zéro non significatif.
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
     * Un putain de sale bug avec les versions IE6 font que les listes déroulantes
     * <SELECT> sont affichées par dessus les suggestions, et ce quelle que soit
     * la valeur de la propriété CSS z-index.
     * Après avoir essayé de nombreuses méthodes (notamment celle avec les iframes), 
     * la solution la plus efficace et la plus rapide reste de demander à l'utilisateur 
     * de spécifier via la propriété [IE6SelectElement] la liste des identifiants des 
     * balises afin de les cacher/montrer si le navigateur utilisé est IE6.
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
 * @param tableCell object TD       Référénce à la cellule du tableau du calendrier
 * @param dateObj  
 * @param row
 */
function CalCell(owner, tableCell, dateObj, row) {
    
    this.owner     = owner;
    this.tableCell = tableCell;
    this.cellClass; // Classe CSS de la cellule
   
    this.selected  = false; // Est-ce que la cellule est sélectionnée (l'utilisateur a cliqué sur une cellule ou date sélectionnée par défaut)
    this.date      = new Date(dateObj);
    this.dayOfWeek = this.date.getDay();
    this.week      = this.date.getWeek();
    this.tableRow  = row;
    
    // Assignation des gestionnaires d'évènements d'une cellule
    this.tableCell.onclick     = this.onclick;
    this.tableCell.onmouseover = this.onmouseover;
    this.tableCell.onmouseout  = this.onmouseout;
    
    // Affecte la classe CSS d'une cellule suivant son état
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
            
            // Si une cible existe, un click ramène la valeur et cache le calendrier
            if (owner.targetElement) {
                
                owner.targetElement.value = owner.selectedDates[0].dateFormat();
                
                if (owner.mode == 'popup') {
                    owner.hide();
                }
                
                // Lance la fonction de l'utilisateur userHandler.onSelect() avec la date sélectionnée en paramètre.
                if ((owner.options.userHandler != null) && (typeof owner.options.userHandler.onSelect == "function")) {
                    owner.options.userHandler.onSelect(owner.targetElement.value);
                }
            }
            
            // Applique les changements.
            owner.reDraw();
        }
    },
    
    
    // Affecte la classe CSS à la cellule suivant le critère spécifié.
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