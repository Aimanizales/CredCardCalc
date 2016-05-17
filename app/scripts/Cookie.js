var cookieClosure = (function(){
  'use strict';

  var c = 'test';

  function createCookie(name,value,seconds) {
    var date,
      expires;

    if (seconds) {
      date = new Date();
      date.setTime(date.getTime()+(seconds*1000));
      expires = '; expires=' + date.toGMTString();
    } else {
      expires = "";
    }
    document.cookie = name + '=' + value + expires + '; path=/';
  }

  function readCookie(name) {
    var nameEQ = name + "=",
      c,
      ca = document.cookie.split(';');
    
    for(var i = 0; i < ca.length; i++) {
      c = ca[i];
      
      while (c.charAt(0) === ' '){
        c = c.substring(1,c.length);
      } 
      if (c.indexOf(nameEQ) === 0) {
        return c.substring(nameEQ.length,c.length);
      }
    }
    return '';
  }

  function eraseCookie(name) {
    cookieClosure.createCookie(name,'',-1);
  }

  return {
    createCookie: createCookie,
    readCookie: readCookie,
    eraseCookie: eraseCookie    
  };
})();