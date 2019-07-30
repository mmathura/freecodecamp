$(document).ready(function(event) {
  
  var gameboard = [[0, 1, 2], [3, 4, 5], [6, 7, 8]]; // 3 x 3 grid
  var sboard; // eval string
  var clicked; // prevents clicking twice
  var cells; // if cell is occupied
  var positions = 9; // positions left
  var turn; // player v computer
  var wins_count_x = 0; // wins X
  var wins_count_o = 0; // wins O
  var timer; // timer id
  
  // only play button available on startup
  // $("#stop").prop("disabled", true);
  // $("#reset").prop("disabled", true);

  function updateWinsOnBoard() {
    $("span#x-score").text(wins_count_x.toString());
    $("span#o-score").text(wins_count_o.toString());
  }

  function countWins(player) {
    if (player === "X") wins_count_x++;
    if (player === "O") wins_count_o++;
    updateWinsOnBoard();
    // console.log("Wins Xs: " + wins_count_x + "|  Os: " + wins_count_o); // debugging
  }

  function getRandomNum(min, max) { // from Mozilla docs
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function resetBoardArray() {
    positions = 9; // reset positions left count for new game
    gameboard = [[0, 1, 2], [3, 4, 5], [6, 7, 8]]; // reset gameboard
  }

  function resetBoard() {
    resetBoardArray();
    setTimeout(function() { // 0 to 8
      for (var i = 0; i < 9; i++) { // reset html table
        $("td#" + i).find("h1").html("&nbsp;&nbsp;&nbsp;&nbsp;");
        $("td#" + i).find("h1").css("color", "");
      }
    }, 500);
  }

  function updateBoard(num, player) { // update player pos in html table
    $("td#" + num).find("h1").text(player);
    $("td#" + num).off("click"); // disable cell once occupied 
  }

  function getRandomCell() {
    var num; // for rand num
    var cell_available = 0; // clear flag
    
    while (!cell_available) {
      // get random number 1 to 9 from computer
      num = getRandomNum(0, 8); // repeat funct until there is an available space
      for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
          if (gameboard[i][j] !== "X" && gameboard[i][j] !== "O") { // if cell empty
            var cell_num = gameboard[i][j]; // get pos from game board array
            if (cell_num === num) { // if pos equals rand num, its available
              // console.log("Available in loop: " + num); // debugging
              cell_available++; // set flag
              break; // inner loop
            }
          }
        }
        if (cell_available) break; // outer loop
      }
    }
    return num;
  }

  function highlightCells(cells_arr) {
    for (var i in cells_arr) { // change colour for winning cells
      $("td#" + cells_arr[i].toString()).find("h1").css("color", "red");
    }
  }

  function isWonDia(player) { // diagonals
    /**
    0 1 2
    3 4 5
    6 7 8 */
    var dia = 0;

    if (gameboard[0][0] === player && gameboard[1][1] === player && gameboard[2][2] === player) dia++;

    if (dia) { // left dia
      // console.log("First Diagonal Left: " + dia + " Player: " + player); // debugging
      highlightCells([0, 4, 8]); return true;
    }

    dia = 0;

    if (gameboard[0][2] === player && gameboard[1][1] === player && gameboard[2][0] === player) dia++;

    if (dia) { // right dia
      // console.log("Second Diagonal Right: " + dia + " Player: " + player); // debugging
      highlightCells([2, 4, 6]); return true;
    }
    
    return false;
  }

  function isWonCol(player) { // colums
    /**
    0 1 2
    3 4 5
    6 7 8 */
    var col = 0;
    var i;

    for (i = 0; i < 3; i++) { if (gameboard[i][0] === player) col++; }

    if (col == 3) { // first col
      // console.log("First Col: " + col + " Player: " + player); // debugging
      highlightCells([0, 3, 6]); return true;
    }

    col = 0;

    for (i = 0; i < 3; i++) { if (gameboard[i][1] === player) col++; }

    if (col == 3) { // second col
      // console.log("Second Col: " + col + " Player: " + player); // debugging
      highlightCells([1, 4, 7]); return true;
    }

    col = 0;

    for (i = 0; i < 3; i++) { if (gameboard[i][2] === player) col++; }

    if (col == 3) { // third col
      // console.log("Third Col: " + col + " Player: " + player); // debugging
      highlightCells([2, 5, 8]); return true;
    }
    
    return false;
  }

  function isWonRow(player) { // rows
    /**
    0 1 2
    3 4 5
    6 7 8 */
    var row = 0;
    var i;

    for (i = 0; i < 3; i++) { if (gameboard[0][i] === player) row++; }

    if (row == 3) { // first row 
      // console.log("First Row: " + row + " Player: " + player); // debugging
      highlightCells([0, 1, 2]); return true;
    }

    row = 0;

    for (i = 0; i < 3; i++) { if (gameboard[1][i] === player) row++; }

    if (row == 3) { // second row
      // console.log("Second Row: " + row + " Player: " + player); // debugging
      highlightCells([3, 4, 5]); return true;
    }

    row = 0;

    for (i = 0; i < 3; i++) { if (gameboard[2][i] === player) row++; }

    if (row == 3) { // third row
      // console.log("Third Row: " + row + " Player: " + player); // debugging
      highlightCells([6, 7, 8]); return true;
    }
    
    return false;
  }

  function isWon(player) {
    if (isWonRow(player) || isWonCol(player) || isWonDia(player)) {
      countWins(player); resetBoard(); // reset game board on win
      return true;
    }
    return false;
  }

  function updateBoardArray(num, player) {
    // alert("Pos: " + num + " Player: " + player); // debugging
    switch (num) { // if cell is empty insert X or O into array
      case 0: if (gameboard[0][0] !== "X" && gameboard[0][0] !== "O") { gameboard[0][0] = player; cells++; } break;
      case 1: if (gameboard[0][1] !== "X" && gameboard[0][1] !== "O") { gameboard[0][1] = player; cells++; } break;
      case 2: if (gameboard[0][2] !== "X" && gameboard[0][2] !== "O") { gameboard[0][2] = player; cells++; } break;
      case 3: if (gameboard[1][0] !== "X" && gameboard[1][0] !== "O") { gameboard[1][0] = player; cells++; } break;
      case 4: if (gameboard[1][1] !== "X" && gameboard[1][1] !== "O") { gameboard[1][1] = player; cells++; } break;
      case 5: if (gameboard[1][2] !== "X" && gameboard[1][2] !== "O") { gameboard[1][2] = player; cells++; } break;
      case 6: if (gameboard[2][0] !== "X" && gameboard[2][0] !== "O") { gameboard[2][0] = player; cells++; } break;
      case 7: if (gameboard[2][1] !== "X" && gameboard[2][1] !== "O") { gameboard[2][1] = player; cells++; } break;
      case 8: if (gameboard[2][2] !== "X" && gameboard[2][2] !== "O") { gameboard[2][2] = player; cells++; } break;
    }

    // if (!cells) alert('Cell occupied'); // debugging
    
    if (cells) { // update page's html table 
      updateBoard(num, player); positions--;
      // console.log("Positions left: " + positions); // debugging
    }

    // console.log("Cells: " + cells); // debugging

    if (positions === 0) { // draw or tie
      // alert('Tie or draw'); // debugging
      if (!isWon(player)) resetBoard(); // check isWon then call reset once
      // alert('Alere here');
    } 
  }

  function Player2Comp(player2) {
    var num = getRandomCell();
    // console.log("Available: " + num + " Player: " + player2); // debugging
    // var num = getRandomNum(0, 8);
    // alert("Rand: " + num + " Player: " + player2); // debugging
    cells = 0;

    // player2 computer starts first
    // if (turn === 0) console.log("Computer"); // Computer's turn

    if (!turn) { // turn = 0
      updateBoardArray(num, player2); // place player2 on board
      if (!isWon(player2)) turn = 1; // check for winner, hand off to player1
    }
  }

  function playersTurn(splayer) { // player1 starts second
    // console.log("Player in playersTurn is: " + splayer); // debugging
    sboard = "clicked = 1;"; // set flag
    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 3; j++) {
        // click only on available spaces in grid
        if (gameboard[i][j] !== "X" && gameboard[i][j] !== "O") {
          var nnum = gameboard[i][j]; // n-num available in array
          // console.log(nnum.toString()); // debugging
          sboard += '$("td#' + nnum.toString() + '").click(function(){' +
            "if (clicked) { " +
              "updateBoardArray(" + nnum.toString() + ', "' + splayer + '"'  + ');' +
              'if(!isWon("' + splayer + '"))' + "turn = 0;" +
            "}" +
            "clicked = 0;" +
          "});"; // hand off turn to computer - player2
        }
      }
    }
  }

  function Player1User(player1, player2) {
    cells = 0;
    // player1 starts second
    // if (turn === 1) console.log("Player"); // Player's turn

    if (turn) { // turn = 1 
      playersTurn(player1); // wait for player1 input
      // console.log(sboard); // debugging
      // console.log("Player1 before eval: " + player1); // debugging
      eval(sboard); // detect mouse click event and update array
    }
  }

  function nextTurn(player2, player1) {
    Player2Comp(player2); // computer 
    Player1User(player1); // player
  }

  function startGame(player2, player1) {
    timer = setInterval(function() {
      nextTurn(player2, player1);
      // console.log(gameboard); // debugging
    }, 2000);
  }

  /* function stopGame() {
    clearInterval(timer); // reset timer via id
    $("#start").prop("disabled", false); // enable
    $("#reset").prop("disabled", false); // enable
  } */

  /* function resetForm() {
    resetBoard();
    $("#player_select input").prop("disabled", false);
    $("input[name=inlineRadioOptions]").prop("checked", false);
    wins_count_x = 0;
    wins_count_o = 0;
  } */

  function startGameBtn() { // start game button

    var player2; // player2 is computer

    // choose player X or player O
    var option = $("input[name=inlineRadioOptions]:checked").val(); // player1 is user
    // console.log("Option: " + option); // debugging

    // if option is empty string
    if (option !== "X" && option !== "O") {
      alert("Must click on X or O"); return;
    }

    if (option === "X") { player2 = "O"; }
    if (option === "O") { player2 = "X"; }

    // console.log("Player 1: " + option  + " Player 2: " + player2); // debugging
    
    computer = player2;
    human = option;

    // disable form when game loop starts
    $("#player_select input").prop("disabled", true);

    // disable start button when game loop starts
    $("#start").prop("disabled", true);
    // disable stop and reset buttons when game starts loop
    // $("#stop").prop("disabled", false);
    // $("#reset").prop("disabled", true);

    turn = 0;
    startGame(player2, option);
  }
  
  $("button").on("click", function(event) { // handle start button
    // alert("Handler for .on() called: " + event.target.id); // debugging
    event.preventDefault();

    switch (event.target.id) {
      case "start":
        // console.log(gameboard);
        startGameBtn();
        break;
      /* case "reset":
        resetForm();
        break;
      case "stop":
        stopGame();
        break; */
    }
    
  });
  
});