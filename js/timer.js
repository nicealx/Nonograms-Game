export default class Timer {
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

  current() {
    return [this.hours, this.minutes, this.seconds];
  }
}