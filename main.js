/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports) {

	// jshint loopfunc: true, esversion: 6

	(function() {

	"use strict";

	const holes = document.querySelectorAll("td");

	const buttons = document.querySelectorAll("button");

	const game = document.querySelector("table");

	let gameStarted = false;

	let gameWon = false;

	let start;

	let SPEED = localStorage.getItem("speed") ? localStorage.getItem("speed") : 600;
	let DIFFICULTY = localStorage.getItem("difficulty") ? localStorage.getItem("difficulty") : "Moyen";

	const createStore = reducer => {
	  let state;
	  let listeners = [];

	  const getState = () => state;

	  const dispatch = action => {
	   // debugger
	    state = reducer(state, action);

	    let i, j;

	    for (i = 0; i < listeners.length; i++) {
	        for (j = 0; j < listeners[i].actions.length; j++) {
	          if (listeners[i].actions[j] === action.type) {
	            listeners[i].effect();
	          }
	        }
	    }
	  };

	  const subscribe = listener => {
	    listeners.push(listener);
	  };

	  dispatch({});

	  return { getState, dispatch, subscribe };
	};

	const whack = (state, action) => {
	  if (!state) {
	    return {
	      hole: Math.floor(Math.random() * 10) % 9,
	      clicked: false,
	      points: 0,
	      speed: localStorage.getItem("speed"),
	      start: false,
	      difficulty: "facile",
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
	          difficulty: state.difficulty,
	      };
	    case "CLICK_HOLE":
	      return {
	          hole: state.hole,
	          clicked: true,
	          points: state.points + 1,
	          speed: state.speed,
	          start: state.start,
	          difficulty: state.difficulty,
	      };
	    case "SET_SPEED":
	      return {
	          hole: state.hole,
	          clicked: state.clicked,
	          points: state.points,
	          speed: action.speed,
	          start: state.start,
	          difficulty: action.difficulty,
	      };
	    case "START_GAME":
	      return {
	          hole: state.hole,
	          clicked: state.clicked,
	          points: state.points,
	          speed: state.speed,
	          start: true,
	          difficulty: state.difficulty,
	      };
	    default :
	      return state;
	  }
	};

	const store = createStore(whack);

	const win = () => {
	  gameWon = true;

	  const end = new Date();
	  let num = end - start;
	  let seconds = Math.floor(num / 1000);
	  let minutes = Math.floor(seconds / 60);
	  seconds = seconds - (minutes * 60);

	  const score = {
	    seconds,
	    minutes,
	    difficulty: DIFFICULTY
	  };

	  if (JSON.parse(localStorage.getItem("scores"))) {
	    const oldScores = JSON.parse(localStorage.getItem("scores"));
	    const newScores = oldScores;
	    newScores.push(score);
	    localStorage.setItem("scores", JSON.stringify(newScores));
	  } else {
	    const temp = [];
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

	var initialRender = () => {
	  const scores = JSON.parse(localStorage.getItem("scores"));

	  speedNode.innerHTML = SPEED;

	  if (scores) {
	    highlights.classList.remove("hidden");
	    const ul = document.querySelector("ul");
	    scores.forEach(function(score) {
	      const li = document.createElement("li");

	      let text = "";

	      if (score.minutes) {
	        text += score.minutes + " minutes ";
	      }

	      text += score.seconds + " secondes ";

	      text += " - " + score.difficulty;

	      const textNode = document.createTextNode(text);
	      li.appendChild(textNode);
	      ul.appendChild(li);
	    });
	  }
	};

	const render = () => {
	  const state = store.getState();

	  points.innerHTML = state.points;

	  if (state.points === 10 && !gameWon) {
	    win(state.difficulty);
	  }

	  holes[state.hole].classList.add("active");

	  setTimeout(function() {
	    holes[state.hole].classList.remove("active");
	  }, SPEED);

	  if (state.clicked) {
	    holes[state.hole].classList.remove("active");
	    holes[state.hole].classList.add("clicked");

	    setTimeout(function() {
	      holes[state.hole].classList.remove("clicked");
	    }, SPEED);
	  }
	};

	const changeSpeed = () => {
	  const newSpeed = store.getState().speed;
	  const newDifficulty = store.getState().difficulty;

	  if (newSpeed !== localStorage.getItem("speed")) {
	    localStorage.setItem("speed", newSpeed);
	    localStorage.setItem("difficulty", newDifficulty);
	    location.reload();
	  }
	};

	const startGame = () => {
	  const gameState = store.getState().start;

	  if (!gameStarted && gameState) {
	    gameStarted = true;
	    start = new Date();
	    game.classList.toggle("hidden");
	    launch.classList.toggle("hidden");
	    setInterval(() => {
	      store.dispatch({type: "CHANGE_HOLE"});
	    }, SPEED);
	  }
	};

	store.subscribe({ effect: render, actions: ["CHANGE_HOLE", "CLICK_HOLE"]});
	store.subscribe({ effect: changeSpeed, actions: ["SET_SPEED"] });
	store.subscribe({ effect: startGame, actions: ["START_GAME"] });

	let i;

	for (i = 0; i < holes.length; i++) {
	  holes[i].addEventListener("click", e => {
	    if (e.target.classList.contains("active")) {
	      store.dispatch({type: "CLICK_HOLE"});
	    }
	  });
	}

	for (i = 0; i < buttons.length; i++) {
	  if (parseInt(buttons[i].value) === parseInt(SPEED)) {
	    buttons[i].style = "border: 3px solid red; border-radius: 5px";
	  }
	  buttons[i].addEventListener("click", function(e) {
	    store.dispatch({type: "SET_SPEED", speed: parseInt(e.target.value), difficulty: e.target.innerHTML});
	  });
	}

	launch.addEventListener("click", () => {
	  store.dispatch({type: "START_GAME"});
	});

	initialRender();

	})();


/***/ }
/******/ ]);