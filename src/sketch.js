import p5 from "p5";
import Generator from "./generator";

class Sketch {
  constructor(canvasContainerId = "canvasContainer") {
    this._parentContainer = document.getElementById(canvasContainerId);
    this._initSettings();
    this._p5 = new p5(s => {
      s.setup = () => this._setup();
      s.draw = () => this._draw();
      s.windowResized = () => this._windowResized();
    }, this._parentContainer.id);
  }

  static get availableAngleDeltas() {
    return {
      "PI/3": Math.PI / 3,
      "PI/4": Math.PI / 4,
      "PI/6": Math.PI / 6,
      "PI/8": Math.PI / 8
    };
  }

  static get defaultSettings() {
    return {
      angleDelta: Math.PI / 4,
      initialSegmentCount: 100,
      maxSegmentCount: 5000,
      minLengthToSpawn: 10,
      maxSegmentGeneration: 100,
      size: 480,
      useGaussian: true,
      standardDeviationFactor: 0.3,
      seed: "this-is-my-seed"
    };
  }

  saveImage() {
    this._p5.saveCanvas("procedural-line-art.png");
  }

  set settings(settings) {
    this._settings = settings;
    this._initGenerator();
    return this._settings;
  }

  get settings() {
    return this._settings;
  }

  set angleDelta(angleDelta) {
    this.settings = {
      ...this.settings,
      angleDelta
    };
    return angleDelta;
  }

  set seed(seed) {
    this.settings = {
      ...this.settings,
      seed
    };
    return seed;
  }

  set initialSegmentCount(initialSegmentCount) {
    this.settings = {
      ...this.settings,
      initialSegmentCount
    };
    return initialSegmentCount;
  }

  set useGaussian(useGaussian) {
    this.settings = {
      ...this.settings,
      useGaussian
    };
    return useGaussian;
  }

  set standardDeviationFactor(standardDeviationFactor) {
    this.settings = {
      ...this.settings,
      standardDeviationFactor
    };
    return standardDeviationFactor;
  }

  _initSettings() {
    let { offsetWidth: width } = this._parentContainer;
    this._settings = {
      ...Sketch.defaultSettings,
      size: Math.min(width, Sketch.defaultSettings.size)
    };
    Object.freeze(this._settings);
  }

  _setup() {
    this._p5.createCanvas(this.settings.size, this.settings.size);
    this._initCanvas();
    this._initGenerator();
  }

  _initCanvas() {
    this._p5.clear();
    this._p5.resizeCanvas(this.settings.size, this.settings.size);
    this._p5.background("white");
    this._p5.frameRate(60);
    this._p5.rect(0, 0, this.settings.size, this.settings.size);
  }

  _initGenerator() {
    this._generator = new Generator(this.settings, this._p5);
    this._initCanvas();
    this._dispatchReadyStateChangeEvent(false);
    this._p5.loop();
  }

  _draw() {
    if (!this._generator.iterate()) {
      this._p5.noLoop();
      this._dispatchReadyStateChangeEvent(true);
    }
    this._generator.draw();
  }

  _dispatchReadyStateChangeEvent(ready) {
    let evt = new CustomEvent("sketchReadyStateChanged", { detail: { ready } });
    document.dispatchEvent(evt);
  }

  _windowResized() {
    this._initSettings();
    this._initGenerator();
  }
}

export default Sketch;
