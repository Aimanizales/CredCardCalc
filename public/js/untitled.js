var n = {};

function items_txtFinder_OnKeyUp(event){
  keyCode = event.keyCode;
  
  //si es un caracter valido, lanzamos la busqueda
  if(keyCode > 40 && keyCode < 128 ||keyCode == 8 ||keyCode == 12 )
      items_find();
}

//Evento keydown sobre txtFinder  
function items_txtFinder_OnKeyDown(event){
  //si es un "ENTER" evitamos el postback
  if (event.keyCode == 13){
    items_find();
    return false;
  }
}

//funcion que lanza la busqueda de los items
function items_find() {
try
{
    //si no esta buscando
  if(!load)
  {
    var newWhat = document.getElementById('txtFinder').value;
    
    //validamos que la busqueda sea diferente
    if(newWhat != what)
    {
      lastPage = false;
      what = newWhat;
      pageNumber = 0;
      finder = true;
      load = true;    
      loadData();
    }
  }
  else{
    setTimeout(items_find, 1000);
  }
}
catch(Error)
{
  finder = false;
  load = false;
}
}

//evento cuando entra el mouse de la caja del div
//que contiene el item
function divItem_onMouseOver(idItem)
{
    $("#" + idItem).addClass("itemContainer");
}

//evento cuando sale el mouse de la caja del div
//que contiene el item
function divItem_onMouseOut(idItem)
{
    $("#" + idItem).removeClass("itemContainer");
}

//cuando termina de buscar los items
function getItems_onResult(lstItemsResult)
{
try
{
  var lstItems = (new Function("return " + lstItemsResult))();
  var repeaterHtml = '';
  var z = 0;
  var len = lstItems.length;
  var className = 'box';
  var divResult = document.getElementById("divResult");
  var divName = "box_";
  
  if( len > 0)
  {
    //modo tradicional
    if(viewType != 'brick')
    {
      while( z < len )
      {
        repeaterHtml += '<div class="fila_cont">';
        //armamos el html
        for (var y = 0 ; y < len & y < 2 & z < len ; y++) 
        {
          var imageItem = '<img border="0" style="max-width:95px;" class="foto_miniatura"   src="/img/player/video_defaults.jpg">' ;
          
          if(lstItems[z].RutaImagen !== '')
            imageItem = '<img border="0"  style="max-width:95px;" class="foto_miniatura"   src="' + lstItems[z].RutaImagen + '">' ;

           repeaterHtml += '<div id="'+ divName + lstItems[z].Id +'" class="noticia_detalle" onmouseover="divItem_onMouseOver(\'' + divName + lstItems[z].Id + '\')" '+
           'onmouseout="divItem_onMouseOut(\'' + divName + lstItems[z].Id + '\')">' +
           '<a id="galeria' + lstItems[z].Id + '" href="' + lstItems[z].UrlFriendly + '" >' +
           imageItem +
           '</a>' +
           '<h4>' +  lstItems[z].AnteTitulo + '</h4>'+
           '<h3><a href="' + lstItems[z].UrlFriendly + '">' + getTitle(lstItems[z].Titulo) + '</a></h3>' +
           '<p>' + lstItems[z].Resumen + '</p>' +
           '<h6>' + lstItems[z].FechaUltimaModificacion + '</h6>'+
           '</div>';    
  
           z = z + 1;
        }
        
        repeaterHtml += '</div>';
      }
      
      var newDiv = document.createElement('div');
      newDiv.innerHTML = repeaterHtml;
      
      if(finder)
        divResult.innerHTML = '';
        
      divResult.appendChild(newDiv);
    }
    else //modo brick
    {
      //si es una busqueda limpiamos el div y las variables
      if(finder)
      {
        divResult.innerHTML = '';
        posX = 0; 
        posY = 0; 
        positions = new Array(numColumns); 
        
        for(var temp = 0;temp<positions.length;temp++)
          positions[temp] = 0;
      }        
       
      var widthDiv = 0;
      
      //Armamos el html
      while( z < len ){
        var box = {};
        
        for(var indexX = 0 ; indexX < numColumns && z < len ; )
        {
          //Calculamos el ancho 
          box.title = lstItems[z].Titulo ;
          box.space = 1;
          box.index = indexX;
           
          //Obtenemos el ancho optimo
          widthDiv = getWidth(box,lstItems[z].Resumen, indexX);
          
          //Si en la fila hay espacio para el item
          if( (indexX + box.space) <= numColumns )
          {
            //Calculamos el alto minimo
            var posY = positions[indexX];
            
            for(var temp = 0; temp < box.space ; temp++ )
            {
              if(posY < positions[indexX + temp] )
                 posY = positions[indexX + temp] 
            }

            // Armamos el style del item
            var styleDiv="colorPosition:absolute;width:" + widthDiv + "px;top:" + posY + "px;left:" + posX + "px;background-color:#fff;";
            
            var imageItem = '<img border="0" style="max-width:95px;" class="foto_miniatura"   src="/img/player/video_defaults.jpg">' ;
          
            if(lstItems[z].RutaImagen != '')
              imageItem = '<img border="0"  style="min-height:65px;max-width:95px;" class="foto_miniatura"   src="' + lstItems[z].RutaImagen + '">' ;

            
            repeaterHtml = '<div id="'+ divName + lstItems[z].Id +'" class="' + className + lstItems[z].IdSeccion + ' box" '+
             'style="' + styleDiv +';opacity:0.01;" onmouseover="divItem_onMouseOver(\'' + divName + lstItems[z].Id + '\')" '+
             'onmouseout="divItem_onMouseOut(\'' + divName + lstItems[z].Id + '\')">' +
             '<a id="galeria' + lstItems[z].Id + '" href="' + lstItems[z].UrlFriendly + '">' +
             imageItem +
             '</a>' +
             '<h4>' +  lstItems[z].AnteTitulo + '</h4>'+
             '<h3><a href="' + lstItems[z].UrlFriendly + '">' + getTitle(lstItems[z].Titulo)  + '</a></h3>' +
             '<p>' + lstItems[z].Resumen + '</p>' +
             '</div>';    
             
            var newDiv = document.createElement('div');
            newDiv.innerHTML = repeaterHtml;

            var divResult = document.getElementById("divResult");
            
            //Insertamos el item  
            divResult.appendChild(newDiv);
            
            //Obtenemos el alto del div
            var heigthBox = document.getElementById( divName + lstItems[z].Id ).clientHeight;
            
            if(heigthBox < 80)
              heigthBox = 80;
            //Actualizamos las posiciones
            for(var temp = 0; temp < box.space ; temp++ )
            {
              positions[indexX + temp] = posY + heigthBox + verticalPadding;
            }
            
            divResult.setAttribute('style','height:' + (450+posY)+'px' );
            
            setTimeout('$("#'+divName + lstItems[z].Id + '").animate({opacity: 1}, 200 );',(200+z*70));
            
            //Actualizamos los contadores
            posX = posX + widthDiv + padding;
            indexX = indexX + box.space;
            z=z+1;
          }
          else
          {
            indexX = numColumns;
          }
        }
        posX = 0;
      }
    }
    
    $("#lblMessageItems").fadeOut(300);
  }
  else
  {
    lastPage = true;
    $("#lblMessageItems").html("<h3>No hay mas contenido</h3>");
    setTimeout('$("#lblMessageItems").fadeOut(300)',4000);
  }
  
  finder = false;
  load = false;
  
  addPageView();
}
catch(Error)
{
  finder = false;
  load = false;
}
}

