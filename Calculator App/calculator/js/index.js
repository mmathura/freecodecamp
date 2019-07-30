$(document).ready(function() {
  
  var tmpstr   = "";
  var eval_str = "";
  var tmp_disp = "";
  var pr_operator = 0; // for % operator
  var op_function = 0;
 
  // update display
  
  function update() {
    // console.log("tmpstr = " + tmpstr);
    if (tmpstr.length === 0 || tmpstr === "NaN" || tmpstr === "") {
      if (op_function) {
        document.getElementById("display").placeholder = tmp_disp;
      }
      else
        document.getElementById("display").placeholder = "0";
    } else if (tmpstr.length > 0) {
        tmpstr = tmpstr.replace(/^0+[0-9]*/g, "0"); // deals with leading zeros
        // alert(tmpstr);
        document.getElementById("display").placeholder = tmpstr;
        if (tmpstr === "0") tmpstr = "";
    }
    pr_operator = 0;
    op_function = 0;
    // console.log("tmpstr = " + tmpstr);
  }

  $("button").on("click", function(event) {
        
    event.preventDefault();
        
    // alert("Handler for .on() called: " + event.target.id);
    
    switch (event.target.id) {
      case "0":
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9": 
        { tmpstr += event.target.id.toString(); } break;
      case "del":
        { tmpstr = tmpstr.slice(0, tmpstr.length - 1); } break; // delete last char
      case "clear":
        { tmpstr = ""; tmp_disp = ""; eval_str = ""; pr_operator = 0; op_function = 0; } break;
      case ".": {
          /* alert("Decomal . key pressed"); */
          if (tmpstr.indexOf(".") >= 1) break; // if decimal occurs twice, exit
          if (tmpstr === "") tmpstr += "0"; // leading zero, if decimal is pressed: .01 -> 0.01
          tmpstr += "."; // append decimal
        }
        break;
      case "neg": { // toggle positive and negative numbers
        if (tmpstr[0] === "-") { // negitive 
          tmpstr = tmpstr.slice(1, tmpstr.length); // to pos
          // alert(tmpstr);
        } else if (tmpstr[0] !== "-") { // positive
            if (tmpstr.length > 0 && tmpstr !== "0") // can't have negative zero 
              tmpstr = "-" + tmpstr; // to neg
          }
        }
        break;
      case "+":
        { 
          // alert(tmpstr); 
          eval_str += (tmpstr + "+");
          op_function++;
          // alert(op_function);
          tmp_disp += tmpstr;
          tmpstr = "";
        }
        break;
        case "-":
        { 
          // alert(tmpstr); 
          eval_str += (tmpstr + "-");
          op_function++;
          tmp_disp += tmpstr;
          tmpstr = "";
        }
        break;
        case "*":
        { 
          // alert(tmpstr); 
          eval_str += (tmpstr + "*");
          op_function++;
          tmp_disp += tmpstr;
          tmpstr = "";
        }
        break;
        case "/":
        { 
          // alert(tmpstr); 
          eval_str += (tmpstr + "/");
          op_function++;
          tmp_disp += tmpstr;
          tmpstr = "";
        }
        break;
        case "%":
        { 
          // alert(tmpstr); 
          eval_str += (tmpstr + "*0.01");
          // console.log("Eqn: " + eval_str);
          tmpstr = eval(eval_str).toString();
          pr_operator++;
          eval_str = "";
        }
        break;
      case "=":
        {
          if (pr_operator) eval_str = ""; // dont eval the percent operation
          if (!pr_operator) { // otherfunctions, operators +, -, /, *
            eval_str += tmpstr; // append current value entered in display
            // alert(tmpstr);
            // console.log("Eqn: ", eval_str);
            // .toPrecision(4) // for precision 
            tmpstr = eval(eval_str).toString(); // perform calculation
            eval_str = "";
            tmp_disp = "";
          }
        }
        break;
    }
    
    update(); // display 
    
  });
});