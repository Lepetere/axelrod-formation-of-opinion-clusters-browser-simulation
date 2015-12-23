var APP = APP || {};

APP.UI = (function () {

  // 'constants'
  var HORIZONTAL_GRID_DIMENSION = 10,
    VERTICAL_GRID_DIMENSION = 10,
    NUMBER_OF_GRID_CELLS = HORIZONTAL_GRID_DIMENSION * VERTICAL_GRID_DIMENSION,
    SVG_WIDTH, // set in 'init'
    SVG_HEIGHT; // set in 'init'

  var grid;

  var GridCell = React.createClass({
    displayName: "GridCell",

    statics: {
      // generates a random tone of red
      generateColor: function () {
        var randomNumber = Math.floor(Math.random() * 9);
        return '#F' + randomNumber + randomNumber;
      }
    },

    getInitialState: function () {
      // TO DO: randomize initial state
      return {};
    },

    shouldComponentUpdate: function () {
      return true;
    },

    render: function render () {
      var position = this.props.position;

      return React.DOM.rect({
        className: 'grid-cell',
        fill: this.constructor.generateColor(),
        x: (SVG_WIDTH / HORIZONTAL_GRID_DIMENSION) * (position % HORIZONTAL_GRID_DIMENSION),
        y: (SVG_HEIGHT / VERTICAL_GRID_DIMENSION) * ((position - (position % VERTICAL_GRID_DIMENSION)) / VERTICAL_GRID_DIMENSION)
      });
    }
  });

  var Grid = React.createClass({
    displayName: "Grid",

    shouldComponentUpdate: function () {
      return true;
    },

    render: function render () {
      var gridCells = [];
      for ( var i = 0; i < this.props.numberOfGridCells; i ++ ) {
        gridCells.push(React.createElement(GridCell, { position: i, key: i }));
      }

      return (
        React.createElement('svg', { className: 'grid' }, gridCells)
      );
    }
  });

  var init = function () {
    SVG_WIDTH = $('.grid-container').outerWidth(false); // set in CSS
    SVG_HEIGHT = $('.grid-container').outerHeight(false); // set in CSS
    $('#start-button').click(initGrid);
    initGrid();
  };

  function initGrid () {
    grid = ReactDOM.render(
      React.createElement(Grid, { numberOfGridCells: NUMBER_OF_GRID_CELLS }),
      document.getElementById('grid-container'));
  }
	
  var module = {};
  module.init = init;
  return module;
})();
