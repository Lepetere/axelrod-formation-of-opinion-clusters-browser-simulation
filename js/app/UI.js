var APP = APP || {};

APP.UI = (function () {

  // 'constants'
  var SVG_WIDTH = 500,
    SVG_HEIGHT = 500;

  var GridCell = React.createClass({
    displayName: "GridCell",

    // generates a color to represent the trait of the currently selected feature
    generateColor: function () {
      var colors = ['#e60000', '#ffa31a', '#ffff4d', '#009900', '#8cff66', '#1affff', '#3838ad',
                    '#1a75ff', '#ff00be', '#000066', '#994b00'],
        showOpinionDimensionNumber = this.props.showOpinionDimensionNumber,
        showTrait = this.props.showTrait,
        ownTraits = this.props.traits,
        allCellTraits = this.props.allCellTraits,
        cellPosition = this.props.position;

      if (showTrait) {
        return colors[ownTraits[showOpinionDimensionNumber - 1]];
      }
      else {
        // compute a color to represent the similarity of neighbors
        var tones = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'],
          numberOfTraits = APP.simulation.getNumberOfTraits(),
          amountOfMatchingTraits = 0,
          ratioOfMatchingTraits,
          traitTone;

        APP.simulation.getNeighborPositions(cellPosition).forEach(function (cellPosition) {
          allCellTraits[cellPosition].forEach(function (neighborTrait, index) {
            if (neighborTrait == ownTraits[index]) amountOfMatchingTraits ++;
          });
        });

        ratioOfMatchingTraits = amountOfMatchingTraits / (APP.simulation.getNumberOfOpinionDimensions() * 4); // 4 neighbors
        traitTone = tones[Math.floor(ratioOfMatchingTraits * 15)];
        return '#' + traitTone + traitTone + traitTone;
      }
    },

    render: function render () {
      var position = this.props.position,
        verticalGridDimension = APP.simulation.getVerticalGridDimension(),
        horizontalGridDimension = APP.simulation.getHorizontalGridDimension(),
        gridCellHeight = Math.ceil(SVG_HEIGHT / horizontalGridDimension) + 1, // + 1 to make sure there are no gaps ...
        gridCellWidth = Math.ceil(SVG_WIDTH / verticalGridDimension) + 1; // ... whatever the grid dimensions

      return React.DOM.rect({
        className: 'grid-cell',
        fill: this.generateColor(),
        height: gridCellHeight,
        width: gridCellWidth,
        x: (SVG_WIDTH / horizontalGridDimension) * (position % horizontalGridDimension),
        y: (SVG_HEIGHT / verticalGridDimension) * ((position - (position % verticalGridDimension)) / verticalGridDimension)
      });
    }
  });

  var StartStopToggle = React.createClass({
    displayName: "StartStopToggle",

    getInitialState: function () {
      return {
        isSimulationRunning: false
      };
    },

    stopSimulation: function () {
      this.setState({ isSimulationRunning: false });
      APP.simulation.stopSimulation();
    },

    handleStartStopClick: function (event) {
      this.setState({ isSimulationRunning: ! this.state.isSimulationRunning });
      // pass a reference to the top ui element so that the cells which are part of the ui's state can be modified
      // and the forceUpdate method can be invoked
      APP.simulation.toggleIsSimulationRunning(this.props.uiReference, this.props.cellTraits);
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
        "through the interplay of two phenomena called social influence and homophily.",
        description_pt2 = "Every square that you see in the middle of the window represents a cell which has an opinion, " +
        "called trait, about a limited amount of opinion dimensions, called features. You can consider those cells " +
        "being individuals in a society. If you press 'start simulation', " +
        "they will influence each other and exchange opinions after the algorithm suggested by Robert Axelrod.",
        description_pt3 = "You can read how it works in detail in my blog post at ",
        blogLink = "http://www.peterfessel.com/2016/01/modeling-formation-of-opinion-clusters-cellular-automata/",
        description_pt4 = "This is built for Firefox and Chrome. Use one of those browsers to make sure everything runs smoothly.";

      return (
        React.DOM.span({
            id: 'about-tooltip',
            className: 'about-tooltip tooltip text-button'
          }, "What is this?",
          React.DOM.span({ className: 'tooltip-content' },
            description_pt1, React.DOM.br(), React.DOM.br(),
            description_pt2, React.DOM.br(), React.DOM.br(),
            description_pt3, React.DOM.a({ href: blogLink, target: '_blank'}, blogLink),
            React.DOM.br(), React.DOM.br(), description_pt4))
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
        description_pt2 = "Changing the timestep will increase or decrease the speed of the simulation and is also " +
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

  /* displays a helper tooltip next to the simulation control buttons in the center of the window */
  var SimulationControlsTooltip = React.createClass({
    displayName: "SimulationControlsTooltip",

    render: function render () {
      var description_pt1 = "Press 'start simulation' to run the simulation.",
        description_pt2 = "With the middle button you can switch the view between the different features (opinion dimensions).",
        description_pt3 = "The button on the right, 'show similarity' activates a view that takes all features into account and " +
          "displays how many traits a cell has in common with its neighbors. The more white the cell is displayed, the more " +
          "traits it has in common with its neighbors.";

      return (
        React.DOM.a({
            id: 'simulation-controls-tooltip',
            className: 'simulation-controls-tooltip tooltip text-button'
          }, "?",
          React.DOM.span({ className: 'tooltip-content' },
            description_pt1, React.DOM.br(), React.DOM.br(),
            description_pt2, React.DOM.br(), React.DOM.br(), description_pt3))
      );
    }
  });

  /* This is the top level interface component. All other interface parts are children of this component. */
  var MainInterface = React.createClass({
    displayName: "MainInterface",

    /*
     * Generates an array of random traits for an amount of cells specified by the grid size
     * and amount of traits and features in the simulation module.
     *
     * This method is invoked when the app is initialized (componentWillMount) and every time
     * the simulation properties are modified by the user.
     */
    generateNewCellTraits: function () {
      var numberOfGridCells = APP.simulation.getNumberOfGridCells(),
        numberOfOpinionDimensions = APP.simulation.getNumberOfOpinionDimensions(),
        numberOfTraits = APP.simulation.getNumberOfTraits(),
        cellTraits = [];

      for ( var i_gc = 0; i_gc < numberOfGridCells; i_gc ++ ) {
        var traits = [];
        for ( var i_od = 0; i_od < numberOfOpinionDimensions; i_od ++ ) {
          traits.push(Math.floor(Math.random() * numberOfTraits));
        }
        cellTraits.push(traits);
      }
      
      return cellTraits;
    },

    getInitialState: function () {
      return {
        // initially show the state  of the first opinion dimension (the first feature's trait)
        showOpinionDimensionNumber: 1,
        // indicates if the trait of a particular feature or the similarity between neighbors is displayed
        // set to true for the traits and to false for the similarity
        showTrait: true,
        cellTraits: this.generateNewCellTraits()
      };
    },

    forceStopOfSimulation: function () {
      this.setState({ cellTraits: null });
      this.refs.startStopToggle.stopSimulation();
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
      this.forceStopOfSimulation();
      APP.simulation.setGridDimension(event.target.value);
      this.setState({ cellTraits: this.generateNewCellTraits() });
      this.forceUpdate();
    },

    handleOpinionDimensionsChanged: function (event) {
      this.forceStopOfSimulation();
      APP.simulation.setNumberOfOpinionDimensions(event.target.value);
      this.setState({ cellTraits: this.generateNewCellTraits() });
      this.forceUpdate();
    },

    handleTraitsChanged: function (event) {
      this.forceStopOfSimulation();
      APP.simulation.setNumberOfTraits(event.target.value);
      this.setState({ cellTraits: this.generateNewCellTraits() });
      this.forceUpdate();
    },

    handleSpeedChanged: function (event) {
      APP.simulation.setSpeed(event.target.value);
    },

    shouldComponentUpdate: function (nextProps, nextState) {
      return nextState.showTrait !== this.state.showTrait ||
        nextState.showOpinionDimensionNumber !== this.state.showOpinionDimensionNumber;
    },

    render: function render () {
      var featureSelectOptions = [],
        gridDimensionOptions = [],
        opinionDimensionOptions = [],
        numberOfTraitsOptions = [],
        timestepOptions = [],
        numberOfOpinionDimensions = APP.simulation.getNumberOfOpinionDimensions(),
        numberOfTraits = APP.simulation.getNumberOfTraits(),
        numberOfGridCells = APP.simulation.getNumberOfGridCells(),
        cells = [];

      /* generate select options */
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

      ["speed: 1 (slow)", "speed: 2", "speed: 3 (medium)", "speed: 4", "speed: 5 (fast)"].forEach(function (speedString, index) {
        timestepOptions.push(React.DOM.option({ key: 'speed_opt_' + index, value: index + 1 }, speedString));
      });

      /* generate cells */
      for ( var i = 0; i < numberOfGridCells; i ++ ) {
        cells.push(React.createElement(GridCell, {
          position: i,
          key: i,
          traits: this.state.cellTraits[i],
          // we are passing the whole cellTraits array as well, so that the cell can look up traits of neighbors
          allCellTraits: this.state.cellTraits,
          showTrait: this.state.showTrait,
          showOpinionDimensionNumber: this.state.showOpinionDimensionNumber
        }));
      }

      return (
        React.DOM.div({ id: 'main-interface', className: 'main-interface' },
          React.createElement('svg', { className: 'grid', height: SVG_HEIGHT, width: SVG_WIDTH }, cells),
          React.createElement(DescriptionTooltip),
          React.DOM.div({ id: 'center-button-container', className: 'center-button-container' },
            React.createElement(StartStopToggle, {
              uiReference: this,
              cellTraits: this.state.cellTraits,
              ref: 'startStopToggle'
            }),
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
            }, "show similarity"),
            " | ",
            React.createElement(SimulationControlsTooltip)),
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
              onChange: this.handleSpeedChanged
            }, timestepOptions),
            React.createElement(SimulationPropertyControlsTooltip)))
      );
    }
  });

  var init = function () {
    ReactDOM.render(
      React.createElement(MainInterface),
      document.getElementById('main-container')
    );
  };

  return {
    init: init
  };
})();
