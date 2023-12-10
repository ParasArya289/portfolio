import * as THREE from "three";

import Experience from "../Experience";
import Controlls from "./Controlls";
import Environment from "./Environment";
import Floor from "./Floor";
import Room from "./Room";

export default class World {
  constructor() {
    this.experience = new Experience();
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.canvas = this.experience.canvas;
    this.camera = this.experience.camera;
    this.resources = this.experience.resources;
    this.environment = new Environment();
    this.resources.on("ready", () => {
      this.room = new Room();
      this.floor = new Floor();
      this.controlls = new Controlls();
    });
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
