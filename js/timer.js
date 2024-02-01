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

  update() {
    this.minutesElem.textContent = `${this.minutes < 10 ? "0" + this.minutes : this.minutes }:`;
    this.secondsElem.textContent = `${this.seconds < 10 ? "0" + this.seconds : this.seconds }`;
  }

  start() {
    if (this.minutes < 10) {
      this.minutesElem.textContent = `0${this.minutes}:`;
    } else {
      this.minutesElem.textContent = `${this.minutes}:`;
    }
    if (this.seconds < 10) {
      this.secondsElem.textContent = `0${this.seconds}`;
    } else {
      this.secondsElem.textContent = this.seconds;
    }

    this.timer = setInterval(() => {
      this.count();
    }, 1000);
  }

  count() {
    this.seconds++;
    if (this.seconds < 10) {
      this.secondsElem.textContent = `0${this.seconds}`;
    }

    if (this.seconds > 9) {
      this.secondsElem.textContent = this.seconds;
    }

    if (this.seconds >= 60) {
      this.minutes += this.seconds / 60;
      this.seconds = 0;
      this.secondsElem.textContent = `0${this.seconds}`;
    }

    if (this.minutes < 10) {
      this.minutesElem.textContent = `0${this.minutes}:`;
    }
    if (this.minutes > 9) {
      this.minutesElem.textContent = `${this.minutes}:`;
    }
  }

  stop() {
    clearInterval(this.timer);
  }

  current() {
    return [this.minutes, this.seconds];
  }
}