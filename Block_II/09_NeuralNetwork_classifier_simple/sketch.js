// simple neural network classification with mouse position

// labels (feel free to add more)
let labels = [
  "A",
  "B",
  "C"
];
// set first label as active
let activeLabel = labels[0];

// examples mouse position
let examples_mousePosition = [];

// custom neural network
let brain; // neural network is the brain
const optionsNeuralNetwork = {
  inputs: 2, // x, y position mouse
  outputs: labels.length, // number of labels declared
  debug: true, // shows visualization during training
  learningReate: 0.2, // try different values here > goal: as little loss as possible at the end
  task: 'classification'
}

const optionsTraining = {
  batchSize: 10,
  epochs: 100 // try different values here > goal: as little loss as possible at the end
}

let trainingFinished = false;
let inputData = []; // set in draw()
let confidences = [];
let mostPredictedClass = "";

// setup
function setup() {

  // canvas
  const canvas = createCanvas(640, 480);
  canvas.parent('canvas');

  // generate gui
  generateGui(labels);

  // init brain
  brain = ml5.neuralNetwork(optionsNeuralNetwork);

  // init 2D array examples mouse position (just for visualization)
  for (let i = 0; i < labels.length; i++) {
    examples_mousePosition[i] = [];
  }

}

// draw
function draw() {

  // clear background
  background(0);

  // current input data (= mouseX, mouseY)
  inputData = [mouseX, mouseY];

  // visualization already added examples mouse position
  textAlign(CENTER, CENTER);
  textSize(16);
  noStroke();
  fill(255, 255, 255);
  for (let i = 0; i < examples_mousePosition.length; i++) {
    for (let j = 0; j < examples_mousePosition[i].length; j++) {
      text(labels[i], examples_mousePosition[i][j][0], examples_mousePosition[i][j][1]);
    }
  }


  // show confidences of classifcation
  if (confidences.length > 0) {

    // loop through labels
    for (let i = 0; i < labels.length; i++) {
      const x = 20;
      const y = i * 24 + 20;
      noStroke();
      fill(0, 255, 0);
      textAlign(LEFT, TOP);
      textSize(16);
      text(labels[i], x, y);
      // just if there is a value
      if (confidences[i] != null) {
        text(confidences[i].toFixed(3), x + 24, y);
      }
    }

    // show class with highest value prediction
    textAlign(CENTER, CENTER);
    textSize(56);
    text(mostPredictedClass, width / 2, height / 2);

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
      addData(activeLabel);
      // add position to mouse position array (for visualization)
      for (let i = 0; i < labels.length; i++) {
        if (activeLabel == labels[i]) {
          examples_mousePosition[i].push(inputData);
        }
      }
    }
  }
}

////////////////////////////////
// Neural Network STARTS HERE //
////////////////////////////////

// add current data to neural network
function addData(label) {

  // Add an example (= input data) with a label to the classifier
  if (inputData.length > 0) {

    brain.addData(inputData, [label]);

  }

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
function classify() {
  // just if not training in progress
  if (trainingFinished == true) {
    // classification
    brain.classify(inputData, gotResults);
  }
}

// Show the results
function gotResults(err, results) {

  // Display any error
  if (err) {
    console.error(err);
  }

  // label with highest confidence (= first label in results)
  mostPredictedClass = results[0].label;

  // loop trough results
  // console.log(results);
  for (let i = 0; i < results.length; i++) {
    // loop trough labels
    for (let j = 0; j < labels.length; j++) {
      // check if same label
      if (results[i].label == labels[j]) {
        let confidence = results[i].confidence;
        confidences[j] = confidence;
      }
    }
  };

  // classify again
  classify();

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
  text_help.html('select class and click canvas to add input data... train model and classify current input data');

  // select active class
  const selectActiveClass = createSelect().parent(gui_main);

  for (let i = 0; i < lc.length; i++) {
    selectActiveClass.option(lc[i]);
  }
  selectActiveClass.selected(activeLabel);
  selectActiveClass.class("select");
  selectActiveClass.changed(function () {
    // setActiveClass
    setActiveClass(selectActiveClass.value());
  });

  // train
  const trainButton = createButton("Train Model").parent(gui_main);
  trainButton.class("button highlight-button");
  trainButton.mousePressed(function () {
    trainModel();
  });

  // classify
  const classifyButton = createButton("Classify").parent(gui_main);
  classifyButton.class("button");
  classifyButton.mousePressed(function () {
    classify();
  });

}