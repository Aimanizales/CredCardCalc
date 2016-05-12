//302 --> 263 --> 

function items_txtFinder_OnKeyUp(event){
  var keyCode = event.keyCode;
  
  //si es un caracter valido, lanzamos la busqueda
  if(keyCode > 40 && keyCode < 128 || keyCode == 8 || keyCode == 12) {
    items_find();
  }
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
  var newWhat;

  try{
    //si no esta buscando
    if(!load){
      newWhat = document.getElementById('txtFinder').value;
      
      //validamos que la busqueda sea diferente
      if(newWhat != what){
        lastPage = false;
        what = newWhat;
        pageNumber = 0;
        finder = true;
        load = true;    
        loadData();
      }
    }else{
      setTimeout(items_find, 1000);
    }
  }catch(Error){
    finder = false;
    load = false;
  }
}

//evento cuando entra el mouse de la caja del div
//que contiene el item
function divItem_onMouseOver(idItem) {
  $("#" + idItem).addClass("itemContainer");
}

//evento cuando sale el mouse de la caja del div
//que contiene el item
function divItem_onMouseOut(idItem){
  $("#" + idItem).removeClass("itemContainer");
}



function getParams(){
    //cargamos el tipo de vista preferido
    if(readCookie('viewType')!= null){
      viewType= readCookie('viewType');
    }

    //si es una calculadora, cambiamos el label
    if(itemType == 1){
      $("#divTypeName").html('Calculadoras');
      calculadora = true;
      $("#divFinderItem").hide();
    }
}

function loadData(){
  if(!lastPage){
    $("#lblMessageItems").html("<h3>Cargando Contenido</h3>");
    $("#lblMessageItems").show();
    SitioWeb.ws.wsItem.getItems(what,'Id',false,itemType, calculadora , pageNumber,pageSize,getItems_onResult);
  }
}