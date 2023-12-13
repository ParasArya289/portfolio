import Experience from "../Experience";
import GSAP from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";

export default class Controlls {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.sizes = this.experience.sizes;
    this.time = this.experience.time;
    this.camera = this.experience.camera;
    this.room = this.experience.world.room.actualRoom;
    GSAP.registerPlugin(ScrollTrigger);
    this.setScrollTrigger();
  }
  setScrollTrigger() {
    const scroll = GSAP.matchMedia();
    //desktop
    scroll.add("(min-width:969px)", () => {
      console.log("desktop");
      //First section
      this.firstMovetimeline = new GSAP.timeline();
      this.firstMovetimeline.to(this.room.position, {
        x: () => this.sizes.width * 0.0015,
        scrollTrigger: {
          trigger: ".first-margin",
          markers: true,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });
      //Second section
      this.secondMovetimeline = new GSAP.timeline({
        scrollTrigger: {
          trigger: ".second-margin",
          markers: true,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      })
        .to(
          this.room.position,
          {
            x: () => 1,
            z: () => this.sizes.height * 0.0032,
          },
          "same"
        )
        .to(
          this.room.scale,
          {
            x: 0.4,
            y: 0.4,
            z: 0.4,
          },
          "same"
        )
        .to(
          this.room.children[21],
          {
            height: this.room.children[21].height * 4,
            width: this.room.children[21].width * 4,
          },
          "same"
        )
        .to(
          this.room.children[20],
          {
            height: this.room.children[20].height * 4,
            width: this.room.children[20].width * 4,
          },
          "same"
        )
        .to(
          this.room.children[8].children[2],
          {
            height: 0.3 * 4,
            width: 0.3 * 4,
          },
          "same"
        )
        .to(
          this.room.children[8].children[3],
          {
            power: 1 * 4,
          },
          "same"
        );

      this.thirdMovetimeline = new GSAP.timeline({
        scrollTrigger: {
          trigger: ".third-margin",
          markers: true,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      }).to(this.camera.orthographicCamera.position, {
        x: -4.1,
        y: -1,
      });
    });
    //mobile
    scroll.add("(max-width:968px)", () => {
      console.log("mobile");
    });
  }
  resize() {}
  update() {}
}
