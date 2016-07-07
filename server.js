/*
 * ███╗   ███╗ █████╗  ██████╗██╗  ██╗██╗███╗   ██╗███████╗    ██╗     ███████╗ █████╗ ██████╗ ███╗   ██╗██╗███╗   ██╗ ██████╗ 
 * ████╗ ████║██╔══██╗██╔════╝██║  ██║██║████╗  ██║██╔════╝    ██║     ██╔════╝██╔══██╗██╔══██╗████╗  ██║██║████╗  ██║██╔════╝ 
 * ██╔████╔██║███████║██║     ███████║██║██╔██╗ ██║█████╗      ██║     █████╗  ███████║██████╔╝██╔██╗ ██║██║██╔██╗ ██║██║  ███╗
 * ██║╚██╔╝██║██╔══██║██║     ██╔══██║██║██║╚██╗██║██╔══╝      ██║     ██╔══╝  ██╔══██║██╔══██╗██║╚██╗██║██║██║╚██╗██║██║   ██║
 * ██║ ╚═╝ ██║██║  ██║╚██████╗██║  ██║██║██║ ╚████║███████╗    ███████╗███████╗██║  ██║██║  ██║██║ ╚████║██║██║ ╚████║╚██████╔╝
 * ╚═╝     ╚═╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝╚═╝╚═╝  ╚═══╝╚══════╝    ╚══════╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝╚═╝  ╚═══╝ ╚═════╝ 
 * 
 * A Tech Test by Ragul Balaji and Kaelan Miko (C) 2016
 * 
 */

var synaptic = require('synaptic');// this line is not needed in the browser
var express = require('express');
require("./duplicates.js");
var fs = require('fs');
var S = require('string');
//var stats = require('./statistics.js');
var app = express();
var bodyParser = require('body-parser');
var Neuron = synaptic.Neuron,
    Layer = synaptic.Layer,
    Network = synaptic.Network,
    Trainer = synaptic.Trainer,
    Architect = synaptic.Architect;
    
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
var trainingSet=[];
fs.readFile("data/trainingdata.json",function(err,data){
    if(err)
    {
        console.error("File read error",err);
        return;
    }
    var stringed = S(data).ensureLeft('[').ensureRight(']').replaceAll('}{','},{').s;
    trainingSet=JSON.parse(stringed);
    if(trainingSet.length>10)
    {
        trainer.train(trainingSet,{
           rate:0.01,
           iterations:100000,// This seem very very excessive
           log:250,
           error:0.05,
           cost:Trainer.cost.CROSS_ENTROPY
        });
    }
});

// extend the prototype chain
Perceptron.prototype = new Network();
Perceptron.prototype.constructor = Perceptron;
//
var myPerceptron = new Perceptron(9,81,9);
var trainer = new Trainer(myPerceptron);
function flipCell(cell,index,board)
{
    switch(cell)
    {
        case 1:
            board[index]=0;
            break;
        case 0:
            board[index]=1;
            break;
    }
}
var learningRate = 0.3;
function learnMove(move)
{
    if(move.currentPlayer==="O")
    {
        move.board.forEach(flipCell);
    }
    trainingSet.push({input:move.board,output:move.move});
    fs.appendFile("data/trainingdata.json",JSON.stringify({input:move.board,output:move.move}),(err)=>
    {
        if(err){
            console.error(err);
        };
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
function algorithm(move)
{
    for(var i=0;i<9;i++)
    {
        if(move.board[i]==0.5)
            return i;
    }
}
function makeGuess(move)
{
    if(move.currentPlayer==="O")
    {
        move.board.forEach(flipCell);
    }
    console.log(move.board);
    var unprocessed =  myPerceptron.activate(move.board);
    console.log(unprocessed);
    var index=0;
    var max=0;
    for(var i=0;i<9;i++)
    {
        if(unprocessed[i]>max)
        {
            index=i;
            max = unprocessed[i];
        }
    }
    console.log(index);
    console.log(max);
    if(move.board[index]!=0.5)
    {
        console.log("taken");
        index = algorithm(move);
    }
    console.log(index);
    return index;
}


var stats = {
    wins:0,
    lose:0,
    draw:0
}

function statsAddWin(){
    stats.wins++;
    saveStats();
}

function statsAddLose(){
    stats.lose++;
    saveStats();
}

function statsAddDraw(){
    stats.draw++;
    saveStats();
}
  
function saveStats() {
    var save = JSON.stringify(stats)
    console.log(save)
    fs.writeFile("data/stats.json",save);
};

loadStats();
function loadStats(){
    fs.readFile("data/stats.json",function(err,data){
        if(err){
            console.error(err);
        }
        console.log("LOADED FROM data/stats.json >> "+data)
        stats = JSON.parse(data);
    });
}


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.post('/guess',function(req,res){
    var guess = makeGuess(req.body);
    res.json(guess);
});
app.post('/traindatain',function(req,res){
    learnMove(req.body)
    res.sendStatus(200);
});
/*app.get('/isonline', function(req, res) {  //Depreciated
  res.send('yes');
});*/
app.listen(8081,function(){
    console.log("express is running");
});
app.get('/win',function(req,res){
    statsAddWin();
    res.send("win ok")
});
app.get('/lose',function(req,res){
     statsAddLose();
     res.send("lose ok")
});
app.get('/draw',function(req,res){
     statsAddDraw();
     res.send("draw ok")
});
app.get('/stats',function(req,res){
    res.send(JSON.stringify(stats));
})
