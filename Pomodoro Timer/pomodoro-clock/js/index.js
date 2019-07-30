$(document).ready(function(event) {
  
  // var timeoutID; // for the interval
  var timerID; // 60 sec timer

  var count = 0;  // interval number 
  var duration = Math.trunc(session_length.value / break_length.value); // number of intervals
  var seconds = 59; // 0 - 59 = 60 secs

  var counter = session_length.value * 60000; // 60 * 1000 = 60000// length of session in ms
  var minutes = counter / 60000; // 60 * 1000 = 60000 // session length in mins

  var secs_disp = ""; // display seconds as text :ss
  var mins_disp = minutes.toString(); // display minutes as text mm: 
  
  var i = 0; // count for seconds
    
  function clearAlert() {
    // alert("Stop"); // debugging
    // clearInterval(timeoutID);
    clearInterval(timerID);
  }
  
  function slowAlert() {
    // callback for timeoutID 
    // alert('Slow down!'); // debugging
    count++;
    // alert("Break: " + count + " of " + duration); // debugging
    beep(); // sound/tone 
    if (count >= duration) 
      clearAlert(); // stop timer
  }

  function countdown_timer() {
    
    i++;
    if (i >= break_length.value * 60) {
      // alert("break"); // debugging
      i = 0; // reset sec count
      slowAlert(); // alert
    }
        
    if (seconds == 59 && minutes > 0) {
      --minutes;
      // console.log("Mins.: ", minutes); // debugging
      if (minutes >= 0 && minutes <= 9) { // 0 to 9
        mins_disp = "0" + minutes.toString(); // add leading zero 00, 01 ...
      } else if (minutes >= 10) { // 10 to 59
        mins_disp = minutes.toString(); // display minutes mm:ss
        // console.log("Mins. disp: ", mins_disp); // debugging
      }
    } 
    
    if (seconds >= 0 && seconds <= 9) { // 0 to 9
      secs_disp = "0" + seconds.toString(); // add leading zero 00, 01 ...
    } else if (seconds >= 10) { // 10 to 59
      secs_disp = seconds.toString(); // display seconds 
    }
   
    // display countdown timer mm:ss or 0:00
    
    // alert(minutes + ":" + seconds); // debugging
    // alert(mins_disp + ":" + secs_disp); // debugging
    
    session_display.value =
      (minutes !== 0 ? mins_disp : "00") +
      ":" +
      (seconds !== 0 ? secs_disp : "00");
        
    if (seconds > 0) 
      seconds--; // decrement seconds
    else if (seconds === 0 && count < duration)
      seconds = 59; // start over
  }

  function start_timer() { // 1 sec. = 1000 ms
    timerID = setInterval(countdown_timer, 1000);
  }
  
  function beep() {
    // from the beeplay.js documentation
    var intro = beeplay({ bpm: 132 })
      .play(null, 2)
      .play("D#5", 1/4)
      .play("E5", 1/4)
      .play("F#5", 1/2);
  }

  function delayedAlert() {
    clearAlert(); // delete timer IDs 
    // timeoutID = setInterval(slowAlert, break_length.value * 60000);
    // hours * minutes * seconds = 1 * 60 * 1000
    if (session_display.value == "25") { 
      counter = session_length.value * 60000;
      minutes = counter / 60000; 
    }
    // number of intervals
    duration = Math.trunc(session_length.value / break_length.value); 
    start_timer();
    // be able to press play again once timeer has elapsed 
  }

  function resetForm() {
    // alert("Reset"); // debugging
    clearAlert();
    break_length.value = "5";
    session_length.value = "25";
    session_display.value = "25";
    duration = Math.trunc(session_length.value / break_length.value);
    count   = 0;
    seconds = 59;
    counter = session_length.value * 60000;
    minutes = counter / 60000;
    i = 0;
  }

  $("button").on("click", function(event) {
    // alert("Handler for .on() called: " + event.target.id); // debugging
    event.preventDefault();

    switch (event.target.id) {
      case "start":
        delayedAlert();
        break;
      case "reset":
        resetForm();
        break;
      case "stop":
        clearAlert();
        break;
    }
    // for debugging // data from form
    // console.log(break_length.value);
    // console.log(session_length.value);
    // console.log(duration);
  });
});