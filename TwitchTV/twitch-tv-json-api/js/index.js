$(document).ready(function() {
  
  var tmpstr_all = " "; // all channels
  var tmpstr_on = " ";  // online
  var tmpstr_off = " "; // offline

  // for channels
  
  var userid_arr = [
    "ESL_SC2",
    "OgamingSC2",
    "cretetion",
    "freecodecamp",
    "storbeck",
    "habathcx",
    "RobotCaleb",
    "noobs2ninjas"
  ];
  
  // generate urls for each user 

  var base_url = "https://wind-bow.gomix.me/twitch-api/";

  for (var i = 0; i < userid_arr.length; i++) {
    
    var users_url = base_url + "users/" + userid_arr[i] + "?callback=?";
    // var channs_url = base_url + "channels/" + userid_arr[i] + "?callback=?";
    var streams_url = base_url + "streams/" + userid_arr[i] + "?callback=?";

    // console.log(users_url + "\n");   // for debugging
    // console.log(channs_url + "\n");  // for debugging
    // console.log(streams_url + "\n"); // for debugging
    
    // get requrest for each user in array 

    getRequest(users_url, streams_url);
  }
  
  function generateItem(status, symbol, userid, chan_name, logo_url, text) {
    
      // list li tag item
      return (
      '<li class="list-group-item"><span class="badge alert-' +
      status +
      '"><span class="glyphicon glyphicon-' +
      symbol +
      '" aria-hidden="true"></span></span><div class="media"><div class="media-left media-middle"><a href="https://www.twitch.tv/' +
      userid +
      '" target="_blank"><img class="media-object img-circle" width="100" src="' +
      logo_url +
      '" alt="[Logo]"></a></div><div class="media-body"><h4 class="media-heading">' +
      chan_name +
      "</h4>" +
      text +
      "</div></div></li>");
  }

  function displayAll(data, flag, stream_status) {
    
    var status;
    var symbol;
    var logo_url; // for img tag in href anchor 
    
    var userid = data["name"]; // username
    var chan_name = data["display_name"]; // channel name 
    var bio = data["bio"]; // users bio 

    if (bio === null) bio = " "; // no bio - display empty text 

    if (data["logo"] === null) // no image - use placeholder png from twitchtv 
      logo_url = "http://static-cdn.jtvnw.net/jtv_user_pictures/xarth/404_user_150x150.png";
    else 
      logo_url = data["logo"]; // or use user's uploaded image 
    
    // determine status of each item
    
    if (flag) { // is set, 
      
      // stream is online, display stream status -- on i.e. what's being streamed or what's playing

      status = "success";
      symbol = "ok";
      tmpstr_on += generateItem(status, symbol, userid, chan_name, logo_url, stream_status);
    } 
    else {
      
      // stream is offline, display status -- off
      
      status = "warning";
      symbol = "warning-sign";
      tmpstr_off += generateItem(status, symbol, userid, chan_name, logo_url, bio);
    }

    tmpstr_all += generateItem(status, symbol, userid, chan_name, logo_url, bio);
    // console.log(tmpstr_all); // for debugging

    return tmpstr_all;
  }

  function getRequest(users_url, streams_url) {
    
    $.ajax({
      type: "GET",
      url: streams_url,
      async: false,
      dataType: "json",
      success: function(streams_resp) {
        var flag = 0; // passed value
        var stream_status;
        // console.log("Status ", streams_resp.stream); // for debugging
        if (streams_resp.stream) { // not null
          flag = 1; // set to active - i.e. streaming
          // console.log("Status ", streams_resp.stream.channel.name); // for debugging
          stream_status = streams_resp.stream.channel.status;
          // console.log("Status ", streams_resp.stream.channel.status); // for debugging
        }

        $.ajax({
          type: "GET",
          url: users_url,
          async: false,
          dataType: "json",
          data: { receivedPassed: [flag, stream_status] },
          success: function(users_resp) {
            // console.log("Resp ", users_resp); // object - for debugging
            // display results in html document as list on startup - i.e. on page load 
            document.getElementById("results").innerHTML = displayAll(users_resp, flag, stream_status);
          },
          failure: function(users_err) {
            alert("Error ", users_err);
          }
        });
      },
      failure: function(streams_err) {
        alert("Error ", streams_err);
      }
    });
  }

  $("#offline").click(function(event) {
    document.getElementById("results").innerHTML = tmpstr_off;
  });

  $("#online").click(function(event) {
    document.getElementById("results").innerHTML = tmpstr_on;
  });

  $("#all").click(function(event) {
    document.getElementById("results").innerHTML = tmpstr_all;
  });
  
});