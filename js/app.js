var APP = APP || {};

APP.UI = (function () {

  var init = function () {
    $('#start-button').click(initGrid);
    initGrid();
  };

  function initGrid () {
    $('#main-grid-container').empty();

    for ( var i = 0; i < 100; i ++ ) {
      var newGridCell = $('<div class="grid-cell"></div>'),
        randomNumber = Math.floor(Math.random() * 9),
        color = '#F' + randomNumber + randomNumber;
      $(newGridCell).css('background-color', color);
      $('#main-grid-container').append(newGridCell);
    }
  }
	
  var module = {};
  module.init = init;
  return module;
})();
;

$(document).ready(function () {
  APP.UI.init();
});