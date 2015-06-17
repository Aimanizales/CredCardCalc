var creditCard = {};

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

function calcule() {
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

//llenamos el select
fillSelectMonth($cuotaSelect, 1, MAX_QUOTAS, 1);

//damos el formato a los text input
setTextInputAsIntegerFormat($purchaseInput, 'calcule()');
setTextInputAsDecimalFormat($interestRate, 'calcule()');

//obtenemos los parametros almacenados
getParams([purchaseInput, interestRate, cuotaSelect]);

//calculamos el valor
calcule();