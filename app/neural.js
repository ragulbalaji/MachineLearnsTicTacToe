var fs = require('fs'),
    _string = require('string'),
    synaptic = require('synaptic');
var Neuron = synaptic.Neuron,
    Layer = synaptic.Layer,
    Network = synaptic.Network,
    Trainer = synaptic.Trainer,
    Architect = synaptic.Architect;
var trainingSet = [];
var dataPath = "data/trainingdata.json";
module.exports.dataPath = dataPath;
module.exports.trainingSet = trainingSet;
function Perceptron(input, hidden, output){
  // create the layers
  var inputLayer = new Layer(input);
  var hiddenLayer = new Layer(hidden);
  var outputLayer = new Layer(output);

  // connect the layers
  inputLayer.project(hiddenLayer);
  hiddenLayer.project(outputLayer);
  // set the layers
  this.set({
    input: inputLayer,
    hidden: [hiddenLayer],
    output: outputLayer
  });
}
function loadTrainingData(callback) {
    fs.readFile(dataPath, function (err, data) {
        if (err) {
            console.error("File read error", err);
            return;
        }
        var toParse = _string(data).ensureLeft('[')
            .ensureRight(']').replaceAll('}{', '},{').s; //var created for readability

        trainingSet = JSON.parse(toParse);
        if (callback) callback(true);
    });
}
function train(iterations) {
    if (trainingSet.length > 10) {
        trainer.train(trainingSet, {
            rate: 0.01,
            iterations: iterations, // This seem very very excessive
            log: 250,
            error: 0.05,
            cost: Trainer.cost.CROSS_ENTROPY
        });
    }
}
module.exports.train = train;
module.exports.loadTrainingData = loadTrainingData;
// extend the prototype chain
Perceptron.prototype = new Network();
Perceptron.prototype.constructor = Perceptron;

var myPerceptron = new Perceptron(9,81,9);
var trainer = new Trainer(myPerceptron);

loadTrainingData();

function flipCell(cell, index, board) {
  switch (cell) {
    case 0:
      board[index]=1;
      break;
    case 1:
      board[index]=0;
      break;
  }
}

var learningRate = 0.3;

module.exports.learnMove = function learnMove(move,callback) {
  if(move.currentPlayer === "O") {
    move.board.forEach(flipCell);
  }
  trainingSet.push({input:move.board,output:move.move});
  fs.appendFile("data/trainingdata.json",
    JSON.stringify({input:move.board,output:move.move}), function(err) {
      if(err){
        console.error(err);
        return;
      }
      console.log("file saved");
      if(callback)callback(true);
  });
  console.log("training");
  train(100);
}

function algorithm(move) {
  for(var i = 0; i < 9; i++) {
    if (move.board[i] == 0.5) return i;
  }
}

module.exports.makeGuess = function makeGuess(move) {
  if (move.currentPlayer === "O") {
    move.board.forEach(flipCell);
  }
  console.log(move.board);
  var unprocessed =  myPerceptron.activate(move.board);
  console.log(unprocessed);
  var index=0;
  var max=0;
  for(var i = 0; i < 9; i++) {
    if (unprocessed[i] > max) {
      index=i;
      max = unprocessed[i];
    }
  }
  console.log(index);
  console.log(max);
  if(move.board[index] != 0.5) {
    console.log("taken");
    index = algorithm(move);
  }
  console.log(index);
  return index;
}

