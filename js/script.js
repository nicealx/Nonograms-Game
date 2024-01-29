import Timer from "./timer.js";
import Button from "./button.js";
import Modal from "./modal.js";

const DOC = document.querySelector(".body");
const GAME_CONTAINER = createContainer("game", true);
const GAME_WRAP = document.createElement("div");
const { MINUTES, SECONDS } = getTimer();
const SAVE_BUTTON = new Button("Save game", "game").create();
const RANDOM_GAME_BUTTON = new Button("Random game", "game").create();
const SOLUTION_BUTTON = new Button("Solution", "game").create();
const CONTINUE_GAME_BUTTON = new Button("Continue last game", "game").create();
const RESET_GAME_BUTTON = new Button("Reset game", "game").create();
const MODAL = new Modal("modal");
const SOUND_CROSS = new Audio("./audio/cross.mp3");
const SOUND_EMPTY = new Audio("./audio/empty.mp3");
const SOUND_FILL = new Audio("./audio/fill.mp3");
const SOUND_WON = new Audio("./audio/won.mp3");
const DIFFICULTY = { 5: "easy", 10: "medium", 15: "hard" };
const TEMPLATE = {
  5: {
    "cup": [
      [0, 1, 1, 1, 0],
      [0, 1, 1, 1, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 1, 1, 1, 0],
    ],
    "flight": [
      [1, 1, 1, 1, 1],
      [0, 0, 1, 0, 0],
      [1, 1, 1, 1, 1],
      [0, 1, 1, 1, 0],
      [0, 0, 1, 0, 0],
    ],
    "mask": [
      [1, 1, 1, 1, 1],
      [1, 0, 1, 0, 1],
      [1, 1, 1, 1, 1],
      [0, 1, 1, 1, 0],
      [0, 0, 1, 0, 0],
    ],
    "note": [
      [0, 1, 1, 1, 1],
      [0, 1, 0, 0, 1],
      [0, 1, 0, 0, 1],
      [1, 1, 0, 1, 1],
      [1, 1, 0, 1, 1],
    ],
    "smile": [
      [1, 1, 0, 1, 1],
      [1, 1, 0, 1, 1],
      [0, 0, 0, 0, 0],
      [1, 0, 0, 0, 1],
      [0, 1, 1, 1, 0],
    ],
  },
  10: {
    "first": new Array(10).fill(new Array(10).fill(1)),
    "second": new Array(10).fill(new Array(10).fill(1)),
    "third": new Array(10).fill(new Array(10).fill(1)),
    "fourth": new Array(10).fill(new Array(10).fill(1)),
    "five": new Array(10).fill(new Array(10).fill(1)),
  },
  15: {
    "first": new Array(15).fill(new Array(15).fill(1)),
    "second": new Array(15).fill(new Array(15).fill(1)),
    "third": new Array(15).fill(new Array(15).fill(1)),
    "fourth": new Array(15).fill(new Array(15).fill(1)),
    "five": new Array(15).fill(new Array(15).fill(1)),
  },
};

let MATRIX = [];
let NONOGRAM_SIZE = 5;
let NONOGRAM_NAME = "cup";
let BODY_GAME;
let TIMER = new Timer(MINUTES, SECONDS, 0, 0, 0);
let TIMER_RUN = false;
let SAVE_CURRENT_GAME;
let LOAD_CURRENT_GAME = JSON.parse(localStorage.getItem("SAVE_CURRENT_GAME"));

localStorage.setItem("NONOGRAM_SIZE", 0);
localStorage.setItem("NONOGRAM_NAME", "cup");

class Link {
  constructor(name, link, classWhere) {
    this.name = name;
    this.link = link;
    this.classWhere = classWhere;
  }

  create() {
    const li = document.createElement("li");
    li.className = `${this.classWhere}__item`;
    const a = document.createElement("a");
    a.className = `${this.classWhere}__link`;
    a.href = this.link;
    a.textContent = this.name;
    li.append(a);
    return li;
  }
}

function checkWin(matrix, currentPlace) {
  if (matrix.toString() === currentPlace.toString()) {
    console.log("Win");
    removeBodyListener([pickHandler], true);
    TIMER.stop();
    TIMER_RUN = false;
    disabledButtons([SAVE_BUTTON, SOLUTION_BUTTON]);
    SOUND_WON.play();
    const time = TIMER.current();
    const timeWin = time[0] * 60 + time[1];

    MODAL.update(
      "Great!",
      "You have solved the nonogram in",
      `${timeWin} seconds`
    );
    MODAL.show();

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
    });
  });
}

function addMatrixElement(currentCellParent, currentCell, answer) {
  MATRIX[currentCellParent][currentCell] = answer;
  checkWin(MATRIX, TEMPLATE[NONOGRAM_SIZE][NONOGRAM_NAME]);
}

