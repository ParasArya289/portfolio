import EventEmitter from "events";
import * as THREE from "three";

import Experience from "../Experience";
import Controlls from "./Controlls";
import Environment from "./Environment";
import Floor from "./Floor";
import Room from "./Room";

export default class World extends EventEmitter {
  constructor() {
    super();
    this.experience = new Experience();
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.canvas = this.experience.canvas;
    this.camera = this.experience.camera;
    this.resources = this.experience.resources;
    this.theme = this.experience.theme;

    this.resources.on("ready", () => {
      this.environment = new Environment();
      this.room = new Room();
      this.floor = new Floor();
      this.emit("worldReady");
    });

    this.theme.on("switch", (theme) => {
      this.switchTheme(theme);
    });
  }
  switchTheme(theme) {
    if (this.environment) {
      this.environment.switchTheme(theme);
    }
  }
  resize() {}

  update() {
    if (this.room) {
      this.room.update();
    }
    if (this.controlls) {
      this.controlls.update();
    }
  }
}
