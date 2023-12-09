import Experience from "../Experience";

export default class Floor {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;

    this.setFloor();
  }
  setFloor() {}
  resize() {}
  update() {}
}
