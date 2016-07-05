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
var fs = require('fs');
var S = require('string');
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
        console.log(trainingSet);
        trainer.train(trainingSet,{
           rate:0.1,
           iterations:10000,
           log:100,
           error:0.05,
           cost:Trainer.cost.CROSS_ENTROPY
        });
    }
});

// extend the prototype chain
Perceptron.prototype = new Network();
Perceptron.prototype.constructor = Perceptron;
//
var myPerceptron = new Perceptron(9,18,9);
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
}
function makeGuess(move)
{
    if(move.currentPlayer==="O")
    {
        move.board.forEach(flipCell);
    }
    console.log(move.board);
    trainingSet.push({input:move.board,output:move.move});
    fs.appendFile("data/trainingdata.json",JSON.stringify({input:move.board,output:move.move}),(err)=>
    {
        if(err){
            console.error(err);
        };
        console.log("file saved");
    });
    var unprocessed =  myPerceptron.activate(move.board);
    myPerceptron.propagate(learningRate,move.move);
    console.log(unprocessed);
    var index=0;
    var max = 0;
    unprocessed.forEach(function(e,inx){
        if(e>max)
        {
        max=e;
        index = inx;
        }
    });
    console.log(index);
    return index;
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
app.get('/isonline', function(req, res) {
  res.send('yes');
});
app.listen(8081,function(){
    console.log("express is running");
});