import GSAP from "gsap";
import * as THREE from "three";
import Experience from "../Experience";

export default class Controlls {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.time = this.experience.time;
    this.camera = this.experience.camera;
  }
  resize() {}
  update() {
  }
}
