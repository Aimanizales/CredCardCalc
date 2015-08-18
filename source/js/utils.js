var Utils = (function(){

  /**
   * Convert any number to currency
   * @param  {Number} value
   * @return {String}
   */
  function convertToCurrency(value){
    var money = '';
    money += replaceText(value, ',', '');
    if(money.indexOf(".") < 0)
    for (var i = 0; i < Math.floor((money.length - (1 + i)) / 3); i++) {
      money = money.substring(0, money.length - (4 * i + 3)) + "," + money.substring(money.length - (4 * i + 3));
    } 
    return money;
  }

  /**
   * Replace any text converted to String and replace the pattern 
   * @param  {String, Number} text
   * @param  {String} patternToSearch [Original string to search]
   * @param  {String} patternNew      [String replace to]
   * @return {String} 
   */
  function replaceText(text, patternToSearch, patternNew){
    text = text.toString();
    while (text.indexOf(patternToSearch) != -1){
      text = text.replace(patternToSearch, patternNew);
    }
    return text;
  }

  return {
    convertToCurrency: convertToCurrency,
    replaceText: replaceText
  };

})();
