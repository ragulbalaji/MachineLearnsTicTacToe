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

var synaptic = require('synaptic'),
    express = require('express'),// this line is not needed in the browser
    app = express(),
    bodyParser = require('body-parser'),
    fs = require('fs'),
    S = require('string'),
    duplicates = require("./app/duplicates.js"),
    stats = require('./app/statistics.js'),
    neural = require('./app/neural.js');
const expressPort = 8081;

app.use(express.static(__dirname + '/public'));

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());

app.post('/guess', function(req, res) {
  var guess = neural.makeGuess(req.body);
  res.json(guess);
});

app.post('/traindatain',function(req, res) {
  neural.learnMove(req.body)
  res.sendStatus(200);
});

app.listen(expressPort, function() {
  console.log("Express is running on port "+expressPort);
});

app.get('/win',function(req, res) {
  stats.stats.addWin();
  res.send("win ok")
});

app.get('/lose',function(req, res) {
  stats.stats.addLose();
  res.send("lose ok")
});

app.get('/draw', function(req,res) {
  stats.stats.addDraw();
  res.send("draw ok")
});

app.get('/stats',function(req, res) {
  res.send(JSON.stringify(stats.stats));
});
neural.train(100000);
module.exports = true;
