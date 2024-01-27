const DOC = document.querySelector("body");
let MATRIX = [];
let nonogramSize = 5;
let nonogramName = "cup";
let BODY = null;

let TIMER = null;
let TIMER_RUN = false;

let SAVE_BUTTON = null;
let RANDOM_GAME_BUTTON = null;
let CONTINUE_GAME_BUTTON = null;
let RESET_GAME_BUTTON = null;
let SOLUTION_BUTTON = null;

sessionStorage.setItem("nonogramSize", 0);
sessionStorage.setItem("nonogramName", "cup");

const template = {
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
    "1": new Array(10).fill(new Array(10).fill(1)),
    "2": new Array(10).fill(new Array(10).fill(1)),
    "3": new Array(10).fill(new Array(10).fill(1)),
    "4": new Array(10).fill(new Array(10).fill(1)),
    "5": new Array(10).fill(new Array(10).fill(1)),
  },
  15: {
    "1": new Array(15).fill(new Array(15).fill(1)),
    "2": new Array(15).fill(new Array(15).fill(1)),
    "3": new Array(15).fill(new Array(15).fill(1)),
    "4": new Array(15).fill(new Array(15).fill(1)),
    "5": new Array(15).fill(new Array(15).fill(1)),
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
    clearInterval(this.timer);
  }
}

function checkWin(matrix, currentPlace) {
  if (matrix.toString() === currentPlace.toString()) {
    console.log("Win");
    BODY.removeEventListener("click", pickHandler);
    BODY.removeEventListener("contextmenu", pickHandler);
    BODY.addEventListener("contextmenu", (e) => {
      e.preventDefault();
    });
    TIMER.stop();
  }
}

function addMatrixElement(currentCellParent, currentCell, answer) {
  MATRIX[currentCellParent][currentCell] = answer;
  checkWin(MATRIX, template[nonogramSize][nonogramName]);
}

function deleteMatrixElement(currentCellParent, currentCell) {
  MATRIX[currentCellParent][currentCell] = 0;
  checkWin(MATRIX, template[nonogramSize][nonogramName]);
}

