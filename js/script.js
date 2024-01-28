const DOC = document.querySelector("body");
let MATRIX = [];
let NONOGRAM_SIZE = 5;
let NONOGRAM_NAME = "cup";
let BODY = null;
let GAME_CONTAINER = null;

let TIMER = null;
let TIMER_RUN = false;

let SAVE_BUTTON = null;
let RANDOM_GAME_BUTTON = null;
let CONTINUE_GAME_BUTTON = null;
let RESET_GAME_BUTTON = null;
let SOLUTION_BUTTON = null;

sessionStorage.setItem("NONOGRAM_SIZE", 0);
sessionStorage.setItem("NONOGRAM_NAME", "cup");

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

class Button {
  constructor(name, classWhere) {
    this.name = name;
    this.classWhere = classWhere;
  }

  create() {
    const btn = document.createElement("button");
    btn.className = `${this.classWhere}__button`;
    btn.textContent = this.name;
    return btn;
  }
}

class Timer {
  constructor(hoursElem, minutesElem, secondsElem, hours, minutes, seconds) {
    this.hoursElem = hoursElem;
    this.minutesElem = minutesElem;
    this.secondsElem = secondsElem;
    this.hours = hours;
    this.minutes = minutes;
    this.seconds = seconds;
  }

  reset() {
    this.hours = 0;
    this.minutes = 0;
    this.seconds = 0;
    this.hoursElem.textContent = `0${this.hours}:`;
    this.minutesElem.textContent = `0${this.minutes}:`;
    this.secondsElem.textContent = `0${this.seconds}`;
  }

  start() {
    if (this.hours < 9) {
      this.hoursElem.textContent = `0${this.hours}:`;
    } else {
      this.hoursElem.textContent = `${this.hours}:`;
    }
    if (this.minutes < 9) {
      this.minutesElem.textContent = `0${this.minutes}:`;
    } else {
      this.minutesElem.textContent = `${this.minutes}:`;
    }
    if (this.seconds < 9) {
      this.secondsElem.textContent = `0${this.seconds}`;
    } else {
      this.secondsElem.textContent = this.seconds;
    }

    this.timer = setInterval(() => {
      this.update();
    }, 1000);
    console.log("Timer started");
  }

  update() {
    this.seconds++;
    if (this.seconds < 9) {
      this.secondsElem.textContent = `0${this.seconds}`;
    }

    if (this.seconds > 9) {
      this.secondsElem.textContent = this.seconds;
    }

    if (this.seconds >= 59) {
      this.minutes++;
      this.seconds = 0;
      this.secondsElem.textContent = `0${this.seconds}`;
    }

    if (this.minutes < 9) {
      this.minutesElem.textContent = `0${this.minutes}:`;
    }
    if (this.minutes > 9) {
      this.minutesElem.textContent = `${this.minutes}:`;
    }

    if (this.minutes >= 59) {
      this.hours++;
      this.minutes = 0;
      this.hoursElem.textContent = `${this.hours}:`;
    }

    if (this.hours < 9) {
      this.hoursElem.textContent = `0${this.hours}:`;
    }
    if (this.hours > 9) {
      this.hoursElem.textContent = `${this.hours}:`;
    }

    if (this.hours >= 99) {
      this.stop();
    }
  }

  stop() {
    console.log("Timer stoped");
    clearInterval(this.timer);
  }
}

function checkWin(matrix, currentPlace) {
  if (matrix.toString() === currentPlace.toString()) {
    console.log("Win");
    removeBodyListener(pickHandler, true);
    TIMER.stop();
    disabledButtons([SAVE_BUTTON, SOLUTION_BUTTON]);
  }
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
  const currentCellParent = target.parentNode.dataset.cells;
  let answer = 0;
  if (target.classList.contains("game__cell")) {
    activatedButtons(RESET_GAME_BUTTON);
    if (button === 0) {
      if (target.classList.contains("game__cell-cross")) {
        target.classList.remove("game__cell-cross");
      }
      if (target.classList.contains("game__cell-fill")) {
        answer = 0;
        deleteMatrixElement(currentCellParent, currentCell);
      } else {
        answer = 1;
        addMatrixElement(currentCellParent, currentCell, answer);
      }
      target.classList.toggle("game__cell-fill");
    }

    if (button === 2) {
      if (target.classList.contains("game__cell-fill")) {
        target.classList.remove("game__cell-fill");
        answer = 0;
        deleteMatrixElement(currentCellParent, currentCell);
      }
      target.classList.toggle("game__cell-cross");
    }
  }
}

function startGame() {
  if (!TIMER_RUN) {
    TIMER.start();
    TIMER_RUN = true;
  }
  removeBodyListener(startGame);
  activatedButtons([SAVE_BUTTON, RESET_GAME_BUTTON, SOLUTION_BUTTON]);
}

function addBodyListener() {
  BODY.addEventListener("click", pickHandler);
  BODY.addEventListener("contextmenu", pickHandler);
  BODY.addEventListener("click", startGame);
  BODY.addEventListener("contextmenu", startGame);
}

