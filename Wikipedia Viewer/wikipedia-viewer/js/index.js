$(document).ready(function() {
  
  // can use this but see it in jquery below
  
  /* function key_down(event) {
    
    var key_code = event.keyCode;
     
    switch(key_code) {
        case 8:  // backspace  
        case 46: // delete
          document.getElementById("table_data").innerHTML = "&nbsp";
          break;
        default: 
          break;
     }
    
  }
  
  document.addEventListener("keydown", key_down); */
  
  // check if user starts to delete the input
    
  $("#myinput").keydown(function(event) { 
    
    switch(event.keyCode) {
        case 8:  // backspace  
        case 46: // delete
          // reset display results to blank
          // alert("Key pressed"); // for debugging
          document.getElementById("table_data").innerHTML = "&nbsp";
          break;
        default: 
          break;
     }
  
  });

  $("#mysearch").click(function(event) {
    
    event.preventDefault();

    // escape string ex. %20
    
    var starget = encodeURIComponent($("#myinput").val().toString());
    // console.log(starget); // for debugging

    // if starget str .length is 0, don't submit request

    if (starget.length > 0) {
      
      // From Wikipedia API Search and Discovery

      var surl =
        "https://en.wikipedia.org/w/api.php?action=opensearch&search=" +
        starget +
        "&format=json&origin=*";
      // console.log(surl); // for debugging
      
      // request 

      $.ajax({
        type: "GET",
        url: surl,
        async: false,
        dataType: "json",
        success: function(resp) {
          // console.log("Resp ", resp.length); // for debugging
          // display results in html document as table data - td
          document.getElementById("table_data").innerHTML = display(resp);
        },
        failure: function(err) {
          alert("Error ", err);
        }
      });
      
    }
    else { // form empty
      // clear display when forms is empty
      document.getElementById("table_data").innerHTML = "&nbsp";
    }
    
    // table of results 
    
    function display(data) {
      
      var sdata = "<table><td>";

      for (var i in data[1]) {
        // console.log(data[1][i]); // display title            // for debugging
        // console.log(data[2][i]); // display description      // for debugging
        // console.log(data[3][i]); // display link to article  // for debugging
        // console.log("\n");                                   // for debugging

        var tmpstr =
          "<tr><strong>" +
          data[1][i] +
          "</strong><br>" +
          data[2][i] +
          "<br>" +
          '<a href="' +
          data[3][i] +
          '" target="_blank">' +
          data[3][i] +
          "</a><br><br></tr>";
        
        sdata += tmpstr;
      }

      sdata += "</td></table>";

      // console.log(sdata); // for debugging

      return sdata;
      
    }
    
  });
           
});