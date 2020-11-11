// simple neural network regression with mouse position

// labels (feel free to add more)
let labels = [
  "red",
  "green",
  "blue"
];

// examples mouse position
let examples = [];


// custom neural network
let brain; // neural network is the brain
const optionsNeuralNetwork = {
  inputs: 2, // x, y position mouse
  outputs: labels.length, // number of labels declared
  debug: true, // shows visualization during training
  learningReate: 0.2, // try different values here > goal: as little loss as possible at the end
  task: 'regression'
}

const optionsTraining = {
  batchSize: 16, // try different values here > goal: as little loss as possible at the end
  epochs: 70 // try different values here > goal: as little loss as possible at the end
}

let trainingFinished = false;
let inputData = []; // set in draw()
let predictions = [];

// setup
function setup() {

  // canvas
  const canvas = createCanvas(640, 480);
  canvas.parent('canvas');

  // generate gui
  generateGui(labels);

  // init brain
  brain = ml5.neuralNetwork(optionsNeuralNetwork);

}

// draw
function draw() {

  // clear background
  background(0);

  // current input data (= mouseX, mouseY)
  inputData = [mouseX, mouseY];

  // visualization already added examples
  for (let i = 0; i < examples.length; i++) {
    let example = examples[i];
    noStroke();
    fill(example.red, example.green, example.blue);
    ellipseMode(CENTER);
    ellipse(example.x, example.y, 10, 10);
  }

  // visualization predictions
  if (predictions.length > 0) {
    fill(predictions[0].value, predictions[1].value, predictions[2].value);
    rect(0, 0, 64, 64);
  }

  // update sider values
  for (let i = 0; i < labels.length; i++) {
    select('#sliderValue_' + labels[i]).html(select('#slider_' + labels[i]).elt.value);
  }

}

// set active class
function setActiveClass(label) {
  activeLabel = label;
}

// mouse pressed
function mousePressed() {
  // check if inside canvas
  if (mouseX >= 0 && mouseX <= width) {
    if (mouseY >= 0 && mouseY <= height) {
      // add data to neural network
      //addData(activeLabel);
      // add position to mouse position array (for visualization)
      let example = {
        x: inputData[0],
        y: inputData[1],
        red: int(select('#slider_red').elt.value),
        green: int(select('#slider_green').elt.value),
        blue: int(select('#slider_blue').elt.value)
      }
      examples.push(example);

      // add data (input & output)
      outputData = [example.red, example.green, example.blue];
      addData(inputData, outputData);
    }
  }
}

////////////////////////////////
// Neural Network STARTS HERE //
////////////////////////////////

// add current data to neural network
function addData(input, output) {
  brain.addData(input, output);
}

// train model neural network
function trainModel() {
  // ml5 will normalize data to a range between 0 and 1 for you.
  brain.normalizeData();
  // Train the model
  // Epochs: one cycle through all the training data
  brain.train(optionsTraining, finishedTraining);
}

// when model is trained
function finishedTraining() {
  // classify
  console.log("finished");
  // training state
  trainingFinished = true;
}

// predict the current mouse position
function predict() {
  // just if not training in progress
  if (trainingFinished == true) {
    // classification
    brain.predict(inputData, gotResults);
  }
}

// Show the results
function gotResults(err, results) {

  // Display any error
  if (err) {
    console.error(err);
  }

  // predictions
  predictions = results;

  // classify again
  predict();

}

// load data
function loadCustomData() {
  brain.loadData(customDataFile, customDataLoaded);
}

/////////////////
// generate gui //
//////////////////
function generateGui(lc) {

  // main gui
  const gui_main = createDiv().parent('gui');

  // debug
  const text_help = createDiv().parent(gui_main);
  text_help.id("text-help");
  text_help.html('adjust color sliders and click canvas to add input data... train model and predict current input data');

  // add sliders
  for (let i = 0; i < lc.length; i++) {
    // container
    const gui_class = createDiv().parent('gui');

    // label
    const label = createDiv().parent(gui_class);
    label.class("label");
    label.html(lc[i]);

    // slider
    const slider = createSlider(0, 255, 125).parent(gui_class);
    slider.class("slider");
    slider.id("slider_" + lc[i]);

    // value slider
    const value_slider = createSpan('0').parent(gui_class);
    value_slider.class("text-gui");
    value_slider.id("sliderValue_" + lc[i]);

  }

  // train
  const trainButton = createButton("Train Model").parent(gui_main);
  trainButton.class("button highlight-button");
  trainButton.mousePressed(function () {
    trainModel();
  });

  // predict
  const predictButton = createButton("Predict").parent(gui_main);
  predictButton.class("button");
  predictButton.mousePressed(function () {
    predict();
  });

}