//retorna el titulo, en caso de que haya una busqueda activa, resalta la 
//palabra buscada
function getTitle(title)
{
    if (what != '') 
    {
        var lstWhat = what.split(' ');

        for (var x = 0; x < lstWhat.length; x++) 
        {
            var temptittle = title.toLowerCase();
            temptittle = temptittle.replace('á', 'a');
            temptittle = temptittle.replace('é', 'e');
            temptittle = temptittle.replace('í', 'i');
            temptittle = temptittle.replace('ó', 'o');
            temptittle = temptittle.replace('ú', 'u');

            what = lstWhat[x];

            //si no esta vacio
            if (what != '') {
                what = what.toLowerCase();
                what = what.replace('á', 'a');
                what = what.replace('é', 'e');
                what = what.replace('í', 'i');
                what = what.replace('ó', 'o');
                what = what.replace('ú', 'u');

                var indexOfWhat = temptittle.indexOf(what);

                if (indexOfWhat >= 0)
                    title = title.substr(0, indexOfWhat) + '{'
                        + title.substr(indexOfWhat, what.length) + '}'
                        + title.substr(indexOfWhat + what.length)
            }
        }

        title = replaceAll(title, '{', '<span style="color:#EF3E0F;">');
        title = replaceAll(title, '}', '</span>');

        return title;
    }
    else 
    {
        return title;
    }
}

function getParams()
{
    //cargamos el tipo de vista preferido
    if(readCookie('viewType')!= null)
        viewType= readCookie('viewType');
    //si es una calculadora, cambiamos el label
    if(itemType == 1)
    {
        $("#divTypeName").html('Calculadoras');
        calculadora = true;
  $("#divFinderItem").hide();
    }
}

function loadData()
{
if(!lastPage)
{
  $("#lblMessageItems").html("<h3>Cargando Contenido</h3>");
  $("#lblMessageItems").show();
  SitioWeb.ws.wsItem.getItems(what,'Id',false,itemType, calculadora , pageNumber,pageSize,getItems_onResult);
}
}