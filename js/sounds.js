export default class Sounds {
  constructor() {
    this.soundsClass = "sounds";
    this.soundsLi = document.createElement("li");
    this.soundsInput = document.createElement("input");
    this.soundsLabel = document.createElement("label");

    this.soundsCross = new Audio("./audio/cross.mp3");
    this.soundsEmpty = new Audio("./audio/empty.mp3");
    this.soundsFill = new Audio("./audio/fill.mp3");
    this.soundsWon = new Audio("./audio/won.mp3");
  }

  init(state) {
    this.soundsLi.className = `menu__item ${this.soundsClass}`;
    this.soundsInput.className = `${this.soundsClass}__input`;
    this.soundsInput.setAttribute("id", `${this.soundsClass}__input`);
    this.soundsInput.type = "checkbox";
    this.soundsLabel.className = `${this.soundsClass}__label ${this.soundsClass}__${state}`;
    this.soundsLabel.setAttribute("for", `${this.soundsClass}__input`);

    this.soundsLi.append(this.soundsLabel, this.soundsInput);
    this.event();
    return this.soundsLi;
  }

  event() {
    this.soundsInput.addEventListener("change", ({ target }) => {
      if (target.checked) {
        this.soundsOff();
        localStorage.setItem("SOUNDS_STATE", "off");
      } else {
        localStorage.setItem("SOUNDS_STATE", "on");
        this.soundsOn();
      }
    });
  }

  include(name) {
    switch (name) {
      case "cross":
        this.soundsCross.play();
        break;

      case "empty":
        this.soundsEmpty.play();
        break;

      case "fill":
        this.soundsFill.play();
        break;

      case "won":
        this.soundsWon.play();
        break;

      default:
        break;
    }
  }

  soundsOn() {
    this.soundsLabel.className = `${this.soundsClass}__label ${this.soundsClass}__on`;
    this.soundsCross.muted = false;
    this.soundsEmpty.muted = false;
    this.soundsFill.muted = false;
    this.soundsWon.muted = false;
  }

  soundsOff() {
    this.soundsLabel.className = `${this.soundsClass}__label ${this.soundsClass}__off`;
    this.soundsCross.muted = true;
    this.soundsEmpty.muted = true;
    this.soundsFill.muted = true;
    this.soundsWon.muted = true;
  }
}
