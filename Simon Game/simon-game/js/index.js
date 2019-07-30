
$(document).ready(function() {
  
  var option; // on/off button
  var result; // result of match
  
  var game_timeout_id; // game timeout id
  var first_signal_id; // first signal timeout id  
  var play_signals_id; // play signals id

  var start_flag = 0; // for cells
  var strict_flag = 0; // strict mode
  var steps_count = 0; // steps number
  var rec_flag = 0; // receive input flag
  var err_flag = 0; // error flag 
  var score_flag = 0; // on startup 
  var on_flag = 0; // game buttons state - on/off 
  var speed_factor = 0; // speedup
  var timeout_flag = 0; // timeout error 
  var error_count = 0; // for errors
  
  var ssignal = ""; // signal from user (ssignal - signal string)
  
  var signal_array = []; // store sequance of signals - computer
  var player_array = []; // store player's sequence of signals
  var color_array = ["green", "red", "yellow", "blue"]; // 0 .. 3
  
  var audio1 = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound1.mp3"); // gn
  var audio2 = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound2.mp3"); // rd
  var audio3 = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound3.mp3"); // yw
  var audio4 = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound4.mp3"); // bl
  
  // ** flash button 
  
  function flashBtn(btn_num, color) {
    // $(btn_num).addClass('unclickable');
    $(btn_num).css("background-color", color);
    setTimeout(function() { 
      $(btn_num).css("background-color",""); 
      // $(btn_num).removeClass('unclickable');
    }, 250);
    ssignal = color;
  } 
  
  // ** audio
 
  function playBtnTone(button) {
    switch(button) {
      case "green": audio1.play(); break;
      case "red": audio2.play(); break;
      case "yellow": audio3.play(); break;
      case "blue": audio4.play(); break;
    }
  }
  
  // ** Error tone
  
  function playErrTone() { // play error tone
    // from the beeplay.js documentation
    var intro = beeplay({ bpm: 132 })
      .play(null, 2)
      .play('D#5', 1/4);
    intro = null;
  }
    
  // ** green
  
  function greenBtn() {
    // console.log("Green button."); 
    flashBtn("#0", "green");
    playBtnTone("green"); 
  }
  
  // ** red
  
  function redBtn() {
    // console.log("Red button.");
    flashBtn("#1", "red");
    playBtnTone("red"); 
  }
  
  // ** yellow
  
  function yellowBtn() {
    // console.log("Yellow button.");
    flashBtn("#2", "yellow");
    playBtnTone("yellow"); 
  }
  
  // ** blue
  
  function blueBtn() {
    // console.log("Blue button."); 
    flashBtn("#3", "blue");
    playBtnTone("blue"); 
  }
  
  // ** play signal once 
  
  function playSignal(signal) { // play a single signal
    switch(signal) {
      case "green": greenBtn(); break;
      case "red": redBtn(); break;
      case "yellow": yellowBtn(); break;
      case "blue": blueBtn(); break;
    }
    return signal;
  }
  
  // ** enable buttons 
  
  function enableBtns() {
    $("#start").prop("disabled", false);
    $("#strict").prop("disabled", false);
  }
  
  // ** disable buttons 
  
  function disableBtns() {
    $("#start").prop("disabled", true);
    $("#strict").prop("disabled", true);
  }
  
  // ** disable buttons on startup 
  
  disableBtns();
  
  // ** set score
  
  function setScore(first, second) {
    $("#score0").text(first);
    $("#score1").text(second);
  }
  
  // ** for score display --
  
  function flashScoreOn() {
    setScore("-", "-");
  }
  
  // ** for error display !!
  
  function flashScoreErr() { // only display when on
    if (on_flag) setScore("!", "!");
  }
  
  // ** clear score field
  
  function flashScoreOff() { // blank space
    $("#score0").html("&nbsp;");
    $("#score1").html("&nbsp;");
  }
  
  // ** reset flags and counts
  
  function resetVals() {
    // console.log("Reset values.");
    start_flag = 0; // clear
    rec_flag = 0;
    steps_count = 0;
    score_flag = 0;
    speed_factor = 0;
    ssignal = "";
    signal_array = [];
    player_array = [];
    timeout_flag = 0;
    error_count = 0;
  }
  
  // ** is_won function
  
  function is_won() { // high score is 20
    // console.log("In is won. Steps: " + steps_count);
    if (steps_count > 19) { // 19 <-- 20
      // console.log("Player array: ");
      // console.log(player_array);
      // console.log("Length: " + player_array.length + " Last signal position: " + (player_array.length  - 1));
      var last_signal = player_array[player_array.length  - 1];
      var i = 0; 
      var id = setInterval(function() { // flash last button 2 x
        if (i < 2) { // 2 <-- 0 .. 1
          playSignal(last_signal);
          i++;
        }
        else
          clearInterval(id);
      }, 1000); // delay
      // console.log("Last signal: " + last_signal);
      setTimeout(function() { // end game
        // resetVals();
        // strict_flag = 0;   
        // on_flag = 0;
        // flashScoreOff();
        // disableBtns();
        // clearAllTimers();
        startNewGame(); // game starts over on win
      }, 1000);
    }
  }
  
  // ** display current steps_count
  
  function display_current_steps() {
    var num1, num2;
    if (steps_count >= 0 && steps_count <= 9) { // 1 .. 9
      num1 = "0";
      num2 = steps_count.toString();
      setScore(num1, num2); // update view
      // console.log("Display steps. Step count: " + steps_count);
    } 
    else if (steps_count >= 10 && steps_count <= 99) { // 10 .. 99
      num1 = parseInt(steps_count * 0.10);
      num2 = steps_count % 10;
      // console.log("Displat steps. Step count: " + steps_count + " n1: " + parseInt(num1) + " n2: " + num2);
      setScore(num1, num2); // update view
    }
  }
  
  // ** speed up signals
  
  function speedup_signals(steps_count) { // 1250
    if (steps_count === 5) { // 1000
      speed_factor = 250;
      // console.log("Speed factor: " + speed_factor);
    } 
    else if (steps_count === 10) { // 750
      speed_factor = 500;
      // console.log("Speed factor: " + speed_factor);
    } 
    else if (steps_count === 15) { // 500
      speed_factor = 750; 
      // console.log("Speed factor: " + speed_factor);
    }
  }
  
  // ** increment -- next step 00, 01, 02, 03 ...
  
  function inc_steps() { // e.g. set -- by steps 01, 02, 03 ...
    steps_count++;
    // console.log("Step count: " + steps_count);
    display_current_steps();
    speedup_signals(steps_count);
  }
  
  // ** clear timers - timeouts and intervals
  
  function clearAllTimers() { 
    clearInterval(play_signals_id); // Intervals
    clearTimeout(first_signal_id); // Timeouts
    clearTimeout(game_timeout_id);
    // console.log("In clear all timers."); // for debugging 
  }
  
  // ** on/off button
    
  $("#player_select").on("click", function() {
    option = $("input[name=inlineRadioOptions]:checked").val(); 
    if (option === "on") {
      // console.log("Simon Game: " + option);
      // console.log("Speed factor: " + speed_factor);
      on_flag = 1;
      enableBtns();
      flashScoreOn();
    } 
    else if (option === "off") {
      // console.log("Simon Game: " + option);
      on_flag = 0;
      strict_flag = 0; // if (strict_flag === 1) strict_flag = 0; // reset flag 
      var btn = document.getElementById("strict");
      btn.setAttribute("class", "btn btn-warning"); // reset button bsck to orange
      flashScoreOff();
      resetVals();
      disableBtns();
      clearAllTimers();
    }
  });
  
  // ** random number generator
  
  function getRandomNum(min, max) { // from Mozilla docs
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  // ** new signal
  
  function getSignal() { // 0 .. 3 
    return color_array[getRandomNum(0, 3)]; // i.e.--0, 1, 2, 3
  }
  
  // ** play random signal 
    
  function playRandomSignal() { // plays random signal on startup 
    var signal = getSignal();
    // console.log("First signal: " + signal);
    return playSignal(signal);
  }
  
  // ** flash error !!
  
  function flashError() { 
    flashScoreOff(); 
    setTimeout(function() { 
      flashScoreErr(); 
    }, 250);
    // console.log("Flash error.");
    playErrTone(); // play buzzer tone
  } 
  
  // ** flash score
  
  function flashScore() {
    flashScoreOff(); 
    setTimeout(function() { 
      flashScoreOn(); 
    }, 250);
    // console.log("Flash score.");
  } 
  
  // ** play signal array 
  
  function playSignals(signals) {
    // console.log("In play signals.");
    // console.log("In play signal(s): " + signals); // debugging
    var signal_count = 0; 
    start_flag = 0; // disable player input 
    display_current_steps(); // display current steps and clear error
    clearInterval(play_signals_id); 
    play_signals_id = setInterval(function() {
      if (signal_count < signals.length) {
        // console.log("Play signal " + signal_count + ": " + signals[signal_count]); // debugging
        playSignal(signals[signal_count]);
      }
      else {
        clearInterval(play_signals_id);
        start_flag = 1; // enable player input 
        // console.log("Play signals. Complete.");
        err_flag = 0; // clear error
        gameTimeout(); // set timeout
        gameTimeoutHandler(); // handle timeout event
      }
      signal_count++;
    }, (1250 - speed_factor)); // speed factor
  }
  
  // ** compare player signal to game signals 
  
  function compareSignals(simon_arr, player_arr) {
    // console.log(simon_arr.length);
    // console.log(player_arr.length);
    if (player_arr.length === simon_arr.length) { // if arrays are equal,
      for (var i = 0; i < simon_arr.length; i++) { // do the comparision 
        // console.log(simon_arr[i], i);
        // console.log(player_arr[i], i);
        if (simon_arr[i] !== player_arr[i]) {
          return 0; // no match, return false
        }
      }
      return 1; // match, return true
    }
    else 
      return -1; // arrays not equal
  }
   
  // ** set score on start up 
  
  function setScoreOnStartup() {
    setTimeout(function() { 
      if (score_flag) { // on startup
        inc_steps();
        score_flag = 0;
        rec_flag = 1; // player input
      }
    }, 2000); 
  }
  
  // ** replay next signals 
  
  function replayNextSignals() {
    // console.log("Replay next. Signal array: ");
    // console.log(signal_array);
    rec_flag = 0; // clear
    playSignals(signal_array); // replay signals 
    rec_flag = 1; // set
    ssignal = ""; // clear
    player_array = []; // reset player array // clear
    // console.log("Reset player array.");
    err_flag = 0; // clear
    // console.log("Replay next. Step count: " + steps_count + " Strict flag: " + strict_flag + " Error flag: " + err_flag);
  }
  
  // ** time out function -- 5 secs.
  
  function gameTimeout() {
    clearAllTimers();
    timeout_flag = 0; // clear
    // console.log("In timeout. Err flag: " + err_flag);
    game_timeout_id = setTimeout(function() { 
      err_flag = 1; // set
      timeout_flag = 1; // set
      // console.log("In timeout. ** Elapsed. ** Err state: " + err_flag); 
    }, 5000); // 5 secs.
  }
  
  // ** handle game timeout event 
  
  function gameTimeoutHandler() {
    clearTimeout(first_signal_id); // Timeouts
    first_signal_id = setTimeout(function() {
      // console.log("In timeout handler. Err flag: " + err_flag);
      if (err_flag) {
        flashError();
        // console.log("In timeout handler. Flash error. Strict flag: " + strict_flag);
        // console.log("In timeout handler. Player array: ");
        // console.log(player_array);
        if (result === -1) { // if timeout before player array equals signal array 
          // console.log("In timeout handler. Flash error. Not equal. Result: " + result);
          setTimeout(function() { // reset array and re-play signals 
            if (!strict_flag) {
              replayNextSignals(); 
            } 
            else {
              restartPlayFirstSignal(); 
            }
          }, 3000);
        }
        else {
          setTimeout(function() {
            // console.log("In timeout handler. Err flag: " + err_flag + " Recv flag: " + rec_flag);
            rec_flag = 0; // clear
            playFirstSignal(); // replay first signal
            rec_flag = 1; // set
          }, 2000);
        }
      }
    }, 5000);
  }
  
  // ** simon gives first signal
 
  function playFirstSignal() { // play signals 
    if (on_flag && signal_array.length === 0) { // no signals -- on startup
      // console.log("In play first signal 1. Err flag: " + err_flag + " Recv flag: " + rec_flag);
      // console.log("In play first signal 1. Result: " + result); // play signals 
      setTimeout(function() {
        start_flag = 0; // disable player input 
        var signal = playRandomSignal(); // play 1st signal
        start_flag = 1; // re-enable player input 
        signal_array.push(signal); // save first signal      
        ssignal = ""; // clear
        rec_flag = 0; // clear
        // console.log("Signal array 1: ");
        // console.log(signal_array);
      }, 1000);
      setScoreOnStartup();
      err_flag = 0; // clear
      gameTimeout(); // set timeout
      gameTimeoutHandler(); // handle timeout event
    }
    else if (on_flag && !err_flag && result === 1) { // greater or equal to 1 // first - one signal 
      // console.log("In play first signal 2. Err flag: " + err_flag + " Recv flag: " + rec_flag); // play signals 
      // console.log("In play first signal 2. Result: " + result); // play signals 
      result = 0; // reset
      clearAllTimers(); // if match, clear timeout 
      setTimeout(function() {
        var signal = getSignal();
        signal_array.push(signal); // and subsequent signals   
        rec_flag = 0; // clear
        playSignals(signal_array); // re-play first signal
        rec_flag = 1; // set
        ssignal = ""; // clear ssignal
        score_flag = 1; // set
        // console.log("Signal array 2: ");
        // console.log(signal_array);
      }, 1000);
      setScoreOnStartup();
    }
    else if (on_flag && err_flag && (result === 0 || result === -1)) { // on error, replay signal(s) 
      clearAllTimers(); // clear timeout 
      // console.log("In play first signal 3. Timeout: " + timeout_flag + " Strict flag: " + strict_flag);
      // console.log("In play first signal 3. Error count: " + error_count);
      if (!timeout_flag || result === 0 || result === -1) { // if elapsed timeout error, don't flash
        if (!timeout_flag && error_count >= 1) { 
          flashError(); 
        }
        timeout_flag = 0; // clear
      }
      if (timeout_flag || result === 0 || result === -1) {
        if (timeout_flag && error_count === 0 && strict_flag) { 
          flashError(); 
        }
        timeout_flag = 0; // clear
      }
      // console.log("In play first signal 3. Err flag: " + err_flag + " Recv flag: " + rec_flag); // play signals 
      // console.log("In play first signal 3. Result: " + result); // play signals 
      error_count = 0; // clear
      setTimeout(function() {
        if (!strict_flag) {
          replayNextSignals(); // re-play signal(s)
        } 
        else {
          restartPlayFirstSignal();
        }
      }, 3000);
      if (!strict_flag) {
        setTimeout(function() {
          display_current_steps(); // display current score 
        }, 2000);
      }
    }
  }
  
  // ** start a new game; new random signals
  
  function startNewGame() {
    // console.log("In start new game."); 
    clearAllTimers();
    resetVals(); // reset vals
    start_flag = 1; // set
    score_flag = 1; // set
    result = 0; // clear
    flashScore(); // blink score 2x
    setTimeout(function() {
      playFirstSignal(); // simon plays first signal
    }, 2000);
  }
    
  // ** start and strict buttons
  
  $("button").on("click", function() {
    switch(this.id) {
      case "start":   
        // console.log("Start button."); 
        startNewGame();
        break;
      case "strict":   
        var btn = document.getElementById("strict");
        if (strict_flag) { // if (strict_flag === 1)
          strict_flag = 0; // clear
          btn.setAttribute("class", "btn btn-warning");
          // console.log("Strict button: " + strict_flag); 
          break;
        }
        else {
          strict_flag = 1; // set
          btn.setAttribute("class", "btn btn-default");
          // console.log("Strict button: " + strict_flag); 
          break;
        }
      }
  });
  
  // ** reset flags and counts for strict mode
  
  function resetValsStrictMode() {
    // console.log("Reset values. Strict mode.");
    rec_flag = 0; // clear
    steps_count = 0;
    speed_factor = 0;
    ssignal = "";
    signal_array = [];
    player_array = [];
  }
  
  // ** restart play first signal strict mode
  
  function restartPlayFirstSignal() {
    resetValsStrictMode(); // reset game
    start_flag = 1; // set
    score_flag = 1;
    // console.log("In restart. Play first signal. Step count: " + steps_count + ". Strict: " + strict_flag);
    playFirstSignal(); // restart 
  }
  
  // ** wait for players button signals
  
  function waitForPlayerBtnSignals() {
    result = compareSignals(signal_array, player_array);
    if (result === -1) { // arrays are not equal lengths
      return;
    } else if (result === 1) { // result 
      err_flag = 0; // match, no error 
    } else if (result === 0) { // !result 
      err_flag = 1; // no match, error
      error_count++;
    }
    // console.log("Result of comp: " + result + " Error flag: " + err_flag + " Step count: " + steps_count);
    if (result === 1 && err_flag === 0) { // if (result && !err_flag)
      is_won(); // chech if game is won
      clearAllTimers(); // if match, clear timeout 
      if (steps_count >= 1) {
        rec_flag = 0; // clear
        setTimeout(function() {
          playFirstSignal();
        }, 2000);
        // console.log("Reset player array.");
        player_array = []; // reset player array 
        rec_flag = 1; // set
        // console.log("Wait for signals. Err flag: " + err_flag + " Recv flag: " + rec_flag);
        setTimeout(function() {
          display_current_steps(); // clear error in display // update display score on match
        }, 2000);
      }
    } 
    else if ((result === 0 || result === -1) && err_flag === 1) { // no match 
      clearAllTimers(); // notify button press is wrong 
      // console.log("No match. Error flag: " + err_flag + " Step count: " + steps_count);
      if (err_flag && steps_count >= 1) { // handles errors in play first signal
        // console.log("In error. Wait for signals. Step count: " + steps_count);
        if (steps_count >= 1 && !strict_flag) {
          setTimeout(function() {
            playFirstSignal();
          }, 2000);
          // console.log("In error. Repeat. Step count: " + steps_count + " Strict flag: " + strict_flag); 
        } 
        else if (steps_count >= 1 && strict_flag) { // restart game with new random series of button presses
          // console.log("In error. Restart. Steps count: " + steps_count + " Strict flag: " + strict_flag);
          playFirstSignal();
        }
      }
    }
  }
  
  // ** colored buttons

  $(".cells").on("click", function() {
    // id to colour
    if (start_flag) { // disable cells on startup 
      switch(this.id) {
        case "0": greenBtn(); break;
        case "1": redBtn(); break;
        case "2": yellowBtn(); break;
        case "3": blueBtn(); break;
      }
      // store players sequence
      if (rec_flag) { 
        player_array.push(ssignal);
        // console.log("Player array: ");
        // console.log(player_array);
        waitForPlayerBtnSignals(); 
      }
    }   
  }); 
               
});