export default class Modal {
  constructor(className) {
    this.className = className;
    this.modal = document.createElement("div");
    this.modalOverlay = document.createElement("div");
    this.modalWrap = document.createElement("div");
    this.modalContainer = document.createElement("div");
    this.modalContent = document.createElement("div");
    this.modalTitle = document.createElement("h2");
    this.modalClose = document.createElement("div");
  }

  init() {
    this.modal.className = `${this.className}`;
    this.modalOverlay.className = `${this.className}__overlay`;
    this.modalWrap.className = `${this.className}__wrap`;
    this.modalContainer.className = `${this.className}__container`;
    this.modalContent.className = `${this.className}__content`;
    this.modalTitle.className = `${this.className}__title`;
    this.modalClose.className = `${this.className}__close`;
    
    this.modalContainer.append(this.modalClose, this.modalTitle, this.modalContent);
    this.modalWrap.append(this.modalContainer);
    this.modal.append(this.modalOverlay, this.modalWrap);
    this.event();
    
    return this.modal;
  }

  event() {
    this.modal.addEventListener("click", () => {
      this.hide();
    });
  }

  update(title, content) {
    this.modalTitle.textContent = title;
    this.modalContent.textContent = content;
  }

  show() {
    this.modal.classList.add(`${this.className}--show`);
  }

  hide() {
    this.modal.classList.remove(`${this.className}--show`);
  }
}
