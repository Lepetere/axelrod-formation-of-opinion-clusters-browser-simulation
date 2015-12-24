var APP = APP || {};

APP.UI = (function () {

  // 'constants'
  var HORIZONTAL_GRID_DIMENSION = 10,
    VERTICAL_GRID_DIMENSION = 10,
    NUMBER_OF_GRID_CELLS = HORIZONTAL_GRID_DIMENSION * VERTICAL_GRID_DIMENSION,
    SVG_WIDTH, // set in 'init'
    SVG_HEIGHT,
    NUMBER_OF_OPINION_DIMENSIONS = 2, // the number of features that each cell has
    NUMBER_OF_TRAITS = 5; // the number of traits 

  var grid;

  var GridCell = React.createClass({
    displayName: "GridCell",

    statics: {
      // generates a color to represent the trait of the currently selected feature
      generateColor: function (showTrait, traits, showOpinionDimensionNumber) {
        if (showTrait) {
          var tones = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'],
            traitTone = tones[Math.floor((traits[showOpinionDimensionNumber] / NUMBER_OF_TRAITS) * 16)];
          return '#F' + traitTone + traitTone;
        }
        else {
          // just return white for now for the similarity of neighbors // TO DO
          return '#FFF';
        }
      }
    },

    getInitialState: function () {
      var traits = [];
      for ( var i = 0; i < NUMBER_OF_OPINION_DIMENSIONS; i ++ ) {
        traits.push(Math.floor(Math.random() * NUMBER_OF_TRAITS));
      }

      return {
        // initially show the state  of the first opinion dimension (the first feature's trait)
        showOpinionDimensionNumber: 1,
        // indicates if the trait of a particular feature or the similarity between neighbors is displayed
        // set to true for the traits and to false for the similarity
        showTrait: true,
        traits: traits
      };
    },

    shouldComponentUpdate: function () {
      return true;
    },

    render: function render () {
      var position = this.props.position;

      return React.DOM.rect({
        className: 'grid-cell',
        fill: this.constructor.generateColor(this.state.showTrait, this.state.traits, this.state.showOpinionDimensionNumber),
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
