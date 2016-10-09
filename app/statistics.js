var fs = require('fs');

var stats = function(){
  this.wins = 0;
  this.loses = 0;
  this.draws = 0;
  this.addWin=function()
  {
    this.wins++;
    saveStats();
  }
  this.addDraw=function()
  {
    this.draws++;
    saveStats();
  }
  this.addLoss=function()
  {
    this.loses++;
    saveStats();
  }
};

function saveStats() {
  fs.writeFile("data/stats.json",JSON.stringify(stats));
}

function loadStats() {
  fs.readFile("data/stats.json",function(err,data){
    if (err) {
      console.error(err);
      return;
    }
    console.log("LOADED FROM data/stats.json >> " + data);
    stats = JSON.parse(data);
  });
}

module.exports.stats = stats;
module.exports.saveStats = saveStats;
module.exports.loadStats = loadStats;
