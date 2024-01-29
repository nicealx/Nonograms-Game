export default class Modal {
  constructor(className) {
    this.className = className;
    this.modal = document.createElement("div");
    this.overlay = document.createElement("div");
    this.wrap = document.createElement("div");
    this.container = document.createElement("div");
    this.content = document.createElement("div");
    this.title = document.createElement("h2");
    this.text = document.createElement("p");
    this.time = document.createElement("p");
    this.close = document.createElement("div");
  }

  init() {
    this.modal.className = `${this.className}`;
    this.overlay.className = `${this.className}__overlay`;
    this.wrap.className = `${this.className}__wrap`;
    this.container.className = `${this.className}__container`;
    this.content.className = `${this.className}__content`;
    this.title.className = `${this.className}__title`;
    this.text.className = `${this.className}__text`;
    this.time.className = `${this.className}__time`;
    this.close.className = `${this.className}__close`;

    this.content.append(this.text, this.time);
    this.container.append(
      this.close,
      this.title,
      this.content
    );
    this.wrap.append(this.container);
    this.modal.append(this.overlay, this.wrap);
    this.event();

    return this.modal;
  }

  event() {
    this.modal.addEventListener("click", () => {
      this.hide();
      this.clear();
    });
  }

  update(title, content, time) {
    this.title.textContent = title.trim();
    this.text.textContent = content.trim();
    this.time.textContent = time.trim();
  }

  show() {
    this.modal.classList.add(`${this.className}--show`);
  }

  hide() {
    this.modal.classList.remove(`${this.className}--show`);
  }

  clear() {
    this.title.textContent = "";
    this.text.textContent = "";
    this.time.textContent = "";
  }
}
