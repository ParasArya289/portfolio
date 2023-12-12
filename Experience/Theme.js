import { EventEmitter } from "events";
export default class Theme extends EventEmitter {
  constructor() {
    super();
    this.theme = "light";
    this.toggleButton = document.querySelector(".toggle-btn");
    this.toggleCircle = document.querySelector(".toggle-circle");
    this.setEventListeners();
  }
  setEventListeners() {
    this.toggleButton.addEventListener("click", () => {
      this.toggleCircle.classList.toggle("slide");
      this.theme = this.theme === "light" ? "dark" : "light";
    });
  }
}
