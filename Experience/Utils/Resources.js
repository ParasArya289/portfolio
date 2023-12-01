import EventEmitter from "events";
import{GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader.js";
import{DRACOLoader} from "three/examples/jsm/loaders/DRACOLoader.js";
import Experience from "../Experience";


export default class Resources extends EventEmitter {
  constructor(assets) {
    super();
    this.experience = new Experience();
    this.renderer = this.experience.renderer;
    this.assets = assets;
    this.items={};
    this.queue = this.assets.length;
    this.loaded = 0;
    this.startLoaders();
    this.startLoading();
  }
  startLoaders(){
    this.loaders={};
    this.loaders.gltfloader = new GLTFLoader()
    this.loaders.dracoloader = new DRACOLoader()
    this.loaders.dracoloader.setDecoderPath("/draco")
    this.loaders.gltfloader.setDracoLoader(this.loaders.dracoloader)
  }
  startLoading(){

  }
}
