export default class Timer {
  constructor(minutesElem, secondsElem, minutes, seconds) {
    this.minutesElem = minutesElem;
    this.secondsElem = secondsElem;
    this.minutes = minutes;
    this.seconds = seconds;
  }

  reset() {
    this.minutes = 0;
    this.seconds = 0;
    this.minutesElem.textContent = `0${this.minutes}:`;
    this.secondsElem.textContent = `0${this.seconds}`;
  }

  start() {
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
  }

  stop() {
    console.log("Timer stoped");
    clearInterval(this.timer);
  }

  current() {
    return [this.minutes, this.seconds];
  }
}