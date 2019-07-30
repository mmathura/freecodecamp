// Q, W, E, A, S, D, Z, X, C

function Q() {
  $("#display").text("Q");
  $("#Q")[0].load();
  $("#Q")[0].currentTime = 0;
  $("#Q")[0].play();
}

function W() {
  $("#display").text("W");
  $("#W")[0].load();
  $("#W")[0].currentTime = 0;
  $("#W")[0].play();
}

function E() {
  $("#display").text("E");
  $("#E")[0].load();
  $("#E")[0].currentTime = 0;
  $("#E")[0].play();
}

function A() {
  $("#display").text("A");
  $("#A")[0].load();
  $("#A")[0].currentTime = 0;
  $("#A")[0].play();
}

function S() {
  $("#display").text("S");
  $("#S")[0].load();
  $("#S")[0].currentTime = 0;
  $("#S")[0].play();
}

function D() {
  $("#display").text("D");
  $("#D")[0].load();
  $("#D")[0].currentTime = 0;
  $("#D")[0].play();
}

function Z() {
  $("#display").text("Z");
  $("#Z")[0].load();
  $("#Z")[0].currentTime = 0;
  $("#Z")[0].play();
}

function X() {
  $("#display").text("X");
  $("#X")[0].load();
  $("#X")[0].currentTime = 0;
  $("#X")[0].play();
}

function C() {
  $("#display").text("C");
  $("#C")[0].load();
  $("#C")[0].currentTime = 0;
  $("#C")[0].play();
}

$(document).keypress(function (key) {

  // console.log(key.keyCode);

  switch (key.keyCode) {
    case 81:
      Q();
      break;
    case 87:
      W();
      break;
    case 69:
      E();
      break;
    case 65:
      A();
      break;
    case 83:
      S();
      break;
    case 68:
      D();
      break;
    case 90:
      Z();
      break;
    case 88:
      X();
      break;
    case 67:
      C();
      break;}

});

$("#bQ").click(function () {
  Q();
});

$("#bW").click(function () {
  W();
});

$("#bE").click(function () {
  E();
});

$("#bA").click(function () {
  A();
});

$("#bS").click(function () {
  S();
});

$("#bD").click(function () {
  D();
});

$("#bX").click(function () {
  X();
});

$("#bZ").click(function () {
  Z();
});

$("#bC").click(function () {
  C();
});