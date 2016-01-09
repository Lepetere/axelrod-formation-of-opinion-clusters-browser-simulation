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
    horizontalGridDimension = parseInt(dimension);
    verticalGridDimension = parseInt(dimension);
  };

  var setTimestep = function (timestepInMilliseconds) {
    simulationTimeStep = parseInt(timestepInMilliseconds);
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
