import { EventEmitter } from "events";
import Experience from "./Experience";
export default class Theme extends EventEmitter {
  constructor() {
    super();
    this.experience = new Experience();
    this.resources = this.experience.resources;
    this.theme = "light";
    this.toggleButton = document.querySelector(".toggle-btn");
    this.toggleCircle = document.querySelector(".toggle-circle");
    this.setEventListeners();

    this.resources.on("ready", () => {
      setTimeout(() => {
        const prefersDarkMode = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;
        if (prefersDarkMode) {
          this.toggleCircle.classList.toggle("slide");
          this.theme = "dark";
          document.body.classList.toggle("dark-theme");
          document.body.classList.toggle("light-theme");
          this.emit("switch", this.theme);
        }
      }, 0);
    });

    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (e) => {
        const isDarkMode = e.matches;
        if (isDarkMode) {
          this.toggleCircle.classList.add("slide");
          document.body.classList.add("dark-theme");
          this.theme = "dark";
          document.body.classList.remove("light-theme");
          this.emit("switch", this.theme);
        } else {
          this.toggleCircle.classList.remove("slide");
          document.body.classList.add("light-theme");
          document.body.classList.remove("dark-theme");
          this.theme = "light";
          this.emit("switch", this.theme);
        }
      });
  }
  setEventListeners() {
    this.toggleButton.addEventListener("click", () => {
      this.toggleCircle.classList.toggle("slide");
      this.theme = this.theme === "light" ? "dark" : "light";
      document.body.classList.toggle("dark-theme");
      document.body.classList.toggle("light-theme");
      this.emit("switch", this.theme);
    });
  }
}
