export default class Theme {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.theme = document.createElement("li");
    this.themeList = document.createElement("ul");
    this.themeSun = document.createElement("li");
    this.themeMoon = document.createElement("li");
  }

  init() {
    this.theme.className = "theme";
    this.themeList.className = "theme__list";
    this.themeSun.className = "theme__light";
    this.themeMoon.className = "theme__dark";
    this.themeList.append(this.sun(), this.moon());

    this.theme.append(this.themeList);

    return this.theme;
  }

  sun() {
    const a = document.createElement("a");
    a.className = "theme__light-link";
    a.href = "#";
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "light");
    svg.setAttributeNS(null, "viewBox", `0 0 ${this.width} ${this.height}`);
    svg.setAttributeNS(null, "width", this.width);
    svg.setAttributeNS(null, "height", this.height);

    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttributeNS(
      null,
      "d",
      "M 14.984375 0.98632812 A 1.0001 1.0001 0 0 0 14 2 L 14 5 A 1.0001 1.0001 0 1 0 16 5 L 16 2 A 1.0001 1.0001 0 0 0 14.984375 0.98632812 z M 5.796875 4.7988281 A 1.0001 1.0001 0 0 0 5.1015625 6.515625 L 7.2226562 8.6367188 A 1.0001 1.0001 0 1 0 8.6367188 7.2226562 L 6.515625 5.1015625 A 1.0001 1.0001 0 0 0 5.796875 4.7988281 z M 24.171875 4.7988281 A 1.0001 1.0001 0 0 0 23.484375 5.1015625 L 21.363281 7.2226562 A 1.0001 1.0001 0 1 0 22.777344 8.6367188 L 24.898438 6.515625 A 1.0001 1.0001 0 0 0 24.171875 4.7988281 z M 15 8 A 7 7 0 0 0 8 15 A 7 7 0 0 0 15 22 A 7 7 0 0 0 22 15 A 7 7 0 0 0 15 8 z M 2 14 A 1.0001 1.0001 0 1 0 2 16 L 5 16 A 1.0001 1.0001 0 1 0 5 14 L 2 14 z M 25 14 A 1.0001 1.0001 0 1 0 25 16 L 28 16 A 1.0001 1.0001 0 1 0 28 14 L 25 14 z M 7.9101562 21.060547 A 1.0001 1.0001 0 0 0 7.2226562 21.363281 L 5.1015625 23.484375 A 1.0001 1.0001 0 1 0 6.515625 24.898438 L 8.6367188 22.777344 A 1.0001 1.0001 0 0 0 7.9101562 21.060547 z M 22.060547 21.060547 A 1.0001 1.0001 0 0 0 21.363281 22.777344 L 23.484375 24.898438 A 1.0001 1.0001 0 1 0 24.898438 23.484375 L 22.777344 21.363281 A 1.0001 1.0001 0 0 0 22.060547 21.060547 z M 14.984375 23.986328 A 1.0001 1.0001 0 0 0 14 25 L 14 28 A 1.0001 1.0001 0 1 0 16 28 L 16 25 A 1.0001 1.0001 0 0 0 14.984375 23.986328 z"
    );

    g.append(path);
    svg.append(g);
    a.append(svg);
    this.themeSun.append(a);

    return this.themeSun;
  }

  moon() {
    const a = document.createElement("a");
    a.className = "theme__dark-link";
    a.href = "#";
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "dark");
    svg.setAttributeNS(null, "viewBox", `0 0 ${this.width} ${this.height}`);
    svg.setAttributeNS(null, "width", this.width);
    svg.setAttributeNS(null, "height", this.height);

    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.setAttributeNS(null, "transform", "translate(2, 2), scale(1.1)");
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttributeNS(
      null,
      "d",
      "M12 22C17.5228 22 22 17.5228 22 12C22 11.5373 21.3065 11.4608 21.0672 11.8568C19.9289 13.7406 17.8615 15 15.5 15C11.9101 15 9 12.0899 9 8.5C9 6.13845 10.2594 4.07105 12.1432 2.93276C12.5392 2.69347 12.4627 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
    );
    path.setAttributeNS(null, "fill", "#ffffff");
    g.append(path);
    svg.append(g);
    a.append(svg);
    this.themeMoon.append(a);

    return this.themeMoon;
  }

  change(current) {
    if (current === "light") {
      this.themeSun.classList.remove("theme__hide");
      this.themeMoon.classList.add("theme__hide");
    }
    if (current === "dark") {
      this.themeSun.classList.add("theme__hide");
      this.themeMoon.classList.remove("theme__hide");
    }
  }
}
