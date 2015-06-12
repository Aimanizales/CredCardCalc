/**
*   @author Fabian Dario Moreno
*   @version 1.0
*   @date: 11/Abril/2011
*   @description:
*   Libreria que gestiona las cookies del portal
*   Proporciona los metodos para crear, leer y borrar cookies
**/

function createCookie(name,value,seconds) {
    if (seconds) 
    {
	    var date = new Date();
	    date.setTime(date.getTime()+(seconds*1000));
	    var expires = "; expires="+date.toGMTString();
    }
    else 
        var expires = "";
    document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name) 
{
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    
    for(var i=0;i < ca.length;i++) 
    {
	    var c = ca[i];
	    
	    while (c.charAt(0)==' ') c = c.substring(1,c.length);
	        if (c.indexOf(nameEQ) == 0) 
	            return c.substring(nameEQ.length,c.length);
    }
    return '';
}

function eraseCookie(name) 
{
    createCookie(name,'',-1);
}