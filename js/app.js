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
          var traitTone = tones[Math.floor((traits[showOpinionDimensionNumber - 1] / APP.simulation.getNumberOfTraits()) * 16)];
          return '#F' + traitTone + traitTone;
        }
        else {
          var numberOfTraits = APP.simulation.getNumberOfTraits(),
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
        verticalGridDimension = APP.simulation.getVerticalGridDimension(),
        horizontalGridDimension = APP.simulation.getHorizontalGridDimension();

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
      var numberOfOpinionDimensions = APP.simulation.getNumberOfOpinionDimensions(),
        numberOfTraits = APP.simulation.getNumberOfTraits();

      cells = [];
      for ( var i = 0; i < this.props.numberOfGridCells; i ++ ) {
        cells.push(React.createElement(GridCell, {
          position: i,
          key: i,
          traits: this.constructor.generateRandomTraits(numberOfOpinionDimensions, numberOfTraits),
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

  /* displays a short general description about the simulation on hover */
  var DescriptionTooltip = React.createClass({
    displayName: "DescriptionTooltip",

    render: function render () {
      var description_pt1 = "This is an implementation of a model simulating opinion diversity and clustering in a society " + 
        "as proposed by the american political scientist Robert Axelrod. The model simulates social self-organization " +
        "through the interplay of the two phenomena social influence and homophily.",
        description_pt2 = "Every square that you see in the middle of the window represents a cell which has an opinion, " +
        "called trait, about a limited amount of opinion dimensions, called features. If you press 'start simulation', " +
        "they will influence each other and exchange opinions after the algorithm suggested by Robert Axelrod.",
        description_pt3 = "You can read how it works in detail in my blog post at http://www.peterfessel.com/tbd";

      return (
        React.DOM.a({
            id: 'about-tooltip',
            className: 'about-tooltip tooltip text-button'
          }, "What is this?",
          React.DOM.span({ className: 'tooltip-content' },
            description_pt1, React.DOM.br(), React.DOM.br(),
            description_pt2, React.DOM.br(), React.DOM.br(),
            description_pt3))
      );
    }
  });

  /* displays a helper tooltip about changing the simulation properties on hover */
  var SimulationPropertyControlsTooltip = React.createClass({
    displayName: "SimulationPropertyControlsTooltip",

    render: function render () {
      var description_pt1 = "Use the above toggles to change the simulation's properties and see how they influence the " +
        "outcome. Note that changing the number of opinion dimensions and traits as well as the grid size will " +
        "restart the simulation.",
        description_pt2 = "Changing the timestep will increase or descrease the speed of the simulation and is also " +
        "possible while the simulation is running.";

      return (
        React.DOM.a({
            id: 'simulation-properties-tooltip',
            className: 'simulation-properties-tooltip tooltip text-button'
          }, "?",
          React.DOM.span({ className: 'tooltip-content' }, description_pt1, React.DOM.br(), React.DOM.br(), description_pt2))
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

    handleGridDimensionsChanged: function (event) {
      APP.simulation.setGridDimension(event.target.value);
      this.forceUpdate();
    },

    handleOpinionDimensionsChanged: function (event) {
      APP.simulation.setNumberOfOpinionDimensions(event.target.value);
      this.forceUpdate();
    },

    handleTraitsChanged: function (event) {
      APP.simulation.setNumberOfTraits(event.target.value);
      this.forceUpdate();
    },

    handleTimestepChanged: function (event) {
      APP.simulation.setTimestep(event.target.value);
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
        featureSelectOptions = [],
        gridDimensionOptions = [],
        opinionDimensionOptions = [],
        numberOfTraitsOptions = [],
        timestepOptions = [];

      for ( var i = 1; i <= APP.simulation.getNumberOfOpinionDimensions(); i ++ ) {
        featureSelectOptions.push(React.DOM.option({ key: 'feature_' + i, value: i }, "show feature #" + i));
      }

      for ( var i = 1; i <= 10; i ++ ) {
        gridDimensionOptions.push(React.DOM.option({ key: 'dimension_opt_' + i, value: i * 10 }, i * 10 + "x" + i * 10 + " grid"));
      }

      for ( var i = 1; i <= 10; i ++ ) {
        opinionDimensionOptions.push(React.DOM.option({ key: 'opinion_dimension_opt_' + i, value: i }, i + " opinion dimensions"));
      }

      for ( var i = 2; i <= 10; i ++ ) {
        numberOfTraitsOptions.push(React.DOM.option({ key: 'number_of_traits_opt_' + i, value: i }, i + " traits"));
      }

      for ( var i = 50; i >= 10; i -= 10 ) {
        timestepOptions.push(React.DOM.option({ key: 'timestep_opt_' + i, value: i }, "timestep " + i + "ms"));
      }

      return (
        React.DOM.div({ id: 'main-interface', className: 'main-interface' }, 
          React.createElement(Grid, { 
            numberOfGridCells: APP.simulation.getNumberOfGridCells(),
            showTrait: this.state.showTrait,
            showOpinionDimensionNumber: this.state.showOpinionDimensionNumber
          }),
          React.createElement(DescriptionTooltip),
          React.DOM.div({ id: 'center-button-container', className: 'center-button-container' },
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
            }, "show similarity")),
          React.DOM.div({ id: 'simulation-property-controls', className: 'simulation-property-controls' },
            React.DOM.select({
              id: 'grid-dimension-select',
              className: 'text-button clickable',
              onChange: this.handleGridDimensionsChanged
            }, gridDimensionOptions),
            React.DOM.select({
              id: 'opinion-dimension-select',
              className: 'text-button clickable',
              value: APP.simulation.getNumberOfOpinionDimensions(),
              onChange: this.handleOpinionDimensionsChanged
            }, opinionDimensionOptions),
            React.DOM.select({
              id: 'number-of-traits-select',
              className: 'text-button clickable',
              value: APP.simulation.getNumberOfTraits(),
              onChange: this.handleTraitsChanged
            }, numberOfTraitsOptions),
            React.DOM.select({
              id: 'timestep-select',
              className: 'text-button clickable',
              onChange: this.handleTimestepChanged
            }, timestepOptions),
            React.createElement(SimulationPropertyControlsTooltip)))
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

  var getHorizontalGridDimension = function () {
    return horizontalGridDimension;
  };

  var getVerticalGridDimension = function () {
    return verticalGridDimension;
  };

  var getNumberOfOpinionDimensions = function () {
    return numberOfOpinionDimensions;
  };

  var getNumberOfTraits = function () {
    return numberOfTraits;
  };

  /*
   * Sets horizontal and vertical grid dimension to the passed value.
   */
  var setGridDimension = function (dimension) {
    horizontalGridDimension = dimension;
    verticalGridDimension = dimension;
  };

  var setTimestep = function (timestepInMilliseconds) {
    simulationTimeStep = timestepInMilliseconds;
  };

  var setNumberOfOpinionDimensions = function (newNumberOfOpinionDimensions) {
    numberOfOpinionDimensions = newNumberOfOpinionDimensions;
  };

  var setNumberOfTraits = function (newNumberOfTraits) {
    numberOfTraits = newNumberOfTraits;
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
    getHorizontalGridDimension: getHorizontalGridDimension,
    getVerticalGridDimension: getVerticalGridDimension,
    setGridDimension: setGridDimension,
    getNumberOfGridCells: getNumberOfGridCells,
    setTimestep: setTimestep,
    getNumberOfOpinionDimensions: getNumberOfOpinionDimensions,
    setNumberOfOpinionDimensions: setNumberOfOpinionDimensions,
    getNumberOfTraits: getNumberOfTraits,
    setNumberOfTraits: setNumberOfTraits
  };
})();
;

APP.UI.init();