function deleteMatrixElement(currentCellParent, currentCell) {
  MATRIX[currentCellParent][currentCell] = 0;
  checkWin(MATRIX, TEMPLATE[NONOGRAM_SIZE][NONOGRAM_NAME]);
}

function pickHandler(e) {
  e.preventDefault();
  const button = e.button;
  const target = e.target;
  const currentCell = target.dataset.cell;
  const currentCellParent = target.parentNode.parentNode.dataset.cells;
  let answer = 0;
  if (target.classList.contains("game__cell-inner")) {
    startGame();
    activatedButtons(RESET_GAME_BUTTON);
    if (button === 0) {
      if (target.classList.contains("game__cell-cross")) {
        target.classList.remove("game__cell-cross");
      }
      if (target.classList.contains("game__cell-fill")) {
        target.classList.toggle("game__cell-fill");
        SOUND_EMPTY.play();
        deleteMatrixElement(currentCellParent, currentCell);
      } else {
        target.classList.toggle("game__cell-fill");
        SOUND_FILL.play();
        answer = 1;
        addMatrixElement(currentCellParent, currentCell, answer);
      }
    }

    if (button === 2) {
      if (target.classList.contains("game__cell-fill") &&
      !target.classList.contains("game__cell-cross")) {
        target.classList.remove("game__cell-fill");
        answer = 0;
        target.classList.add("game__cell-cross");
        deleteMatrixElement(currentCellParent, currentCell);
      }
      if (
        !target.classList.contains("game__cell-fill") &&
        target.classList.contains("game__cell-cross")
      ) {
        SOUND_EMPTY.play();
        target.classList.remove("game__cell-cross");
      }

      if (
        !target.classList.contains("game__cell-fill") &&
        !target.classList.contains("game__cell-cross")
      ) {
        SOUND_CROSS.play();
        target.classList.add("game__cell-cross");
      }
    }
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
  });
}

