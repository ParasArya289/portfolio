import * as THREE from "three";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper.js";

import Experience from "../Experience";
import GSAP from "gsap";

export default class Room {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.time = this.experience.time;
    this.resources = this.experience.resources;
    this.room = this.resources.items.room;
    this.actualRoom = this.room.scene;
    this.roomChildren = {};
    this.lerp = {
      target: 0,
      current: 0,
      ease: 0.1,
    };
    this.setModel();
    this.setAnimation();
    this.onMouseMove();
  }
  onMouseMove() {
    window.addEventListener("mousemove", (e) => {
      this.rotation =
        (e.clientX - (window.innerWidth / 2) * 2) / window.innerWidth;
      this.lerp.target = this.rotation * 0.1;
    });
  }
  setModel() {
    this.actualRoom.children.forEach((child) => {
      child.castShadow = true;
      child.recieveShadow = true;

      if (child instanceof THREE.Group) {
        child.children.forEach((groupchild) => {
          groupchild.castShadow = true;
          groupchild.receiveShadow = true;
        });
      }
      if (child.name === "Aquarium") {
        child.children[0].material = new THREE.MeshPhysicalMaterial();
        child.children[0].material.roughness = 0;
        child.children[0].material.color.set(0x549dd2);
        child.children[0].material.ior = 1;
        child.children[0].material.transmission = 1;
        child.children[0].material.opacity = 1;
        child.children[0].material.depthWrite = false;
        child.children[0].material.depthTest = false;
      }
      if (child.name === "Computer") {
        child.children[1].material = new THREE.MeshBasicMaterial({
          map: this.resources.items.screen,
        });
      }
      if (child.name === "Mini_Floor") {
        child.position.x = -0.289521;
        child.position.z = 8.83572;
      }
      // if (
      //   child.name === "Mailbox" ||
      //   child.name === "Lamp" ||
      //   child.name === "FloorFirst" ||
      //   child.name === "FloorSecond" ||
      //   child.name === "FloorThird" ||
      //   child.name === "Dirt" ||
      //   child.name === "Flower1" ||
      //   child.name === "Flower2"
      // ) {
      //   if (child.name === "Lamp") {
      //     child.children.forEach((child) => {
      //       if (child.type === "PointLight") {
      //         child.scale.set(0, 0, 0);
      //         child.power = 0;
      //         child.intensity = 0;
      //       }
      //     });
      //   }
      //   child.scale.set(0, 0, 0);
      // }
      child.scale.set(0, 0, 0);
      if (child.name === "Cube") {
        // child.scale.set(1, 1, 1);
        child.position.set(0, -1.5, 0);
        child.rotation.y = Math.PI / 4;
      }
      if (child.name === "Lamp") {
        const lampPointLight = new THREE.PointLight(0xfff59d, 0.1, 5);
        lampPointLight.position.set(0, 1.8, 0);
        lampPointLight.power = 0;
        const lampRectLight = new THREE.RectAreaLight(0xfff59d, 1.5, 0.3, 0.3);
        lampRectLight.position.set(0, 0.5, 0);
        lampRectLight.rotation.x = Math.PI / 2;
        this.actualRoom.add(lampRectLight);

        const rectLightHelper = new RectAreaLightHelper(lampRectLight);
        // lampRectLight.add(rectLightHelper);
        child.add(lampRectLight);
        child.add(lampPointLight);

        this.roomChildren["lampPointLight"] = lampPointLight;
      }
      this.roomChildren[child.name.toLowerCase()] = child;
    });

    const width = 0.5;
    const height = 0.7;
    const intensity = 1;
    const aquariamRectLight = new THREE.RectAreaLight(
      0xffffff,
      intensity,
      width,
      height
    );
    aquariamRectLight.name = "aquariamRectLight";
    aquariamRectLight.position.set(7.68244, 7, 0.5);
    aquariamRectLight.rotation.x = -Math.PI / 2;
    aquariamRectLight.rotation.z = Math.PI / 4;
    this.actualRoom.add(aquariamRectLight);
    this.roomChildren["aquariamRectLight"] = aquariamRectLight;

    const monitorRectLight = new THREE.RectAreaLight(
      0x5fdce3,
      intensity,
      1,
      0.4
    );
    monitorRectLight.name = "monitorRectLight";
    monitorRectLight.position.set(-8, 5, -2);
    monitorRectLight.rotation.y = -15;
    this.actualRoom.add(monitorRectLight);
    this.roomChildren["monitorRectLight"] = monitorRectLight;

    const rectLightHelper = new RectAreaLightHelper(monitorRectLight);
    // monitorRectLight.add(rectLightHelper);

    this.scene.add(this.actualRoom);
    this.actualRoom.scale.set(0.11, 0.11, 0.11);
  }
  setAnimation() {
    this.mixer = new THREE.AnimationMixer(this.actualRoom);
    this.swim = this.mixer.clipAction(this.room.animations[0]);
    this.swim.play();
  }
  resize() {}

  update() {
    this.lerp.current = GSAP.utils.interpolate(
      this.lerp.current,
      this.lerp.target,
      this.lerp.ease
    );
    this.actualRoom.rotation.y = this.lerp.current;
    this.mixer.update(this.time.delta * 0.0009);
  }
}
