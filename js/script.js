import Timer from "./timer.js";
import Button from "./button.js";
import Modal from "./modal.js";
import Theme from "./theme.js";
import Sounds from "./sounds.js";

const BODY = document.querySelector(".body");
const GAME_CONTAINER = createContainer("game", true);
const GAME_WRAP = document.createElement("div");
const { MINUTES, SECONDS } = getTimer();
const SAVE_BUTTON = new Button("Save game", "game").create();
const RANDOM_GAME_BUTTON = new Button("Random game", "game").create();
const SOLUTION_BUTTON = new Button("Solution", "game").create();
const CONTINUE_GAME_BUTTON = new Button("Continue last game", "game").create();
const RESET_GAME_BUTTON = new Button("Reset game", "game").create();
const MODAL_WIN = new Modal("modal-win");
const MODAL_SCORE = new Modal("modal-scores");
const THEME_ICONS = new Theme(30, 30);
const SOUNDS = new Sounds();

const DIFFICULTY = { 5: "Easy", 10: "Medium", 15: "Hard" };
const GET_THEME = localStorage.getItem("CURRENT_THEME");
const SOUNDS_STATE = localStorage.getItem("SOUNDS_STATE")
  ? localStorage.getItem("SOUNDS_STATE")
  : "on";

const TEMPLATE = {
  5: {
    "Goblet": [
      [0, 1, 1, 1, 0],
      [0, 1, 1, 1, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 1, 1, 1, 0],
    ],
    "Flight": [
      [1, 1, 1, 1, 1],
      [0, 0, 1, 0, 0],
      [1, 1, 1, 1, 1],
      [0, 1, 1, 1, 0],
      [0, 0, 1, 0, 0],
    ],
    "Mask": [
      [1, 1, 1, 1, 1],
      [1, 0, 1, 0, 1],
      [1, 1, 1, 1, 1],
      [0, 1, 1, 1, 0],
      [0, 0, 1, 0, 0],
    ],
    "Note": [
      [0, 1, 1, 1, 1],
      [0, 1, 0, 0, 1],
      [0, 1, 0, 0, 1],
      [1, 1, 0, 1, 1],
      [1, 1, 0, 1, 1],
    ],
    "Smile": [
      [1, 1, 0, 1, 1],
      [1, 1, 0, 1, 1],
      [0, 0, 0, 0, 0],
      [1, 0, 0, 0, 1],
      [0, 1, 1, 1, 0],
    ],
  },
  10: {
    "Scull": [
      [0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
      [0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [0, 1, 0, 1, 1, 0, 1, 1, 0, 0],
      [0, 1, 0, 1, 1, 0, 1, 1, 0, 0],
      [0, 1, 1, 1, 1, 1, 1, 1, 0, 0],
      [0, 0, 1, 1, 1, 1, 1, 0, 0, 0],
      [0, 1, 0, 0, 0, 0, 0, 1, 0, 0],
      [0, 0, 1, 1, 1, 1, 1, 0, 0, 0],
      [0, 0, 0, 1, 1, 1, 0, 0, 0, 0],
    ],
    "Camel": [
      [0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
      [0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
      [0, 0, 0, 1, 1, 0, 0, 0, 0, 0],
      [0, 0, 1, 1, 1, 1, 0, 1, 1, 0],
      [0, 1, 1, 1, 1, 1, 1, 1, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
      [0, 1, 1, 0, 0, 1, 1, 0, 0, 0],
      [0, 1, 1, 0, 0, 1, 1, 0, 0, 0],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ],
    "Cat": [
      [0, 0, 1, 0, 1, 0, 0, 0, 0, 0],
      [0, 1, 1, 1, 1, 0, 0, 0, 0, 0],
      [1, 0, 1, 1, 1, 0, 0, 0, 0, 0],
      [1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
      [0, 1, 1, 1, 0, 0, 0, 0, 0, 0],
      [0, 0, 1, 1, 1, 1, 0, 0, 0, 0],
      [0, 0, 1, 1, 1, 1, 1, 0, 0, 0],
      [0, 1, 1, 1, 1, 1, 1, 0, 0, 1],
      [0, 1, 1, 0, 1, 1, 1, 0, 1, 1],
      [1, 1, 0, 1, 1, 1, 1, 1, 1, 0],
    ],
    "Cup": [
      [0, 0, 1, 0, 1, 0, 1, 0, 0, 0],
      [0, 0, 1, 0, 1, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 1, 1, 1, 1, 1, 1, 1, 0, 0],
      [0, 1, 1, 0, 1, 1, 1, 1, 1, 1],
      [0, 1, 1, 0, 1, 1, 1, 1, 0, 1],
      [0, 1, 1, 1, 0, 1, 1, 1, 1, 0],
      [0, 1, 1, 1, 1, 1, 1, 1, 0, 0],
      [1, 0, 1, 1, 1, 1, 1, 0, 0, 1],
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    ],
    "Duck": [
      [0, 1, 1, 1, 1, 0, 0, 0, 0, 0],
      [0, 1, 0, 1, 1, 0, 0, 0, 0, 0],
      [1, 1, 1, 1, 1, 0, 0, 0, 0, 1],
      [0, 0, 1, 1, 0, 0, 0, 0, 1, 1],
      [0, 0, 1, 1, 1, 1, 1, 1, 1, 1],
      [0, 0, 1, 1, 1, 1, 0, 1, 1, 1],
      [1, 0, 1, 1, 0, 0, 1, 1, 1, 0],
      [1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
      [0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
    ],
  },
  15: {
    "Squirrel": [
      [0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0],
      [1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0],
      [0, 1, 1, 0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0],
      [0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0],
      [0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0],
      [0, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
      [1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
      [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
      [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
    ],
    "Fish": [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1],
      [0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1],
      [0, 1, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0],
      [0, 0, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0],
      [0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0, 1, 1, 0],
      [0, 0, 1, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1],
      [0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ],
    "Mushroom": [
      [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
      [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
      [0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0],
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
      [0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0],
      [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0],
      [0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0],
      [0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0],
      [0, 0, 1, 1, 0, 1, 0, 0, 0, 1, 0, 0, 1, 1, 0],
      [0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 0, 1, 1, 0, 0],
      [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
    ],
    "Apple": [
      [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
      [0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 0, 0],
      [0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0],
      [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
      [0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
      [0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
      [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
      [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
      [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
      [0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0],
      [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ],
    "Penguin": [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 1, 1, 0, 0, 0],
      [0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0],
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
      [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
      [1, 1, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1],
      [0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ],
  },
};

localStorage.setItem("NONOGRAM_SIZE", 5);
localStorage.setItem("NONOGRAM_NAME", "Goblet");

let MATRIX = [];
let NONOGRAM_SIZE = localStorage.getItem("NONOGRAM_SIZE");
let NONOGRAM_NAME = localStorage.getItem("NONOGRAM_NAME");
let BODY_GAME;
let TIMER = new Timer(MINUTES, SECONDS, 0, 0, 0);
let TIMER_RUN = false;
let SAVE_CURRENT_GAME;
let LOAD_CURRENT_GAME = JSON.parse(localStorage.getItem("SAVE_CURRENT_GAME"));
let LOAD_SCORE_GAME = JSON.parse(localStorage.getItem("SAVE_SCORES_GAME"));
let SAVE_SCORES_GAME = LOAD_SCORE_GAME ? LOAD_SCORE_GAME : [];
let CURRENT_THEME = GET_THEME ? GET_THEME : "light";
let TOUCH_START = -1;
let TOUCH_END = 0;

localStorage.setItem("CURRENT_THEME", CURRENT_THEME);

class Link {
  constructor(name, link, classWhere) {
    this.name = name;
    this.link = link;
    this.classWhere = classWhere;
  }

  create() {
    const li = document.createElement("li");
    li.className = `${this.classWhere}__item ${this.classWhere}__item-${this.name}`;
    const a = document.createElement("a");
    a.className = `${this.classWhere}__link`;
    a.href = this.link;
    a.textContent = this.name;
    li.append(a);
    return li;
  }
}

function formatGameMatrix() {
  return MATRIX.map((cells) => {
    return cells.map((cell) => (cell === 2 ? 0 : cell));
  });
}

function checkWin() {
  const matrix = formatGameMatrix();
  if (matrix.toString() === TEMPLATE[NONOGRAM_SIZE][NONOGRAM_NAME].toString()) {
    saveScore();
    removeBodyListener([pickHandler], true);
    TIMER.stop();
    TIMER_RUN = false;
    disabledButtons([SAVE_BUTTON, SOLUTION_BUTTON]);
    SOUNDS.include("won");
    const time = TIMER.current();
    const timeWin = time[0] * 60 + time[1];

    MODAL_WIN.update(
      "Great!",
      "You have solved the nonogram in",
      `${timeWin} seconds`
    );
    MODAL_WIN.show();

    const gameCellsList = GAME_WRAP.querySelectorAll(".game__cells");
    gameCellsList.forEach((cells) => {
      Array.from(cells.children).forEach((cell) => {
        cell.firstChild.classList.add("game__cell-unuse");
      });
    });
  }
}

function fillCells(need = true) {
  let place = null;
  if (need) {
    place = TEMPLATE[NONOGRAM_SIZE][NONOGRAM_NAME];
  } else {
    place = MATRIX;
  }
  const gameCellsList = GAME_WRAP.querySelectorAll(".game__cells");
  gameCellsList.forEach((cells) => {
    const row = place[cells.dataset.cells];
    Array.from(cells.children).forEach((cell) => {
      const rowCell = row[cell.firstChild.dataset.cell];
      if (need) {
        cell.firstChild.classList.add("game__cell-unuse");
      } else {
        cell.firstChild.classList.remove("game__cell-unuse");
      }
      if (rowCell === 1) {
        cell.firstChild.classList.add("game__cell-fill");
      } else {
        cell.firstChild.classList.remove("game__cell-fill");
      }

      if (rowCell === 2) {
        cell.firstChild.classList.add("game__cell-cross");
      } else {
        cell.firstChild.classList.remove("game__cell-cross");
      }
    });
  });
}

function addMatrixElement(currentCellParent, currentCell, answer) {
  MATRIX[currentCellParent][currentCell] = answer;
  checkWin();
}

function deleteMatrixElement(currentCellParent, currentCell) {
  MATRIX[currentCellParent][currentCell] = 0;
  checkWin();
}

function pickHandler(e) {
  e.preventDefault();
  const button = e.button;
  const target = e.target;
  const currentCell = target.dataset.cell;
  const currentCellParent = target.parentNode.parentNode.dataset.cells;
  let answer = 0;
  const targetTouchStart = e.type === "touchstart";
  const targetTouchEnd = e.type === "touchend";

  if (target.classList.contains("game__cell-inner")) {
    SOUNDS.stop();
    if (targetTouchStart) {
      TOUCH_START = new Date(e.timeStamp).getSeconds();
    }

    if (targetTouchEnd) {
      TOUCH_END = new Date(e.timeStamp).getSeconds();
    }

    let timeTap = TOUCH_END - TOUCH_START;
    startGame();
    activatedButtons(RESET_GAME_BUTTON);
    if (button === 0 || (targetTouchEnd && timeTap < 1)) {
      if (target.classList.contains("game__cell-cross")) {
        target.classList.remove("game__cell-cross");
      }
      if (target.classList.contains("game__cell-fill")) {
        target.classList.toggle("game__cell-fill");
        SOUNDS.start("empty");
        return deleteMatrixElement(currentCellParent, currentCell);
      } else {
        target.classList.toggle("game__cell-fill");
        SOUNDS.start("fill");
        answer = 1;
        return addMatrixElement(currentCellParent, currentCell, answer);
      }
      TOUCH_START = -1;
      TOUCH_END = 0;
    }

    if (button === 2 || (targetTouchEnd && timeTap > 1)) {
      if (target.classList.contains("game__cell-fill")) {
        target.classList.remove("game__cell-fill");
        target.classList.add("game__cell-cross");
        SOUNDS.start("cross");
        answer = 2;
        return addMatrixElement(currentCellParent, currentCell, answer);
      }
      if (target.classList.contains("game__cell-cross")) {
        SOUNDS.start("empty");
        target.classList.remove("game__cell-cross");
        answer = 0;
        return addMatrixElement(currentCellParent, currentCell, answer);
      } else {
        SOUNDS.start("cross");
        target.classList.add("game__cell-cross");
        answer = 2;
        return addMatrixElement(currentCellParent, currentCell, answer);
      }
      TOUCH_START = -1;
      TOUCH_END = 0;
    }
  }
}

function themeHandler(e) {
  e.preventDefault();
  CURRENT_THEME = localStorage.getItem("CURRENT_THEME");

  if (CURRENT_THEME === "light") {
    BODY.classList.add("theme-dark");
    localStorage.setItem("CURRENT_THEME", "dark");
    THEME_ICONS.change("dark");
  }
  if (CURRENT_THEME === "dark") {
    BODY.classList.remove("theme-dark");
    localStorage.setItem("CURRENT_THEME", "light");
    THEME_ICONS.change("light");
  }
}

function startGame() {
  if (!TIMER_RUN) {
    TIMER.start();
    TIMER_RUN = true;
  }
  removeBodyListener([startGame]);
  activatedButtons([SAVE_BUTTON, RESET_GAME_BUTTON, SOLUTION_BUTTON]);
}

function addBodyListener(callbacks) {
  callbacks.forEach((callback) => {
    BODY_GAME.addEventListener("click", callback);
    BODY_GAME.addEventListener("contextmenu", callback);
    BODY_GAME.addEventListener("touchstart", callback);
    BODY_GAME.addEventListener("touchend", callback);
  });
}

function removeBodyListener(callbacks, contextmenu = false) {
  callbacks.forEach((callback) => {
    BODY_GAME.removeEventListener("click", callback);
    BODY_GAME.removeEventListener("contextmenu", callback);
    BODY_GAME.removeEventListener("touchstart", callback);
    BODY_GAME.removeEventListener("touchend", callback);
  });

  if (contextmenu) {
    BODY_GAME.addEventListener("contextmenu", (e) => {
      e.preventDefault();
    });
  }
}

function disabledButtons(buttons) {
  if (Array.isArray(buttons)) {
    buttons.forEach((button) => (button.disabled = true));
  } else {
    buttons.disabled = true;
  }
}

function activatedButtons(buttons) {
  if (Array.isArray(buttons)) {
    buttons.forEach((button) => (button.disabled = false));
  } else {
    buttons.disabled = false;
  }
}

function saveScore() {
  SAVE_SCORES_GAME.push({
    "name": NONOGRAM_NAME,
    "difficulty": DIFFICULTY[NONOGRAM_SIZE],
    "time": TIMER.current(),
  });

  localStorage.setItem("SAVE_SCORES_GAME", JSON.stringify(SAVE_SCORES_GAME));
  SAVE_SCORES_GAME = JSON.parse(localStorage.getItem("SAVE_SCORES_GAME"));
}

function createScoresTable() {
  if (SAVE_SCORES_GAME.length !== 0) {
    SAVE_SCORES_GAME.sort((a, b) => {
      const f = a["time"][0] * 60 + a["time"][1];
      const s = b["time"][0] * 60 + b["time"][1];
      return f - s;
    });

    if (SAVE_SCORES_GAME.length > 5) {
      SAVE_SCORES_GAME.splice(5);
    }

    const table = document.createElement("table");
    table.className = "scores";

    for (let i = 0; i < 1; i++) {
      const tr = document.createElement("tr");
      tr.className = "scores__head";
      let th = document.createElement("th");
      th.className = "scores__name scores__pos";
      th.textContent = "№";
      tr.append(th);
      for (let j = 0; j < Object.keys(SAVE_SCORES_GAME[i]).length; j++) {
        th = document.createElement("th");
        th.className = "scores__name";
        th.textContent = Object.keys(SAVE_SCORES_GAME[i])[j];
        tr.append(th);
      }
      table.append(tr);
    }

    SAVE_SCORES_GAME.forEach((save, i) => {
      const tr = document.createElement("tr");
      tr.className = "scores__row";
      let td = document.createElement("td");
      td.className = "scores__item scores__item-pos";
      td.textContent = i + 1;
      tr.append(td);
      Object.keys(save).forEach((item) => {
        td = document.createElement("td");
        td.className = `scores__item scores__item-${item}`;
        td.textContent = Array.isArray(save[item])
          ? `${save[item][0]}:${
              save[item][1] < 10 ? "0" + save[item][1] : save[item][1]
            }`
          : save[item];
        tr.append(td);
      });
      table.append(tr);
    });
    MODAL_SCORE.update("Scores", table);
  } else {
    MODAL_SCORE.update("Scores", "Scores table is empty.");
  }
}

function saveGame() {
  SAVE_CURRENT_GAME = {
    "currentTimer": TIMER.current(),
    "matrix": MATRIX,
    "nonogramName": NONOGRAM_NAME,
    "nonogramSize": NONOGRAM_SIZE,
    "gameTime": new Date().getTime(),
  };
  activatedButtons(CONTINUE_GAME_BUTTON);

  localStorage.setItem("SAVE_CURRENT_GAME", JSON.stringify(SAVE_CURRENT_GAME));
}

function continueGame(gameSelectContainer) {
  LOAD_CURRENT_GAME = JSON.parse(localStorage.getItem("SAVE_CURRENT_GAME"));
  const check = LOAD_CURRENT_GAME["gameTime"] ? true : false;

  if (check) {
    MATRIX = LOAD_CURRENT_GAME["matrix"];
    TIMER.stop();
    TIMER = new Timer(MINUTES, SECONDS, ...LOAD_CURRENT_GAME["currentTimer"]);
    TIMER.update();
    NONOGRAM_NAME = LOAD_CURRENT_GAME["nonogramName"];
    NONOGRAM_SIZE = LOAD_CURRENT_GAME["nonogramSize"];
    renderGame(NONOGRAM_SIZE, NONOGRAM_NAME, false);

    fillCells(false);

    Array.from(gameSelectContainer.children).forEach((el) => {
      el.remove();
    });
    activatedButtons([RESET_GAME_BUTTON, SAVE_BUTTON]);

    gameSelectContainer.append(
      createSelectDifficulty(gameSelectContainer),
      createSelectLevels(NONOGRAM_SIZE, NONOGRAM_NAME)
    );
  } else {
    return;
  }
}

function randomGame(gameSelectContainer, gameDifficulty) {
  if (TIMER_RUN) {
    TIMER.stop();
    TIMER_RUN = false;
    TIMER.reset();
  }
  MATRIX = [];
  const arrMain = Object.keys(TEMPLATE);
  const randomSize = Math.floor(Math.random() * arrMain.length);
  const arrSecond = Object.keys(TEMPLATE[Number(arrMain[randomSize])]);
  const randomName = Math.floor(Math.random() * arrSecond.length);
  const sessionSize = Number(localStorage.getItem("NONOGRAM_SIZE"));
  const sessionName = localStorage.getItem("NONOGRAM_NAME");
  arrMain[randomSize] = Number(arrMain[randomSize]);
  NONOGRAM_SIZE = arrMain[randomSize];
  NONOGRAM_NAME = arrSecond[randomName];

  const currentLevelSelect = gameDifficulty.children[0].firstChild;
  const levelsSelectOptions =
    gameDifficulty.querySelectorAll(".select__option");

  Array.from(gameSelectContainer.querySelectorAll(".select__option")).forEach(
    (option) => option.classList.remove("select__option-current")
  );

  Array.from(levelsSelectOptions).forEach((el) => {
    if (el.dataset.size === arrMain[randomSize]) {
      el.classList.add("select__option-current");
    }
  });

  if (
    sessionSize === arrMain[randomSize] &&
    sessionName === arrSecond[randomName]
  ) {
    return randomGame(gameSelectContainer, gameDifficulty);
  } else {
    localStorage.setItem("NONOGRAM_SIZE", arrMain[randomSize]);
    localStorage.setItem("NONOGRAM_NAME", arrSecond[randomName]);
    currentLevelSelect.textContent = DIFFICULTY[arrMain[randomSize]];
    renderGame(arrMain[randomSize], arrSecond[randomName]);
    Array.from(gameSelectContainer.children).forEach((el) => {
      if (el.classList.contains("select-levels")) {
        el.remove();
      }
    });

    activatedButtons([SOLUTION_BUTTON]);
    disabledButtons([SAVE_BUTTON]);
    gameSelectContainer.append(createSelectLevels());
  }
}

function resetGame() {
  if (TIMER_RUN) {
    TIMER.stop();
    TIMER_RUN = false;
  }
  TIMER.reset();
  Array.from(GAME_WRAP.querySelectorAll(".game__cell-inner")).forEach(
    (cell) => {
      cell.classList.remove("game__cell-fill");
      cell.classList.remove("game__cell-cross");
      cell.classList.remove("game__cell-unuse");
    }
  );
  addBodyListener([pickHandler, startGame]);
  MATRIX = createMatrix(NONOGRAM_SIZE);
  activatedButtons([SOLUTION_BUTTON]);
  disabledButtons([RESET_GAME_BUTTON]);

  return;
}

function showSolution() {
  if (TIMER_RUN) {
    TIMER.stop();
    TIMER_RUN = false;
  }
  TIMER.reset();
  disabledButtons([SAVE_BUTTON, SOLUTION_BUTTON]);
  activatedButtons(RESET_GAME_BUTTON);
  fillCells();
  removeBodyListener([pickHandler, startGame], false);
}

function createContainer(containerClass = "", need) {
  const container = document.createElement("div");
  container.className = `${
    containerClass.length > 0 ? containerClass + " " : ""
  }${need ? "container" : ""}`;

  return container;
}

function getGamePlace() {
  const pic = TEMPLATE[NONOGRAM_SIZE][NONOGRAM_NAME];
  const rows = [];
  const cols = [];

  for (let i = 0; i < pic.length; i++) {
    let countRows = 0;
    let tempRows = [];
    for (let j = 0; j < pic[i].length; j++) {
      let cur = pic[i][j];
      if (cur === 1) {
        countRows++;
        continue;
      }

      tempRows.push(countRows);
      countRows = 0;
    }
    tempRows.push(countRows);

    rows[i] = tempRows.filter((e) => e > 0);
  }

  for (let i = 0; i < pic[0].length; i++) {
    let countCols = 0;
    let tempCols = [];
    for (let j = 0; j < pic.length; j++) {
      let cur = pic[j][i];
      if (cur === 1) {
        countCols++;
        continue;
      }

      tempCols.push(countCols);
      countCols = 0;
    }
    tempCols.push(countCols);

    cols[i] = tempCols.filter((e) => e > 0);
  }

  return { pic, rows, cols };
}

function createCluesList(clues, cluesClass) {
  const div = document.createElement("div");
  div.className = `game__clues clues__${cluesClass}`;

  clues.forEach((clue, i) => {
    const divSecond = document.createElement("div");
    divSecond.className = `clues__${cluesClass}-item`;
    if ((i + 1) % 5 === 0) {
      divSecond.classList.add(`clues__${cluesClass}-item-border`);
    }
    if (clue.length === 0) {
      const p = document.createElement("p");
      p.className = `clues__${cluesClass}-num`;
      p.innerHTML = "&nbsp;";
      divSecond.append(p);
    }
    clue.forEach((n) => {
      const p = document.createElement("p");
      p.className = `clues__${cluesClass}-num`;
      p.textContent = n;
      divSecond.append(p);
    });
    div.append(divSecond);
  });

  return div;
}

function createMatrix(num) {
  MATRIX = [];
  for (let i = 0; i < Number(num); i++) {
    const temp = [];
    for (let j = 0; j < Number(num); j++) {
      temp[j] = 0;
    }
    MATRIX.push(temp);
  }

  return MATRIX;
}

function createSelectDifficulty(gameSelectContainer) {
  const selectLevels = document.createElement("div");
  selectLevels.className = `select select-difficulty`;
  const selectHeader = document.createElement("div");
  selectHeader.className = "select__header select__header-difficulty";
  const selectCurrent = document.createElement("span");
  selectCurrent.className = "select__current select__current-difficulty";
  selectCurrent.textContent = DIFFICULTY[NONOGRAM_SIZE];
  selectCurrent.dataset.size = NONOGRAM_SIZE;
  const selectBody = document.createElement("div");
  selectBody.className = "select__body select__body-difficulty";

  let size = NONOGRAM_SIZE;

  const selectGroup = document.createElement("ul");
  selectGroup.className = "select__group select__group-difficulty";
  for (let key in TEMPLATE) {
    const selectLi = document.createElement("li");
    selectLi.className = "select__option select__option-difficulty";
    selectLi.textContent = DIFFICULTY[key];
    selectLi.dataset.size = key;
    selectGroup.append(selectLi);
    selectBody.append(selectGroup);
  }

  selectHeader.append(selectCurrent);
  selectLevels.append(selectHeader, selectBody);

  function selectHandler(e) {
    const target = e.target;
    size = target.dataset.size;
    selectBody.classList.toggle("select__body--show");
    selectHeader.classList.toggle("select__header--open");

    if (target.classList.contains("select__option")) {
      selectCurrent.textContent = DIFFICULTY[size];
      selectCurrent.dataset.size = size;
      Array.from(selectBody.querySelectorAll(".select__option")).forEach(
        (option) => option.classList.remove("select__option-current")
      );
      target.classList.add("select__option-current");
      Array.from(gameSelectContainer.children).forEach((el) => {
        if (el.classList.contains("select-levels")) {
          el.remove();
        }
      });
      const firstItem = Object.keys(TEMPLATE[size])[0];

      gameSelectContainer.append(createSelectLevels(size, firstItem));
    }
  }

  selectLevels.addEventListener("click", selectHandler);

  return selectLevels;
}

function createSelectLevels(
  currentNonogramSize = NONOGRAM_SIZE,
  currentNonogramName = NONOGRAM_NAME
) {
  NONOGRAM_SIZE = currentNonogramSize;
  const selectStages = document.createElement("div");
  selectStages.className = `select select-levels`;
  const selectHeader = document.createElement("div");
  selectHeader.className = "select__header select__header-levels";
  const selectCurrent = document.createElement("span");
  selectCurrent.className = "select__current select__current-levels";
  selectCurrent.textContent = currentNonogramName;
  const selectBody = document.createElement("div");
  selectBody.className = "select__body select__body-levels";

  const selectGroup = document.createElement("ul");
  selectGroup.className = "select__group";
  selectGroup.dataset.size = NONOGRAM_SIZE;
  for (let name in TEMPLATE[NONOGRAM_SIZE]) {
    const selectOption = document.createElement("li");
    selectOption.className = "select__option select__option-levels";
    selectOption.textContent = name;
    selectOption.dataset.name = name;
    selectOption.dataset.size = currentNonogramSize;
    selectGroup.append(selectOption);
  }

  selectBody.append(selectGroup);
  selectHeader.append(selectCurrent);
  selectStages.append(selectHeader, selectBody);

  function selectHandler(e) {
    const target = e.target;
    selectHeader.classList.toggle("select__header--open");
    selectBody.classList.toggle("select__body--show");

    if (target.classList.contains("select__option")) {
      NONOGRAM_SIZE = target.dataset.size;
      NONOGRAM_NAME = target.dataset.name;
      selectBody.classList.remove("select__body--show");
      selectCurrent.textContent = NONOGRAM_NAME;
      Array.from(selectBody.querySelectorAll(".select__option")).forEach(
        (option) => option.classList.remove("select__option-current")
      );
      target.classList.add("select__option-current");
      MATRIX = createMatrix(NONOGRAM_SIZE);
      if (TIMER_RUN) {
        TIMER.stop();
        TIMER_RUN = false;
      }
      TIMER.reset();
      disabledButtons(SAVE_BUTTON);
      activatedButtons(SOLUTION_BUTTON);
      renderGame(NONOGRAM_SIZE, NONOGRAM_NAME);
    }
  }

  selectStages.addEventListener("click", selectHandler);

  return selectStages;
}

function getTimer() {
  const MINUTES = document.createElement("span");
  MINUTES.className = "timer__minutes";
  MINUTES.textContent = "00:";
  const SECONDS = document.createElement("span");
  SECONDS.className = "timer__seconds";
  SECONDS.textContent = "00";

  return { MINUTES, SECONDS };
}

function createPlace() {
  const place = document.createElement("div");
  place.className = "game__place";

  const top = document.createElement("div");
  top.className = "game__top clues";
  const left = document.createElement("div");
  left.className = "game__left clues";
  BODY_GAME = document.createElement("div");
  BODY_GAME.className = "game__body";

  const { pic, rows, cols } = getGamePlace();
  const topClues = createCluesList(cols, "top");
  const leftClues = createCluesList(rows, "left");

  pic.forEach((p, i) => {
    const div = document.createElement("div");
    div.className = "game__cells";
    div.dataset.cells = i;
    if ((i + 1) % 5 === 0) {
      div.classList.add("game__cells-border");
    }
    p.forEach((_, j) => {
      const cell = document.createElement("div");
      const cellInner = document.createElement("div");
      cell.className = "game__cell";
      cellInner.className = "game__cell-inner";
      cellInner.dataset.cell = j;
      if ((j + 1) % 5 === 0) {
        cell.classList.add("game__cell-border");
      }
      cell.append(cellInner);
      div.append(cell);
    });
    BODY_GAME.append(div);
  });

  addBodyListener([pickHandler, startGame]);

  top.append(topClues);
  left.append(leftClues);
  place.append(top, left, BODY_GAME);
  return place;
}

function createGameSpace(nonogramSize, nonogramName, newMatrix = true) {
  const game = document.createElement("div");
  game.className = "game__content";
  const title = document.createElement("h2");
  title.className = "game__title";
  title.textContent = nonogramName;
  let gamePlace = createPlace(nonogramSize, nonogramName);
  if (newMatrix) {
    MATRIX = createMatrix(nonogramSize);
  }

  game.append(title, gamePlace);

  return game;
}

function createLogo(size) {
  const logo = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  logo.setAttribute("class", "logo");
  logo.setAttributeNS(null, "viewBox", `0 0 ${size} ${size}`);
  logo.setAttributeNS(null, "width", 50);
  logo.setAttributeNS(null, "height", 50);
  const rectMain = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "rect"
  );

  rectMain.setAttributeNS(null, "width", size);
  rectMain.setAttributeNS(null, "height", size);
  rectMain.setAttributeNS(null, "stroke", "#ffffff");
  rectMain.setAttributeNS(null, "stroke-width", "6px");
  rectMain.setAttributeNS(null, "fill", "transparent");

  const rectFirst = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "rect"
  );

  rectFirst.setAttributeNS(null, "width", size / 2);
  rectFirst.setAttributeNS(null, "height", size / 2);
  rectFirst.setAttributeNS(null, "x", 0);
  rectFirst.setAttributeNS(null, "y", 0);
  rectFirst.setAttributeNS(null, "stroke", "#ffffff");
  rectFirst.setAttributeNS(null, "stroke-width", "3px");
  rectFirst.setAttributeNS(null, "fill", "#ffffff");

  const rectSecond = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "rect"
  );

  rectSecond.setAttributeNS(null, "width", size / 2);
  rectSecond.setAttributeNS(null, "height", size / 2);
  rectSecond.setAttributeNS(null, "x", size / 2);
  rectSecond.setAttributeNS(null, "y", 0);
  rectSecond.setAttributeNS(null, "stroke", "#ffffff");
  rectSecond.setAttributeNS(null, "stroke-width", "3px");
  rectSecond.setAttributeNS(null, "fill", "transparent");

  const rectThird = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "rect"
  );

  rectThird.setAttributeNS(null, "width", size / 2);
  rectThird.setAttributeNS(null, "height", size / 2);
  rectThird.setAttributeNS(null, "x", 0);
  rectThird.setAttributeNS(null, "y", size / 2);
  rectThird.setAttributeNS(null, "stroke", "#ffffff");
  rectThird.setAttributeNS(null, "stroke-width", "3px");
  rectThird.setAttributeNS(null, "fill", "transparent");

  const rectFourth = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "rect"
  );

  rectFourth.setAttributeNS(null, "width", size / 2);
  rectFourth.setAttributeNS(null, "height", size / 2);
  rectFourth.setAttributeNS(null, "x", size / 2);
  rectFourth.setAttributeNS(null, "y", size / 2);
  rectFourth.setAttributeNS(null, "stroke", "#ffffff");
  rectFourth.setAttributeNS(null, "stroke-width", "3px");
  rectFourth.setAttributeNS(null, "fill", "#ffffff");

  logo.append(rectMain, rectFirst, rectSecond, rectThird, rectFourth);
  return logo;
}

function createHeaderContent() {
  const container = createContainer("header__container", true);
  const header = document.createElement("header");
  header.className = "header";

  const content = document.createElement("div");
  content.className = "header__content";

  const logo = document.createElement("div");
  logo.className = "header__logo";
  logo.append(createLogo(50));

  const menu = document.createElement("ul");
  menu.className = "header__menu menu";

  const scoreLink = new Link("scores", "#", "menu").create();

  if (CURRENT_THEME === "light") {
    BODY.classList.remove("theme-dark");
  } else {
    BODY.classList.add("theme-dark");
  }

  scoreLink.addEventListener("click", (e) => {
    e.preventDefault();
    createScoresTable();
    MODAL_SCORE.show();
  });

  const theme = THEME_ICONS.init();
  THEME_ICONS.change(CURRENT_THEME);
  theme.addEventListener("click", themeHandler);

  const sound = SOUNDS.init(SOUNDS_STATE);

  menu.append(scoreLink, sound, theme);

  content.append(logo, menu);
  container.append(content);
  header.append(container);

  return header;
}

function createMainContent() {
  const main = document.createElement("main");
  main.className = "main";

  const gameSelectContainer = createContainer("game__select", false);

  GAME_WRAP.className = "game__wrap";

  const gameTimer = document.createElement("div");
  gameTimer.className = "game__timer";
  const gameTimerBlock = document.createElement("p");
  gameTimerBlock.className = "timer";

  const gameContent = createGameSpace(NONOGRAM_SIZE, NONOGRAM_NAME);
  const gameButtonsContainer = createContainer("game__buttons", false);
  const gameButtonsSaveLoad = createContainer("game__buttons-save", false);
  const gameButtonsAdditional = createContainer(
    "game__buttons-additional",
    false
  );
  const gameDifficulty = createSelectDifficulty(gameSelectContainer);
  const gameLevels = createSelectLevels();

  disabledButtons([SAVE_BUTTON, RESET_GAME_BUTTON]);

  if (!LOAD_CURRENT_GAME) {
    disabledButtons(CONTINUE_GAME_BUTTON);
  }

  SAVE_BUTTON.addEventListener("click", (e) => {
    e.preventDefault();
    saveGame(gameSelectContainer);
  });

  CONTINUE_GAME_BUTTON.addEventListener("click", (e) => {
    e.preventDefault();
    continueGame(gameSelectContainer);
  });

  RANDOM_GAME_BUTTON.addEventListener("click", (e) => {
    e.preventDefault();
    randomGame(gameSelectContainer, gameDifficulty, gameLevels);
  });

  SOLUTION_BUTTON.addEventListener("click", (e) => {
    e.preventDefault();
    showSolution();
  });

  RESET_GAME_BUTTON.addEventListener("click", (e) => {
    e.preventDefault();
    resetGame();
  });

  gameSelectContainer.append(gameDifficulty, gameLevels);
  gameTimerBlock.append(MINUTES, SECONDS);
  gameTimer.append(gameTimerBlock);
  GAME_WRAP.append(gameContent);
  gameButtonsSaveLoad.append(SAVE_BUTTON, CONTINUE_GAME_BUTTON);
  gameButtonsAdditional.append(
    RANDOM_GAME_BUTTON,
    SOLUTION_BUTTON,
    RESET_GAME_BUTTON
  );

  gameButtonsContainer.append(gameButtonsSaveLoad, gameButtonsAdditional);

  GAME_CONTAINER.append(
    gameSelectContainer,
    gameButtonsContainer,
    gameTimer,
    GAME_WRAP
  );
  main.append(GAME_CONTAINER);

  return main;
}

function renderGame(nonogramSize, nonogramName, newMatrix) {
  const game = createGameSpace(nonogramSize, nonogramName, newMatrix);
  Array.from(GAME_WRAP.children).forEach((el) => {
    el.remove();
  });
  GAME_WRAP.append(game);
}

function createFooterContent() {
  const container = createContainer("footer__container", true);
  const footer = document.createElement("footer");
  footer.className = "footer";

  const content = document.createElement("div");
  content.className = "footer__content";

  const p = document.createElement("p");
  p.className = "footer__text";
  p.textContent = "Nonogram Games 2024";

  content.append(p);
  container.append(content);
  footer.append(container);

  return footer;
}

function init() {
  BODY.addEventListener("click", function ({ target }) {
    const headerLevels = BODY.querySelector(".select__header-difficulty");
    const headerStages = BODY.querySelector(".select__header-levels");
    const bodyLevels = BODY.querySelector(".select__body-difficulty");
    const bodyStages = BODY.querySelector(".select__body-levels");

    if (
      !target.classList.contains("select__header-difficulty") &&
      !target.classList.contains("select__current-difficulty")
    ) {
      bodyLevels.classList.remove("select__body--show");
      headerLevels.classList.remove("select__header--open");
    }

    if (
      !target.classList.contains("select__header-levels") &&
      !target.classList.contains("select__current-levels")
    ) {
      bodyStages.classList.remove("select__body--show");
      headerStages.classList.remove("select__header--open");
    }
  });
  BODY.prepend(createFooterContent());
  BODY.prepend(createMainContent(), MODAL_WIN.init(), MODAL_SCORE.init());
  BODY.prepend(createHeaderContent());
}

init();
