import Sketch from "./sketch";

class App {
  constructor() {
    this._initControls();
    this._sketch = new Sketch();
  }

  _initControls() {
    this._initInputs();
    this._initSaveButton();
  }

  _initSaveButton() {
    this._saveButton = document.getElementById("saveButton");
    this._saveButton.onclick = evt =>
      evt.preventDefault() || this._sketch.saveImage();
    document.addEventListener(
      "sketchReadyStateChanged",
      ({ detail: { ready } }) => (this._saveButton.disabled = !ready)
    );
  }

  _initInputs() {
    this._initSeedField();
    this._initAngleSelect();
    this._initSegmentCountSlider();
    this._initGaussianFields();
  }

  _initSeedField() {
    let seedField = document.getElementById("seedField");
    seedField.value = Sketch.defaultSettings.seed;
    seedField.oninput = ({ target: { value } }) => (this._sketch.seed = value);
  }

  _initAngleSelect() {
    let angleSelect = document.getElementById("angleDeltaField");
    angleSelect.value = "PI/4";
    angleSelect.onchange = ({ target: { value } }) =>
      (this._sketch.angleDelta = Sketch.availableAngleDeltas[value]);
  }

  _initSegmentCountSlider() {
    let slider = document.getElementById("initialSegmentCountField");
    let initCountDisplaySpan = document.getElementById("initialSegmentCount");
    let defaultValue = Sketch.defaultSettings.initialSegmentCount;
    initCountDisplaySpan.innerText = `(${defaultValue})`;
    slider.value = defaultValue;
    slider.onchange = ({ target: { value } }) => {
      initCountDisplaySpan.innerText = `(${value})`;
      this._sketch.initialSegmentCount = value;
    };
  }

  _initGaussianFields() {
    let checkbox = document.getElementById("useGaussianField");
    let slider = document.getElementById("standardDeviationFactorField");

    checkbox.checked = Sketch.defaultSettings.useGaussian;
    checkbox.onchange = ({ target: { checked } }) => {
      this._sketch.useGaussian = checked;
      slider.disabled = !slider.disabled;
    };

    let stdDevDisplaySpan = document.getElementById("standardDeviationFactor");
    let defaultValue = Sketch.defaultSettings.standardDeviationFactor;
    slider.disabled = !Sketch.defaultSettings.useGaussian;
    slider.value = defaultValue;
    stdDevDisplaySpan.innerText = `(${defaultValue})`;

    slider.onchange = ({ target: { value } }) => {
      stdDevDisplaySpan.innerText = `(${value})`;
      this._sketch.standardDeviationFactor = value;
    };
  }
}

window.Sketch = Sketch;
window.App = App;
