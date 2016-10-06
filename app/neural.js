var fs = require('fs'),
    _string = require('string');

var Neuron = synaptic.Neuron,
    Layer = synaptic.Layer,
    Network = synaptic.Network,
    Trainer = synaptic.Trainer,
    Architect = synaptic.Architect;

var trainingSet=[];

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

function loadTraningData() {
  fs.readFile("data/trainingdata.json", function(err, data) {
    if (err) {
      console.error("File read error", err);
      return;
    }
    var toParse = _string(data).ensureLeft('[')
      .ensureRight(']').replaceAll('}{','},{').s; //var created for readability

    trainingSet = JSON.parse(toParse);

    if(trainingSet.length > 10) {
      trainer.train(trainingSet, {
        rate:0.01,
        iterations:100000, // This seem very very excessive
        log:250,
        error:0.05,
        cost:Trainer.cost.CROSS_ENTROPY
      });
    }
  });
}

// extend the prototype chain
Perceptron.prototype = new Network();
Perceptron.prototype.constructor = Perceptron;

var myPerceptron = new Perceptron(9,81,9);
var trainer = new Trainer(myPerceptron);

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

function learnMove(move) {
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
  });
  console.log("training");
  trainer.train(trainingSet,{
    rate:0.1,
    iterations:100,
    log:100,
    error:0.05,
    cost:Trainer.cost.CROSS_ENTROPY
  });
}

function algorithm(move) {
  for(var i = 0; i < 9; i++) {
    if (move.board[i] == 0.5) return i;
  }
}

function makeGuess(move) {
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
