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
    this.modal.className = `modal ${this.className}`;
    this.overlay.className = `modal__overlay`;
    this.wrap.className = `modal__wrap`;
    this.container.className = `modal__container`;
    this.content.className = `modal__content`;
    this.title.className = `modal__title`;
    this.text.className = `modal__text`;
    this.time.className = `modal__time`;
    this.close.className = `modal__close`;

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
    this.modal.addEventListener("click", ({target}) => {
      if(target === this.close || target === this.overlay) {
        this.hide();
        setTimeout(() => {
          this.clear();
        }, 300);
      }
    });
  }

  update(title, content, time) {
    this.title.textContent = title;
    if(typeof content === "object") {
      this.content.innerHTML = "";
      this.content.append(content);
    } else {
      this.text.textContent = content;
      this.time.textContent = time;
    }
  }

  show() {
    this.modal.classList.add(`modal_show`);
  }

  hide() {
    this.modal.classList.remove(`modal_show`);
  }

  clear() {
    this.title.textContent = "";
    this.text.textContent = "";
    this.time.textContent = "";
  }
}