function pickHandler(e) {
  e.preventDefault();
  const button = e.button;
  const target = e.target;
  const currentCell = target.dataset.cell;
  const currentCellParent = target.parentNode.dataset.cells;
  let answer = 0;
  if (target.classList.contains("game__cell")) {
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

function startTimer() {
  TIMER.start();
  BODY.removeEventListener("click", startTimer);
}

function saveGame(gameWrap, gameSelectContainer) {
  console.log(gameWrap, gameSelectContainer);
}

function randomGame(gameWrap, gameSelectContainer) {
  TIMER.reset();
  TIMER.stop();
  MATRIX = [];
  SAVE_BUTTON.disabled = false;
  const arrMain = Object.keys(template);
  const randomSize = Math.floor(Math.random() * arrMain.length);
  const arrSecond = Object.keys(template[Number(arrMain[randomSize])]);
  const randomName = Math.floor(Math.random() * arrSecond.length);
  const sessionSize = Number(sessionStorage.getItem("nonogramSize"));
  const sessionName = sessionStorage.getItem("nonogramName");
  nonogramSize = arrMain[randomSize];
  nonogramName = arrSecond[randomName];

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
    sessionStorage.setItem("nonogramSize", arrMain[randomSize]);
    sessionStorage.setItem("nonogramName", arrSecond[randomName]);
    currentLevelSelect.textContent = `${arrMain[randomSize]}*${arrMain[randomSize]}`;
    renderGame(arrMain[randomSize], arrSecond[randomName], gameWrap);
    Array.from(gameSelectContainer.children).forEach((el) => {
      if (el.classList.contains("select-stages")) {
        el.remove();
      }
    });
    gameSelectContainer.append(createSelectStages(gameWrap));
  }
}

function resetGame(gameContent) {
  console.log(gameContent);
  return;
}

function showSolution(gameWrap) {
  TIMER.stop();
  SAVE_BUTTON.disabled = true;
  const solution = template[nonogramSize][nonogramName];
  const gameCellsList = gameWrap.querySelectorAll(".game__cells");
  gameCellsList.forEach((cells) => {
    const row = solution[cells.dataset.cells];
    Array.from(cells.children).forEach((cell) => {
      const rowCell = row[cell.dataset.cell];

      if (rowCell === 1) {
        cell.classList.add("game__cell-fill");
      } else {
        cell.classList.remove("game__cell-fill");
      }
    });
  });
  BODY.removeEventListener("click", pickHandler);
  BODY.removeEventListener("contextmenu", pickHandler);
  BODY.addEventListener("contextmenu", (e) => {
    e.preventDefault();
  });
}

function createContainer(containerClass = "", need) {
  const container = document.createElement("div");
  container.className = `${
    containerClass.length > 0 ? containerClass + " " : ""
  }${need ? "container" : ""}`;

  return container;
}

function getGamePlace(nonogramSize, nonogramName) {
  const pic = template[nonogramSize][nonogramName];
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
  selectHeader.className = "select__header";
  const selectCurrent = document.createElement("span");
  selectCurrent.className = "select__current";
  selectCurrent.textContent = `${nonogramSize}*${nonogramSize}`;
  const selectBody = document.createElement("div");
  selectBody.className = "select__body";

  const selectGroup = document.createElement("ul");
  selectGroup.className = "select__group";
  for (let key in template) {
    const selectLi = document.createElement("li");
    selectLi.className = "select__option";
    selectLi.textContent = `${key}*${key}`;
    selectLi.dataset.size = key;
    selectGroup.append(selectLi);
    selectBody.append(selectGroup);
  }

  selectHeader.append(selectCurrent);
  selectLevels.append(selectHeader, selectBody);

  function selectHandler(e) {
    const target = e.target;
    nonogramSize = target.dataset.size;
    nonogramName = target.dataset.name;
    if (target.classList.contains("select__header")) {
      selectBody.classList.toggle("select__body--show");
    }

    if (target.classList.contains("select__option")) {
      selectBody.classList.remove("select__body--show");
      selectCurrent.textContent = `${nonogramSize}*${nonogramSize}`;
      Array.from(selectBody.querySelectorAll(".select__option")).forEach(
        (option) => option.classList.remove("select__option-current")
      );
      target.classList.add("select__option-current");
      Array.from(gameSelectContainer.children).forEach((el) => {
        if (el.classList.contains("select-stages")) {
          el.remove();
        }
      });
      gameSelectContainer.append(
        createSelectStages(
          gameWrap,
          Object.keys(template[target.dataset.size])[0]
        )
      );
    }
  }

  selectLevels.addEventListener("click", selectHandler);

  return selectLevels;
}

function createSelectStages(gameWrap, currentNonogramName = nonogramName) {
  const selectStages = document.createElement("div");
  selectStages.className = `select select-stages`;
  const selectHeader = document.createElement("div");
  selectHeader.className = "select__header";
  const selectCurrent = document.createElement("span");
  selectCurrent.className = "select__current";
  selectCurrent.textContent = currentNonogramName;
  const selectBody = document.createElement("div");
  selectBody.className = "select__body";

  const selectGroup = document.createElement("ul");
  selectGroup.className = "select__group";
  selectGroup.dataset.size = nonogramSize;
  for (let name in template[nonogramSize]) {
    const selectOption = document.createElement("li");
    selectOption.className = "select__option";
    selectOption.textContent = name;
    selectOption.dataset.name = name;
    selectGroup.append(selectOption);
  }

  selectBody.append(selectGroup);
  selectHeader.append(selectCurrent);
  selectStages.append(selectHeader, selectBody);

  function selectHandler(e) {
    const target = e.target;
    nonogramSize = target.parentNode.dataset.size;
    nonogramName = target.dataset.name;
    if (target.classList.contains("select__header")) {
      selectBody.classList.toggle("select__body--show");
    }

    if (target.classList.contains("select__option")) {
      selectBody.classList.remove("select__body--show");
      selectCurrent.textContent = nonogramName;
      Array.from(selectBody.querySelectorAll(".select__option")).forEach(
        (option) => option.classList.remove("select__option-current")
      );
      target.classList.add("select__option-current");
      MATRIX = [];
      TIMER.stop();
      TIMER.reset();
      renderGame(nonogramSize, nonogramName, gameWrap);
    }
  }

  selectStages.addEventListener("click", selectHandler);

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

  BODY.addEventListener("click", pickHandler);
  BODY.addEventListener("contextmenu", pickHandler);
  BODY.addEventListener("click", startTimer);

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

  const gameContainer = createContainer("game", true);
  const gameSelectContainer = createContainer("game__select", false);

  const gameWrap = document.createElement("div");
  gameWrap.className = "game__wrap";

  const gameTimer = document.createElement("div");
  gameTimer.className = "game__timer";
  const gameTimerBlock = document.createElement("p");
  gameTimerBlock.className = "timer";
  const { hours, minutes, seconds } = getTimer();

  const gameContent = createGameSpace(nonogramSize, nonogramName);
  const gameButtonsContainer = createContainer("game__buttons", false);
  const gameLevels = createSelectLevels(gameWrap, gameSelectContainer);
  const gameStages = createSelectStages(gameWrap);

  SAVE_BUTTON = new Button("Save game", "game").create();
  RANDOM_GAME_BUTTON = new Button("Random game", "game").create();
  SOLUTION_BUTTON = new Button("Solution", "game").create();
  CONTINUE_GAME_BUTTON = new Button("Continue game", "game").create();
  RESET_GAME_BUTTON = new Button("Reset game", "game").create();

  TIMER = new Timer(hours, minutes, seconds, 0, 0, 0);

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
    resetGame(gameContent);
  });

  gameTimerBlock.append(hours, minutes, seconds);
  gameTimer.append(gameTimerBlock);
  gameWrap.append(gameContent);
  gameButtonsContainer.append();
  gameSelectContainer.append(gameLevels, gameStages);
  gameButtonsContainer.append(
    SAVE_BUTTON,
    CONTINUE_GAME_BUTTON,
    RANDOM_GAME_BUTTON,
    SOLUTION_BUTTON,
    RESET_GAME_BUTTON
  );

  gameContainer.append(
    gameSelectContainer,
    gameTimer,
    gameWrap,
    gameButtonsContainer
  );
  main.append(gameContainer);

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
