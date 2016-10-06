var nodeurl = window.location.href;

var game = {
  machine : {
    isplayingnow : false,
    currentError : "Undefined",
    stats : {
      wins : 0,
      lose : 0,
      draw : 0
    }
  },
  isLearning : false,
  train : {
    currentPlayer : "X",
    board : [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5],
    move : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  }
};

var imgsrc = {
  green : "./assets/color-green.jpg",
  red   : "./assets/color-red.jpeg"
};

updateGameBoard(); // INIT / CLEAR
var machinemoveindex;

function trainDATAsend(data) {
  if (!game.machine.isplayingnow) {
    $.post(nodeurl+"/traindatain", data, function(e) {
      console.log("DATA SENT SUCCESSFULLY");
    }).done(function(){
      Materialize.toast('Data >> Server', 2000);
    });
  }
}
$(".ticbtn").click(function() {
  game.train.move[parseInt($(this).attr("id"))] = 1;
  trainDATAsend(game.train);
  if (game.train.board[parseInt($(this).attr("id"))] === 0.5) {
    switch (game.train.currentPlayer) {
      case "X":
      game.train.board[parseInt($(this).attr("id"))] = 1;
      game.train.currentPlayer = "O";
      break;
      case "O":
      game.train.board[parseInt($(this).attr("id"))] = 0;
      game.train.currentPlayer = "X";
      break;
    }
  }
  setBoardColor((game.train.currentPlayer == "X" ? "Crimson" : "DarkSlateBlue"));
  updateGameBoard();
  game.train.move[parseInt($(this).attr("id"))] = 0;
  //console.log("checkWin() OUTPUT: "+ checkWin());
  var win = checkWin();
  if (win != -1) {
    alert((win== 1 ? "X" : "O") + " Wins!");
    if((!game.isLearning)&&(!game.machine.isplayingnow)) $.get(nodeurl+"/"+(win==1 ? "lose" : "win"));
    else if((!game.isLearning)&&(game.machine.isplayingnow)) $.get(nodeurl+"/"+(win==1 ? "win" : "lose"));
    game.train.board = [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5];
    game.machine.isplayingnow = false;
    game.train.currentPlayer = "X";
    updateGameBoard();
  }
  else if (full()) {
    alert("draw");
    game.train.board = [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5];
    game.machine.isplayingnow = false;
    game.train.currentPlayer = "X";
    updateGameBoard();
    if(!game.isLearning) $.get(nodeurl+"/draw");
  }
  else {
    if (!game.isLearning && !game.machine.isplayingnow) { // THIS IS NOT A LEARNING GAME, REKT THAT PLAYER!
      game.machine.isplayingnow = true;
      //GET GUESS FROM SERVER
      //CLICK THE BUTTON THAT THE NEURAL NETWORK HAS CHOSEN
      $.post(nodeurl+"/guess", game.train, function(inx) {
        console.log("Guess from Server = " +  inx);
        Materialize.toast('Machine Guesses ' + inx, 2000);
        document.getElementById(inx).click();
      });

      // Avoid Infinite AI vs AI loop haha it's cause you call .click, which calls this function hence recursion hel
    }
    else if (game.machine.isplayingnow) {
      game.machine.isplayingnow = false;
    }
  }
});

function updateGameBoard() {
  for (var i = 0; i < 9; i++) {
    $("#" + i).html(getChar(game.train.board[i]));
  }
}

function full() {
  var x = true;
  game.train.board.forEach(function(e) {
    if (e === 0.5) {
      x = false;
    }
  });
  return x;
}

function getChar(a) {
  switch (a) {
    case 0.5:
    return " ";
    break;
    case 0:
    return "O";
    break;
    case 1:
    return "X";
    break;
  }
}
function computerStart()
{
  game.machine.isplayingnow=true;
  $.post(nodeurl+"/guess", game.train, function(inx) {
    console.log("Guess from Server = " +  inx);
    Materialize.toast('Machine Guesses ' + inx, 2000);
    document.getElementById(inx).click();
  });
}
function playerStart()
{
  game.train.board = [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5];
  game.machine.isplayingnow = false;
  game.train.currentPlayer = "X";
  updateGameBoard();
}
function checkWin() {
  for (var i = 0; i < 3; i++) {
    if (game.train.board[(3 * i) + 0] !== 0.5 && game.train.board[(3 * i) + 0] === game.train.board[(3 * i) + 1] && game.train.board[(3 * i) + 1] === game.train.board[(3 * i) + 2]) {
      return game.train.board[(3 * i) + 0];
    }
    if (game.train.board[i] !== 0.5 && game.train.board[i] === game.train.board[3 + i] && game.train.board[3 + i] === game.train.board[6 + i]) {
      return game.train.board[i];
    }
  }
  if (game.train.board[0] !== 0.5 && game.train.board[0] === game.train.board[4] && game.train.board[4] === game.train.board[8]) {
    return game.train.board[0];
  }
  if (game.train.board[2] !== 0.5 && game.train.board[2] === game.train.board[4] && game.train.board[4] === game.train.board[6]) {
    return game.train.board[2];
  }
  return -1;
}

setInterval(checkServerOnline, 2000);
function checkServerOnline(){
  $.get( nodeurl+"/stats", function( data ) {
    //if(data.toString().localeCompare('yes') == 0){ //Server is Online :)

    console.log(data)
    game.machine.stats = JSON.parse(data);
    $("#stats_wins").html("Wins : " + game.machine.stats.wins);
    $("#stats_lose").html("Lose : " + game.machine.stats.lose);
    $("#stats_draw").html("Draw : " + game.machine.stats.draw);
    $("#serverimg").attr("src", imgsrc.green)
    if(connectAnim.zz){connectAnim.zz = false; clearInterval(connectAnim.id); Materialize.toast('Server Connected :)', 2000);}
    //console.log("Server Up :)")
    //}
    /*else{
    $("#serverimg").attr("src", imgsrc.red)
    console.log("Server Down :(")
  }*/
}).fail(function() {
  console.log( "isonline :: error" );
  Materialize.toast('Server Error', 2000);
  if(!connectAnim.zz){
    connectAnim = {
      state: 0,
      zz: true,
      id: setInterval(serverConnectAnim, 200)
    }
  }
});
}

var connectAnim = {
  state: 0,
  zz: true,
  id: setInterval(serverConnectAnim, 200)
}
function serverConnectAnim(){
  switch (connectAnim.state) {
    case 0:
    $("#serverimg").attr("src", imgsrc.green)
    connectAnim.state = 1;
    break;
    case 1:
    $("#serverimg").attr("src", imgsrc.red)
    connectAnim.state = 0;
    break;
  }
}

function gameMode(obj) {
  game.isLearning = obj.checked;
}

function setBoardColor(colorHex) {
  $(".ticbtn").css("background-color", colorHex);
}

function getRandomHexColor() {
  return '#' + Math.floor(Math.random() * 16777215).toString(16);
}
