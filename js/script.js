const body = document.querySelector("body");
let matrix = [];
let nonogramSize = 5;
let nonogramName = "cup";

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

function pickHandler(e) {
  e.preventDefault();
  const button = e.button;
  const target = e.target;
  const currentCell = target.dataset.cell;
  const currentCellParent = target.parentNode.dataset.cells;
  let answer = 0;
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
      answer = 0;
      target.classList.remove("game__cell-fill");
      deleteMatrixElement(currentCellParent, currentCell);
    }
    target.classList.toggle("game__cell-cross");
  }
}

function randomGame(gameWrap, gameSelect) {
  const arrMain = Object.keys(template);
  const randomSize = Math.floor(Math.random() * arrMain.length);
  const arrSecond = Object.keys(template[Number(arrMain[randomSize])]);
  const randomName = Math.floor(Math.random() * arrSecond.length);
  const sessionSize = Number(sessionStorage.getItem("nonogramSize"));
  const sessionName = sessionStorage.getItem("nonogramName");
  nonogramSize = arrMain[randomSize];
  nonogramName = arrSecond[randomName];

  const currentSelect = gameSelect.querySelector(".select__current");
  if (
    sessionSize === arrMain[randomSize] &&
    sessionName === arrSecond[randomName]
  ) {
    randomGame();
  } else {
    sessionStorage.setItem("nonogramSize", arrMain[randomSize]);
    sessionStorage.setItem("nonogramName", arrSecond[randomName]);
    currentSelect.textContent = arrSecond[randomName];
    renderGame(arrMain[randomSize], arrSecond[randomName], gameWrap);
  }
}

function resetGame(gameSelect, gameWrap) {
  return;
}

function showSolution(gameWrap) {
  const solution = template[nonogramSize][nonogramName];
  const gameCellsList = gameWrap.querySelectorAll(".game__cells");
  gameCellsList.forEach((cells) => {
    const row = solution[cells.dataset.cells];
    Array.from(cells.children).forEach((cell) => {
      const rowCell = row[cell.dataset.cell];

      if (rowCell === 1) {
        cell.classList.add("game__cell-fill");
      }
    });
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
    matrix.push(temp);
  }

  return matrix;
}

function addMatrixElement(currentCellParent, currentCell, answer) {
  matrix[currentCellParent][currentCell] = answer;
}

function deleteMatrixElement(currentCellParent, currentCell) {
  matrix[currentCellParent][currentCell] = 0;
}

function createPlace(nonogramSize, nonogramName) {
  const place = document.createElement("div");
  place.className = "game__place";

  const top = document.createElement("div");
  top.className = "game__top clues";
  const left = document.createElement("div");
  left.className = "game__left clues";
  const body = document.createElement("div");
  body.className = "game__body";

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
      cell.addEventListener("click", pickHandler);
      cell.addEventListener("contextmenu", pickHandler);
      div.append(cell);
    });
    body.append(div);
  });

  top.append(topClues);
  left.append(leftClues);
  place.append(top, left, body);
  return place;
}

function createGameSpace(nonogramSize, nonogramName) {
  const game = document.createElement("div");
  game.className = "game__content";
  const gameWrap = document.createElement("div");
  gameWrap.className = "game__wrap";
  const title = document.createElement("h2");
  title.className = "game__title";
  title.textContent = nonogramName;
  let gamePlace = createPlace(nonogramSize, nonogramName);
  matrix = createMatrix(nonogramSize);

  gameWrap.append(title, gamePlace);
  game.append(gameWrap);

  return game;
}

function createSelect(gameWrap) {
  const select = document.createElement("div");
  select.className = "select";
  const selectHeader = document.createElement("div");
  selectHeader.className = "select__header";
  const selectCurrent = document.createElement("span");
  selectCurrent.className = "select__current";
  selectCurrent.textContent = "cup";
  const selectBody = document.createElement("div");
  selectBody.className = "select__body";

  for (let key in template) {
    const selectGroup = document.createElement("ul");
    selectGroup.className = "select__group";
    selectGroup.dataset.size = key;
    const selectFirstLi = document.createElement("li");
    selectFirstLi.className = "select__option select__option--inactive";
    selectFirstLi.textContent = `${key}*${key}`;
    selectGroup.append(selectFirstLi);
    for (let name in template[key]) {
      const selectOption = document.createElement("li");
      selectOption.className = "select__option";
      selectOption.textContent = name;
      selectOption.dataset.name = name;
      selectGroup.append(selectOption);
    }
    selectBody.append(selectGroup);
  }

  selectHeader.append(selectCurrent);
  select.append(selectHeader, selectBody);

  function selectHandler(e) {
    const target = e.target;
    nonogramSize = target.parentNode.dataset.size;
    nonogramName = target.dataset.name;
    if (target.classList.contains("select__header")) {
      selectBody.classList.toggle("select__body--show");
    }

    if (
      target.classList.contains("select__option") &&
      !target.classList.contains("select__option--inactive")
    ) {
      selectBody.classList.remove("select__body--show");
      selectCurrent.textContent = nonogramName;
      Array.from(selectBody.querySelectorAll(".select__option")).forEach(
        (option) => option.classList.remove("select__option-current")
      );
      target.classList.add("select__option-current");
    }

    if (
      !target.classList.contains("select__option--inactive") &&
      target.classList.contains("select__option")
    ) {
      matrix = [];
      renderGame(nonogramSize, nonogramName, gameWrap);
    }
  }

  select.addEventListener("click", selectHandler);

  return select;
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
  const gameContent = createGameSpace(5, "cup");
  const gameButtonsContainer = createContainer("game__buttons", false);
  const gameSelect = createSelect(gameWrap);

  const saveButton = new Button("Save game", "game").create();
  const randomGameButton = new Button("Random game", "game").create();
  const solutionButton = new Button("Solution", "game").create();
  const continueGameButton = new Button("Continue game", "game").create();
  const resetGameButton = new Button("Reset game", "game").create();

  randomGameButton.addEventListener("click", (e) => {
    e.preventDefault();
    randomGame(gameWrap, gameSelect);
  });

  solutionButton.addEventListener("click", (e) => {
    e.preventDefault();
    showSolution(gameWrap);
  });

  resetGameButton.addEventListener("click", (e) => {
    e.preventDefault();
    resetGame(gameSelect, gameWrap);
  });

  gameWrap.append(gameContent);
  gameButtonsContainer.append();
  gameSelectContainer.append(gameSelect);
  gameButtonsContainer.append(
    saveButton,
    continueGameButton,
    randomGameButton,
    solutionButton,
    resetGameButton
  );

  gameContainer.append(gameSelectContainer, gameWrap, gameButtonsContainer);
  main.append(gameContainer);

  return main;
}

function renderGame(nonogramSize, nonogramName, gameWrap) {
  const game = createGameSpace(nonogramSize, nonogramName);
  gameWrap.innerHTML = "";
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

body.prepend(createFooterContent());
body.prepend(createMainContent());
body.prepend(createHeaderContent());
