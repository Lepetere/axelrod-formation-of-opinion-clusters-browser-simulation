var APP = APP || {};

APP.UI = (function () {

  var init = function () {
    console.log("init");
  };
	
  var module = {};
  module.init = init;
  return module;
})();
;

$(document).ready(function () {
  APP.UI.init();
});