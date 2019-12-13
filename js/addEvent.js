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
 * Ajoute un évènement à un objet.
 * 
 * @param elm        object    Elément auquel il faut appliquer l'évènement
 * @param evType     string    Nom de l'évènement (= htmlEvent sans le préfixe "on" ex. 'click', 'mousemove'...)
 * @param fn         function  Nom de la fonction à utiliser lors du déclenchement de l'évènement (sans les parenthèses, aucun paramètre ne peut être passé)
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
	
	// Mise en cache des évènements pour purge avec l'objet EventCache.
	if (evType != 'unload') {
	   EventCache.add(elm, evType, fn, useCapture, wrappedFn);
	}
	
	return result;
}


/**
 * Retourne l'élément cible depuis l'évènement spécifié.
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
 * Chaque appel à la fonction addEvent() alimente le tableau EventCache.listEvents
 * sous la forme :
 * 
 * listeEvents[] = array(
 *      0 => node           // L'élément source
 *      1 => sEventName     // Le type de l'action (forme courte : load, click, mousemove...)
 *      2 => fHandler       // La fonction utilisateur appliqué à l'évènement
 *      3 => bCapture       // La notion incomprise spécifique à Firefox "useCapture"
 *      4 => wrappedFn      // La fonction modifiée dans addEvent
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
	 * Fonction générique pour supprimer un évènement.
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
     * Supprime tous les évènements répertoriés dans listEvents
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
     * Supprime un évènement pour le noeud spécifié.
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