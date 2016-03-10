// jshint loopfunc: true

(function() {

"use strict";

var holes = document.querySelectorAll("td");

var buttons = document.querySelectorAll("button");

var game = document.querySelector("table");

var gameStarted = false;

var start;

var SPEED = localStorage.getItem("speed") ? localStorage.getItem("speed") : 600;

speedNode.innerHTML = SPEED;

var whack = function(state, action) {
  if (!state) {
    return {
      hole: Math.floor(Math.random() * 10) % 9,
      clicked: false,
      points: 0,
      speed: localStorage.getItem("speed"),
      start: false,
    };
  }
  switch (action.type) {
    case "CHANGE_HOLE":
      return {
          hole: Math.floor(Math.random() * 10) % 9,
          clicked: false,
          points: state.points,
          speed: state.speed,
          start: state.start,
      };
    case "CLICK_HOLE":
      return {
          hole: state.hole,
          clicked: true,
          points: state.points + 1,
          speed: state.speed,
          start: state.start,
      };
    case "SET_SPEED":
      return {
          hole: state.hole,
          clicked: state.clicked,
          points: state.points,
          speed: action.speed,
          start: state.start,
      };
    case "START_GAME":
      return {
          hole: state.hole,
          clicked: state.clicked,
          points: state.points,
          speed: state.speed,
          start: true,
      };
    default :
      return state;
  }
};

var render = function() {
  var state = store.getState();

  points.innerHTML = state.points;

  if (state.points === 10) {
    var end = new Date();
    var num = end - start;
    var seconds = Math.floor(num / 1000);
    var minutes = Math.floor(seconds / 60);
    seconds = seconds - (minutes * 60);
    if (!minutes) {
      alert("Vous avez gagné en " + seconds + " secondes ! ");
    } else {
      alert("Vous avez gagné en " + minutes + " minutes et " + seconds + " secondes !");
    }
    location.reload();
  }

  holes[state.hole].classList.toggle(state.clicked ? "clicked" : "active");
  setTimeout(function() {
    holes[state.hole].classList.toggle(state.clicked ? "clicked" : "active");
  }, SPEED);
};

var changeSpeed = function() {
  var newSpeed = store.getState().speed;

  if (newSpeed !== localStorage.getItem("speed")) {
    localStorage.setItem("speed", newSpeed);
    location.reload();
  }
};

var startGame = function() {
  var gameState = store.getState().start;

  if (!gameStarted && gameState) {
    gameStarted = true;
    start = new Date();
    game.classList.toggle("hidden");
    launch.classList.toggle("hidden");
    setInterval(function() {
      store.dispatch({type: "CHANGE_HOLE"});
    }, SPEED);
  }
};

var store = Redux.createStore(whack);

store.subscribe(render);
store.subscribe(changeSpeed);
store.subscribe(startGame);

var i;

for (i = 0; i < holes.length; i++) {
  holes[i].addEventListener("click", function(e) {
    if (e.target.classList.contains("active")) {
      store.dispatch({type: "CLICK_HOLE"});
    }
  });
}

for (i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener("click", function(e) {
    console.log(e);
    store.dispatch({type: "SET_SPEED", speed: parseInt(e.target.value)});
  });
}

launch.addEventListener("click", function() {
  store.dispatch({type: "START_GAME"});
});

})();
