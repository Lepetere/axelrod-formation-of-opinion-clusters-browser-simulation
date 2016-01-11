var APP = APP || {};

APP.simulation = (function () {

  var numberOfOpinionDimensions = 2, // the number of features that each cell has
    numberOfTraits = 5, // the number of traits that each cell can take for each feature
    horizontalGridDimension = 10,
    verticalGridDimension = 10,
    isSimulationRunning = false,
    simulationSpeed = 1;

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
    horizontalGridDimension = parseInt(dimension);
    verticalGridDimension = parseInt(dimension);
  };

  var setSpeed = function (speed) {
    simulationSpeed = parseInt(speed);
  };

  /*
   * Returns the interval length for the simulation in milliseconds.
   */
  var getTimestep = function () {
    return (1 / simulationSpeed) * 5000 / getNumberOfGridCells();
  };

  var setNumberOfOpinionDimensions = function (newNumberOfOpinionDimensions) {
    numberOfOpinionDimensions = parseInt(newNumberOfOpinionDimensions);
  };

  var setNumberOfTraits = function (newNumberOfTraits) {
    numberOfTraits = parseInt(newNumberOfTraits);
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

  var toggleIsSimulationRunning = function (uiReference, cellTraits) {
    isSimulationRunning = ! isSimulationRunning;
    if (isSimulationRunning) runSimulationStep(uiReference, cellTraits);
  };

  /* 
   * Runs a step of the simulation and schedule the next one if the simulation is still running.
   *
   * This function modifies the 'cellTraits' state of the uiReference (top level ui component).
   */
  var runSimulationStep = function (uiReference, cellTraits) {
    var randomCellPosition = Math.floor(Math.random() * getNumberOfGridCells()),
      randomNeighborPosition = getNeighborPositions(randomCellPosition)[Math.floor(Math.random() * 4)], // 4 neighbors
      amountOfMatchingTraits = 0,
      unsimilarTraitIndices = [],
      ratioOfMatchingTraits;

    for ( var i = 0; i < getNumberOfTraits(); i ++ ) {
      if (cellTraits[randomCellPosition][i] === cellTraits[randomNeighborPosition][i]) {
        amountOfMatchingTraits ++;
      }
      else {
        unsimilarTraitIndices.push(i)
      }
    }

    var ratioOfMatchingTraits = amountOfMatchingTraits / getNumberOfTraits();

    if (unsimilarTraitIndices.length && Math.random() <= ratioOfMatchingTraits) {
      // pick a random one of the traits that the neighbors don't have in common yet
      // and set it on the neighbor so that it is the same as on the random cell
      var unsimilarRandomTraitIndex = unsimilarTraitIndices[Math.floor(Math.random() * unsimilarTraitIndices.length)];
      cellTraits[randomNeighborPosition][unsimilarRandomTraitIndex] = cellTraits[randomCellPosition][unsimilarRandomTraitIndex];
      uiReference.setState({ cellTraits: cellTraits });
      uiReference.forceUpdate();
    }

    if (isSimulationRunning) {
      setTimeout(runSimulationStep, getTimestep(), uiReference, cellTraits);
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
    setSpeed: setSpeed,
    getNumberOfOpinionDimensions: getNumberOfOpinionDimensions,
    setNumberOfOpinionDimensions: setNumberOfOpinionDimensions,
    getNumberOfTraits: getNumberOfTraits,
    setNumberOfTraits: setNumberOfTraits
  };
})();
