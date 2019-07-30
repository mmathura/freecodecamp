var fahrenheit;
var celsius;

// display weather in current location

function getWeather(lat, long) {
  var url =
    "https://fcc-weather-api.glitch.me/api/current?lat=" +
    parseInt(lat) +
    "&lon=" +
    parseInt(long);
  // console.log(url);
  var request = new XMLHttpRequest();
  request.open("GET", url);
  request.responseType = "json";
  request.send();

  request.onload = function() {
    var resp = request.response;
    var temperature = resp["main"]["temp"];
    var description = resp["weather"][0]["description"];
    var icon_url = resp["weather"][0]["icon"];
    celsius = parseFloat(temperature).toFixed(1);
    fahrenheit = convertTemp(celsius);
    document.getElementById("Temperature").innerHTML = celsius.toString() + "<sup>o</sup>C";
    document.getElementById("Description").innerHTML = description;
    document.getElementById("Icon").innerHTML =
      '<img class="img-default " src="' + icon_url + '" alt="[Icon]">';
  };
}

// determine where user is

function getLocation() {
  var lat; // latitude
  var long; // longitude
  if ("geolocation" in navigator) {
    // geolocation is available
    navigator.geolocation.getCurrentPosition(function(pos) {
      lat = pos.coords.latitude;
      long = pos.coords.longitude;
      // console.log("Latitude:  ", lat);
      // console.log("Longatude: ", long);
      
      // Use your own Google API key here 
      var url =
        "https://maps.googleapis.com/maps/api/geocode/json?latlng=" +
        lat +
        "," +
        long +
        "&key=[Google Api Key]"; // Use your OWN Google API key here 
      // console.log(url);

      var request = new XMLHttpRequest();
      request.open("GET", url);
      request.responseType = "json";
      request.send();

      request.onload = function() {
        var resp = request.response;
        var city = resp["results"][0]["address_components"][4]["long_name"];
        var country = resp["results"][0]["address_components"][7]["long_name"];
        document.getElementById("Location").innerHTML = city + ", " + country;
      };
      
      getWeather(lat, long);
      
    });
  } else {
    // geolocation IS NOT available
    console.log("Geolocation is not available or ad blocker is turned on");
  }
}

function getFahrenheit() {
  document.getElementById("Temperature").innerHTML = fahrenheit.toString() + "<sup>o</sup>F";
}

// push button to toggle between Fahrenheit/Celsius

function convertTemp(celsius) {
  // 1C = 33.8F, 0C = 32.0F
  return ((celsius * 1.8) + 32).toFixed(1);
}
