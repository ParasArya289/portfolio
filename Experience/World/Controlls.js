import Experience from "../Experience";
import GSAP from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import * as THREE from "three";

export default class Controlls {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.sizes = this.experience.sizes;
    this.time = this.experience.time;
    this.camera = this.experience.camera;
    this.room  = this.experience.world.room.actualRoom;
    GSAP.registerPlugin(ScrollTrigger);
    this.setPath();
  }
  setPath(){
    this.timeline = new GSAP.timeline();
    this.timeline.to(this.room.position,{
      x:()=>this.sizes.width * 0.0015,
      scrollTrigger:{
        trigger:".first-margin",
        markers:true,
        start:"top top",
        end:"bottom bottom",
        scrub:0.6,
        invalidateOnRefresh:true
      }
    })
  }
  resize() {}
  update() {
  }
}
