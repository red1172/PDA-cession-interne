Function.prototype.bind = function(object) {
    var __method = this;
    
    return function() {
        __method.apply(object, arguments);
    }
}



Function.prototype.bindAsEventListener = function(object) {
    var __method = this;
    
    return function(event) {
        __method.call(object, event || window.event);
    }
}



function getEvent(e) {
    var ev = e || window.event;

    if (!ev) {
        var c = getEvent.caller;
        while (c) {
            ev = c.arguments[0];
            if (ev && Event == ev.constructor) {
                break;
            }
            c = c.caller;
        }
    }

    return ev;
}


/**
 * Convenience method for stopPropagation + preventDefault
 * 
 * @method stopEvent
 * @param {Event} ev the event
 * @static
 */
function stopEvent(ev) {
    stopPropagation(ev);
    preventDefault(ev);
}


/**
 * Stops event propagation
 * 
 * @method stopPropagation
 * @param {Event} ev the event
 * @static
 */
function stopPropagation(ev) {
    if (ev.stopPropagation) {
        ev.stopPropagation();
    } else {
        ev.cancelBubble = true;
    }
}

/**
 * Prevents the default behavior of the event
 * 
 * @method preventDefault
 * @param {Event} ev the event
 * @static
 */
function preventDefault(ev) {
    if (ev.preventDefault) {
        ev.preventDefault();
    } else {
        ev.returnValue = false;
    }
};


/**
 * Ajoute un �v�nement � un objet.
 * 
 * @param elm        object    El�ment auquel il faut appliquer l'�v�nement
 * @param evType     string    Nom de l'�v�nement (= htmlEvent sans le pr�fixe "on" ex. 'click', 'mousemove'...)
 * @param fn         function  Nom de la fonction � utiliser lors du d�clenchement de l'�v�nement (sans les parenth�ses, aucun param�tre ne peut �tre pass�)
 * @param useCapture boolean   ??? => Si quelqu'un comprend : http://developer.mozilla.org/en/docs/DOM:element.addEventListener
 */
function addEvent(elm, evType, fn, useCapture) {
    
    var wrappedFn = function(e) {
                        return fn.call(elm, getEvent(e));
                    };
    
    // Gecko
	if (elm.addEventListener) { 
	    elm.addEventListener(evType, wrappedFn, useCapture);
	    var result = true;
	}
	// IE
	else if (elm.attachEvent) { 
	    var result = elm.attachEvent('on' + evType, wrappedFn); 
	    
	}
	else {
	    elm['on' + evType] = fn;
	    var result = true;
	}
	
	// Mise en cache des �v�nements pour purge avec l'objet EventCache.
	if (evType != 'unload') {
	   EventCache.add(elm, evType, fn, useCapture, wrappedFn);
	}
	
	return result;
}


/**
 * Retourne l'�l�ment cible depuis l'�v�nement sp�cifi�.
 * 
 * @param e event
 * @return object
 */
function getEventSrc(e) {
	if (!e) e = window.event;
    
	if (e.originalTarget)  return e.originalTarget;
	else if (e.srcElement) return e.srcElement;
}



function addLoadEvent(func) {
    var oldonload = window.onload;
    
	if (typeof window.onload != 'function') {
	    window.onload = func;
	}
    else {
	    window.onload = function() {
            oldonload();
		    func();
		}
	}
}


/**
 * Chaque appel � la fonction addEvent() alimente le tableau EventCache.listEvents
 * sous la forme :
 * 
 * listeEvents[] = array(
 *      0 => node           // L'�l�ment source
 *      1 => sEventName     // Le type de l'action (forme courte : load, click, mousemove...)
 *      2 => fHandler       // La fonction utilisateur appliqu� � l'�v�nement
 *      3 => bCapture       // La notion incomprise sp�cifique � Firefox "useCapture"
 *      4 => wrappedFn      // La fonction modifi�e dans addEvent
 * )
 */
var EventCache = {
    listEvents : [],    // Event registry
	
    /**
     * Alimente le tableau listEvents
     * 
     * @see addEvent
     */
    add : function(node, sEventName, fHandler, bCapture, wrappedFn){
        EventCache.listEvents.push(arguments);
	},
	
	
	/**
	 * Fonction g�n�rique pour supprimer un �v�nement.
	 */
	simpleRemove : function(element, type, listener, useCapture) {
        
        if (element.removeEventListener){
            element.removeEventListener(type, listener, useCapture);
	    };
        
        // From this point on we need the event names to be prefixed with 'on"
        if (type.substring(0, 2) != "on"){
            type = "on" + type;
        };
        
        if(element.detachEvent){
            element.detachEvent(type, listener);
        };
    },
    
    
	
    /**
     * Supprime tous les �v�nements r�pertori�s dans listEvents
     */
	flush : function(){
		var i, item;
		
		listEvents = EventCache.listEvents;
				
        for (i = listEvents.length - 1; i >= 0; i = i - 1){
			item = listEvents[i];
			
			EventCache.simpleRemove(item[0], item[1], item[4], item[3]);
			
			item[0][item[1]] = null;
			EventCache.listEvents.splice(i, 1);
		};
    },
    
    
    /**
     * Supprime un �v�nement pour le noeud sp�cifi�.
     * 
     * return bool
     */
    removeListener : function(node, sEventName, fHandler, bCapture) {
        var i, item;
        var b = false;
		
		for (i = EventCache.listEvents.length - 1; i >= 0; i = i - 1){
		    
		    item = EventCache.listEvents[i];
			
            if (item[0] == node && item[1] == sEventName && item[2] == fHandler) {
                
                EventCache.simpleRemove(item[0], item[1], item[4], item[3]);
                
			    item[0][item[1]] = null;
			    EventCache.listEvents.splice(i, 1);
			    b = true;
			    break;
            }
			
		};
		
		return b;
    }
}

// prevent memory leaks
addEvent(window, 'unload', EventCache.flush, false);