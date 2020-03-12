import SegmentCollection from "./segment-collection";
import Segment from "./segment";

class Generator {
  constructor(settings, p5) {
    this._settings = settings;
    this._p5 = p5;
    this._p5.randomSeed(this._settings.seed);
    this._segments = this._createSegmentCollection();
  }

  get angleDelta() {
    return this._settings.angleDelta;
  }

  get startingAngles() {
    return [
      this.angleDelta,
      Math.PI / 2 + this.angleDelta,
      Math.PI + this.angleDelta,
      (3 * Math.PI) / 2 + this.angleDelta
    ];
  }

  iterate() {
    return this._segments.grow();
  }

  draw() {
    this._segments.draw(this._p5);
  }

  _createSegmentCollection() {
    const initSegments = [];
    for (let i = 0; i < this._settings.initialSegmentCount; i++) {
      initSegments.push(
        new Segment(
          this._getRandomCoords(),
          this._p5.random(this.startingAngles)
        )
      );
    }
    return new SegmentCollection(
      {
        ...this._settings,
        maxCoordValue: this._settings.size
      },
      ...initSegments
    );
  }

  _getRandomCoords() {
    let x = this._settings.useGaussian
      ? this._getGaussianCoordValue()
      : this._getRandomCoordValue();
    let y = this._settings.useGaussian
      ? this._getGaussianCoordValue()
      : this._getRandomCoordValue();
    return {
      x,
      y
    };
  }

  _getGaussianCoordValue() {
    return this._p5.floor(
      this._p5.randomGaussian(
        this._settings.size / 2,
        this._settings.size * this._settings.standardDeviationFactor
      )
    );
  }

  _getRandomCoordValue() {
    return this._p5.random(0, this._settings.size);
  }
}

export default Generator;
