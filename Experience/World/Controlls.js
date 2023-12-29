import Experience from "../Experience";
import GSAP from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ASScroll from "@ashthornton/asscroll";

export default class Controlls {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.sizes = this.experience.sizes;
    this.time = this.experience.time;
    this.camera = this.experience.camera;
    this.room = this.experience.world.room.actualRoom;

    this.circleFirst = this.experience.world.floor.circleFirst;
    this.circleSecond = this.experience.world.floor.circleSecond;
    this.circleThird = this.experience.world.floor.circleThird;

    this.room.children.forEach((child) => {
      if (child.name === "monitorRectLight") {
        this.monitorRectLight = child;
      }
      if (child.name === "aquariamRectLight") {
        this.aquariamRectLight = child;
      }
      if (child.name === "Lamp") {
        child.children.forEach((child) => {
          if (child.type === "PointLight") {
            this.pointLight = child;
          }
          if (child.type === "RectAreaLight") {
            this.rectAreaLight = child;
          }
        });
      }
    });

    GSAP.registerPlugin(ScrollTrigger);
    document.querySelector(".page").style.overflow = "visible";

    this.setSmoothScroll();
    this.setScrollTrigger();
    this.setProjectScroll();
  }

  setProjectScroll() {
    const buttons = document.querySelectorAll(".projects-btn");
    buttons.forEach((button) => {
      button.addEventListener("click", (e) => {
        scroll(e);
      });
    });
    const updateActiveButton = (value) => {
      const buttons = document.querySelectorAll(".projects-btn");
      buttons.forEach((button) => {
        const buttonValue = button.value;
        button.setAttribute(
          "data-active",
          buttonValue === value ? "true" : "false"
        );
      });
    };
    const scroll = (e) => {
      const { value } = e.target;
      const sectionWrapper = document.querySelector(".project-detail-wrapper")
      const sections =
      sectionWrapper.querySelectorAll(".projects-section");

      sections.forEach((section) => {
        //scroll
        if (section.classList.contains(value)) {
          const scrollLeft =
            section.offsetLeft - sectionWrapper.offsetLeft;
            sectionWrapper.scrollTo({
            left: scrollLeft,
            behavior: "smooth",
          });
          updateActiveButton(value);
        }
      });
    };
  }

  setupASScroll() {
    // https://github.com/ashthornton/asscroll
    const asscroll = new ASScroll({
      ease: 0.2,
      disableRaf: true,
    });

    GSAP.ticker.add(asscroll.update);

    ScrollTrigger.defaults({
      scroller: asscroll.containerElement,
    });

    ScrollTrigger.scrollerProxy(asscroll.containerElement, {
      scrollTop(value) {
        if (arguments.length) {
          asscroll.currentPos = value;
          return;
        }
        return asscroll.currentPos;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
      fixedMarkers: true,
    });

    asscroll.on("update", ScrollTrigger.update);
    ScrollTrigger.addEventListener("refresh", asscroll.resize);

    requestAnimationFrame(() => {
      asscroll.enable({
        newScrollElements: document.querySelectorAll(
          ".gsap-marker-start, .gsap-marker-end, [asscroll]"
        ),
      });
    });
    return asscroll;
  }

  setSmoothScroll() {
    this.asscroll = this.setupASScroll();
  }

  //TO BE FIXED: Glitch on mobile view
  //matchmedia is working but gsap is freaking out on scale
  setScrollTrigger() {
    // const scroll = GSAP.matchMedia();
    ScrollTrigger.matchMedia({
      "(min-width:969px)": () => {
        console.log("desktop");

        // this.resetTimeline = new GSAP.timeline();
        // this.resetTimeline.to(this.monitorRectLight, {
        //   height: 0.4,
        //   width: 1,
        //   onComplete: () => {
        //     this.monitorRectLight.height = 0.4;
        //     this.monitorRectLight.width = 1;
        //   },
        // });
        // this.resetTimeline.to(this.aquariamRectLight, {
        //   height: 0.7,
        //   width: 0.5,
        //   onComplete: () => {
        //     this.aquariamRectLight.height = 0.7;
        //     this.aquariamRectLight.width = 0.5;
        //   },
        // });

        this.room.scale.set(0.11, 0.11, 0.11);
        this.room.position.set(0, 0, 0);

        //monitor rectlight
        this.monitorRectLight.height = 0.4;
        this.monitorRectLight.width = 1;

        //aquariam rectlight
        this.aquariamRectLight.height = 0.7;
        this.aquariamRectLight.width = 0.5;

        // //min floor lamp
        this.rectAreaLight.height = 0.3;
        this.rectAreaLight.width = 0.3;

        //camera
        this.camera.orthographicCamera.position.set(0, 6.5, 10);

        //First section
        this.firstMoveTimeline = new GSAP.timeline({
          scrollTrigger: {
            trigger: ".first-margin",
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
            // markers: true,
            invalidateOnRefresh: true,
          },
        });
        this.firstMoveTimeline.fromTo(
          this.room.position,
          { x: 0, y: 0, z: 0 },
          {
            x: () => {
              return this.sizes.width * 0.0014;
            },
          }
        );
        //Second section
        this.secondMovetimeline = new GSAP.timeline({
          scrollTrigger: {
            trigger: ".second-margin",
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        })
          .to(
            this.room.position,
            {
              x: 1,
              z: () => {
                return this.sizes.height * 0.0032;
              },
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
            this.monitorRectLight,
            {
              height: 0.4 * 4,
              width: 1 * 4,
            },
            "same"
          )
          .to(
            this.aquariamRectLight,
            {
              height: 0.7 * 4,
              width: 0.5 * 4,
            },
            "same"
          )
          .to(
            this.rectAreaLight,
            {
              height: 0.3 * 4,
              width: 0.3 * 4,
            },
            "minifloor"
          );

        this.thirdMovetimeline = new GSAP.timeline({
          scrollTrigger: {
            trigger: ".third-margin",
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        }).to(this.camera.orthographicCamera.position, {
          y: 1.5,
          x: -4.1,
        });
      },
      "(max-width:968px)": () => {
        console.log("mobile");

        //reset
        this.room.scale.set(0.07, 0.07, 0.07);
        this.room.position.set(0, 0, 0);

        //monitor rectlight
        this.monitorRectLight.height = 0.28;
        this.monitorRectLight.width = 0.71;

        //aquariam rectlight
        this.aquariamRectLight.height = 0.49;
        this.aquariamRectLight.width = 0.35;

        //min floor lamp
        this.rectAreaLight.height = 0.21;
        this.rectAreaLight.width = 0.21;

        //camera
        this.camera.orthographicCamera.position.set(0, 6.5, 10);

        // First section
        this.firstMoveTimeline = new GSAP.timeline({
          scrollTrigger: {
            trigger: ".first-margin",
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
            // invalidateOnRefresh: true,
          },
        })
          .to(
            this.room.scale,
            {
              x: 0.1,
              y: 0.1,
              z: 0.1,
            },
            "same"
          )
          .to(
            this.aquariamRectLight,
            {
              width: this.aquariamRectLight.width * 1.4,
              height: this.aquariamRectLight.height * 1.4,
            },
            "same"
          )
          .to(
            this.monitorRectLight,
            {
              width: this.monitorRectLight.width * 1.4,
              height: this.monitorRectLight.height * 1.4,
            },
            "same"
          );

        //second
        this.secondMoveTimeline = new GSAP.timeline({
          scrollTrigger: {
            trigger: ".second-margin",
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        })
          .to(
            this.room.scale,
            {
              x: 0.25,
              y: 0.25,
              z: 0.25,
            },
            "same"
          )
          .to(
            this.aquariamRectLight,
            {
              width: this.aquariamRectLight.width * 3.4,
              height: this.aquariamRectLight.height * 3.4,
            },
            "same"
          )
          .to(
            this.monitorRectLight,
            {
              width: this.monitorRectLight.width * 3.4,
              height: this.monitorRectLight.height * 3.4,
            },
            "same"
          )
          .to(
            this.rectAreaLight,
            {
              width: this.rectAreaLight.width * 3.4,
              height: this.rectAreaLight.height * 3.4,
            },
            "minifloor"
          )
          .to(
            this.room.position,
            {
              x: 1.5,
            },
            "same"
          );

        //third
        this.thirdMoveTimeline = new GSAP.timeline({
          scrollTrigger: {
            trigger: ".third-margin",
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        }).to(this.room.position, {
          z: -4.5,
        });
      },
      all: () => {
        //progress bar and section border animation
        this.sections = document.querySelectorAll(".section");
        this.sections.forEach((section) => {
          this.progressWrapper = section.querySelector(".progress-wrapper");
          this.progressBar = section.querySelector(".progress-bar");

          if (section.classList.contains("right")) {
            GSAP.to(section, {
              borderTopLeftRadius: 10,
              scrollTrigger: {
                trigger: section,
                start: "top bottom",
                end: "top top",
                scrub: 0.6,
              },
            });
            GSAP.to(section, {
              borderBottomLeftRadius: 700,
              scrollTrigger: {
                trigger: section,
                start: "bottom bottom",
                end: "bottom top",
                scrub: 0.6,
              },
            });
          } else {
            GSAP.to(section, {
              borderTopRightRadius: 10,
              scrollTrigger: {
                trigger: section,
                start: "top bottom",
                end: "top top",
                scrub: 0.6,
              },
            });
            GSAP.to(section, {
              borderBottomRightRadius: 700,
              scrollTrigger: {
                trigger: section,
                start: "bottom bottom",
                end: "bottom top",
                scrub: 0.6,
              },
            });
          }
          GSAP.from(this.progressBar, {
            scaleY: 0,
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.4,
              pin: this.progressWrapper,
              pinSpacing: false,
            },
          });
        });

        //circle and some house movements
        this.firstCircle = new GSAP.timeline({
          scrollTrigger: {
            trigger: ".first-margin",
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
          },
        }).to(this.circleFirst.scale, {
          x: 3,
          y: 3,
          z: 3,
        });

        // Second section -----------------------------------------
        this.secondCircle = new GSAP.timeline({
          scrollTrigger: {
            trigger: ".second-margin",
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
          },
        })
          .to(
            this.circleSecond.scale,
            {
              x: 3,
              y: 3,
              z: 3,
            },
            "same"
          )
          .to(
            this.room.position,
            {
              y: 0.4,
            },
            "same"
          );

        // Third section -----------------------------------------
        this.thirdCircle = new GSAP.timeline({
          scrollTrigger: {
            trigger: ".third-margin",
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
          },
        }).to(this.circleThird.scale, {
          x: 3,
          y: 3,
          z: 3,
        });

        //min floor animation
        this.secondPartTimeline = new GSAP.timeline({
          scrollTrigger: {
            trigger: ".third-margin",
            start: "center center",
          },
        });
        this.room.children.forEach((child) => {
          if (child.name === "Mini_Floor") {
            this.first = GSAP.to(child.position, {
              x: -5.44055,
              z: 13.6135,
              duration: 0.3,
            });
          }
          if (child.name === "Mailbox") {
            this.second = GSAP.to(child.scale, {
              x: 1,
              y: 1,
              z: 1,
              duration: 0.3,
            });
          }
          if (child.name === "Lamp") {
            this.third = GSAP.to(child.scale, {
              x: 1,
              y: 1,
              z: 1,
              ease: "back.out(2)",
              duration: 0.3,
            });
            this.lampLight = GSAP.to(this.room.pointLight, {
              power: 1,
              ease: "back.out(2)",
              duration: 0.3,
            });
          }
          if (child.name === "FloorFirst") {
            this.fourth = GSAP.to(child.scale, {
              x: 1,
              y: 1,
              z: 1,
              ease: "back.out(2)",
              duration: 0.3,
            });
          }
          if (child.name === "FloorSecond") {
            this.fifth = GSAP.to(child.scale, {
              x: 1,
              y: 1,
              z: 1,
              duration: 0.3,
            });
          }
          if (child.name === "FloorThird") {
            this.sixth = GSAP.to(child.scale, {
              x: 1,
              y: 1,
              z: 1,
              ease: "back.out(2)",
              duration: 0.3,
            });
          }
          if (child.name === "Dirt") {
            this.seventh = GSAP.to(child.scale, {
              x: 1,
              y: 1,
              z: 1,
              ease: "back.out(2)",
              duration: 0.3,
            });
          }
          if (child.name === "Flower1") {
            this.eighth = GSAP.to(child.scale, {
              x: 1,
              y: 1,
              z: 1,
              ease: "back.out(2)",
              duration: 0.3,
            });
          }
          if (child.name === "Flower2") {
            this.ninth = GSAP.to(child.scale, {
              x: 1,
              y: 1,
              z: 1,
              ease: "back.out(2)",
              duration: 0.3,
            });
          }
        });
        this.secondPartTimeline.add(this.first);
        this.secondPartTimeline.add(this.second);
        this.secondPartTimeline.add(this.third);
        this.secondPartTimeline.add(this.lampLight);
        this.secondPartTimeline.add(this.fourth, "-=0.2");
        this.secondPartTimeline.add(this.fifth, "-=0.2");
        this.secondPartTimeline.add(this.sixth, "-=0.2");
        this.secondPartTimeline.add(this.seventh, "-=0.2");
        this.secondPartTimeline.add(this.eighth);
        this.secondPartTimeline.add(this.ninth, "-=0.1");
      },
    });
  }
  // setScrollTrigger() {
  //   const scroll = GSAP.matchMedia();

  //   //desktop
  //   scroll.add("(min-width:969px)", () => {
  //     console.log("desktop");
  //     this.room.scale.set(0.11, 0.11, 0.11);
  //     this.room.position.set(0, 0, 0);

  //     // //monitor rectlight
  //     this.room.children[21].height = 0.4;
  //     this.room.children[21].width = 1;

  //     // //aquariam rectlight
  //     this.room.children[20].height = 0.7;
  //     this.room.children[20].width = 0.5;

  //     // //min floor lamp
  //     this.room.children[8].children[2].height = 0.3;
  //     this.room.children[8].children[2].width = 0.3;

  //     this.room.children[8].children[3].power = 1;
  //     //camera
  //     this.camera.orthographicCamera.position.set(0, 6.5, 10);
  //     //First section
  //     this.firstMovetimeline = new GSAP.timeline();
  //     this.firstMovetimeline.to(this.room.position, {
  //       x: () => this.sizes.width * 0.0015,
  //       scrollTrigger: {
  //         trigger: ".first-margin",
  //         start: "top top",
  //         end: "bottom bottom",
  //         scrub: 0.6,
  //         invalidateOnRefresh: true,
  //       },
  //     });
  //     //Second section
  //     this.secondMovetimeline = new GSAP.timeline({
  //       scrollTrigger: {
  //         trigger: ".second-margin",
  //         start: "top top",
  //         end: "bottom bottom",
  //         scrub: 0.6,
  //         invalidateOnRefresh: true,
  //       },
  //     })
  //       .to(
  //         this.room.position,
  //         {
  //           x: () => 1,
  //           z: () => this.sizes.height * 0.0032,
  //         },
  //         "same"
  //       )
  //       .to(
  //         this.room.scale,
  //         {
  //           x: 0.4,
  //           y: 0.4,
  //           z: 0.4,
  //         },
  //         "same"
  //       )
  //       .to(
  //         this.room.children[21],
  //         {
  //           height: this.room.children[21].height * 4,
  //           width: this.room.children[21].width * 4,
  //         },
  //         "same"
  //       )
  //       .to(
  //         this.room.children[20],
  //         {
  //           height: this.room.children[20].height * 4,
  //           width: this.room.children[20].width * 4,
  //         },
  //         "same"
  //       )
  //       .to(
  //         this.room.children[8].children[2],
  //         {
  //           height: 0.3 * 4,
  //           width: 0.3 * 4,
  //         },
  //         "same"
  //       )
  //       .to(
  //         this.room.children[8].children[3],
  //         {
  //           power: 1 * 4,
  //         },
  //         "same"
  //       );

  //     this.thirdMovetimeline = new GSAP.timeline({
  //       scrollTrigger: {
  //         trigger: ".third-margin",
  //         start: "top top",
  //         end: "bottom bottom",
  //         scrub: 0.6,
  //         invalidateOnRefresh: true,
  //       },
  //     }).to(this.camera.orthographicCamera.position, {
  //       x: -4.1,
  //       y: -1,
  //     });
  //   });
  //   //mobile
  //   scroll.add("(max-width:968px)", () => {
  //     console.log("mobile");

  //     //reset
  //     this.room.scale.set(0.07, 0.07, 0.07);
  //     this.room.position.set(0, 0, 0);

  //     //monitor rectlight
  //     this.room.children[21].height = this.room.children[21].height * 0.7;
  //     this.room.children[21].width = this.room.children[21].width * 0.7;

  //     //aquariam rectlight
  //     this.room.children[20].height = this.room.children[20].height * 0.7;
  //     this.room.children[20].width = this.room.children[20].width * 0.7;

  //     //min floor lamp
  //     this.room.children[8].children[2].height =
  //       this.room.children[8].children[2].height * 0.7;
  //     this.room.children[8].children[2].width =
  //       this.room.children[8].children[2].width * 0.7;

  //     this.room.children[8].children[3].power = 0.2;

  //     //camera
  //     this.camera.orthographicCamera.position.set(0, 6.5, 10);

  //     // First section
  //     this.firstMoveTimeline = new GSAP.timeline({
  //       scrollTrigger: {
  //         trigger: ".first-margin",
  //         start: "top top",
  //         end: "bottom bottom",
  //         scrub: 0.6,
  //         invalidateOnRefresh: true,
  //       },
  //     })
  //       .to(
  //         this.room.scale,
  //         {
  //           x: 0.1,
  //           y: 0.1,
  //           z: 0.1,
  //         },
  //         "same"
  //       )
  //       .to(
  //         this.room.children[20],
  //         {
  //           width: this.room.children[20].width * 1.4,
  //           height: this.room.children[20].height * 1.4,
  //         },
  //         "same"
  //       )
  //       .to(
  //         this.room.children[21],
  //         {
  //           width: this.room.children[21].width * 1.4,
  //           height: this.room.children[21].height * 1.4,
  //         },
  //         "same"
  //       );

  //     //second
  //     this.secondMoveTimeline = new GSAP.timeline({
  //       scrollTrigger: {
  //         trigger: ".second-margin",
  //         start: "top top",
  //         end: "bottom bottom",
  //         scrub: 0.6,
  //         invalidateOnRefresh: true,
  //       },
  //     })
  //       .to(
  //         this.room.scale,
  //         {
  //           x: 0.25,
  //           y: 0.25,
  //           z: 0.25,
  //         },
  //         "same"
  //       )
  //       .to(
  //         this.room.children[20],
  //         {
  //           width: this.room.children[20].width * 3.4,
  //           height: this.room.children[20].height * 3.4,
  //         },
  //         "same"
  //       )
  //       .to(
  //         this.room.children[21],
  //         {
  //           width: this.room.children[21].width * 3.4,
  //           height: this.room.children[21].height * 3.4,
  //         },
  //         "same"
  //       )
  //       .to(
  //         this.room.children[8].children[2],
  //         {
  //           width: this.room.children[8].children[2].width * 3.4,
  //           height: this.room.children[8].children[2].height * 3.4,
  //         },
  //         "same"
  //       )
  //       .to(
  //         this.room.children[8].children[3],
  //         {
  //           power: 1,
  //         },
  //         "same"
  //       )
  //       .to(
  //         this.room.position,
  //         {
  //           x: 1.5,
  //         },
  //         "same"
  //       );

  //     //third
  //     this.thirdMoveTimeline = new GSAP.timeline({
  //       scrollTrigger: {
  //         trigger: ".third-margin",
  //         start: "top top",
  //         end: "bottom bottom",
  //         scrub: 0.6,
  //         invalidateOnRefresh: true,
  //       },
  //     }).to(this.room.position, {
  //       z: -4.5,
  //     });
  //   });

  //   // scroll.add("(min-width:0px)", () => {
  //   //   console.log("fire at all level");
  //   //   // Mini Platform Animations
  //   //   this.secondPartTimeline = new GSAP.timeline({
  //   //     scrollTrigger: {
  //   //       trigger: ".third-margin",
  //   //       start: "center center",
  //   //       markers: true,
  //   //     },
  //   //   });

  //   //   this.room.children.forEach((child) => {
  //   //     console.log(child);
  //   //     if (child.name === "Mini_Floor") {
  //   //       this.first = GSAP.to(child.position, {
  //   //         x: -5.44055,
  //   //         z: 13.6135,
  //   //         duration: 0.3,
  //   //       });
  //   //     }
  //   //     if (child.name === "Mailbox") {
  //   //       this.second = GSAP.to(child.scale, {
  //   //         x: 1,
  //   //         y: 1,
  //   //         z: 1,
  //   //         duration: 0.3,
  //   //       });
  //   //     }
  //   //     if (child.name === "Lamp") {
  //   //       this.third = GSAP.to(child.scale, {
  //   //         x: 1,
  //   //         y: 1,
  //   //         z: 1,
  //   //         ease: "back.out(2)",
  //   //         duration: 0.3,
  //   //       });
  //   //     }
  //   //     if (child.name === "FloorFirst") {
  //   //       this.fourth = GSAP.to(child.scale, {
  //   //         x: 1,
  //   //         y: 1,
  //   //         z: 1,
  //   //         ease: "back.out(2)",
  //   //         duration: 0.3,
  //   //       });
  //   //     }
  //   //     if (child.name === "FloorSecond") {
  //   //       this.fifth = GSAP.to(child.scale, {
  //   //         x: 1,
  //   //         y: 1,
  //   //         z: 1,
  //   //         duration: 0.3,
  //   //       });
  //   //     }
  //   //     if (child.name === "FloorThird") {
  //   //       this.sixth = GSAP.to(child.scale, {
  //   //         x: 1,
  //   //         y: 1,
  //   //         z: 1,
  //   //         ease: "back.out(2)",
  //   //         duration: 0.3,
  //   //       });
  //   //     }
  //   //     if (child.name === "Dirt") {
  //   //       this.seventh = GSAP.to(child.scale, {
  //   //         x: 1,
  //   //         y: 1,
  //   //         z: 1,
  //   //         ease: "back.out(2)",
  //   //         duration: 0.3,
  //   //       });
  //   //     }
  //   //     if (child.name === "Flower1") {
  //   //       this.eighth = GSAP.to(child.scale, {
  //   //         x: 1,
  //   //         y: 1,
  //   //         z: 1,
  //   //         ease: "back.out(2)",
  //   //         duration: 0.3,
  //   //       });
  //   //     }
  //   //     if (child.name === "Flower2") {
  //   //       this.ninth = GSAP.to(child.scale, {
  //   //         x: 1,
  //   //         y: 1,
  //   //         z: 1,
  //   //         ease: "back.out(2)",
  //   //         duration: 0.3,
  //   //       });
  //   //     }
  //   //   });
  //   //   this.secondPartTimeline.add(this.first);
  //   //   this.secondPartTimeline.add(this.second);
  //   //   this.secondPartTimeline.add(this.third);
  //   //   this.secondPartTimeline.add(this.fourth, "-=0.2");
  //   //   this.secondPartTimeline.add(this.fifth, "-=0.2");
  //   //   this.secondPartTimeline.add(this.sixth, "-=0.2");
  //   //   this.secondPartTimeline.add(this.seventh, "-=0.2");
  //   //   this.secondPartTimeline.add(this.eighth);
  //   //   this.secondPartTimeline.add(this.ninth, "-=0.1");
  //   // });
  // }

  resize() {}
  update() {}
}
