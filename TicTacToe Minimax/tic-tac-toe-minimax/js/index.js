$(document).ready(function(event) {
  
  var gameboard = [0, 1, 2, 3, 4, 5, 6, 7, 8]; // 9 cells
  var clicked; // prevents clicking twice
  var cells; // if cell is occupied
  var positions = 9; // positions left
  var wins_count_x = 0; // wins X
  var wins_count_o = 0; // wins O
  var human; // human player O
  var computer; // ai player X
  var start_flg = 0; // start flag button pressed

  // only play button available on startup
  $("#stop").prop("disabled", true);
  $("#reset").prop("disabled", true);
  
  function updateWinsCount() { // reset
    wins_count_x = 0;
    wins_count_o = 0;
  }

  function updateWinsOnBoard() {
    $("span#x-score").text(wins_count_x.toString());
    $("span#o-score").text(wins_count_o.toString());
  }

  function countWins(player) {
    if (player === "X") wins_count_x++;
    if (player === "O") wins_count_o++;
    updateWinsOnBoard();
    // console.log("Wins Xs: " + wins_count_x + " |  Os: " + wins_count_o); // debugging
  }

  function resetBoardArray() {
    positions = 9; // reset positions left count for new game
    gameboard = [0, 1, 2, 3, 4, 5, 6, 7, 8]; // reset gameboard
    // for (var i = 0; i < gameboard.length; i++) 
      // gameboard[i] = i; // init 0 to 8
    // console.log(gameboard); // debugging
  }

  function resetBoard() {
    resetBoardArray();
    setTimeout(function() { // 0 to 8
      for (var i = 0; i < gameboard.length; i++) { // reset html table
        $("td#" + i).find("h1").html("&nbsp;&nbsp;&nbsp;&nbsp;");
        $("td#" + i).find("h1").css("color", "");
      }
    }, 1000);
  }

  function updateBoard(num, player) { // update player pos in html table
    $("td#" + num).find("h1").text(player);
  }

  function highlightCells(cells_arr, player) {
    var colour = (player === "X") ? "red" : "green";
    for (var i in cells_arr) { // change colour for winning cells
      $("td#" + cells_arr[i].toString()).find("h1").css("color", colour);
    }
  }
  
  function emptyCells(board) { // empty cells in board for minimix function
    var empty_cells_lst = [];
    for (var i = 0; i < board.length; i++) {
      if (board[i] !== "X" && board[i] !== "O") {
        empty_cells_lst.push(board[i]);
      }
    }
    return empty_cells_lst;
  }
  
  function isWon(board, player) {
    var cells_arr;
    var flag = 0;
    
         if (board[0] === player && board[1] === player && board[2] === player) { cells_arr = [0,1,2]; flag++; }
    else if (board[3] === player && board[4] === player && board[5] === player) { cells_arr = [3,4,5]; flag++; }
    else if (board[6] === player && board[7] === player && board[8] === player) { cells_arr = [6,7,8]; flag++; }
    else if (board[0] === player && board[3] === player && board[6] === player) { cells_arr = [0,3,6]; flag++; }
    else if (board[1] === player && board[4] === player && board[7] === player) { cells_arr = [1,4,7]; flag++; }
    else if (board[2] === player && board[5] === player && board[8] === player) { cells_arr = [2,5,8]; flag++; }
    else if (board[0] === player && board[4] === player && board[8] === player) { cells_arr = [0,4,8]; flag++; }
    else if (board[2] === player && board[4] === player && board[6] === player) { cells_arr = [2,4,6]; flag++; }
    
    if (flag) {
      countWins(player);
      highlightCells(cells_arr, player);
      resetBoard(); // reset game board on win
      return true;
    }
    
    return false;
  }
  
  function winners(board, player) { // winning cell combos for minimax function 
    var flag = 0;
    
         if (board[0] === player && board[1] === player && board[2] === player) { flag++; }
    else if (board[3] === player && board[4] === player && board[5] === player) { flag++; }
    else if (board[6] === player && board[7] === player && board[8] === player) { flag++; }
    else if (board[0] === player && board[3] === player && board[6] === player) { flag++; }
    else if (board[1] === player && board[4] === player && board[7] === player) { flag++; }
    else if (board[2] === player && board[5] === player && board[8] === player) { flag++; }
    else if (board[0] === player && board[4] === player && board[8] === player) { flag++; }
    else if (board[2] === player && board[4] === player && board[6] === player) { flag++; }
    
    if (flag) return true;
   
    return false;
  }
  
  // var original_board = ["O",1,"X","X",4,"X",6,"O","O"]; // original array 
  // var original_board = ["O",1,"X","X",4,"X",6,"O","O"]; // for testing 
  
  /**
  O 1 X
  X 4 X
  6 O O */
  
  // "How to make your Tic Tac Toe game unbeatable by using the minimax algorithm" 
  // By Ahmad Abdolsaheb (February 17, 2017).
  // https://medium.freecodecamp.org/
  // how-to-make-your-tic-tac-toe-game-unbeatable-by-using-the-minimax-algorithm-9d690bad4b37
  function minimax(new_board, player) {    
    // console.log("In minimax: " + new_board + " Player: " + player);
    var availableCells = emptyCells(new_board);
    // console.log(original_board);
    // console.log("Available Cells: " + availableCells);
    // var has_winners = winners(new_board, player);
    // console.log("Winners: " + has_winners); 
    
    // terminal states - win, loose, tie, draw
    if (winners(new_board, human))          { return { score:  -10 }; } 
    else if (winners(new_board, computer))  { return { score:   10 }; }
    else if (availableCells.length === 0)   { return { score:    0 }; }
    
    var moves = []; // all objects
    
    for (var i = 0; i < availableCells.length; i++) { // loop through available cells
      var move = {}; // create an empty object for each available index
  	  move.index = new_board[availableCells[i]]; // store index
      new_board[availableCells[i]] = player; // set empty cell to current player
      // collect score from calling minimmax on opponent of current player
      if (player === computer) {
        var result = minimax(new_board, human);
        move.score = result.score;
      } 
      else {
        var result = minimax(new_board, computer);
        move.score = result.score;
      }
      new_board[availableCells[i]] = move.index; // reset cell to empty
      moves.push(move); // push object to array
    }
    
    var bestmove;
    
    if(player === computer) { // if computer's turn
      var bestscore = -10000;
      for (var i = 0; i < moves.length; i++) { // loop over moves and 
        if(moves[i].score > bestscore) { // choose move with highest score
          bestscore = moves[i].score;
          bestmove = i;
        }
      }
    } else { // if player's turn 
      var bestscore = 10000;
      for(var i = 0; i < moves.length; i++) { // else loop over moves 
        if(moves[i].score < bestscore) { // and choose move with lowest score
          bestscore = moves[i].score;
          bestmove = i;
        }
      }
    }
    return moves[bestmove]; // return chosen move object from moves array
  }

  function updateBoardArray(num, player) {
    // alert("Pos: " + num + " Player: " + player); // debugging
    if (num >= 0 && num <= 8) { // if cell is empty 
      if (gameboard[num] !== "X" && gameboard[num] !== "O") { 
        gameboard[num] = player; cells++; // insert X or O into array
      }
    }
    
    // if (!cells) alert('Cell occupied'); // debugging
    
    if (cells) { // update page's html table 
      updateBoard(num, player); positions--;
      // console.log("Positions left: " + positions); // debugging
    }

    // console.log("Cells: " + cells); // debugging

    if (positions === 0) { // draw or tie
      // alert('Tie or draw'); // debugging
      if (!isWon(gameboard, player)) resetBoard(); // check isWon then call reset once
    } 
    
    if (positions > 0) isWon(gameboard, player); 
  }
  
  function playerComp() {
    setTimeout(function() { 
      if (positions !== 9) {
        var num = minimax(gameboard, computer).index;
        if(!isWon(gameboard, computer)) { 
          // console.log("num = " + num); // debugging
          cells = 0; 
          updateBoardArray(num, computer); // place player1 on board
        }
      }
      // console.log(gameboard); // debugging
    }, 500);
  }
  
  function nextMove(i) { // user 
    if (gameboard[i] !== "X" && gameboard[i] !== "O") {
      var nnum = gameboard[i]; // n-num available in array
      // console.log(nnum.toString()); // debugging
      clicked = 1;
      if (clicked) {
        if(!isWon(gameboard, human)) { 
          cells = 0; 
          updateBoardArray(nnum, human); // place player2 on board
        }
        // console.log(gameboard);
        if (!isWon(gameboard, computer)) playerComp(); // computer
      }
      clicked = 0;
    }
  }
  
  $(".cells").on("click", function(){ // disable cell input on startup 
    // console.log(this.id); // debugging
    if (start_flg) {
      clicked = 1;
      if (clicked) { // user
        if (!isWon(gameboard, human) && positions > 0) nextMove(parseInt(this.id));
      }
      clicked = 0;
    }
  }); // is won or draw

  function stopGame() {
    start_flg = 0; // clear flg
    $("#start").prop("disabled", false); // enable
    $("#reset").prop("disabled", false); // enable
  }

  function resetForm() {
    start_flg = 0; // clear flg
    updateWinsCount();
    updateWinsOnBoard();
    resetBoard();
    $("#player_select input").prop("disabled", false);
    $("input[name=inlineRadioOptions]").prop("checked", false);
  }
  
  function startGameBtn() { // start game button
    var player2; // player2 is computer
    // choose player X or player O
    var option = $("input[name=inlineRadioOptions]:checked").val(); // player1 is user
    // console.log("Option: " + option); // debugging
    
    start_flg = 1; // set

    // if option is empty string
    if (option !== "X" && option !== "O") {
      alert("Must click on X or O"); return;
    }

    // option for player1
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
    $("#stop").prop("disabled", false); // debugging
    $("#reset").prop("disabled", true);
  }

  $("button").on("click", function(event) { // handle start button
    // alert("Handler for .on() called: " + event.target.id); // debugging
    event.preventDefault();

    switch (event.target.id) {
      case "start":
        // console.log(gameboard);
        startGameBtn();
        // human = "O"; // debugging
        // computer = "X"; // debugging
        // var obj = minimax(original_board, computer);
        // console.log(obj);
        break;
      case "reset":
        resetForm();
        break;
      case "stop":
        stopGame();
        break;
    }
    
  });
  
});