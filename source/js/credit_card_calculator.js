/**
 * arranca como una función anónima auto ejecutada
 * 
 * @return {Object}   [description]
 */
var creditCard = (function () {

  var ok,
  MAX_QUOTAS = 36,
  MAX_INTEREST_RATE = 2.19,
  purchaseInput = 'purchaseInput',
  interestRate = 'interestRate',
  cuotaSelect = 'cuotaSelect',
  $quotaValueText = $('.quotaValue'),
  $purchaseInput = $('#' + purchaseInput),
  $cuotaSelect = $('#' + cuotaSelect),
  $interestRate = $('#' + interestRate),
  $limitTasa = $('.limit_tasa'),
  $tableResult = $(".table_result"),
  $notaCuotas = $(".nota_cuotas");


  function calcule(){
    var purchaseValue = $purchaseInput.val(),
      interestSelected = $interestRate.val(),
      numQuotasSelected = $cuotaSelect.val();
    
    ok = true;

    $quotaValueText.html('0');
    $tableResult.empty();

    if (interestSelected !== '' && parseFloat(interestSelected) > MAX_INTEREST_RATE) {
      ok = false;
      $limitTasa.show('400');
    }else{
      $limitTasa.hide('400');
    }

    if (purchaseValue !== '' && interestSelected !== '' && ok) {
      purchaseValue = replaceAll(purchaseValue, ',', '');
      var lstQuota = pagoTarjetaCredito(purchaseValue, numQuotasSelected, interestSelected, 0);

      if (lstQuota !== null) {
        _R = lstQuota[1].payment;
        //pintamos los resultados
        paintTable(lstQuota, ['Cuota', 'Capital', 'Intereses', 'Pago Total', 'Saldo'], $tableResult, null, 1);

        $quotaValueText.html(formatAsCurrency(Math.round(_R)));

        //almacenamos los valores ingresados por el usuario
        setParams([purchaseInput, interestRate, cuotaSelect]);

        $notaCuotas.find('.valor_compra').html(purchaseValue);
        $notaCuotas.find('.pago_total').html(formatAsCurrency(totalCuotas));
        $notaCuotas.css('display', '');
      }
    }
  }

  //pago con tarjeta de crédito
  function pagoTarjetaCredito(purchaseValue, numQuotasSelected, interestSelected, _po, _R) {
    //validamos que esten todos los campos llenos
    if (purchaseValue && numQuotasSelected && interestSelected) {
      if (purchaseValue > 0 && numQuotasSelected > 0 && interestSelected > 0) {
        //trabajamos interestSelected como porcentajes
        interestSelected = interestSelected / 100;
        
        //calculamos R
        if (_po === null) {
          _R = purchaseValue / ((1 - Math.pow((1 + interestSelected), (-numQuotasSelected))) / interestSelected);
          alert(_po);
        } else {
          _R = (purchaseValue - ((purchaseValue * _po / 100) * Math.pow((1 + interestSelected), -numQuotasSelected))) / ((1 - Math.pow((1 + interestSelected), (-numQuotasSelected))) / interestSelected);
        }
        //calculamos las cuotas
        var lstQuota = [],
          objQuota;

        for (var x = 0; x <= numQuotasSelected; x++) {
          //definimos el objeto quota
          objQuota = {
            numQuota: x,
            capital: '',
            interest: '',
            payment: '',
            balance: 0
          };
          //si no es la primera cuota
          if (x > 0) {
            objQuota.payment = _R;

            if (numQuotasSelected == '1') { //caso especial: si el crédito es a una sóla cuota no se cobran intereses.
              objQuota.capital = purchaseValue;
              objQuota.interest = 0;
              objQuota.payment = purchaseValue;
              objQuota.balance = 0;
            } else{
              if (_po !== null && x === numQuotasSelected){
                objQuota.payment += purchaseValue * _po / 100;
              }
              objQuota.interest = lstQuota[x - 1].balance * interestSelected;
              objQuota.capital = objQuota.payment - objQuota.interest;
              objQuota.balance = lstQuota[x - 1].balance - objQuota.capital;
            }
          } else {
            objQuota.balance = purchaseValue;
          }
          lstQuota.push(objQuota);
        }
        return lstQuota;
      }
    }
    return null;
  }

  //limpia los campos del formulario
  function clean() {
    cleanComponents([$purchaseInput, $interestRate, $cuotaSelect]);
    $quotaValueText.html('0');
    $tableResult.html('');
    $limitTasa.hide();
  }

  function fillSelectMonth(select, initialValue, finalValue, multiplicationFactor){
    var valueOption = 0;
    for(var i = initialValue; i <= finalValue; i++){
      valueOption = i * multiplicationFactor;
      select.append('<option value="' + valueOption  + '">' + valueOption  + ((valueOption > 1)? ' Meses' : ' Mes') + '</option>');
    }
  }




  function setTextInputAsDecimalFormat(idTextBox, nameFunction, integer){
    idTextBox.keydown(function(event){
      var keyCode = event.keyCode;
      
      //solo dejamos pasar numeros y puntos
      if((keyCode > 34 && keyCode < 58) || (keyCode > 95 && keyCode < 106) || keyCode == 8 || keyCode == 12 || keyCode == 9 || keyCode == 13 || keyCode == 110 || keyCode == 190) {
        return true;
      }
      return false;
    });

    idTextBox.keyup(function(event){
      var keyCode = event.keyCode;
      
      //solo dejamos pasar numeros y puntos
      if ((keyCode > 34 && keyCode < 58) || (keyCode > 95 && keyCode < 106) || keyCode == 8 || keyCode == 12 || keyCode == 13 || keyCode == 110 || keyCode == 188 || keyCode == 190) {
        setTimeout(nameFunction,0);
        return true;
      }
      return false;
    });
  }

  function setTextInputAsIntegerFormat(textBox, nameFunction, integer) {
    textBox.keydown(function(event) {
      var keyCode = event.keyCode;
      
      //solo dejamos pasar numeros y puntos
      if((keyCode > 34 && keyCode < 58) || (keyCode > 95 && keyCode < 106) || keyCode == 8 || keyCode == 12 || keyCode == 9 ||keyCode == 13 || keyCode == 110 || keyCode == 190) {
        return true;
      }
      return false;
    });

    textBox.keyup(function(event){
      var keyCode = event.keyCode;
      
      //solo dejamos pasar numeros y puntos
      if((keyCode > 34 && keyCode < 58) || (keyCode > 95 && keyCode < 106) || keyCode == 8 || keyCode == 12 || keyCode == 13 || keyCode == 110 ||keyCode == 188 || keyCode == 190) {
        setTimeout(nameFunction,0);
        textBox.val(formatAsCurrency(textBox.val()));
        return true;
      }
      return false;
    });
  }

  function paintTable(lstQuota,lstNameColumns, divTable, includeTotals){
    paintTable(lstQuota,lstNameColumns, divTable, null , includeTotals);
  }

  function paintTable(lstQuota, lstNameColumns, divTable, lstDataType, includeTotals){
    var repeaterHtml = '<thead>';
    window.totalIntereses = 0;
    window.totalCuotas = 0;
    //pintamos el head de la tabla
    repeaterHtml += '<tr>';
    for(var x=0; x < lstNameColumns.length; x++){
      //si no es una columna oculta
      if(lstDataType === null || lstDataType[x]!= "h"){
        repeaterHtml += '<th>';
        repeaterHtml += lstNameColumns[x];
        repeaterHtml += '</th>';
      }
    }
    repeaterHtml += '</tr></thead>';
    
    //pintamos los datos
    for(x=0; x <= lstQuota.length; x++){
      repeaterHtml += '<tr>';
      
      var y = 0;
      for (var name in lstQuota[x]){
        if (lstQuota[x].hasOwnProperty(name)){
          //si no es una columna oculta
          if(lstDataType === null || lstDataType[x]!="h"){
            //cada 12 meses ponemos una marca
            repeaterHtml += '<td>';
            
            if(lstDataType !== null){
              if(lstDataType[y]=="%")
                repeaterHtml += Math.round(lstQuota[x][name]*10000)/100 + lstDataType[y];
              else if(lstDataType[y]=="s")
                repeaterHtml += lstQuota[x][name];
              else
                repeaterHtml += formatNumber(lstQuota[x][name]);
            }
            else{
              repeaterHtml += formatNumber(lstQuota[x][name]);
              
              //Si la calculadora es de crédito, calculamos las sumatorias
              if(includeTotals == 1){
                if(name == 'interest')
                  totalIntereses += parseFloat(Math.round(lstQuota[x][name]));
                if(name == 'payment')
                  totalCuotas += parseFloat(Math.round(lstQuota[x][name]));
              }
            }
            repeaterHtml += '</td>';
          }
          y += 1;
        }
      }
      repeaterHtml += '</tr>';
    }
    
    //Pintamos la fila de totales
    if(includeTotals == 1)
    {
      repeaterHtml += '</tbody><tfoot><tr><td>TOTALES</td><td></td><td>';
      repeaterHtml += formatNumber(totalIntereses);
      repeaterHtml += '</td><td>';
      repeaterHtml += formatNumber(totalCuotas);
      repeaterHtml += '</td><td></td></tr>';
    }
    repeaterHtml += '</tfoot>';
    
    divTable.hide();
    divTable.html(repeaterHtml );
    divTable.fadeIn(400);
  }

  function formatNumber(value){
    //si es un numero grande lo formateamos (separadores de miles)
    //de lo contrario lo entregamos con con una precision de 3 decimales
    if(value > 1000){
      return formatAsCurrency((Math.round(value)));
    } else {
      return Math.round(value*1000)/1000;
    }
  }

  //retorna el valor con los separados de miles
  function formatAsCurrency(value){
    var money = '';
    money += replaceAll(value,',','');
    if(money.indexOf(".")<0)
    for (var i = 0; i < Math.floor((money.length - (1 + i)) / 3); i++) {
      money = money.substring(0, money.length - (4 * i + 3)) + "," + money.substring(money.length - (4 * i + 3));
    }
    
    return money;
  }

  //obtiene los valores almacenados de los componentes en cookies
  function getParams(lstComponents){
    for(var x=0 ; x<lstComponents.length; x++){
      var cookieComponent = cookieClosure.readCookie(lstComponents[x]);
      if(cookieComponent !== null) {
        $("#"+lstComponents[x]).val(cookieComponent);
      }
    }
  }

  //alamcena los valores de los componentes en cookies
  function setParams(lstComponents){
    for(var x=0 ; x<lstComponents.length; x++){
      var cookieComponent = cookieClosure.readCookie(lstComponents[x]);
      if(cookieComponent !== null){
        cookieClosure.createCookie(lstComponents[x],$("#"+lstComponents[x]).val() ,2592000);
      }
    }
  }

  //limpia los valores de los componentes
  function cleanComponents(lstComponents){
    for(var x=0 ; x<lstComponents.length; x++){
      lstComponents[x].val('');
      cookieClosure.eraseCookie(lstComponents[x]);
    }
  }


  //Reemplaza 'palabra' por 'palabraNueva' data la cadena de texto 'text'
  function replaceAll(text, palabra, palabraNueva ){
    var textReplace = text.toString();
    while (textReplace.indexOf(palabra) != -1){
      textReplace = textReplace.replace(palabra,palabraNueva);
    }
    return textReplace;
  }

  function isNumberKey(evt) {
    var charCode = (evt.which) ? evt.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)){
      return false;
    }
    return true;
  }

  function maskText(str, textbox, mod, delim) {
    str = replaceAll(str, '.', '');
    str = replaceAll(str, ',', '');
    var arr = str.split('');
    var itemMask = '';
    var contAct = 0;
    for (var i = arr.length - 1; i >= 0; i--) {
      if (contAct == mod) {
        itemMask = arr[i] + '.' + itemMask;
        contAct = 0;
      } else {
        itemMask = arr[i] + itemMask;
      }
      contAct = parseInt(contAct) + 1;
    }
    //alert(itemMask);
    textbox.value = itemMask;
  }

  fillSelectMonth($cuotaSelect, 1, MAX_QUOTAS, 1);
  setTextInputAsIntegerFormat($purchaseInput, 'calcule()');
  setTextInputAsDecimalFormat($interestRate, 'calcule()');
  getParams([purchaseInput, interestRate, cuotaSelect]);
  calcule();

  return {
    calcule: calcule,
    clean: clean
  };
})();
