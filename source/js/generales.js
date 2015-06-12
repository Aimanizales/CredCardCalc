//Agrega un page view
function addPageView()
{
    try
    {
        var pageTracker = _gat._getTracker("UA-41180773-6");
        pageTracker._initData();
        pageTracker._trackPageview(); 
    }
    catch(ex)
    {
    }
}

// Remueve los espacios antes y despues de un string
function trim(str) 
{
   return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '')
}

//Reemplaza 'palabra' por 'palabraNueva' data la cadena de texto 'text'
function replaceAll(text, palabra, palabraNueva )
{
    var textReplace = text.toString();
    while (textReplace.indexOf(palabra) != -1)
      textReplace = textReplace.replace(palabra,palabraNueva);
    return textReplace;
}

//Agragar una pagina a los Favoritos del navegador
function addFavorite(url, title) {
	//IE
	if ((navigator.appName == "Microsoft Internet Explorer") && (parseInt(navigator.appVersion) >= 4)) 
	{
		window.external.AddFavorite(url, title);
	}
	//Para Firefox
	else {
		if (navigator.appName == "Netscape") 
		{
			//Hay que modificar el nombre por el de vuestra pagina
			window.sidebar.addPanel(title, url, "");
		}
	}
}

// Script para establecer como página de inicio
function setAsInitPage(url) 
{
	if ((navigator.appName == "Microsoft Internet Explorer") && (parseInt(navigator.appVersion) > 3)) 
	{
		obj_Pagina_Inicio.style.behavior = 'url(#default#homepage)';
		obj_Pagina_Inicio.setHomePage(url);
	}
	else {
		alert('Su navegador no dispone de esta opción.', url);
	}
} 


 var win = null;
 function NewWindow(mypage, target, settings) {
     if (!window.sidebar & navigator.appName == "Netscape") {
         if (target = "_blank") {
             indexS = settings.indexOf("scrollbars");
             indexH = settings.indexOf("height");
             if (indexS != -1 & indexH != -1) {
                 settings = settings.replace("scrollbars=1", "scrollbars=no");
             }
      } 
     }
     win = window.open(mypage, target, settings);
 }
 
 function isNumberKey(evt) {
    var charCode = (evt.which) ? evt.which : event.keyCode
    if (charCode > 31 && (charCode < 48 || charCode > 57))
        return false;

    return true;
}

function maskText(str, textbox, mod, delim) {
    str = replaceAll(str, '.', '');
	str = replaceAll(str, ',', '');
	var arr = str.split("");
    var itemMask = '';
    var contAct = 0;
    for (var i = arr.length - 1; i >= 0; i--) {
        if (contAct == mod) {
            itemMask = arr[i] + '.' + itemMask;
            contAct = 0;
        }
        else {
            itemMask = arr[i] + itemMask;
        }
        contAct = parseInt(contAct) + 1;
    }
    //alert(itemMask);
    textbox.value = itemMask;
}