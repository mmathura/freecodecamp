$(document).ready(function() {
  
  var tmpstr   = "";
  var eval_str = "";
  var tmp_disp = "";
  var pr_operator = 0; // for % operator
  var op_function = 0; // for math operator 
  var eq_flg = 0;
  var dv_flg = 0;
  var op_flg = 0;
  
  // handle operator
  
  function operator(str_op) {
    // alert(tmpstr); // debugging
    eval_str += (tmpstr + str_op);
    op_function++;
    // alert(op_function); // debugging
    tmp_disp += tmpstr;
    // console.log("Disp: " + tmp_disp); // for debugging
    tmpstr = "";
  }
 
  // update display
  
  function update() {
    // console.log("tmpstr = " + tmpstr); // debugging
    if (tmpstr.length === 0 || tmpstr === "NaN" || tmpstr === "") {
      if (op_function) {
        document.getElementById("display").placeholder = tmp_disp;
      }
      else
        document.getElementById("display").placeholder = "0";
    } else if (tmpstr.length > 0) {
        tmpstr = tmpstr.replace(/^0+[0-9]*/g, "0"); // deals with leading zeros
        // alert(tmpstr); // debugging
        // console.log(dv_flg);
        // console.log(tmpstr);
        if (tmpstr === "Infinity") tmpstr = "0"; // divide 0 error 
        document.getElementById("display").placeholder = tmpstr;
        if (tmpstr === "0" && !dv_flg) tmpstr = "";
    }
    pr_operator = 0;
    op_function = 0;
    tmp_disp = "";
    // console.log("Operator: " + op_flg); // debugging
    // console.log("Tmpstr: " + tmpstr); // debugging
  }
  
  // handle button clicks 

  $(".cells").on("click", function() {
                
    // console.log("Cell: " + this.id); // debugging
  
    switch (this.id) {
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
        { if (eq_flg) { tmpstr = ""; eq_flg = 0; } tmpstr += this.id.toString(); op_flg = 0; } break;
      case "del":
        { tmpstr = tmpstr.slice(0, tmpstr.length - 1); } break; // delete last char
      case "clear":
        { tmpstr = ""; tmp_disp = ""; eval_str = ""; pr_operator = 0; op_function = 0; } break;
      case ".": {
          /* alert("Decomal . key pressed"); // debuggingg */
          eq_flg = 0;
          if (tmpstr.indexOf(".") >= 1) break; // if decimal occurs twice, exit
          if (tmpstr === "") tmpstr += "0"; // leading zero, if decimal is pressed: .01 -> 0.01
          tmpstr += "."; // append decimal
        }
        break;
      case "neg": { // toggle positive and negative numbers
        eq_flg = 0;
        if (tmpstr[0] === "-") { // negitive 
          tmpstr = tmpstr.slice(1, tmpstr.length); // to pos
          // alert(tmpstr); // debugging
        } else if (tmpstr[0] !== "-") { // positive
            if (tmpstr.length > 0 && tmpstr !== "0") // can't have negative zero 
              tmpstr = "-" + tmpstr; // to neg
          }
        }
        break;
      case "+":
        { 
          if (!op_flg) {
            if (tmpstr.length === 0) { tmpstr = "0"; operator("+"); } 
          }
          if (tmpstr.length > 0) operator("+"); 
          op_flg++;
        } break;
      case "-":
        { 
          if (!op_flg) {
            if (tmpstr.length === 0) { tmpstr = "0"; operator("-"); }
          }
          if (tmpstr.length > 0) operator("-"); 
          op_flg++;
        } break;
      case "*":
        { 
          if (!op_flg) {
            if (tmpstr.length === 0) { tmpstr = "0"; operator("*"); } 
          }
          if (tmpstr.length > 0) operator("*"); 
          op_flg++;
        } break;
      case "/":
        { 
          if (!op_flg) {
            if (tmpstr.length === 0) { tmpstr = "0"; operator("/"); } 
          }
          if (tmpstr.length > 0) operator("/");
          op_flg++;
          dv_flg++;
        } break;
      case "%":
        { 
          // alert(tmpstr); // debugging
          if (tmpstr.length > 0) {
            eval_str += (tmpstr + "*0.01");
            // console.log("Eqn Pr: " + eval_str); // debugging
            tmpstr = eval(eval_str).toString(); // convert to %
            pr_operator++;
            eval_str = ""; 
          }
        }
        break;
      case "=":
        {
          // console.log(tmpstr); // debugging
          if (tmpstr.length === 0) { eval_str = ""; if (op_flg) op_flg = 0; }
          if (pr_operator) eval_str = ""; // dont eval the percent operation
          if (!pr_operator) { // other functions, operators +, -, /, *
            eval_str += tmpstr; // append current value entered in display
            // alert(tmpstr); // debugging
            // console.log("Eqn: " + eval_str); // debugging
            // .toPrecision(4) // for precision 
            if (eval_str.length > 0) 
              tmpstr = eval(eval_str).toString(); // perform calculation
            eval_str = "";
            tmp_disp = "";
          }
          eq_flg++;
          if (dv_flg) dv_flg = 0; // clear
        }
        break;
    }
    
    update(); // display 
    
  });
});