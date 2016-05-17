var Utils = (function(){

  /**
   * Convert any number to currency:
   * @param  {Number} value
   * @return {String}
   * Better replace by this funtion:
   * http://stackoverflow.com/questions/149055/how-can-i-format-numbers-as-money-in-javascript
   */
  function convertToCurrency(currency, value){
    var money = replaceText(value, ',', '');
    //debugger;
    // for (var i = 0; i < Math.floor((money.length - (1 + i)) / 3); i++) {
    //   console.log('before:', i, money);
    //   money = money.substring(0, money.length - (4 * i + 3)) + "," + money.substring(money.length - (4 * i + 3));
    //   console.log('after:', i, money);
    // } 
    /**
     * \d : any digit
     * (\d{3}): one group of any digit 3 times. e.g: 123, 345, 555, 
     * ?=     : http://www.regular-expressions.info/lookaround.html
     */
    return money.toFixed(0).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
  }

  /**
   * Replace any text converted to String and replace the pattern 
   * @param  {String, Number} text
   * @param  {String}         patternToSearch [Original string to search]
   * @param  {String}         patternNew      [String replace to]
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
