var APP = APP || {};

APP.UI = (function () {

  // 'constants'
  var SVG_WIDTH = 500,
    SVG_HEIGHT = 500;

  var ui, cells;

  var GridCell = React.createClass({
    displayName: "GridCell",

    statics: {
      // generates a color to represent the trait of the currently selected feature
      generateColor: function (showTrait, traits, showOpinionDimensionNumber, cellPosition) {
        var tones = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];

        if (showTrait) {
          var traitTone = tones[Math.floor((traits[showOpinionDimensionNumber - 1] / APP.simulation.numberOfTraits) * 16)];
          return '#F' + traitTone + traitTone;
        }
        else {
          var numberOfTraits = APP.simulation.numberOfTraits,
            amountOfMatchingTraits = 0,
            ratioOfMatchingTraits,
            traitTone;

          APP.simulation.getNeighborPositions(cellPosition).forEach(function (cellPosition) {
            cells[cellPosition].props.traits.forEach(function (neighborTrait, index) {
              if (neighborTrait == traits[index]) amountOfMatchingTraits ++;
            });
          });

          ratioOfMatchingTraits = amountOfMatchingTraits / (numberOfTraits * numberOfTraits);
          traitTone = tones[Math.floor(ratioOfMatchingTraits * 16)];
          return traitTone + traitTone + traitTone;
        }
      }
    },

    render: function render () {
      var position = this.props.position,
        showOpinionDimensionNumber = this.props.showOpinionDimensionNumber,
        verticalGridDimension = APP.simulation.verticalGridDimension,
        horizontalGridDimension = APP.simulation.horizontalGridDimension;

      return React.DOM.rect({
        className: 'grid-cell',
        fill: this.constructor.generateColor(this.props.showTrait, this.props.traits, showOpinionDimensionNumber, position),
        x: (SVG_WIDTH / horizontalGridDimension) * (position % horizontalGridDimension),
        y: (SVG_HEIGHT / verticalGridDimension) * ((position - (position % verticalGridDimension)) / verticalGridDimension)
      });
    }
  });

  var Grid = React.createClass({
    displayName: "Grid",

    statics: {
      generateRandomTraits: function (numberOfOpinionDimensions, numberOfTraits) {
        var traits = [];
        for ( var i = 0; i < numberOfOpinionDimensions; i ++ ) {
          traits.push(Math.floor(Math.random() * numberOfTraits));
        }
        return traits;
      }
    },

    render: function render () {
      cells = [];
      for ( var i = 0; i < this.props.numberOfGridCells; i ++ ) {
        cells.push(React.createElement(GridCell, {
          position: i,
          key: i,
          traits: this.constructor.generateRandomTraits(APP.simulation.numberOfOpinionDimensions, APP.simulation.numberOfTraits),
          showTrait: this.props.showTrait,
          showOpinionDimensionNumber: this.props.showOpinionDimensionNumber
        }));
      }

      return (
        React.createElement('svg', { className: 'grid', height: SVG_HEIGHT, width: SVG_WIDTH }, cells)
      );
    }
  });

  var StartStopToggle = React.createClass({
    displayName: "StartStopToggle",

    getInitialState: function () {
      return {
        isSimulationRunning: false
      };
    },

    handleStartStopClick: function (event) {
      this.setState({ isSimulationRunning: ! this.state.isSimulationRunning });
      APP.simulation.toggleIsSimulationRunning(cells);
    },

    render: function render () {
      return (
        React.DOM.a({
          id: 'start-button',
          className: 'text-button clickable',
          onClick: this.handleStartStopClick
        }, this.state.isSimulationRunning ? "stop simulation" : "start simulation")
      );
    }
  });

  var MainInterface = React.createClass({
    displayName: "MainInterface",

    getInitialState: function () {
      return {
        // initially show the state  of the first opinion dimension (the first feature's trait)
        showOpinionDimensionNumber: 1,
        // indicates if the trait of a particular feature or the similarity between neighbors is displayed
        // set to true for the traits and to false for the similarity
        showTrait: true
      };
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

      for ( var i = 1; i <= APP.simulation.numberOfOpinionDimensions; i ++ ) {
        featureSelectOptions.push(React.DOM.option({ key: 'feature_' + i, value: i }, "show feature #" + i));
      }

      return (
        React.DOM.div({ id: 'main-interface', className: 'main-interface' }, 
          React.createElement(Grid, { 
            numberOfGridCells: APP.simulation.getNumberOfGridCells(),
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
            React.createElement(StartStopToggle),
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

var APP = APP || {};

APP.simulation = (function () {

  var numberOfOpinionDimensions = 2, // the number of features that each cell has
    numberOfTraits = 5, // the number of traits that each cell can take for each feature
    horizontalGridDimension = 10,
    verticalGridDimension = 10,
    simulationTimeStep = 50,
    isSimulationRunning = false;

  var getNumberOfGridCells = function () {
    return horizontalGridDimension * verticalGridDimension;
  };

  /* 
   * Returns an array of 4 neighbor's positions for a given 
   * cell position in the cells array in the following format:
   *
   * [ upperNeighbor, rightNeighbor, lowerNeighbor, leftNeighbor ]
   */
  var getNeighborPositions = function (cellPosition) {
    var cellArrayLength = getNumberOfGridCells();

    if (cellPosition >= 0 && cellPosition < cellArrayLength) {
      var upperNeighbor, rightNeighbor, lowerNeighbor, leftNeighbor;

      // upper neighbor
      if (cellPosition - horizontalGridDimension >= 0) {
        upperNeighbor = cellPosition - horizontalGridDimension;
      }
      else {
        upperNeighbor = cellArrayLength + cellPosition - horizontalGridDimension;
      }

      // right neighbor
      if (cellPosition + 1 == cellArrayLength) {
        rightNeighbor = 0;
      }
      else if (cellPosition + 1 % horizontalGridDimension !== 0) {
        rightNeighbor = cellPosition + 1;
      }
      else {
        rightNeighbor = cellPosition - horizontalGridDimension + 1;
      }

      // lower neighbor
      if (cellPosition + horizontalGridDimension < cellArrayLength) {
        lowerNeighbor = cellPosition + horizontalGridDimension;
      }
      else {
        lowerNeighbor = cellPosition + horizontalGridDimension - cellArrayLength;
      }

      // left neighbor
      if (cellPosition % horizontalGridDimension !== 0) {
        leftNeighbor = cellPosition - 1;
      }
      else {
        leftNeighbor = cellPosition + horizontalGridDimension - 1;
      }

      return [ upperNeighbor, rightNeighbor, lowerNeighbor, leftNeighbor ];
    }
    else {
      var message = "getNeighborPositions() must be called with an index within the boundaries of the cell array length " +
        "but was called with position " + cellPosition;
      throw new Error(message);
    }
  };

  var toggleIsSimulationRunning = function (cells) {
    isSimulationRunning = ! isSimulationRunning;
    if (isSimulationRunning) runSimulationStep(cells);
  };

  /* 
   * Runs a step of the simulation and schedule the next one if the simulation is still running.
   *
   * This function modifies the passed cells array.
   */
  var runSimulationStep = function (cells) {
    console.log("test run");

    if (isSimulationRunning) {
      setTimeout(runSimulationStep, simulationTimeStep, cells);
    }
  };

  return {
    toggleIsSimulationRunning: toggleIsSimulationRunning,
    isSimulationRunning: isSimulationRunning,
    getNeighborPositions: getNeighborPositions,
    numberOfOpinionDimensions: numberOfOpinionDimensions,
    numberOfTraits: numberOfTraits,
    horizontalGridDimension: horizontalGridDimension,
    verticalGridDimension: verticalGridDimension,
    getNumberOfGridCells: getNumberOfGridCells
  };
})();
;

APP.UI.init();