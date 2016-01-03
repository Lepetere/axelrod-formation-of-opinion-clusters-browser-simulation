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

  /* 
   * Runs a step of the simulation.
   *
   * This function modifies the passed cells array.
   */
  var runSimulationStep = function (cells) {
    if (isSimulationRunning) {
      console.log("test run");
    }
  };

  return {
    runSimulationStep: runSimulationStep,
    getNeighborPositions: getNeighborPositions,
    isSimulationRunning: isSimulationRunning,
    numberOfOpinionDimensions: numberOfOpinionDimensions,
    numberOfTraits: numberOfTraits,
    horizontalGridDimension: horizontalGridDimension,
    verticalGridDimension: verticalGridDimension,
    getNumberOfGridCells: getNumberOfGridCells
  };
})();