function removeBodyListener(callback, contextmenu) {
  BODY.removeEventListener("click", callback);
  BODY.removeEventListener("contextmenu", callback);

  if (contextmenu) {
    BODY.addEventListener("contextmenu", (e) => {
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

function saveGame(gameWrap, gameSelectContainer) {
  console.log(gameWrap, gameSelectContainer);
}

function randomGame(gameWrap, gameSelectContainer) {
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
  const sessionSize = Number(sessionStorage.getItem("NONOGRAM_SIZE"));
  const sessionName = sessionStorage.getItem("NONOGRAM_NAME");
  arrMain[randomSize] = Number(arrMain[randomSize]);
  NONOGRAM_SIZE = arrMain[randomSize];
  NONOGRAM_NAME = arrSecond[randomName];
  const levelsSelect = gameSelectContainer.querySelector(".select-levels");
  const currentLevelSelect = levelsSelect.querySelector(".select__current");
  const levelsSelectOptions = levelsSelect.querySelectorAll(".select__option");

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
    randomGame();
  } else {
    sessionStorage.setItem("NONOGRAM_SIZE", arrMain[randomSize]);
    sessionStorage.setItem("NONOGRAM_NAME", arrSecond[randomName]);
    currentLevelSelect.textContent = `${arrMain[randomSize]}*${arrMain[randomSize]}`;
    renderGame(arrMain[randomSize], arrSecond[randomName], gameWrap);
    Array.from(gameSelectContainer.children).forEach((el) => {
      if (el.classList.contains("select-stages")) {
        el.remove();
      }
    });
    // activatedButtons[RANDOM_GAME_BUTTON]
    disabledButtons([RESET_GAME_BUTTON, SAVE_BUTTON]);
    gameSelectContainer.append(createSelectStages(gameWrap));
  }
}

function resetGame(gameContent) {
  Array.from(gameContent.querySelectorAll(".game__cell")).forEach((cell) => {
    cell.classList.remove("game__cell-fill");
    cell.classList.remove("game__cell-cross");
    cell.classList.remove("game__cell-unuse");
  });
  addBodyListener();
  MATRIX = createMatrix(NONOGRAM_SIZE);
  return;
}

function showSolution(gameWrap) {
  if (TIMER_RUN) {
    TIMER.stop();
    TIMER_RUN = false;
  }
  TIMER.reset();
  disabledButtons([SAVE_BUTTON, SOLUTION_BUTTON]);
  const solution = TEMPLATE[NONOGRAM_SIZE][NONOGRAM_NAME];
  const gameCellsList = gameWrap.querySelectorAll(".game__cells");
  gameCellsList.forEach((cells) => {
    const row = solution[cells.dataset.cells];
    Array.from(cells.children).forEach((cell) => {
      const rowCell = row[cell.dataset.cell];
      cell.classList.add("game__cell-unuse");
      if (rowCell === 1) {
        cell.classList.add("game__cell-fill");
      } else {
        cell.classList.remove("game__cell-fill");
      }
    });
  });
  removeBodyListener(pickHandler, true);
}

function createContainer(containerClass = "", need) {
  const container = document.createElement("div");
  container.className = `${
    containerClass.length > 0 ? containerClass + " " : ""
  }${need ? "container" : ""}`;

  return container;
}

function getGamePlace(nonogramSize, nonogramName) {
  const pic = TEMPLATE[nonogramSize][nonogramName];
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
  const ul = document.createElement("ul");
  ul.className = `game__clues clues__${cluesClass}`;

  clues.forEach((clue) => {
    const li = document.createElement("li");
    li.className = `clues__${cluesClass}-item`;
    if (clue.length === 0) {
      const p = document.createElement("p");
      p.className = `clues__${cluesClass}-num`;
      p.innerHTML = "&nbsp;";
      li.append(p);
    }
    clue.forEach((n) => {
      const p = document.createElement("p");
      p.className = `clues__${cluesClass}-num`;
      p.textContent = n;
      li.append(p);
    });
    ul.append(li);
  });

  return ul;
}

function createMatrix(num) {
  MATRIX = [];
  for (let i = 0; i < num; i++) {
    const temp = [];
    for (let j = 0; j < num; j++) {
      temp[j] = 0;
    }
    MATRIX.push(temp);
  }

  return MATRIX;
}

function createSelectLevels(gameWrap, gameSelectContainer) {
  const selectLevels = document.createElement("div");
  selectLevels.className = `select select-levels`;
  const selectHeader = document.createElement("div");
  selectHeader.className = "select__header select__header-levels";
  const selectCurrent = document.createElement("span");
  selectCurrent.className = "select__current select__current-levels";
  selectCurrent.textContent = `${NONOGRAM_SIZE}*${NONOGRAM_SIZE}`;
  selectCurrent.dataset.size = NONOGRAM_SIZE;
  const selectBody = document.createElement("div");
  selectBody.className = "select__body select__body-levels";

  let size = NONOGRAM_SIZE;

  const selectGroup = document.createElement("ul");
  selectGroup.className = "select__group select__group-levels";
  for (let key in TEMPLATE) {
    const selectLi = document.createElement("li");
    selectLi.className = "select__option select__option-levels";
    selectLi.textContent = `${key}*${key}`;
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
      selectCurrent.textContent = `${size}*${size}`;
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

      gameSelectContainer.append(createSelectStages(gameWrap, size, firstItem));
    }
  }

  selectLevels.addEventListener("click", selectHandler);

  return selectLevels;
}

function createSelectStages(
  gameWrap,
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
      activatedButtons([SAVE_BUTTON, SOLUTION_BUTTON]);
      renderGame(NONOGRAM_SIZE, NONOGRAM_NAME, gameWrap);
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
  const hours = document.createElement("span");
  hours.className = "timer__hours";
  hours.textContent = "00:";
  const minutes = document.createElement("span");
  minutes.className = "timer__minutes";
  minutes.textContent = "00:";
  const seconds = document.createElement("span");
  seconds.className = "timer__seconds";
  seconds.textContent = "00";

  return { hours, minutes, seconds };
}

function createPlace(nonogramSize, nonogramName) {
  const place = document.createElement("div");
  place.className = "game__place";

  const top = document.createElement("div");
  top.className = "game__top clues";
  const left = document.createElement("div");
  left.className = "game__left clues";
  BODY = document.createElement("div");
  BODY.className = "game__body";

  const { pic, rows, cols } = getGamePlace(nonogramSize, nonogramName);
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
      cell.className = "game__cell";
      cell.dataset.cell = j;
      if ((j + 1) % 5 === 0) {
        cell.classList.add("game__cell-border");
      }

      div.append(cell);
    });
    BODY.append(div);
  });

  addBodyListener();

  top.append(topClues);
  left.append(leftClues);
  place.append(top, left, BODY);
  return place;
}

