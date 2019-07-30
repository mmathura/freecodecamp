// array of quotes and authors, hard coded for testing

var quote_arr = [
  { quote: "There is nothing permanent except change.", author: "Heraclitus" },
  { quote: "You cannot shake hands with a clenched fist.", author: "Indira Gandhi"},
  { quote: "The only journey is the one within.", author: "Rainer Maria Rilke"},
  { quote: "Learning never exhausts the mind.", author: "Leonardo da Vinci" },
  { quote: "Think in the morning. Act in the noon. Eat in the evening. Sleep in the night.", author: "William Blake"},
  { quote: "Being entirely honest with oneself is a good exercise.", author: "Sigmund Freud"}
];

// get quotes from API to fill array etc.

// from Mozilla docs, Math.random, inclusive range

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// get random number, i.e. the index into the quote array

function displayQuote() {
  // load random quote on webpage startup
  var index = getRandomInt(0, quote_arr.length);
  // if index is positive, 0 to max array length
  if (index >= 0) {
    document.getElementById("new_quote").innerHTML = quote_arr[index].quote;
    document.getElementById("new_author").innerHTML = quote_arr[index].author;
  }
  // console.log("Display quote function");
  // when quote is displayed, modify the href to tweet quote at same time
  tweetQuote();
}

// tweets a quote using a specialized string format

function tweetQuote() {
  var tmp_quote = document.getElementById("new_quote").innerHTML;
  var tmp_author = document.getElementById("new_author").innerHTML;
  var tmp_str = tmp_quote + "%20" + tmp_author;
  // replace spaces in quote and author with %20
  tmp_str = tmp_str.split(" ").join("%20");
  // console.log(tmp_str);
  // console.log("https://twitter.com/intent/tweet?text=" + tmp_str + "&hashtags=quotes");
  // From twitter API combine strings as follows
  var tweet_url = "https://twitter.com/intent/tweet?text=" + tmp_str + "&hashtags=quotes";
  // console.log(tweet_url);
  // assign new url to href
  document.getElementById("tweet_button").href = tweet_url;
}