var APP = APP || {};

APP.UI = (function () {

  // 'constants'
  var HORIZONTAL_GRID_DIMENSION = 10,
    VERTICAL_GRID_DIMENSION = 10,
    NUMBER_OF_GRID_CELLS = HORIZONTAL_GRID_DIMENSION * VERTICAL_GRID_DIMENSION,
    SVG_WIDTH = 500, // TO DO: do not duplicate this information from css
    SVG_HEIGHT = 500, // TO DO: do not duplicate this information from css
    NUMBER_OF_OPINION_DIMENSIONS = 2, // the number of features that each cell has
    NUMBER_OF_TRAITS = 5; // the number of traits 

  var ui;

  var GridCell = React.createClass({
    displayName: "GridCell",

    statics: {
      // generates a color to represent the trait of the currently selected feature
      generateColor: function (showTrait, traits, showOpinionDimensionNumber) {
        if (showTrait) {
          var tones = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'],
            traitTone = tones[Math.floor((traits[showOpinionDimensionNumber - 1] / NUMBER_OF_TRAITS) * 16)];
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
        traits: traits
      };
    },

    render: function render () {
      var position = this.props.position;

      return React.DOM.rect({
        className: 'grid-cell',
        fill: this.constructor.generateColor(this.props.showTrait, this.state.traits, this.props.showOpinionDimensionNumber),
        x: (SVG_WIDTH / HORIZONTAL_GRID_DIMENSION) * (position % HORIZONTAL_GRID_DIMENSION),
        y: (SVG_HEIGHT / VERTICAL_GRID_DIMENSION) * ((position - (position % VERTICAL_GRID_DIMENSION)) / VERTICAL_GRID_DIMENSION)
      });
    }
  });

  var Grid = React.createClass({
    displayName: "Grid",

    render: function render () {
      var gridCells = [];
      for ( var i = 0; i < this.props.numberOfGridCells; i ++ ) {
        gridCells.push(React.createElement(GridCell, {
          position: i,
          key: i,
          showTrait: this.props.showTrait,
          showOpinionDimensionNumber: this.props.showOpinionDimensionNumber
        }));
      }

      return (
        React.createElement('svg', { className: 'grid' }, gridCells)
      );
    }
  });

  var MainInterface = React.createClass({
    displayName: "MainInterface",

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
        showTrait: true
      };
    },

    handleStartClick: function (event) {
      console.log("start button pressed");
    },

    handleShowSimilarityClick: function (event) {
      this.setState({ showTrait: ! this.state.showTrait });
    },

    handleFeatureSelectClick: function (event) {
      this.setState({ showTrait: true });
    },

    handleSelectedFeatureChanged: function (event) {
      this.setState({ showOpinionDimensionNumber: event.target.value });
    },

    shouldComponentUpdate: function (nextProps, nextState) {
      return nextState.showTrait !== this.state.showTrait ||
        nextState.showOpinionDimensionNumber !== this.state.showOpinionDimensionNumber;
    },

    render: function render () {
      var description_pt1 = "This is an implementation of a model simulating opinion diversity and clustering in a society " + 
        "as proposed by the american political scientist Robert Axelrod. The model simulates social self-organization " +
        "through the interplay of the two phenomena social influence and homophily.",
        description_pt2 = "Every square that you see in the middle of the window represents a cell which has an opinion, " +
        "called trait, about a limited amount of opinion dimensions, called features. If you press 'start simulation', " +
        "they will influence each other and exchange opinions after the algorithm suggested by Robert Axelrod.",
        description_pt3 = "You can read how it works in detail in my blog post at http://www.peterfessel.com/tbd",
        featureSelectOptions = [];
      for ( var i = 1; i <= NUMBER_OF_OPINION_DIMENSIONS; i ++ ) {
        featureSelectOptions.push(React.DOM.option({ key: 'feature_' + i, value: i }, "show feature #" + i));
      }

      return (
        React.DOM.div({ id: 'main-interface', className: 'main-interface' }, 
          React.createElement(Grid, { 
            numberOfGridCells: NUMBER_OF_GRID_CELLS,
            showTrait: this.state.showTrait,
            showOpinionDimensionNumber: this.state.showOpinionDimensionNumber
          }),
          React.DOM.a({
            id: 'about-tooltip',
            className: 'about-tooltip text-button'
          }, "What is this?",
          React.DOM.span({ className: 'tooltip-content' },
            description_pt1, React.DOM.br(), React.DOM.br(),
            description_pt2, React.DOM.br(), React.DOM.br(),
            description_pt3)),
          React.DOM.div({ id: 'button-container', className: 'button-container' },
            React.DOM.a({
              id: 'start-button',
              className: 'text-button clickable',
              onClick: this.handleStartClick
            }, "start simulation"),
            " | ",
            React.DOM.select({
              id: 'feature-select',
              className: classNames('text-button', 'clickable', { 'button-active': this.state.showTrait }),
              onChange: this.handleSelectedFeatureChanged,
              onClick: this.handleFeatureSelectClick
            }, featureSelectOptions),
            " | ",
            React.DOM.a({
              className: classNames('text-button', 'clickable', { 'button-active': ! this.state.showTrait }),
              onClick: this.handleShowSimilarityClick
            }, "show similarity")))
      );
    }
  });

  var init = function () {
    ui = ReactDOM.render(
      React.createElement(MainInterface),
      document.getElementById('main-container')
    );
  };

  return {
    init: init
  };
})();
;

APP.UI.init();