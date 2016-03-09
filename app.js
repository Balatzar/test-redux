(function() {

"use strict";

var holes = document.querySelectorAll("td");

var SPEED = 400;

var whack = function(state, action) {
  if (!state) {
    return {
      hole: Math.floor(Math.random() * 10) % 9,
      clicked: false,
      points: 0,
    };
  }
  switch (action.type) {
    case "CHANGE_HOLE":
      return {
          hole: Math.floor(Math.random() * 10) % 9,
          clicked: false,
          points: state.points,
      };
    case "CLICK_HOLE":
      return {
          hole: state.hole,
          clicked: true,
          points: state.points + 1,
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

var store = Redux.createStore(whack);

store.subscribe(render);

var i;

for (i = 0; i < holes.length; i++) {
  holes[i].addEventListener("click", function(currentHole) {
    if (currentHole.target.classList.contains("active")) {
      store.dispatch({type: "CLICK_HOLE"});
    }
  });
}

setInterval(function() {
  store.dispatch({type: "CHANGE_HOLE"});
}, SPEED);

})();
