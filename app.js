// jshint loopfunc: true

(function() {

"use strict";

var holes = document.querySelectorAll("td");

var buttons = document.querySelectorAll("button");

var SPEED = localStorage.getItem("speed");

speedNode.innerHTML = SPEED;

var whack = function(state, action) {
  if (!state) {
    return {
      hole: Math.floor(Math.random() * 10) % 9,
      clicked: false,
      points: 0,
      speed: localStorage.getItem("speed")
    };
  }
  switch (action.type) {
    case "CHANGE_HOLE":
      return {
          hole: Math.floor(Math.random() * 10) % 9,
          clicked: false,
          points: state.points,
          speed: state.speed,
      };
    case "CLICK_HOLE":
      return {
          hole: state.hole,
          clicked: true,
          points: state.points + 1,
          speed: state.speed,
      };
    case "SET_SPEED":
      return {
          hole: state.hole,
          clicked: state.clicked,
          points: state.points,
          speed: action.speed,
      };
    default :
      return state;
  }
};

var render = function() {
  var state = store.getState();

  points.innerHTML = state.points;

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

var store = Redux.createStore(whack);

store.subscribe(render);
store.subscribe(changeSpeed);

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

  setInterval(function() {
    store.dispatch({type: "CHANGE_HOLE"});
  }, SPEED);

})();
