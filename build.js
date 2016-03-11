"use strict";

// jshint loopfunc: true, esversion: 6

(function () {

  "use strict";

  var holes = document.querySelectorAll("td");

  var buttons = document.querySelectorAll("button");

  var game = document.querySelector("table");

  var gameStarted = false;

  var start = void 0;

  var SPEED = localStorage.getItem("speed") ? localStorage.getItem("speed") : 600;
  var DIFFICULTY = localStorage.getItem("difficulty") ? localStorage.getItem("difficulty") : "Moyen";

  var whack = function whack(state, action) {
    if (!state) {
      return {
        hole: Math.floor(Math.random() * 10) % 9,
        clicked: false,
        points: 0,
        speed: localStorage.getItem("speed"),
        start: false,
        difficulty: "facile"
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
          difficulty: state.difficulty
        };
      case "CLICK_HOLE":
        return {
          hole: state.hole,
          clicked: true,
          points: state.points + 1,
          speed: state.speed,
          start: state.start,
          difficulty: state.difficulty
        };
      case "SET_SPEED":
        return {
          hole: state.hole,
          clicked: state.clicked,
          points: state.points,
          speed: action.speed,
          start: state.start,
          difficulty: action.difficulty
        };
      case "START_GAME":
        return {
          hole: state.hole,
          clicked: state.clicked,
          points: state.points,
          speed: state.speed,
          start: true,
          difficulty: state.difficulty
        };
      default:
        return state;
    }
  };

  var store = Redux.createStore(whack);

  var win = function win() {
    var end = new Date();
    var num = end - start;
    var seconds = Math.floor(num / 1000);
    var minutes = Math.floor(seconds / 60);
    seconds = seconds - minutes * 60;

    var score = {
      seconds: seconds,
      minutes: minutes,
      difficulty: DIFFICULTY
    };

    if (JSON.parse(localStorage.getItem("scores"))) {
      var oldScores = JSON.parse(localStorage.getItem("scores"));
      var newScores = oldScores;
      newScores.push(score);
      localStorage.setItem("scores", JSON.stringify(newScores));
    } else {
      var temp = [];
      temp.push(score);
      localStorage.setItem("scores", JSON.stringify(temp));
    }

    if (!minutes) {
      alert("Vous avez gagné en " + seconds + " secondes ! ");
    } else {
      alert("Vous avez gagné en " + minutes + " minutes et " + seconds + " secondes !");
    }

    location.reload();
  };

  var initialRender = function initialRender() {
    var scores = JSON.parse(localStorage.getItem("scores"));

    speedNode.innerHTML = SPEED;

    if (scores) {
      (function () {
        highlights.classList.remove("hidden");
        var ul = document.querySelector("ul");
        scores.forEach(function (score) {
          var li = document.createElement("li");

          var text = "";

          if (score.minutes) {
            text += score.minutes + " minutes ";
          }

          text += score.seconds + " secondes ";

          text += " - " + score.difficulty;

          var textNode = document.createTextNode(text);
          li.appendChild(textNode);
          ul.appendChild(li);
        });
      })();
    }
  };

  var render = function render() {
    var state = store.getState();

    points.innerHTML = state.points;

    if (state.points === 10) {
      win(state.difficulty);
    }

    holes[state.hole].classList.add("active");

    setTimeout(function () {
      holes[state.hole].classList.remove("active");
    }, SPEED);

    if (state.clicked) {
      holes[state.hole].classList.remove("active");
      holes[state.hole].classList.add("clicked");

      setTimeout(function () {
        holes[state.hole].classList.remove("clicked");
      }, SPEED);
    }
  };

  var changeSpeed = function changeSpeed() {
    var newSpeed = store.getState().speed;
    var newDifficulty = store.getState().difficulty;

    if (newSpeed !== localStorage.getItem("speed")) {
      localStorage.setItem("speed", newSpeed);
      localStorage.setItem("difficulty", newDifficulty);
      location.reload();
    }
  };

  var startGame = function startGame() {
    var gameState = store.getState().start;

    if (!gameStarted && gameState) {
      gameStarted = true;
      start = new Date();
      game.classList.toggle("hidden");
      launch.classList.toggle("hidden");
      setInterval(function () {
        store.dispatch({ type: "CHANGE_HOLE" });
      }, SPEED);
    }
  };

  store.subscribe(render);
  store.subscribe(changeSpeed);
  store.subscribe(startGame);

  var i = void 0;

  for (i = 0; i < holes.length; i++) {
    holes[i].addEventListener("click", function (e) {
      if (e.target.classList.contains("active")) {
        store.dispatch({ type: "CLICK_HOLE" });
      }
    });
  }

  for (i = 0; i < buttons.length; i++) {
    if (parseInt(buttons[i].value) === parseInt(SPEED)) {
      buttons[i].style = "border: 3px solid red; border-radius: 5px";
    }
    buttons[i].addEventListener("click", function (e) {
      store.dispatch({ type: "SET_SPEED", speed: parseInt(e.target.value), difficulty: e.target.innerHTML });
    });
  }

  launch.addEventListener("click", function () {
    store.dispatch({ type: "START_GAME" });
  });

  initialRender();
})();