function removeBodyListener(callbacks, contextmenu = false) {
  callbacks.forEach((callback) => {
    BODY_GAME.removeEventListener("click", callback);
    BODY_GAME.removeEventListener("contextmenu", callback);
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

function saveGame() {
  SAVE_CURRENT_GAME = {
    "currentTimer": TIMER.current(),
    "matrix": MATRIX,
    "nonogramName": NONOGRAM_NAME,
    "nonogramSize": NONOGRAM_SIZE,
    "gameTime": new Date(),
  };
  activatedButtons(CONTINUE_GAME_BUTTON);

  localStorage.setItem("SAVE_CURRENT_GAME", JSON.stringify(SAVE_CURRENT_GAME));
}

function continueGame(gameSelectContainer) {
  LOAD_CURRENT_GAME = JSON.parse(localStorage.getItem("SAVE_CURRENT_GAME"));
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
    createSelectLevels(gameSelectContainer),
    createSelectStages(NONOGRAM_SIZE, NONOGRAM_NAME)
  );
}

function randomGame(gameSelectContainer, gameLevels) {
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

  const currentLevelSelect = gameLevels.children[0].firstChild;
  const levelsSelectOptions = gameLevels.querySelectorAll(".select__option");

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
    return randomGame(gameSelectContainer, gameLevels);
  } else {
    localStorage.setItem("NONOGRAM_SIZE", arrMain[randomSize]);
    localStorage.setItem("NONOGRAM_NAME", arrSecond[randomName]);
    currentLevelSelect.textContent = DIFFICULTY[arrMain[randomSize]];
    renderGame(arrMain[randomSize], arrSecond[randomName]);
    Array.from(gameSelectContainer.children).forEach((el) => {
      if (el.classList.contains("select-stages")) {
        el.remove();
      }
    });

    disabledButtons([RESET_GAME_BUTTON, SAVE_BUTTON]);
    gameSelectContainer.append(createSelectStages());
  }
}

function resetGame() {
  Array.from(GAME_WRAP.querySelectorAll(".game__cell-inner")).forEach(
    (cell) => {
      cell.classList.remove("game__cell-fill");
      cell.classList.remove("game__cell-cross");
      cell.classList.remove("game__cell-unuse");
    }
  );
  addBodyListener([pickHandler, startGame]);
  MATRIX = createMatrix(NONOGRAM_SIZE);
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

function createSelectLevels(gameSelectContainer) {
  const selectLevels = document.createElement("div");
  selectLevels.className = `select select-levels`;
  const selectHeader = document.createElement("div");
  selectHeader.className = "select__header select__header-levels";
  const selectCurrent = document.createElement("span");
  selectCurrent.className = "select__current select__current-levels";
  selectCurrent.textContent = DIFFICULTY[NONOGRAM_SIZE];
  selectCurrent.dataset.size = NONOGRAM_SIZE;
  const selectBody = document.createElement("div");
  selectBody.className = "select__body select__body-levels";

  let size = NONOGRAM_SIZE;

  const selectGroup = document.createElement("ul");
  selectGroup.className = "select__group select__group-levels";
  for (let key in TEMPLATE) {
    const selectLi = document.createElement("li");
    selectLi.className = "select__option select__option-levels";
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

    if (target.classList.contains("select__option")) {
      selectCurrent.textContent = DIFFICULTY[size];
      selectCurrent.dataset.size = size;
      Array.from(selectBody.querySelectorAll(".select__option")).forEach(
        (option) => option.classList.remove("select__option-current")
      );
      target.classList.add("select__option-current");
      Array.from(gameSelectContainer.children).forEach((el) => {
        if (el.classList.contains("select-stages")) {
          el.remove();
        }
      });
      const firstItem = Object.keys(TEMPLATE[size])[0];

      gameSelectContainer.append(createSelectStages(size, firstItem));
    }
  }

  selectLevels.addEventListener("click", selectHandler);

  return selectLevels;
}

function createSelectStages(
  currentNonogramSize = NONOGRAM_SIZE,
  currentNonogramName = NONOGRAM_NAME
) {
  NONOGRAM_SIZE = currentNonogramSize;
  const selectStages = document.createElement("div");
  selectStages.className = `select select-stages`;
  const selectHeader = document.createElement("div");
  selectHeader.className = "select__header select__header-stages";
  const selectCurrent = document.createElement("span");
  selectCurrent.className = "select__current select__current-stages";
  selectCurrent.textContent = currentNonogramName;
  const selectBody = document.createElement("div");
  selectBody.className = "select__body select__body-stages";

  const selectGroup = document.createElement("ul");
  selectGroup.className = "select__group";
  selectGroup.dataset.size = NONOGRAM_SIZE;
  for (let name in TEMPLATE[NONOGRAM_SIZE]) {
    const selectOption = document.createElement("li");
    selectOption.className = "select__option select__option-stages";
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
      activatedButtons(SOLUTION_BUTTON);
      renderGame(NONOGRAM_SIZE, NONOGRAM_NAME);
    }
  }

  selectStages.addEventListener("click", selectHandler);

  GAME_CONTAINER.addEventListener("click", function (e) {
    const target = e.target;
    const bodyLevels = GAME_CONTAINER.querySelector(".select__body-levels");
    const bodyStages = GAME_CONTAINER.querySelector(".select__body-stages");

    if (
      !target.classList.contains("select__header-levels") &&
      !target.classList.contains("select__current-levels")
    ) {
      bodyLevels.classList.remove("select__body--show");
    }

    if (
      !target.classList.contains("select__header-stages") &&
      !target.classList.contains("select__current-stages")
    ) {
      bodyStages.classList.remove("select__body--show");
    }
  });

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

function createHeaderContent() {
  const container = createContainer("header__container", true);
  const header = document.createElement("header");
  header.className = "header";

  const content = document.createElement("div");
  content.className = "header__content";

  const logo = document.createElement("img");
  logo.className = "header__logo";
  logo.src = "";

  const menu = document.createElement("ul");
  menu.className = "header__menu menu";

  const scoreLink = new Link("Score", "#", "menu").create();
  const theme = new Link("Theme", "#", "menu").create();

  menu.append(scoreLink, theme);

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
  const gameLevels = createSelectLevels(gameSelectContainer);
  const gameStages = createSelectStages();

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
    randomGame(gameSelectContainer, gameLevels, gameStages);
  });

  SOLUTION_BUTTON.addEventListener("click", (e) => {
    e.preventDefault();
    showSolution();
  });

  RESET_GAME_BUTTON.addEventListener("click", (e) => {
    e.preventDefault();
    resetGame();
  });

  gameTimerBlock.append(MINUTES, SECONDS);
  gameTimer.append(gameTimerBlock);
  GAME_WRAP.append(gameContent);
  gameSelectContainer.append(gameLevels, gameStages);
  gameButtonsContainer.append(
    SAVE_BUTTON,
    CONTINUE_GAME_BUTTON,
    RANDOM_GAME_BUTTON,
    SOLUTION_BUTTON,
    RESET_GAME_BUTTON
  );

  GAME_CONTAINER.append(
    gameSelectContainer,
    gameTimer,
    GAME_WRAP,
    gameButtonsContainer
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
  p.textContent = "Nonograms Game 2024";

  content.append(p);
  container.append(content);
  footer.append(container);

  return footer;
}

DOC.prepend(createFooterContent());
DOC.prepend(createMainContent(), MODAL.init());
DOC.prepend(createHeaderContent());