function createGameSpace(nonogramSize, nonogramName) {
  const game = document.createElement("div");
  game.className = "game__content";
  const title = document.createElement("h2");
  title.className = "game__title";
  title.textContent = nonogramName;
  let gamePlace = createPlace(nonogramSize, nonogramName);
  MATRIX = createMatrix(nonogramSize);

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

  const newGame = new Link("New game", "#", "menu").create();
  const scoreLink = new Link("Score", "#", "menu").create();
  const theme = new Link("Theme", "#", "menu").create();

  menu.append(newGame, scoreLink, theme);

  content.append(logo, menu);
  container.append(content);
  header.append(container);

  return header;
}

function createMainContent() {
  const main = document.createElement("main");
  main.className = "main";

  GAME_CONTAINER = createContainer("game", true);
  const gameSelectContainer = createContainer("game__select", false);

  const gameWrap = document.createElement("div");
  gameWrap.className = "game__wrap";

  const gameTimer = document.createElement("div");
  gameTimer.className = "game__timer";
  const gameTimerBlock = document.createElement("p");
  gameTimerBlock.className = "timer";
  const { hours, minutes, seconds } = getTimer();

  const gameContent = createGameSpace(NONOGRAM_SIZE, NONOGRAM_NAME);
  const gameButtonsContainer = createContainer("game__buttons", false);
  const gameLevels = createSelectLevels(gameWrap, gameSelectContainer);
  const gameStages = createSelectStages(gameWrap);

  SAVE_BUTTON = new Button("Save game", "game").create();
  RANDOM_GAME_BUTTON = new Button("Random game", "game").create();
  SOLUTION_BUTTON = new Button("Solution", "game").create();
  CONTINUE_GAME_BUTTON = new Button("Continue game", "game").create();
  RESET_GAME_BUTTON = new Button("Reset game", "game").create();

  TIMER = new Timer(hours, minutes, seconds, 0, 0, 0);

  disabledButtons([SAVE_BUTTON, RESET_GAME_BUTTON]);
  SAVE_BUTTON.addEventListener("click", (e) => {
    e.preventDefault();
    saveGame(gameWrap, gameSelectContainer);
  });

  RANDOM_GAME_BUTTON.addEventListener("click", (e) => {
    e.preventDefault();
    randomGame(gameWrap, gameSelectContainer);
  });

  SOLUTION_BUTTON.addEventListener("click", (e) => {
    e.preventDefault();
    showSolution(gameWrap);
  });

  RESET_GAME_BUTTON.addEventListener("click", (e) => {
    e.preventDefault();
    resetGame(gameWrap);
  });

  gameTimerBlock.append(hours, minutes, seconds);
  gameTimer.append(gameTimerBlock);
  gameWrap.append(gameContent);
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
    gameWrap,
    gameButtonsContainer
  );
  main.append(GAME_CONTAINER);

  return main;
}

function renderGame(nonogramSize, nonogramName, gameWrap) {
  const game = createGameSpace(nonogramSize, nonogramName);
  Array.from(gameWrap.children).forEach((el) => {
    el.remove();
  });
  gameWrap.append(game);
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
DOC.prepend(createMainContent());
DOC.prepend(createHeaderContent());
